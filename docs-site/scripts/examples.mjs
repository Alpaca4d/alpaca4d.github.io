// Builds the website's examples from ../examples, one folder per example: the gallery at
// /examples/ and a page per example at /examples/<slug>/, in the website's own look
// (assets/site), each made from the folder's <slug>.md.
//
// The pictures and .gh files are served from ../examples as they are; this writes only the
// pages, a small picture for each card, and, in the docs' dist, a page at each example's old
// address in the docs that sends the reader on. Under the picture, the page draws the definition
// itself (assets/site/gh-canvas.js), from the <slug>-definition.json beside the .gh that
// Alpaca4d's Tools/GhCanvas reads from it, each Alpaca4d component linked to its page in the docs.
//
//   node scripts/examples.mjs        writes dist-examples/, published at /examples/
//
// <slug>.md starts with front matter:
//   order: 3                   place in the gallery
//   summary: "…"               one sentence, on the card and under the title
//   tags: ["Shells", …]        the gallery's filters
//   draft: true                kept out of the gallery and given no page, until it is ready
// then "# Title", the picture and the "[name](name.gh)" link, and the page. An example that
// lives on a component's page in the docs gives title, link, picture and gh instead of a page.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMarkdownRenderer } from "vitepress";
import sharp from "sharp";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REPO = path.resolve(site, "..");
const SRC = path.join(REPO, "examples");
const OUT = path.join(site, "dist-examples");
const DOCS_DIST = path.join(site, "dist");
const SITE_URL = "https://alpaca4d.github.io";
const DOC = path.join(REPO, "doc");

// The filters, in this order, each with its palette colour.
const TAGS = {
  "Beams & frames": "blue",
  "Shells": "purple",
  "Solids": "orange",
  "Dynamics": "navy",
  "Sections": "green",
  "Design checks": "red",
  "Optimisation": "purple",
  "Topology": "green",
  "Scripting": "ink",
};
const tagId = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const kb = (file) => {
  const n = fs.statSync(file).size;
  return n > 1e6 ? `${(n / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1e3))} KB`;
};

function frontMatter(text) {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, text];
  const data = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const v = kv[2].trim();
    data[kv[1]] = /^[\["]/.test(v) ? JSON.parse(v) : /^-?\d+(\.\d+)?$/.test(v) ? Number(v) : v === "true" ? true : v === "false" ? false : v;
  }
  return [data, text.slice(m[0].length)];
}

