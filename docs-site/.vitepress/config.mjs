import { defineConfig } from "vitepress";
import sidebar from "./sidebar.generated.mjs";

const site = "https://alpaca4d.github.io";

export default defineConfig({
  title: "Alpaca4d Docs",
  description: "Documentation for Alpaca4d, OpenSees for Grasshopper.",
  lang: "en",
  base: "/docs/",
  srcDir: "src",
  outDir: "dist",
  // The GitBook pages link to a few pages that no longer exist; they are reported by
  // `npm run sync` rather than failing the build.
  ignoreDeadLinks: true,

  head: [
    ["link", { rel: "icon", href: "/docs/favicon.png" }],
    ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    ["link", { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" }],
    ["link", { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;600&family=Overpass:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" }],
    ["meta", { name: "theme-color", content: "#f4f4f4" }],
  ],

  markdown: {
    container: { infoLabel: "Note", tipLabel: "Good to know", warningLabel: "Warning", dangerLabel: "Careful" },
  },

  themeConfig: {
    logo: { src: "/logo.png", alt: "" },
    siteTitle: "Alpaca4d",

    nav: [
      { text: "Docs", link: "/", activeMatch: "^/(?!examples/)" },
      { text: "Examples", link: "/examples/multi-storey-building/multi-storey-building", activeMatch: "^/examples/" },
      { text: "Explorer", link: `${site}/explorer/` },
      { text: "Website", link: `${site}/` },
      { text: "Buy", link: `${site}/buy.html` },
      { text: "Download", link: `${site}/download.html` },
    ],

    sidebar,
    outline: { level: [2, 3], label: "On this page" },
    search: { provider: "local" },
    docFooter: { prev: "Previous", next: "Next" },
    externalLinkIcon: false,

    // The page is made from doc/ in this repository, where README.md is the folder's page.
    editLink: {
      pattern: ({ filePath }) =>
        `https://github.com/Alpaca4d/alpaca4d.github.io/edit/main/doc/${filePath.replace(/(^|\/)index\.md$/, "$1README.md")}`,
      text: "Edit this page on GitHub",
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/Alpaca4d/Alpaca4d" },
      { icon: "linkedin", link: "https://www.linkedin.com/company/alpaca4d/" },
    ],
  },
});
