(function () {
  "use strict";
  const panel = document.getElementById("panel-delete");
  if (!panel) return;

  const dropzone = document.getElementById("delete-dropzone");
  const input = document.getElementById("delete-input");
  const grid = document.getElementById("delete-grid");
  const toolbar = document.getElementById("delete-toolbar");
  const countEl = document.getElementById("delete-count");
  const actionBtn = document.getElementById("delete-action");

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
    if (e.detail.toolId === "delete") reset();
  });

  function updateCount() {
    const marked = thumbs.filter((t) => t.marked).length;
    countEl.textContent = String(marked);
  }

  async function loadFile(file) {
    App.resetPanelState(panel);
    try {
      sourceBytes = await App.readAsArrayBuffer(file);
      thumbs = await App.renderPdfThumbnails(sourceBytes, grid, { draggable: false });
      thumbs.forEach((t) => {
        t.marked = false;
        t.el.addEventListener("click", () => {
          const willMark = !t.marked;
          if (willMark && thumbs.filter((x) => x.marked).length >= thumbs.length - 1) {
            App.showError(panel, i18n.t("delete.errorAll"));
            return;
          }
          App.hideError(panel);
          t.marked = willMark;
          t.el.classList.toggle("marked", t.marked);
          updateCount();
        });
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

  actionBtn.addEventListener("click", async () => {
    if (!sourceBytes) return;
    const keepIndices = thumbs.filter((t) => !t.marked).map((t) => t.index);
    if (!keepIndices.length) {
      App.showError(panel, i18n.t("delete.errorAll"));
      return;
    }
    App.resetPanelState(panel);
    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const src = await PDFLib.PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const doc = await PDFLib.PDFDocument.create();
      const pages = await doc.copyPages(src, keepIndices);
      pages.forEach((p) => doc.addPage(p));
      App.setProgress(panel, 75, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("delete.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "edited.pdf", "application/pdf"),
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
