import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { EVIDENCE_LEVELS } from './consts';

const articles = defineCollection({
	// 文章放在 src/content/articles/<slug>.md，網址為 /posts/<slug>/
	loader: glob({ base: './src/content/articles', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		author: z.string().default('傅煦媛'),
		pubDate: z.coerce.date(),
		// 由 .githooks/pre-commit 在每次修改後自動更新；也可手動填寫
		updatedDate: z.coerce.date().optional(),
		// 證據等級標籤
		evidence: z.array(z.enum(EVIDENCE_LEVELS)).default([]),
		tags: z.array(z.string()).default([]),
		// 文章 HERO 圖片（放在 public/images/），未填則使用網站預設圖
		heroImage: z
			.object({
				src: z.string(),
				alt: z.string(),
				width: z.number().optional(),
				height: z.number().optional(),
				credit: z.string().optional(),
				creditUrl: z.string().optional(),
			})
			.optional(),
		// 文章開頭的「重點摘要」：3–5 句，每句直接給答案（AI 摘要與讀者都先看這裡）
		takeaways: z.array(z.string()).default([]),
		// 文章主題（GMI 之外的 entity 名稱，例如 '肌少症'、'GLP-1 受體促效劑'）
		about: z.array(z.string()).default([]),
		// 參考文獻：內文用 [@key] 引用。只需 key + doi / gmi / url，其餘由 npm run refs 補齊
		references: z
			.array(
				z.object({
					key: z.string().regex(/^[A-Za-z0-9_.:-]+$/, 'key 只能用英數、_ . : -'),
					doi: z.string().optional(),
					gmi: z.string().optional(),
					url: z.string().optional(),
					title: z.string().optional(),
					authors: z.array(z.string()).optional(),
					year: z.number().optional(),
					journal: z.string().optional(),
					publisher: z.string().optional(),
					note: z.string().optional(),
				}),
			)
			.default([]),
		// 常見問答：渲染在文末，並輸出 FAQPage 結構化資料
		faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
		draft: z.boolean().default(false),
	}),
});

export const collections = { articles };
