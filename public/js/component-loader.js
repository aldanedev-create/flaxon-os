(async function () {
  const [desktop, dock, status, video, wallpapers, python, media, surface, workspace, files] = await Promise.all([
    import("/assets/static/js/components/Desktop.js"),
    import("/assets/static/js/components/Dock.js"),
    import("/assets/static/js/components/StatusBar.js"),
    import("/assets/static/js/components/VideoEditor.js"),
    import("/assets/static/js/components/WallpaperPicker.js"),
    import("/assets/static/js/components/PythonPlayground.js"),
    import("/assets/static/js/components/MediaLibrary.js"),
    import("/assets/static/js/components/AttackSurface.js"),
    import("/assets/static/js/components/WorkspaceTools.js"),
    import("/assets/static/js/components/StudyFiles.js")
  ]);
  const mount = (module, id) => { try { const target = document.getElementById(id); if (target && module.mount) module.mount(target); } catch (error) { console.error("Flaxon component failed", id, error); } };
  mount(desktop, "desktop-module");
  mount(dock, "dock-module");
  mount(status, "status-module");
  mount(video, "video-module");
  mount(wallpapers, "wallpaper-module");
  mount(python, "python-module");
  mount(media, "media-module");
  mount(surface, "surface-module");
  mount(workspace, "workspace-module");
  mount(files, "files-module");
})();
