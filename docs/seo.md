# Search, sharing, and answer-engine readiness

## Current policy

The owner requested that the draft stay out of search until the résumé and introduction are ready. Pages render `noindex, follow`; the 404 always remains noindex. The sitemap intentionally contains no URLs while indexing is disabled. Crawling stays allowed so engines can see noindex. Public availability and search indexing are separate.

When the profile is ready, set the repository Actions variable `PORTFOLIO_INDEXING` to `true` and rerun the deployment workflow. Do not change it simply to test a build. Future entries come from the same content collection as the sitemap, which excludes the 404 and downloadable source files. The source downloads are public artifacts; the site's noindex is not a privacy control for repository content or downloads.

The initial GitHub project URL serves robots.txt under `/professional-portfolio/`; search engines consult `/robots.txt` at the origin root, so that project-scoped file is not an effective root crawler policy. Page-level noindex applies independently. Once the custom domain is connected, the generated robots.txt is at the correct root. No root-domain settings for other GitHub projects were changed.

## Metadata

`site/src/components/Metadata.astro` renders unique titles/descriptions, absolute canonical URLs, Open Graph tags, a square portrait sharing image, X/Twitter summary cards, author attribution, and JSON-LD. Deployment origin/base come from Pages configuration. Query parameters never enter canonical URLs. The approved portrait is optimized at build time, with explicit dimensions and descriptive alt text.

The structured graph identifies Luke Hallett, his confirmed GitHub profile, the website, profile homepage, library collection, article authorship, and breadcrumbs. The article uses `TechArticle` and its review date lives on its WebPage node. It does not invent employment, qualifications, publication dates, or imply that an illustrative example is production-proven. The source photo was supplied by the owner; the AI crop preview was approved before being integrated. `site/src/assets/luke-hallett.png` is the approved image; preview outputs stay ignored.

## AEO approach

Use readable server-rendered content, descriptive headings, short explanations, explicit authorship, original-source provenance, and clearly labeled maturity. Structured data mirrors visible content. No fabricated FAQ, keyword stuffing, artificial authority metrics, or promised rankings. `llms.txt` is not required for Google’s AI search experiences and is not added as a substitute for accessible content.

This metadata supports understanding and eligibility, not guaranteed indexing, citations, or rich results. The draft's noindex intentionally prevents search/AI-search eligibility until enabled.

## Validation and next steps

`npm run verify` validates metadata alongside the site and example checks. `scripts/verify-seo.mjs` checks canonical and sharing URLs, actual image assets, unique titles/descriptions, structured-data relationships, authorship, draft/production indexing behavior, sitemap membership, and 404 exclusions. Both root-domain and project-path builds are tested locally. These are project assertions, not an external Rich Results certification.

The owner confirmed Google Search Console is set up and Bing Webmaster Tools is connected by importing the Google Search Console property. After indexing is enabled, submit `/sitemap.xml` and inspect key URLs. Use Google's Rich Results Test or Schema.org validator for external validation. These accounts are not connected or modified by the metadata implementation. Fill in verified career details and LinkedIn before extending Person properties.

## Primary references

- [Google: AI features and your website](https://developers.google.com/search/docs/appearance/ai-features)
- [Google: profile pages](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Google: structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google: robots.txt](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- [Open Graph protocol](https://ogp.me/)
