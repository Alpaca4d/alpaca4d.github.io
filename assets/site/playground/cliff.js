// Area 2, the Cliff: the Playground's second lesson. The River's plank, built into the cliff and
// sticking out 4 m over the drop: a cantilever balcony, with the alpaca at its tip. In five rounds
// the player builds its definition - the balcony, the support, the alpaca, the wires into Assemble
// Model, and the analysis read with Nodal Displacements - and finds it bends 16 times as much as
// the same plank on two supports.
//
// The definition is cliff.gh, written by Alpaca4d's Tools/Examples/PlaygroundCliff.py. The numbers
// are Alpaca4d's: metres and kN, C24 (E = 10 500 MPa), and 390 mm at the tip, which OpenSees gives
// too (390.15, the beam's shear adding 0.05). The panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 4;                          // m from the Root to the Tip
const LOAD = 0.6;                        // kN: the alpaca, 60 kg
const E_TIMBER = 10.5e6;                 // kN/m²
const PLANK = { w: 0.3, h: 0.05 };
const EI = (E_TIMBER * PLANK.w * PLANK.h ** 3) / 12;
const HAND = ((LOAD * SPAN ** 3) / (3 * EI)) * 1000;          // mm, at the tip
const RIVER = ((LOAD * SPAN ** 3) / (48 * EI)) * 1000;        // mm, the River's plank in the middle
const TIMBER = "#d7a865", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c", STONE = "#b9b2a2";

