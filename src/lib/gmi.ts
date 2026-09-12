import data from '../data/gmi.json';
import { MECHANISM_TAG_TYPES, TOPICS, topicFor, type Topic } from '../data/gmi-topics';

export type Journal = (typeof data.journals)[number];
export type PatentFamily = (typeof data.patents)[number];
export type Tag = (typeof data.tags)[number];

export const GMI = data;
export const JURISDICTION_ZH: Record<string, string> = { TW: '台灣', US: '美國', JP: '日本', EP: '歐洲', CN: '中國' };

const tagMap = new Map(data.tags.map((t) => [t.tag, t]));
export const tagInfo = (tag: string): Tag | undefined => tagMap.get(tag);
export const tagZh = (tag: string): string => tagMap.get(tag)?.zh ?? tag;
export const isMechanism = (tag: string): boolean => MECHANISM_TAG_TYPES.has(tagMap.get(tag)?.type ?? '');

/** 顯示用標籤：去掉泛用的 GMI、去掉機轉標籤 */
export const displayTags = (tags: string[]) => tags.filter((t) => t !== 'GMI' && !isMechanism(t));
export const mechanismTags = (tags: string[]) => tags.filter(isMechanism);

export const journalTopic = (j: Journal): Topic => topicFor(j.id, j.primaryTag, j.tags, j.evidence);
export const patentTopic = (p: PatentFamily): Topic => topicFor(p.id, p.primaryTag, p.tags);

export function byTopic() {
	return TOPICS.map((topic) => ({
		topic,
		journals: data.journals.filter((j) => journalTopic(j).slug === topic.slug),
		patents: data.patents.filter((p) => patentTopic(p).slug === topic.slug),
	}));
}

/** 篩選總表用的可搜尋文字：標題、期刊、標籤（英文、中文、字典別名）、紀錄別名、主題名稱與說明 */
export function searchText(parts: (string | string[] | undefined | null)[], tags: string[] = [], topic?: Topic): string {
	const words: string[] = parts.flat().filter((x): x is string => !!x);
	for (const t of tags) {
		const info = tagMap.get(t);
		words.push(t);
		if (info) words.push(info.zh, ...info.aliases);
	}
	if (topic) words.push(topic.zh, topic.en, topic.blurb);
	return words.join(' ').toLowerCase();
}

export function firstAuthor(j: Journal): string {
	if (!j.authors.length) return '';
	const a = j.authors[0].split(',')[0].trim();
	return j.authors.length > 1 ? `${a} et al.` : a;
}
