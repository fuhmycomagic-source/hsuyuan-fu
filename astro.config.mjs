// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

export default defineConfig({
	site: 'https://hsuyuan-fu.pages.dev',
	trailingSlash: 'always',
	integrations: [sitemap()],
});
