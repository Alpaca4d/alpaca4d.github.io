// Area 5, the Valley: the Playground's lesson on trusses. In seven rounds the player builds the
// Grasshopper definition of a steel truss bridge over the gorge: the deck and its panels, the
// triangles over it, the bars, the supports, the alpaca, the wires into Assemble Model, and the
// analysis, which draws every bar pulled or pushed. Each round but one shows snippets to pick from,
// only one of them right, and the scene shows what each would build; in the sixth the player draws
// the wires.
//
// The definition is valley.gh, written by Alpaca4d's Tools/Examples/PlaygroundValley.py: a Warren
// truss 12 m long in six panels of 2 m, 2 m deep, of steel tubes 100 x 5 mm as Truss bars. Every
// number here is OpenSees's, run on the deck Alpaca4d writes: 0.9 kN in the middle of the top chord,
// 0.75 kN in the bottom chord under it, 0.335 kN in every diagonal; each wrong option's outcome too.
// The panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 12, PANELS = 6, DEPTH = 2;      // m
const LOAD = 0.6;                            // kN: the alpaca, 60 kg
const R = LOAD / 2;                          // kN: what each bank holds up
const TOP = (R * SPAN / 2) / DEPTH;          // kN: the top chord in the middle, pushed
const BOTTOM = (R * (SPAN / 2 - 1)) / DEPTH; // kN: the bottom chord under the top joint at 5 m, pulled
const DIAGONAL = R / (DEPTH / Math.hypot(DEPTH, SPAN / PANELS / 2));   // kN, every diagonal
const STEEL = "#9aa4ae", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c";
// Model View's colours for N: red pulled, blue pushed.
const PULLED = "#f0372e", PUSHED = "#2f56ee";

const ready = loadDefinition(new URL("./valley-definition.json", import.meta.url));
const GH_FILE = new URL("./valley.gh", import.meta.url).href;

