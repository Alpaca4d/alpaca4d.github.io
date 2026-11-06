// Area 7, the Watchtower: one leg of a steel watchtower, a tube 6 m tall carrying its share of the
// platform, and the load at which it buckles. In seven rounds the player builds the Grasshopper
// definition a piece at a time: the leg's line, its tube, the beam, the supports - a pin at the
// foot, the bracing at mid-height and the platform at the head - the platform's load, the wires
// into Assemble Model, and the Linear Buckling Analysis.
//
// The definition is tower.gh, written by Alpaca4d's Tools/Examples/PlaygroundTower.py. The numbers
// are Alpaca4d's, checked by running the leg through Buckling.Analyse with OpenSees as Linear
// Buckling does: CHS 60.3 x 3.2, S235 (E = 210 000 MPa), 8 kN on the head; braced at mid-height
// the load factor is 6.83 with Divisions 8, Euler's 6.76 by hand. The panel, the rounds and the
// alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const H = 6;                             // m, the leg
const LOAD = 8;                          // kN on its head
const E = 210e6;                         // kN/m², S235
const TUBE = { d: 0.0603, t: 0.0032 };
const I = (Math.PI * (TUBE.d ** 4 - (TUBE.d - 2 * TUBE.t) ** 4)) / 64;   // 2.347e-7 m⁴
const EULER = (Math.PI ** 2 * E * I) / 3 ** 2;                            // kN, each 3 m half pinned at both ends
const HAND = EULER / LOAD;                                               // 6.76
// What Linear Buckling finds, through OpenSees: Divisions 8, 2 and the wrong supports and tubes.
const FACTOR = 6.83, COARSE = 8.2, UNBRACED = 1.69, SWAY = 0.931, THIN = 0.73, THICK = 15.1;
const STEEL = "#9aa4ae", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c", DECK = "#a07850";

// Tools/GhCanvas keeps three decimals of a slider: the tube's two are put back as the .gh has them.
const ready = loadDefinition(new URL("./tower-definition.json", import.meta.url)).then((def) => {
  for (const [nick, value] of [["Outside diameter", TUBE.d], ["Wall", TUBE.t]]) {
    const o = def.objects.find((x) => x.nick === nick && x.kind === "slider");
    if (o) o.value = value;
  }
  return def;
});
const GH_FILE = new URL("./tower.gh", import.meta.url).href;

