// 由 .githooks/pre-commit 呼叫：
// 對「已在版本庫中、本次有修改」的文章，把 frontmatter 的 updatedDate 換成今天；
// 對「新增」的文章，若缺 pubDate 則補上今天。修改後重新 git add。
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const today = new Date().toISOString().slice(0, 10);
const status = execSync('git diff --cached --name-status --diff-filter=AM -- src/content/articles', {
	encoding: 'utf8',
});

for (const line of status.split('\n').filter(Boolean)) {
	const [flag, file] = line.split('\t');
	if (!file?.endsWith('.md')) continue;
	let text = readFileSync(file, 'utf8');
	const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
	if (!m) continue;
	let fm = m[1];
	let changed = false;

	if (flag === 'A' && !/^pubDate:/m.test(fm)) {
		fm += `\npubDate: ${today}`;
		changed = true;
	}
	if (flag === 'M') {
		if (/^updatedDate:.*$/m.test(fm)) {
			const next = fm.replace(/^updatedDate:.*$/m, `updatedDate: ${today}`);
			changed = next !== fm;
			fm = next;
		} else {
			fm = fm.replace(/^(pubDate:.*)$/m, `$1\nupdatedDate: ${today}`);
			changed = true;
		}
	}
	if (changed) {
		text = text.replace(m[0], `---\n${fm}\n---`);
		writeFileSync(file, text);
		execSync(`git add "${file}"`);
		console.log(`[stamp] ${file} → ${flag === 'A' ? 'pubDate' : 'updatedDate'} = ${today}`);
	}
}
