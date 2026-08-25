import ast
from flaxon.http.request import Request


def check_python(source: str) -> dict:
    if len(source) > 100_000:
        return {"ok": False, "error": "Python source is limited to 100 KB."}
    try:
        ast.parse(source, mode="exec")
    except SyntaxError as error:
        return {"ok": False, "line": error.lineno, "column": error.offset, "error": error.msg}
    return {"ok": True, "message": "Syntax is valid. Execution is disabled in the hosted application."}


def register_playground(app):
    @app.post("/api/playground/python/check")
    async def check_python_endpoint(request: Request):
        data = await request.json()
        source = str(data.get("source", ""))
        return check_python(source)

    @app.get("/api/playground/python/check")
    async def check_python_get(request: Request):
        return check_python(str(request.query.get("source", "")))

    @app.post("/api/playground/run")
    async def run_playground(request: Request):
        return {"ok": False, "error": "Server-side code execution is disabled for this unauthenticated deployment."}
