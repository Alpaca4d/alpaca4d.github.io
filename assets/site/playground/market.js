// Area 6, the Market: predict, then check. A market stall's shelf - the River's plank, 4 m long, on
// two trestles 3 m apart with its last metre sticking out - carries a crate of apples between the
// trestles and the alpaca on its end. In five rounds the player sets the trestles, predicts what
// they carry, reads the reactions from the model, finds the output that holds the bending, and
// says how big the largest moment is and where.
//
// The definition is market.gh, written by Alpaca4d's Tools/Examples/PlaygroundMarket.py. The
// numbers are OpenSees's, and equilibrium's by hand: trestle A 0.3 kN, trestle B 1.3 kN; Mz
// +0.45 kNm under the crate, sagging, and -0.6 kNm over trestle B, hogging. The panel, the rounds
// and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const LENGTH = 4, B_AT = 3, CRATE_AT = 1.5;   // m: the shelf, trestle B, the crate
const CRATE = 1.0, ALPACA = 0.6;              // kN, down
const LOADS = [{ a: CRATE_AT, P: CRATE }, { a: LENGTH, P: ALPACA }];
const EI = (10.5e6 * 0.3 * 0.05 ** 3) / 12;   // kNm²: C24, 300 x 50 mm lying flat
const EXAGGERATE = 25;                        // the bend, drawn bigger than it is...
const REACH = 1.1;                            // ...but never more than this far, in the toy world
const TIMBER = "#d7a865", WOOD = "#8a6a4a", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c";
const GREEN = "#7f9a1c", BLUE = "#4288f7", PURPLE = "#9e35da";
const LARGEST = 0.6;                          // kNm, over trestle B
const TURN = Math.PI / 4;                     // the stall, turned in its area to face the camera
const fmt = (v) => String(+Math.abs(v).toFixed(2));

const ready = loadDefinition(new URL("./market-definition.json", import.meta.url));
const GH_FILE = new URL("./market.gh", import.meta.url).href;

