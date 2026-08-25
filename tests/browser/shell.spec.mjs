import { test, expect } from "@playwright/test";

test("built Flaxon OS shell loads all compiled modules", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await expect(page.locator("body")).toContainText("Flaxon OS");
  await expect(page.locator("body")).toContainText("Flaxon Studio");
  await expect(page.locator("body")).toContainText("Python workspace");
  await expect(page.locator("body")).toContainText("Media library");
  await expect(page.locator("body")).toContainText("Attack surface");
  await expect(page.locator("body")).toContainText("Workspace backup");
  expect(errors).toEqual([]);
});

test("Windows-style desktop opens the Start menu and app launcher", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start" }).first().click();
  await expect(page.locator(".start-menu")).toBeVisible();
  await expect(page.locator(".start-menu")).toContainText("Python Playground");
  await page.getByRole("button", { name: "Python Playground" }).click();
  await expect(page.locator("body")).toContainText("Developer playground");
  await expect(page.locator("body")).toHaveClass(/desktop-mode/);
});

test("wallpaper choice persists locally", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
  await page.goto("/");
  await page.locator('[data-wallpaper="aurora"]').click();
  await expect.poll(() => page.locator("html").getAttribute("data-wallpaper")).toBe("aurora");
  expect(await page.evaluate(() => localStorage.getItem("flaxon-wallpaper"))).toBe("aurora");
  expect(errors).toEqual([]);
});

test("manifest and offline shell are served", async ({ page, request }) => {
  const manifest = await request.get("/manifest.webmanifest");
  expect(manifest.ok()).toBeTruthy();
  expect((await manifest.json()).display).toBe("standalone");
  const worker = await request.get("/sw.js");
  expect(worker.ok()).toBeTruthy();
  const workerScript = await request.get("/assets/js/pwa.js");
  expect(await workerScript.text()).toContain('register("/sw.js", { scope: "/" })');
  const icon = await request.get("/assets/icons/icon-512.png");
  expect(icon.ok()).toBeTruthy();
  expect(icon.headers()["content-type"]).toContain("image/png");
  const offline = await request.get("/offline.html");
  expect(offline.ok()).toBeTruthy();
  expect(await offline.text()).toContain("Flaxon OS is offline");
});

test("service worker controls the site root", async ({ page }) => {
  await page.goto("/");
  const registrationResult = await page.evaluate(async () => {
    try {
      const value = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
      await value.update();
      return { error: "", scope: value.scope, script: value.active?.scriptURL || value.installing?.scriptURL || value.waiting?.scriptURL || "" };
    } catch (error) { return { error: error.message, scope: "", script: "" }; }
  });
  expect(registrationResult.error, JSON.stringify(registrationResult)).toBe("");
  await expect.poll(() => page.evaluate(async () => {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.map(value => ({ scope: value.scope, script: value.active?.scriptURL || value.installing?.scriptURL || "" }));
  }), { timeout: 10000 }).toEqual(expect.arrayContaining([
    { scope: "http://127.0.0.1:4173/", script: expect.stringContaining("/sw.js") }
  ]));
});

test("Pyodide worker executes bounded Python", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/");
  const result = await page.evaluate(() => window.FlxonOS.python.run("print(2 + 3)", { timeoutMs: 60000 }));
  expect(result.ok).toBeTruthy();
  expect(result.output).toContain("5");
});

test("Pyodide timeout resets the worker", async ({ page }) => {
  test.setTimeout(90000);
  await page.goto("/");
  const warmup = await page.evaluate(() => window.FlxonOS.python.run("1 + 1", { timeoutMs: 60000 }));
  expect(warmup.ok).toBeTruthy();
  const timedOut = await page.evaluate(() => window.FlxonOS.python.run("while True: pass", { timeoutMs: 1000 }));
  expect(timedOut.ok).toBeFalsy();
  expect(timedOut.error).toContain("timed out");
  const recovered = await page.evaluate(() => window.FlxonOS.python.run("print('recovered')", { timeoutMs: 60000 }));
  expect(recovered.ok).toBeTruthy();
  expect(recovered.output).toContain("recovered");
});

test("Media library reacts to an IndexedDB asset", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await window.FlxonOS.db.put("media", { id: "smoke-video", name: "demo.webm", type: "video/webm", size: 2048, blob: new Blob(["demo"], { type: "video/webm" }) });
  });
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.locator(".media-item")).toContainText("demo.webm");
});

test("media service selects a supported recorder format", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(() => ({ mime: window.FlxonOS.media.supportedMimeType("video"), recording: window.FlxonOS.media.isRecording() }));
  expect(result.mime).toContain("video/webm");
  expect(result.recording).toBeFalsy();
});

test("OS navigation switches workspace tools", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Playground" }).click();
  await expect(page.locator("body")).toContainText("Developer playground");
  await page.getByRole("button", { name: "Study", exact: true }).click();
  await expect(page.locator("body")).toContainText("Study workspace");
  await page.getByRole("button", { name: "Error solver", exact: true }).click();
  await expect(page.locator("body")).toContainText("Developer error solver");
});

test("bandwidth monitor measures a real download probe", async ({ page }) => {
  await page.goto("/");
  await page.locator("#app").getByRole("button", { name: "Bandwidth", exact: true }).click();
  await page.getByRole("button", { name: "Measure now", exact: true }).click();
  await expect(page.locator("body")).toContainText("Measured 262144 bytes locally.");
  await expect(page.locator("body")).toContainText("Mbps");
});

