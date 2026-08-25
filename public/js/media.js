(function () {
  let recorder = null;
  let chunks = [];
  let stream = null;

  const mimeTypes = kind => kind === "video"
    ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"]
    : ["audio/webm;codecs=opus", "audio/webm"];
  const supportedMimeType = kind => {
    if (!window.MediaRecorder) return "";
    return mimeTypes(kind).find(type => !MediaRecorder.isTypeSupported || MediaRecorder.isTypeSupported(type)) || "";
  };
  const stopTracks = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    stream = null;
  };
  const reset = () => { recorder = null; chunks = []; stopTracks(); };
  const seek = (video, time) => new Promise((resolve, reject) => {
    const target = Math.max(0, Math.min(Number(time) || 0, Number.isFinite(video.duration) ? video.duration : Number(time) || 0));
    if (Math.abs(video.currentTime - target) < 0.02) { resolve(); return; }
    const timer = setTimeout(() => { cleanup(); reject(new Error("Video seek timed out.")); }, 10000);
    const cleanup = () => { clearTimeout(timer); video.removeEventListener("seeked", done); video.removeEventListener("error", failed); };
    const done = () => { cleanup(); resolve(); };
    const failed = () => { cleanup(); reject(new Error("Video seek failed.")); };
    video.addEventListener("seeked", done, { once: true });
    video.addEventListener("error", failed, { once: true });
    video.currentTime = target;
  });
  const recordPlayback = async (video, start, end) => {
    if (!video?.captureStream || !window.MediaRecorder) throw new Error("This browser does not support WebM export.");
    if (Number.isNaN(Number(video.duration)) || end <= start) throw new Error("The export range is invalid.");
    const mimeType = supportedMimeType("video");
    if (!mimeType) throw new Error("This browser does not provide a supported WebM export format.");
    const capture = video.captureStream(30);
    const output = new MediaRecorder(capture, { mimeType });
    const parts = [];
    let animation = 0;
    let stopped = false;
    const finish = () => { if (!stopped) { stopped = true; cancelAnimationFrame(animation); if (output.state !== "inactive") { try { output.requestData(); } catch (_) {} setTimeout(() => { if (output.state !== "inactive") output.stop(); }, 0); } } };
    const result = new Promise((resolve, reject) => {
      output.ondataavailable = event => { if (event.data?.size) parts.push(event.data); };
      output.onerror = event => { finish(); reject(event.error || new Error("Video export failed.")); };
      output.onstop = () => { capture.getTracks().forEach(track => track.stop()); resolve(new Blob(parts, { type: output.mimeType || mimeType })); };
    });
    try {
      await seek(video, start);
      await video.play();
      output.start(250);
      const tick = () => { if (video.currentTime >= end || video.ended) { video.pause(); finish(); } else animation = requestAnimationFrame(tick); };
      tick();
      return await result;
    } catch (error) {
      video.pause();
      finish();
      capture.getTracks().forEach(track => track.stop());
      throw error;
    }
  };
  const download = (blob, filename) => { const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); };

  window.FlxonOS = window.FlxonOS || {};
  window.FlxonOS.media = {
    supportedMimeType,
    isRecording: () => Boolean(recorder && recorder.state === "recording"),
    async start(kind) {
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) throw new Error("Media recording is not supported by this browser.");
      if (recorder) throw new Error("A recording is already in progress.");
      const requestedKind = kind === "video" ? "video" : "audio";
      const mimeType = supportedMimeType(requestedKind);
      if (!mimeType) throw new Error("This browser does not provide a supported WebM recording format.");
      try {
        stream = await navigator.mediaDevices.getUserMedia(requestedKind === "video" ? { audio: true, video: true } : { audio: true });
        chunks = [];
        recorder = new MediaRecorder(stream, { mimeType });
        recorder.ondataavailable = event => { if (event.data?.size) chunks.push(event.data); };
        recorder.start(250);
        return { kind: requestedKind, mimeType };
      } catch (error) {
        reset();
        throw error;
      }
    },
    async stop(kind) {
      if (!recorder) return null;
      const activeRecorder = recorder;
      const requestedKind = kind === "video" ? "video" : "audio";
      return new Promise((resolve, reject) => {
        let settled = false;
        const finish = async (error) => {
          if (settled) return;
          settled = true;
          try {
            if (error) throw error;
            const blob = new Blob(chunks, { type: activeRecorder.mimeType || supportedMimeType(requestedKind) || (requestedKind === "video" ? "video/webm" : "audio/webm") });
            const id = Date.now();
            await window.FlxonOS.db.put("recordings", { id, kind: requestedKind, blob, createdAt: new Date().toISOString() });
            resolve({ id, kind: requestedKind, type: blob.type, size: blob.size });
          } catch (saveError) {
            reject(saveError);
          } finally {
            reset();
          }
        };
        activeRecorder.onerror = event => finish(event.error || new Error("Media recorder failed."));
        activeRecorder.onstop = () => finish();
        try {
          if (activeRecorder.state === "inactive") finish();
          else activeRecorder.stop();
        } catch (error) {
          finish(error);
        }
      });
    },
    cancel() {
      if (recorder && recorder.state !== "inactive") recorder.stop();
      reset();
    },
    async exportClip(video, start, end, filename = "flaxon-clip.webm") {
      const blob = await recordPlayback(video, Number(start) || 0, Number(end) || 0);
      download(blob, filename);
      return { type: blob.type, size: blob.size };
    },
    async exportTimeline(video, clips, loadClip, filename = "flaxon-timeline.webm") {
      if (!video || !HTMLCanvasElement.prototype.captureStream || !window.MediaRecorder || !Array.isArray(clips) || !clips.length) throw new Error("This browser does not support timeline WebM export.");
      const mimeType = supportedMimeType("video");
      if (!mimeType) throw new Error("This browser does not provide a supported WebM export format.");
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const context = canvas.getContext("2d");
      const capture = canvas.captureStream(30);
      const output = new MediaRecorder(capture, { mimeType });
      const parts = [];
      const urls = [];
      let animation = 0;
      let stopped = false;
      output.ondataavailable = event => { if (event.data?.size) parts.push(event.data); };
      const finish = () => {
        if (stopped) return Promise.resolve(new Blob(parts, { type: output.mimeType || mimeType }));
        stopped = true;
        cancelAnimationFrame(animation);
        return new Promise((resolve, reject) => {
          const timer = setTimeout(() => {
            output.onstop = null;
            reject(new Error("Timeline export timed out while finalizing."));
          }, 10000);
          output.onstop = () => {
            clearTimeout(timer);
            resolve(new Blob(parts, { type: output.mimeType || mimeType }));
          };
          output.onerror = event => {
            clearTimeout(timer);
            reject(event.error || new Error("Timeline export failed."));
          };
          if (output.state === "inactive") {
            clearTimeout(timer);
            resolve(new Blob(parts, { type: output.mimeType || mimeType }));
            return;
          }
          try { output.requestData(); } catch (_) {}
          setTimeout(() => { if (output.state !== "inactive") output.stop(); }, 0);
        });
      };
      try {
        output.start(250);
        for (const clip of clips) {
          const media = await loadClip(clip);
          if (!media?.blob) continue;
          const url = URL.createObjectURL(media.blob);
          urls.push(url);
          video.src = url;
          await new Promise((resolve, reject) => { const timer = setTimeout(() => { cleanup(); reject(new Error("Timeline clip loading timed out.")); }, 10000); const cleanup = () => { clearTimeout(timer); video.removeEventListener("loadedmetadata", loaded); video.removeEventListener("error", failed); }; const loaded = () => { cleanup(); resolve(); }; const failed = () => { cleanup(); reject(new Error("Timeline clip could not be loaded.")); }; video.addEventListener("loadedmetadata", loaded, { once: true }); video.addEventListener("error", failed, { once: true }); });
          const start = Math.max(0, Number(clip.inPoint) || 0);
          const end = Math.min(video.duration, Number(clip.outPoint) || video.duration);
          if (!(end > start)) continue;
          if (video.videoWidth && video.videoHeight && canvas.width === 1280 && canvas.height === 720) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          }
          await seek(video, start);
          await video.play();
          await new Promise(resolve => {
            const tick = () => {
              if (video.readyState >= 2) context.drawImage(video, 0, 0, canvas.width, canvas.height);
              if (video.currentTime >= end || video.ended) { video.pause(); resolve(); }
              else animation = requestAnimationFrame(tick);
            };
            tick();
          });
        }
        cancelAnimationFrame(animation);
        // Give MediaRecorder a task to emit the final video cluster for short clips.
        await new Promise(resolve => setTimeout(resolve, 150));
        const blob = await finish();
        download(blob, filename);
        return { type: blob.type, size: blob.size };
      } finally {
        cancelAnimationFrame(animation);
        video.pause();
        if (!stopped) {
          stopped = true;
          if (output.state !== "inactive") output.stop();
        }
        capture.getTracks().forEach(track => track.stop());
        urls.forEach(url => URL.revokeObjectURL(url));
      }
    }
  };
})();
