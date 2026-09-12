// llms.txt：給 AI 爬蟲的網站說明（https://llmstxt.org）。建置時自動列出所有文章與 GMI 主題頁。
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { DISCLOSURE, SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN } from '../consts';
import { GMI_ENTITY, PERSON, SITE_URL } from '../data/entities';
import { fmt, lastUpdated, sortByUpdated } from '../lib/dates';
import { byTopic } from '../lib/gmi';

export async function GET(_ctx: APIContext) {
	const articles = sortByUpdated((await getCollection('articles')).filter((a) => !a.data.draft));
	const topics = byTopic();
	const lines = [
		`# ${SITE_NAME} ${SITE_NAME_EN}`,
		'',
		`> ${SITE_DESCRIPTION}`,
		'',
		`作者：${PERSON.name}（${PERSON.nameEn}），${PERSON.description.zh}`,
		`ORCID: ${PERSON.orcid}`,
		`主題實體：${GMI_ENTITY.name}（${GMI_ENTITY.nameZh}，${GMI_ENTITY.abbreviation}）— Wikidata Q110625259、UniProt E7FH75、PDB 3KCW`,
		'',
		'每篇文章與每筆資料都標示證據等級：細胞實驗 / 動物實驗 / 人體試驗 / 個案軼事 / 推測假說。',
		`利益揭露：${DISCLOSURE}`,
		'',
		'## 文章',
		'',
		...articles.map(
			(a) =>
				`- [${a.data.title}](${SITE_URL}/posts/${a.id}/): ${a.data.description}${a.data.evidence.length ? `（證據等級：${a.data.evidence.join('、')}）` : ''}（更新 ${fmt(lastUpdated(a))}）`,
		),
		'',
		'## GMI 研究資料（已公開文獻與已核准專利）',
		'',
		`- [總覽與篩選總表](${SITE_URL}/gmi/)`,
		...topics.map(
			(g) => `- [${g.topic.zh} / ${g.topic.en}](${SITE_URL}/gmi/${g.topic.slug}/): ${g.topic.blurb}（文獻 ${g.journals.length}、專利 ${g.patents.length}）`,
		),
		'',
		'## 其他',
		'',
		`- [關於我 / About](${SITE_URL}/about/): 學術與產業雙軌經歷、專業認證、專利與論文`,
		`- [RSS](${SITE_URL}/rss.xml)`,
		`- [Sitemap](${SITE_URL}/sitemap-index.xml)`,
		'',
	];
	return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
