import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import { execFileSync } from 'node:child_process';
import exampleLinks from './remark-example-links.mjs';
// Published code links must identify exactly the checkout being built.
if (process.env.PORTFOLIO_REPOSITORY) {
  const options = { cwd: new URL('../', import.meta.url), encoding: 'utf8' };
  const head = execFileSync('git', ['rev-parse', 'HEAD'], options).trim();
  const dirty = execFileSync('git', ['status', '--porcelain'], options).trim();
  if (dirty || head !== process.env.PORTFOLIO_REVISION) {
    throw new Error('GitHub links require a clean checkout at PORTFOLIO_REVISION.');
  }
}
export default defineConfig({
  site: process.env.PORTFOLIO_SITE || 'https://luke.hallettdevlabs.com',
  base: process.env.PORTFOLIO_BASE || '/',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  markdown: { processor: unified({ remarkPlugins: [exampleLinks] }) },
});
