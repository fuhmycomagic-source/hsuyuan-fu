# hsuyuan-fu

傅煦媛的個人品牌網站 — GMI（小孢子靈芝免疫調節蛋白）的科學轉譯筆記。

- 線上網址：https://hsuyuan-fu.pages.dev
- 技術：[Astro](https://astro.build)（靜態輸出）＋ Cloudflare Pages（部署）＋ Pages Functions + KV（瀏覽計數）

## 結構

| 路徑 | 內容 |
|---|---|
| `src/content/articles/<slug>.md` | 文章（Markdown），網址為 `/posts/<slug>/` |
| `src/pages/` | 首頁、文章列表、GMI 研究資料、關於我 |
| `src/consts.ts` | 網站名稱、標語、利益揭露文字、預設主視覺與出處 |
| `public/images/` | 圖片 |
| `functions/api/` | 瀏覽計數 API（Cloudflare Pages Functions，資料存 KV） |
| `src/data/entities.ts` | 兩個核心 entity：傅煦媛（Person）與 GMI（Protein）的名稱、別名、外部識別碼（ORCID、Wikidata、UniProt…） |
| `src/lib/schema.ts` | JSON-LD 結構化資料產生器（每頁一個 @graph） |
| `src/lib/refs.ts`、`src/lib/cite-plugin.mjs` | 參考文獻系統：frontmatter `references` + 內文 `[@key]` |
| `src/data/refs-cache.json` | Crossref／PubMed 抓回的書目快取（`npm run refs` 產生，要 commit） |
| `scripts/` | 新增文章、自動更新日期、抓書目、匯入 GMI 資料的小工具 |

## 新增文章

```bash
npm run new-post -- my-slug "文章標題"
```

會建立 `src/content/articles/my-slug.md`，填好 frontmatter 後直接寫 Markdown。

Frontmatter 欄位：`title`、`description`（直接給答案的一兩句，AI 摘要常抽這裡）、`author`（預設 傅煦媛）、`pubDate`、`updatedDate`（自動）、`evidence`（證據等級：細胞實驗 / 動物實驗 / 人體試驗 / 個案軼事 / 推測假說）、`tags`、`about`（GMI 之外的主題 entity）、`takeaways`（重點摘要 3–5 句）、`references`、`faq`、`heroImage`（可選）、`draft`。

### 引用文獻

1. 在 frontmatter 的 `references` 列出來源，只要 `key` 加一個識別碼：
   ```yaml
   references:
     - key: teo2020
       gmi: JRN-0024                # GMI 文獻／專利：用 gmi.json 的 id
     - key: wilding2021
       doi: 10.1056/NEJMoa2032183   # 其他文獻：用 DOI
       note: STEP 1 試驗            # 可選補充
     - key: fda-label
       url: https://...             # 非期刊來源：url + title + publisher + year
       title: Wegovy prescribing information
       publisher: U.S. FDA
       year: 2024
   ```
2. 內文寫 `[@teo2020]` 或 `[@teo2020; @wilding2021]`，建置時變成上標 [1]、[1,2]，連到文末「參考文獻」。編號依內文第一次出現的順序。
3. 執行 `npm run refs`：向 Crossref 抓標題、作者、期刊、卷期頁，向 NCBI 抓 PMID／PMCID，存進 `src/data/refs-cache.json`（記得 commit）。已快取的不會重抓；`npm run refs -- --force` 全部重抓。
4. 文末清單每筆附 DOI、PubMed、全文（PMC）連結；GMI 文獻另附站內資料頁連結。書目缺漏時畫面會標「書目待補」。

### SEO／AI 結構化資料

每頁自動輸出 schema.org JSON-LD（`src/lib/schema.ts`）：
- 全站共用三個固定節點：`WebSite`、`Person`（傅煦媛，含 ORCID、Google Scholar、學歷、認證）、`Protein`（GMI，含 Wikidata、UniProt、PDB、GenBank、INCI）。
- 文章：`BlogPosting` + `author`→Person、`about`→GMI、`citation`→每筆 `ScholarlyArticle`（DOI）、`FAQPage`（有 faq 時）、`BreadcrumbList`。
- GMI 資料頁：`CollectionPage`，`hasPart` 為 41 篇 `ScholarlyArticle` 與專利節點。
- 關於我：`ProfilePage`，`mainEntity`→Person。
- 另有 `/rss.xml`、`/llms.txt`（給 AI 爬蟲的網站說明，建置時自動列出所有文章與主題頁）。

改人物或 GMI 的資料（新增身分連結、識別碼）只需改 `src/data/entities.ts`。

## 日期自動更新

`.githooks/pre-commit` 會在每次 commit 時：
- 修改過的文章 → `updatedDate` 換成今天
- 新增的文章若缺 `pubDate` → 補上今天

首頁與文章列表依「最後更新日期」排序，最新在前，並顯示發布／更新日期。

## GMI 研究資料（/gmi/）

資料主檔是 `GMIBIO_Knowledge_Master.xlsx`（同時供 LINE bot 使用，不放進版本庫）。更新流程：

```bash
npm run import-gmi -- "D:\Download\GMIBIO_Knowledge_Master.xlsx"
```

腳本會輸出 `src/data/gmi.json`（只含公開欄位），規則：
- 只收 `public_status=Public`、`record_status=Active`、`line_visibility=Show`
- 專利只收 `Granted`，依 `family_id` 合併為專利家族
- 文獻補上 `Legacy_Journals` 的作者、DOI、PMID

主題分類定義在 `src/data/gmi-topics.ts`；每筆依 `primary_tag`（其次 `tags`）歸入第一個符合的主題。
頁面：`/gmi/`（主題入口 + 篩選總表）、`/gmi/<topic>/`（主題頁：文獻卡 + 專利家族卡）。

## 部署

推送到 GitHub `main` 分支後，Cloudflare Pages 會自動建置與部署。

- 建置指令：`npm run build`
- 輸出目錄：`dist`
- KV 綁定（`VIEWS`）定義在 `wrangler.toml`

## 本機預覽

```bash
npm install
npm run build
npm run preview   # 含瀏覽計數 API 的完整模擬（http://127.0.0.1:8788）
```

## 圖片授權

主視覺：「Ganoderma lucidum, Lingzhi mushroom, Darwin, Australia」by Stu's Images，CC BY-SA 3.0，via Wikimedia Commons。出處標示於網站頁尾。
