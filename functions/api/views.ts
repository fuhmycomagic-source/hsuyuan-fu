import { type Env, SLUG_RE, json } from '../_lib';

// GET /api/views?slugs=a,b,c  →  { a: 12, b: 3, c: 0 }
export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
	const raw = new URL(request.url).searchParams.get('slugs') ?? '';
	const slugs = [...new Set(raw.split(',').map((s) => s.trim()).filter((s) => SLUG_RE.test(s)))].slice(0, 100);
	const entries = await Promise.all(
		slugs.map(async (s) => [s, Number((await env.VIEWS.get(s)) ?? 0)] as const),
	);
	return json(Object.fromEntries(entries));
};
