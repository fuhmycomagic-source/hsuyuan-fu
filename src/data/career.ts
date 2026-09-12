// 「關於我」頁面的經歷資料。資料來源：2023 中文簡歷、2026 英文 CV。
// 只放公開可查的事實（已發表論文、已公告專利、公開登錄的法規案件）。

// 是否在時間軸上顯示現職公司名稱。先前決定署名不掛公司名，故預設關閉；
// 要公開時改成 true 即可。
export const SHOW_EMPLOYER = false;
const EMPLOYER = SHOW_EMPLOYER
	? { zh: '蘑法生物科技／蘑法生醫', en: 'MycoMagic Biotech / MycoMagic Biomedical' }
	: { zh: 'GMI 原料研發公司（臺北）', en: 'GMI ingredient developer, Taipei' };

export type Track = 'academic' | 'industry';

export interface TimelineEntry {
	track: Track;
	years: string; // 顯示用，例如 '2020 – 現在'
	yearsEn?: string;
	sortYear: number; // 排序用（起始年）
	org: { zh: string; en: string };
	role: { zh: string; en: string };
	summary: { zh: string; en: string };
	points?: { zh: string; en: string }[];
	gmi?: boolean; // 與 GMI 直接相關 → 時間軸上特別標示
}

export const TIMELINE: TimelineEntry[] = [
	{
		track: 'industry',
		years: '2023 – 現在',
		yearsEn: '2023 – present',
		sortYear: 2023.5,
		org: { zh: `${EMPLOYER.zh}｜再生醫學子公司`, en: `${EMPLOYER.en} — regenerative medicine subsidiary` },
		role: { zh: '科學長（兼任）', en: 'Chief Scientific Officer (concurrent)' },
		summary: {
			zh: '把 GMI 從食品與化粧品原料，往細胞治療與再生醫學推進：以「培養基添加物」的角色，改善間質基質細胞、免疫細胞與多能幹細胞衍生產品的擴增與品質。',
			en: 'Directing the translation of GMI from food/cosmetic ingredient into cell therapy and regenerative medicine — as a defined, animal-component-free culture-media supplement for MSC, immune-cell and PSC-derived products.',
		},
		points: [
			{
				zh: 'GMI 原料藥技術移轉至 CDMO：2024 年 4 月啟動，2025 年 4 月首批 GMP 批次放行（約 12 個月）',
				en: 'Tech transfer of GMI drug substance to a CDMO: kickoff Apr 2024, first GMP batch released Apr 2025 (~12 months).',
			},
			{
				zh: '撰寫並提交美國 FDA 藥物主檔案（DMF），2025 年 10 月獲受理；Pre-IND／IND 準備中',
				en: 'Authored and filed the U.S. FDA Drug Master File for GMI drug substance; acknowledged Oct 2025. Pre-IND / IND in preparation.',
			},
			{
				zh: '主持與臺灣細胞治療機構的共同開發案，評估 GMI 作為 MSC 擴增與免疫細胞製造的培養基添加物',
				en: 'PI of a co-development program with a Taiwan cell-therapy clinic evaluating GMI as a media supplement for MSC expansion and immune-cell manufacturing.',
			},
		],
		gmi: true,
	},
	{
		track: 'industry',
		years: '2016 – 現在',
		yearsEn: '2016 – present',
		sortYear: 2016,
		org: EMPLOYER,
		role: {
			zh: '研發經理（2016）→ 研發資深經理（2017）→ 科學長（2020 –）',
			en: 'R&D Manager (2016) → R&D Senior Manager (2017) → Chief Scientific Officer (2020 –)',
		},
		summary: {
			zh: '建立並營運 Pichia 分泌型重組蛋白的 GMP／ISO 先導工廠；交出全球第一件以重組蛋白作為食品原料的上市許可（美國與臺灣）。',
			en: 'Built and operate a GMP/ISO pilot plant for secreted recombinant proteins in Pichia; delivered the world\'s first recombinant protein approved as a food ingredient (U.S. and Taiwan).',
		},
		points: [
			{
				zh: '負責從候選物篩選、轉譯研究、GLP 非臨床毒理、人體試驗到法規申請的完整開發鏈；管理 CDMO／CRO、技轉與授權',
				en: 'Own the full chain from candidate selection through translational research, GLP toxicology, human studies and regulatory filing; manage CDMO/CRO partners, tech transfer and licensing.',
			},
			{
				zh: '完成 10+ 件機能性原料委託研究或產業化案：2 件人體臨床、7 件 GLP 動物毒理、3 件上市產品',
				en: '10+ commissioned or industrialization programs for functional ingredients: 2 human clinical studies, 7 GLP animal toxicology studies, 3 marketed products.',
			},
			{
				zh: '研發團隊由 5 人擴編至 12 人，四年零離職；培養先導工廠負責人、實驗室主管、QC 與 QA 主管',
				en: 'Grew R&D from 5 to 12 with no turnover over four years; developed the pilot-plant lead, lab manager and heads of QC/QA.',
			},
			{
				zh: '經濟部生技新藥公司計畫共同主持人（2016–2017）、主持人（2018 –）；SBIR Phase II 計畫主持人（2017）',
				en: 'Co-PI (2016–17) then PI (2018–) on Ministry of Economic Affairs biotech programs; PI of an SBIR Phase II program (2017).',
			},
		],
		gmi: true,
	},
	{
		track: 'industry',
		years: '2015 – 2016',
		sortYear: 2015.5,
		org: { zh: '財團法人生物技術開發中心（DCB）生物製藥研究所', en: 'Development Center for Biotechnology (DCB), Institute of Biologics' },
		role: { zh: '研究員，生物工程組', en: 'Research Fellow, Bioengineering Group' },
		summary: {
			zh: '把明尼蘇達大學 CHO Consortium 的五種細胞株開發策略與 NGS 遺傳穩定性評估方法導入臺灣；建立從 DNA 到純化蛋白的一站式 CDMO 能力（團隊 13–15 人）。',
			en: 'Led transfer of five CHO cell-line development strategies and NGS-based genetic-stability methods from the University of Minnesota CHO Consortium; built one-stop CDMO capability from DNA to purified protein (team of 13–15).',
		},
	},
	{
		track: 'academic',
		years: '2014 – 2015',
		sortYear: 2014,
		org: { zh: '美國明尼蘇達大學 化學工程與材料科學系（胡維修教授實驗室）', en: 'University of Minnesota, Chemical Engineering & Materials Science (Prof. Wei-Shou Hu)' },
		role: { zh: '博士後研究員', en: 'Postdoctoral Associate' },
		summary: {
			zh: '建立全球第一批中國倉鼠胚胎纖維母細胞來源的誘導性多能幹細胞（iPSC）並完成特性分析（Stem Cell Research, 2017）；開發兩種 NGS 方法評估生產細胞株的遺傳與克隆穩定性。',
			en: 'Generated and characterized the first iPSC lines from Chinese hamster embryonic fibroblasts (Stem Cell Research, 2017); developed two NGS-based methods for genetic and clonal stability of production cell lines.',
		},
		points: [
			{
				zh: 'CHO Consortium 技術專案負責人：統籌約 20 位碩博士級人員，服務 6 家全球藥廠會員；參與中國倉鼠基因體計畫的生物資訊分析',
				en: 'Technical project lead for the CHO Consortium (~20 M.S./Ph.D. staff, six global biopharma members); bioinformatics support to the Chinese hamster genome project.',
			},
		],
	},
	{
		track: 'academic',
		years: '2013 – 2014',
		sortYear: 2013.5,
		org: { zh: '臺灣大學 慶齡工業研究中心', en: 'Yen Tjing Ling Industrial Research Institute, National Taiwan University' },
		role: { zh: '博士後研究員', en: 'Postdoctoral Associate' },
		summary: {
			zh: '將博士論文的蛋白質量產平台產業化：發明新型膜蛋白表現載體並完成專利說明書（U.S. Patent 9,067,985 B2），完成一件技術移轉。',
			en: 'Industrialized the PhD protein-production platform: invented a membrane-protein expression vector (U.S. Patent 9,067,985 B2) and completed one technology transfer.',
		},
	},
	{
		track: 'academic',
		years: '2008 – 2013',
		sortYear: 2008,
		org: { zh: '臺灣大學 生化科技學系暨研究所', en: 'National Taiwan University, Biochemical Science and Technology' },
		role: { zh: '博士', en: 'Ph.D.' },
		summary: {
			zh: '研究嗜鹽古菌的多重視紫質（rhodopsin）系統與膜蛋白表現（Journal of Bacteriology 2010、Molecular Microbiology 2013）；2010 年獲國科會補助赴日本理化學研究所（RIKEN）進行膜蛋白表現與結晶技術交流。',
			en: 'Multi-rhodopsin systems and membrane-protein expression in halophilic archaea (J. Bacteriology 2010; Molecular Microbiology 2013); national grant for a technical exchange on membrane-protein expression and crystallography at RIKEN Harima, Japan (2010).',
		},
		points: [
			{
				zh: '臺灣生物物理學會年會口頭／壁報獎四次（2008、2011、2012、2013）；國際視網膜蛋白會議（ICRP）口頭與壁報發表（2010 加州、2012 蘇黎世）',
				en: 'Four oral/poster awards at the Taiwan Biophysics Conference (2008, 2011–13); presentations at the 14th and 15th International Conference on Retinal Proteins (2010, 2012).',
			},
		],
	},
	{
		track: 'academic',
		years: '2002 – 2008',
		sortYear: 2002,
		org: { zh: '臺灣大學', en: 'National Taiwan University' },
		role: {
			zh: '學士 生化科技學系（2002–2006）→ 碩士 微生物與生化學研究所（2006–2008）',
			en: 'B.S. Biochemical Science and Technology (2002–06) → M.S. Microbiology and Biochemistry (2006–08)',
		},
		summary: {
			zh: '2008 年獲選中華民國斐陶斐榮譽學會榮譽會員。',
			en: 'Honorary Member, Phi Tau Phi Scholastic Honor Society (2008).',
		},
	},
];

