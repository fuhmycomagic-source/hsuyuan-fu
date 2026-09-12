// GMI 研究資料的主題分類。每筆資料依 primary_tag（其次 tags）對應到第一個符合的主題。
// 調整分類只需改這個檔案，重新建置即可。
export interface Topic {
	slug: string;
	zh: string;
	en: string;
	blurb: string;
	tags: string[]; // canonical tags（對應 Tag_Dictionary）
}

export const TOPICS: Topic[] = [
	{
		slug: 'cancer',
		zh: '癌症',
		en: 'Cancer',
		blurb: '肺癌、乳癌、頭頸癌等癌別，以及癌幹細胞、抗藥性、轉移與化療副作用（口腔黏膜炎）。',
		tags: [
			'lung cancer', 'breast cancer', 'head and neck cancer', 'bladder cancer', 'brain cancer',
			'liver cancer', 'colorectal cancer', 'melanoma', 'osteosarcoma', 'cancer stem cells',
			'oral mucositis', 'cancer', 'drug resistance', 'metastasis',
		],
	},
	{
		slug: 'infection',
		zh: '感染與抗病毒',
		en: 'Infection & antiviral',
		blurb: '冠狀病毒（SARS-CoV-2）、EBV、HSV-1 等病毒感染，以及感染相關免疫反應。',
		tags: ['coronavirus disease', 'antiviral'],
	},
	{
		slug: 'neuro',
		zh: '神經',
		en: 'Neuro',
		blurb: '神經突生長、脊髓損傷、創傷性腦損傷與神經發炎。',
		tags: ['neural regeneration', 'spinal cord injury', 'traumatic brain injury'],
	},
	{
		slug: 'muscle',
		zh: '肌肉與代謝',
		en: 'Muscle & metabolism',
		blurb: '肌母細胞分化、肌少症、粒線體恆定與脂質代謝。',
		tags: ['myoblast differentiation'],
	},
	{
		slug: 'environment',
		zh: '環境壓力與抗氧化',
		en: 'Environmental stress & antioxidant',
		blurb: 'PM2.5 細懸浮微粒暴露、氧化壓力。',
		tags: ['fine particulate matter', 'antioxidant'],
	},
	{
		slug: 'repair',
		zh: '組織修復',
		en: 'Tissue repair',
		blurb: '慢性傷口癒合、抗纖維化、牙周炎、幹細胞增殖。',
		tags: ['wound healing', 'anti-fibrosis', 'periodontitis', 'stem cell proliferation'],
	},
	{
		slug: 'immune',
		zh: '免疫調節與抗發炎',
		en: 'Immunomodulation & inflammation',
		blurb: '免疫調節、抗發炎，以及未歸入特定疾病的免疫相關研究。',
		tags: ['immunomodulation', 'anti-inflammatory'],
	},
	{
		slug: 'platform',
		zh: '平台技術與安全性',
		en: 'Platform & safety',
		blurb: 'GMI 序列與選殖、單株抗體、外泌體組成物、安全性評估。',
		tags: ['GMI', 'monoclonal antibody', 'exosome', 'safety', 'autophagy'],
	},
];

// 機轉標籤：預設收合，僅在展開文獻卡或篩選時顯示
export const MECHANISM_TAG_TYPES = new Set(['Mechanism']);

// 泛用標籤（免疫調節、抗發炎等）只在沒有更具體的主題時才使用
const GENERIC = new Set(['GMI', 'immunomodulation', 'anti-inflammatory', 'antioxidant', 'cancer', 'drug resistance', 'metastasis']);

export function topicFor(primaryTag: string, tags: string[]): Topic {
	if (!GENERIC.has(primaryTag)) {
		const hit = TOPICS.find((t) => t.tags.includes(primaryTag));
		if (hit) return hit;
	}
	for (const t of TOPICS) if (tags.some((x) => !GENERIC.has(x) && t.tags.includes(x))) return t;
	for (const t of TOPICS) if (tags.some((x) => t.tags.includes(x))) return t;
	return TOPICS[TOPICS.length - 1];
}
