(function () {
  "use strict";
  const panel = document.getElementById("panel-pdf2word");
  if (!panel) return;

  const dropzone = document.getElementById("pdf2word-dropzone");
  const input = document.getElementById("pdf2word-input");
  const listEl = document.getElementById("pdf2word-file-list");
  const actionBtn = document.getElementById("pdf2word-action");

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
    if (e.detail.toolId === "pdf2word") setFile(null);
  });

  async function extractPageLines(arrayBuffer) {
    const pdfjsLib = await window.loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ ...window.pdfjsDocumentOptions, data: arrayBuffer.slice(0), isEvalSupported: false });
    const pdf = await loadingTask.promise;
    const pages = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const items = content.items
        .filter((it) => it.str !== undefined)
        .map((it) => ({ str: it.str, x: it.transform[4], y: it.transform[5] }));
      items.sort((a, b) => b.y - a.y || a.x - b.x);

      const lines = [];
      let currentY = null;
      let currentLine = [];
      const tolerance = 2.5;
      for (const it of items) {
        if (currentY === null || Math.abs(it.y - currentY) > tolerance) {
          if (currentLine.length) lines.push(currentLine);
          currentLine = [it];
          currentY = it.y;
        } else {
          currentLine.push(it);
        }
      }
      if (currentLine.length) lines.push(currentLine);

      const pageLines = lines.map((line) =>
        line
          .sort((a, b) => a.x - b.x)
          .map((it) => it.str)
          .join("")
          .trim()
      );
      pages.push(pageLines.filter((l) => l.length));
    }
    await loadingTask.destroy();
    return pages;
  }

  function buildDocxParagraphs(pages) {
    const parts = [];
    pages.forEach((lines, pageIdx) => {
      if (pageIdx > 0) {
        parts.push('<w:p><w:r><w:br w:type="page"/></w:r></w:p>');
      }
      if (!lines.length) {
        parts.push("<w:p/>");
      }
      lines.forEach((line) => {
        parts.push(
          `<w:p><w:r><w:t xml:space="preserve">${App.escapeXml(line)}</w:t></w:r></w:p>`
        );
      });
    });
    return parts.join("");
  }

  async function buildDocx(pages) {
    const bodyXml = buildDocxParagraphs(pages);
    const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>${bodyXml}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1417" w:right="1417" w:bottom="1417" w:left="1417"/></w:sectPr></w:body>
</w:document>`;

    const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

    const rootRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const zip = new JSZip();
    zip.file("[Content_Types].xml", contentTypesXml);
    zip.folder("_rels").file(".rels", rootRelsXml);
    zip.folder("word").file("document.xml", documentXml);
    return zip.generateAsync({
      type: "uint8array",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
  }

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const bytes = await App.readAsArrayBuffer(file);
      const pages = await extractPageLines(bytes);
      App.setProgress(panel, 70, i18n.t("common.processing"));
      const outBytes = await buildDocx(pages);
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("pdf2word.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () =>
          App.download(
            outBytes,
            file.name.replace(/\.pdf$/i, "") + ".docx",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ),
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
