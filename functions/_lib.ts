export interface Env {
	VIEWS: KVNamespace;
}

export const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,99}$/;

export function json(data: unknown, status = 200): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
			'cache-control': 'no-store',
		},
	});
}
