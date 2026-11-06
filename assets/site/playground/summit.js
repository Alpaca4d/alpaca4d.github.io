// Area 10, the Summit bridge: the Playground's last lesson. In seven rounds the player builds a
// block of concrete bricks across the chasm, pins it to the rock, loads its deck with a walkway, and
// wires Topology Optimisation to carve the bridge out of it: material only where the forces flow.
//
// The definition is summit.gh, written by Alpaca4d's Tools/Examples/PlaygroundSummit.py. What each
// option would build is real: summit-runs.json holds every iteration's densities of the lesson's
// model and of each mistake, found by Alpaca4d's own TopologyOptimiser with OpenSees - 30 x 10 bricks
// of 0.4 x 1.2 x 0.4 m, C30/37 - and the Von Mises stress of the design, from OpenSees too. The
// panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 12, DEPTH = 4, WIDTH = 1.2;     // m: the block
const NX = 30, NZ = 10;                      // bricks along and up
const BRICK_T = 0.4 * WIDTH * 0.4 * 2.5;     // t: a brick of C30/37, 0.48 t
const KEPT_T = (NX + 0.25 * NX * (NZ - 1)) * BRICK_T;     // the deck and a quarter of the rest: 46.8 t
const BUILT_T = 90 * BRICK_T;                // the 90 bricks at 0.5 or more: 43.2 t
const CONCRETE = "#9c968b", DECK = "#e2a24c", STEEL = "#9aa4ae", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c";