// The shelf by statics, on a pin at 0 and a roller at B: the reactions, the bending moment Mz
// (sagging positive) and the shear Vy = dMz/dx, at x m from trestle A.
function statics(B, loads) {
  const RB = loads.reduce((s, l) => s + l.P * l.a, 0) / B;
  const RA = loads.reduce((s, l) => s + l.P, 0) - RB;
  const M = (x) => RA * x - loads.reduce((s, l) => s + (x > l.a ? l.P * (x - l.a) : 0), 0) + (x > B ? RB * (x - B) : 0);
  const Vy = (x) => RA - loads.reduce((s, l) => s + (x > l.a ? l.P : 0), 0) + (x > B ? RB : 0);
  return { RA, RB, M, Vy };
}
// How far the shelf goes up (positive) at each of xs, from w'' = M/EI with w = 0 at both trestles.
function bendOf(B, loads, xs) {
  const { M } = statics(B, loads);
  const n = 400, h = LENGTH / n, slope = [0], w = [0];
  for (let i = 1; i <= n; i++) {
    slope[i] = slope[i - 1] + ((M((i - 1) * h) + M(i * h)) / 2) * h / EI;
    w[i] = w[i - 1] + ((slope[i - 1] + slope[i]) / 2) * h;
  }
  const at = (x) => { const t = Math.max(0, Math.min(n, x / h)), i = Math.min(n - 1, Math.floor(t)); return mix(w[i], w[i + 1], t - i); };
  const c = -at(B) / B;
  return xs.map((x) => (x < 0 ? c * x : at(x) + c * x));
}

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Stall", title: "The stall",
    task: `A market stall's shelf: the River's plank, 4${NB}m long, resting on two trestles. Trestle A is under its start, trestle B 3${NB}m along, so that the last metre sticks out, and the alpaca stands out there. A crate of apples sits half way between the trestles. Which definition puts trestle B there?`,
    tip: "Follow the Trestle B at slider into the Roller's Position. Free frees what each trestle lets the shelf do: a wire from it means free.",
    // The cards show the trestles only: the rest of the stall comes in as stand-ins.
    layout: (a) => { for (const n of ["Length", "End", "Shelf line", "Elements", "Divide", "Shatter", "Plank width", "Plank thickness", "Grade", "Material Library Elastic", "RectangleCS", "Shelf", "Crate at", "Crate point", "Crate", "Crate weight", "The crate", "Alpaca", "Alpaca weight", "The alpaca", "Load Pattern", "Assemble Model", "Analysis Settings", "Run Analysis", "Start"]) a.remove(n); a.move("Free", -280, 0); a.move("Pin", -495, 0); a.move("Roller", -495, 0); },
    options: [
      { key: "right", says: "Trestle B at 3.0 into the Roller's Position, and Free into the Pin's Ry and Rz and the Roller's Tx, Ry and Rz.",
        title: "3 m apart, 1 m sticking out.", body: `Trestle B is 3${NB}m along and the shelf goes on to 4${NB}m, so its last metre sticks out past the trestle: an overhang, with the alpaca on its end. The pin holds the shelf at its start; the roller lets it slide along X as it bends.`,
        react: (s) => { s.stall(3); s.play(s.wait(0.4), s.hop()); s.tag("1 m sticks out", () => s.at(s.x(3.5), 1.2, 1.6), "right"); } },
      { key: "four", says: "Trestle B at 4.0 into the Roller's Position, with Free wired as before.",
        patch: (a) => a.slider("Trestle B at", 4),
        title: "Nothing sticks out.", body: `Trestle B is at the end, right under the alpaca: its 0.6${NB}kN goes straight down into the trestle, and the shelf hardly feels it. The crate alone bends a 4${NB}m span, 0.94${NB}kNm under it: twice what the stall has, where the alpaca on its overhang lifts the span a little.`,
        react: (s) => { s.stall(4); s.tag("No overhang: the alpaca stands on trestle B", () => s.at(s.x(3), 1.6, 1.6), "wrong"); } },
      { key: "two", says: "Trestle B at 2.0 into the Roller's Position, with Free wired as before.",
        patch: (a) => a.slider("Trestle B at", 2),
        title: "The shelf would tip off trestle A.", body: `Trestle B is only 2${NB}m along, so 2${NB}m stick out, and the alpaca out there outweighs the crate: the shelf would lift off trestle A like a see-saw. The model would not show it. Its pin holds the shelf down, pulling with 0.35${NB}kN, which a trestle cannot do: a Support in Alpaca4d holds both ways.`,
        react: (s) => { s.stall(2); s.reactions(statics(2, LOADS)); s.anim("tipEnd"); s.play(s.wait(0.2), s.wobble(0.5), s.fall()); s.tag("Trestle A would have to pull down 0.35 kN", () => s.at(s.x(1.6), 3.4, 1.6), "wrong"); } },
      { key: "slide", says: "Trestle B at 3.0, and Free wired into the Pin's Tx too.",
        patch: (a) => a.wire("Pin", "Tx", a.src("Free")),
        title: "Nothing holds it along its length.", body: "Free goes into the pin's Tx as well, so neither trestle holds the shelf along X: it can slide off, and Run Analysis stops with “Analysis Failed: OpenSees 'analyze' did not converge”. One support, the pin, has to hold X.",
        react: (s) => { s.stall(3, "slide"); s.anim("slide"); s.play(s.wait(0.3), s.fall()); s.tag("Free along X at both trestles", () => s.at(0, 1.6, 1.6), "wrong"); } },
    ],
  },
  {
    name: "Predict", title: "Predict the reactions",
    task: `Before reading the model, work it out. The crate weighs 1${NB}kN, 1.5${NB}m from trestle A; the alpaca 0.6${NB}kN, 4${NB}m from it; and trestle B is 3${NB}m from it. What does each trestle carry? Pick the panel with the right prediction.`,
    tip: `The reactions add up to the loads, 1.6${NB}kN. Take moments about trestle A to find trestle B's: B × 3 = 1 × 1.5 + 0.6 × 4.`,
    options: [
      { key: "right", says: "Prediction panel: trestle A 0.3 kN up, trestle B 1.3 kN up.",
        title: "0.3 and 1.3 kN.", body: `Up and down: 0.3 + 1.3 = 1.6${NB}kN, the crate and the alpaca. Turning about trestle A: 1.3 × 3 = 3.9${NB}kNm back, against 1 × 1.5 + 0.6 × 4 = 3.9${NB}kNm from the loads. Both balance, so the shelf stays put. Trestle B carries most of it, more than the crate weighs.`,
        react: (s) => { s.reactions({ RA: 0.3, RB: 1.3 }, true); s.play(s.wait(0.4), s.hop()); s.tag("Balanced", () => s.at(0, 6.2, 0), "right"); } },
      { key: "half", says: "Prediction panel: 0.8 kN up at each trestle.",
        patch: (a) => { a.get("Prediction").text = "Trestle A: 0.8 kN up\nTrestle B: 0.8 kN up"; },
        title: "Half each turns the shelf.", body: `0.8 + 0.8 = 1.6${NB}kN, so up and down it balances, but turning it does not: about trestle A the loads turn it by 3.9${NB}kNm, and 0.8${NB}kN at trestle B, 3${NB}m away, turns it back by only 2.4. The rest tips the shelf's end down. A load nearer one support puts more on it: take moments.`,
        react: (s) => { s.reactions({ RA: 0.8, RB: 0.8 }, true); s.anim("tipEnd"); s.play(s.wait(0.2), s.wobble(0.5), s.fall()); s.tag("2.4 kNm back, against 3.9", () => s.at(0, 6.2, 0), "wrong"); } },
      { key: "allB", says: "Prediction panel: nothing at trestle A, 1.6 kN up at trestle B.",
        patch: (a) => { a.get("Prediction").text = "Trestle A: 0 kN\nTrestle B: 1.6 kN up"; },
        title: "Trestle B alone turns it back too far.", body: `All 1.6${NB}kN on trestle B turns the shelf back by 1.6 × 3 = 4.8${NB}kNm about trestle A, more than the loads' 3.9: it tips the other way, its start dropping. Trestle A carries the 0.3${NB}kN that is left.`,
        react: (s) => { s.reactions({ RA: 0, RB: 1.6 }, true); s.anim("tipBack"); s.play(s.wait(0.3), s.wobble(0.8)); s.tag("4.8 kNm back, against 3.9", () => s.at(0, 6.2, 0), "wrong"); } },
      { key: "short", says: "Prediction panel: trestle A 0.3 kN up, trestle B 1.0 kN up.",
        patch: (a) => { a.get("Prediction").text = "Trestle A: 0.3 kN up\nTrestle B: 1.0 kN up"; },
        title: "That doesn't add up.", body: `0.3 + 1.0 = 1.3${NB}kN holds up less than the 1.6${NB}kN on the shelf, so it would sink. Whatever the moments say, the reactions add up to the loads: the alpaca's 0.6${NB}kN has to go somewhere, and trestle B takes it, and more.`,
        react: (s) => { s.reactions({ RA: 0.3, RB: 1.0 }, true); s.anim("sink"); s.play(s.wait(0.2), s.wobble(0.9)); s.tag("1.3 kN up, 1.6 kN down", () => s.at(0, 6.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Reactions", title: "Read the reactions",
    task: "Now read them from the solved model. Reaction Forces gives what each support carries, as a vector, one per support in the order Assemble Model has them: the pin, then the roller. Which definition shows them?",
    tip: "Reaction Forces reads the model that comes out of Run Analysis. ReactionForce is a force and ReactionMoment a moment, each in the support's own axes: here X, Y and Z.",
    options: [
      { key: "right", says: "Run Analysis's AlpacaModel into Reaction Forces, and its ReactionForce into the Reactions panel.",
        patch: (a) => { a.get("Reactions").nick = "{0, 0, 0.3}\n{0, 0, 1.3}"; },
        title: "{0, 0, 0.3} and {0, 0, 1.3}.", body: `One vector per support, the pin's first: 0.3${NB}kN and 1.3${NB}kN along Z, up, as predicted. A reaction is the force the support puts on the structure, so a trestle pushing up reads positive Z, and one pulling down would read negative.`,
        react: (s) => { s.reactions({ RA: 0.3, RB: 1.3 }, true); s.play(s.wait(0.4), s.hop()); } },
      { key: "unsolved", says: "Assemble Model's AlpacaModel into Reaction Forces, and its ReactionForce into the Reactions panel.",
        patch: (a) => { a.wire("Reaction Forces", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")); a.get("Reactions").nick = " "; },
        title: "Nothing has been solved.", body: "Reaction Forces is fed straight from Assemble Model, whose model has not been solved: there are no results to read, and Reaction Forces turns orange with “The model is not analysed.” Feed it the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.tag("The model is not analysed.", () => s.at(0, 6.2, 0), "wrong"); } },
      { key: "end", says: "Run Analysis into Reaction Forces, with the End point in PointPos.",
        patch: (a) => { a.wire("Reaction Forces", "PointPos", a.src("End", "Pt")); a.get("Reactions").nick = " "; },
        title: "There is no support there.", body: "PointPos picks the supports to read by where they are, and the end of the shelf has none. Reaction Forces warns: “No support is within 0.01 of 4,0,0, so there is no reaction to report there - a node with nothing holding it carries none.” Leave PointPos empty to read every support.",
        react: (s) => { s.ring(LENGTH); s.tag("No support is within 0.01 of 4,0,0", () => s.at(s.x(LENGTH), 4.6, 1.6), "wrong"); } },
      { key: "moment", says: "Run Analysis into Reaction Forces, and its ReactionMoment into the Reactions panel.",
        patch: (a) => { a.get("Reactions").src = [a.src("Reaction Forces", "ReactionMoment")]; a.get("Reactions").nick = "{0, 0, 0}\n{0, 0, 0}"; },
        title: "Those are the moments: none.", body: "ReactionMoment is what each support does to stop the shelf turning, and a pin and a roller let it turn: zero at both. The forces are in ReactionForce, the output above it.",
        react: (s) => { for (const m of [0, B_AT]) s.tag("{0, 0, 0} kNm", () => s.at(s.x(m), -0.6, 1.6), "wrong"); } },
    ],
  },
  {
    name: "Bending", title: "The bending",
    task: "Beam Forces reads the forces inside the shelf, element by element: N, two shears, the torsion and two bending moments, each in the element's own axes. Which output holds the bending the crate and the alpaca cause?",
    tip: "On a horizontal beam with nothing in ZAxis, local x runs along it, local y points up and local z across it. A moment bends the beam about the axis it is named after.",
    options: [
      { key: "right", says: "Beam Forces' Mz into the Bending panel.",
        title: "Mz: sagging under the crate, hogging over trestle B.", body: `Mz bends the shelf about local z, which runs across it, so it bends up and down. Positive Mz is sagging, the bottom stretched: 0.45${NB}kNm under the crate. Over trestle B it turns negative, −0.6${NB}kNm: hogging, the top stretched by the alpaca on the overhang. Model View draws each on the side it stretches.`,
        react: (s) => { s.diagram("Mz"); s.play(s.wait(0.4), s.hop()); s.tag("Sagging", () => s.at(s.x(CRATE_AT), -2.1, 0.6), "right"); s.tag("Hogging", () => s.at(s.x(B_AT), 2.8, 0.6), "right"); } },
      { key: "My", says: "Beam Forces' My into the Bending panel.",
        patch: (a) => { a.get("Bending").src = [a.src("Beam Forces", "My")]; },
        title: "My is zero all along.", body: "My bends the shelf about local y, which points up: sideways, in the plane of its top. Nothing pushes the shelf sideways, so My is zero everywhere.",
        react: (s) => { s.tag("My = 0 all along", () => s.at(0, 1.2, 0), "wrong"); } },
      { key: "Vy", says: "Beam Forces' Vy into the Bending panel.",
        patch: (a) => { a.get("Bending").src = [a.src("Beam Forces", "Vy")]; },
        title: "That's the shear.", body: `Vy is the shear across the shelf, the slope of the bending moment: Vy = dMz/dx. It steps at every load and every trestle: +0.3${NB}kN from trestle A to the crate, −0.7${NB}kN on to trestle B, +0.6${NB}kN out to the alpaca. It carries the loads to the trestles; the bending they cause is Mz.`,
        react: (s) => { s.diagram("Vy"); s.tag("Shear, not bending", () => s.at(0, 2.2, 0), "wrong"); } },
      { key: "N", says: "Beam Forces' N into the Bending panel.",
        patch: (a) => { a.get("Bending").src = [a.src("Beam Forces", "N")]; },
        title: "N is zero all along.", body: "N is the force along the shelf, positive in tension. Nothing pushes or pulls it lengthways, so N is zero: the bending is in Mz.",
        react: (s) => { s.tag("N = 0 all along", () => s.at(0, 1.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Largest", title: "The largest moment", guess: { question: "How big is the largest bending moment in the shelf?", unit: "kNm", step: "0.05", min: 0 },
    task: "Model View draws Mz along the shelf, on the side it stretches. How big is the largest moment, and where is it? Make a guess, then pick the panel that says it.",
    tip: `Over trestle B, only the alpaca's 0.6${NB}kN acts beyond it, 1${NB}m out. Under the crate, trestle A's 0.3${NB}kN acts 1.5${NB}m away.`,
    options: [
      { key: "right", says: "Largest moment panel: 0.6 kNm, hogging, over trestle B.",
        title: `${LARGEST}${NB}kNm, over trestle B.`,
        react: (s) => { s.diagram("Mz", true); s.play(s.wait(0.4), s.hop()); s.tag("0.6 kNm over trestle B", () => s.at(s.x(B_AT), 5.4, 0), "right", true); } },
      { key: "sag", says: "Largest moment panel: 0.45 kNm, sagging, under the crate.",
        patch: (a) => { a.get("Largest moment").text = "0.45 kNm, sagging,\nunder the crate"; },
        title: "That's the largest sagging, not the largest.", body: `Under the crate the moment is 0.3 × 1.5 = 0.45${NB}kNm, sagging: the most the span has. But over trestle B the alpaca's 0.6${NB}kN, 1${NB}m out, makes 0.6${NB}kNm the other way. The crate is the heavier load; the alpaca has the longer lever past a support.`,
        react: (s) => { s.diagram("Mz", true); s.ring(B_AT); s.tag("Bigger here", () => s.at(s.x(B_AT), 5.2, 0), "wrong"); } },
      { key: "simple", says: "Largest moment panel: 0.75 kNm, sagging, under the crate.",
        patch: (a) => { a.get("Largest moment").text = "0.75 kNm, sagging,\nunder the crate"; },
        title: "That leaves the alpaca out.", body: `0.75${NB}kNm is PL/4 = 1 × 3 / 4: the crate alone on a 3${NB}m span. The alpaca on the overhang lifts the span, as on a see-saw, and takes it down to 0.45${NB}kNm, but makes 0.6${NB}kNm of its own over trestle B.`,
        react: (s) => { s.diagram("crate", true); s.tag("Without the alpaca", () => s.at(s.x(CRATE_AT), 1.6, 0.6), "wrong"); } },
      { key: "lever", says: "Largest moment panel: 2.4 kNm, hogging, at trestle A.",
        patch: (a) => { a.get("Largest moment").text = "2.4 kNm, hogging,\nat trestle A"; },
        title: "Trestle A is a pin.", body: `0.6 × 4 = 2.4${NB}kNm would be right if the shelf were built into a wall at trestle A, a cantilever. It rests on a pin there, which lets it turn, so the moment at trestle A is zero.`,
        react: (s) => { s.diagram("Mz", true); s.ring(0); s.tag("0 kNm at a pin", () => s.at(s.x(0), 2.4, 0), "wrong"); } },
    ],
  },
];

// ---- The scene: the stall, its shelf on two trestles ----
function scene(kit) {
  const { g, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
  const k = 3;                                // the toy world's metres per real metre
  const X = (m) => -6 + m * k;                // metres from trestle A, in the area's frame
  const top0 = 2.4;                           // the trestles' top: 0.8 m
  const thick = 0.15, wide = 0.9;             // the plank, 50 x 300 mm
  const axisY = top0 + thick / 2;
  const OVER = 0.15;                          // m of shelf behind trestle A
  kit.home = X(LENGTH) - 0.2;
  // Turned in its area to run across the screen, so that its diagrams are seen face on.
  g.rotation.y = TURN;
  kit.view = { at: V(0.5, 2.6, 0), w: 21, h: 10.5 };
  kit.hideStructure();
  // The stall in front of the shelf hides it from the camera: put away while the lesson runs.
  const front = kit.area.group.children.filter((o) => o.visible && !o.userData.structure && o !== g && o.position.z > 2);
  front.forEach((o) => { o.visible = false; });

  // The shelf and all it carries turn about a pivot, for the tips; inside it, x and y as in g.
  const pivot = new THREE.Group(), inner = new THREE.Group();
  pivot.add(inner);
  g.add(pivot);
  const parts = { trestles: new THREE.Group(), supports: new THREE.Group(), loads: new THREE.Group(), reactions: new THREE.Group(), diagram: new THREE.Group(), ring: new THREE.Group() };
  g.add(parts.trestles, parts.reactions, parts.ring);
  inner.add(parts.supports, parts.loads, parts.diagram);

  const n = 64, x0 = X(-OVER), x1 = X(LENGTH);
  const geo = new THREE.BoxGeometry(x1 - x0, thick, wide, n, 1, 1);
  const shelf = add(inner, new THREE.Mesh(geo, solid(TIMBER, { roughness: 0.8 })));
  shelf.position.set((x0 + x1) / 2, top0 + thick / 2, 0);
  shelf.receiveShadow = true;
  const rest = geo.attributes.position.array.slice();
  const vx = []; for (let i = 0; i < rest.length; i += 3) vx.push((rest[i] + shelf.position.x - X(0)) / k);
  // The crate of apples.
  const crate = new THREE.Group();
  add(crate, new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.0, 1.1), solid("#b07a45")));
  for (const [dx, dz, c] of [[-0.35, -0.25, RED], [0.3, 0.2, "#c8262c"], [0, 0.05, "#e0453a"], [-0.2, 0.3, "#9fbf3a"], [0.38, -0.28, RED]]) {
    const ap = add(crate, new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), solid(c, { roughness: 0.5 })));
    ap.position.set(dx, 0.62, dz);
  }
  inner.add(crate);

  const state = { B: B_AT, held: true, anim: null };
  let diagramKind = null;

  // A trestle: a bar under the shelf on two pairs of splayed legs.
  function trestle(x) {
    const mat = solid(WOOD);
    const bar = add(parts.trestles, new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.22, 1.7), mat));
    bar.position.set(x, top0 - 0.11, 0);
    const foot = groundAt(x) - 0.05;
    for (const s of [-1, 1]) for (const dx of [-0.45, 0.45]) rod(parts.trestles, V(x, top0 - 0.15, s * 0.7), V(x + dx, foot, s * 0.85), 0.07, mat, 6);
  }
  // The stall: its trestles at A and at B, and the shelf moved back to rest.
  function stall(B, kind) {
    state.B = B;
    state.held = kind !== "slide";
    state.anim = null;
    clear(parts.trestles);
    trestle(X(0));
    trestle(X(B));
    pivot.position.set(0, 0, 0);
    pivot.rotation.set(0, 0, 0);
    inner.position.set(0, 0, 0);
    supports(true);
  }
  // Support symbols on the trestles' bars, in front of the shelf: a pyramid for the pin, on two
  // rollers for the roller, or for both when neither holds X.
  function supports(on) {
    clear(parts.supports);
    if (!on) return;
    const mat = solid(ORANGE), dark = solid(INK);
    for (const [m, roller] of [[0, !state.held], [state.B, true]]) {
      const lift = roller ? 0.2 : 0;
      const p = add(parts.supports, new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.42, 4), mat));
      p.position.set(X(m), top0 - 0.21 + lift - 0.2, 0.62);
      if (roller) for (const dx of [-0.17, 0.17]) {
        const c = add(parts.supports, new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.3, 8).rotateX(Math.PI / 2), dark));
        c.position.set(X(m) + dx, top0 - 0.31, 0.62);
      }
    }
  }
  // The model's loads, arrows down beside the shelf: the crate's and the alpaca's.
  const loadArrows = [];
  function loads(on) {
    clear(parts.loads);
    loadArrows.length = 0;
    if (!on) return;
    const mat = solid(ORANGE);
    for (const { a, P } of LOADS) {
      const h = new THREE.Group();
      arrow(h, V(0, P * 1.6 + 0.15, 0), V(0, 0.15, 0), 0.07, mat);
      h.userData.m = a;
      parts.loads.add(h);
      loadArrows.push(h);
    }
  }
  // The reactions, arrows into the shelf from below - or down onto it, for one that pulls - with
  // what each is when asked.
  function reactions(r, label) {
    clear(parts.reactions);
    if (!r) return;
    for (const [m, R] of [[0, r.RA], [state.B, r.RB]]) {
      if (Math.abs(R) < 1e-6) { if (label) tag("0 kN", () => V(X(m), top0 - 0.8, 1.6), "", false); continue; }
      const len = Math.abs(R) * 1.6, mat = solid(R > 0 ? GREEN : RED);
      if (R > 0) arrow(parts.reactions, V(X(m), top0 - 0.05 - len, 1.6), V(X(m), top0 - 0.05, 1.6), 0.08, mat);
      else arrow(parts.reactions, V(X(m), top0 + thick + 0.1 + len, 1.6), V(X(m), top0 + thick + 0.1, 1.6), 0.08, mat);
      if (label) tag(`${R > 0 ? "" : "−"}${fmt(R)} kN`, () => (R > 0 ? V(X(m), top0 - len - 0.6, 1.6) : V(X(m), top0 + len + 0.9, 1.6)), "", false);
    }
  }
  // A red ring on the ground beside the shelf, where something is missing or wrong.
  function ring(m) {
    clear(parts.ring);
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.08, 6, 24).rotateX(Math.PI / 2), solid(RED));
    r.position.set(X(m), groundAt(X(m)) + 0.08, 1.6);
    parts.ring.add(r);
  }
  // A force diagram along the shelf, in its upright plane, as Model View draws it: Mz on the side
  // it stretches (sagging below, hogging above), Vy towards local y, up; "crate" is the crate on
  // a 3 m span with no alpaca. Labelled at its peaks when asked.
  function diagram(kind, label) {
    diagramKind = kind;
    clear(parts.diagram);
    if (!kind) return;
    const st = kind === "crate" ? statics(B_AT, [LOADS[0]]) : statics(state.B, LOADS);
    const end = kind === "crate" ? B_AT : LENGTH;
    const value = kind === "Vy" ? (x) => st.Vy(x) : (x) => -st.M(x);   // up the screen
    const scale = kind === "Vy" ? 2.4 : 3.3;
    const zd = 0.6;   // in front of the shelf's face, and drawn over whatever is in the way, as Model View's are
    // Sampled finely, with both sides of every step of the shear.
    const xs = [];
    for (let i = 0; i <= 200; i++) xs.push((end * i) / 200);
    for (const s of [CRATE_AT, B_AT, LENGTH]) if (s < end) xs.push(s - 1e-6, s + 1e-6);
    xs.sort((a, b) => a - b);
    const pos = [], col = [], idx = [], line = [];
    const plus = new THREE.Color(BLUE), minus = new THREE.Color(ORANGE);
    xs.forEach((x, i) => {
      const v = value(x), y = axisY + v * scale, c = (kind === "Vy" ? v >= 0 : v <= 0) ? plus : minus;
      pos.push(X(x), axisY, zd, X(x), y, zd);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
      line.push(X(x), y, zd);
      if (i) { const a = 2 * (i - 1); idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    });
    const fill = new THREE.BufferGeometry();
    fill.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    fill.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    fill.setIndex(idx);
    const area = new THREE.Mesh(fill, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.62, side: THREE.DoubleSide, depthWrite: false, depthTest: false }));
    const outline = new THREE.BufferGeometry();
    outline.setAttribute("position", new THREE.Float32BufferAttribute(line, 3));
    const edge = new THREE.Line(outline, new THREE.LineBasicMaterial({ color: kind === "crate" ? PURPLE : INK, depthTest: false }));
    area.renderOrder = edge.renderOrder = 10;
    parts.diagram.add(area, edge);
    if (!label) return;
    const peaks = kind === "Vy" ? [[0.75, st.Vy(0.75)], [2.25, st.Vy(2.25)], [3.5, st.Vy(3.5)]] : kind === "crate" ? [[CRATE_AT, st.M(CRATE_AT)]] : [[CRATE_AT, st.M(CRATE_AT)], [B_AT, st.M(B_AT)]];
    for (const [x, v] of peaks) {
      const y = axisY + (kind === "Vy" ? v : -v) * scale;
      tag(`${v > 0 ? "+" : "−"}${fmt(v)} ${kind === "Vy" ? "kN" : "kNm"}`, () => V(X(x), y + (y > axisY ? 0.6 : -0.6), zd), "", false);
    }
  }

  // What a wrong reading does to the shelf: tips its end down or its start down about trestle B,
  // slides off, or sinks.
  function anim(kind) {
    state.anim = { kind, t: 0 };
    if (kind === "tipEnd" || kind === "tipBack") {
      pivot.position.set(X(state.B), top0, 0);
      inner.position.set(-X(state.B), -top0, 0);
    }
    if (reduceMotion) animate(10);
  }
  function animate(dt) {
    const a = state.anim;
    a.t += dt;
    const t = smooth(Math.min(1, a.t / 0.9));
    if (a.kind === "tipEnd") {
      const reach = X(LENGTH) - X(state.B);
      pivot.rotation.z = -Math.atan2(top0 - 0.1, reach) * t;
    } else if (a.kind === "tipBack") {
      const reach = X(state.B) - X(-OVER);
      pivot.rotation.z = Math.atan2(top0 - 0.1, reach) * t;
    } else if (a.kind === "slide") {
      const t1 = smooth(Math.min(1, a.t / 1.2)), t2 = Math.max(0, Math.min(1, (a.t - 1.2) / 0.7));
      inner.position.x = t1 * (X(LENGTH) - X(state.B) + 1.5) + t2 * 1.5;
      inner.position.y = -(top0 - 0.1) * t2 * t2;
    } else if (a.kind === "sink") {
      inner.position.y = -0.55 * t + 0.08 * Math.sin(Math.min(1, a.t / 0.9) * Math.PI * 3) * (1 - t);
    }
  }

  // The loads on the shelf now: the crate, and the alpaca where it stands on it.
  function loadsNow() {
    const list = [LOADS[0]];
    if (al.y == null && !state.anim && Math.abs(al.z) < 0.5 && al.x > X(0) && al.x <= X(LENGTH) + 0.3) list.push({ a: Math.min(LENGTH, (al.x - X(0)) / k), P: ALPACA });
    return list;
  }
  let sag = null;
  const drawn = (w) => REACH * Math.tanh((w * EXAGGERATE * k) / REACH);
  function bend() {
    const loadsHere = loadsNow();
    // Straight while it tips, slides or sinks: then nothing holds it as the trestles did.
    const still = state.held && !state.anim;
    const w = still ? bendOf(state.B, loadsHere, vx) : vx.map(() => 0);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.array[i * 3 + 1] = rest[i * 3 + 1] + drawn(w[i]);
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    const at = (m) => (still ? drawn(bendOf(state.B, loadsHere, [m])[0]) : 0);
    sag = at;
    crate.position.set(X(CRATE_AT), top0 + thick + 0.5 + at(CRATE_AT), 0);
    for (const h of loadArrows) h.position.set(X(h.userData.m), top0 + thick + at(h.userData.m), 1.6);
    parts.diagram.position.y = 0;
  }
  // Where the alpaca's feet are: on the shelf, or on the ground.
  function surface(x, z = 0) {
    if (Math.abs(z) < 0.6 && x > X(-OVER) - 0.2 && x < X(LENGTH) + 0.4 && !state.anim) return top0 + thick + (sag ? sag(Math.max(0, Math.min(LENGTH, (x - X(0)) / k))) : 0);
    return groundAt(x, z);
  }
  function frame(dt) {
    if (state.anim) animate(dt);
    bend();
  }
  // The scene as the rounds before r left it.
  function setScene(r) {
    stall(B_AT);
    supports(r > 0);
    loads(r > 0);
    reactions(r > 2 ? statics(B_AT, LOADS) : null, false);
    diagram(r > 3 ? "Mz" : null);
    clear(parts.ring);
    al.turn = Math.PI + TURN;
    if (r === 0) for (const [name, m] of [["Trestle A", 0], ["Trestle B", B_AT]]) tag(name, () => V(X(m), 0.4, 2.2), "bank", false, "scene");
    if (r === 1) {
      tag("1 kN", () => V(X(CRATE_AT), top0 + 2.6, 1.6), "", false, "scene");
      tag("0.6 kN", () => V(X(LENGTH) + 1.2, top0 + 1.4, 1.6), "", false, "scene");
    }
  }

  const api = {
    x: X, at: (x, y, z) => V(x, top0 + y, z),
    stall: (B, kind) => { stall(B, kind); supports(true); loads(true); },
    reactions, diagram, anim, ring, tag,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, fall: kit.fall, climbBack: kit.climbBack, lookUp: kit.lookUp,
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, stop: () => { clear(parts.diagram); front.forEach((o) => { o.visible = true; }); } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "market", chip: "Area 6 · Market", def, gh: { url: GH_FILE, name: "Market.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - LARGEST) <= LARGEST * 0.2 ? `You guessed ${guess}${NB}kNm: within a fifth of it. ` : `You guessed ${guess}${NB}kNm. `;
      return [
        el("p", "", `${said}OpenSees gives −0.6${NB}kNm over trestle B, hogging, the largest, and +0.45${NB}kNm under the crate, sagging; zero at trestle A and at the end.`),
        el("p", "pg-calc", `By hand: R_B = (1 × 1.5 + 0.6 × 4) / 3 = 1.3${NB}kN and R_A = 1.6 − 1.3 = 0.3${NB}kN. Over trestle B, M = −0.6 × 1 = −0.6${NB}kNm; under the crate, M = 0.3 × 1.5 = 0.45${NB}kNm.`),
      ];
    },
    done: { title: "The Market is done.", body: "You worked out what the trestles carry and how the shelf bends, then read it from the model: Reaction Forces for the reactions, Beam Forces and Model View for the moments. Equilibrium gives both by hand, before any software does. The file is the stall, ready to open in Grasshopper with Alpaca4d." },
  });
}
