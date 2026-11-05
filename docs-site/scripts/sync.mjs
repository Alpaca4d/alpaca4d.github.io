// Turns the GitBook docs in ../doc into the VitePress source folder ./src, and reads nothing
// back: ../doc stays exactly as GitBook syncs it.
//
// - README.md becomes index.md, and links to README.md follow.
// - {% hint style="…" %} becomes a VitePress container, {% file src="…" %} a download card.
// - Every picture and file is copied into src/public and linked by absolute path, so a missing
//   picture shows as a broken image instead of failing the build.
// - A page's front-matter description is shown under its title, as GitBook does.
// - SUMMARY.md becomes the sidebar, in .vitepress/sidebar.generated.mjs.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DOC = path.resolve(site, "../doc");
const OUT = path.join(site, "src");
const PUBLIC = path.join(OUT, "public");
const BASE = "/docs/";

// .gitbook/assets is served as gitbook-assets: a folder starting with a dot is not served.
const publicPath = (rel) => rel.split(path.sep).join("/").replace(/^\.gitbook\/assets\//, "gitbook-assets/");
// Pictures are written without the base: Vite finds them in public/ and adds it. Links to
// files are left alone by Vite, so they carry the base themselves.
const toUrl = (rel, withBase) =>
  (withBase ? BASE : "/") + publicPath(rel).split("/").map((s) => encodeURIComponent(s).replace(/[()]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase())).join("/");

const isRemote = (url) => /^([a-z][a-z0-9+.-]*:|\/\/|#|\/)/i.test(url);
const extOf = (url) => path.posix.extname(url.split(/[?#]/)[0]).toLowerCase();
const isAsset = (url) => !isRemote(url) && extOf(url) !== "" && extOf(url) !== ".md";
const isPage = (url) => !isRemote(url) && extOf(url) === ".md";

const missing = [];
function assetUrl(fromDir, url, withBase) {
  let clean = url.split(/[?#]/)[0];
  try { clean = decodeURIComponent(clean); } catch (e) { /* keep as written */ }
  const rel = path.posix.normalize(path.posix.join(fromDir, clean));
  if (!fs.existsSync(path.join(DOC, rel))) missing.push(`${fromDir}: ${url}`);
  return toUrl(rel, withBase);
}

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function fileCard(href, name) {
  const ext = extOf(name).slice(1).toUpperCase() || "FILE";
  const kind = ext === "GH" ? "Grasshopper file" : `${ext} file`;
  return `\n<a class="file-card" href="${href}" download><span class="file-ext">${ext}</span><span class="file-name"><strong>${escapeHtml(path.posix.basename(name))}</strong><small>${kind} · download</small></span></a>\n`;
}

const hintKind = { info: "info", success: "tip", warning: "warning", danger: "danger" };

function convert(text, rel) {
  const dir = path.posix.dirname(rel.split(path.sep).join("/"));
  let front = "";
  let body = text.replace(/\r\n/g, "\n");
  let description = null;
  const fm = body.match(/^---\n([\s\S]*?)\n---\n?/);
  if (fm) {
    front = fm[0];
    body = body.slice(fm[0].length);
    const d = fm[1].match(/^description:\s*(.+)$/m);
    if (d) description = d[1].trim().replace(/^(['"])(.*)\1$/, "$2");
  }

  body = body
    .replace(/\{%\s*hint\s+style="(\w+)"\s*%\}/g, (_, s) => `\n::: ${hintKind[s] || "info"}\n`)
    .replace(/\{%\s*endhint\s*%\}/g, "\n:::\n")
    .replace(/\{%\s*file\s+src="([^"]+)"\s*%\}(?:[\s\S]*?\{%\s*endfile\s*%\})?/g, (_, src) => fileCard(assetUrl(dir, src, true), src))
    // An example's Grasshopper file, linked alone on its line, gets the same download card.
    .replace(/^\[[^\]]*\]\((https?:\/\/[^)\s]+\.gh)\)\s*$/gm, (_, url) => fileCard(url, decodeURIComponent(url.split("/").pop())))
    .replace(/\b(src|href)="([^"]+)"/g, (all, attr, url) => (isAsset(url) ? `${attr}="${assetUrl(dir, url, attr === "href")}"` : all))
    .replace(/(!?)\[([^\]]*)\]\(([^)\s]+)((?:\s+"[^"]*")?)\)/g, (all, bang, label, url, title) => {
      if (isAsset(url)) {
        return bang
          ? `![${label}](${assetUrl(dir, url, false)}${title})`
          : `<a href="${assetUrl(dir, url, true)}" download>${label}</a>`;
      }
      if (isPage(url)) return `${bang}[${label}](${url.replace(/README\.md(?=$|#)/, "index.md")}${title})`;
      return all;
    });

  if (description) body = body.replace(/^(# .+)$/m, `$1\n\n<p class="page-lead">${escapeHtml(description)}</p>\n`);
  if (rel === "README.md") body = body.replace(/^\*\*Disclaimer\*\*/m, welcomeCards + "\n**Disclaimer**");
  return front + body;
}

// Where to go first, on the welcome page.
const welcomeCards = `
<div class="doc-cards">
  <a class="doc-card" style="--c: var(--green)" href="${BASE}installation.html"><strong>🧠 Install</strong><span>From Rhino's Package Manager, on Rhino 7 and 8.</span></a>
  <a class="doc-card" style="--c: var(--blue)" href="${BASE}setup.html"><strong>⚙️ Set up OpenSees</strong><span>Point Alpaca4d at the solver, once.</span></a>
  <a class="doc-card" style="--c: var(--orange)" href="${BASE}basics/materials/index.html"><strong>💐 Learn the basics</strong><span>Every component, from materials to optimisation.</span></a>
  <a class="doc-card" style="--c: var(--purple)" href="${BASE}examples/multi-storey-building/multi-storey-building.html"><strong>🏢 Open an example</strong><span>Grasshopper files to run and take apart.</span></a>
</div>
`;

// SUMMARY.md: "## Group" starts a sidebar group, "* [Title](page.md)" an item, nested by indent.
function sidebarFrom(summary) {
  const link = (p) => "/" + p.replace(/(^|\/)README\.md$/, "$1").replace(/\.md$/, "");
  const groups = [{ text: "", items: [] }];
  let stack = [{ indent: -1, items: groups[0].items }];
  for (const line of summary.split("\n")) {
    const h = line.match(/^##\s+(.+)/);
    if (h) {
      const t = h[1].trim();
      groups.push({ text: t.charAt(0) + t.slice(1).toLowerCase(), items: [] });
      stack = [{ indent: -1, items: groups.at(-1).items }];
      continue;
    }
    const it = line.match(/^(\s*)\*\s+\[(.+?)\]\((.+?)\)/);
    if (!it) continue;
    const indent = it[1].length;
    while (stack.length > 1 && stack.at(-1).indent >= indent) stack.pop();
    const item = { text: it[2], link: link(it[3]), items: [] };
    stack.at(-1).items.push(item);
    stack.push({ indent, items: item.items });
  }
  const tidy = (items) => items.map((i) => (i.items.length ? { ...i, collapsed: true, items: tidy(i.items) } : { text: i.text, link: i.link }));
  return groups.filter((g) => g.items.length).map((g) => ({ ...(g.text ? { text: g.text } : {}), items: tidy(g.items) }));
}

// ---- Run ----
fs.rmSync(OUT, { recursive: true, force: true });
let pages = 0;
let files = 0;
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".") && e.name !== ".gitbook") continue;
    if (e.name === ".DS_Store") continue;
    const abs = path.join(dir, e.name);
    const rel = path.relative(DOC, abs);
    if (e.isDirectory()) { walk(abs); continue; }
    if (rel === "SUMMARY.md") continue;
    if (e.name.endsWith(".md")) {
      const outRel = rel.replace(/(^|[\\/])README\.md$/, "$1index.md");
      fs.mkdirSync(path.dirname(path.join(OUT, outRel)), { recursive: true });
      fs.writeFileSync(path.join(OUT, outRel), convert(fs.readFileSync(abs, "utf8"), rel));
      pages++;
    } else {
      const dest = path.join(PUBLIC, publicPath(rel));
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(abs, dest);
      files++;
    }
  }
};
walk(DOC);

// The theme's own pictures.
fs.cpSync(path.join(site, "brand"), PUBLIC, { recursive: true });

const sidebar = sidebarFrom(fs.readFileSync(path.join(DOC, "SUMMARY.md"), "utf8"));
fs.writeFileSync(path.join(site, ".vitepress", "sidebar.generated.mjs"), "export default " + JSON.stringify(sidebar, null, 2) + ";\n");

console.log(`sync: ${pages} pages, ${files} files from ${path.relative(process.cwd(), DOC) || DOC}`);
if (missing.length) console.log(`sync: ${missing.length} links to files that do not exist:\n  ` + missing.join("\n  "));
