"""Flaxon OS developer CLI. It performs bounded local tasks only."""

import argparse
import json
import os
import sys
from pathlib import Path

ROOT = Path(__file__).parent


def main(argv=None):
    parser = argparse.ArgumentParser(prog="flaxon-os")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("build", help="Compile static/js/*.vel into public/")
    doctor = sub.add_parser("doctor", help="Check the local project layout")
    doctor.add_argument("--release", action="store_true", help="Fail on placeholder production values")
    scan = sub.add_parser("scan", help="Explain how to run an authorized web scan")
    scan.add_argument("url", nargs="?")
    args = parser.parse_args(argv)
    if args.command == "build":
        from build import build_frontend
        build_frontend()
        return 0
    if args.command == "doctor":
        required = [ROOT / "app.py", ROOT / "static/js/App.vel", ROOT / "templates/index.html", ROOT / "public/manifest.webmanifest", ROOT / "public/sw.js", ROOT / "public/offline.html", ROOT / "public/js/media.js", ROOT / "public/js/pyodide-worker.js", ROOT / "docs/privacy.md", ROOT / "vercel.json", ROOT / "package.json"]
        missing = [str(p.relative_to(ROOT)) for p in required if not p.exists()]
        sources = sorted((ROOT / "static/js/components").glob("*.vel"))
        generated = [ROOT / "public/static/js/components" / (source.stem + ".js") for source in sources]
        missing_generated = [str(p.relative_to(ROOT)) for p in generated if not p.exists()]
        security_text = (ROOT / "public/.well-known/security.txt").read_text(encoding="utf-8") if (ROOT / "public/.well-known/security.txt").exists() else ""
        warnings = ["Replace the placeholder security contact before publishing."] if "example.invalid" in security_text else []
        if args.release and os.getenv("FLAXON_DEBUG", "false").lower() in {"1", "true", "yes", "on"}:
            warnings.append("FLAXON_DEBUG must be false or unset for a release build.")
        try:
            manifest = json.loads((ROOT / "public/manifest.webmanifest").read_text(encoding="utf-8"))
            for icon in manifest.get("icons", []):
                source = str(icon.get("src", ""))
                if source.startswith("/assets/"):
                    icon_path = ROOT / "public" / source.removeprefix("/assets/")
                    if not icon_path.exists(): warnings.append(f"Manifest icon is missing: {source}")
                    if args.release and icon.get("type") == "image/png" and not icon_path.read_bytes().startswith(b"\x89PNG"):
                        warnings.append(f"Manifest PNG is invalid: {source}")
        except (OSError, ValueError) as error:
            warnings.append(f"Manifest validation failed: {error}")
        worker = (ROOT / "public/sw.js").read_text(encoding="utf-8") if (ROOT / "public/sw.js").exists() else ""
        for asset in ("/assets/icons/icon-512.png", "/assets/js/pyodide.js", "/assets/js/media.js", "/assets/static/js/App.js"):
            if asset not in worker: warnings.append(f"Service worker shell is missing: {asset}")
        ok = not missing and not missing_generated and not (args.release and warnings)
        print(json.dumps({"ok": ok, "missing": missing, "missing_generated": missing_generated, "warnings": warnings, "components": len(sources), "release_checks": bool(args.release)}, indent=2))
        return 0 if ok else 1
    print(f"Authorized public scan target: {args.url or '<provide a URL to the API>'}")
    print("The web UI/API performs header checks and same-origin link discovery; it does not exploit targets.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
