import type { APIRoute } from 'astro';
import { absoluteUrl, indexingEnabled } from '../lib/seo';
export const GET: APIRoute = ({ site }) => new Response([
  '# Crawling must remain allowed so crawlers can read page-level noindex.',
  '# robots.txt applies only when served at the origin root, not a project subpath.',
  'User-agent: *',
  'Allow: /',
  ...(indexingEnabled ? [`Sitemap: ${absoluteUrl('/sitemap.xml', site)}`] : []),
  '',
].join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
