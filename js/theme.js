/* Light / dark theme toggle with persistence */
(function () {
  const root = document.documentElement;

  function apply(theme) {
    if (theme === "light" || theme === "dark") {
      root.setAttribute("data-theme", theme);
    } else {
      root.removeAttribute("data-theme");
    }
  }

  const saved = localStorage.getItem("lll-theme");
  apply(saved);

  function currentEffectiveTheme() {
    const attr = root.getAttribute("data-theme");
    if (attr) return attr;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function toggle() {
    const next = currentEffectiveTheme() === "dark" ? "light" : "dark";
    apply(next);
    localStorage.setItem("lll-theme", next);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggle);
  });

  window.lllTheme = { toggle, currentEffectiveTheme };
})();
