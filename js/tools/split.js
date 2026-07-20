(function () {
  "use strict";
  const panel = document.getElementById("panel-split");
  if (!panel) return;

  const dropzone = document.getElementById("split-dropzone");
  const input = document.getElementById("split-input");
  const listEl = document.getElementById("split-file-list");
  const actionBtn = document.getElementById("split-action");
  const rangesGroup = document.getElementById("split-ranges-group");
  const everyGroup = document.getElementById("split-every-group");
  const rangesInput = document.getElementById("split-ranges-input");
  const everyInput = document.getElementById("split-every-input");

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
    if (e.detail.toolId === "split") setFile(null);
  });

  panel.querySelectorAll('input[name="split-mode"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      const mode = panel.querySelector('input[name="split-mode"]:checked').value;
      rangesGroup.classList.toggle("hidden", mode !== "ranges");
      everyGroup.classList.toggle("hidden", mode !== "every");
    });
  });

  function parseRanges(str, totalPages) {
    const groups = [];
    const parts = str.split(",").map((s) => s.trim()).filter(Boolean);
    for (const part of parts) {
      const m = part.match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) {
        let start = parseInt(m[1], 10);
        let end = parseInt(m[2], 10);
        if (start > end) [start, end] = [end, start];
        start = Math.max(1, start);
        end = Math.min(totalPages, end);
        if (start > totalPages) continue;
        const group = [];
        for (let p = start; p <= end; p++) group.push(p - 1);
        if (group.length) groups.push(group);
      } else if (/^\d+$/.test(part)) {
        const p = parseInt(part, 10);
        if (p >= 1 && p <= totalPages) groups.push([p - 1]);
      }
    }
    return groups;
  }

  function chunk(totalPages, size) {
    const groups = [];
    for (let i = 0; i < totalPages; i += size) {
      const group = [];
      for (let j = i; j < Math.min(i + size, totalPages); j++) group.push(j);
      groups.push(group);
    }
    return groups;
  }

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    actionBtn.disabled = true;
    App.setProgress(panel, 5, i18n.t("common.processing"));
    try {
      const bytes = await App.readAsArrayBuffer(file);
      const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      const totalPages = src.getPageCount();
      const mode = panel.querySelector('input[name="split-mode"]:checked').value;

      let groups;
      if (mode === "ranges") {
        groups = parseRanges(rangesInput.value, totalPages);
        if (!groups.length) groups = [Array.from({ length: totalPages }, (_, i) => i)];
      } else if (mode === "every") {
        const size = Math.max(1, parseInt(everyInput.value, 10) || 1);
        groups = chunk(totalPages, size);
      } else {
        groups = Array.from({ length: totalPages }, (_, i) => [i]);
      }

      const outputs = [];
      for (let i = 0; i < groups.length; i++) {
        const doc = await PDFLib.PDFDocument.create();
        const pages = await doc.copyPages(src, groups[i]);
        pages.forEach((p) => doc.addPage(p));
        const outBytes = await doc.save();
        outputs.push(outBytes);
        App.setProgress(panel, 10 + Math.round(((i + 1) / groups.length) * 80), i18n.t("common.processing"));
      }

      App.setProgress(panel, 100);
      App.hideProgress(panel);

      if (outputs.length === 1) {
        App.showResult(panel, {
          title: i18n.t("split.resultTitle"),
          desc: App.formatBytes(outputs[0].byteLength),
          onDownload: () => App.download(outputs[0], "split.pdf", "application/pdf"),
          downloadLabelKey: "common.download",
        });
      } else {
        App.showResult(panel, {
          title: i18n.t("split.resultTitle"),
          desc: outputs.length + " " + i18n.t("split.resultDesc"),
          onDownload: async () => {
            const zip = new JSZip();
            outputs.forEach((bytes, idx) => {
              zip.file(`split-${String(idx + 1).padStart(2, "0")}.pdf`, bytes);
            });
            const blob = await zip.generateAsync({ type: "blob" });
            App.download(blob, "split.zip", "application/zip");
          },
          downloadLabelKey: "common.downloadZip",
        });
      }
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      App.showError(panel, i18n.t("common.invalidPdf"));
    } finally {
      actionBtn.disabled = !file;
    }
  });
})();
