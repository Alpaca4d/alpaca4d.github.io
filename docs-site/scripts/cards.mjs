// A component page's picture and its Inputs and Outputs tables, folded into one card: the
// picture beside a list of the ports, each with its type, default and the first sentence of
// its description, the rest a click away. A switcher's inputs, one table per type, become tabs,
// and each tab shows that type's picture: <name>--<type>.png beside <name>.png, as the
// component-images tool draws them, or the component as placed when there is none.
// The section "Relation to OpenSees" folds away behind a click too.
//
// ../doc keeps the tables, as GitBook shows them: the card is made here, on the way to src.

import fs from "node:fs";
import path from "node:path";
import { createMarkdownRenderer } from "vitepress";

let md;
let docRoot;
export async function initCards(srcDir, base, doc) {
  md = await createMarkdownRenderer(srcDir, { math: true }, base);
  docRoot = doc;
}

// The width a 2x picture is shown at: half its pixels.
const pngWidth = (file) => fs.readFileSync(file).readUInt32BE(16) / 2;
// A type's name as the component-images tool spells it in a file name: "Compression Only" -> "compression-only".
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ").join("-");

// The pictures of each tab: the type's own, closed and open, when the tool drew them.
function pictureSets(figures, labels, pageDir) {
  if (!figures.length) return [];
  const base = figures[0].src;
  const stem = base.replace(/\.png$/, "");
  // The types drawn, by their names in the file names, without the hyphens.
  const dir = path.join(docRoot, pageDir, path.dirname(decodeURIComponent(base)));
  const name = path.basename(decodeURIComponent(stem));
  const drawn = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.startsWith(name + "--") && f.endsWith(".png") && !f.endsWith("-open.png")).map((f) => f.slice(name.length + 2, -4)) : [];
  const typeOf = (label) => {
    // The tab's type, or one whose name begins the tab's or is begun by it: a drop-down may
    // shorten a name, "CentralDiff" for CentralDifference.
    const want = slug(label).replace(/-/g, "");
    const type = want && (drawn.find((t) => t.replace(/-/g, "") === want) || drawn.find((t) => want.startsWith(t.replace(/-/g, "")) || t.replace(/-/g, "").startsWith(want)));
    if (!type) return null;
    const closed = `${stem}--${type}.png`;
    const file = path.join(docRoot, pageDir, decodeURIComponent(closed));
    const set = [{ src: closed, alt: `${label}`, width: pngWidth(file) }];
    const open = closed.replace(/\.png$/, "-open.png");
    const openFile = path.join(docRoot, pageDir, decodeURIComponent(open));
    if (fs.existsSync(openFile)) set.push({ src: open, alt: `${label}, every menu open`, width: pngWidth(openFile) });
    return set;
  };
  return (labels.length ? labels : [""]).map((l) => typeOf(l) || figures);
}

// "`Support (Alpaca4d)` — **Alpaca4d ▸ 02_Element**"
const TITLE = /^`([^`]+)`\s*—\s*\*\*(Alpaca4d[^*]*)\*\*\s*$/;
// A picture of a component, as the component-images tool writes it.
const FIGURE = /^<figure><img src="([^"]*\/components\/[^"]+)"([^>]*)>.*<\/figure>\s*$/;
const PORTS = /^###\s+(Inputs|Outputs)\b\s*(.*)$/;

const ALPACA = /^(Model|AlpacaModel|Material|Section|FiberSection|Element|Load|LoadPattern|Support|TimeSeries|Release|Constraint|Test|Settings|Integrator|Damping|AnalysisStep|Recorder|PointFiber|Patch|Layer|Mass|DesignGroup)\b/;
const GEOMETRY = /^(Vector|Point|Plane|Mesh|Curve|Line|Geometry|Brep|Surface|Box|Polyline)\b/;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const attr = (tag, name) => (tag.match(new RegExp(`\\b${name}="([^"]*)"`)) || [])[1];

function cells(line) {
  const s = line.trim().replace(/^\|/, "").replace(/\|\s*$/, "");
  const out = [];
  let cur = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "\\" && s[i + 1] === "|") { cur += "|"; i++; continue; }
    if (s[i] === "|") { out.push(cur.trim()); cur = ""; continue; }
    cur += s[i];
  }
  out.push(cur.trim());
  return out;
}

// A table's rows as {name, nick, type, def, desc}, from whichever of the columns it has.
function readTable(lines) {
  const head = cells(lines[0]).map((h) => h.toLowerCase());
  const col = (...names) => head.findIndex((h) => names.includes(h));
  const at = { name: col("name", "input", "output"), nick: col("nick"), type: col("type"), def: col("default"), desc: col("description") };
  return lines.slice(2).map((l) => {
    const c = cells(l);
    const get = (k) => (at[k] >= 0 ? c[at[k]] || "" : "");
    const name = get("name").replace(/^`(.*)`$/, "$1");
    return { name, nick: get("nick").replace(/^`(.*)`$/, "$1") || name, type: get("type"), def: get("def"), desc: get("desc") };
  });
}

