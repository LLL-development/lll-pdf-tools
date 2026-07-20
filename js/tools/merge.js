(function () {
  "use strict";
  const panel = document.getElementById("panel-merge");
  if (!panel) return;

  const dropzone = document.getElementById("merge-dropzone");
  const input = document.getElementById("merge-input");
  const listEl = document.getElementById("merge-file-list");
  const reorderHint = document.getElementById("merge-reorder-hint");
  const actionBtn = document.getElementById("merge-action");

  let files = [];

  function setFiles(next) {
    files = next;
    App.renderFileList(listEl, files, setFiles);
    reorderHint.classList.toggle("hidden", files.length < 2);
    actionBtn.disabled = files.length < 2;
    App.resetPanelState(panel);
  }

  App.setupDropzone(dropzone, input, {
    onFiles(newFiles) {
      const pdfs = newFiles.filter((f) => /\.pdf$/i.test(f.name) || f.type === "application/pdf");
      setFiles(files.concat(pdfs));
    },
  });

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "merge") setFiles([]);
  });

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (files.length < 2) {
      App.showError(panel, i18n.t("common.needTwoFiles"));
      return;
    }
    actionBtn.disabled = true;
    App.setProgress(panel, 5, i18n.t("common.processing"));
    try {
      const merged = await PDFLib.PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const bytes = await App.readAsArrayBuffer(files[i]);
        const src = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = await merged.copyPages(src, src.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        App.setProgress(panel, 10 + Math.round(((i + 1) / files.length) * 80), i18n.t("common.processing"));
      }
      const outBytes = await merged.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("merge.resultTitle"),
        desc: i18n.t("merge.resultDesc") + " · " + App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "merged.pdf", "application/pdf"),
      });
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      App.showError(panel, i18n.t("common.invalidPdf"));
    } finally {
      actionBtn.disabled = files.length < 2;
    }
  });
})();