// A path the front matter gives relative to /examples/, on disk: the docs' own files are in doc/.
const onDisk = (p) => path.join(REPO, p.replace(/^\.\.\/docs\//, "doc/").replace(/^\.\.\//, ""));

async function readExamples(md) {
  const out = [];
  for (const slug of fs.readdirSync(SRC).sort()) {
    const file = path.join(SRC, slug, slug + ".md");
    if (!fs.existsSync(file)) continue;
    const [meta, rest] = frontMatter(fs.readFileSync(file, "utf8"));
    if (meta.draft === true) { console.log(`examples: ${slug}: a draft, left out`); continue; }
    let body = rest;
    const ex = { slug, order: meta.order ?? 999, summary: meta.summary || "", tags: meta.tags || [] };

    if (meta.link) {
      // An example on a component's page in the docs: a card only.
      Object.assign(ex, { title: meta.title, link: meta.link, picture: meta.picture, pictureFile: onDisk(meta.picture), gh: meta.gh, ghFile: onDisk(meta.gh) });
    } else {
      const h1 = body.match(/^#\s+(.+)$/m);
      // The title without its emoji.
      ex.title = meta.title || (h1 ? h1[1].replace(/^[^\p{L}\p{N}]+/u, "").trim() : slug);
      if (h1) body = body.replace(h1[0], "");
      // The first picture and the .gh link alone on its line go to the top of the page.
      const fig = body.match(/^<figure><img src="([^"]+)"(?:[^>]*?alt="([^"]*)")?[^>]*>.*?<\/figure>\s*$/m) || body.match(/^!\[([^\]]*)\]\(([^)\s]+)\)\s*$/m);
      if (fig) {
        const [src, alt] = fig[0].startsWith("<") ? [fig[1], fig[2]] : [fig[2], fig[1]];
        Object.assign(ex, { picture: `${slug}/${src}`, pictureFile: path.join(SRC, slug, src), alt: alt || "" });
        body = body.replace(fig[0], "");
      }
      const gh = body.match(/^\[[^\]]*\]\(([^)\s]+\.gh)\)\s*$/m);
      if (gh) {
        Object.assign(ex, { gh: `${slug}/${gh[1]}`, ghFile: path.join(SRC, slug, gh[1]) });
        body = body.replace(gh[0], "");
      }
      const env = { relativePath: `examples/${slug}/index.md`, cleanUrls: false };
      ex.html = md
        // A folder's page in the docs is its README, built as index.html.
        .render(body.trim().replace(/README\.md(?=[#)])/g, "index.md"), env)
        // Another example: its folder. (The renderer has made ../x/x.md into ./../x/x.html.)
        .replace(/href="(?:\.\/)?\.\.\/([a-z0-9-]+)\/\1\.html(#[^"]*)?"/g, 'href="../$1/$2"');
    }
    if (ex.ghFile && !fs.existsSync(ex.ghFile)) { console.log(`examples: ${slug}: no ${ex.gh}`); ex.gh = null; }
    if (ex.pictureFile && !fs.existsSync(ex.pictureFile)) { console.log(`examples: ${slug}: no ${ex.picture}`); ex.picture = null; }
    out.push(ex);
  }
  return out.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

const canonical = (n) => n.replace(/\(Alpaca4d\)/g, " ").replace(/\s+/g, " ").trim().toLowerCase();

// Each component's page in the docs, by its name: the page whose title line names it. When
// several do - a switcher's types have pages of their own - the one named after it.
function docsPages() {
  const found = {};
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name.startsWith(".")) continue;
      const abs = path.join(dir, e.name);
      if (e.isDirectory()) { walk(abs); continue; }
      if (!e.name.endsWith(".md")) continue;
      const rel = path.relative(DOC, abs).split(path.sep).join("/").replace(/(^|\/)README\.md$/, "$1index.md").replace(/\.md$/, ".html");
      for (const m of fs.readFileSync(abs, "utf8").matchAll(/^`([^`]+)`\s*—\s*\*\*Alpaca4d/gm)) (found[m[1].trim()] ??= []).push(rel);
    }
  };
  walk(DOC);
  const bare = (s) => canonical(s).replace(/[^a-z0-9]/g, "");
  const pages = {};
  for (const [name, rels] of Object.entries(found)) pages[name] = rels.find((r) => bare(path.basename(r, ".html")) === bare(name)) || rels[0];
  return pages;
}

// The definition of an example, to draw: its JSON and the docs pages of what it uses.
function definition(ex, pages) {
  if (!ex.ghFile) return null;
  const json = ex.ghFile.replace(/\.gh$/, "-definition.json");
  if (!fs.existsSync(json)) { console.log(`examples: ${ex.slug}: no ${path.basename(json)}, run Tools/GhCanvas/run.sh in Alpaca4d`); return null; }
  const used = new Set(JSON.parse(fs.readFileSync(json, "utf8")).objects.map((o) => canonical(o.name || "")));
  const docs = {};
  for (const [name, rel] of Object.entries(pages)) if (used.has(canonical(name))) docs[name] = "../../docs/" + rel;
  return { src: path.basename(json), docs };
}

// ---- Pages ----

const head = (root, title, description, image) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:image" content="${esc(image || SITE_URL + "/assets/site/img/og.jpg")}">
  <meta name="theme-color" content="#f4f4f4">
  <link rel="icon" href="${root}assets/site/img/favicon.png">
  <link rel="apple-touch-icon" href="${root}assets/site/img/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Overpass+Mono:wght@400;600&family=Overpass:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap">
  <link rel="stylesheet" href="${root}assets/site/site.css?v=3">
  <script>document.documentElement.classList.add("js");</script>
</head>
`;

const foot = (root, script = "") => `  </main>
  <footer class="site-footer" id="site-footer"></footer>
  <script src="${root}assets/site/site.js?v=3"></script>${script}
</body>
</html>
`;

const tagChips = (tags) => `<div class="ex-tags">${tags.map((t) => `<span class="ex-tag" style="--c: var(--${TAGS[t] || "ink"})">${esc(t)}</span>`).join("")}</div>`;

// The .gh, attached under the picture like a file to an email.
const attachment = (ex, href) =>
  ex.gh ? `<a class="ex-file" href="${href}" download><span class="ex-file-ext">GH</span><span class="ex-file-name"><b>${esc(path.basename(ex.gh))}</b><small>Grasshopper file · ${kb(ex.ghFile)}</small></span><span class="ex-file-go">Download</span></a>` : "";

function card(ex, from) {
  // from: the path from the page the card is on to /examples/.
  const href = ex.link ? from + ex.link : `${from}${ex.slug}/`;
  const pic = ex.picture
    ? `<img src="${from}${ex.slug}/card.jpg" alt="" loading="lazy" width="720" height="450">`
    : `<span class="ex-card-blank">${esc(ex.title)}</span>`;
  return `<article class="ex-card" data-tags="${ex.tags.map(tagId).join(" ")}">
  <a class="ex-card-link" href="${href}">
    <span class="ex-card-pic">${pic}</span>
    <span class="ex-card-body"><h3>${esc(ex.title)}</h3><p>${esc(ex.summary)}</p>${tagChips(ex.tags)}</span>
  </a>
  ${ex.gh ? `<a class="ex-card-gh" href="${from}${ex.gh}" download title="Download ${esc(path.basename(ex.gh))}"><span>GH</span>${kb(ex.ghFile)}</a>` : ""}
</article>`;
}

function galleryPage(examples) {
  const counts = {};
  for (const ex of examples) for (const t of ex.tags) counts[t] = (counts[t] || 0) + 1;
  const filters = [`<button type="button" class="ex-filter" aria-pressed="true" data-tag="">All <small>${examples.length}</small></button>`]
    .concat(Object.keys(TAGS).filter((t) => counts[t]).map((t) => `<button type="button" class="ex-filter" aria-pressed="false" data-tag="${tagId(t)}" style="--c: var(--${TAGS[t]})">${esc(t)} <small>${counts[t]}</small></button>`));
  return head("../", "Examples · Alpaca4d", "Grasshopper definitions that show Alpaca4d at work: open one, run it, take it apart.") + `
<body data-root="../" data-page="examples">
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header" id="site-header"></header>

  <main id="main">
    <section class="page-hero canvas-grid">
      <div class="wrap">
        <span class="eyebrow">Examples</span>
        <h1 class="display">Open it, run it, take it apart<span class="dot">.</span></h1>
        <p class="lead">Grasshopper definitions that show Alpaca4d at work. Each one is a picture of what it does and the .gh that does it; most have a page on how it is put together.</p>
      </div>
    </section>

    <section class="section white tight ex-gallery">
      <div class="wrap">
        <div class="ex-filters" role="group" aria-label="Show examples about">${filters.join("")}</div>
        <div class="ex-grid">
${examples.map((ex) => card(ex, "")).join("\n")}
        </div>
      </div>
    </section>
` + foot("../", `
  <script>
    // The filters: one topic at a time, kept in the address so a filtered gallery can be shared.
    (function () {
      const buttons = [...document.querySelectorAll(".ex-filter")];
      const cards = [...document.querySelectorAll(".ex-card")];
      function show(tag) {
        if (!buttons.some((b) => b.dataset.tag === tag)) tag = "";
        buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.tag === tag)));
        cards.forEach((c) => { c.hidden = !!tag && !c.dataset.tags.split(" ").includes(tag); });
      }
      buttons.forEach((b) => b.addEventListener("click", () => {
        show(b.dataset.tag);
        history.replaceState(null, "", b.dataset.tag ? "#" + b.dataset.tag : location.pathname);
      }));
      show(location.hash.slice(1));
    })();
  </script>`);
}

function examplePage(ex, all, def) {
  const related = all.filter((o) => o !== ex && o.tags.some((t) => ex.tags.includes(t))).slice(0, 3);
  const image = ex.picture ? `${SITE_URL}/examples/${ex.picture}` : null;
  return head("../../", `${ex.title} · Examples · Alpaca4d`, ex.summary, image) + `
<body data-root="../../" data-page="examples">
  <a class="skip" href="#main">Skip to content</a>
  <header class="site-header" id="site-header"></header>

  <main id="main">
    <section class="ex-hero canvas-grid">
      <div class="wrap">
        <a class="ex-back" href="../">All examples</a>
        <h1 class="ex-title">${esc(ex.title)}<span class="dot">.</span></h1>
        <p class="lead">${esc(ex.summary)}</p>
        ${tagChips(ex.tags)}
        <figure class="ex-shot">
          ${ex.picture ? `<img src="${esc(path.basename(ex.picture))}" alt="${esc(ex.alt || "")}">` : ""}
          ${attachment(ex, esc(path.basename(ex.gh || "")))}
        </figure>
      </div>
    </section>

${def ? `
    <section class="section tight ex-definition">
      <div class="wrap">
        <div class="ex-def-head"><h2 class="h3">The definition</h2><p>Drag to move · pinch or Ctrl/⌘ + scroll to zoom · hover a component</p></div>
        <div class="gh-canvas" data-src="${esc(def.src)}" data-docs="${esc(JSON.stringify(def.docs))}"></div>
      </div>
    </section>
` : ""}
    <section class="section white tight">
      <div class="wrap">
        <article class="ex-prose">
${ex.html}
        </article>
      </div>
    </section>
${related.length ? `
    <section class="section tight">
      <div class="wrap">
        <h2 class="h3 ex-more-title">More examples</h2>
        <div class="ex-grid">
${related.map((o) => card(o, "../")).join("\n")}
        </div>
      </div>
    </section>
` : ""}` + foot("../../", def ? `\n  <script src="../../assets/site/gh-canvas.js?v=1" defer></script>` : "");
}

// The docs had the examples at /docs/examples/<slug>/<slug>.html: those addresses now send on.
const redirect = (to) => `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><title>Moved to the examples</title>
<link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}">
<script>location.replace(${JSON.stringify(to)} + location.hash)</script></head>
<body><p>This example is now at <a href="${to}">${to}</a>.</p></body></html>
`;

// ---- Run ----
const md = await createMarkdownRenderer(SRC, { math: true }, "/");
const docPages = docsPages();
const examples = await readExamples(md);
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "index.html"), galleryPage(examples));
let pages = 0;
for (const ex of examples) {
  const dir = path.join(OUT, ex.slug);
  fs.mkdirSync(dir, { recursive: true });
  // The card's picture: 720 x 450, the whole picture on white.
  if (ex.picture) {
    await sharp(ex.pictureFile)
      .resize(720, 450, { fit: "contain", background: "#ffffff" })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(dir, "card.jpg"));
  }
  if (ex.link) continue;
  fs.writeFileSync(path.join(dir, "index.html"), examplePage(ex, examples, definition(ex, docPages)));
  pages++;
  if (fs.existsSync(DOCS_DIST)) {
    const old = path.join(DOCS_DIST, "examples", ex.slug);
    fs.mkdirSync(old, { recursive: true });
    fs.writeFileSync(path.join(old, ex.slug + ".html"), redirect(`/examples/${ex.slug}/`));
  }
}
console.log(`examples: ${examples.length} in the gallery, ${pages} pages, in ${path.relative(process.cwd(), OUT) || OUT}`);