// GMI 從學術研發到產業化的里程碑（皆為公開登錄或已發表資料）
export interface Milestone {
	label: { zh: string; en: string };
	title: { zh: string; en: string };
	detail: { zh: string; en: string };
}

export const GMI_MILESTONES: Milestone[] = [
	{
		label: { zh: '食品', en: 'Food' },
		title: { zh: '全球第一件重組蛋白食品原料', en: 'World\'s first recombinant protein approved as a food ingredient' },
		detail: {
			zh: '美國 FDA 新膳食成分（NDI）通知；臺灣 TFDA 非傳統性食品原料核准。',
			en: 'U.S. FDA New Dietary Ingredient (NDI) notification; Taiwan FDA non-traditional food ingredient approval.',
		},
	},
	{
		label: { zh: '化粧品', en: 'Cosmetics' },
		title: { zh: '四個法域、七件化粧品原料登錄', en: 'Seven cosmetic-ingredient registrations across four jurisdictions' },
		detail: {
			zh: 'PCPC INCI（美國）2 件、JCIA INCI（日本）2 件、臺灣 TFDA 2 件、歐盟 CosIng 1 件。',
			en: 'PCPC INCI ×2, JCIA INCI ×2, Taiwan FDA ×2, EU CosIng ×1.',
		},
	},
	{
		label: { zh: '安全性', en: 'Safety' },
		title: { zh: 'GLP 安全性評估論文', en: 'GLP safety assessment published' },
		detail: {
			zh: '基因毒性、13 週大鼠口服毒性、胚胎－胎兒發育毒性（Toxicology Reports, 2022）。',
			en: 'Genetic toxicology, 13-week oral gavage and embryo-fetal developmental toxicity in SD rats (Toxicology Reports, 2022).',
		},
	},
	{
		label: { zh: '藥品', en: 'Pharma' },
		title: { zh: 'GMP 原料藥與美國 FDA DMF', en: 'GMP drug substance and U.S. FDA Drug Master File' },
		detail: {
			zh: '2025 年 4 月首批 GMP 原料藥批次放行；2025 年 10 月 FDA 受理 DMF，合作夥伴可於自身申請案中引用。',
			en: 'First GMP drug-substance batch released Apr 2025; DMF acknowledged by FDA Oct 2025, cross-referenceable by partners.',
		},
	},
];

