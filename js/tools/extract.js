(function () {
  "use strict";
  const panel = document.getElementById("panel-extract");
  if (!panel) return;

  const dropzone = document.getElementById("extract-dropzone");
  const input = document.getElementById("extract-input");
  const grid = document.getElementById("extract-grid");
  const toolbar = document.getElementById("extract-toolbar");
  const countEl = document.getElementById("extract-count");
  const actionBtn = document.getElementById("extract-action");
  const selectAllBtn = document.getElementById("extract-select-all");
  const clearBtn = document.getElementById("extract-clear");

  let sourceBytes = null;
  let thumbs = [];

  function reset() {
    sourceBytes = null;
    thumbs = [];
    grid.innerHTML = "";
    toolbar.classList.add("hidden");
    actionBtn.classList.add("hidden");
    dropzone.classList.remove("hidden");
    App.resetPanelState(panel);
  }

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "extract") reset();
  });

  function updateCount() {
    countEl.textContent = String(thumbs.filter((t) => t.selected).length);
  }

  function setSelected(thumb, selected) {
    thumb.selected = selected;
    thumb.el.classList.toggle("selected", selected);
    thumb.checkbox.checked = selected;
    updateCount();
  }

  async function loadFile(file) {
    App.resetPanelState(panel);
    try {
      sourceBytes = await App.readAsArrayBuffer(file);
      thumbs = await App.renderPdfThumbnails(sourceBytes, grid, { draggable: false });
      thumbs.forEach((t) => {
        t.selected = false;
        const cb = document.createElement("input");
        cb.type = "checkbox";
        cb.className = "thumb-select";
        t.el.style.position = "relative";
        t.el.appendChild(cb);
        t.checkbox = cb;
        cb.addEventListener("click", (e) => e.stopPropagation());
        cb.addEventListener("change", () => setSelected(t, cb.checked));
        t.el.addEventListener("click", () => setSelected(t, !t.selected));
      });
      dropzone.classList.add("hidden");
      toolbar.classList.remove("hidden");
      actionBtn.classList.remove("hidden");
      updateCount();
    } catch (err) {
      console.error(err);
      App.showError(panel, i18n.t("common.invalidPdf"));
    }
  }

  App.setupDropzone(dropzone, input, {
    onFiles(files) {
      const f = files.find((x) => /\.pdf$/i.test(x.name) || x.type === "application/pdf");
      if (f) loadFile(f);
    },
  });

  selectAllBtn.addEventListener("click", () => thumbs.forEach((t) => setSelected(t, true)));
  clearBtn.addEventListener("click", () => thumbs.forEach((t) => setSelected(t, false)));

  actionBtn.addEventListener("click", async () => {
    if (!sourceBytes) return;
    const selectedIndices = thumbs.filter((t) => t.selected).map((t) => t.index).sort((a, b) => a - b);
    if (!selectedIndices.length) {
      App.showError(panel, i18n.t("extract.errorNone"));
      return;
    }
    App.resetPanelState(panel);
    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const src = await PDFLib.PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const doc = await PDFLib.PDFDocument.create();
      const pages = await doc.copyPages(src, selectedIndices);
      pages.forEach((p) => doc.addPage(p));
      App.setProgress(panel, 75, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("extract.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "extracted.pdf", "application/pdf"),
      });
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      App.showError(panel, i18n.t("common.genericError"));
    } finally {
      actionBtn.disabled = false;
    }
  });

  reset();
})();
