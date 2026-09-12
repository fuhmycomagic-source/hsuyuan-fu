// 網站的兩個核心 entity：人（傅煦媛）與物（GMI）。
// 這裡的資料只用於 JSON-LD 結構化資料與 llms.txt，讓搜尋引擎與 AI 能把
// 站內的名詞對應到外部知識庫裡「明確的那一個」。改這裡即全站生效。
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_EN, SITE_TAGLINE } from '../consts';

export const SITE_URL = 'https://hsuyuan-fu.pages.dev';

/** 固定的節點 ID（@id）。其他頁面用這些 ID 互相指涉，機器才知道是同一個東西。 */
export const IDS = {
	website: `${SITE_URL}/#website`,
	person: `${SITE_URL}/about/#person`,
	gmi: `${SITE_URL}/gmi/#gmi`,
} as const;

/** 傅煦媛（Person entity） */
export const PERSON = {
	name: SITE_NAME,
	nameEn: SITE_NAME_EN,
	alternateName: ['Hsu-Yuan Fu', 'Fu Hsu-Yuan', 'H.-Y. Fu', '傅煦媛'],
	url: `${SITE_URL}/about/`,
	image: `${SITE_URL}/favicon-512.png`,
	jobTitle: { zh: '科學長', en: 'Chief Scientific Officer' },
	description: {
		zh: '生化科技博士。從事 GMI（小孢子靈芝免疫調節蛋白）研發十餘年，把它從學術研究帶到食品、化粧品與藥品法規登錄。',
		en: 'PhD in biochemical science and technology. Over a decade in GMI (Ganoderma microsporum immunomodulatory protein) R&D, from bench research to food, cosmetic and drug-substance registrations.',
	},
	// 身分連結：機器確認「這個傅煦媛 = 那個發表論文的 Hsu-Yuan Fu」的依據
	sameAs: [
		'https://orcid.org/0000-0002-5327-2208',
		'https://scholar.google.com/citations?user=xEaKe3sAAAAJ',
		'https://www.linkedin.com/in/fuhsuyuan/',
		'https://github.com/fuhmycomagic-source',
	],
	orcid: 'https://orcid.org/0000-0002-5327-2208',
	alumniOf: [
		{ name: 'National Taiwan University', nameZh: '國立臺灣大學', url: 'https://www.ntu.edu.tw/', sameAs: 'https://www.wikidata.org/wiki/Q32746' },
		{ name: 'University of Minnesota', nameZh: '美國明尼蘇達大學', url: 'https://twin-cities.umn.edu/', sameAs: 'https://www.wikidata.org/wiki/Q238101' },
	],
	credentials: [
		{ name: 'Ph.D., Biochemical Science and Technology', nameZh: '生化科技博士', category: 'degree', issuer: 'National Taiwan University', year: 2013 },
		{ name: 'Certified Toxicologist, Taiwan', nameZh: '臺灣毒理學家', category: 'certification', year: 2022 },
		{ name: 'Pharmaceutical Quality Management Specialist', nameZh: '中西藥品質管理師', category: 'certification', year: 2023 },
		{ name: 'Intermediate Engineer, Health Food Development & QC', nameZh: '健康食品開發與品管中級工程師', category: 'certification', year: 2023 },
		{ name: 'Health Manager, Level I', nameZh: '健康管理師（初級）', category: 'certification', year: 2023 },
		{ name: 'Food Quality Assurance Engineer', nameZh: '食品品保初級工程師', category: 'certification', year: 2019 },
		{ name: 'Health Supplement Engineer, Level I', nameZh: '保健食品初級工程師', category: 'certification', year: 2017 },
	],
	knowsAbout: [
		'Ganoderma microsporum immunomodulatory protein (GMI)',
		'fungal immunomodulatory proteins',
		'recombinant protein production (Pichia pastoris)',
		'immunomodulation',
		'sarcopenia',
		'regulatory affairs (food, cosmetic and drug ingredients)',
		'toxicology',
		'cell therapy and regenerative medicine',
	],
	knowsLanguage: ['zh-Hant-TW', 'en'],
};

/** GMI（蛋白質 entity）。/gmi/ 是它在本站的主頁。 */
export const GMI_ENTITY = {
	name: 'Ganoderma microsporum immunomodulatory protein',
	nameZh: '小孢子靈芝免疫調節蛋白',
	abbreviation: 'GMI',
	alternateName: [
		'GMI',
		'小孢子靈芝免疫調節蛋白',
		'小孢子靈芝免疫調節蛋白質',
		'Ganoderma microsporum immunomodulatory protein',
		'FIP-gmi',
		'Fungal immunomodulatory protein from Ganoderma microsporum',
		'Pichia r-Ganoderma microsporum polypeptide-1 ferment filtrate extract',
	],
	description: {
		zh: '從小孢子靈芝（Ganoderma microsporum）發現的真菌免疫調節蛋白（FIP），約 12.4 kDa，以 Pichia pastoris 重組表現。研究主題涵蓋癌症、感染症、環境壓力因子、代謝與神經。',
		en: 'A fungal immunomodulatory protein (FIP) from Ganoderma microsporum, ~12.4 kDa, produced recombinantly in Pichia pastoris. Studied in cancer, infection, environmental stressors, metabolism and neuroscience.',
	},
	url: `${SITE_URL}/gmi/`,
	sourceOrganism: { name: 'Ganoderma microsporum', wikidata: 'https://www.wikidata.org/wiki/Q10502761' },
	// 外部識別碼：GMI entity 的 sameAs
	sameAs: [
		'https://www.wikidata.org/wiki/Q110625259',
		'https://zh.wikipedia.org/wiki/小孢子靈芝免疫調節蛋白質',
		'https://en.wikipedia.org/wiki/Ganoderma_microsporum_immunomodulatory_protein',
		'https://ja.wikipedia.org/wiki/Ganoderma_microsporum免疫調節タンパク質',
		'https://www.uniprot.org/uniprotkb/E7FH75',
		'https://www.rcsb.org/structure/3KCW',
		'https://www.ncbi.nlm.nih.gov/protein/AGU04723.1',
	],
	identifiers: [
		{ name: 'Wikidata', value: 'Q110625259', url: 'https://www.wikidata.org/wiki/Q110625259' },
		{ name: 'UniProt', value: 'E7FH75', url: 'https://www.uniprot.org/uniprotkb/E7FH75' },
		{ name: 'PDB', value: '3KCW', url: 'https://www.rcsb.org/structure/3KCW' },
		{ name: 'GenBank', value: 'AGU04723.1', url: 'https://www.ncbi.nlm.nih.gov/protein/AGU04723.1' },
		{ name: 'INCI', value: 'Pichia r-Ganoderma microsporum polypeptide-1 ferment filtrate extract (INCI monograph ID 35581)' },
	],
	molecularWeightKDa: 12.4,
};

export const SITE_ENTITY = {
	name: SITE_NAME,
	alternateName: `${SITE_NAME} ${SITE_NAME_EN}`,
	tagline: SITE_TAGLINE,
	description: SITE_DESCRIPTION,
	url: `${SITE_URL}/`,
	inLanguage: 'zh-Hant-TW',
};
