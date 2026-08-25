# Flaxon OS

Flaxon OS is a local-first, installable developer and study workspace built
with Flaxon, Teloce `.vel` components, browser JavaScript, CSS, and IndexedDB.

It provides a window manager for tools, a bandwidth monitor, an authorized
security scanner, a scam/phishing heuristic checker, a code playground, and a
study workspace for notes and local media recordings.

The interface is split into independently compiled `.vel` components for the
desktop dock, status bar, and Flaxon Studio video editor. It is designed to
feel like a focused developer operating system while remaining installable as
a PWA/MSIX package.

Users can switch between six built-in CSS wallpapers from Appearance; the
choice is saved locally in the browser and the default theme remains available.

## Important deployment boundary

This application is designed to run on Vercel's Python runtime for HTTP
requests. Vercel Functions are not a durable WebSocket server, so the Vercel
profile uses polling and browser-local state for live panels. Use a separate
realtime service if cross-device WebSockets are required.

The hosted API never executes arbitrary Python. The browser playground runs
bounded Python in a Pyodide Web Worker after downloading the pinned runtime
from its CDN, while HTML, CSS, and JavaScript preview locally in an isolated
iframe. The first Python run needs network access; local notes and media do
not.

## Local development

```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
python -m pip install -r requirements.txt
python build.py
flaxon run app:app --reload
```

Open `http://127.0.0.1:8000`.

The local server serves the manifest, root-scoped service worker, and offline
fallback directly, so the install/offline behavior is the same shape locally
and on Vercel.

For local compiler diagnostics, set `FLAXON_DEBUG=true` explicitly. Debug mode
is disabled by default so an accidental production launch does not expose
development behavior.

## Vercel

```bash
vercel
```

The included `vercel.json` routes `/api/*` to `api/index.py` and serves the
PWA assets from `public/`. Set `FLAXON_DEBUG=false` in production.
