# Privacy and local data

Flaxon OS does not require an account. Notes, workspace records, imported media, recordings, wallpaper selection, and window state are stored in the browser's IndexedDB or local storage on the current device.

The application sends network data only when the user starts a network measurement, authorized scanner request, phishing check, or other explicit API action. The server does not receive IndexedDB data automatically. The browser Python workspace downloads Pyodide from the pinned CDN on first use and executes code in a Web Worker.

Workspace backups can contain media blobs and should be treated as private files. Use the browser's storage controls or the application reset flow to remove local data. Clearing browser storage can permanently remove data that has not been exported.

The security scanner is an evidence-gathering tool for systems the user owns or is authorized to test. It is not a guarantee that a site is safe and does not perform exploitation.
