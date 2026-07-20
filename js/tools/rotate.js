(function () {
  "use strict";
  const panel = document.getElementById("panel-rotate");
  if (!panel) return;

  const dropzone = document.getElementById("rotate-dropzone");
  const input = document.getElementById("rotate-input");
  const grid = document.getElementById("rotate-grid");
  const toolbar = document.getElementById("rotate-toolbar");
  const actionBtn = document.getElementById("rotate-action");
  const allLeftBtn = document.getElementById("rotate-all-left");
  const allRightBtn = document.getElementById("rotate-all-right");

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
    if (e.detail.toolId === "rotate") reset();
  });

  function applyVisualRotation(thumb) {
    thumb.canvas.style.transform = `rotate(${thumb.rotation}deg)`;
  }

  function addThumbControls(thumb) {
    thumb.el.querySelector(".thumb-canvas-wrap").classList.add("no-clip");
    const actions = document.createElement("div");
    actions.className = "thumb-actions";
    actions.innerHTML = `
      <button type="button" class="thumb-btn" data-dir="left">${App.svgIcon("rotate-left")}</button>
      <button type="button" class="thumb-btn" data-dir="right">${App.svgIcon("rotate-right")}</button>
    `;
    thumb.el.appendChild(actions);
    actions.querySelector('[data-dir="left"]').addEventListener("click", (e) => {
      e.stopPropagation();
      thumb.rotation = (thumb.rotation - 90 + 360) % 360;
      applyVisualRotation(thumb);
    });
    actions.querySelector('[data-dir="right"]').addEventListener("click", (e) => {
      e.stopPropagation();
      thumb.rotation = (thumb.rotation + 90) % 360;
      applyVisualRotation(thumb);
    });
  }

  async function loadFile(file) {
    App.resetPanelState(panel);
    try {
      sourceBytes = await App.readAsArrayBuffer(file);
      thumbs = await App.renderPdfThumbnails(sourceBytes, grid, { draggable: false });
      thumbs.forEach((t) => {
        t.rotation = 0;
        addThumbControls(t);
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

  allLeftBtn.addEventListener("click", () => {
    thumbs.forEach((t) => {
      t.rotation = (t.rotation - 90 + 360) % 360;
      applyVisualRotation(t);
    });
  });
  allRightBtn.addEventListener("click", () => {
    thumbs.forEach((t) => {
      t.rotation = (t.rotation + 90) % 360;
      applyVisualRotation(t);
    });
  });

  actionBtn.addEventListener("click", async () => {
    if (!sourceBytes) return;
    App.resetPanelState(panel);
    actionBtn.disabled = true;
    App.setProgress(panel, 10, i18n.t("common.processing"));
    try {
      const doc = await PDFLib.PDFDocument.load(sourceBytes, { ignoreEncryption: true });
      const pages = doc.getPages();
      thumbs.forEach((t) => {
        if (t.rotation % 360 !== 0) {
          const page = pages[t.index];
          const current = page.getRotation().angle;
          page.setRotation(PDFLib.degrees(current + t.rotation));
        }
      });
      App.setProgress(panel, 70, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("rotate.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "rotated.pdf", "application/pdf"),
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
