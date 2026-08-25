import { chromium } from "playwright";
import fs from "node:fs";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 512, height: 512 }, deviceScaleFactor: 1 });
const svg = fs.readFileSync("public/icons/icon.svg", "utf8");
const source = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
await page.setContent(`<body style="margin:0;width:512px;height:512px"><img id="icon" style="display:block;width:512px;height:512px" src="${source}"></body>`);
await page.locator("#icon").screenshot({ path: "public/icons/icon-512.png" });
await page.locator("#icon").evaluate(element => { element.style.width = "192px"; element.style.height = "192px"; });
await page.setViewportSize({ width: 192, height: 192 });
await page.locator("#icon").screenshot({ path: "public/icons/icon-192.png" });
await browser.close();
