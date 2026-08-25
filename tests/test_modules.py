from modules.checkers import analyze_url
from modules.errors import solve_diagnostic
from modules.playground import check_python
from modules.scanner import _validate_target


def test_phishing_checker_flags_insecure_suspicious_url():
    result = analyze_url("http://secure-login.example.test/account")
    assert result["risk"] == "high"
    assert any("HTTPS" in reason for reason in result["reasons"])


def test_phishing_checker_does_not_treat_malformed_input_as_safe():
    for value in ("", "javascript:alert(1)", "https://user:pass@example.com", "https://example.com/" + "x" * 2048):
        result = analyze_url(value)
        assert result["risk"] in {"review", "high"}
        assert result["reasons"]


def test_error_solver_is_deterministic():
    result = solve_diagnostic("ModuleNotFoundError: No module named 'x'")
    assert result["ok"] and result["error_type"] == "ModuleNotFoundError"
    assert result["hints"]


def test_python_playground_only_parses():
    assert check_python("print('ok')")["ok"]
    assert not check_python("def broken(")["ok"]


def test_scanner_rejects_private_and_credentialed_targets():
    for value in ("http://127.0.0.1", "http://169.254.169.254", "http://user:pass@example.com"):
        try:
            _validate_target(value)
        except ValueError:
            pass
        else:
            raise AssertionError("unsafe scanner target was accepted")
