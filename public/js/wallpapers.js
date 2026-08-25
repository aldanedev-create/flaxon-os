(function () {
  const key = "flaxon-wallpaper";
  const valid = new Set(["default", "aurora", "ocean", "dusk", "sunrise", "graphite"]);
  const apply = id => {
    id = valid.has(id) ? id : "default";
    document.documentElement.dataset.wallpaper = id;
    localStorage.setItem(key, id);
    return id;
  };
  const current = () => apply(localStorage.getItem(key) || "default");
  window.FlxonOS = window.FlxonOS || {};
  window.FlxonOS.wallpapers = { apply, current, list: () => [...valid] };
  window.addEventListener("DOMContentLoaded", current);
  document.addEventListener("click", event => {
    const button = event.target.closest("[data-wallpaper]");
    if (button) apply(button.dataset.wallpaper);
  });
  window.addEventListener("flaxon:close-wallpapers", () => { const panel = document.querySelector("#wallpaper-module"); if (panel) panel.hidden = true; });
})();
