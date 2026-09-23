# Content authoring

## Professional profile

Populate `site/src/data/profile.ts` from owner-approved source material. Set the résumé path only after adding an approved PDF under `site/public/`. Set contact/social URLs only after confirming them. Replace the explicitly marked experience placeholder in `site/src/pages/index.astro` with verified roles, dates, and outcomes. Do not infer experience from repository activity.

## Library entries

Use `library/<slug>/index.md` and an independently runnable `example/` directory. The initial collection schema is in `site/src/content.config.ts`. Required fields: title, description, category, tags, maturity, sourceApplication, sourceMaturity, reviewed (quoted ISO date), example (directory slug).

Start with Mobile experiences, Identity and access, and Application architecture. Add categories only when actual entries justify them. The index defines Exploration, Working Example, Used in an Application, and Archived. Example maturity is separate from source application maturity and deployment evidence.

Cover problem/constraints, fit, alternatives/tradeoffs, flow, annotated implementation, setup/verification, limitations/lessons, and provenance. Document exact source paths and reviewed commit. Distinguish observation from plans and deployment claims. Use relative `example/…` Markdown links: the site rewrites them to static source downloads, while GitHub can navigate the original files.

The initial article renderer reads `example/policy.mjs` directly and displays a SHA-256 fingerprint. A second entry with a different code layout should introduce a schema-validated excerpt filename and update the renderer. The static download route currently exports only top-level code, Markdown, HTML, SVG, webmanifest, and JSON files; review each export before adding sensitive or private material. Examples run from their own local servers, not under the portfolio origin; service workers never install on the portfolio.

## Matching revisions

Leave GitHub links absent during local work. When a public repository and clean release commit exist, build with `PORTFOLIO_REPOSITORY=https://github.com/OWNER/professional-portfolio` and `PORTFOLIO_REVISION=<full 40-character commit>`. The article uses a commit-pinned tree link. Never set this to a moving branch or a commit that lacks the built examples. Compare the displayed policy fingerprint with that commit’s file. The Astro configuration enforces a clean checkout and requires its HEAD to equal PORTFOLIO_REVISION whenever repository links are enabled.

The website and examples are built from the same checkout. Library Markdown remains directly useful without the website. Astro's [content collections](https://docs.astro.build/en/guides/content-collections/) provide the filesystem loader and schema validation.
