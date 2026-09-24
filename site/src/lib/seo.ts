import { sitePath } from './links';

// Explicit opt-in after the professional profile is ready. Development remains noindex.
export const indexingEnabled = import.meta.env.PROD && import.meta.env.PORTFOLIO_INDEXING === 'true';
export const siteDescription = 'Software engineer and technical leader with experience in enterprise applications, data platforms, and customer engineering. Explore Luke Hallett’s work.';
export const libraryDescription = 'Explore Luke Hallett’s Engineering Library: source-grounded explanations, architecture tradeoffs, and runnable examples for application development.';

export function absoluteUrl(path: string, site: URL | undefined) {
  if (!site) throw new Error('SEO requires an Astro site URL.');
  return new URL(sitePath(path), site).href;
}

export function serializeJsonLd(value: unknown) {
  // Prevent authored text from terminating the script element.
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
