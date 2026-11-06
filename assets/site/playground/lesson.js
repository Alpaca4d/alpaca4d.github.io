// What every lesson of the Playground shares: the panel with its rounds, the snippets to pick from,
// the wires drawn by hand, the guess, the end, the player's progress, the labels over the scene and
// the alpaca's moves. A lesson module (river.js, cliff.js...) brings what is its own - its
// definition, its rounds and its scene - and calls runLesson with them.
//
// The definition is real: <lesson>.gh, written by a script in Alpaca4d's Tools/Examples with one
// group per round, named "N - Title", and <lesson>-definition.json, read from it by Tools/GhCanvas.
// A round's snippets are its group, changed a little for each wrong one; whatever comes from an
// earlier round stands in as a dashed parameter.
//
// A round is { name, title, task, tip, options, layout?, guess?, wiring? }:
// - options: { key, says, patch?, title, body?, react? }; the one keyed "right" is right. says is
//   read out for the card; patch(a) changes the round's group for this option (see snippet below);
//   react(s) acts it in the scene, s being what the lesson's scene hands out (its api).
// - layout(a) changes the group for every option, before its patch.
// - guess: { question, unit, step } asks for a number first; the lesson's finish(guess) answers it.
// - wiring: the player draws the wires into one component instead of picking (see wiringBox).
//
// The scene is made by the lesson: scene(kit) returns { api, setScene(r), frame(dt), surface(x, z),
// ghost(has)?, stop()? }, kit being the shared tools below.

import * as THREE from "three";

export const NB = " ";
export const CHAR = 4.8;   // a label's width per character, as gh-canvas.js measures it
export const V = (x, y, z) => new THREE.Vector3(x, y, z);
export const mix = (a, b, t) => a + (b - a) * t;
export const smooth = (t) => t * t * (3 - 2 * t);
export const el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const S = Math.SQRT1_2;
// A name's possessive: Plank's, Bars'.
export const whose = (name) => (/s$/.test(name) ? `${name}'` : `${name}'s`);

export const loadDefinition = (url) => fetch(url).then((r) => r.json());

