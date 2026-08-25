# Production checklist

Before a public release:

1. Set `FLAXON_DEBUG=false`, configure trusted proxy/origin settings, and set `FLAXON_TRUSTED_HOSTS` to a comma-separated production host list.
   The app applies a 2 MB body limit, request IDs, a configurable per-instance request limit (`FLAXON_REQUESTS_PER_MINUTE`, default 300), optional trusted hosts, and secure response headers. Use a distributed limiter/WAF in front of a public serverless deployment.
2. Add a real distributed rate limiter and request-body limits. In-memory limits do not work reliably across serverless instances.
   The scanner now has a bounded per-instance guard, but a public deployment still needs a distributed limiter/WAF policy.
3. Add CSP, HTTPS, secure response headers, and a restrictive service-worker cache policy. The generated browser runtime uses a CSP-safe evaluator for common template expressions and the Flaxon shell runs without `'unsafe-eval'`; advanced prop defaults/validators and arbitrary JavaScript expressions still require an explicit compatibility review before use in a strict CSP deployment.
4. Test Chrome, Edge, Android, and Windows PWABuilder install flows. The repository includes 192px and 512px PNG icons generated from `public/icons/icon.svg`; regenerate them with `node tools/rasterize-icons.mjs` after changing the source icon.
5. Decide whether IndexedDB-only storage is acceptable. It is device-local and can be cleared by the browser.
6. Test the offline shell and service-worker update flow after every asset-cache version change.
7. Keep server-side Python execution disabled on public Vercel deployments unless it is moved to an isolated worker with a timeout, memory limit, filesystem sandbox, no credentials, and restricted network egress.
8. Add consent and a retention policy for recordings. Browser permissions must be requested only after an explicit user action.
9. Run scanner tests against owned staging hosts and retain evidence that no private, loopback, metadata, credentialed, or non-standard-port target can be reached. The scanner resolves and validates public addresses, connects to that validated address while retaining hostname TLS identity, disables inherited proxies, and does not follow redirects; public deployments still need an egress firewall or isolated scanning worker as a defense in depth against cloud-metadata exposure.
10. Add end-to-end tests for offline startup, IndexedDB upgrades, recording failures, scanner errors, and service-worker cache invalidation.
11. Build and sign the MSIX package only from a reproducible release artifact.
12. Replace the placeholder security contact in `public/.well-known/security.txt` before publishing.
   Or set `FLAXON_SECURITY_CONTACT=mailto:security@your-domain.example` before `python build.py`; the build will write the release contact.
13. Keep the Vercel static-asset headers and no-cache service-worker rules in `vercel.json`; direct static responses do not necessarily pass through the Flaxon middleware stack.

The service worker is registered at `/sw.js` with `/` scope. The local Flaxon
server explicitly serves `/sw.js`, `/manifest.webmanifest`, and
`/offline.html`, while Vercel serves the same generated files from `public/`.
Keeping the worker at the site root is required for offline navigation and PWA
installation outside the `/assets/` subtree.

The desktop shell persists window state locally. This is intentionally device-local and should be reset through the application’s future workspace reset control rather than treated as server state.
