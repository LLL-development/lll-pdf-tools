(function () {
  "use strict";
  const panel = document.getElementById("panel-lock");
  if (!panel) return;

  const dropzone = document.getElementById("lock-dropzone");
  const input = document.getElementById("lock-input");
  const listEl = document.getElementById("lock-file-list");
  const actionBtn = document.getElementById("lock-action");
  const passwordInput = document.getElementById("lock-password");
  const confirmInput = document.getElementById("lock-confirm");

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
    if (e.detail.toolId === "lock") {
      setFile(null);
      passwordInput.value = "";
      confirmInput.value = "";
    }
  });

  function randomOwnerPassword() {
    const bytes = new Uint8Array(24);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  actionBtn.addEventListener("click", async () => {
    App.resetPanelState(panel);
    if (!file) {
      App.showError(panel, i18n.t("common.needFile"));
      return;
    }
    const pw = passwordInput.value;
    const confirm = confirmInput.value;
    if (!pw) {
      App.showError(panel, i18n.t("lock.errorEmpty"));
      return;
    }
    if (pw !== confirm) {
      App.showError(panel, i18n.t("lock.errorMismatch"));
      return;
    }

    actionBtn.disabled = true;
    App.setProgress(panel, 15, i18n.t("common.processing"));
    try {
      const bytes = await App.readAsArrayBuffer(file);
      const doc = await PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true });
      App.setProgress(panel, 50, i18n.t("common.processing"));

      await App.withBufferShim(() =>
        doc.encrypt({
          userPassword: pw,
          ownerPassword: randomOwnerPassword(),
          permissions: {
            printing: document.getElementById("lock-perm-printing").checked ? "highResolution" : false,
            copying: document.getElementById("lock-perm-copying").checked,
            modifying: document.getElementById("lock-perm-modifying").checked,
            annotating: document.getElementById("lock-perm-annotating").checked,
          },
        })
      );

      App.setProgress(panel, 80, i18n.t("common.processing"));
      const outBytes = await doc.save();
      App.setProgress(panel, 100);
      App.hideProgress(panel);
      App.showResult(panel, {
        title: i18n.t("lock.resultTitle"),
        desc: App.formatBytes(outBytes.byteLength),
        onDownload: () => App.download(outBytes, "protected.pdf", "application/pdf"),
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