// ---- The definition, and the snippets made from it ----
export function defTools(DEF) {
  const clone = (o) => JSON.parse(JSON.stringify(o));
  const find = (objs, nick) => objs.find((o) => o.nick === nick && o.kind !== "group");
  const port = (o, nick, side = "inputs") => o[side].find((p) => p.nick === nick);
  const groupOf = (r) => DEF.objects.find((o) => o.kind === "group" && o.nick.startsWith(`${r + 1} - `));
  const membersOf = (r) => groupOf(r).members.map((id) => DEF.objects.find((o) => o.id === id));
  // The id a wire comes from: a parameter's own, or a component's output.
  const source = (objs, nick, out) => { const o = find(objs, nick) || find(DEF.objects, nick); return out ? port(o, out, "outputs").id : o.id; };
  const ownerOfPort = (id) => DEF.objects.find((o) => o.id === id || (o.outputs || []).some((p) => p.id === id));
  // An object's box as drawn: a component's from its ports near it, as gh-canvas.js draws it. A
  // definition written outside Rhino can leave a menu's ports at the origin, which stretches the
  // box in the file thousands of units wide.
  function boxOf(o) {
    if (o.kind !== "component" || !o.pivot) return o.box;
    const near = [...(o.inputs || []), ...(o.outputs || [])].map((p) => p.box)
      .filter((b) => b && Math.abs(b[0] + b[2] / 2 - o.pivot[0]) < 300 && Math.abs(b[1] + b[3] / 2 - o.pivot[1]) < 300);
    if (!near.length) return o.box;
    const x0 = Math.min(...near.map((b) => b[0])), x1 = Math.max(...near.map((b) => b[0] + b[2]));
    const y0 = Math.min(...near.map((b) => b[1])), y1 = Math.max(...near.map((b) => b[1] + b[3]));
    return [x0, y0, x1 - x0, y1 - y0];
  }
  // Moves an object of a snippet, its ports with it.
  function shift(o, dx, dy) {
    const move = (b) => { if (b) { b[0] += dx; b[1] += dy; } };
    move(o.box);
    if (o.pivot) { o.pivot[0] += dx; o.pivot[1] += dy; }
    for (const p of [...(o.inputs || []), ...(o.outputs || [])]) move(p.box);
  }
  // A component made here, like one of the definition's, for an option that needs one it has not.
  function component(id, like, nick, x, y, inputs = {}) {
    const o = clone(find(DEF.objects, like));
    shift(o, x - o.box[0], y - o.box[1]);
    Object.assign(o, { id, nick });
    o.inputs.forEach((p, i) => { p.id = `${id}.in${i}`; p.src = inputs[p.nick] || []; });
    o.outputs.forEach((p, i) => { p.id = `${id}.out${i}`; });
    return o;
  }
  function slider(id, nick, value, min, max, digits, x, y) {
    return { kind: "slider", id, type: "57da07bd-ecab-415d-9d86-af36d7073abc", name: "Number Slider", nick, desc: "Numeric slider for single values", box: [x, y, 150, 20], src: [], min, max, value, digits };
  }
  // A round's snippet: its group, changed by the option's patch, with a dashed stand-in for each
  // wire that comes from an earlier round.
  function snippet(r, patch, layout) {
    const objs = membersOf(r).map(clone);
    const api = {
      get: (nick) => find(objs, nick),
      src: (nick, out) => source(objs, nick, out),
      wire(nick, input, ...sources) { port(find(objs, nick), input).src = sources; },
      slider(nick, value, range) { Object.assign(find(objs, nick), { value }, range || {}); },
      add(...os) { objs.push(...os); },
      remove(nick) { const o = find(objs, nick); if (o) objs.splice(objs.indexOf(o), 1); },
      move(nick, dx, dy) { shift(find(objs, nick), dx, dy); },
      newSlider: slider,
      newComponent: component,
    };
    if (layout) layout(api);
    if (patch) patch(api);
    const own = new Set();
    for (const o of objs) { own.add(o.id); for (const p of o.outputs || []) own.add(p.id); }
    const left = Math.min(...objs.map((o) => boxOf(o)[0]));
    const stubs = new Map();
    for (const o of objs) {
      const ins = o.inputs || (o.src ? [{ src: o.src, box: null }] : []);
      ins.forEach((p, i) => {
        for (const s of p.src) {
          if (own.has(s) || stubs.has(s)) continue;
          const from = ownerOfPort(s);
          if (!from) continue;
          const w = Math.min(from.nick.length * CHAR + 12, 120);
          const y = p.box && Math.abs(p.box[1] - o.box[1]) < 400 ? p.box[1] + p.box[3] / 2 : o.box[1] + 12 + 20 * i;
          stubs.set(s, { kind: "param", id: s, type: "stub", name: from.name, nick: from.nick, desc: `From an earlier round: ${from.nick}.`, box: [left - 40 - w, y - 11, w, 22], src: [], mark: "before" });
        }
      });
    }
    // Stand-ins that would overlap go one under the other.
    const stand = [...stubs.values()].sort((a, b) => a.box[1] - b.box[1]);
    for (let i = 1; i < stand.length; i++) if (stand[i].box[1] < stand[i - 1].box[1] + 32) stand[i].box[1] = stand[i - 1].box[1] + 32;
    return { icons: DEF.icons, objects: [...stand, ...objs] };
  }
  // How big a snippet is, for its card: a menu can make a component's box taller than it is drawn.
  function extent(def) {
    const boxes = def.objects.map(boxOf);
    const x0 = Math.min(...boxes.map((b) => b[0])), x1 = Math.max(...boxes.map((b) => b[0] + Math.max(b[2], 60)));
    const y0 = Math.min(...boxes.map((b) => b[1])), y1 = Math.max(...boxes.map((b) => b[1] + Math.min(b[3], 150)));
    return { w: x1 - x0 + 20, h: y1 - y0 + 20 };
  }
  // Everything built in the rounds before r, groups and all; the pieces of round `fresh` marked.
  function built(r, fresh = -1) {
    const objs = [];
    for (let i = 0; i < r; i++) {
      const grp = groupOf(i);
      if (!grp) continue;
      objs.push(clone(grp));
      for (const o of membersOf(i)) objs.push({ ...clone(o), ...(i === fresh ? { mark: "fresh" } : {}) });
    }
    return { icons: DEF.icons, objects: objs };
  }
  return { clone, find, port, groupOf, membersOf, source, ownerOfPort, boxOf, shift, component, slider, snippet, extent, built };
}

