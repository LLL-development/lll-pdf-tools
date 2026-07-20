(function () {
  "use strict";
  const panel = document.getElementById("panel-ppt2pdf");
  if (!panel) return;

  const dropzone = document.getElementById("ppt2pdf-dropzone");
  const input = document.getElementById("ppt2pdf-input");
  const listEl = document.getElementById("ppt2pdf-file-list");
  const actionBtn = document.getElementById("ppt2pdf-action");

  let file = null;

  function setFile(f) {
    file = f;
    App.renderFileList(listEl, file ? [file] : [], (next) => setFile(next[0] || null));
    actionBtn.disabled = !file;
    App.resetPanelState(panel);
  }

  App.setupDropzone(dropzone, input, {
    onFiles(newFiles) {
      const f = newFiles.find((x) => /\.pptx$/i.test(x.name));
      if (f) setFile(f);
    },
  });

  document.addEventListener("lll:toolopen", (e) => {
    if (e.detail.toolId === "ppt2pdf") setFile(null);
  });

  async function loadSlideLines(arrayBuffer) {
    const zip = await window.JSZip.loadAsync(arrayBuffer);
    const slideFiles = Object.keys(zip.files).filter((name) =>
      /^ppt\/slides\/slide\d+\.xml$/.test(name)
    );
    slideFiles.sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)\.xml/)[1], 10);
      const nb = parseInt(b.match(/slide(\d+)\.xml/)[1], 10);
      return na - nb;
    });
    if (!slideFiles.length) throw new Error("no slides found");

    const slides = [];
    for (const name of slideFiles) {
      const xmlText = await zip.file(name).async("string");
      const xmlDoc = new DOMParser().parseFromString(xmlText, "application/xml");
      const paragraphs = Array.from(xmlDoc.getElementsByTagName("a:p"));
      const lines = paragraphs
        .map((p) =>
          Array.from(p.getElementsByTagName("a:t"))
            .map((t) => t.textContent || "")
            .join("")
        )
        .filter((line) => line.trim().length > 0);
      slides.push(lines);
    }
    return slides;
  }

  function slideToHtml(lines, index, total) {
    const title = lines[0] || "";
    const body = lines.slice(1);
    let html = `<div style="position:relative;padding:44px;min-height:520px;font-family:Arial, sans-serif;box-sizing:border-box;">`;
    if (title) {
      html += `<h1 style="font-size:21pt;margin:0 0 22px;color:#1a1a1a;">${App.escapeHtml(title)}</h1>`;
    }
    if (body.length) {
      html += body
        .map((line) => `<p style="font-size:13pt;margin:0 0 10px;color:#333;">• ${App.escapeHtml(line)}</p>`)
        .join("");
    } else if (!title) {
      html += `<p style="color:#aaa;font-size:11pt;">(no text on this slide)</p>`;
    }
    html += `<div style="position:absolute;bottom:16px;right:28px;color:#aaa;font-size:9pt;">${index + 1} / ${total}</div>`;
    html += `</div>`;
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
      const bytes = await App.readAsArrayBuffer(file);
      const slides = await loadSlideLines(bytes);
      const merged = await PDFLib.PDFDocument.create();

      for (let i = 0; i < slides.length; i++) {
        const html = slideToHtml(slides[i], i, slides.length);
        const pageBuffer = await App.renderHtmlToPdfBytes(html);
        const slideDoc = await PDFLib.PDFDocument.load(pageBuffer);
        const pages = await merged.copyPages(slideDoc, slideDoc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
        App.setProgress(panel, 15 + Math.round(((i + 1) / slides.length) * 75), i18n.t("common.processing"));
      }

      const outBytes = await merged.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("ppt2pdf.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () =>
          App.download(outBytes, file.name.replace(/\.pptx$/i, "") + ".pdf", "application/pdf"),
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