export interface Certification {
	year: number;
	zh: string;
	en: string;
}

export const CERTIFICATIONS: Certification[] = [
	{ year: 2022, zh: '臺灣毒理學家', en: 'Certified Toxicologist, Taiwan' },
	{ year: 2023, zh: '中西藥品質管理師', en: 'Pharmaceutical Quality Management Specialist' },
	{ year: 2023, zh: '健康食品開發與品管中級工程師', en: 'Intermediate Engineer, Health Food Development & QC' },
	{ year: 2023, zh: '健康管理師（初級）', en: 'Health Manager, Level I' },
	{ year: 2019, zh: '食品品保初級工程師', en: 'Food Quality Assurance Engineer' },
	{ year: 2017, zh: '保健食品初級工程師', en: 'Health Supplement Engineer, Level I' },
];

export interface Patent {
	title: { zh: string; en: string };
	inventors: string;
	status: { zh: string; en: string };
	gmi?: boolean;
}

export const PATENTS: Patent[] = [
	{
		title: { zh: '含靈芝免疫調節蛋白之外泌體組成物及其用途', en: 'Exosome composition containing Ganoderma immunomodulatory protein and uses thereof' },
		inventors: 'Hseu, R.-S., Fu, H.-Y.',
		status: { zh: '臺灣核准（2026）；美國、中國、歐洲、日本審查中', en: 'Granted: Taiwan (2026). Pending: US, CN, EU, JP.' },
		gmi: true,
	},
	{
		title: { zh: '促進與治療慢性傷口癒合之組成物及方法', en: 'Composition and methods for promoting and treating chronic wound healing' },
		inventors: 'Fu, H.-Y., Cheng, Y.-C.',
		status: { zh: '美國（2021）、臺灣（2022）、中國（2024）核准', en: 'Granted: US (2021), Taiwan (2022), China (2024).' },
		gmi: true,
	},
	{
		title: { zh: '細菌視紫質融合膜蛋白表現系統', en: 'Bacteriorhodopsin fusion membrane protein expression system' },
		inventors: 'Fu, H.-Y. et al.',
		status: { zh: '美國專利 9,067,985 B2（2015）', en: 'U.S. Patent 9,067,985 B2 (2015).' },
	},
];

