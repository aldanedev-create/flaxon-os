from pathlib import Path

from teloce.build.builder import Builder
import shutil
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
    generated = ROOT / "dist"
    result = Builder({"dev": False, "source_maps": True, "clean": True}).build(ROOT, out_dir=generated)
    if result["failed"]:
        raise RuntimeError(f"Teloce build failed: {result['errors']}")
    for item in result["files"]:
        source = generated / item["output"]
        if source.suffix in {".js", ".map", ".css"}:
            target = ROOT / "public" / item["output"]
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
    write_security_contact()
    print(f"Compiled {result['compiled']} Teloce component(s) into public/")
    return result


if __name__ == "__main__":
    build_frontend()
