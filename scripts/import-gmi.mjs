// 用法：npm run import-gmi -- "D:\Download\GMIBIO_Knowledge_Master.xlsx"
// 讀取 GMIBIO_Knowledge_Master.xlsx（LINE bot 的主檔），輸出網站用的 src/data/gmi.json。
// 規則：
//   - 只收 public_status=Public、record_status=Active、line_visibility=Show 的紀錄
//   - 專利只收 Granted，並依 family_id 合併成專利家族（無 family_id 者自成一族）
//   - 文獻補上 Legacy_Journals 的作者、DOI、PMID
//   - 不輸出 notes_internal 等內部欄位
import { readFileSync, writeFileSync } from 'node:fs';
import xlsx from 'xlsx';

const src = process.argv[2];
if (!src) {
	console.error('請提供 xlsx 路徑：npm run import-gmi -- "D:\Download\GMIBIO_Knowledge_Master.xlsx"');
	process.exit(1);
}
const wb = xlsx.read(readFileSync(src), { cellDates: true });
const sheet = (name) => xlsx.utils.sheet_to_json(wb.Sheets[name], { defval: null });

const s = (v) => (v == null ? '' : String(v).trim());
const list = (v) => s(v).split(';').map((x) => x.trim()).filter(Boolean);
const year = (v) => {
	const n = parseInt(s(v), 10);
	return Number.isFinite(n) ? n : null;
};
const isPublic = (r) =>
	s(r.public_status) === 'Public' && s(r.record_status) === 'Active' && s(r.line_visibility) === 'Show';

// ---- 標籤字典 ----
const tags = sheet('Tag_Dictionary')
	.filter((r) => s(r.tag_id) && s(r.active) === 'Yes')
	.map((r) => ({
		id: s(r.tag_id),
		type: s(r.tag_type),
		tag: s(r.canonical_tag),
		zh: s(r.display_zh),
		aliases: list(r.aliases),
	}));

// ---- 文獻 ----
const legacy = new Map(sheet('Legacy_Journals').map((r) => [s(r.Key), r]));
const docs = sheet('Documents');
const journals = docs
	.filter((r) => s(r.doc_type) === 'Journal' && isPublic(r))
	.map((r) => {
		const L = legacy.get(s(r.source_key)) ?? {};
		const authors = s(L.Author).split(';').map((a) => a.trim()).filter(Boolean);
		return {
			id: s(r.record_id),
			title: s(r.title),
			titleShort: s(r.title_short),
			year: year(r.year),
			journal: s(r.journal_name) || s(L['Publication Title']),
			authors,
			doi: s(r.doi) || s(L.DOI),
			pmid: s(r.pmid) || s(L.Extra).match(/pubmed\/(\d+)/)?.[1] || s(L['Link Attachments']).match(/pubmed\/(\d+)/)?.[1] || '',
			primaryTag: s(r.primary_tag),
			tags: list(r.tags),
			aliases: list(r.aliases),
			evidence: s(r.evidence_type),
			model: s(r.model_population),
			summaryZh: s(r.summary_zh),
			keyFinding: s(r.key_finding_short),
			sourceUrl: s(r.source_url),
			gmibioUrl: s(r.gmibio_url),
			newsUrl: s(r.news_url),
		};
	})
	.sort((a, b) => (b.year ?? 0) - (a.year ?? 0) || a.id.localeCompare(b.id));

// ---- 專利家族 ----
const families = new Map();
for (const r of docs.filter((p) => s(p.doc_type) === 'Patent' && isPublic(p) && s(p.patent_status) === 'Granted')) {
	const fid = s(r.family_id) || s(r.record_id);
	if (!families.has(fid)) {
		families.set(fid, {
			id: fid,
			titleZh: s(r.title_short),
			titleEn: s(r.family_title),
			summaryZh: s(r.summary_zh),
			topicGroup: s(r.topic_group),
			primaryTag: s(r.primary_tag),
			tags: list(r.tags),
			members: [],
		});
	}
	const f = families.get(fid);
	// 家族代表（family_display=Yes）優先提供英文標題
	if (s(r.family_display) === 'Yes' && !f.titleEn) f.titleEn = s(r.title);
	f.members.push({
		id: s(r.record_id),
		jurisdiction: s(r.jurisdiction),
		patentNo: s(r.patent_no),
		year: year(r.year),
		title: s(r.title),
		sourceUrl: s(r.source_url),
		gmibioUrl: s(r.gmibio_url),
		newsUrl: s(r.news_url),
	});
}
const order = { TW: 0, US: 1, JP: 2, EP: 3, CN: 4 };
const patents = [...families.values()]
	.map((f) => {
		f.members.sort((a, b) => (order[a.jurisdiction] ?? 9) - (order[b.jurisdiction] ?? 9));
		const ys = f.members.map((m) => m.year).filter(Boolean);
		f.yearFrom = ys.length ? Math.min(...ys) : null;
		f.yearTo = ys.length ? Math.max(...ys) : null;
		if (!f.titleEn) f.titleEn = f.members.find((m) => /^[A-Za-z]/.test(m.title))?.title ?? '';
		return f;
	})
	.sort((a, b) => (b.yearTo ?? 0) - (a.yearTo ?? 0) || a.id.localeCompare(b.id));

const out = {
	generatedAt: new Date().toISOString().slice(0, 10),
	source: 'GMIBIO_Knowledge_Master.xlsx',
	counts: { journals: journals.length, patentFamilies: patents.length, patents: patents.reduce((n, f) => n + f.members.length, 0) },
	tags,
	journals,
	patents,
};
writeFileSync('src/data/gmi.json', JSON.stringify(out, null, '\t') + '\n');
console.log(`已輸出 src/data/gmi.json：文獻 ${out.counts.journals} 篇、專利家族 ${out.counts.patentFamilies} 族（${out.counts.patents} 件）、標籤 ${tags.length} 個`);
