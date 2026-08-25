import asyncio
import http.client
from html.parser import HTMLParser
import ipaddress
import socket
import ssl
import threading
import time
from collections import deque
from urllib.parse import urljoin, urlparse
from flaxon.http.request import Request


SECURITY_HEADERS = {
    "content-security-policy": "Content Security Policy",
    "strict-transport-security": "Strict Transport Security",
    "x-content-type-options": "X-Content-Type-Options",
    "x-frame-options": "Clickjacking protection",
    "referrer-policy": "Referrer Policy",
    "permissions-policy": "Permissions Policy",
}
MAX_BODY = 1_000_000
MAX_CRAWL_LINKS = 5
MAX_URL_LENGTH = 2048
_RATE_LOCK = threading.Lock()
_RATE_EVENTS = deque()


def _consume_scan_budget():
    """Best-effort per-instance abuse guard; deploy a distributed limiter too."""
    now = time.monotonic()
    with _RATE_LOCK:
        while _RATE_EVENTS and now - _RATE_EVENTS[0] > 60:
            _RATE_EVENTS.popleft()
        if len(_RATE_EVENTS) >= 30:
            raise ValueError("Scanner rate limit reached; try again later.")
        _RATE_EVENTS.append(now)


class LinkParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links: list[str] = []

    def handle_starttag(self, tag, attrs):
        if tag.lower() == "a":
            href = dict(attrs).get("href")
            if href:
                self.links.append(href)


def _resolve_public_addresses(parsed):
    addresses = socket.getaddrinfo(parsed.hostname, parsed.port or (443 if parsed.scheme == "https" else 80), type=socket.SOCK_STREAM)
    if not addresses:
        raise ValueError("The hostname did not resolve.")
    public = []
    for address in {item[4][0] for item in addresses}:
        ip = ipaddress.ip_address(address)
        if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
            raise ValueError("Private, local, reserved, or multicast targets are blocked.")
        public.append(address)
    return public


def _validate_target(value: str):
    value = value.strip()
    if len(value) > MAX_URL_LENGTH:
        raise ValueError("URLs are limited to 2048 characters.")
    parsed = urlparse(value)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        raise ValueError("Only absolute HTTP(S) URLs are allowed.")
    if parsed.username or parsed.password:
        raise ValueError("User-info URLs are not allowed.")
    if parsed.port not in {None, 80, 443}:
        raise ValueError("Non-standard ports are disabled.")
    parsed = parsed._replace(fragment="")
    return parsed, _resolve_public_addresses(parsed)


class _FetchedResponse:
    def __init__(self, status: int, headers):
        self.status = status
        self.headers = headers


def _fetch(parsed, addresses):
    """Fetch from validated IPs while retaining hostname HTTP/TLS identity."""
    target = parsed.path or "/"
    if parsed.query:
        target += "?" + parsed.query
    port = parsed.port or (443 if parsed.scheme == "https" else 80)
    last_error = None
    for address in addresses:
        raw_socket = None
        response = None
        try:
            raw_socket = socket.create_connection((address, port), timeout=5)
            raw_socket.settimeout(5)
            if parsed.scheme == "https":
                raw_socket = ssl.create_default_context().wrap_socket(raw_socket, server_hostname=parsed.hostname)
            request = (
                f"GET {target} HTTP/1.1\r\n"
                f"Host: {parsed.hostname}\r\n"
                "User-Agent: FlaxonOS-Security-Scanner/0.1\r\n"
                "Accept: text/html,application/xhtml+xml;q=0.9,*/*;q=0.1\r\n"
                "Accept-Encoding: identity\r\n"
                "Connection: close\r\n\r\n"
            ).encode("ascii")
            raw_socket.sendall(request)
            response = http.client.HTTPResponse(raw_socket, method="GET")
            response.begin()
            body = response.read(MAX_BODY + 1)
            return _FetchedResponse(response.status, response.headers), body, len(body) > MAX_BODY
        except (OSError, ValueError, ssl.SSLError) as error:
            last_error = error
        finally:
            if response is not None:
                response.close()
            elif raw_socket is not None:
                raw_socket.close()
    raise ValueError(f"The target could not be reached safely: {last_error}")


def _scan(url: str, crawl: bool):
    _consume_scan_budget()
    root, addresses = _validate_target(url)
    response, body, truncated = _fetch(root, addresses)
    headers = {key.lower(): value for key, value in response.headers.items()}
    findings = [{"key": key, "name": name, "present": key in headers} for key, name in SECURITY_HEADERS.items()]
    result = {"url": root.geturl(), "host": root.hostname, "status": response.status, "headers": headers, "findings": findings, "pages": 1, "links": [], "truncated": truncated}
    if crawl and not truncated and "text/html" in headers.get("content-type", "") and response.status < 400:
        parser = LinkParser()
        parser.feed(body.decode("utf-8", errors="replace"))
        for link in parser.links:
            target = urljoin(root.geturl(), link).split("#", 1)[0]
            parsed = urlparse(target)
            if parsed.scheme == root.scheme and parsed.hostname == root.hostname and parsed.port in {None, 80, 443} and not parsed.username and not parsed.password and target not in result["links"] and len(result["links"]) < MAX_CRAWL_LINKS:
                result["links"].append(target)
        result["pages"] += len(result["links"])
    result["summary"] = "Review missing security headers; this is an evidence-gathering tool, not a vulnerability verdict."
    return result


def register_scanner(app):
    @app.post("/api/scanner/check")
    async def scanner(request: Request):
        data = await request.json()
        url = str(data.get("url", ""))
        crawl = bool(data.get("crawl", False))
        try:
            return await asyncio.to_thread(_scan, url, crawl)
        except Exception as error:
            return {"error": str(error), "url": url}

    @app.post("/api/scanner/attack-surface")
    async def attack_surface(request: Request):
        data = await request.json()
        url = str(data.get("url", ""))
        try:
            result = await asyncio.to_thread(_scan, url, True)
            return {"url": result["url"], "host": result["host"], "pages": result["pages"], "links": result["links"], "headers": result["findings"], "scope": "same-origin public HTTP(S) links only"}
        except Exception as error:
            return {"error": str(error), "url": url}
