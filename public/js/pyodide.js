(function () {
  let worker = null;
  let activeFinish = null;
  const createWorker = () => {
    if (worker) return worker;
    worker = new Worker("/assets/js/pyodide-worker.js");
    worker.addEventListener("error", event => {
      if (activeFinish) activeFinish({ ok: false, error: event.message || "The Python worker failed to load." });
      worker?.terminate(); worker = null;
    });
    return worker;
  };
  window.FlxonOS = window.FlxonOS || {};
  window.FlxonOS.python = {
    run(source, options) {
      if (activeFinish) return Promise.resolve({ ok: false, error: "Python is already running. Stop it before starting another run." });
      const runtimeWorker = createWorker();
      // Runtime startup downloads roughly 10MB. Give startup more time than
      // ordinary code, while still bounding execution and allowing recovery.
      // Callers can still request a shorter 60000ms test/development budget.
      const timeoutMs = Math.min(Math.max(Number(options && options.timeoutMs) || 180000, 1000), 180000);
      return new Promise(resolve => {
        let settled = false;
        const finish = value => { if (settled) return; settled = true; clearTimeout(timer); runtimeWorker.removeEventListener("message", onMessage); activeFinish = null; resolve(value); };
        activeFinish = finish;
        const onMessage = event => { if (event.data?.type !== "status") finish(event.data); };
        const timer = setTimeout(() => { runtimeWorker.terminate(); worker = null; finish({ ok: false, error: "Python timed out after " + Math.round(timeoutMs / 1000) + " seconds and the worker was reset. The runtime may still be downloading; try Run again." }); }, timeoutMs);
        runtimeWorker.addEventListener("message", onMessage);
        try { runtimeWorker.postMessage({ type: "run", source: String(source || "") }); } catch (error) { finish({ ok: false, error: error.message }); }
      });
    },
    stop() { if (worker) { worker.terminate(); worker = null; } if (activeFinish) activeFinish({ ok: false, error: "Python execution stopped." }); }
  };
})();
