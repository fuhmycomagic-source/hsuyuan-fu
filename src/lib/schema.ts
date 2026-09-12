// JSON-LD（schema.org）節點產生器。每個頁面組一個 @graph，透過 <Base schema={[...]}> 輸出。
// 原則：全站只有一個 Person 節點、一個 GMI 節點、一個 WebSite 節點（用固定 @id），
// 其他節點（文章、文獻、專利、頁面）都指向它們，機器才會把權重累積在同一個 entity 上。
import { GMI_ENTITY, IDS, PERSON, SITE_ENTITY, SITE_URL } from '../data/entities';
import type { ResolvedRef } from './refs';

export type Node = Record<string, unknown>;

export const abs = (path: string) => new URL(path, SITE_URL).href;

const personRef = { '@id': IDS.person };
const gmiRef = { '@id': IDS.gmi };
const siteRef = { '@id': IDS.website };

export function websiteNode(): Node {
	return {
		'@type': 'WebSite',
		'@id': IDS.website,
		url: SITE_ENTITY.url,
		name: SITE_ENTITY.name,
		alternateName: SITE_ENTITY.alternateName,
		description: SITE_ENTITY.description,
		inLanguage: SITE_ENTITY.inLanguage,
		author: personRef,
		publisher: personRef,
		about: gmiRef,
	};
}

export function personNode(): Node {
	return {
		'@type': 'Person',
		'@id': IDS.person,
		name: PERSON.name,
		alternateName: PERSON.alternateName,
		url: PERSON.url,
		image: PERSON.image,
		jobTitle: PERSON.jobTitle.en,
		description: PERSON.description.zh,
		sameAs: PERSON.sameAs,
		identifier: { '@type': 'PropertyValue', propertyID: 'ORCID', value: PERSON.orcid },
		alumniOf: PERSON.alumniOf.map((a) => ({
			'@type': 'CollegeOrUniversity',
			name: a.name,
			alternateName: a.nameZh,
			url: a.url,
			sameAs: a.sameAs,
		})),
		hasCredential: PERSON.credentials.map((c) => ({
			'@type': 'EducationalOccupationalCredential',
			name: c.name,
			alternateName: c.nameZh,
			credentialCategory: c.category,
			...(c.issuer ? { recognizedBy: { '@type': 'Organization', name: c.issuer } } : {}),
		})),
		knowsAbout: [gmiRef, ...PERSON.knowsAbout],
		knowsLanguage: PERSON.knowsLanguage,
		mainEntityOfPage: abs('/about/'),
	};
}

export function gmiNode(): Node {
	return {
		'@type': ['Protein', 'BioChemEntity'],
		'@id': IDS.gmi,
		name: GMI_ENTITY.name,
		alternateName: GMI_ENTITY.alternateName,
		description: GMI_ENTITY.description.zh,
		disambiguatingDescription: GMI_ENTITY.description.en,
		url: GMI_ENTITY.url,
		sameAs: GMI_ENTITY.sameAs,
		identifier: GMI_ENTITY.identifiers.map((i) => ({
			'@type': 'PropertyValue',
			propertyID: i.name,
			value: i.value,
			...(i.url ? { url: i.url } : {}),
		})),
		taxonomicRange: {
			'@type': 'Taxon',
			name: GMI_ENTITY.sourceOrganism.name,
			sameAs: GMI_ENTITY.sourceOrganism.wikidata,
		},
		subjectOf: { '@type': 'WebPage', '@id': abs('/gmi/') },
	};
}

export function breadcrumbNode(items: { name: string; path: string }[]): Node {
	return {
		'@type': 'BreadcrumbList',
		itemListElement: items.map((it, i) => ({
			'@type': 'ListItem',
			position: i + 1,
			name: it.name,
			item: abs(it.path),
		})),
	};
}

/** 文獻 → ScholarlyArticle；專利 → CreativeWork(additionalType Patent)；其他 → WebPage */
export function referenceNode(r: ResolvedRef): Node {
	const base: Node = {
		name: r.title,
		headline: r.title,
		...(r.year ? { datePublished: String(r.year) } : {}),
		...(r.url ? { url: r.url } : {}),
		...(r.gmi ? { about: gmiRef } : {}),
	};
	if (r.kind === 'patent') {
		return {
			'@type': 'CreativeWork',
			additionalType: 'https://schema.org/Patent',
			'@id': r.url ?? `urn:patent:${r.id}`,
			identifier: { '@type': 'PropertyValue', propertyID: 'patentNumber', value: r.id },
			...base,
		};
	}
	if (r.kind === 'article') {
		const ids: Node[] = [];
		if (r.doi) ids.push({ '@type': 'PropertyValue', propertyID: 'DOI', value: r.doi });
		if (r.pmid) ids.push({ '@type': 'PropertyValue', propertyID: 'PMID', value: r.pmid });
		return {
			'@type': 'ScholarlyArticle',
			'@id': r.doi ? `https://doi.org/${r.doi}` : (r.url ?? `urn:ref:${r.key}`),
			...base,
			...(r.authors?.length ? { author: r.authors.map((a) => ({ '@type': 'Person', name: a })) } : {}),
			...(r.journal
				? {
						isPartOf: {
							'@type': 'PublicationIssue',
							...(r.issue ? { issueNumber: r.issue } : {}),
							isPartOf: {
								'@type': 'PublicationVolume',
								...(r.volume ? { volumeNumber: r.volume } : {}),
								isPartOf: { '@type': 'Periodical', name: r.journal },
							},
						},
					}
				: {}),
			...(r.pages ? { pagination: r.pages } : {}),
			...(ids.length ? { identifier: ids } : {}),
			...(r.doi
				? { sameAs: [`https://doi.org/${r.doi}`, ...(r.pmid ? [`https://pubmed.ncbi.nlm.nih.gov/${r.pmid}/`] : [])] }
				: {}),
		};
	}
	return {
		'@type': 'WebPage',
		'@id': r.url ?? `urn:ref:${r.key}`,
		...base,
		...(r.publisher ? { publisher: { '@type': 'Organization', name: r.publisher } } : {}),
	};
}

