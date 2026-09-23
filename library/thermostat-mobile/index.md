---
title: A mobile experience that tells you when data is old
description: Thermostat’s PWA model, offline boundaries, and a small example of fresh versus saved readings.
category: Mobile experiences
tags: [PWA, Offline UX, Data freshness]
maturity: Working Example
sourceApplication: Thermostat
sourceMaturity: PWA implementation inspected; deployment not independently verified
reviewed: '2026-09-23'
example: thermostat-mobile
---

## The problem

A monitoring interface is useful on a phone only if it handles an unreliable connection honestly. A page that opens offline is not evidence that its displayed readings are current. The interface must preserve the time of observation and distinguish a network response from saved data.

Thermostat’s accepted mobile decision favors a React, TypeScript, and Vite progressive web application. The inspected implementation precaches the application shell, uses a network-first strategy for API readings, and displays offline and backend-unavailable messages. It also includes installation guidance, update prompts, and Web Push event handlers.

This entry isolates one decision: **keep a useful saved reading without presenting it as live**.

## When this fits

A PWA is a useful option when a shared browser interface and a simple installation path meet the product’s needs. Thermostat’s ADR identifies monitoring, charts, alerts, and settings as the main workload. It also records the cost: limited background execution and no native watch, widget, or direct platform integration from this approach alone.

Choose a native client when those device integrations are central. Choose a plain responsive website when installation and offline use add little value. Neither option removes the need to explain data freshness.

## Architecture and flow

1. The browser loads an application shell and registers a service worker.
2. A reading request tries the network with a bounded timeout.
3. A valid reading is displayed with its original observation time and saved.
4. If the request fails, a recent saved reading is returned with an explicit **saved** label.
5. If no valid reading remains, the interface shows **unavailable**, rather than a fabricated value.

The example’s `policy.mjs` holds the decision logic. `sw.js` supplies real network and Cache Storage adapters. `app.js` renders the source and observation time. `server.mjs` serves only an allowlisted set of files and generates a synthetic 72 °F reading. No source application service is contacted.

## Alternatives and tradeoffs

| Approach | Benefit | Cost |
| --- | --- | --- |
| Network only | No persisted reading to misinterpret | Unavailable during interruptions |
| Cache first | Immediate response | Can obscure more recent observations |
| Network first, bounded fallback | Current response when reachable; useful saved data otherwise | Timeout, expiry, and source labeling need explicit handling |

The original worker uses Workbox with a five-second network timeout, up to 50 cached entries, and a one-hour maximum age. The new teaching example uses a three-second abort, one synthetic endpoint, and an explicit one-hour age check. These are deliberate simplifications, not a line-for-line extraction or a claim of behavioral equivalence.

## Implementation notes

The annotated policy is displayed below from the actual example file during the site build. On GitHub, open [the policy implementation](example/policy.mjs).

The cache policy permits only same-origin GET requests to the demo reading endpoint. It does not cache write operations or other API paths. A failed cache write does not turn a successful network read into an error. Missing, expired, future-dated, or malformed saved data produces an unavailable state.

The source application’s worker matches the broader `/api/v1/` path. That implementation should not be treated as an authorization-aware caching recipe. Before applying this idea to authenticated data, define which responses may persist and how logout, identity changes, shared devices, and cache deletion interact.

## Setup and verification

From this entry’s `example/` directory, with Node 22.12 or newer:

```sh
npm test
npm start
```

Open `http://127.0.0.1:4174`. No dependency installation, account, environment file, or site build is needed.

Visit online once and wait for the service worker to activate. Refresh the reading, then stop the demo server. Refresh the reading again: the saved value should appear with a saved-data warning and the same observation time. Reloading the page should still load its saved shell. Restart the server and refresh to return to a live response. The automated tests exercise expiry, invalid data, offline fallback, and storage failures without waiting an hour.

See the [example README](example/README.md) for browser verification and reset instructions.

## Limitations and lessons

This is an illustrative cache and presentation example, not the complete Thermostat mobile application. It has no authentication, device control, push delivery, background sync, React UI, or production deployment. The manifest supports an installable shape; installation behavior and icon requirements vary by browser. The minimal SVG icon is not an assertion of full iOS installation parity.

The cache age uses the client clock and the reading’s timestamp. Clock skew can reject a valid reading; time-sensitive production systems need a deliberate policy. Cache Storage can be evicted by the browser. Previously saved data is never a substitute for live control-system feedback.

Service-worker updates wait for an explicit user action. This keeps a new shell from silently replacing an active session. Cached shell files require a cache version change when edited. An offline shell and fresh observations are separate promises: explain both.

## Source provenance

Reviewed on 2026-09-23 against Thermostat revision `bd080b645f5a84f7d08ea8c7c37bfbb08c2f4856`, with no working-tree changes reported during inspection:

- `docs/adr/0002-react-pwa.md`: accepted client choice and platform tradeoffs.
- `frontend/vite.config.ts`: manifest, custom service worker, and prompted updates.
- `frontend/src/sw.ts`: precaching, network-first reads, and push event handlers.
- `frontend/src/components/pwa-status.tsx`: offline and backend warnings, installation, and update UI.

The runnable example is newly authored here with synthetic data. No private source file, configuration, credential, address, or device data was copied. The source revision records the evidence reviewed; it does not establish current production state. Source ownership and permission for any future verbatim extraction must be reviewed separately. No redistribution license is asserted for the source application.

Thermostat owns its production implementation. This repository owns the curated explanation and example. Atlas owns application discovery and operational context; see the [Atlas showcase](https://atlas.hallettdevlabs.com).
