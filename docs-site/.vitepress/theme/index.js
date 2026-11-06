import DefaultTheme from "vitepress/theme";
import "./style.css";

export default {
  extends: DefaultTheme,
  enhanceApp() {
    if (typeof window === "undefined") return;

    // Component cards: a switcher's tabs, each with its type's picture, and the picture with its
    // menus as placed or all open (a type drawn only one way keeps that one).
    document.addEventListener("click", (e) => {
      const tab = e.target.closest && e.target.closest("[data-gh-tab], [data-gh-pic]");
      if (!tab) return;
      const card = tab.closest(".gh-card");
      const show = (els, key, value) => els.forEach((el) => el.classList.toggle("is-active", el.getAttribute(key) === value));
      const showView = () => {
        const view = card.querySelector("[data-gh-pic].is-active")?.dataset.ghPic || "0";
        card.querySelectorAll(".gh-pic-set").forEach((set) => {
          const imgs = set.querySelectorAll("[data-gh-pic-img]");
          show(imgs, "data-gh-pic-img", imgs.length > +view ? view : "0");
        });
      };
      if (tab.dataset.ghTab != null) {
        const group = tab.closest(".gh-group");
        group.querySelectorAll("[data-gh-tab]").forEach((b) => b.classList.toggle("is-active", b === tab));
        show(group.querySelectorAll(":scope > .gh-panel"), "data-gh-panel", tab.dataset.ghTab);
        if (group.dataset.ghGroup === "inputs") {
          const sets = card.querySelectorAll(".gh-pic-set");
          if (sets.length > 1) show(sets, "data-gh-set", tab.dataset.ghTab);
        }
      } else {
        card.querySelectorAll("[data-gh-pic]").forEach((b) => b.classList.toggle("is-active", b === tab));
      }
      showView();
    });

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