// ---- A lesson ----
// spec: { id, chip, def, gh: { url, name }, rounds, scene(kit), finish(guess), done: { title, body } }
export async function runLesson(world, host, onExit, spec) {
  const { camera, stage, alpaca, area, root, reduceMotion } = world;
  const ROUNDS = spec.rounds;
  const D = defTools(spec.def);
  const { find, ownerOfPort, boxOf, snippet, extent, built, clone } = D;
  const STORE = `alpaca4d.playground.${spec.id}`;
  const recall = () => { try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch (e) { return {}; } };
  const remember = (v) => { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch (e) { /* kept for this visit only */ } };

  const g = new THREE.Group();
  area.group.add(g);
  const water = -area.h;
  const tags = el("div", "pg-tags");
  root.insertBefore(tags, host);
  const solid = (hex, opts = {}) => new THREE.MeshStandardMaterial({ color: hex, flatShading: true, roughness: 0.7, ...opts });
  const add = (parent, mesh) => { mesh.castShadow = true; parent.add(mesh); return mesh; };
  const clear = (grp) => { while (grp.children.length) grp.remove(grp.children[0]); };
  // A rod between two points of the area's frame, and an arrow.
  function rod(parent, a, b, r, mat, sides = 8) {
    const d = b.clone().sub(a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d.length(), sides), mat);
    m.position.copy(a).addScaledVector(d, 0.5);
    m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    return add(parent, m);
  }
  function arrow(parent, from, to, r, mat) {
    const d = to.clone().sub(from), len = d.length(), head = Math.min(len * 0.35, r * 6);
    rod(parent, from, from.clone().addScaledVector(d, (len - head) / len), r, mat);
    const cone = new THREE.Mesh(new THREE.ConeGeometry(r * 2.6, head, 10), mat);
    cone.position.copy(to).addScaledVector(d, -head / (2 * len));
    cone.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
    return add(parent, cone);
  }
  // The ground at (x, z) of the area's frame, never below the water.
  const groundAt = (x, z = 0) => {
    const p = g.localToWorld(V(x, 0, z));
    return Math.max(world.height((p.x - p.z) * S, (-p.x - p.z) * S) - area.h, water);
  };
  // The island's own structure in this area, hidden while the lesson builds its own.
  const hidden = [];
  function hideStructure() {
    area.group.traverse((o) => { if (o.userData.structure && o.visible) { o.visible = false; hidden.push(o); } });
  }

  // ---- Labels over the scene: a reaction's, or the scene's own (axes, names) ----
  const tagList = [];
  function tag(text, at, cls = "", big = false, kind = "reaction") {
    const t = el("div", `pg-tag ${cls}${big ? " big" : ""}`, text);
    tags.appendChild(t);
    tagList.push({ el: t, at, kind });
    return t;
  }
  const clearTags = () => { tagList.forEach((t) => t.el.remove()); tagList.length = 0; };

  // ---- The alpaca, acted step by step: x along the area's frame, z across it ----
  const al = {};
  let home = 0;
  const resetAlpaca = () => Object.assign(al, { x: home, z: 0, y: null, roll: 0, pitch: 0, lift: 0, look: 0, turn: 0 });
  let steps = [], stepAt = 0, stepT = 0, time = 0;
  function play(...list) {
    steps = list; stepAt = 0; stepT = 0;
    if (reduceMotion) { for (const s of list) { if (s.start) s.start(); s.run(1); } steps = []; }
    else if (list[0] && list[0].start) list[0].start();
  }
  const step = (dur, run, start) => ({ dur, run, start });
  const wait = (dur) => ({ dur, run() {} });
  const walkTo = (to, speed = 4.2) => {
    let from;
    return { dur: 1, start() { from = al.x; this.dur = Math.max(0.3, Math.abs(to - from) / speed); al.turn = to < from ? Math.PI : 0; }, run(t) {
      al.x = mix(from, to, t);
      al.lift = t < 1 ? Math.abs(Math.sin(t * this.dur * 9)) * 0.3 : 0;
      if (t === 1) al.turn = 0;
    } };
  };
  const hop = () => ({ dur: 0.6, run(t) { al.lift = Math.sin(Math.PI * t) * 1.2; } });
  const wobble = (dur) => ({ dur, run(t) { al.roll = Math.sin(t * dur * 10) * 0.12 * (1 + 2.5 * t); } });
  // Off the side, down to the ground or into the water: a splash where it lands in water.
  const fall = (side = 2.6) => {
    let y0, r0, x0, to;
    return { dur: 0.7, start() { x0 = al.x; y0 = al.y ?? sc.surface(al.x, al.z); r0 = al.roll; to = groundAt(x0, side) - (groundAt(x0, side) <= water + 0.01 ? 1.2 : 0); }, run(t) {
      al.roll = mix(r0, 1.7 * Math.sign(side), smooth(t));
      al.z = mix(0, side, t);
      al.y = mix(y0, to, t * t) + Math.sin(Math.PI * t) * 0.6;
      if (t === 1 && to < water) makeSplash(al.x, al.z);
    } };
  };
  const climbBack = () => {
    let x0, y0, z0, r0;
    return { dur: 1.1, start() { x0 = al.x; y0 = al.y ?? sc.surface(al.x, al.z); z0 = al.z; r0 = al.roll; }, run(t) {
      al.x = mix(x0, home, t);
      al.z = mix(z0, 0, t);
      al.roll = mix(r0, 0, smooth(Math.min(1, t * 1.6)));
      al.y = mix(y0, sc.surface(home, 0), t) + Math.sin(Math.PI * t) * 4;
      if (t === 1) al.y = null;
    } };
  };
  const lookUp = () => ({ dur: 0.8, run(t) { al.pitch = smooth(t) * 0.32; } });
  let splash = null;
  function makeSplash(x, z) {
    if (splash) g.remove(splash.mesh);
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.1, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.9 }));
    mesh.position.set(x, Math.max(groundAt(x, z), water) + 0.25, z);
    g.add(mesh);
    splash = { mesh, t: 0 };
  }

  // ---- The camera: the scene in the part of the screen the panel leaves free ----
  // kit.view: the point to look at in the area's frame, and how wide and tall a stretch to show.
  let zoomScale = 1;
  function frameScene() {
    const s = stage.getBoundingClientRect(), p = host.getBoundingClientRect();
    let dx = 0, dy = 0, fw = s.width, fh = s.height;
    if (p.left > s.left + s.width * 0.25) { fw = p.left - s.left; dx = (s.left + p.left) / 2 - (s.left + s.width / 2); }
    else { fh = p.top - s.top; dy = (s.top + p.top) / 2 - (s.top + s.height / 2); }
    const v = kit.view;
    const zoom = Math.max(0.3, Math.min(6, Math.min((world.viewHeight * fw) / (v.w * s.height), (world.viewHeight * fh) / (v.h * s.height))));
    world.focus(g.localToWorld(v.at.clone()), zoom * zoomScale, dx, dy);
  }

  const kit = {
    THREE, world, area, g, water, reduceMotion,
    view: { at: V(0, 1, 0), w: 25, h: 13 },
    solid, add, clear, rod, arrow, groundAt, hideStructure,
    tag, clearTags,
    al, play, step, wait, walkTo, hop, wobble, fall, climbBack, lookUp, makeSplash,
    get home() { return home; }, set home(x) { home = x; },
    frameScene, zoom: (f) => { zoomScale = f; frameScene(); },
    time: () => time,
  };
  const sc = spec.scene(kit);
  resetAlpaca();
  // The scene as the rounds before r left it, with the alpaca back where it waits.
  function setScene(r) {
    clearTags();
    steps = [];
    if (splash) { g.remove(splash.mesh); splash = null; }
    resetAlpaca();
    sc.setScene(r);
    if (sc.ghost) sc.ghost(ROUNDS[r].wiring ? has : null);
    if (zoomScale !== 1) { zoomScale = 1; frameScene(); }
  }

  // ---- The panel ----
  const progress = recall();
  let reached = Math.min(progress.reached || 0, ROUNDS.length - 1);
  const asked = new RegExp(`^#${spec.id}-(\\d+)$`).exec(location.hash);
  let round = asked ? Math.max(0, Math.min(+asked[1] - 1, ROUNDS.length - 1)) : reached;
  reached = Math.max(reached, round);
  let solved = false, guess = null;

  host.textContent = "";
  host.hidden = false;
  const head = el("div", "pg-lesson-head");
  head.appendChild(el("span", "pg-chip current", spec.chip));
  const close = el("button", "pg-close", "×");
  Object.assign(close, { type: "button", title: "Back to the island" });
  close.setAttribute("aria-label", "Back to the island");
  close.addEventListener("click", () => onExit());
  head.appendChild(close);
  const rail = el("ol", "pg-rail");
  rail.setAttribute("aria-label", "The rounds of this lesson");
  const body = el("div", "pg-round");
  host.append(head, rail, body);

  function drawRail() {
    rail.textContent = "";
    ROUNDS.forEach((r, i) => {
      const done = i < reached || (i === reached && progress.done);
      const li = el("li", (done ? "done" : "") + (i === round ? " current" : ""));
      const b = el("button");
      b.type = "button";
      b.append(el("span", "", done && i !== round ? "✓" : String(i + 1)), document.createTextNode(r.name));
      b.disabled = i > reached;
      if (i === round) b.setAttribute("aria-current", "step");
      b.addEventListener("click", () => goTo(i));
      li.appendChild(b);
      rail.appendChild(li);
    });
  }

  function goTo(r) {
    round = r;
    solved = false;
    history.replaceState(null, "", `#${spec.id}-${r + 1}`);
    if (ROUNDS[r].wiring) resetWires();
    setScene(r);
    drawRail();
    drawRound();
    host.scrollTop = 0;
  }

  let feedback, cards = [], yoursCanvas;
  function drawRound() {
    const R = ROUNDS[round];
    body.textContent = "";
    body.append(el("h2", "", R.title), el("p", "pg-task", R.task), el("p", "pg-tip", R.tip));
    if (R.guess) body.appendChild(guessBox(R.guess));
    feedback = el("div", "pg-feedback");
    feedback.setAttribute("aria-live", "polite");
    feedback.hidden = true;
    const yours = el("section", "pg-yours");
    const yoursHead = el("div", "pg-yours-head");
    yoursHead.append(el("h3", "", "Your definition"), el("p", "", R.wiring ? "All of it, with your wires" : "What you have built so far"));
    yoursCanvas = el("div", "gh-canvas");
    yours.append(yoursHead, yoursCanvas);
    if (R.wiring) { body.append(wiringBox(R.wiring), feedback, yours); return; }
    const grid = el("div", "pg-options");
    grid.setAttribute("role", "group");
    grid.setAttribute("aria-label", `${R.options.length} definitions to choose from`);
    body.append(grid, feedback, yours);
    deal(grid);
  }

  function deal(grid) {
    const R = ROUNDS[round];
    grid.textContent = "";
    grid.classList.remove("solved");
    const defs = R.options.map((opt) => snippet(round, opt.patch, R.layout));
    // Two cards a row when they stay readable there, one otherwise.
    const size = extent(defs[0]);
    const width = grid.getBoundingClientRect().width || host.clientWidth - 40;
    const two = (width - 16) / 2 / size.w >= 0.88;
    grid.classList.toggle("one", !two);
    // A card one to a row is kept from drawing its snippet more than a quarter bigger than life.
    const across = two ? (width - 16) / 2 : width;
    const aspect = Math.max(1.5, Math.min(two ? 2.6 : 4.6, Math.max(size.w / size.h, across / (size.h * 1.25))));
    cards = shuffle(R.options.map((opt, i) => ({ opt, def: defs[i] }))).map(({ opt, def }, i) => {
      const letter = "ABCDEF"[i];
      const card = el("div", "pg-option");
      card.tabIndex = 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Definition ${letter}: ${opt.says}`);
      card.appendChild(el("span", "pg-option-tag", letter));
      const choose = () => { if (!grid.classList.contains("solved")) pick(opt, card, grid); };
      const zoomer = el("button", "pg-option-zoom", "⤢");
      Object.assign(zoomer, { type: "button", title: "Look closer" });
      zoomer.setAttribute("aria-label", `Look closer at definition ${letter}`);
      zoomer.addEventListener("click", (e) => { e.stopPropagation(); closer(def, letter, choose); });
      card.appendChild(zoomer);
      const snip = el("span", "pg-snippet");
      snip.style.aspectRatio = String(aspect);
      card.appendChild(snip);
      grid.appendChild(card);
      window.GhCanvas.render(snip, def, { still: true });
      card.addEventListener("click", choose);
      card.addEventListener("keydown", (e) => { if (e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); choose(); } });
      return { opt, card };
    });
    feedback.hidden = true;
    if (round) window.GhCanvas.render(yoursCanvas, built(round));
    else yoursCanvas.replaceChildren(el("p", "pg-empty", "Nothing yet: the first piece you pick lands here."));
  }

  // A snippet drawn large, to read it closely; it can be picked from there too.
  function closer(def, letter, choose) {
    const box = el("div", "pg-closer");
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", `Definition ${letter}, close up`);
    const bar = el("div", "pg-closer-bar");
    bar.append(el("b", "", `Definition ${letter}`));
    const pickIt = el("button", "btn btn-small btn-primary", `Pick ${letter}`);
    const shut = el("button", "btn btn-small", "Close");
    pickIt.type = shut.type = "button";
    const esc = (e) => { if (e.key === "Escape") { e.stopPropagation(); done(); } };
    const done = () => { box.remove(); document.removeEventListener("keydown", esc, true); };
    pickIt.addEventListener("click", () => { done(); choose(); });
    shut.addEventListener("click", done);
    bar.append(pickIt, shut);
    const canvas = el("div", "gh-canvas");
    box.append(bar, canvas);
    host.appendChild(box);
    document.addEventListener("keydown", esc, true);
    window.GhCanvas.render(canvas, def);
    shut.focus();
  }

  function guessBox(q) {
    const box = el("label", "pg-guess");
    box.append(el("span", "", q.question));
    const input = el("input");
    Object.assign(input, { type: "number", step: q.step || "0.1", inputMode: "decimal", placeholder: "your guess" });
    if (q.min != null) input.min = String(q.min);
    if (guess != null) input.value = guess;
    input.addEventListener("input", () => { guess = input.value === "" ? null : +input.value; });
    box.append(input, el("span", "", q.unit));
    return box;
  }

  function buttons(list) {
    const actions = el("div", "pg-feedback-actions");
    for (const [label, cls, fn, href] of list) {
      const b = el(href ? "a" : "button", `btn btn-small ${cls}`, label);
      if (href) { b.href = href; b.download = spec.gh.name; }
      else { b.type = "button"; if (fn) b.addEventListener("click", fn); else b.disabled = true; }
      actions.appendChild(b);
    }
    return actions;
  }

  const showFeedback = () => {
    feedback.hidden = false;
    requestAnimationFrame(() => feedback.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" }));
  };
  // A round passed: on to the next, or the end of the lesson.
  function passed(nextLabel) {
    solved = true;
    if (round === ROUNDS.length - 1) return finish();
    reached = Math.max(reached, round + 1);
    remember({ ...recall(), reached });
    drawRail();
    feedback.append(buttons([[nextLabel || `Next: ${ROUNDS[round + 1].title.toLowerCase()}`, "btn-primary", () => goTo(round + 1)], ["Play this round again", "", () => goTo(round)]]));
  }

  function pick(opt, card, grid) {
    cards.forEach((c) => c.card.classList.remove("picked"));
    card.classList.add("picked");
    const right = opt.key === "right";
    card.classList.add(right ? "right" : "tried");
    setScene(round);
    if (opt.react) opt.react(sc.api);
    feedback.className = `pg-feedback ${right ? "right" : "wrong"}`;
    feedback.textContent = "";
    feedback.append(el("b", "", opt.title));
    if (opt.body) feedback.append(el("p", "", opt.body));
    if (right) {
      grid.classList.add("solved");
      window.GhCanvas.render(yoursCanvas, built(round + 1, round));
      passed();
    } else {
      feedback.append(buttons([["Try again", "btn-primary", () => { setScene(round); card.classList.remove("picked"); feedback.hidden = true; card.focus(); }]]));
    }
    showFeedback();
  }

  // The last round's answer, the hand check, and the end of the lesson.
  function finish() {
    feedback.append(...spec.finish(guess));
    const done = el("div", "pg-done");
    done.append(
      el("b", "", spec.done.title),
      el("p", "", spec.done.body),
      buttons([[`Download ${spec.gh.name}`, "btn-primary", null, spec.gh.url], ["Play the lesson again", "", () => { remember({ reached: 0 }); reached = 0; progress.done = false; goTo(0); }], ["Back to the island", "", () => onExit()]]),
    );
    feedback.appendChild(done);
    progress.done = true;
    remember({ reached: ROUNDS.length - 1, done: true });
    drawRail();
  }

  // ---- A wiring round: the wires into one component, drawn by the player ----
  // wiring: { target, offered, wants, takes, is, checks, first, done: { title, body } }
  // - target: the component wired into, by nick; its inputs take the wires.
  // - offered: the nicks of the components whose outputs are on offer, one under the other on its
  //   left; put a wrong one or two among them.
  // - wants: { input: [nicks it wants] }; takes: { input: what it takes, in words };
  //   is: { nick: what its output is, in words }.
  // - checks: [[(has) => bool, text]], the checklist; has(input, nick) says whether that wire is in.
  //   Done when every check holds and no wire is where it is not wanted.
  let wires = {}, armed = null, drawn = null, whole = null, wiringCanvas, checklist, shiftBox, said, W = null;
  const nickOf = (id) => ownerOfPort(id).nick;
  const has = (input, nick) => (wires[input] || []).some((s) => nickOf(s) === nick);
  function resetWires() {
    const R = ROUNDS[round];
    W = R.wiring || null;
    wires = {};
    if (W) for (const p of find(spec.def.objects, W.target).inputs) wires[p.nick] = [];
    armed = null;
  }
  function wiringBox(w) {
    W = w;
    const box = el("div", "pg-wiring");
    wiringCanvas = el("div", "gh-canvas");
    const controls = el("div", "pg-wiring-controls");
    const shiftLabel = el("label", "pg-shift");
    shiftBox = el("input");
    shiftBox.type = "checkbox";
    shiftLabel.append(shiftBox, el("span", "", "Shift: add a wire, don't replace"));
    const reset = el("button", "btn btn-small", "Clear the wires");
    reset.type = "button";
    reset.addEventListener("click", () => { for (const n in wires) wires[n] = []; armed = null; say(`The wires into ${W.target} are gone. Start again from an output.`); redraw(); });
    controls.append(shiftLabel, reset);
    checklist = el("ul", "pg-checklist");
    said = el("p", "pg-said");
    said.setAttribute("aria-live", "polite");
    box.append(wiringCanvas, controls, said, checklist);
    resetWires();
    drawn = whole = null;
    say(w.first || `Drag a wire from an output, the circle on the right, to the input of ${w.target} it goes into.`);
    requestAnimationFrame(redraw);
    return box;
  }
  function say(text, cls = "") { said.className = `pg-said ${cls}`; said.textContent = text; }
  // The target with the wires so far, and the outputs on offer spread out on its left.
  function wiringDef() {
    const target = clone(find(spec.def.objects, W.target));
    for (const p of target.inputs) p.src = (wires[p.nick] || []).slice();
    const tb = boxOf(target);
    const right = tb[0] - 170, mid = tb[1] + tb[3] / 2, gap = 46;
    const offered = W.offered.map((nick, i) => {
      const from = find(spec.def.objects, nick);
      const w = Math.min(nick.length * CHAR + 12, 120), y = mid + (i - (W.offered.length - 1) / 2) * gap;
      return { kind: "param", id: from.outputs ? from.outputs[0].id : from.id, type: "stub", name: from.name, nick, desc: `From an earlier round: ${nick}.`, box: [right - w, y - 11, w, 22], src: [], mark: "before" };
    });
    return { icons: spec.def.icons, objects: [...offered, target] };
  }
  // Draws both again with the wires so far, keeping where the player has moved and zoomed to.
  function redraw() {
    const def = wiringDef(), target = find(def.objects, W.target);
    const ins = new Set(target.inputs.map((p) => p.id)), outs = new Set(def.objects.filter((o) => o !== target).map((o) => o.id));
    const wirable = (id, side) => (side === "in" ? ins : outs).has(id);
    drawn = window.GhCanvas.render(wiringCanvas, def, { onWire, onGrip, armed, wirable, view: drawn ? drawn.view() : undefined });
    const all = built(round + 1);
    for (const p of find(all.objects, W.target).inputs) p.src = (wires[p.nick] || []).slice();
    whole = window.GhCanvas.render(yoursCanvas, all, { view: whole ? whole.view() : undefined });
    checklist.textContent = "";
    for (const [test, text] of W.checks) {
      const ok = test(has);
      checklist.appendChild(el("li", ok ? "ok" : "", `${ok ? "✓" : "○"} ${text}`));
    }
    if (sc.ghost) sc.ghost(has);
  }
  // A wire dragged from one grip to another, as in Grasshopper.
  function onWire({ from, to, shift, ctrl }) {
    if (solved) return;
    armed = null;
    if (!from || !to) { say(`Let go on one of ${whose(W.target)} inputs, the circles on its left: a wire only lands on a grip.`, "warn"); redraw(); return; }
    connect(from, to, ctrl ? "remove" : shift || shiftBox.checked ? "add" : "replace");
  }
  // A grip tapped: an output picks its wire up, an input then takes it.
  function onGrip(grip) {
    if (solved) return;
    if (!grip || grip.side === "out") {
      armed = grip && armed !== grip.id ? grip.id : null;
      say(armed ? `Picked ${whose(grip.nick)} wire. Now tap the input of ${W.target} it goes into.` : "Dropped it. Drag a wire from an output, or tap one.");
      redraw();
      return;
    }
    if (!armed) { say("Drag a wire from an output, the circle on the right of each piece, to this input.", "warn"); return; }
    connect(armed, grip.id, grip.shift || shiftBox.checked ? "add" : "replace");
  }
  function connect(from, to, how) {
    const input = find(spec.def.objects, W.target).inputs.find((p) => p.id === to).nick;
    const nick = nickOf(from), before = (wires[input] || []).slice();
    const wants = W.wants[input] || [];
    armed = null;
    if (how === "remove") {
      wires[input] = before.filter((s) => s !== from);
      if (before.includes(from)) say(`${whose(nick)} wire is out of ${input}.`, "ok");
      else say(`There is no wire from ${nick} into ${input} to take away.`, "warn");
    } else {
      wires[input] = how === "add" ? [...new Set([...before, from])] : [from];
      const replaced = how === "replace" && before.length && !before.includes(from) ? nickOf(before[0]) : null;
      const lost = replaced && wants.includes(replaced);
      if (!wants.includes(nick)) say(`${input} takes ${W.takes[input] || "something else"}, and that is ${W.is[nick] || `${whose(nick)} output`}. Drag it again with Ctrl held to take it away, or drag the right one in.`, "warn");
      else if (lost) say(`${whose(nick)} wire took the place of ${whose(replaced)}: a new wire into an input replaces the one there. Hold Shift as you let go, or tick Shift, to add a second.`, "warn");
      else if (replaced) say(`${nick} into ${input}, in place of the wrong wire.`, "ok");
      else say(`${nick} into ${input}.`, "ok");
    }
    redraw();
    const stray = Object.keys(wires).some((n) => wires[n].some((s) => !(W.wants[n] || []).includes(nickOf(s))));
    if (W.checks.every(([test]) => test(has)) && !stray) wiredUp();
  }
  function wiredUp() {
    feedback.className = "pg-feedback right";
    feedback.textContent = "";
    feedback.append(el("b", "", W.done.title), el("p", "", W.done.body));
    if (W.done.react) W.done.react(sc.api);
    else play(wait(0.3), hop());
    passed();
    showFeedback();
  }

  goTo(round);
  frameScene();
  const ro = new ResizeObserver(() => frameScene());
  ro.observe(stage);
  ro.observe(host);

  // ---- Each frame ----
  const tmp = V(0, 0, 0);
  function frame(dt) {
    time += dt;
    if (stepAt < steps.length) {
      const s = steps[stepAt];
      stepT += dt;
      s.run(Math.min(1, stepT / s.dur));
      if (stepT >= s.dur) { stepAt++; stepT = 0; if (steps[stepAt] && steps[stepAt].start) steps[stepAt].start(); }
    } else if (!reduceMotion) al.look = 0.3 * Math.sin(time * 0.8);
    sc.frame(dt);
    if (splash) {
      splash.t += dt;
      splash.mesh.scale.setScalar(1 + splash.t * 3);
      splash.mesh.material.opacity = Math.max(0, 0.9 - splash.t * 1.1);
      if (splash.t > 0.9) { g.remove(splash.mesh); splash = null; }
    }
    const y = al.y ?? sc.surface(al.x, al.z);
    alpaca.position.copy(g.localToWorld(V(al.x, y + al.lift, al.z)));
    alpaca.rotation.set(al.roll, area.group.rotation.y + al.look + al.turn, al.pitch);
    alpaca.scale.y = reduceMotion ? 1 : 1 + 0.018 * Math.sin(time * 2.6);
    const w = stage.clientWidth, h = stage.clientHeight;
    for (const t of tagList) {
      tmp.copy(g.localToWorld(t.at())).project(camera);
      t.el.style.transform = `translate(${(((tmp.x + 1) / 2) * w).toFixed(1)}px, ${(((1 - tmp.y) / 2) * h).toFixed(1)}px)`;
    }
  }

  function stop() {
    ro.disconnect();
    if (sc.stop) sc.stop();
    if (splash) g.remove(splash.mesh);
    area.group.remove(g);
    hidden.forEach((o) => { o.visible = true; });
    if (area.ring) area.ring.visible = true;
    tags.remove();
    host.hidden = true;
    host.textContent = "";
    alpaca.rotation.x = 0;
  }

  if (area.ring) area.ring.visible = false;
  return { frame, stop };
}
