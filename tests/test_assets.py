from pathlib import Path
import json
import subprocess


ROOT = Path(__file__).parents[1]


def test_wallpaper_and_worker_assets_exist():
    assert (ROOT / "public/js/wallpapers.js").exists()
    assert (ROOT / "public/js/pyodide-worker.js").exists()
    assert (ROOT / "static/js/components/WallpaperPicker.vel").exists()
    assert (ROOT / "static/js/components/Desktop.vel").exists()


def test_component_sources_cover_shell_features():
    components = ROOT / "static/js/components"
    names = {path.name for path in components.glob("*.vel")}
    assert {"Desktop.vel", "Dock.vel", "StatusBar.vel", "VideoEditor.vel", "PythonPlayground.vel", "WallpaperPicker.vel", "MediaLibrary.vel", "AttackSurface.vel", "WorkspaceTools.vel", "StudyFiles.vel"} <= names


def test_pwa_manifest_has_install_icons_and_service_worker_shell():
    manifest = json.loads((ROOT / "public/manifest.webmanifest").read_text(encoding="utf-8"))
    assert manifest["display"] == "standalone"
    assert {icon["sizes"] for icon in manifest["icons"]} >= {"192x192", "512x512"}
    assert (ROOT / "public/icons/icon-192.png").read_bytes().startswith(b"\x89PNG")
    assert (ROOT / "public/icons/icon-512.png").read_bytes().startswith(b"\x89PNG")
    service_worker = (ROOT / "public/sw.js").read_text(encoding="utf-8")
    assert "flaxon-os-v3" in service_worker
    assert "/assets/static/js/components/PythonPlayground.js" in service_worker
    assert "/assets/static/js/components/Desktop.js" in service_worker
    assert "/assets/js/workspace.js" in service_worker
    assert "/assets/icons/icon-512.png" in service_worker
    assert "/offline.html" in service_worker


def test_indexeddb_schema_includes_media_upgrade():
    source = (ROOT / "public/js/os-core.js").read_text(encoding="utf-8")
    assert "const DB_VERSION = 3" in source
    assert '"media"' in source
    assert '"files"' in source


def test_pwa_install_and_offline_assets_exist():
    assert (ROOT / "public/js/pwa.js").exists()
    assert (ROOT / "public/offline.html").exists()
    assert "beforeinstallprompt" in (ROOT / "public/js/pwa.js").read_text(encoding="utf-8")
    pyodide = (ROOT / "public/js/pyodide.js").read_text(encoding="utf-8")
    assert "timed out" in pyodide
    assert "60000" in pyodide
    assert (ROOT / "public/robots.txt").exists()
    assert (ROOT / "public/.well-known/security.txt").exists()
    assert subprocess.run(["node", "--check", str(ROOT / "public/sw.js")], capture_output=True, text=True).returncode == 0


def test_template_has_browser_security_policy():
    template = (ROOT / "templates/index.html").read_text(encoding="utf-8")
    assert "Content-Security-Policy" in template
    assert "https://cdn.jsdelivr.net" in template
    assert "object-src 'none'" in template
    assert "unsafe-eval" not in template


def test_vercel_config_protects_direct_static_assets():
    config = (ROOT / "vercel.json").read_text(encoding="utf-8")
    assert "X-Content-Type-Options" in config
    assert "Cache-Control" in config
    assert "no-cache" in config


def test_component_loader_targets_all_generated_modules():
    loader = (ROOT / "public/js/component-loader.js").read_text(encoding="utf-8")
    for name in ("Desktop", "Dock", "StatusBar", "VideoEditor", "WallpaperPicker", "PythonPlayground", "MediaLibrary", "AttackSurface", "WorkspaceTools", "StudyFiles"):
        assert f"components/{name}.js" in loader
        assert (ROOT / f"public/static/js/components/{name}.js").exists()


def test_workspace_backup_has_size_guard():
    source = (ROOT / "public/js/workspace.js").read_text(encoding="utf-8")
    assert "250 * 1024 * 1024" in source
    assert "safety limit" in source
    assert "MAX_ITEMS_PER_STORE" in source
