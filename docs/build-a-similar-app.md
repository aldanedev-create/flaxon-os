# Build a similar Flaxon + `.vel` application

This guide builds a small installable developer workspace using the same architecture as Flaxon OS.

## 1. Create the project

```powershell
mkdir my-flaxon-app
cd my-flaxon-app
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install flaxon teloce-py
```

Use the versions tested by your project and record them in `pyproject.toml` or `requirements.txt`.

Recommended structure:

```text
my-flaxon-app/
  app.py
  build.py
  templates/index.html
  static/js/App.vel
  static/js/components/Notes.vel
  public/manifest.webmanifest
  public/sw.js
  public/css/app.css
  public/static/js/
```

## 2. Create a `.vel` component

`static/js/App.vel`:

```html
<template>
  <main class="app-shell">
    <h1>{{ title }}</h1>
    <input v-model="newTask" placeholder="Add a task" />
    <button @click="addTask">Add task</button>
    <ul>
      <li v-for="task in tasks" :key="task.id">{{ task.text }}</li>
    </ul>
  </main>
</template>

<script>
export default {
  data() {
    return { title: "My Flaxon App", newTask: "", tasks: [] };
  },
  methods: {
    addTask() {
      const text = this.newTask.trim();
      if (!text) return;
      this.tasks = [...this.tasks, { id: Date.now(), text }];
      this.newTask = "";
    }
  }
};
</script>
```

The original Teloce API remains available too. Projects may use `<if>`, `<for>`, `@click`, and `:model`; compatible `v-if`, `v-for`, `@click`, and `v-model` syntax can be used where supported by the compiler version.

## 3. Add the Python/Flaxon server

`app.py`:

```python
from pathlib import Path

from flaxon import Flaxon
from flaxon.jinax import Jinax

ROOT = Path(__file__).parent
app = Flaxon("my-flaxon-app")
app.use_templates(Jinax(ROOT / "templates"))

@app.get("/")
async def home(request):
    return await request.render("index.html", {"title": "My Flaxon App"})

@app.get("/api/health")
async def health(request):
    return {"ok": True}
```

Keep server responsibilities in Python: authentication, validation, APIs, database access, rate limits, and security policy. Keep browser interaction in `.vel` components.

## 4. Load the compiled component

`templates/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="manifest" href="/manifest.webmanifest">
  <link rel="icon" href="/icons/icon-192.png" type="image/png">
  <link rel="stylesheet" href="/assets/css/app.css">
</head>
<body>
  <div id="app"></div>
  <script src="/assets/js/pwa.js"></script>
  <script type="module">
    import { mount } from "/assets/static/js/App.js";
    mount("#app");
  </script>
</body>
</html>
```

## 5. Compile `.vel` files

Build your source files before running the application:

```powershell
python build.py
```

The build should write generated modules to `public/static/js/`. Do not edit generated files by hand. Edit `.vel` source, rebuild, and test the generated output.

For a reproducible deployment, pin `teloce-py`, check in the generated bundle, and make the deployment build validate that the expected files exist.

## 6. Run locally

```powershell
flaxon run app:app --reload
```

Open the printed HTTPS or local URL. A productive development loop is:

1. Edit a `.vel` component.
2. Run `python build.py`.
3. Refresh the browser.
4. Test the interaction and API boundary.
5. Run the automated tests before committing.

## 7. Add local persistence safely

Use IndexedDB for private device-local notes, files, recordings, and media. Use a database API in Flaxon when users need accounts, sharing, backups, or multi-device synchronization. Do not assume serverless memory is durable.

For recordings and uploads:

- Ask for microphone/camera permission only after a user click.
- Enforce file-size and MIME-type limits.
- Revoke object URLs after use.
- Explain where data is stored and how it is deleted.
- Never place private blobs in public static directories.

## 8. Make it installable as a PWA

Add a valid `public/manifest.webmanifest`:

```json
{
  "name": "My Flaxon App",
  "short_name": "Flaxon App",
  "id": "/?app=my-flaxon-app",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "landscape",
  "theme_color": "#101827",
  "background_color": "#0b1220",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ],
  "screenshots": [
    { "src": "/screenshots/desktop.png", "sizes": "1280x720", "type": "image/png", "form_factor": "wide" },
    { "src": "/screenshots/mobile.png", "sizes": "390x844", "type": "image/png", "form_factor": "narrow" }
  ]
}
```

Register a root-scoped service worker at `/sw.js`:

```js
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" });
  });
}
```

Use real PNG dimensions. A file named `icon-192.png` must actually be `192×192`; PWABuilder checks this.

## 9. Add real tests

Test at least:

- Initial page load and service-worker activation.
- Manifest fetch and icon dimensions.
- Desktop and mobile overflow.
- Every launcher icon and navigation button.
- IndexedDB save, reload, export, and deletion.
- API validation and error responses.
- Offline fallback after the service worker has cached the shell.
- PWA install and Windows package generation.

## 10. Deploy and package

Deploy the Python app to your host, then test the public HTTPS URL—not only localhost. Run PWABuilder against the deployed URL. Resolve service-worker, manifest, icon, and screenshot warnings before generating a Windows package.

For a store package, enter the identity reserved in Microsoft Partner Center. For a sideload package, keep the generated certificate and installation script with the package. Test installation on a clean Windows machine and sign releases with the certificate appropriate for your distribution channel.

