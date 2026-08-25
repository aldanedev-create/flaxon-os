from pathlib import Path

import os

ROOT = Path(__file__).resolve().parent


def write_security_contact():
    contact = os.getenv("FLAXON_SECURITY_CONTACT", "").strip()
    if not contact:
        return
    if not (contact.startswith("mailto:") or contact.startswith("https://")):
        raise ValueError("FLAXON_SECURITY_CONTACT must be a mailto: or https:// URL")
    target = ROOT / "public" / ".well-known" / "security.txt"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(f"Contact: {contact}\nExpires: 2027-12-31T23:59:59Z\nPreferred-Languages: en\n", encoding="utf-8")


def build_frontend():
    # The generated bundle is checked in and is the deployment artifact.
    # Rebuilding here with whichever teloce-py version Vercel happens to
    # install can silently replace it with an older compiler/runtime.  Build
    # locally with the project's pinned toolchain when .vel files change, then
    # commit the resulting public/assets/static bundle.
    required = [
        ROOT / "public" / "static" / "js" / "App.js",
        ROOT / "public" / "css" / "app.css",
    ]
    missing = [str(path.relative_to(ROOT)) for path in required if not path.exists()]
    if missing:
        raise RuntimeError(f"Missing checked-in frontend artifacts: {', '.join(missing)}")
    write_security_contact()
    print("Using checked-in Teloce frontend artifacts from public/assets/")
    return {"compiled": 0, "failed": False, "files": [], "errors": []}


if __name__ == "__main__":
    build_frontend()
