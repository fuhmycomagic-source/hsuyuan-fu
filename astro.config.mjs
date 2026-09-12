// @ts-check
import { satteri } from '@astrojs/markdown-satteri';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { citePlugin } from './src/lib/cite-plugin.mjs';

export default defineConfig({
	site: 'https://hsuyuan-fu.pages.dev',
	trailingSlash: 'always',
	integrations: [sitemap()],
	markdown: {
		// 內文引用 [@key] → 上標編號（見 src/lib/cite-plugin.mjs）
		processor: satteri({ mdastPlugins: [citePlugin] }),
	},
});
