# Flaxon OS documentation

## Start here

- [Production build proof](production-build-proof.md) — what the deployed Flaxon OS demonstrates about `.vel`, Teloce, Flaxon, PWA support, and Windows packaging.
- [Build a similar application](build-a-similar-app.md) — a complete path from a new Python project to a compiled `.vel` frontend, local storage, PWA, deployment, and MSIX packaging.

Flaxon OS is a local-first, installable workspace built with Flaxon on the server and Teloce `.vel` components in the browser. It is designed to run with a single Python entry point while keeping user notes and recordings in the browser’s IndexedDB.

## Run it

```powershell
cd flaxon-os
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python build.py
flaxon run app:app --reload
```

Open the URL printed by Flaxon. The frontend is `static/js/App.vel`; the compiler writes `public/static/js/App.js`. The template loads the generated module, so developers can edit one `.vel` file and restart or rebuild with `python build.py`.

## Features

- **Windows/workspace:** the Teloce component uses the original `<if>`, `<for>`, `@click`, and `:model` API as well as compatible `v-if`, `v-for`, and `:class` aliases.
- **Local storage:** notes and MediaRecorder audio/video blobs are stored in IndexedDB. They are not uploaded and are not available on another device unless an export/sync system is added.
- **Network:** the bandwidth panel measures a request round trip and reports the browser’s Network Information API estimate when available.
- **Scanner and attack surface:** only public HTTP(S), standard ports, no credentials, and same-origin link discovery are accepted. It reports observable headers; it is not a vulnerability guarantee and never performs exploitation.
- **Playground:** Python is syntax-checked. HTML/CSS/JS preview can be added safely in a sandboxed iframe; arbitrary Python execution is intentionally disabled on the hosted service.
- **Browser Python:** the dedicated Python workspace runs bounded source in a pinned Pyodide Web Worker loaded from CDN. The first run requires network access to download Pyodide; server-side Python execution remains disabled.
- **Error solver:** deterministic local hints classify common traceback types without sending source code to a third party.
- **Video studio:** a separate `VideoEditor.vel` component imports multiple local videos, stores source blobs in IndexedDB, previews the selected clip, keeps selectable timeline clips with in/out points, restores the project after reload, and exports WebM clips/timelines through the browser's `MediaRecorder` where supported. Recorder formats, seek failures, permissions, object URLs, and tracks are cleaned up explicitly. It is a browser editor, not yet a replacement for a full non-linear editor with frame-accurate multi-track final rendering.
- **PWA:** the manifest, service worker, responsive layout, and standalone display are included. PWABuilder/MSIX packaging still requires testing generated assets and signing in the target Windows environment.
- **Appearance:** the OS shell includes a default CSS wallpaper plus Aurora, Deep Ocean, Violet Dusk, Solar Sunrise, and Graphite wallpapers. Selection is persisted locally and does not require an account or network request.
- **Workspace backup:** local notes, projects, recordings, and media can be exported to a JSON backup and imported on another browser/device. Backups may contain large media data and should be kept private.

## Vercel

Deploy from this directory after installing the Python dependencies. `api/index.py` exposes the Flaxon ASGI app and `vercel.json` routes API requests to it. The build command compiles the `.vel` component before deployment. Keep state in IndexedDB or an external durable service; serverless memory is not durable. The app uses HTTP polling and browser APIs rather than requiring a server WebSocket.

## Security and operating policy

The no-login requirement means every public endpoint must be treated as abuseable. Put the deployment behind Vercel WAF/rate limits, cap request bodies and scan frequency, and consider an authenticated private deployment for the scanner. Only scan assets you own or have written authorization to test. Do not enable arbitrary server-side Python execution without a separately isolated sandbox, quotas, egress policy, and review.

## CLI

```powershell
python cli.py doctor
python cli.py build
python cli.py scan https://example.com
```

The CLI does not execute user-submitted code or exploit scan targets.

`doctor` checks the backend entrypoint, PWA files, privacy documentation, every
source `.vel` component, and every generated component module. Run it after a
clean build before deployment. Use `python cli.py doctor --release` to fail on
placeholder release values such as the example security contact. Release mode
also validates manifest icon paths and PNG signatures, the service-worker shell,
required media/Pyodide assets, package metadata, and accidental `FLAXON_DEBUG`.
Set `FLAXON_SECURITY_CONTACT` to a real `mailto:` or HTTPS contact while running
the final build; the repository intentionally keeps an example placeholder.

## Frontend structure

The interface is intentionally split into independently compiled components:

- `static/js/App.vel` — workspace state and application tools.
- `static/js/components/Dock.vel` — desktop dock navigation.
- `static/js/components/StatusBar.vel` — live status clock.
- `static/js/components/VideoEditor.vel` — local video editing workspace with selectable clips, in/out decisions, single-clip export, and sequential timeline WebM export where browser capture supports it.
- `static/js/components/PythonPlayground.vel` — browser Python workspace backed by the Pyodide worker.
- `static/js/components/MediaLibrary.vel` — local media assets and deletion controls.
- `static/js/components/AttackSurface.vel` — authorized same-origin attack-surface mapping UI.
- `static/js/components/WorkspaceTools.vel` — local workspace export/import controls.

`python build.py` compiles all ten `.vel` components into `public/static/js/`; `component-loader.js` mounts the supporting components into the OS shell.
