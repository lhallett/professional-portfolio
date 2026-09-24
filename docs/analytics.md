# Google Analytics

The owner supplied GA4 Measurement ID `G-D99PMKBL00` for this portfolio. It is a public identifier, not an API secret. The installed tag lives in `site/src/components/Analytics.astro`, shared by the site layout.

## Behavior

- Loaded only in production builds on `luke.hallettdevlabs.com`.
- Development, localhost build previews, and other deployment hostnames send no Analytics requests.
- One ordinary Google tag configuration per page load sends the default page_view. No duplicate manual page_view is added.
- Google signals and ad personalization signals are disabled. Cookies are scoped to the portfolio hostname.
- The tag otherwise uses GA4's standard collection behavior, including browser/page information and analytics cookies. Enhanced measurement depends on the web stream's settings in Google Analytics; this code does not modify account settings.
- No custom user IDs, form values, contact information, or application data are sent by custom code. URL parameters are not stripped, preserving campaign attribution; never put sensitive data in public URLs.
- Search indexing remains controlled separately by `PORTFOLIO_INDEXING` and is enabled for the approved public site.

## Verification

Open the live site and inspect the browser Network panel for `gtag/js?id=G-D99PMKBL00` and a GA4 collection request using `tid=G-D99PMKBL00` and `en=page_view`. The stream owner can confirm activity in Analytics Realtime. Browser blockers may prevent requests. Network acceptance is not proof that a report has finished processing.

The implementation does not configure Search Console, Google Ads, Google signals, consent-management services, or Analytics account settings. The owner has separately completed Search Console setup and imported it into Bing Webmaster Tools.

[Google's page-view guidance](https://developers.google.com/analytics/devguides/collection/ga4/views) and [Google's privacy configuration](https://developers.google.com/tag-platform/security/guides/privacy).
