import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { absoluteUrl, indexingEnabled } from '../lib/seo';
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
export const GET: APIRoute = async ({ site }) => {
  // Do not submit noindex draft URLs, downloads, or error pages to search engines.
  const paths = indexingEnabled ? ['/', '/contact/', '/library/', ...(await getCollection('library')).map(entry => `/library/${entry.id}/`)] : [];
  const urls = paths.map(path => `<url><loc>${escapeXml(absoluteUrl(path, site))}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
