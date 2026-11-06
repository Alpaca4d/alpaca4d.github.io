// Area 3, the Snowy roof: the Playground's third lesson. The rafter of a flat roof, as the River left
// off - C24, 4 m from wall to wall on a pin and a roller - and in five rounds the player loads it and
// sizes it: the snow along it, its own weight, the two in one Load Pattern, how deep it must be to
// sag no more than L/250, and the analysis. The third round is wired by hand.
//
// The definition is roof.gh, written by Alpaca4d's Tools/Examples/PlaygroundRoof.py. The numbers
// are Alpaca4d's: metres and kN, C24 from its timber database (E = 10 500 MPa, 410 kg/m3), and
// OpenSees' sag at mid-span as Alpaca4d writes the model, which 5wL^4/384EI gives too. The panel, the
// rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 4;                          // m between the walls
const E = 10.5e6;                        // kN/m², C24
const RHO = 410;                         // kg/m³, C24
const SNOW = 1.5, SPACING = 0.6;         // kN/m² on the roof, and m between rafters
const WIDTH = 0.075, START_DEPTH = 0.1, DEPTH = 0.15;   // m
const EXAGGERATE = 20;                   // as Model View draws it in roof.gh
const LIMIT = SPAN / 250;                // m: L/250
const TIMBER = "#d7a865", BOARDS = "#b98a55", STONE = "#b9b2a2", SNOWY = "#f4f6f8", ORANGE = "#eb6c3f", RED = "#d23c3c";
// OpenSees, as Alpaca4d writes the model (Newton, its default): the sag at mid-span, in mm.
const SAG = { start: 47.3, d125: 24.5, d150: 14.3, d200: 6.1, wide: 24.4, linear: 13.6 };
const selfWeight = (b, h) => (b * h * RHO * 9.81) / 1000;   // kN/m
const W_RIGHT = SNOW * SPACING + selfWeight(WIDTH, DEPTH);
const HAND = ((5 * W_RIGHT * SPAN ** 4) / (384 * E * (WIDTH * DEPTH ** 3) / 12)) * 1000;   // mm

