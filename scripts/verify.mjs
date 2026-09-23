import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('site/dist');
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]))).flat();
}
const files = await walk(root);
const base = (process.env.PORTFOLIO_BASE || '').replace(/\/$/, '');
let links = 0;
for (const file of files) {
  if (!/\.(html|js|mjs|json|md|css)$/.test(file)) continue;
  const source = await readFile(file, 'utf8');
  for (const pattern of [/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/, /\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}/, /\bAKIA[A-Z0-9]{16}\b/, /\/Users\//, /\b(?:10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+)\b/]) assert.ok(!pattern.test(source), `Publication pattern in ${file}: ${pattern}`);
  if (!file.endsWith('.html')) continue;
  // Downloaded example HTML is a separate runnable application, not a site route.
  if (file.includes(`${path.sep}examples${path.sep}`)) continue;
  assert.match(source, /<html[^>]+lang="en"/, `Missing language: ${file}`);
  assert.equal((source.match(/<h1(?:\s|>)/g) || []).length, 1, `Expected one h1: ${file}`);
  for (const match of source.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
    const href = match[1];
    if (/^(?:https?:|mailto:|data:)/.test(href)) continue;
    const route = base + '/' + path.relative(root, file).replaceAll(path.sep, '/');
    const target = new URL(href, `http://local.test${route}`);
    assert.ok(!base || target.pathname.startsWith(base + '/'), `Link escapes deployment base: ${href}`);
    let filename = path.join(root, decodeURIComponent(target.pathname.slice(base.length)));
    try { if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html'); }
    catch { throw new Error(`Broken local link in ${file}: ${href}`); }
    const content = await readFile(filename, 'utf8');
    if (target.hash) assert.ok(content.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`), `Missing anchor ${href} from ${file}`);
    links++;
  }
}
console.log(`Static verification passed: ${files.length} files, ${links} local links; publication-pattern scan clear.`);
