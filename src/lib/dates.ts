import type { CollectionEntry } from 'astro:content';

export function fmt(d: Date): string {
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
}

/** 最後更新日期：有 updatedDate 用 updatedDate，否則用 pubDate */
export function lastUpdated(a: CollectionEntry<'articles'>): Date {
	const { pubDate, updatedDate } = a.data;
	return updatedDate && updatedDate > pubDate ? updatedDate : pubDate;
}

/** 依最後更新日期排序，最新在前 */
export function sortByUpdated(list: CollectionEntry<'articles'>[]) {
	return [...list].sort((a, b) => lastUpdated(b).valueOf() - lastUpdated(a).valueOf());
}
