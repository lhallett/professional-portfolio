# Local verification · 2026-09-23

- `npm run verify`: passed. Astro reports zero errors, warnings, or hints; seven cache-policy tests pass; static build succeeds; 49 local links/anchors pass; generated-content pattern scan is clear.
- `node scripts/browser-check.mjs`: passed against local Chrome. Three routes at 390px and 1440px, both light and dark themes, have no horizontal overflow or automated WCAG A/AA violations. Theme choice persists across reloads.
- Synthetic demo: live response, offline saved response preserving the timestamp, offline shell reload, expired-cache unavailable state, and network recovery all pass.
- Desktop/mobile screenshots reviewed. Code comments use a high-contrast theme after an initial contrast finding was corrected.
- Atlas public route and application ID verified from updated source. Live reachability was not confirmed by the web tool.

These checks do not certify full assistive-technology support, cross-browser installation behavior, source application production maturity, or completeness of a secret/ownership audit. Nothing was pushed or deployed; reference repositories were not modified by this work.

## First public deployment · 2026-09-24 UTC

The owner created the public `lhallett/professional-portfolio` repository and enabled GitHub Actions as the Pages source. [Deployment run](https://github.com/lhallett/professional-portfolio/actions/runs/35936365051), attempt 2, passed build, verification, upload, and deployment. The initial attempt stopped because Pages was not yet enabled.

Live Chrome verification passed for the homepage, library index, and article at `https://lhallett.github.io/professional-portfolio/`: HTTP success, assets, mobile overflow, automated accessibility rules, theme persistence, source downloads, and commit-pinned GitHub links. Custom-domain DNS remains separate.
