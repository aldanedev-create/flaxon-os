const CACHE = "flaxon-os-v4";
const SHELL = [
  "/", "/offline.html", "/manifest.webmanifest",
  "/assets/icons/icon-192.png", "/assets/icons/icon-512.png",
  "/assets/css/app.css", "/assets/js/os-core.js", "/assets/js/media.js",
  "/assets/js/wallpapers.js", "/assets/js/pyodide.js", "/assets/js/workspace.js",
  "/assets/js/component-loader.js", "/assets/js/pwa.js",
  "/assets/static/js/App.js", "/assets/static/js/components/Desktop.js",
  "/assets/static/js/components/Dock.js", "/assets/static/js/components/StatusBar.js",
  "/assets/static/js/components/VideoEditor.js", "/assets/static/js/components/WallpaperPicker.js",
  "/assets/static/js/components/PythonPlayground.js", "/assets/static/js/components/MediaLibrary.js",
  "/assets/static/js/components/AttackSurface.js", "/assets/static/js/components/WorkspaceTools.js",
  "/assets/static/js/components/StudyFiles.js"
];
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(SHELL.map(url => cache.add(url).catch(() => null)))));
});
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) return;
  const navigation = event.request.mode === "navigate";
  const liveAsset = navigation || requestUrl.pathname.endsWith("/App.js") || requestUrl.pathname.endsWith("/app.css");
  event.respondWith(
    (liveAsset ? fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE).then(cache => cache.put(event.request, response.clone()));
      return response;
    }) : caches.match(event.request).then(cached => cached || fetch(event.request)))
      .catch(() => navigation ? caches.match("/offline.html") : caches.match(event.request).then(cached => cached || caches.match("/")))
  );
});
