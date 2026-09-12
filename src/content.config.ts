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
		draft: z.boolean().default(false),
	}),
});

export const collections = { articles };