const ready = loadDefinition(new URL("./roof-definition.json", import.meta.url));
const GH_FILE = new URL("./roof.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Snow", title: "The snow",
    task: `Snow lies on the roof, 1.5${NB}kN on every square metre. The rafters are 0.6${NB}m apart, so each one holds up a strip of roof 0.6${NB}m wide. Load the rafter with its share as a Linear Load: a force on every metre of its length.`,
    tip: "Linear Load's Force is a vector, in kN per metre of beam. Multiplication multiplies A by B, and Unit Z makes a vector along Z as long as its F. Beam|Id left empty puts the load on every beam.",
    options: [
      { key: "right", says: "Snow minus 1.50 times Spacing 0.60 into Unit Z, and Unit Z into the Linear Load's Force.",
        title: `0.9${NB}kN on every metre.`, body: `Each rafter holds up a strip of roof 0.6${NB}m wide, so it carries 1.5 × 0.6 = 0.9${NB}kN on every metre of its length. Snow is negative, so Unit Z points it down, and Beam|Id left empty puts it on every beam: the rafter's four elements.`,
        react: (s) => { s.snow({ w: SNOW * SPACING, strip: SPACING }); s.tag(`0.9 kN/m: a strip 0.6 m wide`, () => s.at(0, 3.4, 0)); s.play(s.wait(0.6), s.walkTo(s.SPOT), s.hop()); } },
      { key: "nospacing", says: "Snow minus 1.50 straight into Unit Z, and Unit Z into the Linear Load's Force.",
        patch: (a) => a.wire("Down", "F", a.src("Snow")),
        title: `That's 1.5${NB}kN on every metre.`, body: `1.5 is kN on every square metre of roof, and Linear Load reads kN on every metre of beam: wired straight in, each rafter holds up a strip a metre wide, two thirds more than its share. A number carries no unit of its own: multiply by the spacing, 0.6${NB}m.`,
        react: (s) => { s.snow({ w: SNOW, strip: 1 }); s.tag("1.5 kN/m: a strip 1 m wide", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.6), s.walkTo(s.SPOT), s.lookUp()); } },
      { key: "total", says: "Snow minus 1.50 times Spacing 0.60, times Span 4.0, into Unit Z, and Unit Z into the Linear Load's Force.",
        patch: (a) => {
          const m = a.get("Per metre");
          a.add(a.newComponent("whole", "Per metre", "Whole rafter", m.box[0], m.box[1] + 70, { A: [a.src("Per metre", "R")], B: [a.src("Span")] }));
          a.wire("Down", "F", "whole.out0");
        },
        title: `3.6${NB}kN on every metre snaps it.`, body: `0.9 × 4 = 3.6${NB}kN is the snow on the whole rafter, but Linear Load puts its Force on every metre of it: four times the snow. A C24 rafter 75 × 100${NB}mm breaks at about 1.5${NB}kN/m over 4${NB}m. Alpaca4d itself would not tell you: its analysis is elastic, and it would sag 183${NB}mm.`,
        react: (s) => { s.snow({ w: 4 * SNOW * SPACING, strip: SPACING, pile: 4 }); s.snap(1.1); s.tag("3.6 kN/m: four times the snow", () => s.at(0, 6.5, 0), "wrong"); s.play(s.wait(0.4), s.walkTo(s.SPOT), s.wait(0.4), s.wobble(0.6), s.walkTo(s.HOME - 3, 6)); } },
      { key: "up", says: "Snow 1.50, positive, times Spacing 0.60 into Unit Z, and Unit Z into the Linear Load's Force.",
        patch: (a) => a.slider("Snow", 1.5, { min: 0, max: 3 }),
        title: "That snow pushes the roof up.", body: "Z points up, so +0.9 makes a force upwards: the snow would lift the roof off its walls. A weight is negative, as the alpaca's was on the River.",
        react: (s) => { s.snow({ w: -SNOW * SPACING, strip: SPACING }); s.tag("0.9 kN/m up", () => s.at(0, 4.8, 0), "wrong"); s.play(s.wait(0.6), s.walkTo(s.SPOT), s.lookUp()); } },
    ],
  },
  {
    name: "Weight", title: "Its own weight",
    task: "The rafter weighs something too. Give it its own weight with Gravity Load, which works it out from the section and the timber, so that you need not type it in.",
    tip: "Gravity Load weighs every element from its section and its material's density, and pulls the weight down. Its Factor multiplies that weight: 1 is the true weight.",
    options: [
      { key: "right", says: "Weight factor 1.00 into Gravity Load's Factor.",
        title: "Its own weight, worked out.", body: `Gravity Load weighs every beam from its section and material: 0.075 × 0.1${NB}m × 410${NB}kg/m³ × 9.81 = 0.03${NB}kN on every metre, and pulls it down. Small next to the snow here, but the biggest load of all on a concrete slab.`,
        react: (s) => { s.weight(1); s.tag("Its own weight: 0.03 kN/m", () => s.at(0, 3.4, 0)); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.hop()); } },
      { key: "g", says: "Weight factor 9.81 into Gravity Load's Factor.",
        patch: (a) => a.slider("Weight factor", 9.81),
        title: "Ten times as heavy.", body: `Factor is not g: Gravity Load already multiplies the mass by 9.81 to make it a weight. 9.81 makes the rafter weigh ten times what it does, 0.3${NB}kN on every metre, a third of the snow.`,
        react: (s) => { s.weight(9.81); s.tag("Ten times its weight: 0.3 kN/m", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.lookUp()); } },
      { key: "minus", says: "Weight factor minus 1.00 into Gravity Load's Factor.",
        patch: (a) => a.slider("Weight factor", -1),
        title: "It weighs upwards.", body: "Gravity Load already pulls down, along −Z: its Factor only scales the weight, so −1 turns it upwards and the rafter floats a little. Leave it at 1.",
        react: (s) => { s.weight(-1); s.tag("Its weight pulling up", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.lookUp()); } },
      { key: "twice", says: "Weight factor 1.00 into Gravity Load, and the rafter's weight typed in again as a Linear Load.",
        patch: (a) => {
          const f = a.get("Weight factor"), gl = a.get("Gravity Load");
          a.add(a.newSlider("typed", "Own weight", -0.03, -1, 0, 2, f.box[0] - 40, f.box[1] + 76));
          a.add(a.newComponent("down2", "Down", "Its weight", gl.box[0], gl.box[1] + 74, { F: ["typed"] }));
          a.add(a.newComponent("twice", "Snow load", "Rafter weight", gl.box[0] + 130, gl.box[1] + 68, { Force: ["down2.out0"] }));
        },
        title: "Its weight, twice.", body: `Gravity Load already gives the rafter its weight: typed in again as a Linear Load, it counts twice. Only 0.03${NB}kN/m more here, but on a concrete slab it would double the biggest load it carries.`,
        react: (s) => { s.weight(2); s.tag("Its own weight, twice", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT)); } },
    ],
  },
  {
    name: "Pattern", title: "The load pattern",
    task: "The snow and the rafter's weight act together: put both in one Load Pattern, which Assemble Model will take. Its Loads needs both of them.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of the Load Pattern it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Load Pattern",
      // The two it needs among three that people wire in by mistake.
      offered: ["Rafter", "Down", "Snow load", "Gravity Load", "Weight factor"],
      wants: { Loads: ["Snow load", "Gravity Load"] },
      takes: {
        TimeSeries: "a time series, how the loads grow: left empty, they act at full size, which is what a static analysis wants",
        Loads: "loads, from Linear Load, Gravity Load or Point Load",
        Factor: "a number that scales every load in the pattern, best left empty: 1",
      },
      is: {
        Rafter: "the rafter's elements, which go into Assemble Model's Elements", Down: "a vector, only a size and a direction: Linear Load makes it a load",
        "Snow load": "the snow, a load", "Gravity Load": "the rafter's own weight, a load", "Weight factor": "Gravity Load's own factor: a number, so Grasshopper takes it, but the whole pattern would then follow the rafter's weight factor",
      },
      checks: [
        [(has) => has("Loads", "Snow load"), "Loads: the snow"],
        [(has) => has("Loads", "Gravity Load"), "Loads: the rafter's own weight"],
      ],
      first: "Start with the snow: drag a wire from Snow load's output, the circle on its right, to the Load Pattern's Loads.",
      done: { title: "One load pattern, both loads.", body: "A Load Pattern gathers the loads that act together, with a time series that says how they grow: left empty, constant, the loads at full size. Assemble Model takes it in its LoadPatterns." },
    },
  },
  {
    name: "Depth", title: "How deep",
    task: `Under the snow and its own weight the rafter, 100${NB}mm deep, sags 47${NB}mm. A roof may sag L/250: 4000 / 250 = 16${NB}mm. Which section keeps it under 16${NB}mm with the least timber?`,
    tip: "A rectangle's stiffness, I = bh³/12, grows with its width b and with the cube of its depth h. Depth goes into Height: on a horizontal beam it is the side that points up.",
    options: [
      { key: "right", says: "Width 0.075 and Depth 0.150.",
        title: `150${NB}mm deep: 14.3${NB}mm.`, body: `I grows with the cube of the depth: 1.5 times as deep is 3.4 times as stiff, and 47${NB}mm comes down to 14.3, under 16. It is the shallowest of these that passes.`,
        react: (s) => { s.section(WIDTH, DEPTH); s.tag("14.3 mm, under 16 mm", () => s.at(0, 3.4, 0)); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.hop()); } },
      { key: "d125", says: "Width 0.075 and Depth 0.125.",
        patch: (a) => a.slider("Depth", 0.125),
        title: `125${NB}mm deep: still too much.`, body: `1.25 times as deep is nearly twice as stiff, 1.25³ = 1.95, but it still sags 24.5${NB}mm, over 16.`,
        react: (s) => { s.section(WIDTH, 0.125); s.tag("24.5 mm, over 16 mm", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.lookUp()); } },
      { key: "d200", says: "Width 0.075 and Depth 0.200.",
        patch: (a) => a.slider("Depth", 0.2),
        title: `200${NB}mm deep passes, with timber to spare.`, body: `Twice as deep is eight times as stiff: 6.1${NB}mm, far under 16. But 150${NB}mm passes too, with a quarter less timber, and every rafter of the roof is this one.`,
        react: (s) => { s.section(WIDTH, 0.2); s.tag("6.1 mm: a third more timber than it needs", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT)); } },
      { key: "wide", says: "Width 0.150 and Depth 0.100.",
        patch: (a) => a.slider("Width", 0.15),
        title: "Twice as wide is only twice as stiff.", body: `Width counts once in I = bh³/12, depth three times: 150 × 100${NB}mm sags 24.4${NB}mm, with twice the timber of 75 × 100 and still over 16. Make it deeper, not wider.`,
        react: (s) => { s.section(0.15, START_DEPTH); s.tag("24.4 mm, over 16 mm", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.5), s.walkTo(s.SPOT), s.lookUp()); } },
    ],
  },
  {
    name: "Run", title: "Run", guess: { question: "How far will the middle of the 150 mm rafter go down?", unit: "mm", step: "0.1", min: 0 },
    task: "Solve it, and see how far the rafter sags under the snow and its own weight. First, make a guess.",
    tip: "Run Analysis needs Analysis Settings, which left as it comes is a static analysis solved with Newton; Assemble Model takes load patterns, not loads.",
    options: [
      { key: "right", says: "The Load Pattern into Assemble Model, Assemble Model into Run Analysis with Analysis Settings as it comes, and Run Analysis into Model View.",
        title: `${SAG.d150.toFixed(1)}${NB}mm, under L/250.`,
        react: (s) => { s.play(s.wait(0.4), s.walkTo(s.SPOT), s.hop()); s.tag(`${SAG.d150.toFixed(1)} mm, drawn 20 times bigger`, () => s.at(0, -2.2, 1.2), "right", true); } },
      { key: "straight", says: "Snow load and Gravity Load wired straight into Assemble Model's LoadPatterns, without the Load Pattern.",
        patch: (a) => a.wire("Assemble Model", "LoadPatterns", a.src("Snow load", "Load"), a.src("Gravity Load", "Load")),
        title: "Assemble Model wants a load pattern.", body: "LoadPatterns takes load patterns, and a Linear Load is a load: Assemble Model stops at “Unsupported item at LoadPatterns input: LineLoad” and gives no model to solve. Loads go into a Load Pattern first.",
        react: (s) => { s.model(false); s.tag("Unsupported item at LoadPatterns input: LineLoad", () => s.at(0, 1.4, 0), "wrong"); } },
      { key: "linear", says: "The same, with Algorithm Linear typed into Analysis Settings.",
        patch: (a) => {
          const st = a.get("Analysis Settings");
          a.add({ kind: "panel", id: "linear", type: "59e0b89a-e487-49f8-bab8-b5bab16be14c", name: "Panel", nick: "Algorithm", desc: "A panel for custom notes and text values", box: [st.box[0] - 120, st.box[1] + 96, 60, 24], src: [], text: "Linear", colour: [255, 255, 250, 90] });
          a.wire("Analysis Settings", "Algorithm", "linear");
        },
        title: `${SAG.linear.toFixed(1)}${NB}mm: too little, and no warning.`, body: `Linear solves once and stops. A ForceBeamColumn takes in the bending of a load along it only as it iterates, so after one solve the snow acts as if it hung from the nodes: ${SAG.linear.toFixed(1)}${NB}mm, not ${SAG.d150.toFixed(1)}. Analysis Settings' own Algorithm, Newton, iterates until it agrees.`,
        react: (s) => { s.scale(SAG.linear / SAG.d150); s.tag(`${SAG.linear.toFixed(1)} mm: one solve, no iteration`, () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.4), s.walkTo(s.SPOT)); } },
      { key: "noloads", says: "Assemble Model with nothing in LoadPatterns.",
        patch: (a) => a.wire("Assemble Model", "LoadPatterns"),
        title: "It solves, and nothing moves.", body: "LoadPatterns may be left empty, so Assemble Model makes a model with no loads, Run Analysis solves it without a word, and the rafter stays straight: 0.0 mm. An answer of nothing is worth checking: are the loads in?",
        react: (s) => { s.snow(null); s.weight(0); s.tag("0.0 mm: no loads", () => s.at(0, 3.4, 0), "wrong"); s.play(s.wait(0.4), s.walkTo(s.SPOT), s.lookUp()); } },
    ],
  },
];

