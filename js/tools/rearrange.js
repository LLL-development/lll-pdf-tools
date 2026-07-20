(function () {
  "use strict";
  const panel = document.getElementById("panel-rearrange");
  if (!panel) return;

  const dropzone = document.getElementById("rearrange-dropzone");
  const input = document.getElementById("rearrange-input");
  const grid = document.getElementById("rearrange-grid");
  const toolbar = document.getElementById("rearrange-toolbar");
  const actionBtn = document.getElementById("rearrange-action");

  let sourceBytes = null;
  let currentOrder = [];

  function reset() {
    sourceBytes = null;
    currentOrder = [];
    grid.innerHTML = "";
    toolbar.classList.add("hidden");
    actionBtn.classList.add("hidden");
    dropzone.classList.remove("hidden");
    App.resetPanelState(panel);
  }

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "rearrange") reset();
  });

  function renumber() {
    Array.from(grid.children).forEach((el, i) => {
      const label = el.querySelector(".page-num");
      if (label) label.textContent = String(i + 1);
    });
  }

  async function loadFile(file) {
    App.resetPanelState(panel);
    try {
      sourceBytes = await App.readAsArrayBuffer(file);
      const thumbs = await App.renderPdfThumbnails(sourceBytes, grid, { draggable: true });
      currentOrder = thumbs.map((t) => t.index);
      App.enableThumbDragReorder(grid, thumbs, (newOrder) => {
        currentOrder = newOrder;
        renumber();
      });
      dropzone.classList.add("hidden");
      toolbar.classList.remove("hidden");
      actionBtn.classList.remove("hidden");
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
    App.resetPanelState(panel);
    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const src = await PDFLib.PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const doc = await PDFLib.PDFDocument.create();
      const pages = await doc.copyPages(src, currentOrder);
      pages.forEach((p) => doc.addPage(p));
      App.setProgress(panel, 75, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("rearrange.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "reordered.pdf", "application/pdf"),
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
