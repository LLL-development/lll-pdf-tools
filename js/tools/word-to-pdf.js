(function () {
  "use strict";
  const panel = document.getElementById("panel-word2pdf");
  if (!panel) return;

  const dropzone = document.getElementById("word2pdf-dropzone");
  const input = document.getElementById("word2pdf-input");
  const listEl = document.getElementById("word2pdf-file-list");
  const actionBtn = document.getElementById("word2pdf-action");

  let file = null;

  function setFile(f) {
    file = f;
    App.renderFileList(listEl, file ? [file] : [], (next) => setFile(next[0] || null));
    actionBtn.disabled = !file;
    App.resetPanelState(panel);
  }

  App.setupDropzone(dropzone, input, {
    onFiles(newFiles) {
      const f = newFiles.find((x) => /\.docx$/i.test(x.name));
      if (f) setFile(f);
    },
  });

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "word2pdf") setFile(null);
  });

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const arrayBuffer = await App.readAsArrayBuffer(file);
      const { value: html } = await window.mammoth.convertToHtml({ arrayBuffer });
      App.setProgress(panel, 55, i18n.t("common.processing"));

      const wrapped = `<div style="padding:48px;font-family:Georgia, 'Times New Roman', serif;font-size:12pt;line-height:1.6;color:#111;">${html}</div>
      <style>
        div h1,div h2,div h3{font-family:Arial, sans-serif;margin:0.6em 0 0.4em;}
        div p{margin:0 0 0.8em;}
        div table{border-collapse:collapse;width:100%;margin-bottom:1em;}
        div td,div th{border:1px solid #ccc;padding:4px 8px;font-size:10.5pt;}
        div img{max-width:100%;}
      </style>`;

      const outBuffer = await App.renderHtmlToPdfBytes(wrapped);
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("word2pdf.resultTitle"),
        desc: App.formatBytes(outBuffer.byteLength),
        onDownload: () =>
          App.download(outBuffer, file.name.replace(/\.docx$/i, "") + ".pdf", "application/pdf"),
      });
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      App.showError(panel, i18n.t("common.genericError"));
    } finally {
      actionBtn.disabled = !file;
    }
  });
})();
