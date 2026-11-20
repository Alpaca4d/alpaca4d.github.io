// "Try it": an example's definition, solved beforehand by Alpaca4d and OpenSees for every setting of
// a few of its inputs, drawn in 3D as the reader moves them. Nothing is solved in the browser and
// nothing runs on a server: each setting is looked up in <slug>-try.json, which Alpaca4d's
// Tools/TryIt/bake.sh writes from the example's own definition (Bake.py says what it holds).
//
// A design (the inputs that change the structure) gives the nodes, beams, shells, the outside of the
// solids, the supports and the modes; a run (every input, loads and steps too) how far each node
// moves, and per beam its rotations, utilisation and section when the bake has them. examples.mjs
// puts a <div class="try" data-src="…"> on the page.

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const C = {
  blue: "#4288f7", green: "#afc930", orange: "#eb6c3f", red: "#fe0000", navy: "#011efe",
  ink: "#2a2d31", ghost: "#b9bdc4", edge: "#a0a8b2", load: "#eb6c3f", plain: "#c9ced6",
};
// Utilisation: blue when idle, green, orange at 1; red past it.
const UTIL_STOPS = [[0, C.blue], [0.5, C.green], [1, C.orange]];
// Displacements, as the docs' contour pictures: navy to red.
const CONTOUR_STOPS = [[0, C.navy], [0.25, C.blue], [0.5, C.green], [0.75, C.orange], [1, C.red]];

const GOVERNING = {
  Axial: "axial force (6.2.3, 6.2.4)",
  ShearY: "shear (6.2.6)",
  ShearZ: "shear (6.2.6)",
  Torsion: "torsion (6.2.7)",
  BendingY: "bending about the minor axis (6.2.5)",
  BendingZ: "bending about the major axis (6.2.5)",
  Combined: "bending with axial force (6.2.9)",
  BucklingY: "buckling about the minor axis (6.3.1)",
  BucklingZ: "buckling about the major axis (6.3.1)",
  LTB: "lateral-torsional buckling (6.3.2)",
  InteractionY: "buckling about the minor axis, with bending (6.3.3)",
  InteractionZ: "buckling about the major axis, with bending (6.3.3)",
};

const LADDER = [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000];
// Plastic hinges as Model View draws them (PlasticHinges.BandColours): reached 1, 2, 4, 8 times the
// yield strain, and failed.
const HINGE_COLOURS = ["#f2c94c", "#eb6c3f", "#d62828", "#7a0e1c", "#9e35da"];
const HINGE_NAMES = ["yielded", "×2", "×4", "×8", "failed"];
// A Multi-Material design's materials, in the order the bake met them.
const MATERIAL_COLOURS = ["#4288f7", "#9aa3ad", "#eb6c3f", "#9e35da", "#afc930"];
const SEGMENTS = 8;          // a beam bent from its end rotations is drawn in this many pieces

const el = (tag, cls, html) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  return e;
};
const fmt = (v, digits) => (v == null || Number.isNaN(v) ? "–" : Number(v).toFixed(digits));
const singular = (name) => name.replace(/s$/, "");

function ramp(stops, t, out = new THREE.Color()) {
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1];
      const [t1, c1] = stops[i];
      return out.set(c0).lerp(new THREE.Color(c1), (t - t0) / (t1 - t0 || 1));
    }
  }
  return out.set(stops[stops.length - 1][1]);
}
const utilColour = (u, out) => (u > 1 ? out.set(C.red) : ramp(UTIL_STOPS, u, out));
const cssGradient = (stops) => `linear-gradient(90deg, ${stops.map(([t, c]) => `${c} ${t * 100}%`).join(", ")})`;

class TryIt {
  constructor(root, data) {
    this.root = root;
    this.data = data;
    this.units = { d: 1e-4, rot: 1e-5, v: 1, ...(data.units || {}) };
    // Files from the first bake kept one mode as "mode" and its frequencies.
    for (const design of Object.values(data.designs)) {
      if (!design.modes && design.mode) design.modes = [{ f: design.frequencies?.[0], d: design.mode }];
    }
    this.pick = data.inputs.map((input) => input.default ?? 0);
    this.stepAt = data.inputs.findIndex((input) => input.step);
    const aRun = Object.values(data.runs)[0] || {}, aDesign = Object.values(data.designs)[0] || {};
    this.views = [
      aRun.u && { id: "util", label: "Utilisation" },
      data.field && { id: "field", label: data.field.name },
      aRun.d && { id: "disp", label: "Displacement" },
      aDesign.modes?.length && { id: "mode", label: aDesign.modes.length > 1 ? "Modes" : "First mode" },
    ].filter(Boolean);
    if (data.topology) this.views = [{ id: "density", label: "Density" }];
    this.view = this.views.some((v) => v.id === data.view) ? data.view : this.views[0].id;
    this.mode = 0;
    this.scale = null;
    this.clock = new THREE.Clock();
    this.capsOf = data.sections.map((s) => s.outlines.map((o) => this.capOf(o)));
    this.layout();
    this.scene3d();
    this.update();
  }

