from pathlib import Path
import os
import mimetypes

from flaxon import Flaxon
from flaxon.http.response import Response
from flaxon.jinax import Jinax
from flaxon.middleware import BodyLimitMiddleware, RequestIDMiddleware, SecurityHeadersMiddleware, TrustedHostsMiddleware
from flaxon.security import RateLimitMiddleware

from modules.health import register_health
from modules.network import register_network
from modules.scanner import register_scanner
from modules.playground import register_playground
from modules.checkers import register_checkers
from modules.errors import register_errors

ROOT = Path(__file__).resolve().parent
app = Flaxon("flaxon-os", debug=os.getenv("FLAXON_DEBUG", "false").lower() == "true")
app.add_middleware(BodyLimitMiddleware, max_size=2 * 1024 * 1024)
app.add_middleware(RequestIDMiddleware, header_name="x-request-id")
app.add_middleware(RateLimitMiddleware, requests=int(os.getenv("FLAXON_REQUESTS_PER_MINUTE", "300")), window_seconds=60)
app.add_middleware(SecurityHeadersMiddleware, headers={
    "referrer-policy": "no-referrer",
    "permissions-policy": "camera=(self), microphone=(self), geolocation=()",
    "content-security-policy": "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net blob:; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://cdn.jsdelivr.net; img-src 'self' data: blob:; media-src 'self' blob:; frame-src 'self' blob: https://websheild-real-scan.onrender.com https://happy-study-3d.vercel.app; object-src 'none'; base-uri 'self'; form-action 'self'",
})
configured_hosts = [item.strip() for item in os.getenv("FLAXON_TRUSTED_HOSTS", "").split(",") if item.strip()]
if configured_hosts:
    app.add_middleware(TrustedHostsMiddleware, allowed_hosts=configured_hosts)
app.use_templates(Jinax(ROOT / "templates", auto_reload=app.debug, strict_undefined=True))


def _public_file(name: str, media_type: str):
    """Return a small PWA root asset through Flaxon's local server.

    Vercel serves the generated ``public`` directory directly, but a local
    ``flaxon run`` process only mounts it under ``/assets``.  These explicit
    routes keep the manifest, service worker, and offline fallback valid in
    both deployment modes.
    """
    path = (ROOT / "public" / name).resolve()
    if ROOT / "public" not in path.parents or not path.is_file():
        return Response("Not found", status_code=404, media_type="text/plain")
    return Response(path.read_bytes(), media_type=media_type)


def _asset_endpoint(path: Path, media_type: str):
    async def serve_asset(request):
        return Response(path.read_bytes(), media_type=media_type)
    return serve_asset


def _register_native_assets():
    """Register generated public files without requiring Starlette.

    Flaxon can mount Starlette applications when that optional extra is
    installed, but the minimal/standard Flaxon deployment does not guarantee
    Starlette. Registering exact generated asset routes keeps local and
    serverless deployments functional in either environment.
    """
    media_overrides = {
        ".webmanifest": "application/manifest+json",
        ".js": "application/javascript",
        ".css": "text/css",
        ".svg": "image/svg+xml",
        ".png": "image/png",
        ".html": "text/html; charset=utf-8",
        ".json": "application/json",
        ".txt": "text/plain; charset=utf-8",
    }
    public = ROOT / "public"
    for path in public.rglob("*"):
        if not path.is_file():
            continue
        relative = path.relative_to(public).as_posix()
        media_type = media_overrides.get(path.suffix.lower(), mimetypes.guess_type(path.name)[0] or "application/octet-stream")
        app.get(f"/assets/{relative}")(_asset_endpoint(path, media_type))


_register_native_assets()


@app.get("/manifest.webmanifest")
async def manifest(request):
    return _public_file("manifest.webmanifest", "application/manifest+json")


@app.get("/sw.js")
async def service_worker(request):
    return _public_file("sw.js", "application/javascript")


@app.get("/offline.html")
async def offline_page(request):
    return _public_file("offline.html", "text/html; charset=utf-8")

try:
    from starlette.staticfiles import StaticFiles
    app.mount_asgi("/assets", StaticFiles(directory=ROOT / "public"))
except ImportError:
    # The standard Flaxon extra supplies Starlette. This fallback keeps import
    # errors clear when a developer installs only the minimal Flaxon package.
    pass

register_health(app)
register_network(app)
register_scanner(app)
register_playground(app)
register_checkers(app)
register_errors(app)


@app.get("/")
async def home(request):
    return await request.render("index.html", {"title": "Flaxon OS"})


if __name__ == "__main__":
    from build import build_frontend
    build_frontend()
    print("Flaxon OS: run `flaxon run app:app --reload`")
