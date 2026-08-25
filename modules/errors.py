"""Safe, deterministic developer-error hints; never sends source to a model."""

import re
from flaxon.http.request import Request

_HINTS = [
    (r"ModuleNotFoundError", "Check the import name, virtual environment, and project dependency list."),
    (r"IndentationError", "Use consistent spaces and inspect the line immediately before the reported location."),
    (r"SyntaxError", "Check delimiters, quotes, and the statement highlighted by the parser."),
    (r"TypeError", "Inspect the types and function signature at the failing call site."),
    (r"KeyError", "Use .get() or validate the key before indexing the mapping."),
    (r"ConnectionError|TimeoutError", "Verify the URL, service availability, timeout, and network policy."),
]


def solve_diagnostic(text: str) -> dict:
    text = (text or "").strip()[:20_000]
    if not text:
        return {"ok": False, "error": "Provide an error message or traceback."}
    match = re.findall(r"^([A-Za-z_][\w]*(?:Error|Exception))(?::\s*(.*))?$", text, re.MULTILINE)
    error_type, message = (match[-1] if match else ("Unknown", text.splitlines()[-1][:500]))
    frame_matches = re.findall(r'File ["\']([^"\']+)["\'], line (\d+)(?:, in ([^\n]+))?', text)
    location = None
    if frame_matches:
        filename, line, function = frame_matches[-1]
        location = {"file": filename, "line": int(line), "function": (function or "").strip() or None}
    source_line = None
    lines = text.splitlines()
    for index, line in enumerate(lines):
        if location and line.strip().startswith("^") and index:
            source_line = lines[index - 1].strip()
            break
    if not source_line and match:
        for index, line in enumerate(lines):
            if line.startswith(error_type + ":") and index:
                source_line = lines[index - 1].strip() or None
                break
    hints = [hint for pattern, hint in _HINTS if re.search(pattern, text, re.I)]
    if error_type == "SyntaxError":
        hints.append("Run python -m py_compile on the file; syntax errors must be fixed before the program can start.")
    if location:
        hints.append("Open the reported file and inspect the failing line together with the preceding line.")
    return {
        "ok": True,
        "error_type": error_type,
        "message": message or "No exception message was provided.",
        "location": location,
        "source_line": source_line,
        "hints": list(dict.fromkeys(hints or ["Read the final traceback frame first, reproduce with the smallest input, then add a focused test."])),
        "next_steps": ["Reproduce the smallest failing case.", "Apply one change at a time.", "Add a regression test after the fix."],
        "safe": True,
    }


def register_errors(app):
    @app.post("/api/devtools/solve")
    async def solve(request: Request):
        data = await request.json()
        return solve_diagnostic(str(data.get("diagnostic", "")))

    @app.get("/api/devtools/solve")
    async def solve_get(request: Request):
        return solve_diagnostic(str(request.query.get("diagnostic", "")))