  // ---- The page: the viewport with its views, legend and scale, the inputs and the results.
  layout() {
    const d = this.data;
    this.root.innerHTML = "";
    const stage = el("div", "try-stage");
    this.canvasHost = el("div", "try-canvas");
    stage.append(this.canvasHost);

    const views = el("div", "try-views");
    views.setAttribute("role", "group");
    views.setAttribute("aria-label", "Show");
    this.viewButtons = this.views.map((v) => {
      const b = el("button", "try-chip", v.label);
      b.type = "button";
      b.addEventListener("click", () => { this.view = v.id; this.update(); });
      views.append(b);
      return [v.id, b];
    });
    if (this.views.length > 1) stage.append(views);

    this.legend = el("div", "try-legend");
    stage.append(this.legend);

    this.scaleBox = el("div", "try-scale");
    stage.append(this.scaleBox);

    this.tag = el("div", "try-tag");
    stage.append(this.tag);

    const side = el("div", "try-side");
    const inputs = el("div", "try-inputs");
    this.inputRows = d.inputs.map((input, i) => {
      const row = el("div", "try-input");
      const head = el("div", "try-input-head");
      const label = el("span", "try-input-name", `${input.name}${input.unit ? ` <small>${input.unit}</small>` : ""}`);
      label.id = `try-${i}-${Math.random().toString(36).slice(2, 8)}`;
      const value = el("output", "try-input-value");
      head.append(label, value);
      row.append(head);
      const numeric = input.values.every((v) => typeof v === "number");
      if (input.step || (numeric && input.values.length > 3)) {
        const line = el("div", "try-range-line");
        if (input.play) {
          const play = el("button", "try-play", "▶");
          play.type = "button";
          play.setAttribute("aria-label", "Play");
          play.addEventListener("click", () => this.togglePlay(i, play));
          line.append(play);
        }
        const range = el("input", "try-range");
        range.type = "range";
        range.min = 0;
        range.max = input.values.length - 1;
        range.step = 1;
        range.value = this.pick[i];
        range.setAttribute("aria-labelledby", label.id);
        range.addEventListener("input", () => { this.pick[i] = Number(range.value); this.update(); });
        line.append(range);
        row.append(line);
        if (!input.step) {
          const ticks = el("div", "try-ticks");
          input.values.forEach((v) => ticks.append(el("span", "", String(v))));
          row.append(ticks);
        }
        return { row, value, set: () => { range.value = this.pick[i]; range.setAttribute("aria-valuetext", `${input.values[this.pick[i]]} ${input.unit || ""}`.trim()); } };
      }
      // Many or long choices - topology's methods, combinations - in a list to pick from.
      if (input.values.length > 4 || input.values.some((v) => String(v).length > 14)) {
        value.hidden = true;
        const select = el("select", "try-select");
        select.setAttribute("aria-labelledby", label.id);
        input.values.forEach((v, k) => { const o = el("option", "", String(v)); o.value = k; select.append(o); });
        select.addEventListener("change", () => { this.pick[i] = Number(select.value); this.update(); });
        row.append(select);
        return { row, value, set: () => { select.value = this.pick[i]; } };
      }
      // The button pressed says the value: no need to repeat it by the name.
      value.hidden = true;
      const group = el("div", "try-seg");
      group.setAttribute("role", "radiogroup");
      group.setAttribute("aria-labelledby", label.id);
      const buttons = input.values.map((v, k) => {
        const b = el("button", "try-seg-btn", String(v));
        b.type = "button";
        b.setAttribute("role", "radio");
        b.addEventListener("click", () => { this.pick[i] = k; this.update(); });
        group.append(b);
        return b;
      });
      row.append(group);
      return { row, value, set: () => buttons.forEach((b, k) => b.setAttribute("aria-checked", String(k === this.pick[i]))) };
    });
    this.inputRows.forEach((r) => inputs.append(r.row));
    side.append(inputs);

    this.results = el("dl", "try-results");
    side.append(this.results);
    if (d.results.some((r) => r.chart) && this.stepAt >= 0) {
      this.chart = el("div", "try-chart");
      side.append(this.chart);
    }
    this.worst = el("p", "try-worst");
    side.append(this.worst);
    side.append(el("p", "try-note", d.note ||
      `Every setting, ${Object.keys(d.runs).length} in all, was solved beforehand by this example's definition, ` +
      `with Alpaca4d and OpenSees: moving an input looks its results up, nothing is solved in your browser.`));

    this.root.append(stage, side);
  }

  togglePlay(i, button) {
    if (this.playing) {
      clearInterval(this.playing);
      this.playing = null;
      button.textContent = "▶";
      button.setAttribute("aria-label", "Play");
      return;
    }
    const count = this.data.inputs[i].values.length;
    if (this.pick[i] >= count - 1) this.pick[i] = 0;
    button.textContent = "❚❚";
    button.setAttribute("aria-label", "Pause");
    this.playing = setInterval(() => {
      this.pick[i] = (this.pick[i] + 1) % count;
      this.update();
      if (this.pick[i] === count - 1) this.togglePlay(i, button);
    }, Math.max(40, Math.min(160, 8000 / count)));
  }

