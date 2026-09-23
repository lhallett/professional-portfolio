# Luke Hallett · professional-portfolio

A professional front door and an Engineering Library for `luke.hallettdevlabs.com`. Career content is explicitly pending source material. GitHub Actions verifies and deploys the static site on pushes to `main`; see [deployment and iteration](docs/deployment.md).

## Structure and ownership

- `site/`: static Astro presentation; consumes Markdown from `library/` at build time.
- `library/<slug>/index.md`: explanation, tradeoffs, provenance, and verification.
- `library/<slug>/example/`: independent runnable code, own package manifest, README, and tests.
- `docs/`: discovery, authoring, public-content review, and external handoffs.

Atlas owns application discovery, operational references, and its deployed-system showcase. Applications own production implementations. This repository owns the professional profile and curated examples. Nothing imports reference checkouts, private registries, or a live API. There is no automated source synchronization.

## Local development

Node >=22.12.0 and npm. Install site dependencies once:

```sh
npm ci --prefix site
npm run dev
```

Open http://127.0.0.1:4321. Build with `npm run build`; preview the build with `npm --prefix site run preview`. Static output is `site/dist/`. Run commands from this repository root unless specified. The site can be built with only its own dependencies and the checked-in library; root development dependencies are only for browser verification.

## Example

```sh
cd library/thermostat-mobile/example
npm test
npm start
```

Open http://127.0.0.1:4174. No installation, site server, account, or external service is needed. See [example instructions](library/thermostat-mobile/example/README.md).

## Verification

```sh
npm run verify
```

This runs Astro checks, example tests, the static build, internal link/anchor checks, and a supplemental publication-pattern scan. For browser checks, install root dependencies (`npm ci`), have Google Chrome installed, start the site and example servers in separate terminals, then run:

```sh
node scripts/browser-check.mjs
```

This checks mobile/desktop overflow, automated WCAG A/AA rules in light/dark themes, theme persistence, and the example’s live/offline/expired/reconnected states. Screenshots go to `/tmp/portfolio-preview`. Automated accessibility checks do not replace keyboard and assistive-technology review.

## Content and release

See [authoring](docs/authoring.md), [discovery](docs/discovery.md), and [publication review](docs/publication-review.md). The site intentionally uses `noindex` while career placeholders remain. No GitHub URL, contact address, résumé, or employment history is guessed.

GitHub Pages serves `site/dist/` independently of home infrastructure. The workflow supports both the project URL and the intended custom domain. Career content, contact links, and the repository license remain owner decisions; they do not block the initial public draft. See [deployment](docs/deployment.md) for DNS and rollback details.
