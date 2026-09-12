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
| `scripts/` | 新增文章、自動更新日期的小工具 |

## 新增文章

```bash
npm run new-post -- my-slug "文章標題"
```

會建立 `src/content/articles/my-slug.md`，填好 frontmatter 後直接寫 Markdown。

Frontmatter 欄位：`title`、`description`、`author`（預設 傅煦媛）、`pubDate`、`updatedDate`（自動）、`evidence`（證據等級：細胞實驗 / 動物實驗 / 人體試驗 / 個案軼事 / 推測假說）、`tags`、`heroImage`（可選，未填用網站預設圖）、`draft`。

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