// 精選論文（共 22 篇同儕審查論文；* 表示共同第一作者）
export const SELECTED_PUBLICATIONS: string[] = [
	'<b>Fu, H.-Y.</b>, Hseu, R.-S. (2022) Safety assessment of the fungal immunomodulatory protein from <i>Ganoderma microsporum</i> (GMI) derived from engineered <i>Pichia pastoris</i>: genetic toxicology, a 13-week oral gavage toxicity study, and an embryo-fetal developmental toxicity study in Sprague-Dawley rats. <i>Toxicology Reports</i> 9:1240–1254.',
	'Lim, G.Z., Lin, Y.-E., Chen, P.-C., <b>Fu, H.-Y.</b>, Yang, C.-S. (2026) Cryo-EM structure of the SRI-HtrI complex reveals the cytoplasmic coupling in an archaeal phototaxis system. <i>Nature Communications</i>.',
	'Pei, H., <b>Fu, H.-Y.</b>*, Hirai, H., et al., Hu, W.-S. (2017) Generation of induced pluripotent stem cells from Chinese hamster embryonic fibroblasts. <i>Stem Cell Research</i> 21:132–136.',
	'Zhao, L., <b>Fu, H.-Y.</b>*, Raju, R., Vishwanathan, N., Hu, W.-S. (2017) Unveiling gene-trait relationship by cross-platform meta-analysis on Chinese hamster ovary cell transcriptome. <i>Biotechnology and Bioengineering</i> 114:1583–1592.',
	'Hsu, M.-F., <b>Fu, H.-Y.</b>*, Cai, C.-J., Yi, H.-P., Yang, C.-S., Wang, A.H.-J. (2015) Structural and functional studies of a newly grouped <i>Haloquadratum walsbyi</i> bacteriorhodopsin reveal the acid-resistant light-driven proton pumping activity. <i>Journal of Biological Chemistry</i> 290:29567–29577.',
	'<b>Fu, H.-Y.</b>, Yi, H.-P., Lu, Y.-H., Yang, C.-S. (2013) Insight into a single halobacterium using a dual-bacteriorhodopsin system with different functionally optimized pH ranges. <i>Molecular Microbiology</i> 88:551–561.',
	'<b>Fu, H.-Y.</b>, Lin, Y.-C., Chang, Y.-N., et al., Ng, W.V., Yang, C.-S. (2010) A novel six-rhodopsin system in a single archaeon. <i>Journal of Bacteriology</i> 192:5866–5873.',
];

export const TEACHING: { zh: string; en: string }[] = [
	{ zh: '國立臺北科技大學「化工實務」客座講師（2024 – 2026）', en: 'Guest Lecturer, Chemical Engineering Practice, National Taipei University of Technology (2024–2026)' },
	{ zh: '臺灣大學生物技術學程 講師（2013）', en: 'Invited instructor, Biotechnology Program, National Taiwan University (2013)' },
];

// 「一眼看懂」數字
export const STATS = [
	{ n: '13+', zh: '年重組蛋白產業轉譯', en: 'years in translational biologics' },
	{ n: '22', zh: '篇同儕審查論文', en: 'peer-reviewed papers' },
	{ n: '3', zh: '項專利（多國核准）', en: 'patent families' },
	{ n: '6', zh: '項專業認證', en: 'professional certifications' },
	{ n: '9', zh: '件食品／化粧品原料法規登錄', en: 'food & cosmetic ingredient registrations' },
];
