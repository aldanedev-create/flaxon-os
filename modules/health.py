from datetime import datetime, timezone


def register_health(app):
    @app.get("/api/health")
    async def health():
        return {"ok": True, "service": "flaxon-os", "time": datetime.now(timezone.utc).isoformat()}
