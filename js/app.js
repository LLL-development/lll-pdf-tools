/* Shared app shell: navigation, file helpers, dropzones, PDF thumbnails */
(function () {
  "use strict";


  const home = document.getElementById("home-view");
  const workspace = document.getElementById("workspace-view");
  const panels = document.querySelectorAll(".tool-panel");

  // DOM-only view switches (no history changes) — used both for direct navigation
  // and when responding to popstate (browser back/forward, incl. swipe gestures).
  function activateGridDom() {
    workspace.classList.add("hidden");
    home.classList.remove("hidden");
    panels.forEach((p) => p.classList.remove("active"));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function activateToolDom(toolId) {
    const panel = document.getElementById("panel-" + toolId);
    if (!panel) return false;
    home.classList.add("hidden");
    workspace.classList.remove("hidden");
    panels.forEach((p) => p.classList.toggle("active", p === panel));
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    document.dispatchEvent(new CustomEvent("lll:toolopen", { detail: { toolId } }));
    return true;
  }

  // User-facing navigation: pushes real history entries so the browser's back
  // button and edge-swipe-back gesture work like normal in-app navigation.
  function showGrid() {
    if (workspace.classList.contains("hidden")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    history.back();
  }

  function showTool(toolId) {
    if (!document.getElementById("panel-" + toolId)) return;
    history.pushState({ tool: toolId }, "", "#" + toolId);
    activateToolDom(toolId);
  }

  window.addEventListener("popstate", (event) => {
    const toolId = event.state && event.state.tool;
    if (toolId) {
      activateToolDom(toolId);
    } else {
      activateGridDom();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".tool-card").forEach((card) => {
      card.addEventListener("click", () => showTool(card.getAttribute("data-tool")));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showTool(card.getAttribute("data-tool"));
        }
      });
    });
    document.querySelectorAll(".back-btn").forEach((btn) => {
      btn.addEventListener("click", showGrid);
    });

    const initial = window.location.hash.replace("#", "");
    if (initial && document.getElementById("panel-" + initial)) {
      history.replaceState({ tool: initial }, "", "#" + initial);
      activateToolDom(initial);
    } else {
      history.replaceState({ tool: null }, "", window.location.pathname + window.location.search);
    }
  });

  // ---------- Generic helpers ----------

  function formatBytes(bytes) {
    if (!bytes && bytes !== 0) return "";
    if (bytes < 1024) return bytes + " B";
    const units = ["KB", "MB", "GB"];
    let val = bytes / 1024;
    let i = 0;
    while (val >= 1024 && i < units.length - 1) {
      val /= 1024;
      i++;
    }
    return val.toFixed(val >= 10 ? 0 : 1) + " " + units[i];
  }

  function readAsArrayBuffer(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  function download(data, filename, mime) {
    const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  function svgIcon(name) {
    return `<svg viewBox="0 0 24 24"><use href="#icon-${name}"/></svg>`;
  }

  function fileIconFor(name) {
    return svgIcon("file-pdf");
  }

  /**
   * Wires a generic dropzone + hidden file input.
   * opts: { multiple, accept, onFiles(fileList) }
   */
  function setupDropzone(dropzoneEl, inputEl, opts) {
    const { onFiles } = opts;
    dropzoneEl.addEventListener("click", () => inputEl.click());
    dropzoneEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        inputEl.click();
      }
    });
    inputEl.addEventListener("change", () => {
      if (inputEl.files && inputEl.files.length) onFiles(Array.from(inputEl.files));
      inputEl.value = "";
    });
    ["dragenter", "dragover"].forEach((evt) => {
      dropzoneEl.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.add("dragover");
      });
    });
    ["dragleave", "drop"].forEach((evt) => {
      dropzoneEl.addEventListener(evt, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropzoneEl.classList.remove("dragover");
      });
    });
    dropzoneEl.addEventListener("drop", (e) => {
      const files = Array.from(e.dataTransfer.files || []);
      if (files.length) onFiles(files);
    });
  }

  /** Renders a draggable, removable list of files. Calls onChange(newOrderArray) on any mutation. */
  function renderFileList(container, files, onChange) {
    container.innerHTML = "";
    files.forEach((file, idx) => {
      const li = document.createElement("li");
      li.className = "file-row draggable";
      li.draggable = files.length > 1;
      li.dataset.index = String(idx);
      li.innerHTML = `
        <span class="file-icon">${svgIcon("file-pdf")}</span>
        <span class="file-meta">
          <div class="file-name"></div>
          <div class="file-size"></div>
        </span>
        <button type="button" class="file-remove" aria-label="remove">${svgIcon(
          "trash"
        )}</button>
      `;
      li.querySelector(".file-name").textContent = file.name;
      li.querySelector(".file-size").textContent = formatBytes(file.size);
      li.querySelector(".file-remove").addEventListener("click", (e) => {
        e.stopPropagation();
        const next = files.slice();
        next.splice(idx, 1);
        onChange(next);
      });

      li.addEventListener("dragstart", () => {
        li.classList.add("dragging");
        li.dataset.dragIndex = String(idx);
      });
      li.addEventListener("dragend", () => li.classList.remove("dragging"));
      li.addEventListener("dragover", (e) => e.preventDefault());
      li.addEventListener("drop", (e) => {
        e.preventDefault();
        const dragging = container.querySelector(".dragging");
        if (!dragging) return;
        const from = Number(dragging.dataset.dragIndex);
        const to = idx;
        if (from === to) return;
        const next = files.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        onChange(next);
      });

      container.appendChild(li);
    });
  }

  /** Renders PDF page thumbnails into a grid. Returns array of {canvas, wrapEl}. */
  async function renderPdfThumbnails(arrayBuffer, gridEl, options) {
    options = options || {};
    gridEl.innerHTML = "";
    const pdfjsLib = await window.loadPdfJs();
    const loadingTask = pdfjsLib.getDocument({ ...window.pdfjsDocumentOptions, data: arrayBuffer.slice(0), isEvalSupported: false });
    const pdf = await loadingTask.promise;
    const thumbs = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const targetWidth = 220;
      const scale = targetWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.ceil(scaledViewport.width);
      canvas.height = Math.ceil(scaledViewport.height);
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport: scaledViewport }).promise;

      const item = document.createElement("div");
      item.className = "page-thumb";
      item.dataset.pageIndex = String(i - 1);
      item.draggable = !!options.draggable;

      const wrap = document.createElement("div");
      wrap.className = "thumb-canvas-wrap";
      wrap.appendChild(canvas);
      item.appendChild(wrap);

      const label = document.createElement("div");
      label.className = "page-num";
      label.textContent = String(i);
      item.appendChild(label);

      gridEl.appendChild(item);
      thumbs.push({ index: i - 1, canvas, el: item, rotation: 0 });
    }
    await loadingTask.destroy();
    return thumbs;
  }

  function enableThumbDragReorder(gridEl, thumbs, onReorder) {
    let dragIndex = null;
    gridEl.querySelectorAll(".page-thumb").forEach((el) => {
      el.addEventListener("dragstart", () => {
        dragIndex = Array.from(gridEl.children).indexOf(el);
        el.classList.add("dragging");
      });
      el.addEventListener("dragend", () => el.classList.remove("dragging"));
      el.addEventListener("dragover", (e) => e.preventDefault());
      el.addEventListener("drop", (e) => {
        e.preventDefault();
        const dropIndex = Array.from(gridEl.children).indexOf(el);
        if (dragIndex === null || dragIndex === dropIndex) return;
        const children = Array.from(gridEl.children);
        const moved = children[dragIndex];
        if (dragIndex < dropIndex) {
          el.after(moved);
        } else {
          el.before(moved);
        }
        onReorder(Array.from(gridEl.children).map((c) => Number(c.dataset.pageIndex)));
      });
    });
  }

  function setProgress(panelEl, percent, label) {
    const wrap = panelEl.querySelector(".progress-wrap");
    if (!wrap) return;
    wrap.classList.remove("hidden");
    wrap.querySelector(".progress-bar > div").style.width = percent + "%";
    if (label !== undefined) wrap.querySelector(".progress-label").textContent = label;
  }

  function hideProgress(panelEl) {
    const wrap = panelEl.querySelector(".progress-wrap");
    if (wrap) wrap.classList.add("hidden");
  }

  function showError(panelEl, message) {
    const box = panelEl.querySelector(".error-box");
    if (!box) return;
    box.classList.remove("hidden");
    box.querySelector(".error-text").textContent = message;
  }

  function hideError(panelEl) {
    const box = panelEl.querySelector(".error-box");
    if (box) box.classList.add("hidden");
  }

  function showResult(panelEl, { title, desc, onDownload, downloadLabelKey }) {
    const box = panelEl.querySelector(".result-box");
    if (!box) return;
    box.classList.remove("hidden");
    box.querySelector(".result-title").textContent = title;
    box.querySelector(".result-desc").textContent = desc;
    const btn = box.querySelector(".result-download");
    const freshBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(freshBtn, btn);
    if (downloadLabelKey) {
      const label = freshBtn.querySelector(".dl-label");
      if (label) {
        label.setAttribute("data-i18n", downloadLabelKey);
        label.textContent = window.i18n ? window.i18n.t(downloadLabelKey) : downloadLabelKey;
      }
    }
    freshBtn.addEventListener("click", onDownload);
  }

  function resetPanelState(panelEl) {
    hideError(panelEl);
    hideProgress(panelEl);
    const result = panelEl.querySelector(".result-box");
    if (result) result.classList.add("hidden");
  }

  /** Renders an HTML fragment (offscreen) into paginated PDF bytes via jsPDF + html2canvas. */
  function renderHtmlToPdfBytes(innerHtml) {
    return new Promise((resolve, reject) => {
      const sandbox = document.getElementById("render-sandbox");
      const renderRoot = document.createElement("div");
      renderRoot.style.width = "794px";
      renderRoot.innerHTML = window.DOMPurify.sanitize(innerHtml, { USE_PROFILES: { html: true } });
      sandbox.replaceChildren(renderRoot);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      // Clone the content, excluding the sandbox's fixed offscreen positioning.
      pdf.html(renderRoot, {
        x: 0,
        y: 0,
        width: 595,
        windowWidth: 794,
        html2canvas: { backgroundColor: "#ffffff" },
        callback: (doc) => {
          sandbox.innerHTML = "";
          try {
            resolve(doc.output("arraybuffer"));
          } catch (e) {
            reject(e);
          }
        },
      });
    });
  }

  /**
   * @cantoo/pdf-lib's encrypt/decrypt code calls Buffer.alloc() (a Node.js global) without
   * feature-detecting it first. Other vendor libraries (JSZip, mammoth, xlsx) DO
   * feature-detect Buffer and change behavior if it exists, so we can't define it globally
   * at page-load time. Instead we define it only for the duration of the pdf-lib
   * encrypt/decrypt call, then remove it again.
   */
  async function withBufferShim(fn) {
    const had = Object.prototype.hasOwnProperty.call(window, "Buffer");
    const prev = window.Buffer;
    function BufferShim(arg) {
      return new Uint8Array(arg);
    }
    BufferShim.alloc = (n) => new Uint8Array(n);
    BufferShim.isBuffer = () => false;
    window.Buffer = BufferShim;
    try {
      return await fn();
    } finally {
      if (had) window.Buffer = prev;
      else delete window.Buffer;
    }
  }

  function escapeXml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  window.App = {
    showGrid,
    showTool,
    formatBytes,
    readAsArrayBuffer,
    download,
    svgIcon,
    setupDropzone,
    renderFileList,
    renderPdfThumbnails,
    enableThumbDragReorder,
    setProgress,
    hideProgress,
    showError,
    hideError,
    showResult,
    resetPanelState,
    renderHtmlToPdfBytes,
    escapeXml,
    escapeHtml,
    withBufferShim,
  };
})();
