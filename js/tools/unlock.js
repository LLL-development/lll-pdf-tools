(function () {
  "use strict";
  const panel = document.getElementById("panel-unlock");
  if (!panel) return;

  const dropzone = document.getElementById("unlock-dropzone");
  const input = document.getElementById("unlock-input");
  const listEl = document.getElementById("unlock-file-list");
  const actionBtn = document.getElementById("unlock-action");
  const passwordInput = document.getElementById("unlock-password");

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
    if (e.detail.toolId === "unlock") {
      setFile(null);
      passwordInput.value = "";
    }
  });

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    const pw = passwordInput.value;
    actionBtn.disabled = true;
    App.setProgress(panel, 20, i18n.t("common.processing"));
    try {
      const bytes = await App.readAsArrayBuffer(file);

      // Check encryption status first: PDFLib marks a document as no longer
      // "encrypted" once it has been successfully decrypted with a password,
      // so this check must happen before attempting the password-based load.
      const probe = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      if (!probe.isEncrypted) {
        App.hideProgress(panel);
        App.showError(panel, i18n.t("unlock.errorNotEncrypted"));
        return;
      }
      if (!pw) {
        App.hideProgress(panel);
        App.showError(panel, i18n.t("unlock.errorWrongPassword"));
        return;
      }

      const doc = await App.withBufferShim(() => PDFLib.PDFDocument.load(bytes, { password: pw }));

      App.setProgress(panel, 70, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("unlock.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "unlocked.pdf", "application/pdf"),
      });
    } catch (err) {
      console.error(err);
      App.hideProgress(panel);
      if (String(err && err.message).toLowerCase().includes("password")) {
        App.showError(panel, i18n.t("unlock.errorWrongPassword"));
      } else {
        App.showError(panel, i18n.t("common.invalidPdf"));
      }
    } finally {
      actionBtn.disabled = !file;
    }
  });
})();
