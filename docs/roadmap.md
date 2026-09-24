# Portfolio contact integration

## Current approach

The owner supplied a GHL survey embed for consulting inquiries. The portfolio hosts a dedicated `/contact/` page containing only the survey iframe and GHL's resizing script; the page links to the direct survey and LinkedIn if the embed does not load. The receiving email address and any GHL credentials are absent from the repository. The survey host is `api.adlsys.net`.

The owner reported creating the GHL subaccount, three Opportunity custom fields, a survey, workflow, and pipeline. CRM submission and repeat-submission behavior require an end-to-end check before claiming lead capture is verified. No marketing automation or response-time commitment is represented by the site.

## Future changes

A first-party backend remains optional. If added later, store credentials server-side and define spam handling, data retention, and failure behavior before replacing the GHL embed.