// The first sentence: up to a full stop outside code, links and brackets, before a capital.
// A first sentence too short to say much takes the next one with it.
const ABBREV = /\b(e\.g|i\.e|cf|vs|etc|approx|Eq|Fig|No|Ref)$/i;
function splitFirst(text) {
  let code = false, depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === "`") code = !code;
    if (code) continue;
    if (c === "[" || c === "(") depth++;
    else if (c === "]" || c === ")") depth = Math.max(0, depth - 1);
    else if (depth === 0 && ".!?".includes(c) && /^\s+[A-Z*`\[_"(]/.test(text.slice(i + 1)) && !ABBREV.test(text.slice(0, i))) {
      const first = text.slice(0, i + 1);
      const rest = text.slice(i + 1).trim();
      if (first.replace(/[`*_]/g, "").length < 24) {
        const more = splitFirst(rest);
        return [first + " " + more[0], more[1]];
      }
      return [first, rest];
    }
  }
  return [text, ""];
}

function inline(text, env) {
  return md.renderInline(text.replace(/README\.md(?=$|#|\))/g, "index.md"), env);
}

function portRow(p, kind, env) {
  const [first, rest] = splitFirst(p.desc);
  const typeMatch = p.type.match(/^(.*?)\s*\((list|tree)\)\s*$/);
  const type = typeMatch ? typeMatch[1] : p.type;
  const access = typeMatch ? typeMatch[2] : "";
  const family = ALPACA.test(type) ? "alpaca" : GEOMETRY.test(type) ? "geometry" : "value";
  const showName = p.name && p.name.replace(/\s/g, "").toLowerCase() !== p.nick.replace(/\s/g, "").toLowerCase();
  const def = p.def.trim();
  const head =
    `<span class="gh-nick">${esc(p.nick)}</span>` +
    (showName ? `<span class="gh-name">${inline(p.name, env)}</span>` : "") +
    `<span class="gh-meta">` +
    (type ? `<span class="gh-type" data-family="${family}">${inline(type, env)}</span>` : "") +
    (access ? `<span class="gh-access" title="${access === "list" ? "Takes a list" : "Takes a data tree"}">${access}</span>` : "") +
    (kind === "inputs" && def && !/^[—–-]$/.test(def) ? `<span class="gh-def" title="Default">${inline(def, env)}</span>` : "") +
    `</span>`;
  const sum = first ? `<span class="gh-sum">${inline(first, env)}</span>` : "";
  if (!rest) return `<div class="gh-port"><div class="gh-port-line">${head}${sum}</div></div>`;
  return `<details class="gh-port"><summary class="gh-port-line">${head}${sum}</summary><div class="gh-more">${inline(rest, env)}</div></details>`;
}

const tabLabel = (rest) => {
  const t = rest.replace(/^[\s—–:-]+/, "").replace(/^on\s+/i, "").trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : "";
};

function card(title, figures, groups, env, pageDir) {
  const inputTabs = groups.filter((g) => g.kind === "inputs");
  // A page about one type of a switcher names it too, "### Inputs — WithHinges", and shows its picture.
  const sets = pictureSets(figures, inputTabs.map((g) => g.label), pageDir);
  // The picture's column is as wide as the widest picture, up to about half the card.
  const w = Math.max(...sets.flat().map((f) => +f.width || 0), 0);
  const out = [`<div class="gh-card"${w ? ` style="--pic: ${w}px"` : ""}>`];
  if (title) out.push(`<div class="gh-card-head"><span class="gh-card-name">${esc(title.name.replace(/\s*\(Alpaca4d\)\s*$/, ""))}</span><span class="gh-card-tab">${esc(title.where)}</span></div>`);
  out.push(`<div class="gh-card-body">`);
  if (sets.length) {
    out.push(`<div class="gh-card-pic">`);
    if (sets.some((set) => set.length > 1)) {
      out.push(`<div class="gh-switch" role="tablist">` +
        [0, 1].map((i) => `<button type="button" role="tab" class="${i ? "" : "is-active"}" data-gh-pic="${i}">${i ? "Menus open" : "As placed"}</button>`).join("") + `</div>`);
    }
    // One set of pictures per tab of inputs, shown with its tab.
    sets.forEach((set, t) => {
      out.push(`<div class="gh-pic-set${t ? "" : " is-active"}" data-gh-set="${t}">` +
        set.map((f, i) => `<img class="${i ? "" : "is-active"}" data-gh-pic-img="${i}" src="${f.src}" alt="${esc(f.alt || "")}"${f.width ? ` width="${f.width}"` : ""}>`).join("") +
        `</div>`);
    });
    out.push(`</div>`);
  }
  out.push(`<div class="gh-card-ports">`);
  for (const kind of ["inputs", "outputs"]) {
    const gs = groups.filter((g) => g.kind === kind);
    if (!gs.length) continue;
    const tabs = gs.length > 1;
    out.push(`<div class="gh-group" data-gh-group="${kind}">`);
    out.push(`<div class="gh-group-head"><span class="gh-group-title">${kind === "inputs" ? "Inputs" : "Outputs"}</span>` +
      (tabs ? `<div class="gh-tabs" role="tablist">` + gs.map((g, i) => `<button type="button" role="tab" class="${i ? "" : "is-active"}" data-gh-tab="${i}">${esc(g.label || `Type ${i + 1}`)}</button>`).join("") + `</div>` : "") +
      `</div>`);
    gs.forEach((g, i) => {
      out.push(`<div class="gh-panel${i ? "" : " is-active"}" data-gh-panel="${i}">`);
      const text = (ls, cls) => {
        const t = ls.join("\n").trim();
        if (t) out.push("", `<div class="${cls}">`, "", t, "", `</div>`);
      };
      text(g.lead, "gh-lead");
      if (g.rows.length) out.push(`<div class="gh-list">${g.rows.map((p) => portRow(p, kind, env)).join("")}</div>`);
      text(g.notes, "gh-notes");
      out.push(`</div>`);
    });
    out.push(`</div>`);
  }
  out.push(`</div>`, `</div>`, `</div>`);
  return out.join("\n");
}

// One section, from its "## " heading to the next: its card where its first picture was,
// and everything else it had, in order, after the card.
function foldSection(lines, env) {
  if (!lines.some((l) => PORTS.test(l))) return lines;
  let title = null;
  const figures = [];
  const groups = [];
  const kept = [];
  let cardAt = -1;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    const t = !title && l.match(TITLE);
    if (t) { title = { name: t[1], where: t[2].trim() }; if (cardAt < 0) cardAt = kept.length; continue; }
    const f = l.match(FIGURE);
    if (f) { figures.push({ src: f[1], alt: attr(f[2], "alt"), width: attr(f[2], "width") }); if (cardAt < 0) cardAt = kept.length; continue; }
    const p = l.match(PORTS);
    if (p) {
      // The heading's lines, to the next heading: the first table is the ports, the text
      // before it leads into them and the text after it follows them. "None." has no table.
      let j = i + 1;
      const block = [];
      while (j < lines.length && !/^#{2,3}\s/.test(lines[j])) block.push(lines[j++]);
      const start = block.findIndex((b) => b.trim().startsWith("|"));
      let end = start;
      while (end >= 0 && end < block.length && block[end].trim().startsWith("|")) end++;
      const table = start >= 0 ? block.slice(start, end) : [];
      groups.push({
        kind: p[1].toLowerCase(),
        label: tabLabel(p[2]),
        rows: table.length >= 2 ? readTable(table) : [],
        lead: start >= 0 ? block.slice(0, start) : block,
        notes: start >= 0 ? block.slice(end) : [],
      });
      if (cardAt < 0) cardAt = kept.length;
      i = j - 1;
      continue;
    }
    kept.push(l);
  }
  if (!groups.length) return lines;
  kept.splice(cardAt, 0, "", card(title, figures, groups, env, path.dirname(env.docPath)), "");
  return kept;
}

export function componentCards(body, rel) {
  const docPath = rel.split("\\").join("/");
  const env = { relativePath: docPath.replace(/(^|\/)README\.md$/, "$1index.md"), cleanUrls: false, docPath };
  const lines = body.split("\n");
  const sections = [];
  let cur = [];
  let fence = false;
  for (const l of lines) {
    if (/^\s*(```|~~~)/.test(l)) fence = !fence;
    if (!fence && /^##\s/.test(l)) { sections.push(cur); cur = []; }
    cur.push(l);
  }
  sections.push(cur);
  return sections
    .map((s, i) => {
      if (/^##\s+.*Relation to OpenSees/.test(s[0] || "")) {
        const head = s[0].replace(/^##\s+/, "").trim();
        // The anchor the heading had, so that links to it still land here.
        const id = head.normalize("NFKD").toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
        return [`<span id="${id}"></span>`, "", `:::: details ${head}`, ...s.slice(1), "", "::::", ""];
      }
      return foldSection(s, env);
    })
    .flat()
    .join("\n");
}
