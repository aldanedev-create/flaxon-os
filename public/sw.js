const CACHE = "flaxon-os-v3";
const SHELL = ["/", "/offline.html", "/manifest.webmanifest", "/assets/icons/icon-192.png", "/assets/icons/icon-512.png", "/assets/css/app.css", "/assets/js/os-core.js", "/assets/js/media.js", "/assets/js/wallpapers.js", "/assets/js/pyodide.js", "/assets/js/workspace.js", "/assets/js/component-loader.js", "/assets/js/pwa.js", "/assets/static/js/App.js", "/assets/static/js/components/Desktop.js", "/assets/static/js/components/Dock.js", "/assets/static/js/components/StatusBar.js", "/assets/static/js/components/VideoEditor.js", "/assets/static/js/components/WallpaperPicker.js", "/assets/static/js/components/PythonPlayground.js", "/assets/static/js/components/MediaLibrary.js", "/assets/static/js/components/AttackSurface.js", "/assets/static/js/components/WorkspaceTools.js", "/assets/static/js/components/StudyFiles.js"];
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache =>
      Promise.all(SHELL.map(url => cache.add(url).catch(() => null)))
    )
  );
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    )
  );
});
self.addEventListener("fetch", event => { if (event.request.method !== "GET") return; const navigation = event.request.mode === "navigate"; event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => { if (response.ok && new URL(event.request.url).origin === self.location.origin) { const copy = response.clone(); caches.open(CACHE).then(cache => cache.put(event.request, copy)); } return response; }).catch(() => navigation ? caches.match("/offline.html") : caches.match("/")))); });
