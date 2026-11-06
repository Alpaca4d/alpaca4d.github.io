// Area 1, the River: the Playground's first lesson. In seven rounds the player builds the
// Grasshopper definition of a timber plank across the river, a piece at a time: the line, the
// section, the beam, the supports, the alpaca, the wires into Assemble Model, and the analysis.
// Each round but one shows snippets to pick from, only one of them right, and the scene shows what
// each would build; a wrong one can be tried again. In the sixth the player draws the wires.
//
// The definition is river.gh, written by Alpaca4d's Tools/Examples/PlaygroundRiver.py. The numbers
// are Alpaca4d's: metres and kN, C24 from its timber database (E = 10 500 MPa), and 24.4 mm at
// mid-span, which OpenSees gives too. The panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 4, OVER = 0.2;              // m between the supports, and past each one
const LOAD = 0.6;                        // kN: the alpaca, 60 kg
const E_TIMBER = 10.5e6, E_STEEL = 210e6;    // kN/m²
const EXAGGERATE = 8;                    // as Model View draws it in river.gh
const TIMBER = "#d7a865", STEEL = "#9aa4ae", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c";
const PLANK = { w: 0.3, h: 0.05, E: E_TIMBER, colour: TIMBER };
const HAND = ((LOAD * SPAN ** 3) / (48 * E_TIMBER * (0.3 * 0.05 ** 3) / 12)) * 1000;   // mm

