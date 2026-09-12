import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { AUTHOR, SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { lastUpdated, sortByUpdated } from '../lib/dates';

export async function GET(context: APIContext) {
	const articles = sortByUpdated((await getCollection('articles')).filter((a) => !a.data.draft));
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site!,
		items: articles.map((a) => ({
			title: a.data.title,
			description: a.data.description,
			pubDate: lastUpdated(a),
			link: `/posts/${a.id}/`,
			author: AUTHOR,
			categories: [...a.data.tags, ...a.data.evidence.map((e) => `證據等級：${e}`)],
		})),
		customData: '<language>zh-TW</language>',
	});
}