  // ---- three.js: a camera that stays put from design to design, so a longer span looks longer.
  scene3d() {
    const host = this.canvasHost;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    host.append(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(30, 1, 0.05, 5000);
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xa8adb5, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(-0.6, 1, 0.8);
    this.scene.add(sun);

    this.material = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.8, metalness: 0, flatShading: true, side: THREE.DoubleSide });
    this.surfaceMaterial = new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.85, metalness: 0, flatShading: true, side: THREE.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1,
    });
    this.edgeMaterial = new THREE.LineBasicMaterial({ color: C.edge });
    this.ghostMaterial = new THREE.LineBasicMaterial({ color: C.ghost });
    this.inkMaterial = new THREE.MeshStandardMaterial({ color: C.ink, roughness: 0.9, flatShading: true });
    this.loadMaterial = new THREE.MeshBasicMaterial({ color: C.load });
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // The largest design, to aim the camera at once.
    const size = new THREE.Vector3();
    for (const design of Object.values(this.data.designs)) {
      const box = new THREE.Box3();
      design.nodes.forEach((p) => box.expandByPoint(new THREE.Vector3(p[0], p[2], p[1])));
      size.max(box.getSize(new THREE.Vector3()));
    }
    this.extent = size;
    this.radius = size.length() / 2;
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.target.set(0, size.y * 0.42, 0);
    this.controls.enableDamping = true;
    this.controls.minDistance = this.radius * 0.2;
    this.controls.maxDistance = this.radius * 8;
    this.controls.addEventListener("start", () => { this.turned = true; });

    // The page scrolls under the wheel; Ctrl/⌘ + wheel or a pinch zooms, as on the definition's canvas.
    host.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation(); }, { capture: true });

    const resize = () => {
      const w = host.clientWidth, h = host.clientHeight;
      if (!w || !h) return;
      this.renderer.setSize(w, h, false);
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      if (!this.turned) this.fit();
      this.dirty = true;
    };
    new ResizeObserver(resize).observe(host);
    resize();

    this.visible = true;
    new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; }).observe(host);
    // Drawn only when something moved: the camera, an input, or a mode swinging.
    const loop = () => {
      requestAnimationFrame(loop);
      if (!this.visible) return;
      const turned = this.controls.update();
      if (this.view === "mode") this.pose(Math.sin(this.clock.getElapsedTime() * 2.4));
      else if (!turned && !this.dirty) return;
      this.dirty = false;
      this.renderer.render(this.scene, this.camera);
      this.placeTag();
    };
    loop();
  }

  // The biggest design in view, from the front and a little to the left and above, at any page
  // width: the camera backs off until every corner of its box is inside the picture.
  fit() {
    const s = this.extent, t = this.controls.target;
    // A tall structure is seen from lower down than a long one.
    const from = new THREE.Vector3(-0.42, s.y > s.x ? 0.18 : 0.34, 1).normalize();
    const right = new THREE.Vector3(0, 1, 0).cross(from).normalize();
    const up = from.clone().cross(right);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov) / 2);
    const tanH = tanV * this.camera.aspect;
    let distance = 0;
    for (const x of [-s.x / 2, s.x / 2]) for (const y of [-0.12 * s.y, s.y]) for (const z of [-s.z / 2, s.z / 2]) {
      const c = new THREE.Vector3(x, y, z).sub(t);
      const toward = c.dot(from);
      distance = Math.max(distance, toward + Math.abs(c.dot(right)) / tanH, toward + Math.abs(c.dot(up)) / tanV);
    }
    this.camera.position.copy(t).addScaledVector(from, distance * 1.06);
    this.controls.update();
  }

  capOf(outline) {
    const pts = this.closed(outline).map(([x, y]) => new THREE.Vector2(x, y));
    return pts.length >= 3 ? THREE.ShapeUtils.triangulateShape(pts, []).flat() : [];
  }

  closed(outline) {
    const n = outline.length;
    const same = n > 2 && Math.hypot(outline[0][0] - outline[n - 1][0], outline[0][1] - outline[n - 1][1]) < 1e-9;
    return same ? outline.slice(0, -1) : outline;
  }

  keyOf(which) {
    return which.map((i) => String(i)).join("-");
  }

  runAt(pick) {
    return this.data.runs[this.keyOf(pick)];
  }

  // ---- What the inputs pick.
  update() {
    const d = this.data;
    // A load or a step changes the results only; the other inputs pick the design.
    const designPick = this.pick.filter((_, i) => !d.inputs[i].load);
    const design = d.designs[this.keyOf(designPick)];
    this.run = this.runAt(this.pick);

    d.inputs.forEach((input, i) => {
      this.inputRows[i].set();
      this.inputRows[i].value.textContent = String(input.values[this.pick[i]]);
    });
    this.viewButtons.forEach(([id, b]) => b.setAttribute("aria-pressed", String(id === this.view)));

    // One scale for every run, so a heavier load or a shallower truss is seen to move more: the most
    // any run moves drawn at 60% of the height of the biggest design, rounded down the ladder.
    if (this.scale == null) {
      let most = 0;
      for (const run of Object.values(d.runs)) for (const v of run.d || []) most = Math.max(most, Math.abs(v));
      const want = (Math.max(this.extent.y, this.extent.x * 0.15) * 0.6) / ((most * this.units.d) || 1);
      this.scale = [...LADDER].reverse().find((s) => s <= want) || 1;
      const at = LADDER.indexOf(this.scale);
      this.scales = [...new Set([1, ...LADDER.slice(Math.max(0, at - 2), at + 2)])];
    }

    // The beams' sections, from the run when they change from run to run.
    const sections = this.run?.s ? this.run.s.join(",") : "";
    if (design !== this.design || sections !== this.sectionsKey) {
      this.design = design;
      this.sectionsKey = sections;
      this.buildStructure();
    }
    this.showScaleBox();
    if (this.design && this.run) {
      this.buildArrows();
      this.buildHinges();
      if (this.data.topology) this.buildTopology();
      this.pose(this.view === "mode" ? Math.sin(this.clock.getElapsedTime() * 2.4) : 1);
    }
    this.showResults();
    this.showLegend();
    this.showChart();
    this.dirty = true;
  }

  showScaleBox() {
    const box = this.scaleBox;
    box.innerHTML = "";
    if (this.view === "mode") {
      const modes = this.design?.modes || [];
      if (modes.length < 2) { box.hidden = true; return; }
      box.hidden = false;
      box.append(el("span", "", "Mode"));
      modes.forEach((m, k) => {
        const b = el("button", "try-mini", String(k + 1));
        b.type = "button";
        b.setAttribute("aria-pressed", String(k === this.mode));
        b.title = `${fmt(m.f, 2)} Hz`;
        b.addEventListener("click", () => { this.mode = k; this.update(); });
        box.append(b);
      });
      return;
    }
    if (!this.run?.d) { box.hidden = true; return; }
    box.hidden = false;
    box.append(el("span", "", "Deformation ×"));
    for (const s of this.scales) {
      const b = el("button", "try-mini", String(s));
      b.type = "button";
      b.setAttribute("aria-pressed", String(s === this.scale));
      b.addEventListener("click", () => { this.scale = s; this.update(); });
      box.append(b);
    }
  }

  // ---- The structure: built once per design, then moved and coloured in place.
  buildStructure() {
    for (const child of [...this.group.children]) {
      this.group.remove(child);
      child.traverse?.((o) => o.geometry?.dispose());
    }
    this.arrowGroup = null;
    const design = this.design;
    if (!design) return;
    const box = new THREE.Box3();
    design.nodes.forEach((p) => box.expandByPoint(new THREE.Vector3(p[0], p[1], p[2])));
    const c = box.getCenter(new THREE.Vector3()).setZ(box.min.z);
    this.centreRhino = c;
    const n = design.nodes.length;
    // Rest positions on the page: Rhino's z up becomes three's y up, the design centred on the origin.
    this.rest = new Float32Array(3 * n);
    design.nodes.forEach((p, i) => {
      this.rest[3 * i] = p[0] - c.x;
      this.rest[3 * i + 1] = p[2] - c.z;
      this.rest[3 * i + 2] = -(p[1] - c.y);
    });
    this.moved = new Float32Array(3 * n);
    this.turn = new Float32Array(3 * n);
    this.nodeColours = new Float32Array(3 * n);

    // The beams: each section's outline carried along it, in pieces when it is drawn bent. A big model - a
    // tower of a hundred storeys - draws each as its section's box, or, bigger still, as a line.
    const sectionOf = (b, k) => (this.run?.s ? this.run.s[k] : b[2]);
    const bends = !!this.run?.rot;
    this.lod = design.beams.length > 6000 ? "lines" : design.beams.length > 2500 ? "boxes" : "full";
    const boxOf = (outline) => {
      const xs = outline.map((p) => p[0]), ys = outline.map((p) => p[1]);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      return [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
    };
    let verts = 0;
    const toPage = (v) => [v[0], v[2], -v[1]];
    this.plan = design.beams.map((b, k) => {
      const section = sectionOf(b, k);
      const segs = bends && !b[6] && this.lod === "full" ? SEGMENTS : 1;
      let outlines = this.data.sections[section].outlines.map((o) => this.closed(o));
      let caps = this.capsOf[section];
      if (this.lod === "lines") { outlines = []; caps = []; }
      if (this.lod === "boxes") { outlines = outlines.slice(0, 1).map(boxOf); caps = [[0, 1, 2, 0, 2, 3]]; }
      const start = verts;
      outlines.forEach((ring, m) => { verts += ring.length * 6 * segs + caps[m].length * 2; });
      return { b, segs, outlines, caps, start, ly: toPage(b[3]), lz: toPage(b[4]) };
    });
    this.positions = new Float32Array(verts * 3);
    this.colours = new Float32Array(verts * 3);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(this.colours, 3));
    this.members = new THREE.Mesh(geometry, this.material);
    this.group.add(this.members);
    this.normalsDone = false;
    if (this.lod === "lines") {
      this.linePositions = new Float32Array(design.beams.length * 6);
      this.lineColours = new Float32Array(design.beams.length * 6);
      const lines = new THREE.BufferGeometry();
      lines.setAttribute("position", new THREE.BufferAttribute(this.linePositions, 3));
      lines.setAttribute("color", new THREE.BufferAttribute(this.lineColours, 3));
      this.memberLines = new THREE.LineSegments(lines, new THREE.LineBasicMaterial({ vertexColors: true }));
      this.group.add(this.memberLines);
    } else {
      this.memberLines = null;
    }
    this.ringCentres = new Float32Array(3 * (SEGMENTS + 1));
    this.ringValues = new Float32Array(SEGMENTS + 1);

    // Shells and the outside of the solids: one mesh on the nodes, its element edges in light grey.
    const faces = [...(design.shells || []), ...(design.faces || [])];
    this.surface = null;
    if (faces.length) {
      const triangles = [];
      const edges = new Set();
      const lines = [];
      for (const f of faces) {
        triangles.push(f[0], f[1], f[2]);
        if (f.length === 4) triangles.push(f[0], f[2], f[3]);
        for (let k = 0; k < f.length; k++) {
          const a = f[k], b = f[(k + 1) % f.length];
          const key = a < b ? a * 1e7 + b : b * 1e7 + a;
          if (!edges.has(key)) { edges.add(key); lines.push(a, b); }
        }
      }
      this.nodePositions = new THREE.BufferAttribute(new Float32Array(3 * n), 3);
      this.nodeColourAttribute = new THREE.BufferAttribute(this.nodeColours, 3);
      const mesh = new THREE.BufferGeometry();
      mesh.setAttribute("position", this.nodePositions);
      mesh.setAttribute("color", this.nodeColourAttribute);
      mesh.setIndex(triangles);
      this.surface = new THREE.Mesh(mesh, this.surfaceMaterial);
      this.group.add(this.surface);
      const edgeGeometry = new THREE.BufferGeometry();
      edgeGeometry.setAttribute("position", this.nodePositions);
      edgeGeometry.setIndex(lines);
      this.edges = new THREE.LineSegments(edgeGeometry, this.edgeMaterial);
      this.group.add(this.edges);
    }

    // The beams as they were, under the moved ones.
    const ghost = new THREE.BufferGeometry();
    const at = [];
    for (const b of design.beams) for (const i of [b[0], b[1]]) at.push(this.rest[3 * i], this.rest[3 * i + 1], this.rest[3 * i + 2]);
    ghost.setAttribute("position", new THREE.Float32BufferAttribute(at, 3));
    this.ghost = new THREE.LineSegments(ghost, this.ghostMaterial);
    this.group.add(this.ghost);

    // The supports: a block where it is built in, else a pyramid, on a roller where it slides.
    this.symbol = Math.max(Math.min(this.extent.y, this.extent.x, Math.max(this.extent.z, 0.5)) * 0.06, this.radius * 0.012);
    const size = this.symbol;
    // A whole edge held - a plate's, a shell's - is drawn as a row of dots, not a wall of pyramids.
    if (design.supports.length > 40) {
      const dots = new THREE.InstancedMesh(new THREE.SphereGeometry(size * 0.18, 8, 6), this.inkMaterial, design.supports.length);
      const matrix = new THREE.Matrix4();
      design.supports.forEach(([node], k) => dots.setMatrixAt(k, matrix.makeTranslation(this.rest[3 * node], this.rest[3 * node + 1], this.rest[3 * node + 2])));
      this.group.add(dots);
      return;
    }
    const cone = new THREE.ConeGeometry(size * 0.6, size, 4);
    const roller = new THREE.CylinderGeometry(size * 0.18, size * 0.18, size * 0.9, 12);
    const block = new THREE.BoxGeometry(size * 0.5, size * 1.6, size * 1.6);
    for (const [node, fix] of design.supports.slice(0, 400)) {
      const p = new THREE.Vector3(this.rest[3 * node], this.rest[3 * node + 1], this.rest[3 * node + 2]);
      if (fix.every(Boolean) && design.supports.length <= 4) {
        // A wall the beam comes out of, on the side away from the structure.
        const wall = new THREE.Mesh(block, this.inkMaterial);
        const away = p.x <= 0 ? -1 : 1;
        wall.position.set(p.x + away * size * 0.25, p.y, p.z);
        this.group.add(wall);
        continue;
      }
      const pyramid = new THREE.Mesh(cone, this.inkMaterial);
      pyramid.position.set(p.x, p.y - size * 0.62, p.z);
      pyramid.rotation.y = Math.PI / 4;
      this.group.add(pyramid);
      if (!fix[0] || !fix[1]) {
        const r = new THREE.Mesh(roller, this.inkMaterial);
        r.rotation.x = Math.PI / 2;
        if (!fix[1] && fix[0]) r.rotation.z = Math.PI / 2;
        r.position.set(p.x, p.y - size * 1.3, p.z);
        this.group.add(r);
      }
    }
  }

  // A load drawn on the beams it is on: arrows as long as the load is large, pointing its way.
  buildArrows() {
    if (this.arrowGroup) {
      this.group.remove(this.arrowGroup);
      this.arrowGroup.traverse((o) => o.geometry?.dispose());
    }
    this.arrowGroup = new THREE.Group();
    this.group.add(this.arrowGroup);
    this.arrows = [];
    const design = this.design;
    const size = this.symbol;
    const arrowAt = (node, force, most) => {
      const magnitude = Math.hypot(...force);
      if (!magnitude) return;
      const pageDir = new THREE.Vector3(force[0], force[2], -force[1]).normalize();
      const length = size * (1.2 + 2.8 * magnitude / most);
      const arrow = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(size * 0.07, size * 0.07, length - size * 0.75, 6), this.loadMaterial);
      shaft.position.y = size * 0.75 + (length - size * 0.75) / 2;
      const head = new THREE.Mesh(new THREE.ConeGeometry(size * 0.24, size * 0.6, 10), this.loadMaterial);
      head.rotation.x = Math.PI;
      head.position.y = size * 0.5;
      arrow.add(shaft, head);
      arrow.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), pageDir);
      this.arrowGroup.add(arrow);
      this.arrows.push({ arrow, a: node, e: node, t: 0 });
    };
    // Point loads, from the run: each where it acts, as long as it is large against the largest of all.
    if (this.run.p) {
      if (this.pointMost == null) {
        this.pointMost = 0;
        for (const run of Object.values(this.data.runs)) for (const p of run.p || []) this.pointMost = Math.max(this.pointMost, Math.hypot(p[1], p[2], p[3]));
      }
      for (const p of this.run.p) arrowAt(p[0], [p[1], p[2], p[3]], this.pointMost || 1);
    }
    this.data.inputs.forEach((input, i) => {
      const spec = typeof input.arrows === "string" ? { groups: [input.arrows] } : input.arrows;
      if (!spec) return;
      const value = input.values[this.pick[i]];
      const top = Math.max(...input.values.map(Math.abs)) || 1;
      if (!value) return;
      const groups = spec.groups.map((g) => this.data.groups.indexOf(g));
      const dir = spec.dir || [0, 0, -1];
      const pageDir = new THREE.Vector3(dir[0], dir[2], -dir[1]).normalize();
      const turn = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, -1, 0), pageDir);
      const length = size * (1.2 + 2.8 * Math.abs(value) / top);
      const spacing = Math.max(1.6, this.radius / 18);
      const shaftGeometry = new THREE.CylinderGeometry(size * 0.06, size * 0.06, length - size * 0.75, 6);
      const headGeometry = new THREE.ConeGeometry(size * 0.2, size * 0.55, 10);
      for (const b of design.beams) {
        if (!groups.includes(b[5])) continue;
        const a = b[0], e = b[1];
        if (spec.side) {
          const [axis, sign] = spec.side;
          const centre = axis === 0 ? this.centreRhino.x : axis === 1 ? this.centreRhino.y : 0;
          const mid = (design.nodes[a][axis] + design.nodes[e][axis]) / 2 - centre;
          if (mid * sign < -1e-6) continue;
        }
        const length3 = Math.hypot(...[0, 1, 2].map((k) => design.nodes[a][k] - design.nodes[e][k]));
        const count = Math.max(1, Math.round(length3 / spacing));
        const ts = spec.at || Array.from({ length: count }, (_, k) => (k + 0.5) / count);
        for (const t of ts) {
          const arrow = new THREE.Group();
          const shaft = new THREE.Mesh(shaftGeometry, this.loadMaterial);
          shaft.position.y = size * 0.75 + (length - size * 0.75) / 2;
          const head = new THREE.Mesh(headGeometry, this.loadMaterial);
          head.rotation.x = Math.PI;
          head.position.y = size * 0.475;
          arrow.add(shaft, head);
          arrow.quaternion.copy(turn);
          this.arrowGroup.add(arrow);
          this.arrows.push({ arrow, a, e, t });
        }
      }
    });
  }

  // A topology design: the bricks at half density or more, drawn by the faces no other kept brick shares,
  // coloured by density, with their element edges.
  buildTopology() {
    for (const old of [this.kept, this.keptEdges]) {
      if (old) { this.group.remove(old); old.geometry.dispose(); }
    }
    const k = this.run.k, design = this.design, R = this.rest;
    const FACES = [[0, 3, 2, 1], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]];
    // A digit is a density in tenths ("a" is 1); a letter, a Multi-Material design's material ("A" the first).
    const density = (i) => (k[i] === "a" ? 1 : k[i] >= "A" && k[i] <= "Z" ? 1 : Number(k[i]) / 10);
    const material = (i) => (k[i] >= "A" && k[i] <= "Z" ? k.charCodeAt(i) - 65 : -1);
    const seen = new Map();
    design.bricks.forEach((b, i) => {
      const d = density(i);
      if (d < 0.5) return;
      for (const f of FACES) {
        const face = f.map((j) => b[j]);
        const key = [...face].sort((x, y) => x - y).join(",");
        seen.set(key, seen.has(key) ? null : { face, d, m: material(i) });
      }
    });
    const pos = [], col = [], lines = [];
    const colour = new THREE.Color();
    for (const item of seen.values()) {
      if (!item) continue;
      if (item.m >= 0) colour.set(MATERIAL_COLOURS[item.m % MATERIAL_COLOURS.length]);
      else ramp([[0, "#c9d6ec"], [1, C.blue]], (item.d - 0.5) / 0.5, colour);
      const [a, b, c, e] = item.face;
      for (const v of [a, b, c, a, c, e]) {
        pos.push(R[3 * v], R[3 * v + 1], R[3 * v + 2]);
        col.push(colour.r, colour.g, colour.b);
      }
      for (const [p, q] of [[a, b], [b, c], [c, e], [e, a]]) lines.push(R[3 * p], R[3 * p + 1], R[3 * p + 2], R[3 * q], R[3 * q + 1], R[3 * q + 2]);
    }
    const mesh = new THREE.BufferGeometry();
    mesh.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    mesh.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    mesh.computeVertexNormals();
    this.kept = new THREE.Mesh(mesh, this.surfaceMaterial);
    const edges = new THREE.BufferGeometry();
    edges.setAttribute("position", new THREE.Float32BufferAttribute(lines, 3));
    this.keptEdges = new THREE.LineSegments(edges, this.edgeMaterial);
    this.group.add(this.kept, this.keptEdges);
    this.dirty = true;
  }

  buildHinges() {
    if (this.hinges) {
      this.group.remove(this.hinges);
      this.hinges.dispose();
      this.hinges = null;
    }
    const h = this.run.h;
    if (!h?.length) return;
    const ball = this.hingeBall || (this.hingeBall = new THREE.SphereGeometry(1, 16, 12));
    const material = this.hingeMaterial || (this.hingeMaterial = new THREE.MeshStandardMaterial({ roughness: 0.5 }));
    this.hinges = new THREE.InstancedMesh(ball, material, h.length);
    this.hingeRadius = this.symbol * 0.55;
    const colour = new THREE.Color();
    h.forEach(([, , band], k) => this.hinges.setColorAt(k, colour.set(HINGE_COLOURS[band])));
    this.hinges.instanceColor.needsUpdate = true;
    this.group.add(this.hinges);
  }

  // What the current view colours by at node i, from 0 to 1 (past 1: over a field's limit).
  nodeValue(i) {
    if (this.view === "field" && this.run.v) {
      const f = this.data.field;
      const v = this.run.v[i] * this.units.v;
      return f.limit ? v / f.limit : (this.fieldMost ? v / this.fieldMost : 0);
    }
    const m = this.moved;
    const len = Math.hypot(m[3 * i], m[3 * i + 1], m[3 * i + 2]);
    return this.mostDrawn ? len / this.mostDrawn : 0;
  }

  colourFor(t, out) {
    if (this.view === "field") {
      const f = this.data.field;
      if (f.limit && t > 1) return out.set(C.red);
      return ramp(f.stops || CONTOUR_STOPS, t, out);
    }
    return ramp(CONTOUR_STOPS, t, out);
  }

  // Where everything is drawn: rest + how far it moves, times the scale. f swings a mode to and fro.
  pose(f) {
    const design = this.design, run = this.run;
    if (!design || !run) return;
    const mode = this.view === "mode";
    const n = design.nodes.length;
    // A model solved for its modes only has no displacements: drawn at rest, coloured by its field.
    const field = mode ? design.modes[Math.min(this.mode, design.modes.length - 1)].d : (run.d || new Int32Array(3 * n));
    const k = mode ? (0.08 * this.extent.length() * f) / 1000 : this.scale * this.units.d;
    const m = this.moved;
    let most = 0;
    for (let i = 0; i < n; i++) {
      m[3 * i] = k * field[3 * i];
      m[3 * i + 1] = k * field[3 * i + 2];
      m[3 * i + 2] = -k * field[3 * i + 1];
      most = Math.max(most, Math.hypot(m[3 * i], m[3 * i + 1], m[3 * i + 2]));
    }
    // A mode is coloured by its own swing, not by where the swing has got to.
    if (mode) {
      this.swing = field;
      this.swingMost = 0;
      for (let i = 0; i < n; i++) this.swingMost = Math.max(this.swingMost, Math.hypot(field[3 * i], field[3 * i + 1], field[3 * i + 2]));
      this.swingMost = this.swingMost || 1;
    } else {
      this.mostDrawn = most;
      this.swing = null;
    }
    if (this.view === "field" && run.v) {
      this.fieldMost = 0;
      for (const v of run.v) this.fieldMost = Math.max(this.fieldMost, v * this.units.v);
    }
    const rot = !mode && run.rot ? run.rot : null;
    const t = this.turn;
    if (rot) {
      const kr = this.scale * this.units.rot;
      for (let i = 0; i < n; i++) {
        t[3 * i] = kr * rot[3 * i];
        t[3 * i + 1] = kr * rot[3 * i + 2];
        t[3 * i + 2] = -kr * rot[3 * i + 1];
      }
    }
    const value = (i) => (this.swing
      ? Math.hypot(this.swing[3 * i], this.swing[3 * i + 1], this.swing[3 * i + 2]) / this.swingMost
      : this.nodeValue(i));
    const colour = new THREE.Color();

    // The beams.
    const P = this.positions, Cc = this.colours, R = this.rest;
    const centres = this.ringCentres, values = this.ringValues;
    for (const [index, plan] of this.plan.entries()) {
      const { b, segs, outlines, caps, ly, lz } = plan;
      const a = b[0], e = b[1];
      const ax = R[3 * a], ay = R[3 * a + 1], az = R[3 * a + 2];
      const ex = R[3 * e] - ax, ey = R[3 * e + 1] - ay, ez = R[3 * e + 2] - az;
      const L = Math.hypot(ex, ey, ez) || 1;
      const ux = ex / L, uy = ey / L, uz = ez / L;
      const va = value(a), ve = value(e);
      for (let r = 0; r <= segs; r++) {
        const s = r / segs;
        let dx, dy, dz;
        if (segs === 1 || !rot) {
          dx = m[3 * a] + s * (m[3 * e] - m[3 * a]);
          dy = m[3 * a + 1] + s * (m[3 * e + 1] - m[3 * a + 1]);
          dz = m[3 * a + 2] + s * (m[3 * e + 2] - m[3 * a + 2]);
        } else {
          // Hermite: the axial part straight, the transverse bent to the slopes the end rotations give.
          const h1 = 1 - 3 * s * s + 2 * s * s * s, h2 = s - 2 * s * s + s * s * s;
          const h3 = 3 * s * s - 2 * s * s * s, h4 = -s * s + s * s * s;
          const axA = m[3 * a] * ux + m[3 * a + 1] * uy + m[3 * a + 2] * uz;
          const axE = m[3 * e] * ux + m[3 * e + 1] * uy + m[3 * e + 2] * uz;
          const along = axA + s * (axE - axA);
          const wAx = m[3 * a] - axA * ux, wAy = m[3 * a + 1] - axA * uy, wAz = m[3 * a + 2] - axA * uz;
          const wEx = m[3 * e] - axE * ux, wEy = m[3 * e + 1] - axE * uy, wEz = m[3 * e + 2] - axE * uz;
          // The slope at an end: its rotation × the beam's axis.
          const sAx = t[3 * a + 1] * uz - t[3 * a + 2] * uy, sAy = t[3 * a + 2] * ux - t[3 * a] * uz, sAz = t[3 * a] * uy - t[3 * a + 1] * ux;
          const sEx = t[3 * e + 1] * uz - t[3 * e + 2] * uy, sEy = t[3 * e + 2] * ux - t[3 * e] * uz, sEz = t[3 * e] * uy - t[3 * e + 1] * ux;
          dx = along * ux + h1 * wAx + h2 * L * sAx + h3 * wEx + h4 * L * sEx;
          dy = along * uy + h1 * wAy + h2 * L * sAy + h3 * wEy + h4 * L * sEy;
          dz = along * uz + h1 * wAz + h2 * L * sAz + h3 * wEz + h4 * L * sEz;
        }
        centres[3 * r] = ax + s * ex + dx;
        centres[3 * r + 1] = ay + s * ey + dy;
        centres[3 * r + 2] = az + s * ez + dz;
        values[r] = (segs === 1 || this.swing || this.view === "field")
          ? va + s * (ve - va)
          : (this.mostDrawn ? Math.hypot(dx, dy, dz) / this.mostDrawn : 0);
      }
      const util = this.view === "util" && run.u ? run.u[index] / 1000 : null;
      if (this.memberLines) {
        const L6 = this.linePositions, C6 = this.lineColours;
        for (const [end, r] of [[0, 0], [1, segs]]) {
          L6[6 * index + 3 * end] = centres[3 * r];
          L6[6 * index + 3 * end + 1] = centres[3 * r + 1];
          L6[6 * index + 3 * end + 2] = centres[3 * r + 2];
          if (util != null) utilColour(util, colour);
          else this.colourFor(values[r], colour);
          C6[6 * index + 3 * end] = colour.r; C6[6 * index + 3 * end + 1] = colour.g; C6[6 * index + 3 * end + 2] = colour.b;
        }
        continue;
      }
      let w = plan.start * 3;
      const put = (r, x, y) => {
        P[w] = centres[3 * r] + x * lz[0] + y * ly[0];
        P[w + 1] = centres[3 * r + 1] + x * lz[1] + y * ly[1];
        P[w + 2] = centres[3 * r + 2] + x * lz[2] + y * ly[2];
        if (util != null) utilColour(util, colour);
        else this.colourFor(values[r], colour);
        Cc[w] = colour.r; Cc[w + 1] = colour.g; Cc[w + 2] = colour.b;
        w += 3;
      };
      outlines.forEach((ring, o) => {
        const len = ring.length;
        for (let r = 0; r < segs; r++) {
          for (let q = 0; q < len; q++) {
            const [x0, y0] = ring[q], [x1, y1] = ring[(q + 1) % len];
            put(r, x0, y0); put(r, x1, y1); put(r + 1, x1, y1);
            put(r, x0, y0); put(r + 1, x1, y1); put(r + 1, x0, y0);
          }
        }
        const cap = caps[o];
        for (let q = cap.length - 1; q >= 0; q--) put(0, ring[cap[q]][0], ring[cap[q]][1]);
        for (let q = 0; q < cap.length; q++) put(segs, ring[cap[q]][0], ring[cap[q]][1]);
      });
    }
    this.members.geometry.attributes.position.needsUpdate = true;
    this.members.geometry.attributes.color.needsUpdate = true;
    // A big model keeps the normals it started with: the shading barely changes as it moves.
    const big = this.positions.length + 3 * n > 600000;
    if (!big || !this.normalsDone) {
      this.members.geometry.computeVertexNormals();
      this.members.geometry.computeBoundingSphere();
    }
    if (this.memberLines) {
      this.memberLines.geometry.attributes.position.needsUpdate = true;
      this.memberLines.geometry.attributes.color.needsUpdate = true;
      this.memberLines.geometry.computeBoundingSphere();
    }

    // Shells and solids.
    if (this.surface) {
      const pos = this.nodePositions.array, col = this.nodeColours;
      for (let i = 0; i < n; i++) {
        pos[3 * i] = R[3 * i] + m[3 * i];
        pos[3 * i + 1] = R[3 * i + 1] + m[3 * i + 1];
        pos[3 * i + 2] = R[3 * i + 2] + m[3 * i + 2];
        if (this.view === "util") colour.set(C.plain);
        else this.colourFor(value(i), colour);
        col[3 * i] = colour.r; col[3 * i + 1] = colour.g; col[3 * i + 2] = colour.b;
      }
      this.nodePositions.needsUpdate = true;
      this.nodeColourAttribute.needsUpdate = true;
      if (!big || !this.normalsDone) {
        this.surface.geometry.computeVertexNormals();
        this.surface.geometry.computeBoundingSphere();
        this.edges.geometry.computeBoundingSphere();
      }
    }
    this.normalsDone = true;

    this.dirty = true;
    this.ghost.visible = mode || this.scale > 1;
    for (const { arrow, a, e, t: s } of this.arrows || []) {
      arrow.position.set(
        R[3 * a] + m[3 * a] + s * (R[3 * e] + m[3 * e] - R[3 * a] - m[3 * a]),
        R[3 * a + 1] + m[3 * a + 1] + s * (R[3 * e + 1] + m[3 * e + 1] - R[3 * a + 1] - m[3 * a + 1]),
        R[3 * a + 2] + m[3 * a + 2] + s * (R[3 * e + 2] + m[3 * e + 2] - R[3 * a + 2] - m[3 * a + 2]));
      arrow.visible = !mode;
    }
    // The plastic hinges, on the beams as they have moved.
    if (this.hinges) {
      const matrix = new THREE.Matrix4();
      (run.h || []).forEach(([beam, along], k) => {
        const b = design.beams[beam];
        const x = (1 - along) * (R[3 * b[0]] + m[3 * b[0]]) + along * (R[3 * b[1]] + m[3 * b[1]]);
        const y = (1 - along) * (R[3 * b[0] + 1] + m[3 * b[0] + 1]) + along * (R[3 * b[1] + 1] + m[3 * b[1] + 1]);
        const z = (1 - along) * (R[3 * b[0] + 2] + m[3 * b[0] + 2]) + along * (R[3 * b[1] + 2] + m[3 * b[1] + 2]);
        this.hinges.setMatrixAt(k, matrix.makeScale(this.hingeRadius, this.hingeRadius, this.hingeRadius).setPosition(x, y, z));
      });
      this.hinges.instanceMatrix.needsUpdate = true;
      this.hinges.visible = !mode;
    }
    this.tagAt = null;
    if (this.view === "util" && run.worst) {
      const b = design.beams[run.worst[0]];
      this.tagAt = new THREE.Vector3(
        (R[3 * b[0]] + m[3 * b[0]] + R[3 * b[1]] + m[3 * b[1]]) / 2,
        (R[3 * b[0] + 1] + m[3 * b[0] + 1] + R[3 * b[1] + 1] + m[3 * b[1] + 1]) / 2,
        (R[3 * b[0] + 2] + m[3 * b[0] + 2] + R[3 * b[1] + 2] + m[3 * b[1] + 2]) / 2);
    }
  }

  // The most used beam, named over the model.
  placeTag() {
    if (!this.tagAt) { this.tag.hidden = true; return; }
    const v = this.tagAt.clone().project(this.camera);
    const host = this.canvasHost;
    if (v.z > 1) { this.tag.hidden = true; return; }
    this.tag.hidden = false;
    this.tag.style.transform = `translate(${((v.x + 1) / 2) * host.clientWidth}px, ${((1 - v.y) / 2) * host.clientHeight}px) translate(-50%, -100%)`;
  }

  showResults() {
    const d = this.data, run = this.run, design = this.design;
    this.results.innerHTML = "";
    this.worst.innerHTML = "";
    if (!run || !design) {
      const why = d.failed?.[this.keyOf(this.pick)];
      this.worst.innerHTML = why
        ? `<b>Did not solve:</b> ${why.replace(/</g, "&lt;")} At this setting the structure gives way, or needs a non-linear analysis to follow it.`
        : "This setting did not solve.";
      return;
    }
    d.results.forEach((r, i) => {
      const value = run.r[i];
      const box = el("div", "try-result");
      box.append(el("dt", "", r.name));
      let extra = "";
      const ratioAt = r.ratio ? d.inputs.findIndex((input) => input.name === r.ratio) : -1;
      if (ratioAt >= 0 && value) {
        extra = `<small>${r.ratio.toLowerCase()} / ${Math.round((d.inputs[ratioAt].values[this.pick[ratioAt]] * 1000) / value)}</small>`;
      }
      if (r.name === "Utilisation" && value != null) {
        const ok = value <= 1;
        extra = `<span class="try-verdict ${ok ? "ok" : "no"}">${ok ? "passes" : "fails"}</span>`;
      }
      if (r.name === "Frequency") extra = `<small>first mode</small>`;
      // A utilisation far past 1 needs no third decimal.
      const digits = r.name === "Utilisation" && value >= 10 ? 1 : r.digits;
      box.append(el("dd", "", `<b>${fmt(value, digits)}</b>${r.unit ? ` <span>${r.unit}</span>` : ""}${extra}`));
      this.results.append(box);
    });
    if (run.worst) {
      const beam = design.beams[run.worst[0]];
      const what = d.groups[beam[5]] && d.groups[beam[5]] !== "ForceBeamColumn" ? singular(d.groups[beam[5]]) : "Beam";
      const governing = GOVERNING[run.worst[1]] || run.worst[1];
      this.worst.innerHTML = `<b>Most used:</b> ${what.toLowerCase()}, at ${fmt(run.u[run.worst[0]] / 1000, 2)}${governing ? `: ${governing}` : ""}, ${d.checks || "EN 1993-1-1"}.`;
      this.tag.innerHTML = `${what} · ${fmt(run.u[run.worst[0]] / 1000, 2)}`;
    }
  }

  // A result against the step input, the whole way, with the step shown: a capacity curve, a time history.
  showChart() {
    if (!this.chart) return;
    const d = this.data, at = this.stepAt;
    const yAt = d.results.findIndex((r) => r.chart);
    const spec = d.results[yAt].chart;
    const xAt = typeof spec === "object" && spec.x ? d.results.findIndex((r) => r.name === spec.x) : -1;
    const points = d.inputs[at].values.map((v, k) => {
      const pick = [...this.pick];
      pick[at] = k;
      const run = this.runAt(pick);
      return run ? [xAt >= 0 ? run.r[xAt] : v, run.r[yAt]] : null;
    }).filter((p) => p && p[0] != null && p[1] != null);
    if (!points.length) { this.chart.innerHTML = ""; return; }
    // Drawn at the width it is shown at, so its text keeps its size.
    const W = Math.max(300, Math.round(this.chart.clientWidth - 22) || 520), H = 160, pad = { l: 52, r: 14, t: 12, b: 32 };
    const xs = points.map((p) => p[0]), ys = points.map((p) => p[1]);
    const x0 = Math.min(0, ...xs), x1 = Math.max(...xs), y0 = Math.min(0, ...ys), y1 = Math.max(...ys);
    const X = (v) => pad.l + ((v - x0) / (x1 - x0 || 1)) * (W - pad.l - pad.r);
    const Y = (v) => H - pad.b - ((v - y0) / (y1 - y0 || 1)) * (H - pad.t - pad.b);
    const path = points.map((p, k) => `${k ? "L" : "M"}${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join("");
    const run = this.run;
    const now = run ? [xAt >= 0 ? run.r[xAt] : d.inputs[at].values[this.pick[at]], run.r[yAt]] : null;
    const label = (thing) => `${thing.name}${thing.unit ? ` [${thing.unit}]` : ""}`;
    const xName = label(xAt >= 0 ? d.results[xAt] : d.inputs[at]);
    const yName = label(d.results[yAt]);
    const tick = (v) => (v === 0 ? "0" : Math.abs(v) >= 100 ? v.toFixed(0) : Math.abs(v) >= 1 ? v.toFixed(1) : v.toFixed(2));
    this.chart.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${yName} against ${xName}">
      <line x1="${pad.l}" y1="${Y(0)}" x2="${W - pad.r}" y2="${Y(0)}" class="axis"/>
      <line x1="${X(x0)}" y1="${pad.t}" x2="${X(x0)}" y2="${H - pad.b}" class="axis"/>
      <text x="${pad.l - 6}" y="${Y(y1) + 4}" text-anchor="end">${tick(y1)}</text>
      <text x="${pad.l - 6}" y="${Y(y0) + 4}" text-anchor="end">${tick(y0)}</text>
      <text x="${W - pad.r}" y="${H - 8}" text-anchor="end">${tick(x1)}</text>
      <text x="${X(x0)}" y="${H - 8}">${tick(x0)}</text>
      <text x="${(W + pad.l) / 2}" y="${H - 8}" text-anchor="middle" class="name">${xName}</text>
      <text x="12" y="${(H - pad.b + pad.t) / 2}" transform="rotate(-90 12 ${(H - pad.b + pad.t) / 2})" text-anchor="middle" class="name">${yName}</text>
      <path d="${path}" class="curve"/>
      ${now && now[0] != null && now[1] != null ? `<circle cx="${X(now[0])}" cy="${Y(now[1])}" r="5" class="now"/>` : ""}
    </svg>`;
  }

  showLegend() {
    this.showMainLegend();
    // The hinges' colours, under whatever the members are coloured by.
    if (this.run?.h && this.view !== "mode") {
      const reached = new Set(this.run.h.map((h) => h[2]));
      this.legend.insertAdjacentHTML("beforeend", `<span class="try-legend-hinges"><span>Hinges</span>${HINGE_NAMES
        .map((name, k) => `<span class="${reached.has(k) ? "" : "dim"}"><i style="background:${HINGE_COLOURS[k]}"></i>${name}</span>`).join("")}</span>`);
    }
  }

  showMainLegend() {
    const run = this.run;
    if (!run || !this.design) { this.legend.innerHTML = ""; return; }
    if (this.view === "util") {
      this.legend.innerHTML =
        `<span class="try-legend-title">Utilisation, ${this.data.checks || "EN 1993-1-1"}</span>` +
        `<span class="try-legend-bar"><i style="background:${cssGradient(UTIL_STOPS)}"></i><i class="past" style="background:${C.red}"></i></span>` +
        `<span class="try-legend-ticks"><span>0</span><span>0.5</span><span>1</span><span>&gt;1</span></span>`;
    } else if (this.view === "density" && /[A-Z]/.test(run.k || "")) {
      const used = new Set(run.k.replace(/[^A-Z]/g, ""));
      this.legend.innerHTML = `<span class="try-legend-title">Materials, the bricks kept</span><span class="try-legend-hinges">${
        (this.data.materials || []).map((name, m) => used.has(String.fromCharCode(65 + m))
          ? `<span><i style="background:${MATERIAL_COLOURS[m % MATERIAL_COLOURS.length]}"></i>${name}</span>` : "").join("")}</span>`;
    } else if (this.view === "density") {
      this.legend.innerHTML =
        `<span class="try-legend-title">Density, the bricks kept</span>` +
        `<span class="try-legend-bar"><i style="background:${cssGradient([[0, "#c9d6ec"], [1, C.blue]])}"></i></span>` +
        `<span class="try-legend-ticks"><span>0.5</span><span>0.75</span><span>1</span></span>`;
    } else if (this.view === "field") {
      const f = this.data.field;
      const top = f.limit || this.fieldMost || 0;
      const digits = f.digits ?? 1;
      this.legend.innerHTML =
        `<span class="try-legend-title">${f.name}${f.unit ? `, ${f.unit}` : ""}</span>` +
        `<span class="try-legend-bar"><i style="background:${cssGradient(f.stops || CONTOUR_STOPS)}"></i>${f.limit ? `<i class="past" style="background:${C.red}"></i>` : ""}</span>` +
        `<span class="try-legend-ticks"><span>0</span><span>${fmt(top / 2, digits)}</span><span>${fmt(top, digits)}</span>${f.limit ? "<span>&gt;</span>" : ""}</span>`;
    } else if (this.view === "disp") {
      const mm = (this.mostDrawn / this.scale) * 1000;
      this.legend.innerHTML =
        `<span class="try-legend-title">Displacement, mm</span>` +
        `<span class="try-legend-bar"><i style="background:${cssGradient(CONTOUR_STOPS)}"></i></span>` +
        `<span class="try-legend-ticks"><span>0</span><span>${fmt(mm / 2, mm < 1 ? 2 : 1)}</span><span>${fmt(mm, mm < 1 ? 2 : 1)}</span></span>`;
    } else {
      const m = this.design.modes[Math.min(this.mode, this.design.modes.length - 1)];
      this.legend.innerHTML =
        `<span class="try-legend-title">Mode ${this.mode + 1}, ${fmt(m.f, 2)} Hz</span>` +
        `<span class="try-legend-bar"><i style="background:${cssGradient(CONTOUR_STOPS)}"></i></span>` +
        `<span class="try-legend-ticks"><span>still</span><span>moves most</span></span>`;
    }
  }
}

async function start(root) {
  try {
    const response = await fetch(root.dataset.src);
    if (!response.ok) throw new Error(response.status);
    new TryIt(root, await response.json());
  } catch (error) {
    root.classList.add("failed");
    root.textContent = "The model could not be loaded here. The .gh above runs it in Grasshopper.";
    console.error(error);
  }
}

// Every viewer on the page not started yet. The docs call it again after each page they change to.
export function startAll() {
  document.querySelectorAll(".try[data-src]:not([data-started])").forEach((root) => {
    root.dataset.started = "";
    // Loaded once the reader comes near it: the JSON and WebGL are the page's heaviest parts.
    const seen = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      seen.disconnect();
      start(root);
    }, { rootMargin: "400px" });
    seen.observe(root);
  });
}
window.alpacaTryIt = startAll;
startAll();
