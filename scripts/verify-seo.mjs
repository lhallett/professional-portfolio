import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const root = path.resolve('site/dist');
const origin = new URL(process.env.PORTFOLIO_SITE || 'https://luke.hallettdevlabs.com').origin;
const base = (process.env.PORTFOLIO_BASE || '').replace(/\/$/, '');
const enabled = process.env.PORTFOLIO_INDEXING === 'true';
const absolute = p => new URL(base + p, origin).href;
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&#39;', "'").replaceAll('&quot;', '"');
async function walk(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(e => e.isDirectory() ? walk(path.join(directory, e.name)) : [path.join(directory, e.name)]))).flat();
}
const pages = (await walk(root)).filter(file => file.endsWith('.html') && !file.includes('/examples/'));
const titles = new Set();
const descriptions = new Set();
const canonicalPages = [];
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const route = '/' + path.relative(root, file).replace(/index\.html$/, '').replaceAll(path.sep, '/');
  const isError = route === '/404.html';
  const meta = name => decode(html.match(new RegExp(`<meta (?:name|property)="${name}" content="([^"]*)"`))?.[1] || '');
  const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || '');
  const description = meta('description');
  assert.ok(title && !titles.has(title), `Missing/duplicate title: ${route}`); titles.add(title);
  assert.ok(description && !descriptions.has(description), `Missing/duplicate description: ${route}`); descriptions.add(description);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.equal(canonical, absolute(route));
  assert.equal(meta('og:url'), canonical);
  assert.equal(meta('og:title'), title);
  assert.equal(meta('twitter:title'), title);
  assert.equal(meta('og:description'), description);
  assert.equal(meta('twitter:description'), description);
  assert.equal(meta('twitter:card'), 'summary');
  assert.equal(meta('robots'), enabled && !isError ? 'index, follow, max-image-preview:large' : 'noindex, follow');
  const image = new URL(meta('og:image'));
  assert.equal(image.origin, origin);
  assert.ok(image.pathname.startsWith(base + '/_astro/'));
  assert.ok((await stat(path.join(root, image.pathname.slice(base.length)))).size > 0);
  assert.equal(meta('twitter:image'), image.href);
  const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if (isError) { assert.equal(scripts.length, 0); continue; }
  canonicalPages.push(canonical);
  assert.equal(scripts.length, 1);
  const json = JSON.parse(scripts[0][1]);
  assert.equal(json['@context'], 'https://schema.org');
  const graph = json['@graph'];
  const person = graph.find(node => node['@type'] === 'Person');
  assert.equal(person.name, 'Luke Hallett');
  assert.deepEqual(person.sameAs, ['https://github.com/lhallett', 'https://www.linkedin.com/in/lukehallett', 'https://www.facebook.com/luke.t.hallett', 'https://www.instagram.com/lhallett99']);
  for (const field of ['jobTitle', 'worksFor', 'alumniOf', 'award']) assert.equal(person[field], undefined);
  const website = graph.find(node => node['@type'] === 'WebSite');
  assert.equal(website.url, absolute('/'));
  const page = graph.find(node => node['@id'] === canonical + '#webpage');
  assert.equal(page.url, canonical);
  assert.equal(page.name, title);
  if (route === '/') assert.equal(page['@type'], 'ProfilePage');
  else {
    const crumbs = graph.find(node => node['@type'] === 'BreadcrumbList').itemListElement;
    assert.equal(crumbs.at(-1).item, canonical);
    assert.deepEqual(crumbs.map(c => c.position), crumbs.map((_, i) => i + 1));
    if (route !== '/library/') {
      const article = graph.find(node => node['@type'] === 'TechArticle');
      assert.equal(article.author['@id'], person['@id']);
      assert.equal(article.mainEntityOfPage['@id'], page['@id']);
      assert.match(html, /By <a[^>]*>Luke Hallett<\/a>/);
      assert.match(html, new RegExp(`<time datetime="${page.lastReviewed}">`));
      assert.equal(article.datePublished, undefined, 'Do not invent publication dates');
    }
  }
}
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const listed = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => decode(m[1]));
assert.deepEqual(listed.sort(), enabled ? canonicalPages.sort() : []);
const robots = await readFile(path.join(root, 'robots.txt'), 'utf8');
assert.match(robots, /Allow: \//);
assert.ok(!robots.includes('Disallow: /'), 'Crawlers must be able to read noindex');
assert.equal(robots.includes(`Sitemap: ${absolute('/sitemap.xml')}`), enabled);
console.log(`SEO verification passed: ${pages.length} unique pages, canonical/social URLs, image assets, JSON-LD, ${enabled ? 'indexable' : 'draft noindex'} policy, sitemap and robots.`);
