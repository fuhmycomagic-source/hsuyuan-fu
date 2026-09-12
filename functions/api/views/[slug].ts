import { type Env, SLUG_RE, json } from '../../_lib';

// GET  /api/views/:slug  → { views: n }（只讀）
// POST /api/views/:slug  → { views: n+1 }（+1 後回傳）
const read = async (env: Env, slug: string) => Number((await env.VIEWS.get(slug)) ?? 0);

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
	const slug = String(params.slug);
	if (!SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);
	return json({ views: await read(env, slug) });
};

export const onRequestPost: PagesFunction<Env> = async ({ params, env }) => {
	const slug = String(params.slug);
	if (!SLUG_RE.test(slug)) return json({ error: 'bad slug' }, 400);
	const views = (await read(env, slug)) + 1;
	await env.VIEWS.put(slug, String(views));
	return json({ views });
};
