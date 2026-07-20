(function () {
  "use strict";
  const panel = document.getElementById("panel-excel2pdf");
  if (!panel) return;

  const dropzone = document.getElementById("excel2pdf-dropzone");
  const input = document.getElementById("excel2pdf-input");
  const listEl = document.getElementById("excel2pdf-file-list");
  const actionBtn = document.getElementById("excel2pdf-action");

  let file = null;

  function setFile(f) {
    file = f;
    App.renderFileList(listEl, file ? [file] : [], (next) => setFile(next[0] || null));
    actionBtn.disabled = !file;
    App.resetPanelState(panel);
  }

  App.setupDropzone(dropzone, input, {
    onFiles(newFiles) {
      const f = newFiles.find((x) => /\.(xlsx|xls|csv)$/i.test(x.name));
      if (f) setFile(f);
    },
  });

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "excel2pdf") setFile(null);
  });

  function sheetToHtmlTable(sheet, sheetName) {
    const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: "" });
    const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
    let html = `<div style="padding:32px;font-family:Arial, sans-serif;">`;
    html += `<h2 style="font-size:15pt;margin:0 0 12px;">${App.escapeHtml(sheetName)}</h2>`;
    if (!maxCols) {
      html += `<p style="color:#888;font-size:10pt;">(empty sheet)</p>`;
    } else {
      html += `<table style="border-collapse:collapse;width:100%;">`;
      rows.forEach((row, rIdx) => {
        html += "<tr>";
        for (let c = 0; c < maxCols; c++) {
          const val = row[c] !== undefined ? row[c] : "";
          const tag = rIdx === 0 ? "th" : "td";
          const style =
            rIdx === 0
              ? "border:1px solid #bbb;padding:5px 8px;font-size:9.5pt;background:#f0f1f6;text-align:left;font-weight:700;"
              : "border:1px solid #ccc;padding:5px 8px;font-size:9.5pt;";
          html += `<${tag} style="${style}">${App.escapeHtml(val)}</${tag}>`;
        }
        html += "</tr>";
      });
      html += "</table>";
    }
    html += "</div>";
    return html;
  }

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    actionBtn.disabled = true;
    App.setProgress(panel, 10, i18n.t("common.processing"));
    try {
      let workbook;
      if (/\.csv$/i.test(file.name)) {
        const text = await file.text();
        workbook = window.XLSX.read(text, { type: "string" });
      } else {
        const bytes = await App.readAsArrayBuffer(file);
        workbook = window.XLSX.read(new Uint8Array(bytes), { type: "array" });
      }

      const sheetNames = workbook.SheetNames;
      const merged = await PDFLib.PDFDocument.create();

      for (let i = 0; i < sheetNames.length; i++) {
        const html = sheetToHtmlTable(workbook.Sheets[sheetNames[i]], sheetNames[i]);
        const pageBuffer = await App.renderHtmlToPdfBytes(html);
        const sheetDoc = await PDFLib.PDFDocument.load(pageBuffer);
        const pages = await merged.copyPages(sheetDoc, sheetDoc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        App.setProgress(panel, 15 + Math.round(((i + 1) / sheetNames.length) * 75), i18n.t("common.processing"));
      }

      const outBytes = await merged.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("excel2pdf.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () =>
          App.download(outBytes, file.name.replace(/\.(xlsx|xls|csv)$/i, "") + ".pdf", "application/pdf"),
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
