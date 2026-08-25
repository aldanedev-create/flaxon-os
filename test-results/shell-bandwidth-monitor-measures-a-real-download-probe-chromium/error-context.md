# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shell.spec.mjs >> bandwidth monitor measures a real download probe
- Location: tests\browser\shell.spec.mjs:119:1

# Error details

```
Error: expect(locator).toContainText(expected) failed

Locator: locator('body')
Timeout: 5000ms
- Expected substring  -  1
+ Received string     + 14

- Measured 262144 bytes locally.
+
+   Flaxon OSOverviewBandwidthScannerPlaygroundStudyError solverVideo studioNetworkLocal-firstInstallAppearance_[]Workspace overviewA local-first developer and study workspace. Your notes and recordings remain in this browser.0Open tools0Local notesonlineNetwork statusSecurity boundaryThe scanner is restricted to public HTTP(S) targets. The hosted playground checks Python syntax and previews HTML/CSS/JS; it does not execute arbitrary server-side code.Bandwidth monitorMeasure a real request to this server. Nothing is uploaded or stored.Measure nowMeasuring...314msRound trip-MbpsMeasured downloadunknownConnection typeAuthorized security scannerOnly scan systems you own or have permission to test.AnalyzeCheck scam riskScam checker: Status: - Pages discovered: Developer playgroundPython is syntax-checked only in the hosted deployment. HTML, CSS, and JS preview runs in a sandboxed browser iframe.Check Python syntaxPreview HTML/CSS/JSStudy workspaceSave locallyRecord audioRecord videoDeveloper error solverPaste a traceback for deterministic, privacy-preserving troubleshooting hints.Analyze error
+   
+   
+   
+   
+   
+   
+   OSHomeSTStudy filesPYPythonSCScannerVIVideo StudioFlaxon OSxOSHomeNWBandwidth MonitorSCSecurity ScannerPYPython PlaygroundSTStudy WorkspaceVIVideo StudioERError SolverLocal deviceSettingsFLauncherHomePulseStudioStudyFlaxon OSReady10:20 PMAppearanceChoose a local desktop wallpaper.CloseDefault CSSAuroraDeep oceanViolet duskSolar sunriseGraphiteWallpaper is saved on this device.Python workspaceRuns in a Pyodide Web Worker inside your browser.RunStopReady. The first run downloads the pinned Pyodide runtime and may take up to 180 seconds.Media libraryLocal media assets used by Flaxon Studio.RefreshImport a video in Flaxon Studio to create your first local asset.Media stays on this device.Attack surfaceSame-origin public link inventory for authorized review.Map surfaceOnly public HTTP(S) same-origin links are included.Workspace backupExport or restore this device-local workspace.No account requiredExport backupImport backupReset local workspaceBackups may contain recordings and media; keep them private.Student file systemA private folder in this browser for notes, code, datasets, and project files.RefreshAdd filesSave text fileNo files yet. Add a file or save your first text note.Files stay in IndexedDB and are included in workspace backups. There is no account or server upload.Flaxon StudioLocal-first video editorImport videoImport a video to begin0clip(s)Selected in sOut ssIn Out Set inSet outSave projectExport clipExport timelineImport a local video. The source stays in this browser.
+   
+   
+
+
+

Call log:
  - Expect "toContainText" with timeout 5000ms
  - waiting for locator('body')
    3 × locator resolved to <body class="desktop-mode">…</body>
      - unexpected value "
  Flaxon OSOverviewBandwidthScannerPlaygroundStudyError solverVideo studioNetworkLocal-firstInstallAppearance_[]Workspace overviewA local-first developer and study workspace. Your notes and recordings remain in this browser.0Open tools0Local notesonlineNetwork statusSecurity boundaryThe scanner is restricted to public HTTP(S) targets. The hosted playground checks Python syntax and previews HTML/CSS/JS; it does not execute arbitrary server-side code.Bandwidth monitorMeasure a real request to this server. Nothing is uploaded or stored.Measure nowMeasuring...314msRound trip-MbpsMeasured downloadunknownConnection typeAuthorized security scannerOnly scan systems you own or have permission to test.AnalyzeCheck scam riskScam checker: Status: - Pages discovered: Developer playgroundPython is syntax-checked only in the hosted deployment. HTML, CSS, and JS preview runs in a sandboxed browser iframe.Check Python syntaxPreview HTML/CSS/JSStudy workspaceSave locallyRecord audioRecord videoDeveloper error solverPaste a traceback for deterministic, privacy-preserving troubleshooting hints.Analyze error
  
  
  
  
  
  
  
  
  


"
    - locator resolved to <body class="desktop-mode">…</body>
    - unexpected value "
  Flaxon OSOverviewBandwidthScannerPlaygroundStudyError solverVideo studioNetworkLocal-firstInstallAppearance_[]Workspace overviewA local-first developer and study workspace. Your notes and recordings remain in this browser.0Open tools0Local notesonlineNetwork statusSecurity boundaryThe scanner is restricted to public HTTP(S) targets. The hosted playground checks Python syntax and previews HTML/CSS/JS; it does not execute arbitrary server-side code.Bandwidth monitorMeasure a real request to this server. Nothing is uploaded or stored.Measure nowMeasuring...314msRound trip-MbpsMeasured downloadunknownConnection typeAuthorized security scannerOnly scan systems you own or have permission to test.AnalyzeCheck scam riskScam checker: Status: - Pages discovered: Developer playgroundPython is syntax-checked only in the hosted deployment. HTML, CSS, and JS preview runs in a sandboxed browser iframe.Check Python syntaxPreview HTML/CSS/JSStudy workspaceSave locallyRecord audioRecord videoDeveloper error solverPaste a traceback for deterministic, privacy-preserving troubleshooting hints.Analyze error
  
  
  
  
  
  
  OSHomeSTStudy filesPYPythonSCScannerVIVideo StudioFlaxon OSxOSHomeNWBandwidth MonitorSCSecurity ScannerPYPython PlaygroundSTStudy WorkspaceVIVideo StudioERError SolverLocal deviceSettingsFLauncherHomePulseStudioStudyFlaxon OSReadyAppearanceChoose a local desktop wallpaper.CloseDefault CSSAuroraDeep oceanViolet duskSolar sunriseGraphiteWallpaper is saved on this device.Python workspaceRuns in a Pyodide Web Worker inside your browser.RunStopReady. The first run downloads the pinned Pyodide runtime and may take up to 180 seconds.Media libraryLocal media assets used by Flaxon Studio.RefreshMedia stays on this device.Attack surfaceSame-origin public link inventory for authorized review.Map surfaceOnly public HTTP(S) same-origin links are included.Workspace backupExport or restore this device-local workspace.No account requiredExport backupImport backupReset local workspaceBackups may contain recordings and media; keep them private.Student file systemA private folder in this browser for notes, code, datasets, and project files.RefreshAdd filesSave text fileNo files yet. Add a file or save your first text note.Files stay in IndexedDB and are included in workspace backups. There is no account or server upload.Flaxon StudioLocal-first video editorImport videoImport a video to begin0clip(s)Selected in sOut ssIn Out Set inSet outSave projectExport clipExport timelineImport a local video. The source stays in this browser.
  
  


"
    2 × locator resolved to <body class="desktop-mode">…</body>
      - unexpected value "
  Flaxon OSOverviewBandwidthScannerPlaygroundStudyError solverVideo studioNetworkLocal-firstInstallAppearance_[]Workspace overviewA local-first developer and study workspace. Your notes and recordings remain in this browser.0Open tools0Local notesonlineNetwork statusSecurity boundaryThe scanner is restricted to public HTTP(S) targets. The hosted playground checks Python syntax and previews HTML/CSS/JS; it does not execute arbitrary server-side code.Bandwidth monitorMeasure a real request to this server. Nothing is uploaded or stored.Measure nowMeasuring...314msRound trip-MbpsMeasured downloadunknownConnection typeAuthorized security scannerOnly scan systems you own or have permission to test.AnalyzeCheck scam riskScam checker: Status: - Pages discovered: Developer playgroundPython is syntax-checked only in the hosted deployment. HTML, CSS, and JS preview runs in a sandboxed browser iframe.Check Python syntaxPreview HTML/CSS/JSStudy workspaceSave locallyRecord audioRecord videoDeveloper error solverPaste a traceback for deterministic, privacy-preserving troubleshooting hints.Analyze error
  
  
  
  
  
  
  OSHomeSTStudy filesPYPythonSCScannerVIVideo StudioFlaxon OSxOSHomeNWBandwidth MonitorSCSecurity ScannerPYPython PlaygroundSTStudy WorkspaceVIVideo StudioERError SolverLocal deviceSettingsFLauncherHomePulseStudioStudyFlaxon OSReadyAppearanceChoose a local desktop wallpaper.CloseDefault CSSAuroraDeep oceanViolet duskSolar sunriseGraphiteWallpaper is saved on this device.Python workspaceRuns in a Pyodide Web Worker inside your browser.RunStopReady. The first run downloads the pinned Pyodide runtime and may take up to 180 seconds.Media libraryLocal media assets used by Flaxon Studio.RefreshImport a video in Flaxon Studio to create your first local asset.Media stays on this device.Attack surfaceSame-origin public link inventory for authorized review.Map surfaceOnly public HTTP(S) same-origin links are included.Workspace backupExport or restore this device-local workspace.No account requiredExport backupImport backupReset local workspaceBackups may contain recordings and media; keep them private.Student file systemA private folder in this browser for notes, code, datasets, and project files.RefreshAdd filesSave text fileNo files yet. Add a file or save your first text note.Files stay in IndexedDB and are included in workspace backups. There is no account or server upload.Flaxon StudioLocal-first video editorImport videoImport a video to begin0clip(s)Selected in sOut ssIn Out Set inSet outSave projectExport clipExport timelineImport a local video. The source stays in this browser.
  
  


"
    7 × locator resolved to <body class="desktop-mode">…</body>
      - unexpected value "
  Flaxon OSOverviewBandwidthScannerPlaygroundStudyError solverVideo studioNetworkLocal-firstInstallAppearance_[]Workspace overviewA local-first developer and study workspace. Your notes and recordings remain in this browser.0Open tools0Local notesonlineNetwork statusSecurity boundaryThe scanner is restricted to public HTTP(S) targets. The hosted playground checks Python syntax and previews HTML/CSS/JS; it does not execute arbitrary server-side code.Bandwidth monitorMeasure a real request to this server. Nothing is uploaded or stored.Measure nowMeasuring...314msRound trip-MbpsMeasured downloadunknownConnection typeAuthorized security scannerOnly scan systems you own or have permission to test.AnalyzeCheck scam riskScam checker: Status: - Pages discovered: Developer playgroundPython is syntax-checked only in the hosted deployment. HTML, CSS, and JS preview runs in a sandboxed browser iframe.Check Python syntaxPreview HTML/CSS/JSStudy workspaceSave locallyRecord audioRecord videoDeveloper error solverPaste a traceback for deterministic, privacy-preserving troubleshooting hints.Analyze error
  
  
  
  
  
  
  OSHomeSTStudy filesPYPythonSCScannerVIVideo StudioFlaxon OSxOSHomeNWBandwidth MonitorSCSecurity ScannerPYPython PlaygroundSTStudy WorkspaceVIVideo StudioERError SolverLocal deviceSettingsFLauncherHomePulseStudioStudyFlaxon OSReady10:20 PMAppearanceChoose a local desktop wallpaper.CloseDefault CSSAuroraDeep oceanViolet duskSolar sunriseGraphiteWallpaper is saved on this device.Python workspaceRuns in a Pyodide Web Worker inside your browser.RunStopReady. The first run downloads the pinned Pyodide runtime and may take up to 180 seconds.Media libraryLocal media assets used by Flaxon Studio.RefreshImport a video in Flaxon Studio to create your first local asset.Media stays on this device.Attack surfaceSame-origin public link inventory for authorized review.Map surfaceOnly public HTTP(S) same-origin links are included.Workspace backupExport or restore this device-local workspace.No account requiredExport backupImport backupReset local workspaceBackups may contain recordings and media; keep them private.Student file systemA private folder in this browser for notes, code, datasets, and project files.RefreshAdd filesSave text fileNo files yet. Add a file or save your first text note.Files stay in IndexedDB and are included in workspace backups. There is no account or server upload.Flaxon StudioLocal-first video editorImport videoImport a video to begin0clip(s)Selected in sOut ssIn Out Set inSet outSave projectExport clipExport timelineImport a local video. The source stays in this browser.
  
  


"

```

