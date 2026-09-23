# Fresh or saved: a synthetic mobile example

A new, dependency-free teaching implementation inspired by the inspected Thermostat PWA. Read [the explanation and provenance](../index.md).

## Run independently

Node >=22.12.0. From this directory:

```sh
npm test
npm start
```

Open http://127.0.0.1:4174. The server binds only to loopback and uses synthetic readings. It makes no outbound calls and reads no environment files. Stop with Ctrl+C.

## Verify in a browser

1. Load the page online. Wait for the service worker to activate (developer tools → Application → Service Workers).
2. Refresh the reading. Observe “Live response” and the recorded time.
3. Stop the server, then select Refresh reading. Observe “Saved reading” and the unchanged recorded time. Reload the page to exercise the saved shell.
4. Restart the server and refresh. Observe a new live response.
5. The policy tests cover missing, expired, malformed, future-dated data, and unavailable storage. Browser integration verification from the repository root is documented in the root README.
6. For an update check, increment the shell cache version in `sw.js`, reload once online, wait for the update to install, and select Apply available update.

Use a dedicated browser profile or this dedicated port. To reset, unregister this origin’s service worker and clear its Cache Storage in developer tools. This affects only the example origin. Service workers require localhost or HTTPS.

## Files

- `policy.mjs`: tested fallback and age policy; the site renders this exact file.
- `sw.js`: shell precache, narrow read cache, prompted updates.
- `app.js`: source-aware status and observation time.
- `server.mjs`: static allowlist and synthetic reading endpoint.
- `policy.test.mjs`: meaningful failure-mode tests.

## Boundaries

No real thermostats, identity, control writes, push, secrets, or private services. Do not use this cache policy for authenticated responses without an identity and logout strategy. Browser support, storage eviction, and client clock skew remain constraints. The minimal SVG manifest is not a fully tested cross-platform installation package.

The code is newly authored, not copied from Thermostat. Source evidence is recorded in the entry. A public repository URL, release revision, and repository license remain owner decisions before publication; no upstream license is inferred.
