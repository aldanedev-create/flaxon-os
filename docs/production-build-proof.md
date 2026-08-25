# What the production build proves

Flaxon OS is a working production-style reference application for the Flaxon + Teloce stack. It is deployed at [flaxon-os.vercel.app](https://flaxon-os.vercel.app/), runs as a browser application, registers a root-scoped service worker, and can be packaged by PWABuilder as a Windows MSIX package.

## What `.vel` proves in this application

The `.vel` files are not documentation-only mockups. They are the source files compiled into the JavaScript served to the browser.

The production build demonstrates:

- Component templates compiled from `.vel` into browser JavaScript.
- Reactive state for navigation, scanner results, notes, recordings, media, and PWA status.
- Event handlers such as `@click` for launcher icons, page navigation, file actions, recordings, and embedded apps.
- Conditional rendering with `v-show` and list rendering with `v-for`.
- Dynamic attributes for iframe URLs, links, classes, and form models.
- Multiple independently compiled components mounted together in one application.
- Interoperation with normal browser APIs: IndexedDB, MediaRecorder, Service Workers, Fetch, Web Workers, and iframes.
- CSS and JavaScript integration without requiring TypeScript.

For example, these controls are authored in `static/js/App.vel`:

```html
<button @click="open('study')">Study files</button>
<button @click="open('video')">Media library</button>
```

Teloce compiles them into the generated `public/static/js/App.js` bundle. The browser does not execute the `.vel` source directly in production; it executes the generated JavaScript artifact.

## What Flaxon proves

Flaxon provides the Python application boundary and deployment integration:

- `app.py` creates the Flaxon application and registers middleware.
- Flaxon serves the HTML template and API endpoints.
- Python modules provide health, network, scanner, checker, playground, and error-solving endpoints.
- Request limits, request IDs, rate limiting, trusted hosts, CSP, and security headers are configured at the server boundary.
- `build.py` keeps the tested frontend artifacts reproducible during Vercel deployment.
- The same project can run locally through a Python entry point and deploy as an ASGI application.

The result is a real division of responsibility:

```text
.vel source -> Teloce compiler -> browser JavaScript
Python modules -> Flaxon ASGI app -> HTTP/API responses
IndexedDB + browser APIs -> local user workspace
Vercel -> HTTPS hosting, serverless API, static assets
PWABuilder -> Windows package artifacts
```

## What this does not prove

This build is strong evidence that the stack works for a real application, but it is not a claim that every workload is automatically production-ready. A production team must still choose an external database when data must sync across devices, use distributed rate limiting, isolate untrusted code execution, monitor errors, test browser compatibility, and sign the Windows package with the correct certificate.

The scanner is an authorized defensive tool and does not prove vulnerability. The playground intentionally does not provide unrestricted server-side Python execution. These boundaries are part of the production design.

## Evidence from the release

The release was tested with:

- Live page navigation across the OS shell and embedded partner applications.
- Study Files and Media Library access while an external app is open.
- Desktop and mobile layouts with no horizontal overflow.
- Active root-scoped service-worker registration.
- PWABuilder manifest analysis with valid screenshots and icon dimensions.
- A generated Windows package containing `.msix`, `.msixbundle`, installation script, and package metadata.

The generated frontend bundle is checked into `public/static/js/` so deployment does not silently replace it with a different compiler version.

