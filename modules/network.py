from datetime import datetime, timezone
from flaxon import Response


def register_network(app):
    @app.get("/api/network/ping")
    async def ping():
        return {"ok": True, "server_time": datetime.now(timezone.utc).isoformat(), "bytes": 128}

    @app.get("/api/network/headers")
    async def headers(request):
        return {"ok": True, "user_agent": request.headers.get("user-agent", "unknown"), "host": request.headers.get("host", "")}

    @app.get("/api/network/download")
    async def download_probe(request):
        """Return a bounded payload so the browser can measure real throughput."""
        return Response(b"0" * (256 * 1024), headers={"cache-control": "no-store"}, media_type="application/octet-stream")
