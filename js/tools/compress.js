(function () {
  "use strict";
  const panel = document.getElementById("panel-compress");
  if (!panel) return;

  const dropzone = document.getElementById("compress-dropzone");
  const input = document.getElementById("compress-input");
  const listEl = document.getElementById("compress-file-list");
  const actionBtn = document.getElementById("compress-action");

  const LEVELS = {
    low: { maxDim: 2200, quality: 0.82 },
    medium: { maxDim: 1600, quality: 0.62 },
    high: { maxDim: 1200, quality: 0.42 },
  };

  let file = null;

  function setFile(f) {
    file = f;
    App.renderFileList(listEl, file ? [file] : [], (next) => setFile(next[0] || null));
    actionBtn.disabled = !file;
    App.resetPanelState(panel);
  }

  App.setupDropzone(dropzone, input, {
    onFiles(newFiles) {
      const f = newFiles.find((x) => /\.pdf$/i.test(x.name) || x.type === "application/pdf");
      if (f) setFile(f);
    },
  });

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "compress") setFile(null);
  });

  function isTargetImage(obj) {
    if (!(obj instanceof PDFLib.PDFRawStream)) return false;
    const dict = obj.dict;
    const subtype = dict.lookup(PDFLib.PDFName.of("Subtype"));
    if (subtype !== PDFLib.PDFName.of("Image")) return false;
    const filter = dict.lookup(PDFLib.PDFName.of("Filter"));
    if (filter !== PDFLib.PDFName.of("DCTDecode")) return false;
    const colorSpace = dict.lookup(PDFLib.PDFName.of("ColorSpace"));
    if (colorSpace !== PDFLib.PDFName.of("DeviceRGB")) return false;
    if (dict.lookup(PDFLib.PDFName.of("SMask")) || dict.lookup(PDFLib.PDFName.of("Mask"))) return false;
    return true;
  }

  function decodeJpeg(bytes) {
    return new Promise((resolve, reject) => {
      const blob = new Blob([bytes], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("jpeg decode failed"));
      };
      img.src = url;
    });
  }

  function canvasToJpeg(canvas, quality) {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/jpeg",
        quality
      );
    });
  }

  async function recompressImage(rawStream, opts) {
    const dict = rawStream.dict;
    const contents = rawStream.getContents();
    const widthNum = dict.lookup(PDFLib.PDFName.of("Width"));
    const heightNum = dict.lookup(PDFLib.PDFName.of("Height"));
    if (!widthNum || !heightNum) return;
    const width = widthNum.asNumber();
    const height = heightNum.asNumber();
    if (width < 64 || height < 64) return;

    const maxDim = Math.max(width, height);
    const scale = Math.min(1, opts.maxDim / maxDim);
    const targetW = Math.max(1, Math.round(width * scale));
    const targetH = Math.max(1, Math.round(height * scale));
    if (scale >= 0.98 && opts.quality >= 0.8) return; // low level: skip re-encode if barely changes anything

    const img = await decodeJpeg(contents);
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, targetW, targetH);
    const blob = await canvasToJpeg(canvas, opts.quality);
    const newBytes = new Uint8Array(await blob.arrayBuffer());

    if (newBytes.length < contents.length) {
      rawStream.updateContents(newBytes);
      dict.set(PDFLib.PDFName.of("Width"), PDFLib.PDFNumber.of(targetW));
      dict.set(PDFLib.PDFName.of("Height"), PDFLib.PDFNumber.of(targetH));
    }
  }

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    const level = panel.querySelector('input[name="compress-level"]:checked').value;
    actionBtn.disabled = true;
    App.setProgress(panel, 5, i18n.t("common.processing"));
    try {
      const originalSize = file.size;
      const bytes = await App.readAsArrayBuffer(file);
      const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
      const opts = LEVELS[level];
      const entries = doc.context.enumerateIndirectObjects();
      const images = entries.filter(([, obj]) => isTargetImage(obj));

      for (let i = 0; i < images.length; i++) {
        try {
          await recompressImage(images[i][1], opts);
        } catch (err) {
          console.warn("Skipped an image during compression:", err);
        }
        App.setProgress(panel, 10 + Math.round(((i + 1) / Math.max(images.length, 1)) * 75), i18n.t("common.processing"));
      }

      const outBytes = await doc.save({ useObjectStreams: true });
      App.setProgress(panel, 100);
      App.hideProgress(panel);

      const savedPct = originalSize > 0 ? Math.round((1 - outBytes.byteLength / originalSize) * 100) : 0;
      const desc =
        savedPct > 3
          ? `${i18n.t("compress.savedPrefix")} ${App.formatBytes(originalSize)} ${i18n.t("compress.savedMiddle")} ${App.formatBytes(outBytes.byteLength)} (-${savedPct}%)`
          : i18n.t("compress.noSavings");

      App.showResult(panel, {
        title: i18n.t("compress.resultTitle"),
        desc,
        onDownload: () => App.download(outBytes, "compressed.pdf", "application/pdf"),
      });
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      App.showError(panel, i18n.t("common.invalidPdf"));
    } finally {
      actionBtn.disabled = !file;
    }
  });
})();
