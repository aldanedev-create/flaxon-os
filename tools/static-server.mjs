import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../public/", import.meta.url));
const mime = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json", ".txt": "text/plain" };

async function fileFor(url) {
  const path = decodeURIComponent(new URL(url, "http://localhost").pathname);
  if (path.startsWith("/assets/")) return join(root, path.slice("/assets/".length));
  if (path === "/") return join(root, "..", "templates", "index.html");
  return join(root, path.slice(1));
}

createServer(async (request, response) => {
  try {
    if (request.url.startsWith("/api/")) {
      if (request.url.startsWith("/api/network/download")) {
        const payload = Buffer.alloc(256 * 1024, "0");
        response.writeHead(200, { "content-type": "application/octet-stream", "content-length": payload.length, "cache-control": "no-store" }); response.end(payload); return;
      }
      const body = request.url.includes("/health") ? { ok: true, service: "flaxon-os" } : { ok: true, message: "browser smoke-test API" };
      response.writeHead(200, { "content-type": "application/json", "x-content-type-options": "nosniff" }); response.end(JSON.stringify(body)); return;
    }
    const target = normalize(await fileFor(request.url));
    const data = await readFile(target);
    const type = mime[extname(target)] || "application/octet-stream";
    response.writeHead(200, { "content-type": type, "cache-control": "no-store" }); response.end(data);
  } catch (error) { response.writeHead(404, { "content-type": "text/plain" }); response.end("Not found"); }
}).listen(4173, "127.0.0.1");
