let runtime = null;
const RUNTIMES = [
  { script: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js", index: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/" },
  { script: "https://unpkg.com/pyodide@0.26.2/pyodide.js", index: "https://unpkg.com/pyodide@0.26.2/" }
];
self.onmessage = async event => {
  const { type, source } = event.data || {};
  if (type !== "run") return;
  try {
    if (!runtime) {
      let lastError = null;
      for (const candidate of RUNTIMES) {
        try {
          self.postMessage({ type: "status", message: "Loading Python runtime (" + candidate.script.split("/")[2] + ")..." });
          importScripts(candidate.script);
          runtime = await loadPyodide({ indexURL: candidate.index });
          break;
        } catch (error) { lastError = error; }
      }
      if (!runtime) throw new Error("Pyodide could not be downloaded. Check your connection or allow the Pyodide CDN. " + String(lastError || ""));
      self.postMessage({ type: "status", message: "Python runtime ready." });
    }
    const code = String(source || "").slice(0, 100_000);
    let output = "";
    runtime.setStdout({ batched: text => { output += text; } });
    runtime.setStderr({ batched: text => { output += text; } });
    const result = await runtime.runPythonAsync(code);
    self.postMessage({ ok: true, output: output + (result === undefined ? "" : String(result)) });
  } catch (error) {
    self.postMessage({ ok: false, error: String(error && error.message || error) });
  }
};
