(function () {
  const stores = ["notes", "recordings", "workspace", "media", "files"];
  const MAX_BACKUP_BYTES = 250 * 1024 * 1024;
  const MAX_ITEMS_PER_STORE = 10000;
  const blobToDataUrl = blob => new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });
  const dataUrlToBlob = value => { const [header, data] = value.split(","); const bytes = atob(data); const buffer = new Uint8Array(bytes.length); for (let index = 0; index < bytes.length; index += 1) buffer[index] = bytes.charCodeAt(index); return new Blob([buffer], { type: (header.match(/data:(.*?);/) || ["", "application/octet-stream"])[1] }); };
  async function exportWorkspace() {
    const payload = { format: "flaxon-workspace", version: 1, createdAt: new Date().toISOString(), stores: {} };
    for (const store of stores) { payload.stores[store] = await window.FlxonOS.db.list(store); for (const item of payload.stores[store]) if (item.blob instanceof Blob) { item.blob = await blobToDataUrl(item.blob); item.blobType = item.blobType || item.type || "application/octet-stream"; } }
    const serialized = JSON.stringify(payload);
    if (serialized.length > MAX_BACKUP_BYTES) throw new Error("Workspace backup exceeds the 250 MB safety limit.");
    return new Blob([serialized], { type: "application/json" });
  }
  async function importWorkspace(file) {
    if (!file || Number(file.size) > MAX_BACKUP_BYTES) throw new Error("Workspace backup exceeds the 250 MB safety limit.");
    let payload;
    try { payload = JSON.parse(await file.text()); } catch (_) { throw new Error("Workspace backup is not valid JSON."); }
    if (!payload || payload.format !== "flaxon-workspace" || payload.version !== 1 || !payload.stores || typeof payload.stores !== "object") throw new Error("Invalid Flaxon workspace backup.");
    for (const store of stores) {
      const items = payload.stores[store] || [];
      if (!Array.isArray(items) || items.length > MAX_ITEMS_PER_STORE) throw new Error("Workspace backup contains too many " + store + " items.");
      for (const item of items) {
        if (!item || typeof item !== "object") throw new Error("Workspace backup contains an invalid item.");
        if (typeof item.blob === "string" && item.blob.startsWith("data:")) item.blob = dataUrlToBlob(item.blob);
        await window.FlxonOS.db.put(store, item);
      }
    }
    window.dispatchEvent(new CustomEvent("flaxon:workspace-imported"));
  }
  window.FlxonOS = window.FlxonOS || {};
  window.FlxonOS.workspace = { export: exportWorkspace, import: importWorkspace };
})();
