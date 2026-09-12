// 用法：npm run refs            → 抓取所有文章 references 與 gmi.json 裡尚未快取的 DOI 書目
//       npm run refs -- --force → 全部重抓
// 資料來源：Crossref（標題、作者、期刊、卷期頁）＋ NCBI ID converter（PMID / PMCID）
// 結果寫入 src/data/refs-cache.json（要 commit），建置時由 src/lib/refs.ts 讀取。
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { load as yamlLoad } from 'js-yaml';

const CACHE_FILE = 'src/data/refs-cache.json';
const UA = 'hsuyuan-fu-site/1.0 (https://hsuyuan-fu.pages.dev; mailto:fuhsuyuan@gmail.com)';
const force = process.argv.includes('--force');

const normDoi = (d) =>
	String(d)
		.trim()
		.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
		.replace(/^doi:\s*/i, '')
		.toLowerCase();
const stripTags = (s) => String(s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

// 1. 收集 DOI
const dois = new Set();
for (const f of readdirSync('src/content/articles')) {
	if (!f.endsWith('.md')) continue;
	const src = readFileSync(`src/content/articles/${f}`, 'utf8');
	const m = src.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) continue;
	const fm = yamlLoad(m[1]) ?? {};
	for (const r of fm.references ?? []) if (r?.doi) dois.add(normDoi(r.doi));
}
const gmi = JSON.parse(readFileSync('src/data/gmi.json', 'utf8'));
for (const j of gmi.journals) if (j.doi) dois.add(normDoi(j.doi));

// 2. 讀快取
let cache = {};
try {
	cache = JSON.parse(readFileSync(CACHE_FILE, 'utf8'));
} catch {}

const todo = [...dois].filter((d) => force || !cache[d]);
console.log(`DOI 共 ${dois.size} 筆，需抓取 ${todo.length} 筆`);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function crossref(doi) {
	const res = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { 'User-Agent': UA } });
	if (!res.ok) throw new Error(`Crossref ${res.status}`);
	const m = (await res.json()).message;
	const dateParts = (m.issued ?? m['published-print'] ?? m['published-online'] ?? m.created)?.['date-parts']?.[0];
	return {
		title: stripTags(m.title?.[0]),
		authors: (m.author ?? []).map((a) => (a.family ? `${a.family}, ${a.given ?? ''}`.replace(/, $/, '') : a.name ?? '')).filter(Boolean),
		journal: m['container-title']?.[0] ?? undefined,
		year: dateParts?.[0],
		volume: m.volume ?? undefined,
		issue: m.issue ?? undefined,
		pages: m.page ?? (m['article-number'] ? String(m['article-number']) : undefined),
		type: m.type,
	};
}

async function ncbi(doi) {
	const url = `https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=${encodeURIComponent(doi)}&idtype=doi&format=json&tool=hsuyuan-fu&email=fuhsuyuan@gmail.com`;
	const res = await fetch(url, { headers: { 'User-Agent': UA } });
	if (!res.ok) return {};
	const rec = (await res.json()).records?.[0] ?? {};
	return { pmid: rec.pmid, pmcid: rec.pmcid };
}

let ok = 0;
for (const doi of todo) {
	try {
		const c = await crossref(doi);
		await sleep(300);
		const n = await ncbi(doi).catch(() => ({}));
		cache[doi] = { ...c, ...n, fetchedAt: new Date().toISOString().slice(0, 10) };
		ok++;
		console.log(`✓ ${doi} — ${c.title.slice(0, 70)}${n.pmid ? ` (PMID ${n.pmid})` : ''}`);
	} catch (e) {
		console.warn(`✗ ${doi}: ${e.message}`);
	}
	await sleep(300);
}

const sorted = Object.fromEntries(Object.entries(cache).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(CACHE_FILE, JSON.stringify(sorted, null, '\t') + '\n');
console.log(`完成：${ok}/${todo.length} 筆，快取共 ${Object.keys(sorted).length} 筆 → ${CACHE_FILE}`);