const ready = Promise.all([
  loadDefinition(new URL("./summit-definition.json", import.meta.url)),
  fetch(new URL("./summit-runs.json", import.meta.url)).then((r) => r.json()),
]);
const GH_FILE = new URL("./summit.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Block", title: "The block",
    task: `Topology Optimisation starts from a block of solid elements, all the space the bridge may take, and keeps the material where the forces flow. Fill the chasm with a block of bricks 12${NB}m across, 4${NB}m deep and 1.2${NB}m wide: 30 along and 10 up, 0.4${NB}m each.`,
    tip: "The deck's plan is meshed into 30 faces and copied up level by level; Mesh Series to Brick makes a layer of bricks between each level and the next.",
    options: [
      { key: "right", says: "Up 10 into Level count, which adds one, and that into Heights' Count; Along 30 into Plan mesh.",
        title: "That's the block.", body: `Ten layers of bricks need eleven levels, from 0 to 4${NB}m, 0.4${NB}m apart. Mesh Series to Brick joins each level to the next: 30${NB}×${NB}10${NB}=${NB}300 bricks, made layer by layer from the bottom. Topology Optimisation takes models of up to 500 elements without a license.`,
        react: (s) => { s.block(); s.play(s.wait(0.6), s.hop()); } },
      { key: "fence", says: "Up 10 straight into Heights' Count, without Level count.",
        patch: (a) => a.wire("Heights", "C", a.src("Up")),
        title: "One layer short.", body: `Ten levels make nine layers: 270 bricks, 3.6${NB}m deep. Split List finds no bricks after the 270th for the deck, and Deck turns orange: “Input parameter Mesh failed to collect data”. Then Assemble Model stops, as the walkway's nodes, at 4${NB}m, are on no brick: “Point load at location '0,0,4' is not part of the model!” n layers need n${NB}+${NB}1 levels.`,
        react: (s) => { s.block({ rows: 9 }); s.loads("floating"); s.tag("Point load at location '0,0,4' is not part of the model!", () => s.at(-1.6, 1.7, 0), "wrong"); } },
      { key: "fine", says: "Along 60 and Up 20.",
        patch: (a) => { a.slider("Along", 60); a.slider("Up", 20); },
        title: "1 200 bricks is too many to run free.", body: `Bricks of 0.2${NB}m would make a finer bridge, but 60${NB}×${NB}20 is 1${NB}200 of them, and Topology Optimisation stops: “Without a license Topology Optimisation takes models of up to 500 elements, and this one has 1200.” 0.4${NB}m is plenty to see where the forces flow.`,
        react: (s) => { s.block({ fine: true }); s.tag("1 200 bricks: free up to 500", () => s.at(0, 1.4, 0), "wrong"); } },
    ],
  },
  {
    name: "Concrete", title: "Concrete",
    task: `The bridge is to be concrete, C30/37. Give the bricks their material, and set the top row apart as the deck: the bricks are made from the bottom up, so the deck's 30 are the last of the 300.`,
    tip: "Split List cuts a list at an index: List A is everything before it, List B the rest. Deck starts is 30 × 9 = 270.",
    options: [
      { key: "right", says: "Deck starts, 270, into Split's index; List A into Domain and List B into Deck, both of C30/37; Domain named Domain and Deck named Deck.",
        title: "Concrete, and a deck.", body: `The first 270 bricks are the block below, named Domain, and the last 30 the deck, named Deck: the name in ElementId is how Topology Optimisation will find them. C30/37 is E${NB}=${NB}33${NB}000${NB}MPa and 2.5${NB}t/m³, so the block weighs 144${NB}t.`,
        react: (s) => { s.block({ deck: "top" }); s.tag("Deck: the top row", () => s.at(0, 1.2, 0)); s.play(s.wait(0.5), s.hop()); } },
      { key: "bottom", says: "Along, 30, into Split's index instead of Deck starts.",
        patch: (a) => a.wire("Split", "i", a.src("Along")),
        title: "That deck is under the bridge.", body: "Split List cuts at 30, so the first 30 bricks, the bottom row, become the deck. Kept solid, it lies at the foot of the chasm, and the optimiser eats away the top row the walkway stands on. The top row is the last 30: from 270 on.",
        react: (s) => { s.block({ deck: "bottom" }); s.preview("keepbottom", () => s.cross()); s.tag("The deck: the bottom row", () => s.at(0, -3.2, 0), "wrong"); } },
      { key: "steel", says: "The concrete's panels with no wire out of them.",
        patch: (a) => { for (const n of ["MatName", "E", "G", "ν", "Rho"]) a.wire("C30/37", n); },
        title: "It works, but it's steel.", body: "Nothing is wired into nD, so it takes its defaults without a word: steel, E = 210 000 MPa and 7.85 t/m³. The shape it finds would be the same, as one material scales every brick alike, but the block weighs 452 t instead of 144 t, and the concrete you meant is nowhere.",
        react: (s) => { s.block({ deck: "top", colour: STEEL }); s.tag("Steel: 452 t, not 144 t", () => s.at(0, 1.2, 0), "wrong"); } },
      { key: "swapped", says: "Deck name into the Domain bricks' ElementId, and Domain name into the Deck's.",
        patch: (a) => { a.wire("Domain", "ElementId", a.src("Deck name")); a.wire("Deck", "ElementId", a.src("Domain name")); },
        title: "The names are swapped.", body: "The 270 bricks below are named Deck, and the top row Domain. When Topology Optimisation keeps the Deck, it keeps the whole block below and designs the walkway alone: it keeps a quarter of it, and the walkway is gone.",
        react: (s) => { s.block({ deck: "below" }); s.preview("keepdomain", () => s.cross()); s.tag("Deck: the 270 bricks below", () => s.at(0, 1.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Rocks", title: "The rocks",
    task: "The bridge rests on the chasm's rock walls. Pin both ends of the block's bottom to them: at each end, a support at both edges across. Rock can push back, so let it.",
    tip: "A Support holds every direction left empty. Free is False, and frees Rx, Ry and Rz, which a brick's node does not have anyway; Tx, Ty and Tz move along X, Y and Z.",
    options: [
      { key: "right", says: "Foot A at X 0 and Foot B at X Span, both at Z 0, across both edges; Free into Rx, Ry and Rz of both rocks.",
        title: "Pinned to the rock.", body: `Both ends of the bottom are held along X, Y and Z, so as the bridge carries the walkway the rock pushes it back in: an arch needs that push.`,
        react: (s) => { s.supports("pinned"); s.play(s.wait(0.4), s.hop()); } },
      { key: "roller", says: "Free into Rock B's Tx as well.",
        patch: (a) => a.wire("Rock B", "Tx", a.src("Free")),
        title: "Nothing pushes back at Rock B.", body: "Rock B is a roller: it slides along X, so nothing holds the two ends together, and the optimiser has to tie them itself. It lays a tie along the bottom: a bowstring, 3.6 times as flexible for the same concrete, and its tie is pulled. Concrete cracks when it is pulled.",
        react: (s) => { s.supports("roller"); s.preview("roller", () => s.tag("A tie along the bottom: pulled", () => s.at(0, -3.4, 0), "wrong")); } },
      { key: "top", says: "Depth into the Z of both feet.",
        patch: (a) => { a.wire("Foot A", "Z", a.src("Depth")); a.wire("Foot B", "Z", a.src("Depth")); },
        title: "Held at the top.", body: `The feet are at Z${NB}=${NB}4${NB}m, the deck's corners, so the bridge hangs between the tops of the walls, and the optimiser finds a hanging shape: pulled all through, and 2.3 times as flexible. Concrete wants pushing, not pulling.`,
        react: (s) => { s.supports("top"); s.preview("top", () => s.tag("Hanging: pulled all through", () => s.at(0, -3.4, 0), "wrong")); } },
    ],
  },
  {
    name: "Walkway", title: "The walkway",
    task: `People and alpacas cross: a walkway load of 5${NB}kN/m² over the whole 12${NB}×${NB}1.2${NB}m deck, 72${NB}kN. Share it among the 62 nodes of the deck's top.`,
    // Nine components in a row draw too small on a card: the share's sum goes on a second row,
    // under the deck's nodes.
    layout: (a) => {
      const box = (nick) => a.get(nick).box;
      const place = (nick, x, y) => a.move(nick, x - box(nick)[0], y - box(nick)[1]);
      const nodes = box("Deck nodes"), row2 = nodes[1] + nodes[3] + 34;
      let x = nodes[0] + nodes[2] + 40;
      for (const nick of ["How many", "Each node's share", "Down"]) { place(nick, x, row2); x += box(nick)[2] + 40; }
      place("Walkway", box("Deck top")[0] - 60, row2 + box("Each node's share")[3] + 20);
      for (const nick of ["The walkway", "Load Pattern"]) { place(nick, x, nodes[1] + 10); x += box(nick)[2] + 40; }
    },
    tip: "Deconstruct Mesh gives the vertices of the deck's top, 31 along each edge. Each node's share is −w × span × width / n: down is negative.",
    options: [
      { key: "right", says: "Walkway, Span, Width and How many into Each node's share; the share into Down, Down into Force, and the deck's nodes into Point.",
        title: "The walkway.", body: `72${NB}kN over 62 nodes is 1.16${NB}kN each, pointing down. The optimiser will look for the bridge that carries all of it stiffest.`,
        react: (s) => { s.loads("walkway"); s.play(s.wait(0.4), s.hop()); } },
      { key: "point", says: "A point at the middle of the deck, not the deck's nodes, into Point.",
        patch: (a) => {
          const n = a.get("Deck nodes"), w = a.get("The walkway");
          a.add(a.newSlider("middle", "Middle", 6, 0, 12, 1, n.box[0] - 190, w.box[1] + 112));
          a.add(a.newComponent("mid", "Foot B", "Middle of the deck", n.box[0], w.box[1] + 84, { X: ["middle"], Y: [a.src("Across")], Z: [a.src("Depth")] }));
          a.wire("The walkway", "Point", "mid.out0");
        },
        title: "A bridge for one spot.", body: "The load stands at mid-span alone, so the optimiser finds the stiffest bridge for that: two struts meeting under the middle. Wherever else the alpaca stops, the deck carries it on its own. Design for every load the bridge will carry.",
        react: (s) => { s.loads("point"); s.preview("point", () => s.tag("Two struts to one spot", () => s.at(0, -3.4, 0), "wrong")); } },
      { key: "offnode", says: "A point 0.6 metres across the deck, in the middle of its width, into Point.",
        patch: (a) => {
          const n = a.get("Deck nodes"), w = a.get("The walkway");
          a.add(a.newSlider("middle", "Middle", 6, 0, 12, 1, n.box[0] - 190, w.box[1] + 112));
          a.add(a.newSlider("half", "Half width", 0.6, 0, 1.2, 1, n.box[0] - 190, w.box[1] + 150));
          a.add(a.newComponent("mid", "Foot B", "Middle of the deck", n.box[0], w.box[1] + 84, { X: ["middle"], Y: ["half"], Z: [a.src("Depth")] }));
          a.wire("The walkway", "Point", "mid.out0");
        },
        title: "There is no node there.", body: `The middle of the deck's width is 0.6${NB}m across, and the block is one brick wide: its nodes are at its two edges, 0 and 1.2${NB}m. Assemble Model stops: “Point load at location '6,0.6,4' is not part of the model!”`,
        react: (s) => { s.loads("offnode"); s.tag("Point load at location '6,0.6,4' is not part of the model!", () => s.at(-1.6, 1.9, 0), "wrong"); } },
      { key: "each", says: "Walkway, 5, straight into Down.",
        patch: (a) => a.wire("Down", "F", a.src("Walkway")),
        title: "5 kN on every node.", body: `Every node gets the whole 5${NB}kN: 310${NB}kN in all, 4.3 times the walkway. The optimiser finds exactly the same bridge, since one load scaled up is the same problem, but every number out of it is wrong: its compliance comes out 18.5 times too big.`,
        react: (s) => { s.loads("big"); s.preview("right"); s.tag("310 kN in all: 4.3 times the walkway", () => s.at(0, 2.6, 0), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Wire it all into Assemble Model: both sets of bricks into Elements, both rocks into Supports, and the load pattern into LoadPatterns.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      offered: ["Bricks", "Domain", "Deck", "Rock A", "Rock B", "The walkway", "Load Pattern"],
      wants: { Elements: ["Domain", "Deck"], Supports: ["Rock A", "Rock B"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements: the bricks from SSP Brick", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the bridge has none", Recorders: "recorders: leave it empty",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Domain: "bricks", Deck: "bricks", "Rock A": "a support", "Rock B": "a support", "Load Pattern": "the load pattern",
        Bricks: "the bricks' meshes, only geometry: SSP Brick makes them elements", "The walkway": "the walkway's point loads, which go through the Load Pattern",
      },
      checks: [
        [(has) => has("Elements", "Domain") && has("Elements", "Deck"), "Elements: the Domain and the Deck"],
        [(has) => has("Supports", "Rock A") && has("Supports", "Rock B"), "Supports: Rock A and Rock B"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the bricks: drag a wire from Domain's output to Assemble Model's Elements, then hold Shift for the Deck.",
      done: { title: "That's the model.", body: `300 bricks on 682 nodes, pinned at four and loaded at 62: the block, ready to be carved.` },
    },
  },
  {
    name: "Keep", title: "What it keeps",
    task: "Topology Optimisation will ask two things: Keep, the bricks to leave solid whatever it finds, and what share of the rest to keep. The walkway has to stay whole, and a quarter of the block below is plenty.",
    tip: "Keep takes ElementIds, as typed into the bricks. VolumeFraction counts only the bricks it designs; the ones in Keep come on top.",
    options: [
      { key: "right", says: "Keep: Deck. Share kept 0.25.",
        title: "The deck, and a quarter of the rest.", body: `Keep holds the 30 deck bricks solid. Of the other 270 it keeps a quarter's worth, 67.5 bricks, wherever they carry the walkway best.`,
        react: (s) => { s.keep(); s.play(s.wait(0.4), s.hop()); } },
      { key: "nokeep", says: "Keep empty. Share kept 0.25.",
        patch: (a) => { a.get("Keep").text = ""; },
        title: "Nobody kept the deck.", body: "With nothing in Keep the deck is designed too, and only what carries the walkway's nodes stiffest stays: the deck crumbles at both ends. There is nowhere to step on.",
        react: (s) => { s.preview("nokeep", () => s.cross()); } },
      { key: "vf05", says: "Keep: Deck. Share kept 0.05.",
        patch: (a) => a.slider("Share kept", 0.05),
        title: "Too little to reach the rock.", body: `5${NB}% of 270 bricks is 13.5: not enough to reach from the deck down to the rock. Only the deck is left, touching no support: “No part of the design is held still by the supports, so AlpacaModel is empty.”`,
        react: (s) => { s.preview("vf05", () => { s.drop(); s.tag("No part of the design is held still by the supports", () => s.at(0, 1.4, 0), "wrong"); }); } },
      { key: "vf1", says: "Keep: Deck. Share kept 1.",
        patch: (a) => a.slider("Share kept", 1),
        title: "It keeps everything.", body: `A share of 1 keeps every brick: Topology Optimisation stops after one iteration with the whole block, 144${NB}t of concrete. The stiffest bridge there is, and the heaviest.`,
        react: (s) => { s.preview("vf1", () => s.tag("144 t: nothing taken away", () => s.at(0, 1.4, 0), "wrong")); } },
    ],
  },
  {
    name: "Optimise", title: "Topology Optimisation",
    guess: { question: "How many tonnes of concrete will the bridge keep?", unit: "t", step: "0.1", min: 0 },
    task: "Wire Topology Optimisation: the model, what it keeps and how much, Run to start it, and Step to watch it again. But first, a guess: the block weighs 144 t.",
    tip: "Drag each wire from an output on the left to the input of Topology it goes into. Inputs left empty take their defaults, which are right here.",
    wiring: {
      target: "Topology",
      offered: ["Assemble Model", "Domain", "Keep", "Share kept", "Run", "Step"],
      wants: { AlpacaModel: ["Assemble Model"], Keep: ["Keep"], VolumeFraction: ["Share kept"], Run: ["Run"], Step: ["Step"] },
      takes: {
        AlpacaModel: "the assembled model", Keep: "the names of the bricks to keep", VolumeFraction: "the share of the designed bricks to keep",
        Iterations: "how many iterations at most: 100, its default, is plenty here", Run: "true or false: whether to run", Step: "which iteration's design to show",
        Penalty: "a setting: its default, 3, is right here", FilterRadius: "a setting: left empty, 1.5 bricks", Tolerance: "a setting: its default is right here",
        MinStiffness: "a setting: its default is right here", Move: "a setting: its default is right here", Threshold: "a setting: its default is right here", System: "a setting: Auto is right here",
      },
      is: {
        "Assemble Model": "the assembled model", Domain: "the block's bricks, not a model: Assemble Model makes one", Keep: "the names to keep",
        "Share kept": "a share", Run: "a true or a false", Step: "an iteration's number",
      },
      checks: [
        [(has) => has("AlpacaModel", "Assemble Model"), "AlpacaModel: the assembled model"],
        [(has) => has("Keep", "Keep") && has("VolumeFraction", "Share kept"), "Keep and VolumeFraction: what it keeps"],
        [(has) => has("Run", "Run") && has("Step", "Step"), "Run and Step"],
      ],
      first: "Start with the model: drag a wire from Assemble Model's output to Topology's AlpacaModel.",
      done: { title: "It runs.", body: "Every brick starts a quarter dense. Each iteration analyses the block in OpenSees and moves material from where it does little to where the forces flow: 40 iterations, a second or so. What is left is an arch rising from the foot of each wall into the deck, with a hanger near each quarter.",
        react: (s) => s.reveal() },
    },
  },
];

// ---- The scene: the block across the chasm, carved as each option would carve it ----
function sceneOf(RUNS) {
  return function scene(kit) {
    const { g, solid, add, clear, rod, arrow, groundAt, tag, al, reduceMotion } = kit;
    const K = 7.6 / SPAN;                     // the toy world's metres per real metre
    // The block stands on the chasm's rims, its feet on the rock's lips and its deck above, so that
    // the whole of it shows from the island's camera; a ramp leads up to the deck at each end.
    const X0 = -SPAN * K / 2, TOP = DEPTH * K + 0.08;   // the block's near end and its top, in the area's frame
    const WZ = 1.6;                           // drawn wider than its 1.2 m, for the alpaca to walk on
    const RAMP_L = 2.8;
    const HOME = X0 - RAMP_L - 0.7, FAR = -HOME;
    kit.home = HOME;
    kit.view = { at: V(-1.6, 1.2, 0), w: 13, h: 6.5 };
    kit.hideStructure();
    // The ramps: stone, from the ground up to the deck's ends.
    const ramps = new THREE.Group();
    g.add(ramps);
    for (const s of [-1, 1]) {
      const a = V(s * (-X0 + RAMP_L), groundAt(s * (-X0 + RAMP_L)), 0), b = V(s * -X0, TOP, 0);
      const d = b.clone().sub(a), len = d.length();
      const r = add(ramps, new THREE.Mesh(new THREE.BoxGeometry(len, 0.22, WZ), solid("#b9b2a2")));
      r.position.copy(a).addScaledVector(d, 0.5).add(V(0, -0.11, 0));
      r.rotation.z = Math.atan2(d.y, d.x);
      r.receiveShadow = true;
    }

    const at = (x, y, z) => V(x, TOP + y, z);

    // The bricks: one instanced box each, shrunk and paled as its density falls.
    const MAX = 60 * 20;
    const mat = new THREE.MeshStandardMaterial({ color: "#ffffff", flatShading: true, roughness: 0.85 });
    const bricks = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), mat, MAX);
    bricks.castShadow = bricks.receiveShadow = true;
    bricks.count = 0;
    g.add(bricks);
    const parts = { supports: new THREE.Group(), loads: new THREE.Group(), gizmo: new THREE.Group() };
    Object.values(parts).forEach((p) => g.add(p));

    // What the block shows: its grid, densities, which row is the deck, its colour.
    const shown = { nx: NX, nz: NZ, rows: NZ, dens: null, deck: null, colour: CONCRETE, stress: null, drop: 0, visible: false, faint: null };
    const tmpM = new THREE.Matrix4(), tmpC = new THREE.Color(), pale = new THREE.Color("#eef0f2");
    const RAMP = ["#4288f7", "#9e35da", "#eb6c3f"].map((c) => new THREE.Color(c));
    function ramp(t) {
      const s = Math.max(0, Math.min(1, t)) * 2, i = Math.min(1, Math.floor(s));
      return tmpC.copy(RAMP[i]).lerp(RAMP[i + 1], s - i);
    }
    function isDeck(i, k) {
      if (shown.deck === "top") return k === shown.nz - 1;
      if (shown.deck === "bottom") return k === 0;
      if (shown.deck === "below") return k < shown.nz - 1;
      return false;
    }
    function draw() {
      const { nx, nz, rows, dens } = shown;
      if (!shown.visible) { bricks.count = 0; bricks.instanceMatrix.needsUpdate = true; return; }
      const sx = (SPAN / nx) * K, sy = (DEPTH / nz) * K;
      let n = 0;
      for (let k = 0; k < rows; k++) {
        for (let i = 0; i < nx; i++) {
          const d = dens ? dens[i + k * nx] : 1;
          if (d < 0.05) continue;
          const deck = isDeck(i, k);
          const faint = shown.faint && shown.faint(deck);
          const s = d >= 0.5 ? 0.97 : 0.3 + 0.9 * d;
          tmpM.makeScale(sx * s, sy * s, WZ * (d >= 0.5 ? 1 : 0.6 + 0.4 * d));
          tmpM.setPosition(X0 + (i + 0.5) * sx, TOP - DEPTH * K + (k + 0.5) * sy - shown.drop * (deck || shown.dropAll ? 1 : 0), 0);
          bricks.setMatrixAt(n, tmpM);
          if (shown.stress && d >= 0.5) ramp((shown.stress[`${i},${k}`] || 0) / RUNS.stress.top);
          else tmpC.set(deck ? DECK : shown.colour);
          if (d < 0.5) tmpC.lerp(pale, 0.75 - d);
          if (faint) tmpC.lerp(pale, 0.8);
          bricks.setColorAt(n, tmpC);
          n++;
        }
      }
      bricks.count = n;
      bricks.instanceMatrix.needsUpdate = true;
      if (bricks.instanceColor) bricks.instanceColor.needsUpdate = true;
    }
    const decode = (hex) => { const a = new Float32Array(hex.length / 2); for (let i = 0; i < a.length; i++) a[i] = parseInt(hex.substr(2 * i, 2), 16) / 255; return a; };
    function block(o = {}) {
      Object.assign(shown, { nx: o.fine ? 60 : NX, nz: o.fine ? 20 : NZ, rows: o.rows || (o.fine ? 20 : NZ), dens: null, deck: o.deck || null, colour: o.colour || CONCRETE, stress: null, drop: 0, dropAll: false, visible: true });
      draw();
    }

    // Rhino's axes at the near end of the deck, with their names.
    function gizmo(on) {
      clear(parts.gizmo);
      if (!on) return;
      const o = V(X0 - 0.6, TOP + 0.05, WZ / 2 + 0.6), len = 1.8;
      for (const [name, d, c] of [["X", V(1, 0, 0), "#e23b3b"], ["Y", V(0, 0, -1), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
        arrow(parts.gizmo, o, o.clone().addScaledVector(d, len), 0.05, solid(c));
        tag(name, () => o.clone().addScaledVector(d, len + 0.4), "axis", false, "scene");
      }
    }
    // Supports at the foot of each wall, or at the top; a roller at Rock B.
    function supports(kind) {
      clear(parts.supports);
      if (!kind) return;
      const m = solid(ORANGE), dark = solid(INK);
      const y = kind === "top" ? TOP : TOP - DEPTH * K;
      for (const s of [-1, 1]) {
        for (const z of [-WZ / 2 - 0.2, WZ / 2 + 0.2]) {
          const x = s * (SPAN * K / 2 - 0.12);
          const roller = kind === "roller" && s > 0;
          const p = add(parts.supports, new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.34, 4), m));
          p.position.set(x, y - 0.17 - (roller ? 0.12 : 0), z);
          if (roller) for (const dx of [-0.13, 0.13]) {
            const c = add(parts.supports, new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 8).rotateX(Math.PI / 2), dark));
            c.position.set(x + dx, y - 0.4, z);
          }
        }
      }
      for (const [name, s] of [["Rock A", -1], ["Rock B", 1]]) tag(name, () => V(s * (SPAN * K / 2 + 0.3), y - 0.6, WZ / 2 + 0.6), "bank", false, "scene");
    }
    // The walkway's loads: an arrow at every node along the front edge, or one in the middle.
    function loads(kind) {
      clear(parts.loads);
      if (!kind) return;
      const m = solid(kind === "offnode" ? RED : ORANGE);
      const big = kind === "big", len = big ? 1.6 : 0.7, r = big ? 0.05 : 0.025;
      const y0 = kind === "floating" ? TOP : TOP;
      const xs = kind === "point" || kind === "offnode" ? [0] : Array.from({ length: NX + 1 }, (_, i) => X0 + (i * SPAN * K) / NX);
      const zs = kind === "offnode" ? [0] : kind === "point" ? [WZ / 2] : [WZ / 2];
      for (const x of xs) for (const z of zs) arrow(parts.loads, V(x, y0 + 0.05 + len, z), V(x, y0 + 0.05, z), r, m);
      if (kind === "offnode" || kind === "floating") {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.04, 6, 18).rotateX(Math.PI / 2), solid(RED));
        ring.position.set(kind === "offnode" ? 0 : X0, TOP + 0.04, kind === "offnode" ? 0 : WZ / 2);
        parts.loads.add(ring);
      }
    }
    function keep() { shown.deck = "top"; draw(); tag("Kept: the deck", () => at(0, 0.9, 0)); }

    // ---- Runs played back: every iteration's design, about a dozen a second ----
    let anim = null;
    function preview(name, then, opts = {}) {
      const run = RUNS.runs[name];
      shown.visible = true;
      if (!shown.deck) shown.deck = "top";
      anim = { run, at: 0, t: 0, then, fps: opts.fps || 14, label: opts.label };
      if (reduceMotion) { anim.at = run.frames.length - 1; step(); finishAnim(); }
      else step();
    }
    function step() {
      shown.dens = decode(anim.run.frames[anim.at]);
      draw();
      if (anim.label) anim.label.textContent = `Iteration ${anim.run.steps[anim.at]} of ${anim.run.iterations}`;
    }
    function finishAnim() { const a = anim; anim = null; if (a && a.then) a.then(); }

    // The deck's state under the alpaca: solid where its brick is.
    const deckSolid = (x) => {
      if (!shown.visible || shown.drop > 0) return false;
      const i = Math.floor((x - X0) / ((SPAN * K) / shown.nx));
      if (i < 0 || i >= shown.nx) return false;
      const k = shown.rows - 1;
      return (shown.dens ? shown.dens[i + k * shown.nx] : 1) >= 0.5;
    };
    // Across, as far as the deck goes: on to the far side, or into the first hole.
    function cross() {
      const sx = (SPAN * K) / shown.nx;
      let hole = null;
      for (let i = 0; i < shown.nx; i++) { const x = X0 + (i + 0.5) * sx; if (!deckSolid(x)) { hole = X0 + i * sx + 0.1; break; } }
      if (hole == null) kit.play(kit.wait(0.3), kit.walkTo(FAR, 3.4), kit.hop());
      else kit.play(kit.wait(0.3), kit.walkTo(hole, 3.4), kit.wobble(0.8), kit.fall(0.4), kit.wait(0.6), kit.climbBack());
    }
    // A design held by nothing: it drops into the chasm.
    let dropping = null;
    function drop() { dropping = { t: 0 }; if (reduceMotion) { shown.drop = 12; shown.dropAll = true; draw(); dropping = null; } }
    // The last round's answer: the run played, coloured by stress, and the alpaca across.
    function reveal() {
      const label = tag("Iteration 0", () => at(0, 1.3, 0), "right", true);
      preview("right", () => {
        shown.stress = RUNS.stress.mises;
        draw();
        label.textContent = `Iteration ${RUNS.runs.right.iterations}: coloured by Von Mises stress`;
        cross();
      }, { label, fps: 12 });
    }

    // Where the alpaca's feet are: on the deck where it is solid, up a ramp, or on the ground.
    function surface(x) {
      const ground = groundAt(x);
      const half = (SPAN * K) / 2;
      if (Math.abs(x) <= half) return deckSolid(x) ? TOP : ground;
      if (Math.abs(x) < half + RAMP_L) return mix(TOP, ground, (Math.abs(x) - half) / RAMP_L);
      return ground;
    }
    function frame(dt) {
      if (anim) {
        anim.t += dt;
        const n = Math.min(anim.run.frames.length - 1, Math.floor(anim.t * anim.fps));
        if (n !== anim.at) { anim.at = n; step(); }
        if (anim.at >= anim.run.frames.length - 1 && anim.t * anim.fps >= anim.run.frames.length + 6) finishAnim();
      }
      if (dropping) {
        dropping.t += dt;
        shown.drop = 12 * Math.min(1, dropping.t / 1.1) ** 2;
        shown.dropAll = true;
        draw();
        if (dropping.t >= 1.1) dropping = null;
      }
      parts.gizmo.visible = parts.gizmo.children.length > 0;
    }
    // The wiring round: what Assemble Model has not been given is drawn faint, or not at all.
    // The seventh round's wiring hides nothing.
    function ghost(has) {
      if (!has || round !== 4) { shown.faint = null; draw(); parts.supports.children.forEach((m) => { m.visible = true; }); parts.loads.visible = true; return; }
      shown.faint = (deck) => !has("Elements", deck ? "Deck" : "Domain");
      draw();
      parts.supports.children.forEach((m) => { m.visible = has("Supports", m.position.x < 0 ? "Rock A" : "Rock B"); });
      parts.loads.visible = has("LoadPatterns", "Load Pattern");
    }
    // The scene as the rounds before r left it.
    let round = 0;
    function setScene(r) {
      round = r;
      anim = null; dropping = null;
      shown.faint = null;
      if (r >= 1) block({ deck: r >= 2 ? "top" : null }); else { shown.visible = false; draw(); }
      supports(r >= 3 ? "pinned" : null);
      loads(r >= 4 ? "walkway" : null);
      gizmo(r === 0);
      parts.supports.visible = parts.loads.visible = true;
    }

    const api = {
      at, tag, play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, fall: kit.fall, climbBack: kit.climbBack, lookUp: kit.lookUp,
      block, supports, loads, keep, preview, cross, drop, reveal,
    };
    return { api, setScene, frame, surface, ghost, stop: () => { g.remove(bricks); } };
  };
}

// The definition as GhCanvas read it, with Topology Optimisation's box put where it is drawn: a
// component with menus, written outside Rhino, has a box from the origin to its ports.
function tidy(def) {
  for (const o of def.objects) {
    if (o.kind !== "component" || o.box[2] < 600 || !o.pivot) continue;
    const near = [...o.inputs, ...o.outputs].map((p) => p.box).filter((b) => b && Math.abs(b[0] + b[2] / 2 - o.pivot[0]) < 300);
    const x0 = Math.min(...near.map((b) => b[0])), x1 = Math.max(...near.map((b) => b[0] + b[2]));
    const y0 = Math.min(...near.map((b) => b[1])), y1 = Math.max(...near.map((b) => b[1] + b[3]));
    o.box = [x0, y0, x1 - x0, y1 - y0];
  }
  return def;
}

export async function start(world, host, onExit) {
  const [def, runs] = await ready;
  return runLesson(world, host, onExit, {
    id: "summit", chip: "Area 10 · Summit bridge", def: tidy(def), gh: { url: GH_FILE, name: "Summit.gh" },
    rounds: ROUNDS, scene: sceneOf(runs),
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - KEPT_T) <= KEPT_T * 0.2 ? `You guessed ${guess}${NB}t: within a fifth of it. ` : `You guessed ${guess}${NB}t. `;
      return [
        el("p", "", `${said}The bridge keeps ${KEPT_T.toFixed(1)}${NB}t of the block's 144${NB}t: the deck, 14.4${NB}t, which Keep holds whole, and a quarter of the 270 bricks below, 32.4${NB}t. Built from the 90 bricks that end up solid, it is ${BUILT_T.toFixed(1)}${NB}t.`),
        el("p", "pg-calc", `By hand: a brick is 0.4 × 1.2 × 0.4 = 0.192${NB}m³, 0.48${NB}t; the deck 30 × 0.48 = 14.4${NB}t, and 0.25 × 270 × 0.48 = 32.4${NB}t. The arch pushes each wall out with H = wL²/8f = 6 × 12² / (8 × 3.8) = 28.4${NB}kN; OpenSees gives ${runs.stress.H.toFixed(1)}${NB}kN on the design.`),
      ];
    },
    done: { title: "The Summit bridge is done.", body: "Topology Optimisation found where the concrete has to be, and the colours show how hard it works there: material only where the forces flow. The file is your definition; its last group colours the design by Von Mises stress in Rhino, which past 50 elements needs a license." },
  });
}
