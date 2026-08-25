from pathlib import Path


def test_app_imports_with_security_middleware():
    import app

    assert type(app.app).__name__ == "Flaxon"
    assert len(app.app.router.routes) >= 10
    assert len(app.app._middleware) >= 4
    assert app.ROOT.is_absolute()
    paths = {route.path for route in app.app.router.routes if hasattr(route, "path")}
    assert {"/manifest.webmanifest", "/sw.js", "/offline.html"} <= paths
    assert {"/assets/css/app.css", "/assets/js/os-core.js", "/assets/static/js/App.js"} <= paths


def test_security_contact_format_is_documented():
    source = (Path(__file__).resolve().parents[1] / "build.py").read_text(encoding="utf-8")
    assert "FLAXON_SECURITY_CONTACT" in source
    assert "mailto:" in source and "https://" in source


def test_local_pwa_root_assets_have_response_bodies():
    from app import _public_file

    for name, media_type in (("manifest.webmanifest", "application/manifest+json"), ("sw.js", "application/javascript"), ("offline.html", "text/html; charset=utf-8")):
        response = _public_file(name, media_type)
        assert response.status_code == 200
        assert response.body
        assert response.headers["content-type"].startswith(media_type)


def test_doctor_checks_release_contract(capsys):
    from cli import main

    assert main(["doctor"]) == 0
    output = capsys.readouterr().out
    assert '"release_checks": false' in output
    assert '"components": 10' in output