const NOTHING = "Nothing buckles under these loads: no member is compressed by them.";

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Leg", title: "The leg",
    task: `A watchtower stands on four steel legs, and this lesson builds one of them. Draw its line from its foot, at the origin, straight up to its head, 6${NB}m above. The arrows at the foot show which way X, Y and Z point.`,
    tip: "Follow the Height slider's wire: which input of Head does it set?",
    options: [
      { key: "right", says: "Height wired into Head's Z.",
        title: "Straight up.", body: `Z points up in Rhino and in Alpaca4d, so Head is 6${NB}m above Foot and the line stands upright, as a leg should. Construct Point builds a point from its X, Y and Z; an input with nothing wired into it is 0.`,
        react: (s) => { s.line("z"); s.play(s.wait(0.4), s.lookUp()); } },
      { key: "x", says: "Height wired into Head's X.", patch: (a) => { a.wire("Head", "Z"); a.wire("Head", "X", a.src("Height")); },
        title: "That leg lies on the ground.", body: `Height goes into X, so Head is 6${NB}m along X from Foot: the line lies flat on the ground, a beam rather than a leg. A column stands along Z.`,
        react: (s) => { s.line("x"); s.tag("Along X: lying on the ground", () => s.foot(4.5, 1.2, 0), "wrong"); } },
      { key: "y", says: "Height wired into Head's Y.", patch: (a) => { a.wire("Head", "Z"); a.wire("Head", "Y", a.src("Height")); },
        title: "That leg lies on the ground too.", body: `Height goes into Y: the line runs 6${NB}m along Y, flat on the ground. X and Y are the two directions across the ground; up is Z.`,
        react: (s) => { s.line("y"); s.tag("Along Y: lying on the ground", () => s.foot(0, 1.2, -4.5), "wrong"); } },
      { key: "down", says: "Height minus 6 wired into Head's Z.", patch: (a) => a.slider("Height", -6, { min: -10 }),
        title: "That leg goes into the ground.", body: `Height is −6, so Head is 6${NB}m below Foot: the line points down, into the hill. The direction is right and the sign is not: up is +Z.`,
        react: (s) => { s.line("down"); s.play(s.wait(0.3), s.walkTo(-2.4), s.wobble(0.6)); s.tag("Z = −6: into the ground", () => s.foot(0, -1, 0), "wrong"); } },
    ],
  },
  {
    name: "Tube", title: "The tube",
    task: `Give the leg its section: a steel tube 60.3${NB}mm across, with walls 3.2${NB}mm thick, in S235. CircleCS makes a round section, solid or hollow. Which definition builds this tube?`,
    tip: "CircleCS takes the outside Diameter and the wall's Thickness. Hover a slider for its name, and follow each wire to the input it lands on.",
    options: [
      { key: "right", says: "Outside diameter 0.0603 into Diameter, Wall 0.0032 into Thickness, and S235 into Material.",
        title: "That's the tube.", body: `CircleCS takes the outside diameter, 0.0603${NB}m, and the wall, 0.0032${NB}m: a hollow circle with I${NB}=${NB}π(D⁴${NB}−${NB}d⁴)/64${NB}=${NB}2.35·10⁻⁷${NB}m⁴ about any axis. A tube is as stiff one way as any other, so a leg made of one can buckle in any direction.`,
        react: (s) => { s.legs({ r: 1 }, "S235 tube, 60.3 × 3.2 mm"); s.play(s.wait(0.5), s.climb(), s.hop()); } },
      { key: "radius", says: "Radius 0.0302 into Diameter, Wall 0.0032 into Thickness, and S235 into Material.",
        patch: (a) => { a.get("Outside diameter").nick = "Radius"; a.slider("Radius", 0.0302); },
        title: "That tube is half as wide.", body: `0.0302 is the radius, and CircleCS asks for the diameter: the tube is 30${NB}mm across, not 60. I grows with the fourth power of the diameter, so this leg is nine times less stiff: Linear Buckling will find ${THIN}, which means it buckles before the platform's load is even on it.`,
        react: (s) => { s.legs({ r: 0.5 }, "30 mm across"); s.play(s.wait(0.4), s.climb(), s.wait(0.2), s.thenCollapse("half", 1.8, 0.45), s.wait(0.9), s.offTop(), s.fall(2.8), s.wait(0.8), s.climbBack()); s.tag(`Load factor ${THIN}: it buckles`, () => s.foot(0, 11.5, 0), "wrong"); } },
      { key: "nowall", says: "Outside diameter 0.0603 into Diameter, the Wall slider wired to nothing, and S235 into Material.",
        patch: (a) => a.wire("CircleCS", "Thickness"),
        title: "It works, but the walls are 10 mm.", body: `Nothing is wired into Thickness, so CircleCS takes its default, 0.01${NB}m: walls three times as thick as you meant, with 2.8 times the steel. Linear Buckling would find ${THICK} instead of ${FACTOR}. Grasshopper gives no warning, because an optional input left empty takes its default without a word.`,
        react: (s) => { s.legs({ r: 1, thick: true }, "60.3 × 10 mm: 2.8 times the steel"); s.play(s.wait(0.4), s.climb(), s.hop()); } },
      { key: "mm", says: "Outside diameter 60.3 into Diameter, Wall 3.2 into Thickness, and S235 into Material.",
        patch: (a) => { a.slider("Outside diameter", 60.3, { max: 100, digits: 1 }); a.slider("Wall", 3.2, { max: 10, digits: 1 }); },
        title: "That tube is 60 metres across.", body: `Alpaca4d works in metres, so 60.3 means 60.3${NB}m: a tube as wide as a stadium, and Linear Buckling would find a load factor of five billion. Type 0.0603 and 0.0032.`,
        react: (s) => { s.legs({ giant: true }, "60.3 m across, drawn far smaller"); s.zoom(0.45); s.play(s.wait(0.6), s.walkTo(-14, 7), s.lookUp()); } },
    ],
  },
  {
    name: "Beam", title: "The beam",
    task: `Make the leg a beam: a ForceBeamColumn with the tube's section. The bracing will hold the leg at mid-height, 3${NB}m up, and a support holds only a node, so the beam needs a node there.`,
    tip: "Divide Curve gives the points P and the parameters t where it cuts the line; Shatter cuts it at parameters into segments, and ForceBeamColumn makes an element of each.",
    options: [
      { key: "right", says: "Elements 2 into Divide Curve, its parameters t into Shatter, Shatter's segments into Line, and the tube into Section.",
        title: "Two elements, a node at mid-height.", body: `Divide Curve cuts the 6${NB}m line in two and Shatter splits it there: ForceBeamColumn makes an element of each half. Their ends are the nodes, at the foot, at mid-height and at the head.`,
        react: (s) => { s.nodes([0, 3, 6]); s.play(s.wait(0.4), s.hop()); } },
      { key: "one", says: "The line itself into Line, Shatter's segments going nowhere, and the tube into Section.",
        patch: (a) => a.wire("Leg", "Line", a.src("Leg line", "L")),
        title: "One element, no node at mid-height.", body: "The whole line goes into Line, so the leg is one element with a node at each end. When the bracing holds the leg at 3 m, Assemble Model will stop: “Support node at location '0,0,3' is not part of the model!”",
        react: (s) => { s.nodes([0, 6]); s.tag("No node at mid-height", () => s.foot(0.6, 4.5, 0), "wrong"); } },
      { key: "three", says: "Elements 3 into Divide Curve, its parameters into Shatter, Shatter's segments into Line, and the tube into Section.",
        patch: (a) => a.slider("Elements", 3),
        title: "Three elements, still no node at mid-height.", body: "Elements is 3, so the nodes are at 2 m and 4 m, and the bracing at 3 m lands on none: “Support node at location '0,0,3' is not part of the model!” An even number of elements puts a node at mid-height.",
        react: (s) => { s.nodes([0, 2, 4, 6]); s.tag("Nodes at 2 m and 4 m", () => s.foot(0.6, 4.5, 0), "wrong"); } },
      { key: "points", says: "Elements 2 into Divide Curve, its points P, not its parameters, into Shatter's t, and Shatter's segments into Line.",
        patch: (a) => a.wire("Shatter", "t", a.src("Divide", "P")),
        title: "Points are not parameters.", body: "Divide Curve gives points (P) and parameters (t). Shatter's t takes parameters, numbers along the curve, and Grasshopper cannot turn a point into one: Shatter turns orange with “Data conversion failed from Point to Number”, cuts nothing, and ForceBeamColumn is left with no line.",
        react: (s) => { s.legs(null); s.tag("Data conversion failed from Point to Number", () => s.foot(0, 4.5, 0), "wrong"); } },
    ],
  },
  {
    name: "Supports", title: "The supports",
    task: "Hold the leg as the tower holds it: a pin at its foot, the bracing at mid-height and the platform at its head. The bracing and the platform hold it sideways only; neither carries its load, so the leg still shortens under it.",
    tip: "A Support holds every direction left empty: True. Free is False, so each wire from it lets the leg move that way: Tx, Ty and Tz along X, Y and Z, Rx, Ry and Rz about them.",
    options: [
      { key: "right", says: "Free into the Top's and the Brace's Tz, Rx, Ry and Rz, and into the Base's Rx and Ry.",
        title: "Held sideways at three heights.", body: "The base holds the foot, and stops the leg spinning about its own axis; the brace and the top hold it along X and Y only. The leg can shorten and turn at all three, so each half buckles as a column pinned at both ends, 3 m long.",
        react: (s) => { s.supports("right"); s.play(s.wait(0.4), s.climb(), s.hop()); } },
      { key: "topz", says: "Free into the Brace's Tz, Rx, Ry and Rz and the Base's Rx and Ry; the Top's Rx, Ry and Rz free, but its Tz left unwired.",
        patch: (a) => a.wire("Top", "Tz"),
        title: "The top carries the load itself.", body: `Nothing frees the Top's Tz, so the support at the head holds Z: the platform's load goes straight into it, and the leg below carries none of it. Linear Buckling will say “${NOTHING}” The platform rests on its legs; it does not hang from the sky.`,
        react: (s) => { s.supports("topz"); s.tag("Nothing buckles: the top takes Z", () => s.foot(0.6, 12.2, 0), "wrong"); } },
      { key: "bracetx", says: "As the pin, brace and top, but Free wired into the Brace's Ty as well: the brace holds X only.",
        patch: (a) => a.wire("Brace", "Ty", a.src("Free")),
        title: "Braced one way only.", body: `The brace holds the leg along X but not along Y, so the leg buckles along Y over its whole 6${NB}m: Linear Buckling finds ${UNBRACED}, a quarter of the ${FACTOR} of the leg braced both ways. A tube is as weak one way as the other, so its bracing has to hold it both ways.`,
        react: (s) => { s.supports("bracetx"); s.mode("half", "y"); s.tag(`${UNBRACED}: it buckles along Y`, () => s.foot(0, 11.5, 0), "wrong"); } },
      { key: "topfree", says: "As the pin, brace and top, but Free wired into the Top's Tx and Ty as well: the top holds nothing sideways.",
        patch: (a) => { a.wire("Top", "Tx", a.src("Free")); a.wire("Top", "Ty", a.src("Free")); },
        title: "The head is free to sway.", body: `Nothing holds the head sideways, so the leg sways above the brace like a flagpole: Linear Buckling finds ${SWAY} and warns “The first load factor is ${SWAY}: the model buckles before its loads are reached.” The platform has to be braced as well, to hold the legs' heads where they are.`,
        react: (s) => { s.supports("topfree"); s.play(s.wait(0.4), s.climb(), s.wait(0.2), s.thenCollapse("sway", 3.2, 0.22), s.wait(0.8), s.offTop(), s.fall(2.8), s.wait(0.8), s.climbBack()); s.tag(`Load factor ${SWAY}: it buckles`, () => s.foot(0, 12, 0), "wrong"); } },
    ],
  },
  {
    name: "Platform", title: "The platform",
    task: `The platform puts 8${NB}kN on each leg: its own weight, the people on it and an alpaca or two. Put that on the leg's head as a Point Load, in a Load Pattern.`,
    tip: "Unit Z makes a vector along Z as long as its F. The platform sits on Head, where the leg ends.",
    options: [
      { key: "right", says: "Platform minus 8 into Unit Z, Unit Z into Force, and Head into Point.",
        title: "8 kN down on the head.", body: `Unit Z turns −8 into a vector 8${NB}kN long pointing down, on the leg's head. It squeezes the leg along its length: the load a column buckles under.`,
        react: (s) => { s.load("down"); s.play(s.wait(0.4), s.climb(), s.hop()); } },
      { key: "up", says: "Platform 8 into Unit Z, Unit Z into Force, and Head into Point.",
        patch: (a) => a.slider("Platform", 8),
        title: "That pulls the leg up.", body: `+8 points up: the platform would pull the leg out of the ground, stretching it. A leg in tension cannot buckle, and Linear Buckling will say “${NOTHING}” A weight is negative: −8.`,
        react: (s) => { s.load("up"); s.tag("8 kN up", () => s.foot(0, 13.5, 0), "wrong"); } },
      { key: "8000", says: "Platform minus 8000 into Unit Z, Unit Z into Force, and Head into Point.",
        patch: (a) => a.slider("Platform", -8000, { min: -10000, max: 0, digits: 0 }),
        title: "8000 kN crushes the tower.", body: `Alpaca4d works in kN, so 8000 is 8000${NB}kN: eight hundred tonnes. Linear Buckling warns “The first load factor is 0.007: the model buckles before its loads are reached.” 8000${NB}N is 8${NB}kN.`,
        react: (s) => { s.load("big"); s.collapse("braced", 2.2, 0.55); s.tag("8000 kN: eight hundred tonnes", () => s.foot(0, 14, 0), "wrong"); } },
      { key: "foot", says: "Platform minus 8 into Unit Z, Unit Z into Force, and Foot, not Head, into Point.",
        patch: (a) => a.wire("The platform", "Point", a.src("Foot", "Pt")),
        title: "That load lands on the foot.", body: `The load goes on the leg's foot, where the base takes it straight into the ground: nothing squeezes the leg, and Linear Buckling will say “${NOTHING}” The platform sits on the head.`,
        react: (s) => { s.load("foot"); s.tag("On the foot, not the head", () => s.foot(1.2, 3, 0), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Everything is built: now wire it into Assemble Model. It needs the leg's elements, all three supports and the load pattern.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The five it needs, one under the other, and two that people wire in by mistake.
      offered: ["Shatter", "Leg", "Top", "Brace", "Base", "The platform", "Load Pattern"],
      wants: { Elements: ["Leg"], Supports: ["Top", "Brace", "Base"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements, from ForceBeamColumn", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the leg has none", Recorders: "recorders, and Linear Buckling makes its own",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Leg: "the leg's elements", Top: "a support", Brace: "a support", Base: "a support", "Load Pattern": "the load pattern",
        "The platform": "the platform's point load, which goes through the Load Pattern", Shatter: "the line's segments, only geometry",
      },
      checks: [
        [(has) => has("Elements", "Leg"), "Elements: the leg's elements"],
        [(has) => has("Supports", "Top") && has("Supports", "Brace") && has("Supports", "Base"), "Supports: the top, the brace and the base"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the leg: drag a wire from Leg's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the model.", body: "Assemble Model joins the two halves at mid-height, and lands the three supports and the load on their nodes. Three supports go into one input: the second and the third needed Shift." },
    },
  },
  {
    name: "Buckle", title: "Buckle", guess: { question: "How many times the platform's load can the leg carry before it buckles?", unit: "times", step: "0.1", min: 0 },
    task: "Find the load the leg buckles under. Linear Buckling Analysis gives it as a load factor: what the loads are multiplied by for the leg to buckle. First, make a guess.",
    tip: "Linear Buckling splits every beam into Divisions pieces for the analysis: a member that buckles between its ends needs several.",
    options: [
      { key: "right", says: "Assemble Model into Linear Buckling with Divisions 8, its Load Factors into a panel, and its model into Model View.",
        title: `${FACTOR} times the load.`,
        react: (s) => { s.mode("braced", "x"); s.play(s.wait(0.4), s.climb(), s.hop()); s.tag(`Load factor ${FACTOR}`, () => s.foot(0, 12.4, 0), "right", true); } },
      { key: "one", says: "Assemble Model into Linear Buckling with Divisions 1, its Load Factors into a panel, and its model into Model View.",
        patch: (a) => a.slider("Divisions", 1),
        title: "Nothing buckles, it says.", body: `With Divisions 1 each half of the leg is a single element, held sideways at both ends: there is no node between them to buckle at. Linear Buckling warns “${NOTHING}” and remarks that a member buckling on its own, between its ends, needs Divisions of 4 or more. Its Load Factors are empty, and Model View draws nothing.`,
        react: (s) => { s.tag("Nothing buckles: no node to buckle at", () => s.foot(0.6, 12.4, 0), "wrong"); } },
      { key: "two", says: "Assemble Model into Linear Buckling with Divisions 2, its Load Factors into a panel, and its model into Model View.",
        patch: (a) => a.slider("Divisions", 2),
        title: `${COARSE.toFixed(2)}: a fifth too high.`, body: `Two straight pieces to a half wave bend too stiffly: Linear Buckling finds ${COARSE.toFixed(2)}, 20${NB}% above the leg's real strength, on the unsafe side. The pieces come at it from above, as 1/n²: 4 give 7.10, 8 give ${FACTOR}, 16 give 6.77.`,
        react: (s) => { s.mode("coarse", "x"); s.tag(`${COARSE.toFixed(2)}: drawn in straight pieces`, () => s.foot(0, 12.4, 0), "wrong"); } },
    ],
  },
];

// ---- The scene: the tower's four legs, the bracing and the platform, as each round builds them ----
// Shapes along a leg, s from its foot (0) to its head (1), as a sideways movement of at most 1.
const SHAPES = {
  braced: (s) => Math.sin(2 * Math.PI * s),                 // held at the foot, mid-height and head
  half: (s) => Math.sin(Math.PI * s),                        // held at the foot and head only
  sway: (s) => (s <= 0.5 ? -0.3 * Math.sin(2 * Math.PI * s) : ((s - 0.5) / 0.5) ** 1.6 - 0.3 * Math.sin(2 * Math.PI * s)),
  coarse: (s) => { const at = [0, 1, 0, -1, 0], u = Math.min(3.999, s * 4), i = Math.floor(u); return mix(at[i], at[i + 1], u - i); },
};

function scene(kit) {
  const { g, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
  const K = 1.5;                       // the toy world's metres per real metre
  const HT = H * K;                    // the legs' height
  const SP = 1.4;                      // the legs stand at (±SP, ±SP)
  const LEGS = [[-1, 1], [1, 1], [1, -1], [-1, -1]];   // the one the lesson builds first
  const DECK_T = 0.3, DECK_W = 3.9;
  kit.home = -7.4;
  kit.view = { at: V(-1.4, 4.8, 0), w: 21, h: 17 };
  kit.hideStructure();

  const parts = { line: new THREE.Group(), gizmo: new THREE.Group(), legs: new THREE.Group(), nodes: new THREE.Group(),
    pins: new THREE.Group(), brace: new THREE.Group(), top: new THREE.Group(), load: new THREE.Group() };
  Object.values(parts).forEach((p) => g.add(p));
  const steel = (spec) => solid(STEEL, { roughness: 0.35, metalness: 0.55, transparent: true, ...(spec && spec.thick ? { color: "#7d8791" } : {}) });
  const orange = solid(ORANGE), ink = solid(INK), red = solid(RED, { roughness: 0.5 });
  const deckMat = solid(DECK, { transparent: true });
  const deck = add(g, new THREE.Mesh(new THREE.BoxGeometry(DECK_W, DECK_T, DECK_W), deckMat));
  deck.receiveShadow = true;

  // What the scene shows now.
  const st = { legs: null, supports: null, load: null, mode: null, up: false, faint: false };

  // Round 1's line, red as Grasshopper previews a curve, from the first leg's foot: up (z), along X,
  // along Y (the area's -z), or down into the hill, seen through it.
  const footAt = V(LEGS[0][0] * SP, 0, LEGS[0][1] * SP);
  function line(dir) {
    clear(parts.line);
    if (!dir) return;
    const a = footAt.clone();
    const b = dir === "z" ? a.clone().add(V(0, HT, 0)) : dir === "x" ? a.clone().add(V(HT, 0.12, 0)) : dir === "y" ? a.clone().add(V(0, 0.12, -HT)) : a.clone().add(V(0, -HT, 0));
    if (dir === "x" || dir === "y") a.y += 0.12;
    const mat = dir === "down" ? new THREE.MeshBasicMaterial({ color: RED, transparent: true, opacity: 0.75, depthTest: false }) : red;
    const r = rod(parts.line, a, b, 0.08, mat);
    r.renderOrder = 5;
    for (const p of [a, b]) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 6), mat); s.position.copy(p); s.renderOrder = 5; parts.line.add(s); }
    if (dir === "down") {
      const hole = new THREE.Mesh(new THREE.RingGeometry(0.25, 0.5, 16).rotateX(-Math.PI / 2), solid(INK));
      hole.position.copy(a).add(V(0, 0.04, 0));
      parts.line.add(hole);
    }
  }
  // Rhino's axes at the foot, with their names.
  function gizmo(on) {
    clear(parts.gizmo);
    if (!on) return;
    const o = footAt.clone().add(V(0, 0.06, 0)), len = 2.4;
    for (const [name, d, c] of [["X", V(1, 0, 0), "#e23b3b"], ["Y", V(0, 0, -1), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
      arrow(parts.gizmo, o, o.clone().addScaledVector(d, len), 0.06, solid(c));
      tag(name, () => o.clone().addScaledVector(d, len + 0.5), "axis", false, "scene");
    }
  }

  // The four legs as the tube builds them, each a cylinder in pieces so it can bend: thinner for
  // the radius, one squat drum for the tube 60 m across.
  function legsOf(spec) {
    clear(parts.legs);
    st.legs = spec;
    parts.line.visible = !spec;
    if (!spec) return;
    if (spec.giant) {
      const drum = add(parts.legs, new THREE.Mesh(new THREE.CylinderGeometry(12, 12, HT, 40, 1), steel()));
      drum.position.y = HT / 2;
      drum.userData.giant = true;
      return;
    }
    const r = 0.17 * spec.r * (spec.thick ? 1.08 : 1);
    for (const [sx, sz] of LEGS) {
      const geo = new THREE.CylinderGeometry(r, r, HT, 12, 32).translate(0, HT / 2, 0);
      const m = add(parts.legs, new THREE.Mesh(geo, steel(spec)));
      m.position.set(sx * SP, 0, sz * SP);
      m.userData.rest = geo.attributes.position.array.slice();
    }
  }

  // Nodes, as dots on the first leg, at heights in metres.
  function nodes(at) {
    clear(parts.nodes);
    for (const m of at || []) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), solid(INK));
      dot.userData.s = m / H;
      parts.nodes.add(dot);
    }
  }

  // The supports as the tower makes them: a pin under each foot, the bracing round the legs at
  // mid-height, the platform's frame at their heads; a hold from above for the top that takes Z.
  function supports(kind) {
    st.supports = kind;
    clear(parts.pins); clear(parts.brace); clear(parts.top);
    if (!kind) return;
    for (const [sx, sz] of LEGS) {
      const p = add(parts.pins, new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 4), orange));
      p.position.set(sx * SP, 0.3, sz * SP);
    }
    const ring = (grp, y, alongX, alongZ, diagonals) => {
      for (const [a, b] of [[0, 1], [3, 2], [1, 2], [0, 3]]) {
        const along = LEGS[a][1] === LEGS[b][1] ? "x" : "z";
        if ((along === "x" && !alongX) || (along === "z" && !alongZ)) continue;
        const pa = V(LEGS[a][0] * SP, y, LEGS[a][1] * SP), pb = V(LEGS[b][0] * SP, y, LEGS[b][1] * SP);
        rod(grp, pa, pb, 0.09, orange);
        if (diagonals) for (const [y0, y1] of diagonals) {
          rod(grp, V(pa.x, y0, pa.z), V(pb.x, y1, pb.z), 0.05, orange);
          rod(grp, V(pb.x, y0, pb.z), V(pa.x, y1, pa.z), 0.05, orange);
        }
      }
    };
    // The bracing at mid-height, its struts tied down to the feet by diagonals; the frame at the
    // head, tied to mid-height. Held along X only, the struts and diagonals across Z are missing.
    ring(parts.brace, HT / 2, true, kind !== "bracetx", [[0.3, HT / 2]]);
    if (kind !== "topfree") ring(parts.top, HT - 0.05, true, true, kind === "bracetx" ? null : [[HT / 2, HT - 0.05]]);
    if (kind === "topz") {
      for (const [sx, sz] of LEGS) {
        const p = add(parts.top, new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.6, 4).rotateX(Math.PI), orange));
        p.position.set(sx * SP, HT + DECK_T + 0.5, sz * SP);
        rod(parts.top, V(sx * SP, HT + DECK_T + 0.8, sz * SP), V(sx * SP, HT + 6, sz * SP), 0.04, ink);
      }
    }
  }

  // The platform's load, an arrow on each head: down, up, huge, or on the feet instead.
  function loadOf(kind) {
    st.load = kind;
    clear(parts.load);
    if (!kind) return;
    for (const [sx, sz] of LEGS) {
      const h = new THREE.Group();
      h.userData.foot = kind === "foot";
      const out = kind === "foot" ? 0.9 : 0;   // beside the foot, outside the bracing
      h.userData.at = V(sx * (SP + out), 0, sz * (SP + out));
      const len = kind === "big" ? 6 : 2.6, r = kind === "big" ? 0.18 : 0.09;
      if (kind === "up") arrow(h, V(0, 0.1, 0), V(0, len + 0.1, 0), r, orange);
      else arrow(h, V(0, len + 0.1, 0), V(0, 0.1, 0), r, orange);
      parts.load.add(h);
    }
  }

  // A buckled shape: drawn swinging, as Model View animates a mode, or growing until the tower
  // gives way.
  function modeOf(shape, dir) { st.mode = { shape, dir, kind: "swing", t: 0, amp: 0.55 }; }
  function collapseOf(shape, amp, drop) {
    st.mode = { shape, dir: shape === "sway" ? "x" : shape === "half" ? "y" : "x", kind: "collapse", t: 0, amp, drop };
    if (reduceMotion) st.mode.t = 10;
  }
  // How far the legs are bent now, and how much they have sunk.
  function bentNow() {
    const m = st.mode;
    if (!m) return { a: 0, sink: 1 };
    if (m.kind === "swing") return { a: reduceMotion ? m.amp : m.amp * Math.sin(kit.time() * 2.4), sink: 1 };
    const t = smooth(Math.min(1, m.t / 1.3));
    return { a: m.amp * t, sink: 1 - m.drop * t * t };
  }
  const dirVec = () => (st.mode && st.mode.dir === "y" ? V(0, 0, -1) : V(1, 0, 0));
  // Where a leg's point at s has moved to, on the first leg.
  const legPoint = (s, b = bentNow()) => {
    const shape = st.mode ? SHAPES[st.mode.shape] : () => 0;
    return footAt.clone().add(V(0, s * HT * b.sink, 0)).addScaledVector(dirVec(), b.a * shape(s));
  };
  const deckTop = (b = bentNow()) => HT * b.sink + DECK_T;

  function bend() {
    const b = bentNow(), shape = st.mode ? SHAPES[st.mode.shape] : () => 0, d = dirVec();
    for (const m of parts.legs.children) {
      if (m.userData.giant) continue;
      const pos = m.geometry.attributes.position, rest = m.userData.rest;
      for (let i = 0; i < pos.count; i++) {
        const y = rest[i * 3 + 1], w = b.a * shape(y / HT);
        pos.array[i * 3] = rest[i * 3] + d.x * w;
        pos.array[i * 3 + 1] = y * b.sink;
        pos.array[i * 3 + 2] = rest[i * 3 + 2] + d.z * w;
      }
      pos.needsUpdate = true;
      m.geometry.computeVertexNormals();
    }
    const head = shape(1) * b.a, mid = shape(0.5) * b.a;
    deck.position.set(d.x * head, HT * b.sink + DECK_T / 2, d.z * head);
    deck.rotation.set(d.z ? 0.12 * head : 0, 0, d.x ? -0.12 * head : 0);
    parts.brace.position.set(d.x * mid, (b.sink - 1) * HT / 2, d.z * mid);
    parts.top.position.set(d.x * head, (b.sink - 1) * HT, d.z * head);
    parts.nodes.children.forEach((dot) => dot.position.copy(legPoint(dot.userData.s, b)));
    parts.load.children.forEach((h) => {
      const at = h.userData.at, move = h.userData.foot ? 0 : head;
      h.position.set(at.x + d.x * move, h.userData.foot ? groundAt(at.x, at.z) : deckTop(b), at.z + d.z * move);
    });
  }

  // Up the outside of the first leg's face and onto the platform; off it again, to one side.
  const climb = () => {
    let x0, y0;
    return { dur: 1.7, start() { x0 = al.x; y0 = groundAt(al.x, 0); al.y = y0; }, run(t) {
      const xA = -SP - 0.9;
      if (t < 0.25) { const u = t / 0.25; al.x = mix(x0, xA, u); al.y = groundAt(al.x, 0); al.lift = Math.abs(Math.sin(u * 9)) * 0.25; }
      else if (t < 0.85) { const u = (t - 0.25) / 0.6; al.x = xA; al.y = mix(y0, deckTop() + 0.4, smooth(u)); al.pitch = -0.5 * Math.sin(Math.PI * u); al.lift = 0; }
      else { const u = (t - 0.85) / 0.15; al.x = mix(xA, -0.4, u); al.y = deckTop() + 0.4 * (1 - u); al.pitch = 0; }
      if (t === 1) { st.up = true; al.y = null; }
    } };
  };
  const offTop = () => kit.step(0.01, () => {}, () => { al.y = deckTop(); st.up = false; });
  // Where the alpaca's feet are: on the platform when it is up there, on the ground otherwise.
  function surface(x, z) {
    if (st.up && Math.abs(x - deck.position.x) < DECK_W / 2 + 0.2 && Math.abs(z) < DECK_W / 2) return deckTop();
    return groundAt(x, z);
  }

  function frame(dt) {
    if (st.mode) st.mode.t += dt;
    deckMat.opacity = st.legs && !st.legs.giant ? (st.faint ? 0.35 : 1) : 0.3;
    parts.legs.children.forEach((m) => { m.material.opacity = st.faint ? 0.3 : 1; });
    deck.visible = !(st.legs && st.legs.giant);
    bend();
  }

  // The scene as the rounds before r left it.
  function setScene(r) {
    st.mode = null;
    st.up = false;
    st.faint = false;
    line(r === 1 ? "z" : null);
    gizmo(r === 0);
    legsOf(r > 1 ? { r: 1 } : null);
    nodes(r > 2 ? [0, 3, 6] : null);
    supports(r > 3 ? "right" : null);
    loadOf(r > 4 ? "down" : null);
    if (r === 0) tag("Foot", () => footAt.clone().add(V(-0.9, 0.3, 0.9)), "bank", false, "scene");
    if (r > 1 && r < 4) tag("This leg", () => legPoint(0.75).add(V(-0.6, 0, 0.6)), "bank", false, "scene");
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    st.faint = !!has && !has("Elements", "Leg");
    parts.pins.visible = !has || has("Supports", "Base");
    parts.brace.visible = !has || has("Supports", "Brace");
    parts.top.visible = !has || has("Supports", "Top");
    parts.load.visible = !has || has("LoadPatterns", "Load Pattern");
  }

  const api = {
    foot: (x, y, z) => footAt.clone().add(V(x, y, z)),
    line, nodes, supports, load: loadOf, tag,
    legs: (spec, label) => { legsOf(spec); if (spec && label) tag(label, () => (spec.giant ? V(0, HT + 2, 0) : legPoint(0.55).add(V(-0.9, 0, 0.9)))); },
    mode: modeOf, collapse: collapseOf, thenCollapse: (shape, amp, drop) => kit.step(0.01, () => {}, () => collapseOf(shape, amp, drop)), climb, offTop,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, fall: kit.fall, climbBack: kit.climbBack, lookUp: kit.lookUp,
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, ghost, stop: () => { legsOf(null); g.remove(deck); } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "tower", chip: "Area 7 · Watchtower", def, gh: { url: GH_FILE, name: "Watchtower.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - FACTOR) <= FACTOR * 0.2 ? `You guessed ${guess}: within a fifth of it. ` : `You guessed ${guess}. `;
      return [
        el("p", "", `${said}Linear Buckling finds a load factor of ${FACTOR}: the leg buckles at ${FACTOR} × 8 = ${(FACTOR * LOAD).toFixed(1)}${NB}kN, into the shape Model View draws, a full wave with its middle held by the bracing. Unbraced it would buckle at ${UNBRACED} times the load, a quarter as much.`),
        el("p", "pg-calc", `By hand: braced at mid-height, each half is a column pinned at both ends, L = 3${NB}m. P_cr = π²EI / L² = π² × 210${NB}000${NB}000 × 2.347·10⁻⁷ / 3² = ${EULER.toFixed(1)}${NB}kN, and ${EULER.toFixed(1)} / 8 = ${HAND.toFixed(2)}. Linear Buckling's ${FACTOR} is 1.2${NB}% above it: 8 straight pieces to a half wave come at the curve from above.`),
      ];
    },
    done: { title: "The Watchtower is done.", body: "You found the load a slender leg buckles under, and how its supports change it: a pin at the foot and bracing at mid-height make it four times as strong as a leg held at its ends only, without a gram more steel. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
