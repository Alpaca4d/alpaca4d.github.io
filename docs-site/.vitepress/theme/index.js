import DefaultTheme from "vitepress/theme";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === "undefined") return;
    // In a local preview the website is served from this same origin, so its links go there
    // rather than to the live site.
    if (!/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname)) return;
    document.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest('a[href^="https://alpaca4d.github.io/"]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      window.location.href = window.location.origin + new URL(a.href).pathname;
    }, true);
  },
};
