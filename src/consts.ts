export const SITE_TITLE = '傅煦媛 Hsu-Yuan Fu';
export const SITE_NAME = '傅煦媛';
export const SITE_NAME_EN = 'Hsu-Yuan Fu';
export const SITE_TAGLINE = 'GMI（小孢子靈芝免疫調節蛋白）的科學轉譯筆記';
export const SITE_DESCRIPTION =
	'從健康與科研議題出發，整理 GMI（Ganoderma microsporum immunomodulatory protein）的研究進展與應用想法。個人觀點，誠實標示證據等級。';
export const AUTHOR = '傅煦媛';

// 利益揭露：出現在「關於我」與每篇文章底部
export const DISCLOSURE =
	'本人任職於 GMI 原料研發相關工作。本站內容為個人觀點與科學整理，不代表任職機構立場，亦非產品廣告；所述研究結果不構成任何醫療建議或療效宣稱。';

// 網站預設主視覺（首頁 HERO 與未指定圖片的文章）
export const DEFAULT_HERO = {
	src: '/images/hero-lingzhi.jpg',
	width: 1280,
	height: 853,
	alt: '生長於樹根旁的靈芝（Ganoderma lucidum）子實體',
	title: 'Ganoderma lucidum, Lingzhi mushroom, Darwin, Australia',
	author: "Stu's Images",
	license: 'CC BY-SA 3.0',
	licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
	sourceUrl:
		'https://commons.wikimedia.org/wiki/File:Ganoderma_lucidum,_Lingzhi_mushroom,_Darwin,_Australia.JPG',
};

export const EVIDENCE_LEVELS = ['細胞實驗', '動物實驗', '人體試驗', '個案軼事', '推測假說'] as const;