const ready = loadDefinition(new URL("./river-definition.json", import.meta.url));
const GH_FILE = new URL("./river.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Line", title: "The line",
    task: `Every Alpaca4d model starts as geometry. Draw the plank's line from Bank A, at the origin, to Bank B on the far bank, 4${NB}m away. The arrows on the bank show which way X, Y and Z point.`,
    tip: "Follow the Span slider's wire: which input of Bank B does it set?",
    options: [
      { key: "right", says: "Span wired into Bank B's X.",
        title: "Straight across.", body: `Bank B is at X${NB}=${NB}4, so the line runs 4${NB}m along X, over the river. Construct Point builds a point from its X, Y and Z; an input with nothing wired into it is 0.`,
        react: (s) => { s.line("x"); s.play(s.wait(0.4), s.hop()); } },
      { key: "y", says: "Span wired into Bank B's Y.", patch: (a) => { a.wire("Bank B", "X"); a.wire("Bank B", "Y", a.src("Span")); },
        title: "That line runs along the river.", body: `Span goes into Y, so Bank B is 4${NB}m along Y: the line lies on the near bank, beside the water. The river runs along Y, and across it is X.`,
        react: (s) => { s.line("y"); s.tag("Along Y: beside the river", () => s.at(-s.SPAN_T / 2, 1.2, -s.SPAN_T / 2), "wrong"); } },
      { key: "z", says: "Span wired into Bank B's Z.", patch: (a) => { a.wire("Bank B", "X"); a.wire("Bank B", "Z", a.src("Span")); },
        title: "That's a flagpole, not a plank.", body: `Span goes into Z, which points up in Rhino and in Alpaca4d: the line stands 4${NB}m tall on the bank.`,
        react: (s) => { s.line("z"); s.zoom(0.75); s.play(s.wait(0.5), s.lookUp()); s.tag("Along Z: straight up", () => s.at(-s.SPAN_T / 2, s.SPAN_T + 1.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Section", title: "The section",
    task: `The red line is the plank's axis. Now give it a cross-section: C24 timber, 300${NB}mm wide and 50${NB}mm thick, lying flat. Which definition builds it?`,
    tip: "Hover a component to see what it is, and follow each wire to the input it lands on.",
    options: [
      { key: "right", says: "Plank width 0.300 wired into Width, Plank thickness 0.050 into Height, and the C24 material into Material.",
        title: "That's the plank.", body: `Width runs across the deck and Height points up, so 0.3${NB}m and 0.05${NB}m make a flat plank, in C24 timber (E${NB}=${NB}10${NB}500${NB}MPa). Each number travels down its wire into the input it lands on: a component knows only what is wired into it.`,
        react: (s) => { s.plank(PLANK, "C24 · 300 × 50 mm"); s.play(s.wait(0.5), s.walkTo(0), s.hop()); } },
      { key: "edge", says: "Plank width 0.300 wired into Height, Plank thickness 0.050 into Width, and the C24 material into Material.",
        patch: (a) => { a.wire("RectangleCS", "Width", a.src("Plank thickness")); a.wire("RectangleCS", "Height", a.src("Plank width")); },
        title: "The plank stands on its edge.", body: `The wires cross: 0.3 goes into Height and 0.05 into Width. On a horizontal beam a rectangle's Height is the side that points up, so this plank is 300${NB}mm tall and 50${NB}mm wide. On its edge it bends 36 times less, which is why floor joists stand that way, but nobody can walk on 5${NB}cm.`,
        react: (s) => { s.plank({ ...PLANK, w: 0.05, h: 0.3 }, "50 × 300 mm · on its edge"); s.play(s.wait(0.5), s.walkTo(-s.BEARING + 0.6), s.wobble(1.1), s.fall(), s.wait(0.8), s.climbBack()); } },
      { key: "mm", says: "Plank width 300 wired into Width, Plank thickness 50 into Height, and the C24 material into Material.",
        patch: (a) => { a.slider("Plank width", 300, { max: 1000, digits: 0 }); a.slider("Plank thickness", 50, { max: 1000, digits: 0 }); },
        title: "That plank is 300 metres wide.", body: `Alpaca4d works in metres and kilonewtons, so 300 means 300${NB}m, not 300${NB}mm. A number in Grasshopper carries no unit: the component it goes into decides what it means. Type 0.3 and 0.05.`,
        react: (s) => { s.plank({ ...PLANK, w: 300, h: 50, giant: true }, "300 m × 50 m · drawn far smaller"); s.zoom(0.42); s.play(s.wait(1.2), s.walkTo(s.BANK - 1.6, 2.2), s.lookUp()); } },
      { key: "steel", says: "Plank width 0.300 wired into Width, Plank thickness 0.050 into Height, and the C24 material with no wire out of it.",
        patch: (a) => a.wire("RectangleCS", "Material"),
        title: "It works, but it's a steel plank.", body: "Nothing is wired into Material, so RectangleCS takes its default: steel, 20 times as stiff as timber and about 20 times as heavy. Grasshopper gives no warning, because an optional input left empty takes its default without a word. Check that every input you mean to use has its wire.",
        react: (s) => { s.plank({ ...PLANK, E: E_STEEL, colour: STEEL, metal: true }, "Steel · E = 210 000 MPa"); s.play(s.wait(0.4), s.walkTo(0), s.hop()); } },
    ],
  },
  {
    name: "Beam", title: "The beam",
    task: "Make the plank a beam: a ForceBeamColumn with the plank's section. The alpaca will stand in the middle, and Alpaca4d puts a load only on a node, so the beam needs a node there.",
    tip: "Divide Curve gives the parameters t where it cuts the line; Shatter cuts the line there into segments, and ForceBeamColumn makes an element of each.",
    options: [
      { key: "right", says: "Elements 2 into Divide Curve, its parameters into Shatter, Shatter's segments into Line, and the section into Section.",
        title: "Two elements, a node in the middle.", body: `Divide Curve cuts the 4${NB}m line in two, at its middle, and Shatter splits it there: ForceBeamColumn makes an element of each segment. Their ends are the nodes, at Bank A, in the middle and at Bank B.`,
        react: (s) => { s.nodes([0, 2, 4]); s.play(s.wait(0.4), s.hop()); } },
      { key: "one", says: "The line itself wired into Line, Shatter's segments going nowhere, and the section into Section.",
        patch: (a) => a.wire("Plank", "Line", a.src("Plank line", "L")),
        title: "One element, no node in the middle.", body: "The whole line goes into Line, so the beam is a single element with a node at each end and none between. When the alpaca stands in the middle, Alpaca4d will stop: a load has to sit on a node.",
        react: (s) => { s.nodes([0, 4]); s.tag("No node in the middle", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "three", says: "Elements 3 into Divide Curve, its parameters into Shatter, Shatter's segments into Line, and the section into Section.",
        patch: (a) => a.slider("Elements", 3),
        title: "Three elements, and still no node in the middle.", body: `Elements is 3, so the nodes are at 1.33${NB}m and 2.67${NB}m, none at 2${NB}m where the alpaca will stand. An even number of elements puts a node at mid-span.`,
        react: (s) => { s.nodes([0, 4 / 3, 8 / 3, 4]); s.tag("Nodes at 1.33 m and 2.67 m", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "nosection", says: "Elements 2, Shatter's segments into Line, and nothing into Section.",
        patch: (a) => a.wire("Plank", "Section"),
        title: "No section, no beam.", body: "Nothing is wired into Section, and ForceBeamColumn cannot make a beam without one: it turns orange with “Input parameter Section failed to collect data” and gives nothing out. Unlike RectangleCS's Material, Section has no default.",
        react: (s) => { s.plank(null); s.tag("Input parameter Section failed to collect data", () => s.at(0, 1.4, 0), "wrong"); } },
    ],
  },
  {
    name: "Supports", title: "The supports",
    task: "Rest the plank on its two blocks: a pin at Bank A and a roller at Bank B. A plank resting on blocks can turn at its ends, and one end can slide a little as it bends.",
    tip: "A Support holds every direction left empty: True. Free is False, so each wire from it lets the plank move that way. Tx, Ty and Tz move along X, Y and Z; Rx, Ry and Rz turn about them.",
    options: [
      { key: "right", says: "Free wired into the Pin's Ry and Rz, and into the Roller's Tx, Ry and Rz.",
        title: "A pin and a roller.", body: "Both ends can turn about Y and Z, so the plank bends freely, and the roller can slide along X as it does. Both hold Rx: nothing else would stop the plank turning about its own axis.",
        react: (s) => { s.supports("pin-roller"); s.play(s.wait(0.4), s.walkTo(0), s.hop()); } },
      { key: "fixed", says: "Nothing wired from Free: every input of both supports is held.",
        patch: (a) => { for (const n of ["Ry", "Rz"]) a.wire("Pin", n); for (const n of ["Tx", "Ry", "Rz"]) a.wire("Roller", n); },
        title: "Both ends built in.", body: "Nothing comes from Free, so both supports hold everything: the plank is clamped at both ends, as if built into a wall. It solves, but it bends a quarter as much as a plank resting on blocks really does, so the model flatters it.",
        react: (s) => { s.supports("fixed"); s.play(s.wait(0.4), s.walkTo(0)); s.tag("Clamped at both ends", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "slide", says: "Free wired into Tx of both supports, as well as their Ry and Rz.",
        patch: (a) => a.wire("Pin", "Tx", a.src("Free")),
        title: "Nothing holds it along its length.", body: "Both ends are free along X, so the plank can slide off its blocks: the model is a mechanism, and Run Analysis stops with “Analysis Failed: OpenSees 'analyze' did not converge”. One support, the pin, has to hold X.",
        react: (s) => { s.supports("slide"); s.plankAnim("slide"); s.tag("Free along X at both ends", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "spin", says: "Free wired into Rx of both supports, as well as the rest.",
        patch: (a) => { a.wire("Pin", "Rx", a.src("Free")); a.wire("Roller", "Rx", a.src("Free")); },
        title: "Nothing stops it rolling over.", body: "Rx is free at both ends, so nothing stops the plank turning about its own axis: Run Analysis stops with “Analysis Failed: OpenSees 'analyze' did not converge”. In 3D a plank on two blocks has to be held against twisting at its ends.",
        react: (s) => { s.supports("pin-roller"); s.plankAnim("spin"); s.tag("Free about X at both ends", () => s.at(0, 1.6, 0), "wrong"); } },
    ],
  },
  {
    name: "Alpaca", title: "The alpaca",
    task: `The alpaca weighs 0.6${NB}kN, about 60${NB}kg, and will stand in the middle of the plank. Put its weight there as a Point Load, in a Load Pattern.`,
    tip: "Curve Middle gives the middle of the line. Unit Z makes a vector along Z as long as its F.",
    options: [
      { key: "right", says: "Alpaca minus 0.60 into Unit Z, Unit Z into Force, and Curve Middle into Point.",
        title: "The alpaca stands in the middle.", body: `Unit Z turns −0.6 into a vector 0.6${NB}kN long pointing down, and Curve Middle puts it at 2${NB}m, on the node Shatter made. The Load Pattern gathers it with any other loads that act together.`,
        react: (s) => { s.load({ at: 2, P: LOAD }); s.play(s.wait(0.4), s.walkTo(0), s.hop()); } },
      { key: "up", says: "Alpaca 0.60 into Unit Z, Unit Z into Force, and Curve Middle into Point.",
        patch: (a) => a.slider("Alpaca", 0.6),
        title: "That pushes the plank up.", body: "Z points up, so +0.6 makes a force upwards: the alpaca would lift the plank like a balloon. A weight is negative: −0.6.",
        react: (s) => { s.load({ at: 2, P: -LOAD }); s.tag("0.6 kN up", () => s.at(0, 3.2, 1.6), "wrong"); } },
      { key: "600", says: "Alpaca minus 600 into Unit Z, Unit Z into Force, and Curve Middle into Point.",
        patch: (a) => a.slider("Alpaca", -600, { min: -1000, max: 0, digits: 0 }),
        title: "600 kN snaps the plank.", body: `Alpaca4d works in kN, so 600 is 600${NB}kN: sixty tonnes. A C24 plank this size breaks at about 3${NB}kN in the middle. Alpaca4d itself would not tell you: its analysis is elastic, and it would bend the plank 24${NB}m. 600${NB}N is 0.6${NB}kN.`,
        react: (s) => { s.load({ at: 2, P: 600, big: true }); s.plankAnim("snap"); s.tag("600 kN: sixty tonnes", () => s.at(0, 4.6, 1.6), "wrong"); } },
      { key: "off", says: "Alpaca minus 0.60 into Unit Z, and a point 1.3 metres along, not Curve Middle, into Point.",
        patch: (a) => {
          const m = a.get("Mid-span"), w = a.get("Weight");
          a.add(a.newSlider("stop", "Stop", 1.3, 0, 4, 2, m.box[0] - 190, w.box[1] + 64));
          a.add(a.newComponent("where", "Bank A", "Where it stops", m.box[0], w.box[1] + 44, { X: ["stop"] }));
          a.wire("The alpaca", "Point", "where.out0");
        },
        title: "There is no node there.", body: `The alpaca stands 1.3${NB}m along, where the beam has no node, and Assemble Model stops: “Point load at location '1.3,0,0' is not part of the model!” A point load has to sit on a node: Curve Middle finds the middle, where Shatter made one.`,
        react: (s) => { s.load({ at: 1.3, P: LOAD, error: true }); s.tag("Point load at location '1.3,0,0' is not part of the model!", () => s.at(s.x(1.3), 3.6, 1.6), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Everything is built: now wire it into Assemble Model, which makes the model OpenSees will solve. It needs the beam's elements, both supports and the load pattern.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The four it needs, one under the other, and two that people wire in by mistake.
      offered: ["Shatter", "Plank", "Pin", "Roller", "The alpaca", "Load Pattern"],
      wants: { Elements: ["Plank"], Supports: ["Pin", "Roller"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements, from ForceBeamColumn", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the plank has none", Recorders: "recorders: leave it empty and Run Analysis picks one",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Plank: "the beam's element", Pin: "a support", Roller: "a support", "Load Pattern": "the load pattern",
        "The alpaca": "the alpaca's point load, which goes through the Load Pattern", Shatter: "the line's segments, only geometry",
      },
      checks: [
        [(has) => has("Elements", "Plank"), "Elements: the beam's element"],
        [(has) => has("Supports", "Pin") && has("Supports", "Roller"), "Supports: the pin and the roller"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the beam: drag a wire from Plank's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the model.", body: `Assemble Model joins the two elements at the node they share, and lands each support and the load on a node within its Tolerance, 1${NB}cm. What comes out of AlpacaModel is the plank, ready to solve.` },
    },
  },
  {
    name: "Run", title: "Run", guess: { question: "How far will the middle of the plank go down?", unit: "mm", step: "0.1", min: 0 },
    task: "Solve it, and see how far the plank bends under the alpaca. First, make a guess.",
    tip: "Run Analysis needs Analysis Settings; Model View draws whatever it is given.",
    options: [
      { key: "right", says: "Assemble Model into Run Analysis, with Analysis Settings, and Run Analysis into Model View.",
        title: `${HAND.toFixed(1)}${NB}mm.`,
        react: (s) => { s.play(s.wait(0.4), s.walkTo(0), s.hop()); s.tag(`${HAND.toFixed(1)} mm · drawn 8 times bigger`, () => s.at(0, -1.2, 1.4), "right", true); } },
      { key: "unsolved", says: "Assemble Model straight into Model View; Run Analysis's output goes nowhere.",
        patch: (a) => a.wire("The plank", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")),
        title: "Nothing has been solved.", body: "Model View is fed straight from Assemble Model, so it draws the model as it was built and says: “Deformed shape needs an analysed model, from Run Analysis or another analysis.” Feed it the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.tag("Deformed shape needs an analysed model", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "nosettings", says: "Assemble Model into Run Analysis with nothing in Settings, and Run Analysis into Model View.",
        patch: (a) => a.wire("Run Analysis", "Settings"),
        title: "Run Analysis waits for its settings.", body: "Settings is empty, so Run Analysis stops at “Input parameter Settings failed to collect data” and gives nothing to Model View, which draws nothing. Analysis Settings, left as it is, is a plain static analysis: wire it in.",
        react: (s) => { s.plank(null); s.line(null); s.supports(null); s.load(null); s.nodes(null); s.tag("Input parameter Settings failed to collect data", () => s.at(0, 1.4, 0), "wrong"); } },
    ],
  },
];

// How far the plank goes down at x (m from Bank A) under loads P (kN, down) at a: simply
// supported, or built in at both ends.
function deflection(x, loads, EI, fixed) {
  const L = SPAN;
  if (x <= 0 || x >= L) return 0;
  let d = 0;
  for (const { a, P } of loads) {
    if (a <= 0 || a >= L) continue;
    const b = L - a;
    if (fixed) d += x <= a ? (P * b * b * x * x * (3 * a * L - 3 * a * x - b * x)) / (6 * L ** 3 * EI)
      : (P * a * a * (L - x) ** 2 * (3 * b * L - 3 * b * (L - x) - a * (L - x))) / (6 * L ** 3 * EI);
    else d += x <= a ? (P * b * x * (L * L - b * b - x * x)) / (6 * L * EI)
      : (P * a * (L - x) * (L * L - a * a - (L - x) ** 2)) / (6 * L * EI);
  }
  return d;
}

// ---- The scene: the plank on its blocks, as each round builds it ----
function scene(kit) {
  const { g, area, water, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
  const k = (2 * area.bearing.x) / SPAN;      // the toy world's metres per real metre
  const top0 = area.bearing.y;                // the blocks' top, in the area's frame
  const BEARING = area.bearing.x;
  const BANK = -BEARING - 2.6;                // where the alpaca waits, on the near bank
  const SPAN_T = SPAN * k;
  const X = (m) => -SPAN_T / 2 + m * k;       // metres from Bank A, in the area's frame
  kit.home = BANK;
  kit.view = { at: V(-1.5, 1, 0), w: 25, h: 13 };
  kit.hideStructure();

  const state = { supports: null, load: null };
  let plank = null;
  const parts = { line: new THREE.Group(), nodes: new THREE.Group(), supports: new THREE.Group(), load: new THREE.Group(), gizmo: new THREE.Group() };
  Object.values(parts).forEach((p) => g.add(p));
  const red = solid(RED, { roughness: 0.5 });
  const axisY = top0 + 0.025 * k;             // the plank's axis, where the line runs

  // Round 1's line, red as Grasshopper previews a curve: across (x), along the river (y) or up (z).
  // Grasshopper's Y is the area's -z, and its Z the area's y.
  function line(dir) {
    clear(parts.line);
    if (!dir) return;
    const a = V(X(0), axisY, 0);
    const b = dir === "x" ? V(X(SPAN), axisY, 0) : dir === "y" ? V(X(0), axisY, -SPAN_T) : V(X(0), axisY + SPAN_T, 0);
    rod(parts.line, a, b, 0.07, red);
    for (const p of [a, b]) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), red); s.position.copy(p); parts.line.add(s); }
    parts.line.visible = !plank;
  }
  // Rhino's axes at Bank A, with their names.
  function gizmo(on) {
    clear(parts.gizmo);
    if (!on) return;
    const o = V(X(0), top0 + 0.05, 0), len = 2.4;
    for (const [name, d, c] of [["X", V(1, 0, 0), "#e23b3b"], ["Y", V(0, 0, -1), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
      arrow(parts.gizmo, o, o.clone().addScaledVector(d, len), 0.06, solid(c));
      tag(name, () => o.clone().addScaledVector(d, len + 0.5), "axis", false, "scene");
    }
  }

  // The plank as a section builds it: segmented, so it can bend.
  function plankOf(spec) {
    if (plank) {
      g.remove(plank.mesh);
      if (plank.halves) plank.halves.forEach((h) => g.remove(h));
      plank.mesh.geometry.dispose();
      plank = null;
    }
    parts.line.visible = !spec;
    parts.nodes.visible = true;
    if (!spec) return;
    const geo = new THREE.BoxGeometry((SPAN + 2 * OVER) * k, 1, 1, 48, 1, 1);
    const mat = solid(spec.colour, { roughness: spec.metal ? 0.35 : 0.8, metalness: spec.metal ? 0.55 : 0, transparent: true });
    const mesh = add(g, new THREE.Mesh(geo, mat));
    mesh.receiveShadow = true;
    const size = { y: Math.min(spec.h * k, 16), z: Math.min(spec.w * k, 64) };
    plank = { spec, mesh, size, grow: reduceMotion ? 1 : 0, rest: geo.attributes.position.array.slice(), EI: (spec.E * spec.w * spec.h ** 3) / 12, half: ((SPAN + 2 * OVER) * k) / 2, anim: null };
    sizePlank();
  }
  function sizePlank() {
    const t = smooth(plank.grow);
    const sy = mix(0.14, plank.size.y, t), sz = mix(0.14, plank.size.z, t);
    plank.mesh.scale.set(1, sy, sz);
    plank.mesh.position.y = top0 + sy / 2;
  }
  const plankTop = () => (plank ? top0 + plank.mesh.scale.y : top0);

  // The loads on the plank now: the alpaca, when it stands on it, and the model's load when that
  // pushes up.
  function loadsNow() {
    const loads = [];
    if (plank && !plank.anim && al.y == null && Math.abs(al.x) < plank.half && Math.abs(al.z) < 0.5) loads.push({ a: al.x / k + SPAN / 2, P: LOAD });
    if (state.load && state.load.P < 0) loads.push({ a: state.load.at, P: state.load.P });
    return loads;
  }
  const sagAt = (x, loads) => (plank ? deflection(x / k + SPAN / 2, loads, plank.EI, state.supports === "fixed") * k * EXAGGERATE : 0);

  // Nodes, as dots on the plank.
  function nodes(at) {
    clear(parts.nodes);
    for (const m of at || []) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), solid(INK));
      dot.userData.x = X(m);
      parts.nodes.add(dot);
    }
  }
  // Support symbols beside the plank's ends, on the blocks: a pyramid for a pin, on rollers for a
  // roller, a clamp over the end for one built in.
  function supports(kind) {
    state.supports = kind;
    clear(parts.supports);
    if (!kind) return;
    const mat = solid(ORANGE), dark = solid(INK);
    const symbol = (x, roller) => {
      const lift = roller ? 0.26 : 0;
      const p = add(parts.supports, new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.62, 4), mat));
      p.position.set(x, top0 + lift + 0.31, 0.95);
      if (roller) {
        for (const dx of [-0.24, 0.24]) {
          const c = add(parts.supports, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 10).rotateX(Math.PI / 2), dark));
          c.position.set(x + dx, top0 + 0.12, 0.95);
        }
      }
    };
    if (kind === "fixed") {
      for (const s of [-1, 1]) {
        const c = add(parts.supports, new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 1.5), dark));
        c.position.set(s * (BEARING + 0.25), top0 + 0.155 + 0.25, 0);
      }
    } else {
      symbol(-BEARING, kind === "slide");
      symbol(BEARING, true);
    }
  }
  // The model's load, an arrow beside the plank: down, or up off it; big for 600 kN; with a red
  // ring where it lands off a node.
  function loadOf(spec) {
    state.load = spec;
    clear(parts.load);
    if (!spec) return;
    const len = spec.big ? 5 : 2.4, r = spec.big ? 0.16 : 0.08;
    const holder = new THREE.Group();
    holder.userData.x = X(spec.at);
    const mat = solid(spec.error ? RED : ORANGE);
    if (spec.P > 0) arrow(holder, V(0, len + 0.15, 0), V(0, 0.15, 0), r, mat);
    else arrow(holder, V(0, 0.15, 0), V(0, len + 0.15, 0), r, mat);
    if (spec.error) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.07, 6, 20).rotateX(Math.PI / 2), mat);
      ring.position.set(0, 0.06, -1.6);
      holder.add(ring);
    }
    parts.load.add(holder);
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    if (plank) plank.mesh.material.opacity = !has || has("Elements", "Plank") ? 1 : 0.28;
    parts.supports.children.forEach((m) => { m.visible = !has || has("Supports", m.position.x < 0 ? "Pin" : "Roller"); });
    parts.load.visible = !has || has("LoadPatterns", "Load Pattern");
  }
  // What a wrong support or load does to the plank: slide off, roll over, or snap.
  function plankAnim(kind) {
    if (!plank) return;
    plank.anim = { kind, t: 0 };
    parts.nodes.visible = false;
    if (kind === "snap") {
      plank.mesh.visible = false;
      plank.halves = [-1, 1].map((s) => {
        const pivot = new THREE.Group();
        pivot.position.set(s * BEARING, plankTop(), 0);
        const len = plank.half - 0.05;
        const half = add(pivot, new THREE.Mesh(new THREE.BoxGeometry(len, plank.mesh.scale.y, plank.mesh.scale.z), plank.mesh.material));
        half.position.set(-s * (len / 2 - (plank.half - BEARING)), -plank.mesh.scale.y / 2, 0);
        g.add(pivot);
        return pivot;
      });
    }
    if (reduceMotion) animate(10);
  }
  function animate(dt) {
    const a = plank.anim, m = plank.mesh;
    a.t += dt;
    if (a.kind === "slide") {
      const t1 = Math.min(1, a.t / 1.1), t2 = Math.max(0, Math.min(1, (a.t - 1.1) / 0.8));
      m.position.x = smooth(t1) * 7.5 + t2 * 1.5;
      m.rotation.z = -0.9 * smooth(t2);
      m.position.y = top0 + plank.size.y / 2 + (water - 1.4 - top0) * t2 * t2;
      if (t2 === 1 && !a.splashed) { a.splashed = true; kit.makeSplash(m.position.x, 0); }
    } else if (a.kind === "spin") {
      const t1 = Math.min(1, a.t / 0.9), t2 = Math.max(0, Math.min(1, (a.t - 0.9) / 0.8));
      m.rotation.x = smooth(t1) * 1.6 + t2 * 1.2;
      m.position.z = t2 * 2.8;
      m.position.y = top0 + plank.size.y / 2 + (water - 1.2 - top0) * t2 * t2;
      if (t2 === 1 && !a.splashed) { a.splashed = true; kit.makeSplash(0, 2.8); }
    } else if (a.kind === "snap") {
      const t1 = Math.min(1, a.t / 0.5), t2 = Math.max(0, Math.min(1, (a.t - 0.5) / 0.8));
      plank.halves.forEach((p, i) => {
        p.rotation.z = (i ? 1 : -1) * (smooth(t1) * 0.9 + t2 * 0.3);
        p.position.y = top0 + plank.size.y + (water - 0.5 - top0) * t2 * t2;
      });
      if (t2 === 1 && !a.splashed) { a.splashed = true; kit.makeSplash(0, 0); }
    }
  }
  function bend() {
    const pos = plank.mesh.geometry.attributes.position, rest = plank.rest, loads = loadsNow();
    for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 1] = rest[i * 3 + 1] - sagAt(rest[i * 3], loads) / plank.mesh.scale.y;
    pos.needsUpdate = true;
    plank.mesh.geometry.computeVertexNormals();
    const onPlank = (x) => plankTop() - sagAt(x, loads);
    parts.nodes.children.forEach((d) => d.position.set(d.userData.x, onPlank(d.userData.x) + 0.1, 0));
    parts.load.children.forEach((h) => h.position.set(h.userData.x, onPlank(h.userData.x), 1.6));
  }
  // Where the alpaca's feet are at x: on the plank, or on the ground with a step up to it.
  function surface(x) {
    const ground = groundAt(x);
    if (!plank || plank.anim || Math.abs(x) > plank.half + 1.2) return ground;
    const top = plankTop() - sagAt(x, loadsNow());
    return mix(ground, top, smooth(Math.min(1, (plank.half + 1.2 - Math.abs(x)) / 1.2)));
  }
  function frame(dt) {
    if (plank) {
      if (plank.grow < 1) { plank.grow = Math.min(1, plank.grow + dt / (plank.spec.giant ? 1.6 : 0.45)); sizePlank(); }
      if (plank.anim) animate(dt);
      else bend();
    } else {
      parts.nodes.children.forEach((d) => d.position.set(d.userData.x, top0 + 0.1, 0));
      parts.load.children.forEach((h) => h.position.set(h.userData.x, top0, 1.6));
    }
  }
  // The scene as the rounds before r left it.
  function setScene(r) {
    plankOf(r > 1 ? PLANK : null);
    line(r > 0 ? "x" : null);
    nodes(r > 2 ? [0, 2, 4] : null);
    supports(r > 3 ? "pin-roller" : null);
    loadOf(r > 4 ? { at: 2, P: LOAD } : null);
    gizmo(r === 0);
    if (r === 0 || r === 3) for (const [name, m] of [["Bank A", 0], ["Bank B", SPAN]]) tag(name, () => V(X(m) + (m ? 0.6 : -0.6), top0 + 0.2, 2.4), "bank", false, "scene");
  }

  // The scene's hands, for the rounds' reactions.
  const api = {
    SPAN_T, BEARING, BANK, x: X, at: (x, y, z) => V(x, top0 + y, z),
    line, nodes, supports, load: loadOf, plankAnim, tag,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, fall: kit.fall, climbBack: kit.climbBack, lookUp: kit.lookUp,
    plank: (spec, label) => { plankOf(spec); if (spec && label) tag(label, () => V(0, plankTop() + 1.4, spec.giant ? 0 : -plank.mesh.scale.z / 2)); },
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, ghost, stop: () => plankOf(null) };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "river", chip: "Area 1 · River", def, gh: { url: GH_FILE, name: "River.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - HAND) <= HAND * 0.2 ? `You guessed ${guess}${NB}mm: within a fifth of it. ` : `You guessed ${guess}${NB}mm. `;
      return [
        el("p", "", `${said}OpenSees bends the middle of the plank ${HAND.toFixed(1)}${NB}mm under the alpaca, and Model View draws it eight times bigger.`),
        el("p", "pg-calc", `By hand: δ = PL³ / 48EI = 0.6 × 4³ / (48 × 10${NB}500${NB}000 × 3.125·10⁻⁶) = ${HAND.toFixed(1)}${NB}mm, with I = bh³/12 = 0.3 × 0.05³ / 12 = 3.125·10⁻⁶${NB}m⁴.`),
      ];
    },
    done: { title: "The River is done.", body: "You built the plank the way every Alpaca4d model is built: geometry, a section, elements, supports, loads, Assemble Model, then an analysis. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
