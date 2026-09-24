# Deployment and iteration

The portfolio uses GitHub Pages, independently of home infrastructure. The public source repository is `lhallett/professional-portfolio`, created by the owner. The `lukehallett-devlabs` collaborator has write access. GitHub Pages must be enabled by an account with repository administration access before the deployment workflow can run.

## Normal iteration

1. Edit profile, pages, or library examples locally.
2. Run `npm run verify` and browser checks when behavior/layout changes.
3. Commit and push to `main`.
4. The Verify and deploy portfolio workflow validates the source and deploys `site/dist/`. Pull requests validate without deploying.

GitHub Actions reads the Pages origin/base path so the same source supports the initial project URL and a later custom domain. It pins article code links to the deployed commit. Builds reject a dirty checkout or mismatched revision when source links are enabled. No deploy credentials are stored in the repository: the workflow uses GitHub's scoped token and deployment identity.

The site currently retains `noindex, nofollow` for the career-content draft. The repository and site are public; this metadata only requests exclusion from search engines.

## Custom domain

Intended domain: `luke.hallettdevlabs.com`. DNS is hosted at Cloudflare. The initial project URL is `https://lhallett.github.io/professional-portfolio/`.

To connect the intended domain, first add it in repository Settings → Pages. Then create a DNS-only CNAME for `luke` pointing to `lhallett.github.io`. Do not include the repository name in the CNAME target. Enable Enforce HTTPS after GitHub provisions the certificate, and rerun the workflow so links use the new root path. Do not replace an existing DNS record without reviewing its owner/purpose.

GitHub Actions deployments use the Pages setting/API for the domain; a CNAME source file is not required. See [GitHub's custom-domain guidance](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Rollback

Revert the undesired commit on `main` and push; the workflow builds and deploys the reverted content with matching source links. Avoid rewriting public history. Existing accepted deployment stays live if validation fails.

No Atlas deployment or application changes are needed. Browser examples remain independently runnable from their own directories and are not installed as service workers on the portfolio origin.
