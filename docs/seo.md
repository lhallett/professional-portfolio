# Search, sharing, and answer-engine readiness

## Current policy

The owner approved search indexing on 2026-09-24. Main-branch deployments render `index, follow, max-image-preview:large`; the 404 remains noindex. The sitemap includes the homepage, library, and published library articles. Crawling is allowed and robots.txt advertises the sitemap.

The deployment workflow enables indexing on main by default. Set the repository Actions variable `PORTFOLIO_INDEXING` to `false` and redeploy to pause indexing. Pull-request builds and default local builds remain noindex. For local production-policy verification, run `PORTFOLIO_INDEXING=true npm run verify`. The sitemap excludes the 404 and downloadable source files. Public availability and indexing are separate; noindex is not a privacy control.

The initial GitHub project URL serves robots.txt under `/professional-portfolio/`; search engines consult `/robots.txt` at the origin root, so that project-scoped file is not an effective root crawler policy. Page-level noindex applies independently. Once the custom domain is connected, the generated robots.txt is at the correct root. No root-domain settings for other GitHub projects were changed.

## Metadata

`site/src/components/Metadata.astro` renders unique titles/descriptions, absolute canonical URLs, Open Graph tags, a square portrait sharing image, X/Twitter summary cards, author attribution, and JSON-LD. Deployment origin/base come from Pages configuration. Query parameters never enter canonical URLs. The approved portrait is optimized at build time, with explicit dimensions and descriptive alt text.

The structured graph identifies Luke Hallett, his confirmed GitHub, LinkedIn, Facebook, and Instagram profiles, the website, profile homepage, library collection, article authorship, and breadcrumbs. The article uses `TechArticle` and its review date lives on its WebPage node. It does not invent employment, qualifications, publication dates, or imply that an illustrative example is production-proven. The source photo was supplied by the owner; the AI crop preview was approved before being integrated. `site/src/assets/luke-hallett.png` is the approved image; preview outputs stay ignored.

## AEO approach

Use readable server-rendered content, descriptive headings, short explanations, explicit authorship, original-source provenance, and clearly labeled maturity. Structured data mirrors visible content. No fabricated FAQ, keyword stuffing, artificial authority metrics, or promised rankings. `llms.txt` is not required for Google’s AI search experiences and is not added as a substitute for accessible content.

This metadata supports understanding and eligibility, not guaranteed indexing, citations, or rich results.

## Validation and next steps

`npm run verify` validates metadata alongside the site and example checks. `scripts/verify-seo.mjs` checks canonical and sharing URLs, actual image assets, unique titles/descriptions, structured-data relationships, authorship, draft/production indexing behavior, sitemap membership, and 404 exclusions. Both root-domain and project-path builds are tested locally. These are project assertions, not an external Rich Results certification.

The owner confirmed Google Search Console is set up and Bing Webmaster Tools is connected by importing the Google Search Console property. After indexing is enabled, submit `/sitemap.xml` and inspect key URLs. Use Google's Rich Results Test or Schema.org validator for external validation. These accounts are not connected or modified by the metadata implementation. Fill in verified career details and LinkedIn before extending Person properties.

## Primary references

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: profile pages](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Open Graph protocol](https://ogp.me/)

## Search account status

The owner reported sitemap submission to Google and Bing and an indexing request. On 2026-09-24, the owner confirmed that Search Console shows the page. This is owner-reported status, not an independent confirmation of rankings or every URL being indexed.