export interface ArticleInput {
	path: string;
	title: string;
	description: string;
	image: string;
	datePublished: Date;
	dateModified: Date;
	keywords: string[];
	evidence: string[];
	about?: string[]; // 額外的主題名稱（GMI 之外）
	references: ResolvedRef[];
	faq?: { q: string; a: string }[];
	wordCount?: number;
}

export function articleGraph(a: ArticleInput): Node[] {
	const url = abs(a.path);
	const refNodes = a.references.map(referenceNode);
	const nodes: Node[] = [
		websiteNode(),
		personNode(),
		gmiNode(),
		{
			'@type': ['BlogPosting', 'Article'],
			'@id': `${url}#article`,
			headline: a.title,
			description: a.description,
			url,
			mainEntityOfPage: { '@type': 'WebPage', '@id': url },
			image: abs(a.image),
			author: personRef,
			publisher: personRef,
			datePublished: a.datePublished.toISOString(),
			dateModified: a.dateModified.toISOString(),
			inLanguage: 'zh-Hant-TW',
			isPartOf: siteRef,
			about: [gmiRef, ...(a.about ?? []).map((n) => ({ '@type': 'Thing', name: n }))],
			keywords: [...a.keywords, ...a.evidence.map((e) => `證據等級：${e}`)].join(', '),
			...(a.wordCount ? { wordCount: a.wordCount } : {}),
			...(refNodes.length ? { citation: refNodes.map((n) => ({ '@id': n['@id'] })) } : {}),
			isAccessibleForFree: true,
			copyrightHolder: personRef,
		},
		breadcrumbNode([
			{ name: '首頁', path: '/' },
			{ name: '文章', path: '/posts/' },
			{ name: a.title, path: a.path },
		]),
		...refNodes,
	];
	if (a.faq?.length) {
		nodes.push({
			'@type': 'FAQPage',
			'@id': `${url}#faq`,
			mainEntity: a.faq.map((f) => ({
				'@type': 'Question',
				name: f.q,
				acceptedAnswer: { '@type': 'Answer', text: f.a },
			})),
		});
	}
	return nodes;
}

export function profilePageGraph(): Node[] {
	return [
		websiteNode(),
		personNode(),
		gmiNode(),
		{
			'@type': 'ProfilePage',
			'@id': abs('/about/'),
			url: abs('/about/'),
			name: `關於我 / About — ${PERSON.name}`,
			mainEntity: personRef,
			inLanguage: ['zh-Hant-TW', 'en'],
			isPartOf: siteRef,
		},
		breadcrumbNode([
			{ name: '首頁', path: '/' },
			{ name: '關於我', path: '/about/' },
		]),
	];
}

export function homeGraph(): Node[] {
	return [
		websiteNode(),
		personNode(),
		gmiNode(),
		{
			'@type': 'WebPage',
			'@id': abs('/'),
			url: abs('/'),
			name: SITE_ENTITY.name,
			isPartOf: siteRef,
			about: gmiRef,
			inLanguage: 'zh-Hant-TW',
		},
	];
}

export function blogIndexGraph(posts: { path: string; title: string }[]): Node[] {
	return [
		websiteNode(),
		personNode(),
		gmiNode(),
		{
			'@type': ['CollectionPage', 'Blog'],
			'@id': abs('/posts/'),
			url: abs('/posts/'),
			name: '文章',
			isPartOf: siteRef,
			author: personRef,
			about: gmiRef,
			blogPost: posts.map((p) => ({ '@id': `${abs(p.path)}#article` })),
		},
		breadcrumbNode([
			{ name: '首頁', path: '/' },
			{ name: '文章', path: '/posts/' },
		]),
	];
}

/** GMI 資料頁（總覽或主題頁）：CollectionPage，about GMI，hasPart 為文獻／專利節點 */
export function gmiCollectionGraph(opts: {
	path: string;
	name: string;
	description: string;
	refs: ResolvedRef[];
	crumbs: { name: string; path: string }[];
}): Node[] {
	const refNodes = opts.refs.map(referenceNode);
	return [
		websiteNode(),
		personNode(),
		gmiNode(),
		{
			'@type': 'CollectionPage',
			'@id': abs(opts.path),
			url: abs(opts.path),
			name: opts.name,
			description: opts.description,
			inLanguage: ['zh-Hant-TW', 'en'],
			isPartOf: siteRef,
			author: personRef,
			about: gmiRef,
			...(opts.path === '/gmi/' ? { mainEntity: gmiRef } : {}),
			hasPart: refNodes.map((n) => ({ '@id': n['@id'] })),
		},
		breadcrumbNode(opts.crumbs),
		...refNodes,
	];
}

export function toJsonLd(nodes: Node[]): string {
	// 內嵌 script 內不能出現 "<"，一律轉成 <
	return JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c');
}
