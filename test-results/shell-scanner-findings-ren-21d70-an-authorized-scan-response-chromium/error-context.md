# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shell.spec.mjs >> scanner findings render after an authorized scan response
- Location: tests\browser\shell.spec.mjs:175:1

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: 'Analyze', exact: true })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e3]:
    - complementary [ref=e4]:
      - navigation [ref=e5]:
        - button "Overview" [ref=e6] [cursor=pointer]
        - button "Bandwidth" [ref=e7] [cursor=pointer]
        - button "Scanner" [active] [ref=e8] [cursor=pointer]
        - button "Playground" [ref=e9] [cursor=pointer]
        - button "Study" [ref=e10] [cursor=pointer]
        - button "Error solver" [ref=e11] [cursor=pointer]
        - button "Video studio" [ref=e12] [cursor=pointer]
    - generic [ref=e14]:
      - strong [ref=e15]: Scanner
      - generic [ref=e16]:
        - generic [ref=e17]: Local-first
        - button "Install" [ref=e18] [cursor=pointer]
        - button "Appearance" [ref=e19] [cursor=pointer]
        - button "_" [ref=e20] [cursor=pointer]
        - button "[]" [ref=e21] [cursor=pointer]
  - generic [ref=e22]:
    - button "OS Home" [ref=e23] [cursor=pointer]:
      - generic [ref=e24]: OS
      - generic [ref=e25]: Home
    - button "ST Study files" [ref=e26] [cursor=pointer]:
      - generic [ref=e27]: ST
      - generic [ref=e28]: Study files
    - button "PY Python" [ref=e29] [cursor=pointer]:
      - generic [ref=e30]: PY
      - generic [ref=e31]: Python
    - button "SC Scanner" [ref=e32] [cursor=pointer]:
      - generic [ref=e33]: SC
      - generic [ref=e34]: Scanner
    - button "VI Video Studio" [ref=e35] [cursor=pointer]:
      - generic [ref=e36]: VI
      - generic [ref=e37]: Video Studio
  - generic [ref=e38]:
    - button "Start" [ref=e39] [cursor=pointer]:
      - generic [ref=e40]: F
      - generic [ref=e41]: Launcher
    - button "Home" [ref=e42] [cursor=pointer]
    - button "Pulse" [ref=e43] [cursor=pointer]
    - button "Studio" [ref=e44] [cursor=pointer]
    - button "Study" [ref=e45] [cursor=pointer]
  - contentinfo [ref=e47]:
    - generic [ref=e48]: Flaxon OS
    - generic [ref=e49]: Ready
    - generic [ref=e50]: 10:20 PM
  - generic [ref=e52]:
    - generic [ref=e53]:
      - generic [ref=e54]:
        - heading "Attack surface" [level=2] [ref=e55]
        - paragraph [ref=e56]: Same-origin public link inventory for authorized review.
      - button "Map surface" [ref=e58] [cursor=pointer]
    - textbox "https://example.com" [ref=e60]
    - paragraph [ref=e61]: Only public HTTP(S) same-origin links are included.
```

# Test source

```ts
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
  123 |   await expect(page.locator("body")).toContainText("Measured 262144 bytes locally.");
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
> 179 |   await page.getByRole("button", { name: "Analyze", exact: true }).click();
      |                                                                    ^ Error: locator.click: Test timeout of 30000ms exceeded.
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