// Markdown 內文引用：寫 [@key] 或 [@key1; @key2]，會變成上標 [1]、[1,2] 並連到文末參考文獻。
// key 對應文章 frontmatter `references` 裡的 key（見 src/lib/refs.ts）。
// 編號依內文第一次出現的順序；順序寫回 frontmatter.citeOrder，供 References.astro 排序。
import { defineMdastPlugin } from 'satteri';

const CITE_RE = /\[@([^\]]+?)\]/g;

export const citePlugin = defineMdastPlugin({
	name: 'cite',
	before(_root, ctx) {
		ctx.data.citeOrder = [];
	},
	text(node, ctx) {
		const value = node.value;
		if (!value.includes('[@')) return;
		const order = ctx.data.citeOrder;
		const declared = new Set((ctx.data.astro?.frontmatter?.references ?? []).map((r) => r.key));
		const parts = [];
		let last = 0;
		for (const m of value.matchAll(CITE_RE)) {
			const keys = m[1]
				.split(';')
				.map((k) => k.trim().replace(/^@/, ''))
				.filter(Boolean);
			const unknown = keys.filter((k) => !declared.has(k));
			if (unknown.length) {
				ctx.report({ message: `引用了未宣告的參考文獻 key：${unknown.join(', ')}（請在 frontmatter references 加上）`, node, severity: 'warning' });
				continue; // 保留原文，方便發現
			}
			if (m.index > last) parts.push({ type: 'text', value: value.slice(last, m.index) });
			const nums = keys.map((k) => {
				let i = order.indexOf(k);
				if (i === -1) i = order.push(k) - 1;
				return { k, n: i + 1 };
			});
			const links = nums.map(({ k, n }) => `<a href="#ref-${k}" id="cite-${k}-${n}" aria-label="參考文獻 ${n}">${n}</a>`).join(',');
			parts.push({ type: 'html', value: `<sup class="cite">[${links}]</sup>` });
			last = m.index + m[0].length;
		}
		if (!parts.length) return;
		if (last < value.length) parts.push({ type: 'text', value: value.slice(last) });
		ctx.replaceNode(node, parts);
	},
	after(_root, ctx) {
		const fm = ctx.data.astro?.frontmatter;
		if (fm) fm.citeOrder = [...ctx.data.citeOrder];
	},
});
