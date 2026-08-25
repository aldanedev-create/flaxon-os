(function () {
  let installPrompt = null;
  window.FlxonOS = window.FlxonOS || {};
  window.FlxonOS.pwa = { canInstall: () => Boolean(installPrompt), install: async () => { if (!installPrompt) return false; installPrompt.prompt(); const result = await installPrompt.userChoice; installPrompt = null; return result.outcome === "accepted"; } };
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt = event; window.dispatchEvent(new CustomEvent("flaxon:install-available")); });
  if ("serviceWorker" in navigator) window.addEventListener("load", async () => { try { const registration = await navigator.serviceWorker.register("/sw.js", { scope: "/" }); registration.addEventListener("updatefound", () => window.dispatchEvent(new CustomEvent("flaxon:update-available"))); } catch (error) { window.dispatchEvent(new CustomEvent("flaxon:pwa-error", { detail: error.message })); } });
})();