```yaml
- complementary:
  - navigation:
    - button "Overview"
    - button "Bandwidth"
    - button "Scanner"
    - button "Playground"
    - button "Study"
    - button "Error solver"
    - button "Video studio"
- strong: Network
- text: Local-first
- button "Install"
- button "Appearance"
- button "_"
- button "[]"
- main:
  - heading "Bandwidth monitor" [level=2]
  - paragraph: Measure a real request to this server. Nothing is uploaded or stored.
  - button "Measure now"
  - text: Measuring...
  - strong: 314ms
  - text: Round trip
  - strong: "-Mbps"
  - text: Measured download
  - strong: unknown
  - text: Connection type
- button "OS Home"
- button "ST Study files"
- button "PY Python"
- button "SC Scanner"
- button "VI Video Studio"
- button "Start": F Launcher
- button "Home"
- button "Pulse"
- button "Studio"
- button "Study"
- contentinfo: Flaxon OS Ready 10:20 PM
```

# Test source

```ts
  23  |   await expect(page.locator("body")).toContainText("Developer playground");
  24  |   await expect(page.locator("body")).toHaveClass(/desktop-mode/);
  25  | });
  26  | 
  27  | test("wallpaper choice persists locally", async ({ page }) => {
  28  |   const errors = [];
  29  |   page.on("pageerror", error => errors.push(error.message));
  30  |   page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  31  |   await page.goto("/");
  32  |   await page.locator('[data-wallpaper="aurora"]').click();
  33  |   await expect.poll(() => page.locator("html").getAttribute("data-wallpaper")).toBe("aurora");
  34  |   expect(await page.evaluate(() => localStorage.getItem("flaxon-wallpaper"))).toBe("aurora");
  35  |   expect(errors).toEqual([]);
  36  | });
  37  | 
  38  | test("manifest and offline shell are served", async ({ page, request }) => {
  39  |   const manifest = await request.get("/manifest.webmanifest");
  40  |   expect(manifest.ok()).toBeTruthy();
  41  |   expect((await manifest.json()).display).toBe("standalone");
  42  |   const worker = await request.get("/sw.js");
  43  |   expect(worker.ok()).toBeTruthy();
  44  |   const workerScript = await request.get("/assets/js/pwa.js");
  45  |   expect(await workerScript.text()).toContain('register("/sw.js", { scope: "/" })');
  46  |   const icon = await request.get("/assets/icons/icon-512.png");
  47  |   expect(icon.ok()).toBeTruthy();
  48  |   expect(icon.headers()["content-type"]).toContain("image/png");
  49  |   const offline = await request.get("/offline.html");
  50  |   expect(offline.ok()).toBeTruthy();
  51  |   expect(await offline.text()).toContain("Flaxon OS is offline");
  52  | });
  53  | 
  54  | test("service worker controls the site root", async ({ page }) => {
  55  |   await page.goto("/");
  56  |   const registrationResult = await page.evaluate(async () => {
  57  |     try {
  58  |       const value = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
  59  |       await value.update();
  60  |       return { error: "", scope: value.scope, script: value.active?.scriptURL || value.installing?.scriptURL || value.waiting?.scriptURL || "" };
  61  |     } catch (error) { return { error: error.message, scope: "", script: "" }; }
  62  |   });
  63  |   expect(registrationResult.error, JSON.stringify(registrationResult)).toBe("");
  64  |   await expect.poll(() => page.evaluate(async () => {
  65  |     const registrations = await navigator.serviceWorker.getRegistrations();
  66  |     return registrations.map(value => ({ scope: value.scope, script: value.active?.scriptURL || value.installing?.scriptURL || "" }));
  67  |   }), { timeout: 10000 }).toEqual(expect.arrayContaining([
  68  |     { scope: "http://127.0.0.1:4173/", script: expect.stringContaining("/sw.js") }
  69  |   ]));
  70  | });
  71  | 
  72  | test("Pyodide worker executes bounded Python", async ({ page }) => {
  73  |   test.setTimeout(90000);
  74  |   await page.goto("/");
  75  |   const result = await page.evaluate(() => window.FlxonOS.python.run("print(2 + 3)", { timeoutMs: 60000 }));
  76  |   expect(result.ok).toBeTruthy();
  77  |   expect(result.output).toContain("5");
  78  | });
  79  | 
  80  | test("Pyodide timeout resets the worker", async ({ page }) => {
  81  |   test.setTimeout(90000);
  82  |   await page.goto("/");
  83  |   const warmup = await page.evaluate(() => window.FlxonOS.python.run("1 + 1", { timeoutMs: 60000 }));
  84  |   expect(warmup.ok).toBeTruthy();
  85  |   const timedOut = await page.evaluate(() => window.FlxonOS.python.run("while True: pass", { timeoutMs: 1000 }));
  86  |   expect(timedOut.ok).toBeFalsy();
  87  |   expect(timedOut.error).toContain("timed out");
  88  |   const recovered = await page.evaluate(() => window.FlxonOS.python.run("print('recovered')", { timeoutMs: 60000 }));
  89  |   expect(recovered.ok).toBeTruthy();
  90  |   expect(recovered.output).toContain("recovered");
  91  | });
  92  | 
  93  | test("Media library reacts to an IndexedDB asset", async ({ page }) => {
  94  |   await page.goto("/");
  95  |   await page.evaluate(async () => {
  96  |     await window.FlxonOS.db.put("media", { id: "smoke-video", name: "demo.webm", type: "video/webm", size: 2048, blob: new Blob(["demo"], { type: "video/webm" }) });
  97  |   });
  98  |   await page.getByRole("button", { name: "Refresh" }).click();
  99  |   await expect(page.locator(".media-item")).toContainText("demo.webm");
  100 | });
  101 | 
  102 | test("media service selects a supported recorder format", async ({ page }) => {
  103 |   await page.goto("/");
  104 |   const result = await page.evaluate(() => ({ mime: window.FlxonOS.media.supportedMimeType("video"), recording: window.FlxonOS.media.isRecording() }));
  105 |   expect(result.mime).toContain("video/webm");
  106 |   expect(result.recording).toBeFalsy();
  107 | });
  108 | 
  109 | test("OS navigation switches workspace tools", async ({ page }) => {
  110 |   await page.goto("/");
  111 |   await page.getByRole("button", { name: "Playground" }).click();
  112 |   await expect(page.locator("body")).toContainText("Developer playground");
  113 |   await page.getByRole("button", { name: "Study", exact: true }).click();
  114 |   await expect(page.locator("body")).toContainText("Study workspace");
  115 |   await page.getByRole("button", { name: "Error solver", exact: true }).click();
  116 |   await expect(page.locator("body")).toContainText("Developer error solver");
  117 | });
  118 | 
  119 | test("bandwidth monitor measures a real download probe", async ({ page }) => {
  120 |   await page.goto("/");
  121 |   await page.locator("#app").getByRole("button", { name: "Bandwidth", exact: true }).click();
  122 |   await page.getByRole("button", { name: "Measure now", exact: true }).click();
> 123 |   await expect(page.locator("body")).toContainText("Measured 262144 bytes locally.");
      |                                      ^ Error: expect(locator).toContainText(expected) failed
  124 |   await expect(page.locator("body")).toContainText("Mbps");
  125 | });
  126 | 
  127 | test("video studio follows the active workspace", async ({ page }) => {
  128 |   await page.goto("/");
  129 |   await expect(page.locator("#video-module")).toBeHidden();
  130 |   await page.getByRole("button", { name: "Video studio", exact: true }).click();
  131 |   await expect.poll(() => page.evaluate(() => [...window.__teloce_hmr_instances.values()].flatMap(set => [...set]).find(item => item.target?.id === "app")?.state.view)).toBe("video");
  132 |   await expect(page.locator("#video-module")).toBeVisible();
  133 |   await expect(page.locator("#video-module h2")).toContainText("Flaxon Studio");
  134 |   await page.getByRole("button", { name: "Overview", exact: true }).click();
  135 |   await expect(page.locator("#video-module")).toBeHidden();
  136 | });
  137 | 
  138 | test("study notes persist in IndexedDB and render", async ({ page }) => {
  139 |   await page.goto("/");
  140 |   await page.getByRole("button", { name: "Study", exact: true }).click();
  141 |   await expect.poll(() => page.evaluate(() => [...window.__teloce_hmr_instances.values()].flatMap(set => [...set]).find(item => item.target?.id === "app")?.state.view)).toBe("study");
  142 |   await page.getByPlaceholder("Note title").fill("Browser note");
  143 |   await page.getByPlaceholder("Write your notes...").fill("A persisted study note.");
  144 |   await page.getByRole("button", { name: "Save locally" }).click();
  145 |   await expect(page.locator("body")).toContainText("Saved in IndexedDB.");
  146 |   await expect(page.locator("body")).toContainText("Browser note");
  147 | });
  148 | 
  149 | test("study filesystem saves a student text file locally", async ({ page }) => {
  150 |   await page.goto("/");
  151 |   await page.locator("#app").getByRole("button", { name: "Study", exact: true }).click();
  152 |   await page.getByPlaceholder("new-file.txt").fill("lesson.py");
  153 |   await page.getByPlaceholder("Write a text file for your study workspace...").fill("print('lesson')");
  154 |   await page.getByRole("button", { name: "Save text file", exact: true }).click();
  155 |   await expect(page.locator("#files-module")).toContainText("lesson.py");
  156 |   const saved = await page.evaluate(async () => (await window.FlxonOS.db.list("files")).some(file => file.name === "lesson.py"));
  157 |   expect(saved).toBeTruthy();
  158 | });
  159 | 
  160 | test("workspace backup round-trips through IndexedDB", async ({ page }) => {
  161 |   await page.goto("/");
  162 |   const result = await page.evaluate(async () => {
  163 |     await window.FlxonOS.db.put("notes", { id: "backup-note", title: "Backup note", body: "round trip" });
  164 |     const backup = await window.FlxonOS.workspace.export();
  165 |     await window.FlxonOS.db.delete("notes", "backup-note");
  166 |     await window.FlxonOS.workspace.import(new File([backup], "workspace.json", { type: "application/json" }));
  167 |     const restored = await window.FlxonOS.db.get("notes", "backup-note");
  168 |     return { size: backup.size, title: restored?.title, body: restored?.body };
  169 |   });
  170 |   expect(result.size).toBeGreaterThan(0);
  171 |   expect(result.title).toBe("Backup note");
  172 |   expect(result.body).toBe("round trip");
  173 | });
  174 | 
  175 | test("scanner findings render after an authorized scan response", async ({ page }) => {
  176 |   await page.route("**/api/scanner/check", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: 200, pages: 1, findings: [{ key: "content-security-policy", name: "Content Security Policy", present: true }] }) }));
  177 |   await page.goto("/");
  178 |   await page.getByRole("button", { name: "Scanner", exact: true }).click();
  179 |   await page.getByRole("button", { name: "Analyze", exact: true }).click();
  180 |   await expect(page.locator("body")).toContainText("Content Security Policy: present");
  181 | });
  182 | 
  183 | test("video clip export records a real browser WebM stream", async ({ page }) => {
  184 |   test.setTimeout(60000);
  185 |   await page.goto("/");
  186 |   const result = await page.evaluate(async () => {
  187 |     const canvas = document.createElement("canvas");
  188 |     canvas.width = 160; canvas.height = 90;
  189 |     const context = canvas.getContext("2d");
  190 |     const stream = canvas.captureStream(30);
  191 |     const mimeType = window.FlxonOS.media.supportedMimeType("video");
  192 |     const recorder = new MediaRecorder(stream, { mimeType });
  193 |     const chunks = [];
  194 |     recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
  195 |     const done = new Promise(resolve => { recorder.onstop = resolve; });
  196 |     recorder.start(100);
  197 |     let frame = 0;
  198 |     const draw = () => { context.fillStyle = frame % 2 ? "#32d399" : "#2563eb"; context.fillRect(0, 0, 160, 90); frame += 1; if (frame < 60) requestAnimationFrame(draw); else recorder.stop(); };
  199 |     draw();
  200 |     await done;
  201 |     stream.getTracks().forEach(track => track.stop());
  202 |     const source = new Blob(chunks, { type: recorder.mimeType || mimeType });
  203 |     const video = document.createElement("video");
  204 |     video.muted = true; video.src = URL.createObjectURL(source); document.body.append(video);
  205 |     await new Promise((resolve, reject) => { video.onloadedmetadata = resolve; video.onerror = () => reject(new Error("generated WebM did not load")); video.load(); });
  206 |     await new Promise(resolve => setTimeout(resolve, 100));
  207 |     const probeStream = video.captureStream(30);
  208 |     const trackCount = probeStream.getVideoTracks().length;
  209 |     probeStream.getTracks().forEach(track => track.stop());
  210 |     if (!(video.duration > 0)) return { sourceSize: source.size, duration: video.duration, trackCount, exportSize: 0, type: "" };
  211 |     const exportResult = await window.FlxonOS.media.exportClip(video, 0, Math.max(0.1, Math.min(0.5, video.duration - 0.05)), "smoke.webm");
  212 |     const timelineResult = await window.FlxonOS.media.exportTimeline(video, [{ mediaId: "smoke", inPoint: 0, outPoint: Math.min(0.5, video.duration - 0.05) }], async () => ({ blob: source }), "smoke-timeline.webm");
  213 |     URL.revokeObjectURL(video.src); video.remove();
  214 |     return { sourceSize: source.size, duration: video.duration, trackCount, exportSize: exportResult.size, timelineSize: timelineResult.size, type: exportResult.type };
  215 |   });
  216 |   expect(result.sourceSize).toBeGreaterThan(0);
  217 |   expect(result.duration).toBeGreaterThan(0);
  218 |   expect(result.trackCount).toBeGreaterThan(0);
  219 |   expect(result.exportSize, JSON.stringify(result)).toBeGreaterThan(0);
  220 |   expect(result.timelineSize, JSON.stringify(result)).toBeGreaterThan(0);
  221 |   expect(result.type).toContain("video/webm");
  222 | });
  223 | 
```