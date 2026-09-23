# Discovery and first-iteration decisions

Reviewed 2026-09-23. Reference repositories were read-only. No project or ancestor AGENTS.md was present in the empty portfolio. Thermostat AGENTS.md and its inherited architecture/memory files, plus FMBP architecture instructions, were read. Reference instructions do not authorize reference edits.

## Inspected sources

**Atlas / hallettdevlabs-infra**: the current checkout was updated by the owner during discovery to `95964af` (Atlas 1.6.0 promotion). Reviewed `docs/atlas-v2/contract.md`, `contracts/atlas-v2/`, `app-atlas/src/lib/public-catalog.ts`, `app-atlas/src/lib/content-snapshot.ts`, and `app-atlas/scripts/sync-application-content.ts`. The contract distinguishes private operational inputs from public content; implementation checks production receipts and public audience plus approved paths. Documentation snapshots track accepted artifacts independently of the UI image. This is a source review, not live deployment verification. An older second checkout was not used as current authority.

**Thermostat**: reviewed commit `bd080b645f5a84f7d08ea8c7c37bfbb08c2f4856`; working tree reported clean. `frontend/vite.config.ts`, `frontend/src/sw.ts`, and `frontend/src/components/pwa-status.tsx` establish a PWA, precaching, network-first API cache, install/update prompts, offline warnings, and push handlers. ADR 0002 records the mobile decision. ADR 0003 and authentication docs describe passkey enrollment and server sessions; the inspected app middleware does not establish that design as implemented. Do not label passkey authentication production-proven from these documents. This local Thermostat revision predates the newer release mentioned in Atlas’s updated contract; a future auth article needs a current source review.

**FMBP**: located `fmbp-architecture`, `beauty_finder_api`, and `beauty_finder`. Read current architecture README and inspected API commit `927cd569f50cf6fd9e7edb740c7d7f448c939f92`, particularly `auth_core/core.py`. The module describes itself as a local, production-shaped core without Lambda wiring/network client. It implements an encrypted invitation codec and scoped session model; this does not establish production integration. Older PostgreSQL/Admin architecture is explicitly superseded by the GHL/S3 direction. No FMBP source was extracted.

## Decisions

One repository, independent site/example dependencies, static Astro, Markdown collection outside `site/`, no CMS/database/authentication. The first entry demonstrates mobile cache freshness because its implementation evidence is clear and a useful example can be freshly authored with synthetic data. Authentication entries and comparison remain planned.

Reuse Atlas’s readable shell, teal accents, restrained borders, status labels, and accessible navigation conventions. The portfolio adds warm paper tones, editorial typography, and a notebook-style diagram. No copied Atlas component or private content feed.

Stable Atlas links are enough for this iteration. No new contract, synchronization job, operational endpoints, or Atlas release is required. Proposed optional backlink work is recorded under `handoffs/`, not implemented.
