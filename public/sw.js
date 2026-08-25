const CACHE = "flaxon-os-v3";
const SHELL = ["/", "/offline.html", "/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/css/app.css", "/js/os-core.js", "/js/media.js", "/js/wallpapers.js", "/js/pyodide.js", "/js/workspace.js", "/js/component-loader.js", "/js/pwa.js", "/static/js/App.js", "/static/js/components/Desktop.js", "/static/js/components/Dock.js", "/static/js/components/StatusBar.js", "/static/js/components/VideoEditor.js", "/static/js/components/WallpaperPicker.js", "/static/js/components/PythonPlayground.js", "/static/js/components/MediaLibrary.js", "/static/js/components/AttackSurface.js", "/static/js/components/WorkspaceTools.js", "/static/js/components/StudyFiles.js"];
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
