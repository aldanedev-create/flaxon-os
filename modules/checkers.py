from urllib.parse import urlparse
import ipaddress
import re
from flaxon.http.request import Request


SUSPICIOUS_TERMS = {"login", "verify", "wallet", "airdrop", "password", "claim", "urgent", "gift"}
MAX_URL_LENGTH = 2048


def analyze_url(value: str) -> dict:
    value = (value or "").strip()
    parsed = urlparse(value)
    host = (parsed.hostname or "").lower().rstrip(".")
    labels = set(re.findall(r"[a-z0-9]+", parsed.netloc.lower() + " " + parsed.path.lower() + " " + parsed.query.lower()))
    reasons = []
    if not value or len(value) > MAX_URL_LENGTH:
        reasons.append("The URL is empty or exceeds the 2048-character safety limit.")
    if parsed.scheme not in {"http", "https"} or not host:
        reasons.append("Only absolute HTTP(S) URLs with a hostname can be assessed.")
    if parsed.username or parsed.password:
        reasons.append("The URL contains embedded credentials.")
    if parsed.scheme != "https":
        reasons.append("The URL does not use HTTPS.")
    if host.startswith("xn--") or ".xn--" in host:
        reasons.append("The hostname uses punycode and needs visual review.")
    if any(ord(character) > 127 for character in host):
        reasons.append("The hostname contains non-ASCII characters and needs visual review.")
    if labels & SUSPICIOUS_TERMS:
        reasons.append("The URL contains terms commonly used in social-engineering links.")
    try:
        address = ipaddress.ip_address(host)
        if address.is_private or address.is_loopback:
            reasons.append("The target is a private or loopback IP address.")
    except ValueError:
        pass
    return {"url": value, "host": host, "risk": "high" if len(reasons) >= 2 else "review" if reasons else "low", "reasons": reasons}


def register_checkers(app):
    @app.post("/api/checkers/phishing")
    async def phishing(request: Request):
        data = await request.json()
        return analyze_url(str(data.get("url", "")))

    @app.get("/api/checkers/phishing")
    async def phishing_get(request: Request):
        return analyze_url(str(request.query.get("url", "")))