const ready = loadDefinition(new URL("./cliff-definition.json", import.meta.url));
const GH_FILE = new URL("./cliff.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Balcony", title: "The balcony",
    task: `The River's plank, built into the cliff, will stick out 4${NB}m over the drop: a balcony held at one end only, a cantilever. Its section and its beam are the River's. Draw its line from the Root, at the cliff's edge, out over the drop.`,
    tip: "The arrows at the Root show which way X, Y and Z point. Follow the Span slider's wire, and read its value.",
    options: [
      { key: "right", says: "Span 4 wired into Tip's X.",
        title: "Out over the drop.", body: `The Tip is 4${NB}m along X from the Root, so the balcony sticks out over the drop. ForceBeamColumn makes one element of the line, and its two ends, the Root and the Tip, are its nodes: the alpaca will stand on the Tip's.`,
        react: (s) => { s.balcony("x"); s.play(s.wait(0.4), s.walkTo(s.ROOT - 0.6), s.hop()); } },
      { key: "edge", says: "Span 4 wired into Tip's Y.",
        patch: (a) => { a.wire("Tip", "X"); a.wire("Tip", "Y", a.src("Span")); },
        title: "That runs along the edge.", body: `Span goes into Y, so the Tip is 4${NB}m along Y: the plank lies on the cliff top, beside the drop, not over it. Out over the drop is X.`,
        react: (s) => { s.balcony("y"); s.tag("Along Y: beside the drop", () => s.at(s.ROOT, 1.4, -s.LEN / 2), "wrong"); s.play(s.wait(0.5), s.lookUp()); } },
      { key: "back", says: "Span minus 4 wired into Tip's X.",
        patch: (a) => a.slider("Span", -4),
        title: "That runs back over the cliff top.", body: `Span is −4, so the Tip is 4${NB}m behind the Root, along −X: the plank lies on the ground, away from the drop. A sign is a direction: +4 goes out over it.`,
        react: (s) => { s.balcony("back"); s.tag("Along −X: back over the cliff top", () => s.at(s.ROOT - s.LEN / 2, 1.4, 0), "wrong"); s.play(s.wait(0.4), s.hop()); } },
    ],
  },
  {
    name: "Support", title: "The support",
    task: "Build the Root into the cliff. Held at one end only, the balcony must neither move nor turn there: nothing else holds it.",
    tip: "A Support holds every direction left empty: True. Tx, Ty and Tz move along X, Y and Z; Rx, Ry and Rz turn about them. Position says where it stands.",
    options: [
      { key: "right", says: "A Support at the Root, with nothing wired into Tx to Rz.",
        title: "Built in.", body: "Nothing is wired into Tx to Rz, so the Support holds all six: the Root can neither move along X, Y or Z, nor turn about them. That is a fixed support, and a cantilever needs one: with a single support, it has to hold the turning too.",
        react: (s) => { s.support("fixed"); s.play(s.wait(0.4), s.walkTo(s.TIP - 0.5), s.hop()); s.tag("Built in: it holds all six", () => s.at(s.ROOT, 1.6, 1.2), "right"); } },
      { key: "pin", says: "A Support at the Root, with a toggle Free, False, wired into its Ry and Rz, as the River's pin.",
        patch: (a) => {
          const sup = a.get("Support");
          a.add({ kind: "toggle", id: "free", type: "2e78987b-9dfb-42a2-8b76-3923ac8bd91a", name: "Boolean Toggle", nick: "Free", desc: "Boolean (true/false) toggle", box: [sup.box[0] - 130, sup.box[1] + 100, 77, 22], src: [], value: false });
          a.wire("Support", "Ry", "free");
          a.wire("Support", "Rz", "free");
        },
        title: "It swings down.", body: "The River's pin lets the plank turn about Y, and here nothing else holds it: the balcony swings down about the Root. The model is a mechanism, and Run Analysis stops with “Analysis Failed: OpenSees 'analyze' did not converge”. A plank on two blocks can rest on a pin; a cantilever cannot.",
        react: (s) => { s.support("pin"); s.plankAnim("swing"); s.tag("Free about Y: nothing stops it turning", () => s.at(s.ROOT, 1.8, 1.2), "wrong"); s.play(s.wait(1.6), s.lookUp()); } },
      { key: "tip", says: "A Support at the Tip, with nothing wired into Tx to Rz.",
        patch: (a) => a.wire("Support", "Position", a.src("Tip", "Pt")),
        title: "Held in thin air.", body: "The Support stands at the Tip, so the model holds the balcony at its far end, in mid-air, and leaves the Root free. Alpaca4d solves it without a word: a support holds wherever you put it, even where there is nothing to hold on to. Check where each support stands.",
        react: (s) => { s.support("tip"); s.play(s.wait(0.4), s.walkTo(s.TIP - 0.5), s.lookUp()); s.tag("Held at the Tip, in thin air", () => s.at(s.TIP, 2.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Alpaca", title: "The alpaca",
    task: `The alpaca, 0.6${NB}kN, walks out to the end of the balcony for the view. Put its weight on the Tip, as a Point Load in a Load Pattern.`,
    tip: "End Points gives the start of a curve, S, and its end, E. Unit Z makes a vector along Z as long as its F. A Point Load takes a Force, in kN, and a Moment, in kNm.",
    options: [
      { key: "right", says: "Alpaca minus 0.60 into Unit Z, Unit Z into Force, and End Points' E into Point.",
        title: "At the tip.", body: `End Points' E is the end of the line, the Tip, 4${NB}m out: a node, so the load lands on it. Unit Z turns −0.6 into a vector 0.6${NB}kN long pointing down.`,
        react: (s) => { s.load({ at: SPAN, P: LOAD }); s.play(s.wait(0.4), s.walkTo(s.TIP - 0.5), s.hop()); } },
      { key: "start", says: "Alpaca minus 0.60 into Unit Z, Unit Z into Force, and End Points' S into Point.",
        patch: (a) => a.wire("The alpaca", "Point", a.src("Ends", "S")),
        title: "That's on the support.", body: `S is the start of the line: the Root, where the Support is. A load on a support goes straight into it and bends nothing, so the tip moves 0${NB}mm. The alpaca stands where the view is, at E.`,
        react: (s) => { s.load({ at: 0, P: LOAD }); s.play(s.wait(0.4), s.walkTo(s.ROOT + 0.3)); s.tag("On the support: nothing bends", () => s.at(s.ROOT, 3.4, 1.4), "wrong"); } },
      { key: "moment", says: "Alpaca minus 0.60 into Unit Z, Unit Z into Moment, nothing into Force, and End Points' E into Point.",
        patch: (a) => { a.wire("The alpaca", "Force"); a.wire("The alpaca", "Moment", a.src("Weight", "V")); },
        title: "A weight is a force.", body: "The vector goes into Moment, and Force is left empty. Point Load cannot make a load without a Force: it turns orange with “Input parameter Force failed to collect data” and gives nothing out. A Moment turns, in kNm; a weight pushes, in kN.",
        react: (s) => { s.load(null); s.tag("Input parameter Force failed to collect data", () => s.at(s.TIP - 1.5, 2.2, 0), "wrong"); s.play(s.wait(0.4), s.lookUp()); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Wire the balcony into Assemble Model: its element, its support and the load pattern.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The three it needs, one under the other, and two that are wired in by mistake.
      offered: ["Balcony line", "Balcony", "Support", "The alpaca", "Load Pattern"],
      wants: { Elements: ["Balcony"], Supports: ["Support"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements, from ForceBeamColumn", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the balcony has none", Recorders: "recorders: leave it empty and Run Analysis picks one",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Balcony: "the beam's element", Support: "a support", "Load Pattern": "the load pattern",
        "The alpaca": "the alpaca's point load, which goes through the Load Pattern", "Balcony line": "the balcony's line, only geometry",
      },
      checks: [
        [(has) => has("Elements", "Balcony"), "Elements: the balcony's element"],
        [(has) => has("Supports", "Support"), "Supports: the support at the Root"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the balcony: drag a wire from Balcony's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the balcony.", body: `Assemble Model makes two nodes, the Root and the Tip, holds the Root with the Support, and puts the alpaca on the Tip. One element is enough: a beam's ends are its nodes, and nothing loads it in between.` },
    },
  },
  {
    name: "Run", title: "Run and read", guess: { question: "How far will the tip go down?", unit: "mm", step: "1", min: 0 },
    task: `Solve it, and read how far the tip goes down. The River's plank went down ${RIVER.toFixed(1)}${NB}mm in the middle of its 4${NB}m span; this is the same plank, the same 4${NB}m and the same alpaca, at the tip of a cantilever. First, make a guess.`,
    tip: "Nodal Displacements reads how far each node moved, in metres, in the order Assemble Model numbered them: the Root, then the Tip. Deconstruct Vector splits each into its X, Y and Z.",
    options: [
      { key: "right", says: "Run Analysis into Nodal Displacements, its Displacement into Deconstruct Vector, and Z into the panel Z in m.",
        title: `${HAND.toFixed(0)}${NB}mm.`,
        react: (s) => { s.play(s.wait(0.4), s.walkTo(s.TIP - 0.5), s.hop()); s.tag(`${HAND.toFixed(0)} mm, true to scale`, () => s.at(s.TIP - 2.8, -2.0, 1.4), "right", true); } },
      { key: "unsolved", says: "Assemble Model straight into Nodal Displacements; Run Analysis's output goes only to Model View.",
        patch: (a) => a.wire("Nodal Displacements", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")),
        title: "There is nothing to read yet.", body: "Nodal Displacements reads the results Run Analysis writes, and the model straight from Assemble Model has none: it turns orange with “The model is not analysed.” Feed it the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.tag("The model is not analysed.", () => s.at(s.TIP - 1.5, 2.2, 0), "wrong"); } },
      { key: "x", says: "Run Analysis into Nodal Displacements, its Displacement into Deconstruct Vector, and X into the panel Z in m.",
        patch: (a) => { a.get("Z in m").src = [a.src("DeVec", "X")]; },
        title: "0 and 0.", body: "X runs along the balcony, and a weight at its tip does not stretch it: both nodes move 0 along X. The tip goes down, along Z: read Z.",
        react: (s) => { s.play(s.wait(0.4), s.walkTo(s.TIP - 0.5)); s.tag("Along X: 0 and 0", () => s.at(s.TIP, 2.2, 0), "wrong"); } },
    ],
  },
];

// How far the balcony goes down at x (m from the fixed end) under loads P (kN, down) at a (m from
// the fixed end): a cantilever.
function deflection(x, loads) {
  let d = 0;
  for (const { a, P } of loads) {
    if (x <= 0 || a <= 0) continue;
    d += x <= a ? (P * x * x * (3 * a - x)) / (6 * EI) : (P * a * a * (3 * x - a)) / (6 * EI);
  }
  return d;
}

// ---- The scene: the balcony at the cliff's edge, as each round builds it ----
function scene(kit) {
  const { g, area, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
  const k = 2.4;                        // the toy world's metres per real metre
  const LEN = SPAN * k;
  const ROOT = 2.4;                     // the Root, at the cliff's edge, in the area's frame
  const TIP = ROOT + LEN;
  const top0 = 0.5;                     // the top of the stone the Root rests on
  const thick = PLANK.h * k, wide = PLANK.w * k;
  const X = (m) => ROOT + m * k;        // metres from the Root, in the area's frame
  kit.home = ROOT - 3.4;
  kit.view = { at: V(ROOT + 3.2, -1.2, 0), w: 15, h: 10 };
  kit.hideStructure();
  // The island's stone block behind the balcony: the lesson sets its own at the edge.
  const rock = area.group.children.find((o) => o.isMesh && o.geometry.parameters && o.geometry.parameters.width === 2.4 && o.geometry.parameters.height === 0.9);
  if (rock) rock.visible = false;

  const parts = { stone: new THREE.Group(), nodes: new THREE.Group(), support: new THREE.Group(), load: new THREE.Group(), gizmo: new THREE.Group() };
  Object.values(parts).forEach((p) => g.add(p));
  // The stone the Root rests on, at the cliff's edge.
  const stone = add(parts.stone, new THREE.Mesh(new THREE.BoxGeometry(1.6, 1, 2.2), solid(STONE)));
  stone.position.set(ROOT - 0.8, top0 - 0.5, 0);
  stone.receiveShadow = true;
  const stoneTop = (x) => (x > ROOT - 1.6 && x < ROOT ? top0 : -Infinity);

  const state = { dir: null, support: null, load: null };
  let plank = null;

  // The plank: along X out over the drop, segmented so that it can bend; or along Y, or back.
  function balcony(dir) {
    if (plank) { (plank.pivot || g).remove(plank.mesh); if (plank.pivot) g.remove(plank.pivot); plank.mesh.geometry.dispose(); plank = null; }
    state.dir = dir;
    if (!dir) return;
    const len = LEN + 0.6;              // and a little onto the stone, behind the Root
    const geo = new THREE.BoxGeometry(len, thick, wide, 48, 1, 1);
    const mesh = add(g, new THREE.Mesh(geo, solid(TIMBER, { roughness: 0.8, transparent: true })));
    mesh.receiveShadow = true;
    const y = top0 + thick / 2;
    if (dir === "x") mesh.position.set(ROOT - 0.6 + len / 2, y, 0);
    else if (dir === "y") { mesh.rotation.y = Math.PI / 2; mesh.position.set(ROOT - 0.3, y, -(LEN / 2 - 0.3)); }
    else mesh.position.set(ROOT - LEN / 2, y, 0);
    plank = { mesh, rest: geo.attributes.position.array.slice(), grow: reduceMotion ? 1 : 0, anim: null };
  }
  const bends = () => plank && state.dir === "x" && !plank.anim && (state.support === "fixed" || state.support === "tip");

  // The loads on the balcony now: the alpaca, when it stands on it. The model's load is drawn,
  // but the plank bends under the alpaca itself, true to scale.
  function loadsNow() {
    if (!bends() || al.y != null || Math.abs(al.z) > 0.6 || al.x < ROOT || al.x > TIP + 0.3) return [];
    return [{ a: Math.min(SPAN, (al.x - ROOT) / k), P: LOAD }];
  }
  // How far down the plank is at x of the area's frame: from whichever end the support holds.
  function sagAt(x, loads) {
    if (!bends()) return 0;
    const m = Math.max(0, Math.min(SPAN, (x - ROOT) / k));
    if (state.support === "fixed") return deflection(m, loads) * k;
    return deflection(SPAN - m, loads.map((l) => ({ a: SPAN - l.a, P: l.P }))) * k;
  }
  // Nodes, as dots on the plank: the Root and the Tip.
  function nodes(on) {
    clear(parts.nodes);
    if (!on) return;
    for (const m of [0, SPAN]) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), solid(INK));
      dot.userData.x = X(m);
      parts.nodes.add(dot);
    }
  }
  // The support's symbol: a dark clamp over the Root for one built in, a pyramid under it for a
  // pin, and a clamp at the Tip, in the air, for one put there.
  function support(kind) {
    state.support = kind;
    clear(parts.support);
    if (!kind) return;
    if (kind === "pin") {
      const p = add(parts.support, new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.6, 4), solid(ORANGE)));
      p.position.set(ROOT - 0.1, top0 + thick + 0.32, wide / 2 + 0.45);
      return;
    }
    const c = add(parts.support, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.45, wide + 0.5), solid(INK)));
    c.userData.x = kind === "fixed" ? ROOT - 0.45 : TIP - 0.45;
    c.position.set(c.userData.x, top0 + thick + 0.22, 0);
  }
  // The model's load: an arrow down onto a node, the Tip or the Root.
  function loadOf(spec) {
    state.load = spec;
    clear(parts.load);
    if (!spec) return;
    const holder = new THREE.Group();
    holder.userData.x = X(spec.at);
    arrow(holder, V(0, 2.55, 0), V(0, 0.15, 0), 0.08, solid(spec.error ? RED : ORANGE));
    parts.load.add(holder);
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    if (plank) plank.mesh.material.opacity = !has || has("Elements", "Balcony") ? 1 : 0.28;
    parts.support.visible = !has || has("Supports", "Support");
    parts.load.visible = !has || has("LoadPatterns", "Load Pattern");
  }
  // Rhino's axes at the Root, with their names.
  function gizmo(on) {
    clear(parts.gizmo);
    if (!on) return;
    const o = V(ROOT, top0 + 0.05, 1.4), len = 2.2;
    for (const [name, d, c] of [["X", V(1, 0, 0), "#e23b3b"], ["Y", V(0, 0, -1), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
      arrow(parts.gizmo, o, o.clone().addScaledVector(d, len), 0.06, solid(c));
      tag(name, () => o.clone().addScaledVector(d, len + 0.5), "axis", false, "scene");
    }
  }
  // A pin lets the balcony swing down about the Root until its tip hits the valley floor, then
  // slide off the cliff onto it.
  function plankAnim(kind) {
    if (!plank || state.dir !== "x") return;
    const pivot = new THREE.Group();
    pivot.position.set(ROOT, top0, 0);
    g.add(pivot);
    g.remove(plank.mesh);
    plank.mesh.position.x -= ROOT;
    plank.mesh.position.y -= top0;
    pivot.add(plank.mesh);
    plank.pivot = pivot;
    plank.anim = { kind, t: reduceMotion ? 10 : -0.5 };
    kit.clearTags();                     // the Root and the Tip are no longer where their names are
    parts.nodes.visible = parts.load.visible = false;
    if (reduceMotion) animate(0);
  }
  function animate(dt) {
    const a = plank.anim, p = plank.pivot;
    a.t += dt;
    const t1 = Math.max(0, Math.min(1, a.t / 0.8)), t2 = Math.max(0, Math.min(1, (a.t - 0.8) / 0.9));
    const floor = groundAt(TIP), below = groundAt(ROOT + 3.2 + LEN / 2);
    const hit = Math.asin(Math.min(1, (top0 - floor) / (LEN + 0.6)));
    p.rotation.z = -hit * t1 * t1 + hit * smooth(t2);
    p.position.x = ROOT + 3.2 * smooth(t2);
    p.position.y = mix(top0, below + 0.05, smooth(t2));
    if (t2 === 1 && !a.done) { a.done = true; kit.makeSplash(ROOT + 3.2, 0); }
  }
  // Bends the plank under the alpaca, and keeps the nodes, the clamp and the load on it.
  function bend() {
    const loads = loadsNow();
    const pos = plank.mesh.geometry.attributes.position, rest = plank.rest, cx = plank.mesh.position.x;
    for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 1] = rest[i * 3 + 1] - sagAt(rest[i * 3] + cx, loads);
    pos.needsUpdate = true;
    plank.mesh.geometry.computeVertexNormals();
    const onPlank = (x) => top0 + thick - sagAt(x, loads);
    parts.nodes.children.forEach((d) => d.position.set(d.userData.x, onPlank(d.userData.x) + 0.08, 0));
    parts.load.children.forEach((h) => h.position.set(h.userData.x, onPlank(h.userData.x), 0));
    parts.support.children.forEach((c) => { if (c.userData.x != null) c.position.y = onPlank(c.userData.x + 0.45) + 0.22; });
  }
  // Where the alpaca's feet are at x: on the plank, on the stone, or on the ground.
  function surface(x) {
    const ground = Math.max(groundAt(x), stoneTop(x));
    if (!plank || plank.anim || state.dir !== "x" || x < ROOT - 0.6 || x > TIP) return ground;
    return Math.max(ground, top0 + thick - sagAt(x, loadsNow()));
  }
  function frame(dt) {
    if (!plank) return;
    if (plank.grow < 1) { plank.grow = Math.min(1, plank.grow + dt / 0.45); plank.mesh.scale.set(1, mix(0.3, 1, smooth(plank.grow)), mix(0.3, 1, smooth(plank.grow))); }
    if (plank.anim) animate(dt);
    else bend();
  }
  // The scene as the rounds before r left it.
  function setScene(r) {
    balcony(r > 0 ? "x" : null);
    nodes(r > 0);
    support(r > 1 ? "fixed" : null);
    loadOf(r > 2 ? { at: SPAN, P: LOAD } : null);
    gizmo(r === 0);
    if (r === 0 || r === 1) for (const [name, m] of [["Root", 0], ["Tip", SPAN]]) if (r || !m) tag(name, () => V(X(m) + (m ? 0.4 : -1.2), top0 - 0.3, -1.8), "bank", false, "scene");
  }

  const api = {
    ROOT, TIP, LEN, at: (x, y, z) => V(x, top0 + y, z),
    balcony, support, load: loadOf, plankAnim, tag,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, lookUp: kit.lookUp,
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, ghost, stop: () => { balcony(null); if (rock) rock.visible = true; } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "cliff", chip: "Area 2 · Cliff", def, gh: { url: GH_FILE, name: "Cliff.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - HAND) <= HAND * 0.2 ? `You guessed ${guess}${NB}mm: within a fifth of it. ` : `You guessed ${guess}${NB}mm. `;
      return [
        el("p", "", `${said}OpenSees moves the tip ${HAND.toFixed(0)}${NB}mm down, and the panel Z in m reads −0.390${NB}m for it: ${(HAND / RIVER).toFixed(0)} times the River's ${RIVER.toFixed(1)}${NB}mm, with the same plank, the same span and the same alpaca. Model View draws it true to scale.`),
        el("p", "pg-calc", `By hand: δ = PL³ / 3EI = 0.6 × 4³ / (3 × 10${NB}500${NB}000 × 3.125·10⁻⁶) = ${HAND.toFixed(0)}${NB}mm. On two supports with the load in the middle it is PL³ / 48EI: held at one end only, the same plank bends 48 / 3 = 16 times as much.`),
      ];
    },
    done: { title: "The Cliff is done.", body: "Held at one end only, a cantilever has to be built in there, and it bends 16 times as much as the same plank on two supports: which is why real balconies are deep, short, or both. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