// A panel holding a word, for an option that wires one in: like the definition's Grade panel.
const word = (a, id, nick, text, x, y) => {
  const like = JSON.parse(JSON.stringify(a.get("Grade")));
  return { ...like, id, nick, text, src: [], box: [x, y, Math.max(56, text.length * 6.4 + 12), 22] };
};
const FAILED = "Analysis Failed: OpenSees 'analyze' did not converge.";

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Deck", title: "The deck",
    task: `The gorge is 12${NB}m across. Lay the deck's line from Bank A to Bank B and cut it into the truss's panels, six of 2${NB}m. Every cut is a joint, where bars will meet.`,
    tip: "Divide Curve gives the parameters t where it cuts a curve into equal parts; Shatter cuts the curve there.",
    options: [
      { key: "right", says: "Panels 6 into Divide Curve, and its parameters t into Shatter.",
        title: "Six panels, seven joints.", body: `Divide Curve cuts the 12${NB}m deck line into six and Shatter splits it there: six bars of 2${NB}m, the bottom chord. Their ends are the joints, one of them at 6${NB}m, in the middle, where the alpaca will stand.`,
        react: (s) => { s.build({ deckOnly: true }, "line"); s.play(s.wait(0.4), s.hop()); } },
      { key: "five", says: "Panels 5 into Divide Curve, and its parameters t into Shatter.",
        patch: (a) => a.slider("Panels", 5),
        title: "No joint in the middle.", body: `Five panels are 2.4${NB}m each, so the deck's joints are at 4.8 and 7.2${NB}m and none at 6${NB}m, where the alpaca will stand. A load has to sit on a joint: an even number of panels puts one in the middle.`,
        react: (s) => { s.build({ deckOnly: true, panels: 5 }, "line"); s.tag("No joint at 6 m", () => s.at(s.x(6), 1.2, -1.6), "wrong"); } },
      { key: "points", says: "Panels 6 into Divide Curve, and its points P, not its parameters, into Shatter.",
        patch: (a) => a.wire("Bottom chord", "t", a.src("Divide", "P")),
        title: "Shatter wants numbers, not points.", body: "Shatter cuts a curve at parameters, numbers along it. Divide Curve's P are points, and Grasshopper cannot turn a point into a number: Shatter turns red with “Data conversion failed from Point to Number”, and gives nothing out. Its t output is the one.",
        react: (s) => { s.build({ deckOnly: true, onebar: true, dots: false }, "line"); s.tag("Data conversion failed from Point to Number", () => s.at(0, 1.2, -1.6), "wrong"); } },
    ],
  },
  {
    name: "Triangles", title: "The triangles",
    task: `A truss is made of triangles. Over the middle of each panel put a top joint 2${NB}m up, draw a diagonal up to it from the panel's start and one down from it to the panel's end, and run the top chord through the top joints.`,
    tip: "End Points gives each panel's start S and end E. Move lifts the panels' middles by Unit Z, as long as its Factor. Explode cuts a polyline into a line per segment.",
    options: [
      { key: "right", says: "Depth into Unit Z; the panels' starts into Up diagonals' A, the top joints into both lines, the panels' ends into Down diagonals' B; the top chord exploded.",
        title: "Triangles.", body: "Every panel is now a triangle: the deck bar, a diagonal up and a diagonal down, with the top chord tying their tops together. A triangle of bars cannot change shape unless a bar changes length, and that is why trusses are made of them.",
        react: (s) => { s.build({}, "line"); s.play(s.wait(0.4), s.hop()); } },
      { key: "downstart", says: "The panels' starts, not their ends, into Down diagonals' B.",
        patch: (a) => a.wire("Down diagonals", "B", a.src("Panel ends", "S")),
        title: "Those are parallelograms.", body: `Down diagonals' B is the panel's start, where its up diagonal starts too, so every down line lies on an up line and no panel has a diagonal across it. A parallelogram of bars folds flat without any bar stretching, and OpenSees finds nothing to stop it: “${FAILED}”`,
        react: (s) => { s.build({ downstart: true }, "line"); s.collapse("fold", { delay: 0.8 }); s.tag("Parallelograms fold", () => s.at(0, 2.6, -1.6), "wrong"); } },
      { key: "depth", says: "Nothing into Unit Z's Factor: Depth wired nowhere.",
        patch: (a) => a.wire("Lift", "F"),
        title: "A truss 1 m deep.", body: `Nothing goes into Unit Z's Factor, so it takes its default, 1: the top joints are 1${NB}m up, not 2. It solves, but the chords carry twice as much. A truss works like a deep beam whose chords carry the bending moment over the depth: half the depth, twice the force, 1.8${NB}kN in the middle of the top chord.`,
        react: (s) => { s.build({ depth: 1 }, "line"); s.tag("1 m deep: the chords carry twice as much", () => s.at(0, 1.9, -1.6), "wrong"); } },
      { key: "topone", says: "The top chord's polyline going on whole, not exploded.",
        patch: (a) => a.remove("Top bars"),
        title: "One bar for the whole top chord.", body: `The polyline goes on whole. Its points lie on a line, so a Truss takes it without a word, as one bar from the first top joint to the last that touches none between. Those joints are held only by their two diagonals, and the middle of the bridge can drop: “${FAILED}” Explode makes a bar of each segment.`,
        react: (s) => { s.build({ topone: true }, "line"); s.collapse("sag", { delay: 0.8 }); s.tag("One bar, from 1 m to 11 m", () => s.at(0, 2.7, -1.6), "wrong"); } },
    ],
  },
  {
    name: "Bars", title: "The bars",
    task: `Make every line a bar: the beam component switched to Truss, which carries force only along its length. Line takes all four lists, one wire each; Section takes a steel tube 100${NB}mm across with a 5${NB}mm wall, in S355.`,
    tip: "The beam component's Element Type menu switches it to Truss. Hold Shift as you wire a second list into an input that has one, or the new wire replaces it.",
    options: [
      { key: "right", says: "Bottom chord, Up diagonals, Down diagonals and Top bars into Line, the tube into Section, and WorksIn left as it is.",
        title: "Twenty-three bars.", body: "Six deck bars, twelve diagonals and five top bars, each a Truss: a bar pinned at both ends, which carries an axial force N, pulled or pushed, and nothing else. A joint where only bars meet has no bending to pass on, so its rotations mean nothing, and Assemble Model holds them itself.",
        react: (s) => { s.build({}, "steel"); s.play(s.wait(0.4), s.walkTo(s.x(2)), s.hop()); } },
      { key: "tension", says: "The four lists into Line, the tube into Section, and a panel saying Tension into WorksIn.",
        patch: (a) => { const t = a.get("Tube"); a.add(word(a, "works", "Works in", "Tension", t.box[0], t.box[1] + t.box[3] + 16)); a.wire("Truss", "WorksIn", "works"); },
        title: "Tension only: the pushed bars go slack.", body: `WorksIn is Tension, so every bar is a rod that goes slack when it is pushed, like a rope. Under the alpaca the top chord and half the diagonals are pushed: they let go, nothing is left to hold the shape, and “${FAILED}” Tension only is for cables and bracing rods; Both is WorksIn's default.`,
        react: (s) => { s.build({}, "steel", { slack: true }); s.collapse("fall", { delay: 1.8 }); s.play(s.walkTo(s.x(3)), s.wobble(0.5), s.fall(), s.wait(1.2), s.climbBack()); s.tag("Tension only: the pushed bars go slack", () => s.at(0, 3, -1.6), "wrong"); } },
      { key: "notop", says: "Bottom chord and both diagonals into Line, but not the Top bars.",
        patch: (a) => a.wire("Truss", "Line", a.src("Bottom chord", "S"), a.src("Up diagonals", "L"), a.src("Down diagonals", "L")),
        title: "No top chord.", body: `Only three of the four lists reach Line: the top bars are missing, the triangles are open at the top, and the bridge folds in the middle: “${FAILED}” Count the wires into an input: a new one replaces the one there unless Shift is held.`,
        react: (s) => { s.build({ notop: true }, "steel"); s.collapse("fall", { delay: 1.8 }); s.play(s.walkTo(s.x(3)), s.wobble(0.5), s.fall(), s.wait(1.2), s.climbBack()); s.tag("No top chord", () => s.at(0, 2.8, -1.6), "wrong"); } },
      { key: "onebar", says: "The deck line itself, not the Bottom chord, into Line, with the diagonals and Top bars.",
        patch: (a) => a.wire("Truss", "Line", a.src("Deck line", "L"), a.src("Up diagonals", "L"), a.src("Down diagonals", "L"), a.src("Top bars", "S")),
        title: "The deck is one bar.", body: `The whole deck line goes in, so the bottom chord is one bar from bank to bank, joined at its two ends only. The deck's joints between are held by their diagonals alone, and the middle drops: “${FAILED}”`,
        react: (s) => { s.build({ onebar: true }, "steel"); s.collapse("fall", { delay: 1.8 }); s.play(s.walkTo(s.x(3)), s.wobble(0.5), s.fall(), s.wait(1.2), s.climbBack()); s.tag("One bar, bank to bank", () => s.at(0, -0.6, -1.6), "wrong"); } },
    ],
  },
  {
    name: "Supports", title: "The supports",
    task: "Set the bridge on the banks: a pin at Bank A and a roller at Bank B. The bridge has two trusses, and the deck and the bracing between them hold each other upright. This model is one of them, so hold every other joint sideways.",
    tip: "A Support holds every direction left empty: True. Free is False, so each wire from it lets the joint move that way. X runs along the bridge, Y across it and Z up.",
    options: [
      { key: "right", says: "Nothing from Free into the Pin; Free into the Roller's Tx; Free into the Side support's Tx and Tz, at the deck's inner joints and the top joints.",
        title: "A pin, a roller, and held sideways.", body: "The pin holds Bank A along X, Y and Z; the roller holds Bank B up and lets it slide along X as the deck stretches. Every other joint is held along Y only, across the bridge, as the deck and the twin truss hold it. Shift List drops the first panel's start, Bank A, and with Wrap False it does not come back at the end.",
        react: (s) => { s.supports("right"); s.play(s.wait(0.3), s.walkTo(s.x(6)), s.hop()); } },
      { key: "noside", says: "The pin and the roller, and no Side support.",
        patch: (a) => a.remove("Side support"),
        title: "Nothing holds it upright.", body: `Every bar lies in the XZ plane and only pushes and pulls along itself, so nothing stops a joint moving along Y, across the bridge: “${FAILED}” A flat truss in 3D has to be held sideways, by bracing on the bridge and by supports in the model.`,
        react: (s) => { s.supports("noside"); s.collapse("topple", { delay: 1.8 }); s.play(s.walkTo(s.x(3)), s.wobble(0.5), s.fall(), s.wait(1.2), s.climbBack()); s.tag("Nothing holds it along Y", () => s.at(0, 3, -1.6), "wrong"); } },
      { key: "swing", says: "Free into the Roller's Tx and Tz.",
        patch: (a) => a.wire("Roller", "Tz", a.src("Free")),
        title: "Bank B holds nothing up.", body: `Tz is free at Bank B too, so the bridge can swing down about Bank A. Worse, it solves: Truss bars are corotational, they follow the bridge as it turns, and OpenSees finds it at rest hanging straight down from Bank A, its middle 6${NB}m lower. Run Analysis reports nothing wrong, so look at the deformed shape before the numbers.`,
        react: (s) => { s.supports("swing"); s.collapse("swing", { delay: 1.8 }); s.play(s.walkTo(s.x(3)), s.wobble(0.5), s.fall(), s.wait(1.2), s.climbBack()); s.tag("Solved: hanging from Bank A", () => s.at(s.x(0) + 1, 1, -2.2), "wrong"); } },
      { key: "bothpin", says: "Nothing from Free into the Roller's Tx: it holds X as the pin does.",
        patch: (a) => a.wire("Roller", "Tx"),
        title: "Both banks hold it along X.", body: `The roller holds X too, so the deck cannot stretch: the banks pull on its ends instead, with 0.45${NB}kN, and the deck's end bars are pushed. It solves, but real banks give a little, and a steel deck 12${NB}m long grows 7${NB}mm when it warms by 50 degrees: one end has to slide.`,
        react: (s) => { s.supports("bothpin"); s.play(s.wait(0.3), s.walkTo(s.x(6))); s.tag("Held along X at both banks", () => s.at(0, 3, -1.6), "wrong"); } },
    ],
  },
  {
    name: "Alpaca", title: "The alpaca",
    task: `The alpaca, 0.6${NB}kN, will stand on the deck in the middle of the bridge. Put its weight there as a Point Load, on the joint under its feet.`,
    tip: "Curve Middle gives the middle of a curve: which curve is the deck? Unit Z makes a vector along Z as long as its Factor.",
    options: [
      { key: "right", says: "Curve Middle of the deck line into Point, and Alpaca minus 0.60 into Unit Z.",
        title: "On the middle joint.", body: `Curve Middle of the deck line is at 6${NB}m, on the deck's middle joint, and Unit Z turns −0.6 into 0.6${NB}kN down. In a truss every load goes on a joint: a bar has no bending to carry one across its length.`,
        react: (s) => { s.load({ at: 6 }); s.play(s.wait(0.3), s.walkTo(s.x(6)), s.hop()); } },
      { key: "top", says: "Curve Middle of the top chord into Point.",
        patch: (a) => a.wire("Mid-span", "C", a.src("Top chord", "Pl")),
        title: "There is no joint there.", body: `The top chord runs from the first top joint, at 1${NB}m, to the last, at 11${NB}m, so its middle is at 6${NB}m and 2${NB}m up: halfway along a top bar, between the joints at 5 and 7${NB}m. Assemble Model stops: “Point load at location '6,0,2' is not part of the model!”`,
        react: (s) => { s.load({ at: 6, top: true, error: true }); s.tag("Point load at location '6,0,2' is not part of the model!", () => s.at(0, 4.6, -1.9), "wrong"); } },
      { key: "up", says: "Alpaca 0.60, not minus, into Unit Z.",
        patch: (a) => a.slider("Alpaca", 0.6),
        title: "That lifts the bridge.", body: "Z points up, so +0.6 pulls the deck upwards. The bridge would still answer, but every bar's force changes sign: the top chord pulled, the bottom chord pushed. A weight is negative: −0.6.",
        react: (s) => { s.load({ at: 6, up: true }); s.forces(-1); s.tag("Pulled up: every force flips", () => s.at(0, 3.4, -1.9), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Everything is built: wire it into Assemble Model, which makes the model OpenSees will solve. It needs the bars, all three supports and the load pattern.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      offered: ["Bottom chord", "Truss", "Pin", "Roller", "Side support", "The alpaca", "Load Pattern"],
      wants: { Elements: ["Truss"], Supports: ["Pin", "Roller", "Side support"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements, from the Truss", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the bridge has none", Recorders: "recorders: leave it empty and Run Analysis picks one",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Truss: "the truss's bars", Pin: "a support", Roller: "a support", "Side support": "a support", "Load Pattern": "the load pattern",
        "The alpaca": "the alpaca's point load, which goes through the Load Pattern", "Bottom chord": "the deck line cut into segments, only geometry",
      },
      checks: [
        [(has) => has("Elements", "Truss"), "Elements: the truss's bars"],
        [(has) => has("Supports", "Pin") && has("Supports", "Roller") && has("Supports", "Side support"), "Supports: the pin, the roller and the side support"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the bars: drag a wire from Truss's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the bridge.", body: "Assemble Model joins the 23 bars at their 13 joints, and lands the supports and the alpaca's load on joints within its Tolerance, 1 cm. What comes out of AlpacaModel is the truss, ready to solve." },
    },
  },
  {
    name: "Run", title: "Run", guess: { question: "How hard is the top chord pushed in the middle of the bridge?", unit: "kN", step: "0.05", min: 0 },
    task: "Solve it, and see which bars are pulled and which are pushed. First, make a guess.",
    tip: "Run Analysis needs Analysis Settings. Model View draws each bar's axial force N: red where the bar is pulled, blue where it is pushed.",
    options: [
      { key: "right", says: "Assemble Model into Run Analysis, with Analysis Settings, and Run Analysis into Model View.",
        title: `${TOP.toFixed(2)}${NB}kN, pushed.`,
        react: (s) => {
          s.forces(1);
          s.play(s.wait(0.4), s.walkTo(s.x(6)), s.hop(), s.wait(0.6), s.walkTo(s.x(-1.8)));
          s.tag(`${TOP.toFixed(2)} kN pushed`, () => s.at(0, DEPTH * s.k + 0.9, -1.4), "right", true);
          s.tag(`${BOTTOM.toFixed(2)} kN pulled`, () => s.at(s.x(5), -0.9, -1.4), "right");
        } },
      { key: "unsolved", says: "Assemble Model straight into Model View; Run Analysis's output goes nowhere.",
        patch: (a) => a.wire("The bridge", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")),
        title: "Nothing has been solved.", body: "Model View is fed straight from Assemble Model, and its Beam forces need a solved model: “Beam forces need an analysed model, from Run Analysis or another analysis.” It draws the bars as they were built. Feed it the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.tag("Beam forces need an analysed model", () => s.at(0, 3.2, -1.6), "wrong"); } },
      { key: "nosettings", says: "Assemble Model into Run Analysis with nothing in Settings, and Run Analysis into Model View.",
        patch: (a) => a.wire("Run Analysis", "Settings"),
        title: "Run Analysis waits for its settings.", body: "Settings is empty, so Run Analysis stops at “Input parameter Settings failed to collect data” and gives nothing to Model View, which draws nothing. Analysis Settings, left as it is, is a plain static analysis: wire it in.",
        react: (s) => { s.build(null); s.supports(null); s.load(null); s.tag("Input parameter Settings failed to collect data", () => s.at(0, 1.6, -1.6), "wrong"); } },
    ],
  },
];

// ---- The truss: joints and bars, in metres, for each way the rounds can build it ----
// o: panels, depth, deckOnly (the bottom chord alone), onebar (the deck as one bar), notop,
// topone (the top chord as one bar), downstart (the down diagonals drawn over the up ones).
function truss(o = {}) {
  const n = o.panels || PANELS, h = o.depth || DEPTH, p = SPAN / n;
  const joints = [], bars = [];
  for (let i = 0; i <= n; i++) joints.push({ name: `B${i}`, x: i * p, y: 0, deck: true, i });
  const B = (i) => i, T = (i) => n + 1 + i;
  if (o.onebar) bars.push({ a: B(0), b: B(n), kind: "bottom", i: 0, one: true });
  else for (let i = 0; i < n; i++) bars.push({ a: B(i), b: B(i + 1), kind: "bottom", i });
  if (!o.deckOnly) {
    for (let i = 0; i < n; i++) joints.push({ name: `T${i}`, x: (i + 0.5) * p, y: h, i });
    if (o.topone) bars.push({ a: T(0), b: T(n - 1), kind: "top", i: 0, one: true });
    else if (!o.notop) for (let i = 0; i < n - 1; i++) bars.push({ a: T(i), b: T(i + 1), kind: "top", i });
    for (let i = 0; i < n; i++) bars.push({ a: B(i), b: T(i), kind: "up", i });
    for (let i = 0; i < n; i++) bars.push({ a: T(i), b: o.downstart ? B(i) : B(i + 1), kind: "down", i, over: !!o.downstart });
  }
  return { n, h, joints, bars };
}
// The axial force in a bar of the six-panel truss, tension positive, under the alpaca at 6 m: the
// method of sections, which OpenSees matches to the third decimal.
function force(bar) {
  const half = SPAN / 2, p = SPAN / PANELS;
  if (bar.kind === "bottom") { const x = (bar.i + 0.5) * p; return (R * Math.min(x, SPAN - x)) / DEPTH; }
  if (bar.kind === "top") { const x = (bar.i + 1) * p; return -(R * Math.min(x, SPAN - x)) / DEPTH; }
  const left = (bar.i + 0.5) * p < half;
  return (bar.kind === "up") === left ? -DIAGONAL : DIAGONAL;
}

// ---- The scene: the bridge over the gorge, as each round builds it ----
function scene(kit) {
  const { g, area, water, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
  const L = area.span / 2;                    // half the gap between the abutments' middles
  const k = (2 * L) / SPAN;                   // the toy world's metres per real metre
  const Y0 = 1.05;                            // the deck's joints, over the abutments
  const PLANES = [-1.35, 1.35];               // the truss in the model, at the front, and its twin
  const X = (m) => -L + m * k;
  kit.home = -L - 2.6;
  kit.view = { at: V(-1.6, 1.4, 0), w: 21, h: 11 };
  kit.hideStructure();

  // The bridge turns as a whole when it topples or swings; the supports stay on the banks.
  const bridge = new THREE.Group();
  const marks = { pin: new THREE.Group(), roller: new THREE.Group(), side: new THREE.Group(), load: new THREE.Group() };
  g.add(bridge);
  Object.values(marks).forEach((m) => g.add(m));
  const unit = new THREE.CylinderGeometry(1, 1, 1, 8);
  const ball = new THREE.SphereGeometry(1, 10, 8);
  const mats = {
    line: solid(RED, { roughness: 0.5, transparent: true }), steel: solid(STEEL, { roughness: 0.35, metalness: 0.5, transparent: true }),
    slack: solid(INK, { transparent: true, opacity: 0.35 }), joint: solid(INK, { transparent: true }),
    pulled: solid(PULLED, { roughness: 0.45, transparent: true }), pushed: solid(PUSHED, { roughness: 0.45, transparent: true }),
    deck: solid("#b08a5c", { roughness: 0.85, transparent: true }),
  };
  let built = null;      // { shape, mode, rods, dots, planks, sign }
  let anim = null;       // { kind, t, delay, splashed }

  // The truss drawn: a rod per bar and a dot per joint in both planes, and planks across the
  // deck once there are bars. Positions are set every frame, from the joints and the animation.
  function build(o, mode = "line", extra = {}) {
    clear(bridge);
    bridge.position.set(0, 0, 0);
    bridge.rotation.set(0, 0, 0);
    anim = null;
    built = null;
    if (!o) return;
    const shape = truss(o);
    const r = mode === "line" ? 0.05 : 0.085;
    const rods = [], dots = [], planks = [];
    for (const z of PLANES) {
      for (const bar of shape.bars) {
        const slack = extra.slack && force(bar) < 0;
        const m = add(bridge, new THREE.Mesh(unit, slack ? mats.slack : mode === "line" ? mats.line : mats.steel));
        rods.push({ m, bar, z, r: slack ? 0.03 : bar.over ? r * 1.6 : r });
      }
      if (o.dots !== false) for (const [j, joint] of shape.joints.entries()) {
        const d = add(bridge, new THREE.Mesh(ball, mats.joint));
        d.scale.setScalar(mode === "line" ? 0.13 : 0.12);
        dots.push({ m: d, j, z });
      }
    }
    if (mode !== "line") {
      for (let i = 0; i < shape.n; i++) {
        const plank = add(bridge, new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, PLANES[0] - PLANES[1] - 0.1), mats.deck));
        plank.receiveShadow = true;
        planks.push({ m: plank, a: i, b: i + 1 });
      }
    }
    built = { shape, mode, rods, dots, planks, o };
    place(0);
  }
  // Where joint j is now, in the bridge's frame: its place, moved by the animation.
  function jointAt(j, z) {
    const joint = built.shape.joints[j];
    const p = V(X(joint.x), Y0 + joint.y * k, z);
    if (!anim) return p;
    const t = Math.max(0, anim.t - anim.delay);
    if (anim.kind === "fold") {
      // The panels lean over about their deck joints, the top chord moving as one, till they lie flat.
      const a = smooth(Math.min(1, t / 1.4)) * 1.0;
      if (joint.deck) return p;
      const base = V(X(joint.x - SPAN / PANELS / 2), Y0, z);
      const d = p.clone().sub(base);
      return base.add(V(d.x * Math.cos(a) + d.y * Math.sin(a), -d.x * Math.sin(a) + d.y * Math.cos(a), 0));
    }
    if (anim.kind === "sag" || anim.kind === "fall") {
      // The middle drops, the ends staying on the banks; then, for a fall, the lot goes down.
      const sag = Math.sin((Math.PI * joint.x) / SPAN) * smooth(Math.min(1, t / 0.9)) * (anim.kind === "sag" ? 1.6 : 2.4);
      const drop = anim.kind === "fall" ? dropped(t, 0.9) : 0;
      p.y -= sag + drop;
      return p;
    }
    return p;
  }
  // How far a falling bridge has dropped by t: into the gorge, and no further than its floor.
  const dropped = (t, after) => Math.min(Math.max(0, t - after) ** 2 * 9, Y0 - water + 2.5);
  // The point a bridge that turns as a whole turns about: the front edge of the deck when it
  // topples, Bank A's joint when it swings.
  const pivotOf = (kind) => (kind === "topple" ? V(0, Y0, PLANES[0]) : V(X(0), Y0, 0));
  function place(dt) {
    if (!built) return;
    let pivot = null;
    bridge.position.set(0, 0, 0);
    bridge.rotation.set(0, 0, 0);
    if (anim) {
      anim.t += dt;
      const t = Math.max(0, anim.t - anim.delay);
      let lowest = Infinity, at = 0;
      if (anim.kind === "topple") {
        // Over towards the front, about the deck's edge, and down into the gorge.
        pivot = pivotOf("topple");
        bridge.position.copy(pivot).add(V(0, -dropped(t, 0.8), 0));
        bridge.rotation.set(-smooth(Math.min(1, t / 1.0)) * 1.7, 0, 0);
        lowest = Y0 - dropped(t, 0.8) - 1;
      } else if (anim.kind === "swing") {
        // Down about Bank A, till it hangs.
        const a = smooth(Math.min(1, t / 1.3)) * (Math.PI / 2);
        pivot = pivotOf("swing");
        bridge.position.copy(pivot);
        bridge.rotation.set(0, 0, -a);
        lowest = Y0 - Math.sin(a) * SPAN * k;
        at = X(0) + 0.8;
      } else if (anim.kind === "fall") lowest = Y0 - 2.4 - dropped(t, 0.9);
      if (!anim.splashed && lowest < water + 0.2) { anim.splashed = true; kit.makeSplash(at, anim.kind === "topple" ? PLANES[0] - 1 : 0); }
    }
    const spot = (j, z) => { const p = jointAt(j, z); return pivot ? p.sub(pivot) : p; };
    for (const { m, bar, z, r } of built.rods) {
      const a = spot(bar.a, z), b = spot(bar.b, z), d = b.clone().sub(a), len = d.length();
      m.position.copy(a).addScaledVector(d, 0.5);
      m.quaternion.setFromUnitVectors(V(0, 1, 0), d.normalize());
      m.scale.set(r, Math.max(len, 0.001), r);
    }
    for (const { m, j, z } of built.dots) m.position.copy(spot(j, z));
    for (const { m, a, b } of built.planks) {
      const p = spot(a, 0), q = spot(b, 0), d = q.clone().sub(p);
      m.position.copy(p).addScaledVector(d, 0.5);
      m.position.y -= 0.05;
      m.rotation.set(0, 0, Math.atan2(d.y, d.x));
      m.scale.x = d.length();
    }
  }
  function collapse(kind, { delay = 0 } = {}) {
    if (!built) return;
    anim = { kind, t: reduceMotion ? 99 : 0, delay, splashed: reduceMotion };
    place(0);
  }
  // Every bar coloured by its axial force: sign 1 under the alpaca, -1 pulled up.
  function forces(sign) {
    if (!built || built.mode === "line") return;
    built.sign = sign;
    for (const rod of built.rods) {
      const N = force(rod.bar) * sign;
      rod.m.material = N >= 0 ? mats.pulled : mats.pushed;
      rod.r = 0.06 + (0.07 * Math.abs(N)) / TOP;
    }
    place(0);
  }

  // Support marks at the front truss's joints, and its twin's ends: a pyramid for a pin, on
  // rollers for a roller; a small orange wedge beside every joint held sideways.
  function supports(kind) {
    for (const m of [marks.pin, marks.roller, marks.side]) clear(m);
    if (!kind) return;
    const mat = solid(ORANGE), dark = solid(INK);
    const pyramid = (parent, x, z, roller) => {
      const h = roller ? 0.2 : 0.32;
      const p = add(parent, new THREE.Mesh(new THREE.ConeGeometry(0.3, h, 4), mat));
      p.position.set(x, Y0 - 0.06 - h / 2, z);
      if (roller) for (const dx of [-0.16, 0.16]) {
        const c = add(parent, new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.4, 10).rotateX(Math.PI / 2), dark));
        c.position.set(x + dx, Y0 - 0.06 - h - 0.06, z);
      }
    };
    for (const z of PLANES) {
      pyramid(marks.pin, X(0), z, false);
      pyramid(marks.roller, X(SPAN), z, kind !== "bothpin");
    }
    if (kind !== "noside") {
      const shape = truss();
      for (const joint of shape.joints) {
        if (joint.deck && (joint.i === 0 || joint.i === PANELS)) continue;
        const w = add(marks.side, new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.3, 4).rotateX(Math.PI / 2), mat));
        w.position.set(X(joint.x), Y0 + joint.y * k, PLANES[0] - 0.3);
      }
    }
  }
  // The alpaca's load, an arrow in front of the truss: down on the deck's middle joint, up, or
  // on the top chord between joints with a red ring.
  function load(spec) {
    clear(marks.load);
    marks.load.visible = true;
    if (!spec) return;
    const x = X(spec.at), y = spec.top ? Y0 + DEPTH * k : Y0, z = PLANES[0] - 0.6;
    const mat = solid(spec.error ? RED : ORANGE);
    if (spec.up) arrow(marks.load, V(x, y + 0.15, z), V(x, y + 2.4, z), 0.08, mat);
    else arrow(marks.load, V(x, y + 2.4, z), V(x, y + 0.15, z), 0.08, mat);
    if (spec.error) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.06, 6, 20), mat);
      ring.position.set(x, y, PLANES[0] - 0.05);
      marks.load.add(ring);
    }
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    const faint = has && !has("Elements", "Truss");
    for (const m of Object.values(mats)) m.opacity = faint && m !== mats.slack ? 0.25 : m === mats.slack ? 0.35 : 1;
    marks.pin.visible = !has || has("Supports", "Pin");
    marks.roller.visible = !has || has("Supports", "Roller");
    marks.side.visible = !has || has("Supports", "Side support");
    marks.load.visible = !has || has("LoadPatterns", "Load Pattern");
  }

  // Where the alpaca's feet are at x: on the deck as it is now, or on the ground with a step up to
  // it. A bridge that has started to topple or swing has no deck to stand on.
  function surface(x, z = 0) {
    const ground = groundAt(x, z);
    if (!built || !built.planks.length || Math.abs(x) > L + 1.2) return ground;
    if (anim && anim.t > anim.delay && (anim.kind === "topple" || anim.kind === "swing")) return ground;
    const m = Math.max(0, Math.min(SPAN, (x + L) / k)), p = SPAN / built.shape.n;
    const i = Math.min(built.shape.n - 1, Math.floor(m / p)), f = m / p - i;
    const top = mix(jointAt(i, 0).y, jointAt(i + 1, 0).y, f) + 0.02;
    if (Math.abs(x) <= L) return Math.max(top, water);
    return mix(ground, top, smooth(Math.min(1, (L + 1.2 - Math.abs(x)) / 1.2)));
  }

  function setScene(r) {
    build(r > 2 ? {} : r > 1 ? {} : r > 0 ? { deckOnly: true } : null, r > 2 ? "steel" : "line");
    supports(r > 3 ? "right" : null);
    load(r > 4 ? { at: 6 } : null);
    if (r === 0 || r === 3) for (const [name, m] of [["Bank A", 0], ["Bank B", SPAN]]) tag(name, () => V(X(m) + (m ? 0.9 : -0.9), Y0 - 0.4, -2.6), "bank", false, "scene");
  }

  const api = {
    k, x: X, at: (x, y, z) => V(x, Y0 + y, z),
    build, collapse, forces, supports, load, tag,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, fall: (side = -2.6) => kit.fall(side), climbBack: kit.climbBack, lookUp: kit.lookUp,
    zoom: kit.zoom,
  };
  return { api, setScene, frame: place, surface, ghost, stop: () => { clear(bridge); unit.dispose(); ball.dispose(); } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "valley", chip: "Area 5 · Valley", def, gh: { url: GH_FILE, name: "Valley.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - TOP) <= TOP * 0.2 ? `You guessed ${guess}${NB}kN: within a fifth of it. ` : `You guessed ${guess}${NB}kN. `;
      return [
        el("p", "", `${said}OpenSees pushes the middle of the top chord ${TOP.toFixed(2)}${NB}kN and pulls the bottom chord ${BOTTOM.toFixed(2)}${NB}kN under it; every diagonal carries ${DIAGONAL.toFixed(3)}${NB}kN, pushed and pulled in turn. Red bars are pulled, blue ones pushed.`),
        el("p", "pg-calc", `By hand, cut through the middle panel. Each bank holds up half the alpaca, ${R.toFixed(1)}${NB}kN. About the deck joint under it: ${R.toFixed(1)} × 6 = 1.8${NB}kNm, held by the top chord 2${NB}m above: 1.8 / 2 = ${TOP.toFixed(2)}${NB}kN. About the top joint at 5${NB}m: ${R.toFixed(1)} × 5 / 2 = ${BOTTOM.toFixed(2)}${NB}kN in the bottom chord. A diagonal carries the ${R.toFixed(1)}${NB}kN of shear at its slope: ${R.toFixed(1)} / (2 / √5) = ${DIAGONAL.toFixed(3)}${NB}kN.`),
      ];
    },
    done: { title: "The Valley is done.", body: "You built a truss: triangles of bars that only push and pull, set on a pin and a roller and held sideways at every joint. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
