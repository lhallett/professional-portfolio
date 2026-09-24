# Deployment and iteration

The portfolio uses GitHub Pages, independently of home infrastructure. The public source repository is `lhallett/professional-portfolio`, created by the owner. The `lukehallett-devlabs` collaborator has write access. The owner enabled GitHub Pages with GitHub Actions as its source. The first deployment and live browser checks passed on 2026-09-24 UTC.

## Normal iteration

1. Edit profile, pages, or library examples locally.
2. Run `npm run verify` and browser checks when behavior/layout changes.
3. Commit and push to `main`.
4. The Verify and deploy portfolio workflow validates the source and deploys `site/dist/`. Pull requests validate without deploying.

GitHub Actions reads the Pages hostname/base path and uses HTTPS for canonical and sharing URLs, including while a new domain certificate is provisioning. The same source supports the initial project URL and a later custom domain. It pins article code links to the deployed commit. Builds reject a dirty checkout or mismatched revision when source links are enabled. No deploy credentials are stored in the repository: the workflow uses GitHub's scoped token and deployment identity.

The owner authorized indexing. Main deployments are indexable by default; pull-request and default local builds remain noindex. Set the Actions variable `PORTFOLIO_INDEXING=false` and redeploy to pause indexing.

## Custom domain

Permanent domain: `luke.hallettdevlabs.com`. The owner configured the Pages custom domain and Cloudflare DNS-only CNAME to `lhallett.github.io`; public DNS resolution was verified on 2026-09-24 UTC. The HTTPS endpoint returns successfully with a valid certificate. The owner has enabled Enforce HTTPS. The initial project URL was `https://lhallett.github.io/professional-portfolio/`.

To connect the intended domain, first add it in repository Settings → Pages. Then create a DNS-only CNAME for `luke` pointing to `lhallett.github.io`. Do not include the repository name in the CNAME target. Enable Enforce HTTPS after GitHub provisions the certificate, and rerun the workflow so links use the new root path. Do not replace an existing DNS record without reviewing its owner/purpose.

GitHub Actions deployments use the Pages setting/API for the domain; a CNAME source file is not required. See [GitHub's custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Rollback

Revert the undesired commit on `main` and push; the workflow builds and deploys the reverted content with matching source links. Avoid rewriting public history. Existing accepted deployment stays live if validation fails.

No Atlas deployment or application changes are needed. Browser examples remain independently runnable from their own directories and are not installed as service workers on the portfolio origin.
