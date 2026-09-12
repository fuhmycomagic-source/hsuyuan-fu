// 參考文獻解析：把文章 frontmatter 的 references（只需 key + doi / gmi / url）
// 變成可顯示、可輸出 JSON-LD 的完整書目。
// 資料來源優先順序：手動欄位 > refs-cache.json（Crossref／PubMed，由 npm run refs 抓）> gmi.json
import cache from '../data/refs-cache.json';
import { GMI, journalTopic, patentTopic } from './gmi';

export interface RefInput {
	key: string;
	doi?: string;
	gmi?: string; // gmi.json 的 id：JRN-xxxx（文獻）、PF-GMI-xxx（專利家族）、PAT-xxxx（單一專利）
	url?: string;
	title?: string;
	authors?: string[];
	year?: number;
	journal?: string;
	publisher?: string;
	note?: string; // 顯示在該筆後面的補充（例如「體組成子研究」）
}

export interface ResolvedRef {
	key: string;
	kind: 'article' | 'patent' | 'web';
	id: string; // DOI、專利號或 url
	title: string;
	authors: string[];
	year?: number;
	journal?: string;
	volume?: string;
	issue?: string;
	pages?: string;
	doi?: string;
	pmid?: string;
	pmcid?: string;
	url?: string;
	publisher?: string;
	gmi: boolean;
	gmiHref?: string; // 站內 GMI 資料頁錨點
	note?: string;
	incomplete?: boolean; // 尚未抓到書目資料
}

type CacheEntry = {
	title?: string;
	authors?: string[];
	journal?: string;
	year?: number;
	volume?: string;
	issue?: string;
	pages?: string;
	pmid?: string;
	pmcid?: string;
};
const CACHE = cache as Record<string, CacheEntry>;

export const normDoi = (d: string) =>
	d
		.trim()
		.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
		.replace(/^doi:\s*/i, '')
		.toLowerCase();

function fromGmi(id: string): Partial<ResolvedRef> | undefined {
	const j = GMI.journals.find((x) => x.id === id);
	if (j) {
		return {
			kind: 'article',
			id: j.doi || j.id,
			title: j.title,
			authors: j.authors,
			year: j.year,
			journal: j.journal,
			doi: j.doi ? normDoi(j.doi) : undefined,
			pmid: j.pmid || undefined,
			url: j.sourceUrl,
			gmi: true,
			gmiHref: `/gmi/${journalTopic(j).slug}/#${j.id}`,
		};
	}
	const fam = GMI.patents.find((p) => p.id === id || p.members.some((m) => m.id === id));
	if (fam) {
		const m = fam.members.find((x) => x.id === id) ?? fam.members[0];
		return {
			kind: 'patent',
			id: m.patentNo,
			title: m.title || fam.titleZh,
			authors: [],
			year: m.year ?? fam.yearTo,
			url: m.sourceUrl,
			gmi: true,
			gmiHref: `/gmi/${patentTopic(fam).slug}/#${fam.id}`,
		};
	}
	return undefined;
}

export function resolveRef(r: RefInput): ResolvedRef {
	const base: ResolvedRef = {
		key: r.key,
		kind: r.doi ? 'article' : 'web',
		id: r.doi ? normDoi(r.doi) : (r.url ?? r.key),
		title: r.title ?? '',
		authors: r.authors ?? [],
		year: r.year,
		journal: r.journal,
		publisher: r.publisher,
		url: r.url,
		gmi: false,
		note: r.note,
	};
	let out: ResolvedRef = base;
	if (r.gmi) {
		const g = fromGmi(r.gmi);
		if (!g) throw new Error(`references[${r.key}]：gmi.json 找不到 id「${r.gmi}」`);
		out = { ...base, ...g } as ResolvedRef;
	}
	const doi = out.doi ?? (r.doi ? normDoi(r.doi) : undefined);
	if (doi) {
		out.doi = doi;
		out.kind = 'article';
		out.url = out.url ?? `https://doi.org/${doi}`;
		const c = CACHE[doi];
		if (c) {
			out.title = out.title || c.title || '';
			out.authors = out.authors.length ? out.authors : (c.authors ?? []);
			out.journal = out.journal ?? c.journal;
			out.year = out.year ?? c.year;
			out.volume = c.volume;
			out.issue = c.issue;
			out.pages = c.pages;
			out.pmid = out.pmid ?? c.pmid;
			out.pmcid = c.pmcid;
		}
	}
	// 手動欄位永遠優先
	if (r.title) out.title = r.title;
	if (r.authors) out.authors = r.authors;
	if (r.year) out.year = r.year;
	if (r.journal) out.journal = r.journal;
	if (!out.title) {
		out.incomplete = true;
		out.title = out.doi ? `doi:${out.doi}` : out.id;
	}
	return out;
}

/** 依內文引用順序排列；沒被內文引用的排在後面（仍列出） */
export function orderRefs(inputs: RefInput[], citeOrder: string[] = []): ResolvedRef[] {
	const byKey = new Map(inputs.map((r) => [r.key, r]));
	const cited = citeOrder.filter((k) => byKey.has(k)).map((k) => byKey.get(k)!);
	const rest = inputs.filter((r) => !citeOrder.includes(r.key));
	return [...cited, ...rest].map(resolveRef);
}

/** Vancouver 式作者列表：最多 3 位，之後 et al. */
export function fmtAuthors(authors: string[]): string {
	if (!authors.length) return '';
	const names = authors.slice(0, 3).map((a) => {
		// "Family, Given" → "Family G"
		const [family, given] = a.split(',').map((s) => s.trim());
		if (!given) return a;
		const initials = given
			.split(/[\s-]+/)
			.map((g) => g[0]?.toUpperCase() ?? '')
			.join('');
		return `${family} ${initials}`;
	});
	return names.join(', ') + (authors.length > 3 ? ', et al.' : '');
}
