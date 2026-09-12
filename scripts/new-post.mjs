// 用法：npm run new-post -- <slug> "文章標題"
// 會建立 src/content/articles/<slug>.md，網址即 /posts/<slug>/
import { existsSync, writeFileSync } from 'node:fs';

const [slug, title = '未命名文章'] = process.argv.slice(2);
if (!slug || !/^[a-z0-9][a-z0-9-]*$/.test(slug)) {
	console.error('請提供 slug（只能用小寫英文、數字、連字號），例如：npm run new-post -- glp1-muscle-loss "標題"');
	process.exit(1);
}
const file = `src/content/articles/${slug}.md`;
if (existsSync(file)) {
	console.error(`${file} 已存在`);
	process.exit(1);
}
const today = new Date().toISOString().slice(0, 10);
writeFileSync(
	file,
	`---
title: '${title.replace(/'/g, "''")}'
description: '一句話摘要（顯示在卡片與搜尋結果）'
author: 傅煦媛
pubDate: ${today}
evidence: []        # 可選：細胞實驗 / 動物實驗 / 人體試驗 / 個案軼事 / 推測假說
tags: []
about: []           # GMI 之外的主題 entity，例如 ['肌少症', 'GLP-1 受體促效劑']
takeaways:          # 重點摘要 3–5 句，每句直接給答案；顯示在文章開頭
  - ''
references:         # 內文用 [@key] 引用；只填 key + doi / gmi / url，其餘 npm run refs 自動補
  # - key: teo2020
  #   gmi: JRN-0024                # gmi.json 的 id（文獻 JRN-、專利家族 PF-GMI-）
  # - key: wilding2021
  #   doi: 10.1056/NEJMoa2032183
  #   note: STEP 1 試驗
  # - key: fda-label
  #   url: https://...
  #   title: 仿單標題
  #   publisher: U.S. FDA
  #   year: 2024
faq:                # 常見問答（同時輸出 FAQPage 結構化資料）
  # - q: 問題？
  #   a: 一段直接的回答。
# heroImage:
#   src: /images/xxx.jpg
#   alt: 圖片說明
#   credit: 作者, 授權, 來源
#   creditUrl: https://...
draft: false
---

（從這裡開始寫。段落內引用文獻寫 [@key]，多篇寫 [@key1; @key2]。）
`,
);
console.log(`已建立 ${file}`);