test("video studio follows the active workspace", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#video-module")).toBeHidden();
  await page.getByRole("button", { name: "Video studio", exact: true }).click();
  await expect.poll(() => page.evaluate(() => [...window.__teloce_hmr_instances.values()].flatMap(set => [...set]).find(item => item.target?.id === "app")?.state.view)).toBe("video");
  await expect(page.locator("#video-module")).toBeVisible();
  await expect(page.locator("#video-module h2")).toContainText("Flaxon Studio");
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.locator("#video-module")).toBeHidden();
});

test("study notes persist in IndexedDB and render", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Study", exact: true }).click();
  await expect.poll(() => page.evaluate(() => [...window.__teloce_hmr_instances.values()].flatMap(set => [...set]).find(item => item.target?.id === "app")?.state.view)).toBe("study");
  await page.getByPlaceholder("Note title").fill("Browser note");
  await page.getByPlaceholder("Write your notes...").fill("A persisted study note.");
  await page.getByRole("button", { name: "Save locally" }).click();
  await expect(page.locator("body")).toContainText("Saved in IndexedDB.");
  await expect(page.locator("body")).toContainText("Browser note");
});

test("study filesystem saves a student text file locally", async ({ page }) => {
  await page.goto("/");
  await page.locator("#app").getByRole("button", { name: "Study", exact: true }).click();
  await page.getByPlaceholder("new-file.txt").fill("lesson.py");
  await page.getByPlaceholder("Write a text file for your study workspace...").fill("print('lesson')");
  await page.getByRole("button", { name: "Save text file", exact: true }).click();
  await expect(page.locator("#files-module")).toContainText("lesson.py");
  const saved = await page.evaluate(async () => (await window.FlxonOS.db.list("files")).some(file => file.name === "lesson.py"));
  expect(saved).toBeTruthy();
});

test("workspace backup round-trips through IndexedDB", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    await window.FlxonOS.db.put("notes", { id: "backup-note", title: "Backup note", body: "round trip" });
    const backup = await window.FlxonOS.workspace.export();
    await window.FlxonOS.db.delete("notes", "backup-note");
    await window.FlxonOS.workspace.import(new File([backup], "workspace.json", { type: "application/json" }));
    const restored = await window.FlxonOS.db.get("notes", "backup-note");
    return { size: backup.size, title: restored?.title, body: restored?.body };
  });
  expect(result.size).toBeGreaterThan(0);
  expect(result.title).toBe("Backup note");
  expect(result.body).toBe("round trip");
});

test("scanner findings render after an authorized scan response", async ({ page }) => {
  await page.route("**/api/scanner/check", route => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: 200, pages: 1, findings: [{ key: "content-security-policy", name: "Content Security Policy", present: true }] }) }));
  await page.goto("/");
  await page.getByRole("button", { name: "Scanner", exact: true }).click();
  await page.getByRole("button", { name: "Analyze", exact: true }).click();
  await expect(page.locator("body")).toContainText("Content Security Policy: present");
});

test("video clip export records a real browser WebM stream", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const canvas = document.createElement("canvas");
    canvas.width = 160; canvas.height = 90;
    const context = canvas.getContext("2d");
    const stream = canvas.captureStream(30);
    const mimeType = window.FlxonOS.media.supportedMimeType("video");
    const recorder = new MediaRecorder(stream, { mimeType });
    const chunks = [];
    recorder.ondataavailable = event => { if (event.data.size) chunks.push(event.data); };
    const done = new Promise(resolve => { recorder.onstop = resolve; });
    recorder.start(100);
    let frame = 0;
    const draw = () => { context.fillStyle = frame % 2 ? "#32d399" : "#2563eb"; context.fillRect(0, 0, 160, 90); frame += 1; if (frame < 60) requestAnimationFrame(draw); else recorder.stop(); };
    draw();
    await done;
    stream.getTracks().forEach(track => track.stop());
    const source = new Blob(chunks, { type: recorder.mimeType || mimeType });
    const video = document.createElement("video");
    video.muted = true; video.src = URL.createObjectURL(source); document.body.append(video);
    await new Promise((resolve, reject) => { video.onloadedmetadata = resolve; video.onerror = () => reject(new Error("generated WebM did not load")); video.load(); });
    await new Promise(resolve => setTimeout(resolve, 100));
    const probeStream = video.captureStream(30);
    const trackCount = probeStream.getVideoTracks().length;
    probeStream.getTracks().forEach(track => track.stop());
    if (!(video.duration > 0)) return { sourceSize: source.size, duration: video.duration, trackCount, exportSize: 0, type: "" };
    const exportResult = await window.FlxonOS.media.exportClip(video, 0, Math.max(0.1, Math.min(0.5, video.duration - 0.05)), "smoke.webm");
    const timelineResult = await window.FlxonOS.media.exportTimeline(video, [{ mediaId: "smoke", inPoint: 0, outPoint: Math.min(0.5, video.duration - 0.05) }], async () => ({ blob: source }), "smoke-timeline.webm");
    URL.revokeObjectURL(video.src); video.remove();
    return { sourceSize: source.size, duration: video.duration, trackCount, exportSize: exportResult.size, timelineSize: timelineResult.size, type: exportResult.type };
  });
  expect(result.sourceSize).toBeGreaterThan(0);
  expect(result.duration).toBeGreaterThan(0);
  expect(result.trackCount).toBeGreaterThan(0);
  expect(result.exportSize, JSON.stringify(result)).toBeGreaterThan(0);
  expect(result.timelineSize, JSON.stringify(result)).toBeGreaterThan(0);
  expect(result.type).toContain("video/webm");
});