// How far a simply supported rafter goes down at x (m from Wall A) under w (kN/m, down) with
// stiffness EI; past its supports it rises as the ends turn.
function deflection(x, w, EI) {
  const L = SPAN;
  if (x < 0) return ((w * L ** 3) / (24 * EI)) * x;
  if (x > L) return ((-w * L ** 3) / (24 * EI)) * (x - L);
  return (w * x * (L ** 3 - 2 * L * x * x + x ** 3)) / (24 * EI);
}

// ---- The scene: an open hut with a flat roof, at the alpaca's size ----
function scene(kit) {
  const { g, area, solid, add, clear, arrow, groundAt, tag, al, reduceMotion } = kit;
  const k = 3;                               // the toy world's metres per real metre
  const HALF = (SPAN * k) / 2;               // the walls' centres, either side of the middle
  const OVER = 0.3 * k;                      // the rafters past the walls
  const EAVE = 2.2 * k;                      // the walls' top, where the rafters sit
  const ZC = 6;                              // the hut's middle, behind where the alpaca walks: the camera looks from -z
  const BAY = SPACING * k;                   // between rafters
  const RAFTERS = [-2, -1, 0, 1, 2].map((i) => ZC + i * BAY);
  const FRONT = RAFTERS[0];                  // the lesson's rafter, nearest the alpaca and the camera
  const BOARD = 0.15;                        // the boards' thickness, drawn
  const SNOW_T = 0.5 * k;                    // 0.5 m of settled snow makes 1.5 kN/m²
  const HOME = -HALF - 4.5;
  const SPOT = -HALF + 1.5;                  // where the alpaca stands to watch, clear of mid-span
  kit.home = HOME;
  kit.view = { at: V(0, 4.5, ZC / 2 - 0.5), w: 27, h: 15 };
  kit.hideStructure();
  // The island's little cabin steps aside for the lesson's hut.
  const aside = [];
  for (const c of area.group.children) if (c !== g && c.visible) { c.visible = false; aside.push(c); }

  // The walls, and the pin and the roller on top of them, at the lesson's rafter.
  const stone = solid(STONE);
  const walls = new THREE.Group();
  g.add(walls);
  for (const s of [-1, 1]) {
    const w = add(walls, new THREE.Mesh(new THREE.BoxGeometry(0.9, EAVE + 3, BAY * 4 + 1.2), stone));
    w.position.set(s * HALF, (EAVE - 3) / 2, ZC);
  }
  const back = add(walls, new THREE.Mesh(new THREE.BoxGeometry(2 * HALF, EAVE + 3, 0.7), stone));
  back.position.set(0, (EAVE - 3) / 2, ZC + BAY * 2 + 0.4);
  const marks = new THREE.Group();
  g.add(marks);
  const orange = solid(ORANGE), red = solid(RED, { roughness: 0.5 });
  for (const [s, roller] of [[-1, false], [1, true]]) {
    const p = add(marks, new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.5, 4), orange));
    p.position.set(s * HALF, EAVE - 0.25 - (roller ? 0.2 : 0), FRONT - 0.75);
    if (roller) for (const dx of [-0.18, 0.18]) {
      const c = add(marks, new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 10).rotateX(Math.PI / 2), solid("#2a2d31")));
      c.position.set(s * HALF + dx, EAVE - 0.6, FRONT - 0.75);
    }
  }

  // ---- What the model says: the section, the loads, and so the sag ----
  const state = { b: WIDTH, h: START_DEPTH, snow: null, factor: 0, scale: 1, model: true, limit: false, wired: null };
  let shown = 0;                              // the sag at mid-span drawn now, toy metres, eased towards the model's
  const EI = () => (E * state.b * state.h ** 3) / 12;
  const loadNow = () => {
    let w = 0;
    if (state.snow && (!state.wired || state.wired.snow)) w += state.snow.w;
    if (!state.wired || state.wired.weight) w += state.factor * selfWeight(state.b, state.h);
    return w;
  };
  const midSag = () => (state.model ? deflection(SPAN / 2, loadNow(), EI()) * EXAGGERATE * k * state.scale : 0);
  // The sag at x of the area's frame, as a share of the sag at mid-span.
  const shape = (x) => deflection(x / k + SPAN / 2, 1, 1) / deflection(SPAN / 2, 1, 1);

  // The roof: rafters, boards and snow, each a box cut along its length so that it can bend.
  const roof = new THREE.Group();
  g.add(roof);
  const bends = [];
  function bendy(len, h, d, mat, x, y, z) {
    const geo = new THREE.BoxGeometry(len, h, d, 48, 1, 1);
    const m = add(roof, new THREE.Mesh(geo, mat));
    m.position.set(x, y, z);
    m.receiveShadow = true;
    bends.push({ m, rest: geo.attributes.position.array.slice() });
    return m;
  }
  let snowMesh = null, pileMesh = null, strip = null;
  function buildRoof() {
    clear(roof);
    bends.length = 0;
    const L = 2 * (HALF + OVER), h = state.h * k, b = state.b * k;
    for (const z of RAFTERS) bendy(L, h, b, solid(z === FRONT ? TIMBER : "#c99a5c", { roughness: 0.8 }), 0, EAVE + h / 2, z);
    bendy(L, BOARD, BAY * 4 + 1.6, solid(BOARDS, { roughness: 0.85 }), 0, EAVE + h + BOARD / 2, ZC);
    snowMesh = pileMesh = strip = null;
    const s = state.snow;
    if (!s) return;
    const top = EAVE + h + BOARD;
    snowMesh = bendy(L, SNOW_T, BAY * 4 + 1.6, solid(SNOWY, { roughness: 0.95 }), 0, top + SNOW_T / 2, ZC);
    if (s.pile) pileMesh = bendy(L - 0.4, SNOW_T * (s.pile - 1), BAY * 0.98, solid(SNOWY, { roughness: 0.95 }), 0, top + SNOW_T + (SNOW_T * (s.pile - 1)) / 2, FRONT);
    // The strip of roof the lesson's rafter holds up, on the snow.
    strip = bendy(L - 0.3, 0.06, s.strip * k, new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: 0.55 }), 0, top + SNOW_T * (s.pile || 1) + 0.05, FRONT);
    strip.castShadow = false;
  }
  // The load as Model View draws it: arrows along the lesson's rafter, down, or up.
  const arrows = new THREE.Group();
  g.add(arrows);
  function drawArrows() {
    clear(arrows);
    const w = state.snow ? state.snow.w : 0;
    if (!w || !state.model) return;
    const len = Math.min(2.6, 1.2 + Math.abs(w) * 0.9), mat = solid(ORANGE);
    for (let i = 0; i <= 6; i++) {
      const x = -HALF + (i * 2 * HALF) / 6;
      const holder = new THREE.Group();
      holder.userData.x = x;
      if (w > 0) arrow(holder, V(0, len, 0), V(0, 0.1, 0), 0.06, mat);
      else arrow(holder, V(0, 0.1, 0), V(0, len, 0), 0.06, mat);
      arrows.add(holder);
    }
  }
  // L/250 under the lesson's rafter at mid-span, drawn as far down as Model View would draw it.
  const limitMark = new THREE.Group();
  g.add(limitMark);
  function drawLimit() {
    clear(limitMark);
    if (!state.limit) return;
    const y = EAVE - LIMIT * EXAGGERATE * k;
    const bar = add(limitMark, new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.07, 0.07), red));
    bar.position.set(0, y, FRONT - 0.35);
    for (const s of [-1, 1]) { const t = add(limitMark, new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.4, 0.07), red)); t.position.set(s * 1.7, y + 0.2, FRONT - 0.35); }
  }
  function refresh() { buildRoof(); drawArrows(); drawLimit(); }

  // A rafter that breaks: the roof in two halves, turning down off the walls, its snow with it.
  let broken = null;
  function snap(after = 0.8) {
    broken = { t: -after, halves: null };
    if (reduceMotion) { broken.t = 10; breakNow(); }
  }
  function breakNow() {
    roof.visible = arrows.visible = false;
    const top = EAVE + state.h * k;
    broken.halves = [-1, 1].map((s) => {
      const pivot = new THREE.Group();
      pivot.position.set(s * HALF, EAVE, ZC);
      const len = HALF + OVER - 0.1;
      const part = (h, y, mat) => { const m = add(pivot, new THREE.Mesh(new THREE.BoxGeometry(len, h, BAY * 4 + 1.6), mat)); m.position.set(-s * (len / 2 - OVER), y, 0); };
      part(state.h * k, state.h * k / 2, solid(TIMBER));
      part(BOARD, state.h * k + BOARD / 2, solid(BOARDS));
      part(SNOW_T * 1.4, top - EAVE + BOARD + SNOW_T * 0.7, solid(SNOWY));
      g.add(pivot);
      return pivot;
    });
  }

  // ---- The scene's state, round by round ----
  function setState(next) {
    if (broken) { (broken.halves || []).forEach((p) => g.remove(p)); broken = null; }
    Object.assign(state, { scale: 1, model: true, wired: null }, next);
    roof.visible = arrows.visible = true;
    refresh();
  }
  function setScene(r) {
    setState({
      b: WIDTH, h: r > 3 ? DEPTH : START_DEPTH,
      snow: r > 0 ? { w: SNOW * SPACING, strip: SPACING } : null,
      factor: r > 1 ? 1 : 0,
      limit: r > 2,
    });
    if (r > 2) tag("L/250 = 16 mm", () => V(2.4, EAVE - LIMIT * EXAGGERATE * k, FRONT - 1), "bank", false, "scene");
    if (r === 0) for (const [name, s] of [["Wall A", -1], ["Wall B", 1]]) tag(name, () => V(s * (HALF + 1.6), EAVE * 0.55, FRONT - 2), "bank", false, "scene");
  }
  // The wiring round: what the Load Pattern has not been given yet does not load the rafter.
  function ghost(has) {
    state.wired = has ? { snow: has("Loads", "Snow load"), weight: has("Loads", "Gravity Load") } : null;
    if (snowMesh) snowMesh.visible = !has || state.wired.snow;
    if (strip) strip.visible = !has || state.wired.snow;
    arrows.visible = !has || state.wired.snow;
  }

  function frame(dt) {
    if (broken) {
      broken.t += dt;
      if (broken.t >= 0 && !broken.halves) breakNow();
      if (broken.halves) {
        const t1 = Math.min(1, broken.t / 0.5), t2 = Math.max(0, Math.min(1, (broken.t - 0.5) / 0.7));
        broken.halves.forEach((p, i) => {
          p.rotation.z = (i ? 1 : -1) * (smooth(t1) * 0.7 + t2 * 0.25);
          p.position.y = EAVE - 2.2 * t2 * t2;
        });
        return;
      }
    }
    // Eased, so that a change in the model is seen to happen.
    // Drawn no further than the walls let it: past that, it has broken anyway.
    const target = Math.max(-0.45 * EAVE, Math.min(0.55 * EAVE, midSag()));
    shown = reduceMotion ? target : mix(shown, target, Math.min(1, dt * 4));
    for (const { m, rest } of bends) {
      const pos = m.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 1] = rest[i * 3 + 1] - (shown * shape(rest[i * 3] + m.position.x)) / m.scale.y;
      pos.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
    const top = EAVE + state.h * k + BOARD + (state.snow ? SNOW_T * (state.snow.pile || 1) : 0) + 0.1;
    arrows.children.forEach((a) => a.position.set(a.userData.x, top - shown * shape(a.userData.x), FRONT - 0.2));
  }
  const surface = (x, z) => groundAt(x, z);

  const api = {
    HOME, SPOT, at: (x, y, z) => V(x, EAVE + y, FRONT - z),
    tag, play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, lookUp: kit.lookUp, zoom: kit.zoom,
    snow: (s) => { state.snow = s; refresh(); },
    weight: (f) => { state.factor = f; },
    section: (b, h) => { state.b = b; state.h = h; refresh(); },
    scale: (f) => { state.scale = f; },
    model: (on) => { state.model = on; roof.visible = arrows.visible = on; },
    snap,
  };
  return {
    api, setScene, frame, surface, ghost,
    stop: () => { aside.forEach((c) => { c.visible = true; }); },
  };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "roof", chip: "Area 3 · Snowy roof", def, gh: { url: GH_FILE, name: "Snowy roof.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - SAG.d150) <= SAG.d150 * 0.2 ? `You guessed ${guess}${NB}mm: within a fifth of it. ` : `You guessed ${guess}${NB}mm. `;
      return [
        el("p", "", `${said}OpenSees bends the middle of the rafter ${SAG.d150.toFixed(1)}${NB}mm under the snow and its own weight, under L/250 = 16${NB}mm, and Model View draws it twenty times bigger.`),
        el("p", "pg-calc", `By hand: w = 0.9 + 0.075 × 0.15 × 410 × 9.81 / 1000 = ${W_RIGHT.toFixed(3)}${NB}kN/m and I = bh³/12 = 0.075 × 0.15³ / 12 = 2.11·10⁻⁵${NB}m⁴, so δ = 5wL⁴ / 384EI = 5 × ${W_RIGHT.toFixed(3)} × 4⁴ / (384 × 10${NB}500${NB}000 × 2.11·10⁻⁵) = ${HAND.toFixed(1)}${NB}mm. The beam's shear adds a twentieth of a millimetre.`),
      ];
    },
    done: { title: "The Snowy roof is done.", body: "You loaded a rafter along its length, gave it its own weight, and found how deep it must be: twice as deep is eight times as stiff, and L/250 says when it is deep enough. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
