// A Grasshopper definition drawn on the page, from the <name>-definition.json that Alpaca4d's
// Tools/GhCanvas reads from the .gh: components where they sit on the canvas, with their icons,
// inputs and outputs; sliders, toggles, lists and panels with what they show; groups; and the
// wires. Drag to move, pinch or Ctrl/Cmd + scroll to zoom; hover or tap a component for what it
// does and, for Alpaca4d's, a link to its page in the docs.
//
//   <div class="gh-canvas" data-src="x-definition.json" data-docs='{"Support (Alpaca4d)": "…"}'></div>

(function () {
  const NS = "http://www.w3.org/2000/svg";
  const PORT = 20;          // Grasshopper's height per input or output
  const CHAR = 4.8;         // Overpass Mono at the labels' size, 8 px, per character
  const ICON = 24;

  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  };
  const canonical = (n) => n.replace(/\(Alpaca4d\)/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
  const rgba = (c, a) => (c ? `rgba(${c[1]},${c[2]},${c[3]},${a ?? c[0] / 255})` : null);
  const textWidth = (s) => s.length * CHAR;

  // Each object's box as drawn, and its grips: where its wires start and end.
  function layout(o) {
    let [x, y, w, h] = o.box;
    const grips = { in: [], out: [] };
    if (o.kind === "component") {
      // A port's place from the file, when it has one near the component: one a menu holds,
      // in a definition written outside Rhino, can be left at the origin.
      const near = (p) => p.box && (!o.pivot || Math.abs(p.box[0] + p.box[2] / 2 - o.pivot[0]) < 300 && Math.abs(p.box[1] + p.box[3] / 2 - o.pivot[1]) < 300);
      const placed = [...o.inputs, ...o.outputs].filter(near).map((p) => p.box);
      if (placed.length) {
        // The box from its ports, which a menu cannot stretch.
        const y0 = Math.min(...placed.map((b) => b[1])) - 2, y1 = Math.max(...placed.map((b) => b[1] + b[3])) + 2;
        const x0 = Math.min(...placed.map((b) => b[0])) - 2, x1 = Math.max(...placed.map((b) => b[0] + b[2])) + 2;
        if (!o.pivot || (o.pivot[0] > x0 && o.pivot[0] < x1)) { x = x0; w = x1 - x0; }
        y = y0; h = y1 - y0;
      } else if (o.pivot && (w > 600 || o.pivot[0] < x || o.pivot[0] > x + w)) { x = o.pivot[0] - 40; w = 80; y = o.pivot[1] - h / 2; }
      const inW = o.inputs.length ? Math.max(...o.inputs.map((p) => textWidth(p.nick))) + 10 : 4;
      const outW = o.outputs.length ? Math.max(...o.outputs.map((p) => textWidth(p.nick))) + 10 : 4;
      const need = inW + ICON + 10 + outW;
      // A definition written outside Rhino measures its components a little small: grow them about their middle.
      if (w < need) { x -= (need - w) / 2; w = need; }
      const top = y;
      const placeSide = (ports, side) => {
        const known = ports.filter(near);
        const spacing = known.length ? PORT : Math.min(PORT, Math.max(h - 4, ports.length * PORT) / ports.length);
        let below = known.length ? Math.max(...known.map((p) => p.box[1] + p.box[3])) : null;
        return ports.map((p, i) => {
          let at;
          if (near(p)) at = p.box[1] + p.box[3] / 2;
          else if (below != null) { at = below + PORT / 2; below += PORT; }   // a menu's port, under the others
          else at = side === "in" ? top + 2 + spacing * (i + 0.5) : top + h / 2 + spacing * (i + 0.5 - ports.length / 2);
          return { id: p.id, nick: p.nick, name: p.name, side, y: at };
        });
      };
      const ins = placeSide(o.inputs, "in"), outs = placeSide(o.outputs, "out");
      const lowest = Math.max(...[...ins, ...outs].map((p) => p.y + PORT / 2), top + ICON + 12);
      h = Math.max(h, lowest - top + 2);
      grips.in = ins.map((p) => ({ ...p, x }));
      grips.out = outs.map((p) => ({ ...p, x: x + w }));
      return { x, y, w, h, grips, inW, outW };
    }
    if (o.kind === "group" || o.kind === "scribble") return { x, y, w, h, grips };
    // A parameter on its own: one grip each side, in the middle.
    if (o.kind === "slider") w = Math.max(w, textWidth(o.nick) + 90);
    if (o.kind === "param") w = Math.max(w, Math.min(textWidth(o.nick) + 12, 120));
    grips.in = [{ id: o.id, x, y: y + h / 2 }];
    grips.out = [{ id: o.id, x: x + w, y: y + h / 2 }];
    return { x, y, w, h, grips };
  }

  function drawComponent(g, o, L, icon) {
    const { x, y, w, h } = L;
    el("rect", { x, y: y + 1.5, width: w, height: h, rx: 4, class: "ghc-shadow" }, g);
    el("rect", { x, y, width: w, height: h, rx: 4, class: "ghc-body" }, g);
    const mx = x + L.inW, mw = w - L.inW - L.outW;
    el("rect", { x: mx, y: y + 2, width: mw, height: h - 4, rx: 3, class: "ghc-mid" }, g);
    if (icon) el("image", { href: icon, x: mx + mw / 2 - ICON / 2, y: y + h / 2 - ICON / 2, width: ICON, height: ICON }, g);
    else {
      const t = el("text", { x: mx + mw / 2, y: y + h / 2, class: "ghc-vertical", transform: `rotate(-90 ${mx + mw / 2} ${y + h / 2})` }, g);
      t.textContent = o.nick.toUpperCase();
    }
    for (const p of L.grips.in) {
      el("text", { x: x + 5, y: p.y + 3, class: "ghc-label" }, g).textContent = p.nick;
      el("circle", { cx: p.x, cy: p.y, r: 2.6, class: "ghc-grip" }, g);
    }
    for (const p of L.grips.out) {
      el("text", { x: x + w - 5, y: p.y + 3, class: "ghc-label end" }, g).textContent = p.nick;
      el("circle", { cx: p.x, cy: p.y, r: 2.6, class: "ghc-grip" }, g);
    }
    if (o.unit) {
      const tw = Math.max(textWidth(o.unit) + 14, 40);
      el("rect", { x: x + w / 2 - tw / 2, y: y + h - 2, width: tw, height: 13, rx: 3, class: "ghc-tab" }, g);
      el("text", { x: x + w / 2, y: y + h + 7.5, class: "ghc-tab-text" }, g).textContent = o.unit;
    }
  }

  function drawParam(g, o, L, icon) {
    const { x, y, w, h } = L;
    const box = (cls) => {
      el("rect", { x, y: y + 1.5, width: w, height: h, rx: 4, class: "ghc-shadow" }, g);
      el("rect", { x, y, width: w, height: h, rx: 4, class: cls }, g);
    };
    if (o.kind === "slider") {
      box("ghc-body");
      const lw = Math.min(textWidth(o.nick) + 10, w * 0.45);
      el("text", { x: x + 5, y: y + h / 2 + 3, class: "ghc-label" }, g).textContent = o.nick;
      const x0 = x + lw + 4, x1 = x + w - 34;
      el("line", { x1: x0, y1: y + h / 2, x2: x1, y2: y + h / 2, class: "ghc-rail" }, g);
      const t = o.max > o.min ? (o.value - o.min) / (o.max - o.min) : 0;
      el("circle", { cx: x0 + (x1 - x0) * t, cy: y + h / 2, r: 4, class: "ghc-knob" }, g);
      el("text", { x: x + w - 5, y: y + h / 2 + 3, class: "ghc-label end strong" }, g).textContent = o.value.toFixed(o.digits);
    } else if (o.kind === "toggle") {
      box("ghc-body");
      el("text", { x: x + 5, y: y + h / 2 + 3, class: "ghc-label" }, g).textContent = o.nick;
      el("rect", { x: x + w - 38, y: y + 3, width: 34, height: h - 6, rx: (h - 6) / 2, class: o.value ? "ghc-on" : "ghc-off" }, g);
      el("text", { x: x + w - 21, y: y + h / 2 + 3, class: "ghc-label mid strong" }, g).textContent = o.value ? "True" : "False";
    } else if (o.kind === "list") {
      box("ghc-body");
      const sel = o.items.filter((i) => i.selected).map((i) => i.name).join(", ") || (o.items[0] && o.items[0].name) || o.nick;
      el("text", { x: x + 6, y: y + h / 2 + 3, class: "ghc-label strong" }, g).textContent = "▾ " + sel;
    } else if (o.kind === "panel") {
      el("rect", { x, y, width: w, height: h, rx: 2, class: "ghc-panel", style: o.colour && o.colour[0] > 0 ? `fill:${rgba(o.colour, 1)}` : "" }, g);
      const fo = el("foreignObject", { x: x + 3, y: y + 2, width: Math.max(w - 6, 1), height: Math.max(h - 4, 1) }, g);
      const div = document.createElement("div");
      div.className = "ghc-panel-text" + (o.src.length ? " fed" : "");
      div.textContent = o.src.length ? o.nick : o.text;
      fo.appendChild(div);
    } else {
      box("ghc-body param");
      if (icon && w >= ICON + 4 && !o.nick) el("image", { href: icon, x: x + w / 2 - 12, y: y + h / 2 - 12, width: 24, height: 24 }, g);
      else el("text", { x: x + w / 2, y: y + h / 2 + 3, class: "ghc-label mid" }, g).textContent = o.nick;
    }
    if (o.kind === "panel" || o.kind === "param") el("circle", { cx: x, cy: y + h / 2, r: 2.6, class: "ghc-grip" }, g);
    el("circle", { cx: x + w, cy: y + h / 2, r: 2.6, class: "ghc-grip" }, g);
  }

  // opts.still draws it as a picture, for a card: no moving, zooming or tools, and a click goes
  // to whatever holds it. opts.onWire and opts.onGrip let the player wire it by hand, as in
  // Grasshopper: a wire dragged from an output and let go on an input, or the other way, calls
  // onWire with the output's id (from), the input's id (to; null when let go away from a grip) and
  // whether Shift or Ctrl was held as it was let go; a grip tapped without dragging calls onGrip
  // with the port's id, its side ("in" or "out"), its owner's id, its nick and whether Shift was
  // held, and a tap on the empty canvas calls it with null. opts.wirable(id, side) says which grips
  // take part (all of them unless it is given); opts.armed is the id of a grip to show picked, with
  // a wire from it following the pointer. opts.view starts from a view an earlier drawing returned.
  // An object's "mark" is added to its class: "fresh" for one just added, "before" for one that
  // stands in for an earlier part.
  function render(host, def, docs, opts = {}) {
    const still = !!opts.still;
    let drag = null;   // a wire being drawn, from the grip it started at
    const PAD = still ? 10 : 30;
    const byId = new Map();
    const placed = new Map();
    for (const o of def.objects) { byId.set(o.id, o); if (o.kind !== "group") placed.set(o.id, layout(o)); }
    // Groups: around what they hold, as drawn, a little larger.
    const groupBox = (o, seen = new Set()) => {
      if (placed.has(o.id) && o.kind !== "group") return placed.get(o.id);
      if (seen.has(o.id)) return null;
      seen.add(o.id);
      const boxes = o.members.map((m) => byId.get(m)).filter(Boolean).map((m) => (m.kind === "group" ? groupBox(m, seen) : placed.get(m.id))).filter(Boolean);
      if (!boxes.length) return null;
      const x0 = Math.min(...boxes.map((b) => b.x)) - 8, y0 = Math.min(...boxes.map((b) => b.y)) - 18;
      const x1 = Math.max(...boxes.map((b) => b.x + b.w)) + 8, y1 = Math.max(...boxes.map((b) => b.y + b.h + 14)) + 6;
      return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, grips: { in: [], out: [] } };
    };
    const groups = def.objects.filter((o) => o.kind === "group").map((o) => ({ o, L: groupBox(o) })).filter((g) => g.L);

    const all = [...placed.values(), ...groups.map((g) => g.L)];
    if (!all.length) { host.textContent = ""; return { view: () => null }; }
    const minX = Math.min(...all.map((b) => b.x)) - PAD, minY = Math.min(...all.map((b) => b.y)) - PAD;
    const maxX = Math.max(...all.map((b) => b.x + b.w)) + PAD, maxY = Math.max(...all.map((b) => b.y + b.h)) + PAD;

    const svg = el("svg", { class: "ghc-svg", role: "img", "aria-label": "The Grasshopper definition" });
    const world = el("g", {}, svg);
    const gGroups = el("g", {}, world), gWires = el("g", { class: "ghc-wires" }, world), gObjects = el("g", {}, world);

    // Groups, biggest first so that a group inside another sits on top of it.
    groups.sort((a, b) => b.L.w * b.L.h - a.L.w * a.L.h).forEach(({ o, L }) => {
      const fill = rgba(o.colour, Math.min(0.6, (o.colour ? o.colour[0] : 60) / 255 + 0.08)) || "rgba(150,150,150,.2)";
      el("rect", { x: L.x, y: L.y, width: L.w, height: L.h, rx: 7, class: "ghc-group", style: `fill:${fill}` }, gGroups);
      if (o.nick && o.nick !== "Group") el("text", { x: L.x + 7, y: L.y + 12, class: "ghc-group-name" }, gGroups).textContent = o.nick;
    });

    // Outputs by id, then a wire into every input from its sources.
    const outs = new Map();
    for (const [id, L] of placed) for (const p of L.grips.out) outs.set(p.id, p);
    const wiresOf = new Map();
    const curve = (a, b) => {
      const dx = Math.max(Math.abs(b.x - a.x) * 0.5, 24);
      return `M${a.x},${a.y} C${a.x + dx},${a.y} ${b.x - dx},${b.y} ${b.x},${b.y}`;
    };
    const addWire = (from, to, a, b) => {
      const path = el("path", { d: curve(a, b), class: "ghc-wire" }, gWires);
      for (const id of [from, to]) { if (!wiresOf.has(id)) wiresOf.set(id, []); wiresOf.get(id).push(path); }
    };
    const ownerOf = new Map();
    for (const o of def.objects) {
      if (o.kind === "component") for (const p of o.outputs) ownerOf.set(p.id, o.id);
      else ownerOf.set(o.id, o.id);
    }
    for (const o of def.objects) {
      const L = placed.get(o.id);
      if (!L) continue;
      const ins = o.kind === "component" ? o.inputs.map((p, i) => ({ src: p.src, at: L.grips.in[i] })) : (o.src || []).length ? [{ src: o.src, at: L.grips.in[0] }] : [];
      for (const { src, at } of ins) for (const s of src) { const a = outs.get(s); if (a && at) addWire(ownerOf.get(s), o.id, a, at); }
    }

    // The objects themselves, each with what it is on hover.
    const tip = document.createElement("div");
    tip.className = "ghc-tip";
    tip.hidden = true;
    let pinned = null;
    const showTip = (o, e) => {
      const link = docs[canonical(o.name)];
      const desc = (o.desc || "").split(/(?<=\.)\s/)[0];
      tip.innerHTML = "";
      const b = document.createElement("b"); b.textContent = o.name.replace(/\s*\(Alpaca4d\)\s*$/, ""); tip.appendChild(b);
      if (o.nick && o.nick !== o.name && !o.name.startsWith(o.nick)) { const s = document.createElement("small"); s.textContent = "“" + o.nick + "”"; tip.appendChild(s); }
      if (desc) { const p = document.createElement("p"); p.textContent = desc; tip.appendChild(p); }
      if (link) { const a = document.createElement("a"); a.href = link; a.textContent = "Open its page in the docs"; tip.appendChild(a); }
      tip.hidden = false;
      const r = host.getBoundingClientRect();
      tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 260) + "px";
      tip.style.top = Math.min(e.clientY - r.top + 14, r.height - 120) + "px";
    };
    for (const o of def.objects) {
      const L = placed.get(o.id);
      if (!L) continue;
      const g = el("g", { class: "ghc-obj" + (docs[canonical(o.name)] ? " has-docs" : "") + (o.mark ? " " + o.mark : "") }, gObjects);
      const icon = def.icons[o.type];
      if (o.kind === "component") drawComponent(g, o, L, icon);
      else if (o.kind === "scribble") {
        const t = el("text", { x: L.x + 4, y: L.y + Math.min(o.size || 25, 40), class: "ghc-scribble", style: `font-size:${Math.min(o.size || 25, 40)}px` }, g);
        o.text.split("\n").forEach((line, i) => { const s = el("tspan", { x: L.x + 4, dy: i ? "1.15em" : 0 }, t); s.textContent = line; });
        continue;
      } else drawParam(g, o, L, icon);
      g.addEventListener("pointerenter", (e) => { (wiresOf.get(o.id) || []).forEach((w) => w.classList.add("lit")); if (!pinned && !drag && !(wiring && (opts.armed || nearest(e.clientX, e.clientY)))) showTip(o, e); });
      g.addEventListener("pointerleave", () => { (wiresOf.get(o.id) || []).forEach((w) => w.classList.remove("lit")); if (!pinned) tip.hidden = true; });
      if (!still) g.addEventListener("click", (e) => { if (moved) return; pinned = pinned === o ? null : o; showTip(o, e); if (!pinned) tip.hidden = true; e.stopPropagation(); });
    }
    // Wiring by hand: a ring around every grip that can be wired, over everything else, kept about
    // the same size on the screen however far the view is zoomed. The pointer takes the grip
    // nearest it within reach, so a small one is as easy to hit as a big one.
    const wiring = !!(opts.onWire || opts.onGrip);
    const grips = [], rings = [];
    let gLive = null, live = null, badge = null;
    if (wiring) {
      const gHits = el("g", { class: "ghc-hits" }, world);
      for (const o of def.objects) {
        const L = placed.get(o.id);
        if (!L || o.kind === "group" || o.kind === "scribble") continue;
        for (const side of ["in", "out"]) {
          for (const p of L.grips[side]) {
            if (opts.wirable && !opts.wirable(p.id, side)) continue;
            const ring = el("circle", { cx: p.x, cy: p.y, r: 7, "data-port": p.id, class: `ghc-hit ${side}` + (opts.armed === p.id ? " armed" : "") }, gHits);
            rings.push(ring);
            grips.push({ id: p.id, side, owner: o.id, nick: p.nick || o.nick, x: p.x, y: p.y, ring });
          }
        }
      }
      gLive = el("g", { class: "ghc-live" }, world);
    }
    const REACH = 26;   // screen pixels
    const nearest = (cx, cy, side) => {
      const m = world.getScreenCTM();
      if (!m) return null;
      let best = null, far = REACH;
      for (const g of grips) {
        if (side && g.side !== side) continue;
        const d = Math.hypot(m.a * g.x + m.e - cx, m.d * g.y + m.f - cy);
        if (d < far) { best = g; far = d; }
      }
      return best;
    };
    const mark = (target) => grips.forEach((g) => g.ring.classList.toggle("near", g === target));
    // The wire being drawn, from a grip to the pointer, or to the grip it would land on; a + or
    // a − beside the pointer when Shift or Ctrl would add or take away, as in Grasshopper.
    const drawLive = (from, e) => {
      const m = world.getScreenCTM();
      if (!m) return;
      const at = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
      const target = nearest(e.clientX, e.clientY, from.side === "out" ? "in" : "out");
      const end = target || at;
      if (!live) { live = el("path", { class: "ghc-wire live" }, gLive); badge = el("text", { class: "ghc-wire-mode" }, gLive); }
      live.setAttribute("d", from.side === "out" ? curve(from, end) : curve(end, from));
      badge.textContent = e.shiftKey ? "+" : e.ctrlKey || e.metaKey ? "−" : "";
      badge.setAttribute("x", at.x + 10 / m.a);
      badge.setAttribute("y", at.y - 8 / m.a);
      badge.style.fontSize = `${16 / m.a}px`;
      mark(target);
    };
    const clearLive = () => {
      if (live) { live.remove(); badge.remove(); live = badge = null; }
      mark(null);
      host.classList.remove("on-grip");
    };
    // Over the canvas with nothing pressed: the grip under the pointer lit, or the picked one's wire.
    const hover = (e) => {
      const picked = grips.find((g) => g.id === opts.armed);
      if (picked) { drawLive(picked, e); host.classList.add("on-grip"); return; }
      const g = nearest(e.clientX, e.clientY);
      mark(g);
      host.classList.toggle("on-grip", !!g);
      if (g && !pinned) tip.hidden = true;   // what a component is, but not over the grips
    };
    const endWire = (e) => {
      const d = drag;
      drag = null;
      clearLive();
      if (!d.far) {
        if (opts.onGrip) opts.onGrip({ id: d.from.id, side: d.from.side, owner: d.from.owner, nick: d.from.nick, shift: e.shiftKey });
        return;
      }
      const to = nearest(e.clientX, e.clientY, d.from.side === "out" ? "in" : "out");
      const [o, i] = d.from.side === "out" ? [d.from, to] : [to, d.from];
      if (opts.onWire) opts.onWire({ from: o ? o.id : null, to: i ? i.id : null, shift: e.shiftKey, ctrl: e.ctrlKey || e.metaKey });
    };

    // The view: fitted to the definition, then moved and zoomed.
    let view = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
    const apply = () => {
      svg.setAttribute("viewBox", `${view.x} ${view.y} ${view.w} ${view.h}`);
      if (rings.length) { const r = Math.min(14, Math.max(5, (11 * view.w) / Math.max(1, host.clientWidth))); rings.forEach((c) => c.setAttribute("r", r.toFixed(1))); }
    };
    const fit = () => {
      const r = host.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;   // hidden, or taken off the page
      const aspect = r.width / Math.max(r.height, 1);
      let w = maxX - minX, h = maxY - minY;
      if (w / h > aspect) h = w / aspect; else w = h * aspect;
      view = { x: (minX + maxX) / 2 - w / 2, y: (minY + maxY) / 2 - h / 2, w, h };
      apply();
    };
    const zoom = (k, cx, cy) => {
      const r = svg.getBoundingClientRect();
      const px = view.x + ((cx ?? r.left + r.width / 2) - r.left) / r.width * view.w;
      const py = view.y + ((cy ?? r.top + r.height / 2) - r.top) / r.height * view.h;
      const w = Math.min(Math.max(view.w * k, 80), (maxX - minX) * 4);
      const f = w / view.w;
      view = { x: px - (px - view.x) * f, y: py - (py - view.y) * f, w, h: view.h * f };
      apply();
    };
    let moved = false;
    if (still) {
      host.textContent = "";
      host.append(svg, tip);
      fit();
      new ResizeObserver(fit).observe(host);
      return;
    }
    const pointers = new Map();
    let last = null, pinch = null;
    svg.addEventListener("pointerdown", (e) => {
      // On a grip, a wire; anywhere else, the view moves.
      const from = wiring && !pointers.size && e.button === 0 ? nearest(e.clientX, e.clientY) : null;
      if (from) {
        drag = { from, x: e.clientX, y: e.clientY, far: false };
        moved = true;   // the click this ends in pins no tip
        pinned = null;
        tip.hidden = true;
        svg.setPointerCapture(e.pointerId);
        e.preventDefault();
        return;
      }
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      moved = false;
      if (pointers.size === 1) last = { x: e.clientX, y: e.clientY };
      if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
    });
    svg.addEventListener("pointermove", (e) => {
      if (drag) {
        if (!drag.far && Math.hypot(e.clientX - drag.x, e.clientY - drag.y) > 4) drag.far = true;
        if (drag.far) drawLive(drag.from, e);
        return;
      }
      if (wiring && !pointers.size && e.pointerType !== "touch") hover(e);
      if (!pointers.has(e.pointerId)) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2 && pinch) {
        const [a, b] = [...pointers.values()];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        zoom(pinch / d, (a.x + b.x) / 2, (a.y + b.y) / 2);
        pinch = d; moved = true;
        return;
      }
      if (!last) return;
      const dx = e.clientX - last.x, dy = e.clientY - last.y;
      if (Math.abs(dx) + Math.abs(dy) > 3 || moved) {
        if (!moved) svg.setPointerCapture(e.pointerId);
        moved = true;
        host.classList.add("dragging");
        const r = svg.getBoundingClientRect();
        view.x -= dx / r.width * view.w; view.y -= dy / r.height * view.h;
        apply();
        last = { x: e.clientX, y: e.clientY };
      }
    });
    const end = (e) => { pointers.delete(e.pointerId); if (pointers.size < 2) pinch = null; if (!pointers.size) { last = null; host.classList.remove("dragging"); } };
    svg.addEventListener("pointerup", (e) => (drag ? endWire(e) : end(e)));
    svg.addEventListener("pointercancel", (e) => { if (drag) { drag = null; clearLive(); } else end(e); });
    if (wiring) {
      svg.addEventListener("pointerleave", () => { if (!drag) clearLive(); });
      // Ctrl and a click is the Mac's right click: keep its menu away while wiring.
      svg.addEventListener("contextmenu", (e) => e.preventDefault());
    }
    // Scrolling the page goes on as it was; with Ctrl or Cmd (a trackpad's pinch), or full screen, it zooms.
    svg.addEventListener("wheel", (e) => {
      if (!(e.ctrlKey || e.metaKey || document.fullscreenElement === host)) { host.classList.add("hint"); clearTimeout(host._hint); host._hint = setTimeout(() => host.classList.remove("hint"), 1200); return; }
      e.preventDefault();
      zoom(Math.exp(e.deltaY * 0.0022), e.clientX, e.clientY);
    }, { passive: false });
    svg.addEventListener("click", () => {
      pinned = null;
      tip.hidden = true;
      if (wiring && !moved && opts.armed && opts.onGrip) opts.onGrip(null);
    });

    const tools = document.createElement("div");
    tools.className = "ghc-tools";
    const button = (label, title, fn) => { const b = document.createElement("button"); b.type = "button"; b.textContent = label; b.title = title; b.setAttribute("aria-label", title); b.addEventListener("click", fn); tools.appendChild(b); };
    button("−", "Zoom out", () => zoom(1.3));
    button("+", "Zoom in", () => zoom(1 / 1.3));
    button("⤢", "Fit the definition", fit);
    if (host.requestFullscreen) button("⛶", "Full screen", () => (document.fullscreenElement ? document.exitFullscreen() : host.requestFullscreen()));
    const hint = document.createElement("div");
    hint.className = "ghc-hint";
    hint.textContent = "Ctrl or ⌘ + scroll to zoom · drag to move";

    host.textContent = "";
    host.append(svg, tools, tip, hint);
    fit();
    if (opts.view) { view = { ...opts.view }; apply(); }
    // The observer reports the size it starts at too: that one keeps a view handed in.
    let first = true;
    new ResizeObserver(() => { if (first && opts.view) { first = false; return; } first = false; fit(); }).observe(host);
    document.addEventListener("fullscreenchange", () => setTimeout(fit, 50));
    return { view: () => ({ ...view }) };
  }

  function load(host) {
    let docs = {};
    try { docs = JSON.parse(host.dataset.docs || "{}"); } catch (e) { /* no links */ }
    const lower = {};
    for (const k in docs) lower[canonical(k)] = docs[k];
    fetch(host.dataset.src)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((def) => render(host, def, lower))
      .catch(() => { host.classList.add("failed"); host.textContent = "The definition could not be drawn here: download the .gh to open it."; });
  }

  // For a page that builds its definitions itself, such as the Playground's lessons.
  window.GhCanvas = { render: (host, def, opts = {}) => render(host, def, {}, opts) };

  const hosts = document.querySelectorAll(".gh-canvas[data-src]");
  if (!hosts.length) return;
  // Drawn when it comes near the screen.
  const io = "IntersectionObserver" in window ? new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); load(e.target); } }), { rootMargin: "300px" }) : null;
  hosts.forEach((h) => (io ? io.observe(h) : load(h)));
})();
