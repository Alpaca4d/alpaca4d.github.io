// Area 8, the Footbridge: the Playground's lesson on natural vibration. The old timber footbridge
// over the hill lake bounces when the herd crosses it. In seven rounds the player builds its
// Grasshopper definition - the deck, the span, the abutments, the herd as masses, the wires into
// Assemble Model, the natural vibration analysis - and then fixes it with a pier. Each round but
// the fifth shows snippets to pick from, only one of them right, and the scene shows what each
// would build; in the fifth the player draws the wires.
//
// The definition is footbridge.gh, written by Alpaca4d's Tools/Examples/PlaygroundFootbridge.py.
// The numbers are Alpaca4d's and OpenSees's, solved the way Alpaca4d writes the deck: C24 timber
// (E = 10 500 MPa, 410 kg/m³), 1.2 m by 120 mm over 10 m in ten elements, 60 kg on every node.
// It bounces at 1.94 Hz, as f = π/(2L²)·√(EI/m) gives by hand; the pier makes it 7.75 Hz. The
// panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 10;                         // m from bank to bank
const DECK = { b: 1.2, h: 0.12 };        // m: the deck's width and depth
const E = 10.5e9, RHO = 410, HERD = 60;  // N/m² and kg/m³ for C24; kg of alpaca on every node
const EI = (E * DECK.b * DECK.h ** 3) / 12;          // N·m²
const MASS = RHO * DECK.b * DECK.h + HERD;          // kg in every metre, deck and herd
const BY_HAND = (L) => (Math.PI / (2 * L * L)) * Math.sqrt(EI / MASS);   // Hz
// What OpenSees gives for each, solved the way Alpaca4d writes the deck.
const HZ = { built: 1.939, steel: 2.742, side: 1.939, clamped: 4.391, overhang: 1.630, empty: 2.753, one: 2.509, pier: 7.749, sand: 1.204 };
const SLOW = 0.5;                        // the scene draws every bounce at half speed
const TIMBER = "#d7a865", STEEL = "#9aa4ae", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c", STONE = "#b9b2a2";
const BUILT = { ...DECK, colour: TIMBER };
const f2 = (f) => f.toFixed(2);

// The definition, with what Natural Vibration's folded Modal Report menu holds left out of the
// drawing, as Grasshopper leaves it out of sight.
const ready = loadDefinition(new URL("./footbridge-definition.json", import.meta.url)).then((def) => {
  const vibration = def.objects.find((o) => o.nick === "Natural Vibration");
  if (vibration) vibration.outputs = vibration.outputs.slice(0, 5);
  return def;
});
const GH_FILE = new URL("./footbridge.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Deck", title: "The deck",
    task: `The old footbridge over the lake bounces when the herd crosses it. Model it, then fix it. Start with its deck: C24 timber, 1.2${NB}m wide and 120${NB}mm deep, lying flat. Which definition builds it?`,
    tip: "Follow each slider's wire to the input it lands on. On a horizontal beam a rectangle's Height is the side that points up.",
    options: [
      { key: "right", says: "Deck width 1.20 wired into Width, Deck depth 0.120 into Height, and the C24 material into Material.",
        title: "That's the deck.", body: `1.2${NB}m across and 120${NB}mm deep, in C24 timber: E${NB}=${NB}10${NB}500${NB}MPa, and 410${NB}kg in every cubic metre. Alpaca4d takes both from the material: the stiffness for the bending, and the density for the mass that will vibrate, 59${NB}kg in every metre of deck.`,
        react: (s) => { s.deck(BUILT, "C24, 1.2 m by 120 mm"); s.play(s.wait(0.5), s.walkTo(s.x(1.2)), s.hop()); } },
      { key: "edge", says: "Deck width 1.20 wired into Height, Deck depth 0.120 into Width, and the C24 material into Material.",
        patch: (a) => { a.wire("RectangleCS", "Width", a.src("Deck depth")); a.wire("RectangleCS", "Height", a.src("Deck width")); },
        title: "The deck stands on its edge.", body: `The wires cross: the deck is 1.2${NB}m deep and 120${NB}mm wide. Up and down it is a hundred times as stiff for the same mass, so ten times as quick, 19${NB}Hz. Sideways it is the old deck on its side, and it sways at 1.9${NB}Hz, the way London's Millennium Bridge swayed under its first crowd. And nobody can walk on 12${NB}cm.`,
        react: (s) => { s.deck({ ...BUILT, b: DECK.h, h: DECK.b }, "120 mm wide, 1.2 m deep"); s.play(s.wait(0.5), s.walkTo(s.x(0.6)), s.wobble(1.1), s.dunk(), s.wait(0.8), s.climbBack()); } },
      { key: "steel", says: "Deck width 1.20 wired into Width, Deck depth 0.120 into Height, and the C24 material with no wire out of it.",
        patch: (a) => a.wire("RectangleCS", "Material"),
        title: "It works, but it's a steel deck.", body: `Nothing is wired into Material, so RectangleCS takes its default: steel, 20 times as stiff as timber and 19 times as heavy. Frequency goes up with stiffness and down with mass, and for a solid deck of steel or of timber the two nearly cancel: with the herd on it, 2.7${NB}Hz instead of 1.9. Grasshopper says nothing about an input left empty.`,
        react: (s) => { s.deck({ ...BUILT, colour: STEEL, metal: true }, "Steel, 1.2 m by 120 mm"); s.play(s.wait(0.5), s.walkTo(s.x(1.2)), s.hop()); } },
    ],
  },
  {
    name: "Span", title: "The span",
    task: `The deck spans 10${NB}m from bank to bank. Make it a beam, ForceBeamColumn, cut into elements: a deck vibrates through the mass on its nodes, so it needs nodes along it, not only at its ends.`,
    tip: "Divide Curve gives the parameters t where it cuts the line; Shatter cuts the line there, and ForceBeamColumn makes an element of each piece.",
    options: [
      { key: "right", says: "Span 10 into Bank B's X, Elements 10 into Divide Curve, its parameters into Shatter, Shatter's segments into Line, and the section into Section.",
        title: "Ten elements, eleven nodes.", body: `Each element puts half its mass on each of its two nodes, so the deck's 590${NB}kg sits on eleven nodes a metre apart. The nine between the abutments are free to move: that is where the deck can bounce.`,
        react: (s) => { s.nodes(11); s.play(s.wait(0.4), s.hop()); } },
      { key: "one", says: "The deck line itself into Line, Shatter's segments going nowhere, and the section into Section.",
        patch: (a) => a.wire("Deck", "Line", a.src("Deck line", "L")),
        title: "One element: nothing left to vibrate.", body: `One element has a node at each end and none between, and both ends sit on the abutments, which hold them still. All the deck's mass lands where nothing moves, so there is no mode to find: Natural Vibration will stop with “Analysis Failed”, and OpenSees's log says it “Could not build an Arnoldi factorization”.`,
        react: (s) => { s.nodes(2); s.tag("No node between the abutments", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "nosection", says: "Elements 10, Shatter's segments into Line, and nothing into Section.",
        patch: (a) => a.wire("Deck", "Section"),
        title: "No section, no deck.", body: "Nothing is wired into Section, and ForceBeamColumn cannot make a beam without one: it turns orange with “Input parameter Section failed to collect data” and gives nothing out. Section has no default.",
        react: (s) => { s.deck(null); s.tag("Input parameter Section failed to collect data", () => s.at(0, 1.4, 0), "wrong"); } },
    ],
  },
  {
    name: "Abutments", title: "The abutments",
    task: "The deck rests on its two abutments: a pin at Bank A and a roller at Bank B. Its ends can turn, and Bank B's can slide a little as the deck bends.",
    tip: "A Support holds every direction left empty: True. Free is False, so each wire from it lets the deck move that way. Tx, Ty and Tz move along X, Y and Z; Rx, Ry and Rz turn about them.",
    options: [
      { key: "right", says: "Free wired into the Pin's Ry and Rz, and into the Roller's Tx, Ry and Rz.",
        title: "A pin and a roller.", body: "Both ends turn freely, as a deck resting on its abutments does, and the roller lets the deck slide as it bends. Both hold Rx, so the deck cannot roll off them.",
        react: (s) => { s.supports("pin-roller"); s.play(s.wait(0.4), s.hop()); } },
      { key: "fixed", says: "Nothing wired from Free: every input of both supports is held.",
        patch: (a) => { for (const n of ["Ry", "Rz"]) a.wire("Pin", n); for (const n of ["Tx", "Ry", "Rz"]) a.wire("Roller", n); },
        title: "Built in at both ends: quicker on paper.", body: `Clamped at both ends the deck would bounce 2.3 times as quick, 4.4${NB}Hz, close to the 5${NB}Hz above which nobody asks for a comfort check. But it rests on its abutments, and they let it turn: the real deck does 1.9. A model stiffer than the bridge flatters it, and the herd finds out.`,
        react: (s) => { s.supports("fixed"); s.mode("clamped", HZ.clamped); s.tag(`${f2(HZ.clamped)} Hz on paper`, () => s.at(0, 1.8, 0), "wrong"); } },
      { key: "overhang", says: "The Roller's Position from Curve Middle, the middle of the deck, instead of Bank B.",
        patch: (a) => {
          const r = a.get("Roller");
          a.add(a.newComponent("mid", "Mid-span", "Mid-span", r.box[0] - 190, r.box[1] + 30, { C: [a.src("Deck line", "L")] }));
          a.wire("Roller", "Position", "mid.out0");
        },
        title: "Half the deck hangs over the lake.", body: `The roller is at mid-span, so the deck spans 5${NB}m and hangs 5${NB}m more off the end, with nothing under it. That end swings up and down at 1.6${NB}Hz, slower still: a deck held from one side only is the floppiest of all.`,
        react: (s) => { s.supports("overhang"); s.mode("overhang", HZ.overhang); s.tag("Nothing under Bank B's end", () => s.at(s.x(10), 1.8, 0), "wrong"); } },
    ],
  },
  {
    name: "Herd", title: "The herd",
    task: `The herd crosses nose to tail, an alpaca of 60${NB}kg on every metre of deck. Put them on it as mass, a Mass Point on every node: a vibration is about what has to be moved, not what pushes.`,
    tip: "Mass Point takes Point, which has to land on a node, and TransMass, the mass along X, Y and Z in kg. Vector XYZ makes a vector of its X, Y and Z.",
    options: [
      { key: "right", says: "Alpaca mass 60 into X, Y and Z of Each alpaca, Each alpaca into TransMass, and Divide Curve's points into Point.",
        title: "An alpaca on every node.", body: `Each of the eleven nodes carries 60${NB}kg along X, Y and Z: a mass resists being moved whichever way it goes. With the deck's own 59${NB}kg, every metre now carries 119${NB}kg, and as the herd trots across, the deck starts to bounce.`,
        react: (s) => { s.herd("all"); s.mode("simple", HZ.built); s.tag("The deck bounces as they trot", () => s.at(0, 3.2, 0), "right"); } },
      { key: "kn", says: "Alpaca mass 0.60 into X, Y and Z of Each alpaca, Each alpaca into TransMass, and Divide Curve's points into Point.",
        patch: (a) => a.slider("Alpaca mass", 0.6, { max: 1, digits: 2 }),
        title: "That's a herd of hamsters.", body: `0.6 is an alpaca's weight in kN, as a Point Load takes it. A Mass Point takes kg, so this is 0.6${NB}kg on every node: the deck vibrates as if it were empty, 2.7${NB}Hz. A mass and its weight are different things, and Alpaca4d asks for each in its own unit: 60${NB}kg weighs 0.6${NB}kN.`,
        react: (s) => { s.herd("hamsters"); s.tag("0.6 kg on each node", () => s.at(0, 2.4, 0), "wrong"); } },
      { key: "x", says: "Alpaca mass 60 into X only of Each alpaca, Each alpaca into TransMass, and Divide Curve's points into Point.",
        patch: (a) => { a.wire("Each alpaca", "Y"); a.wire("Each alpaca", "Z"); },
        title: "The herd weighs nothing up and down.", body: `The mass goes along X only, so when the deck moves up and down the herd is not there at all: 2.75${NB}Hz, the empty deck's frequency. A mass has no direction of its own: put the same 60 along X, Y and Z.`,
        react: (s) => { s.herd("x"); s.tag("Mass along X only", () => s.at(0, 2.4, 0), "wrong"); } },
      { key: "one", says: "Alpaca mass 60 into X, Y and Z of Each alpaca, Each alpaca into TransMass, and Curve Middle, a single point, into Point.",
        patch: (a) => {
          const h = a.get("Herd");
          a.add(a.newComponent("mid", "Mid-span", "Mid-span", h.box[0] - 190, h.box[1] + 70, { C: [a.src("Deck line", "L")] }));
          a.wire("Herd", "Point", "mid.out0");
        },
        title: "That's one alpaca, not a herd.", body: `Curve Middle gives a single point, so the herd is one alpaca of 60${NB}kg in the middle, and the deck bounces at 2.5${NB}Hz. A Mass Point puts its mass on every point it is given: Divide Curve's eleven points make eleven alpacas.`,
        react: (s) => { s.herd("one"); s.tag("One alpaca, at mid-span", () => s.at(0, 2.8, 0), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Wire it all into Assemble Model: the deck's elements, both abutments, and the herd. A Mass Point goes straight into LoadPatterns, beside any load patterns. Here there are none: a vibration needs no load.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The four it needs, one under the other, and two that look as if they could go in.
      offered: ["Shatter", "Deck", "Pin", "Roller", "Each alpaca", "Herd"],
      wants: { Elements: ["Deck"], Supports: ["Pin", "Roller"], LoadPatterns: ["Herd"] },
      takes: {
        Elements: "the elements, from ForceBeamColumn", Supports: "the supports",
        LoadPatterns: "load patterns, and masses: a Mass Point goes straight in", Constraints: "rigid links and diaphragms, and the deck has none",
        Recorders: "recorders: leave it empty, Natural Vibration records the modes itself", Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Deck: "the deck's elements", Pin: "a support", Roller: "a support", Herd: "the herd's masses",
        "Each alpaca": "a vector, 60 along X, Y and Z: not yet a mass on a node", Shatter: "the line's segments, only geometry",
      },
      checks: [
        [(has) => has("Elements", "Deck"), "Elements: the deck's elements"],
        [(has) => has("Supports", "Pin") && has("Supports", "Roller"), "Supports: the pin and the roller"],
        [(has) => has("LoadPatterns", "Herd"), "LoadPatterns: the herd's masses"],
      ],
      first: "Start with the deck: drag a wire from Deck's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the footbridge, herd and all.", body: `Assemble Model's Mass reads 1${NB}250${NB}kg: the deck's 590 and the herd's 660, the two alpacas standing over the abutments counted too, though they never move.` },
    },
  },
  {
    name: "Vibration", title: "Natural vibration",
    task: "Find the deck's modes. Natural Vibration Analysis solves for them straight from Assemble Model, with no Analysis Settings, and Model View draws the first. How many times a second does the deck bounce?",
    tip: "Natural Vibration gives out Eigenvalues, Period and Frequencies, one per mode, lowest first. A frequency is bounces a second, in Hz; a period is the time one bounce takes, in seconds.",
    options: [
      { key: "right", says: "Assemble Model into Natural Vibration, Modes 3, its Frequencies into the panel and its model into Model View.",
        title: `${f2(HZ.built)}${NB}Hz: the pace of walking.`, body: `The deck's first mode goes up and down in a single arch, 1.94 times a second. People walk at about two steps a second, and the herd trots as fast: each step pushes the deck just as it comes back up, and the bounce builds. Eurocode 0 asks for a comfort check below 5${NB}Hz. By hand: f${NB}=${NB}π/(2L²)·√(EI/m)${NB}=${NB}π/200${NB}×${NB}√(1${NB}814${NB}000${NB}/${NB}119)${NB}=${NB}${f2(BY_HAND(SPAN))}${NB}Hz.`,
        react: (s) => { s.mode("simple", HZ.built); s.play(s.wait(0.4), s.hop()); s.tag(`${f2(HZ.built)} Hz, drawn at half speed`, () => s.at(0, -1.6, 2.2), "right", true); } },
      { key: "period", says: "Assemble Model into Natural Vibration, Modes 3, its Period into the panel and its model into Model View.",
        patch: (a) => { a.get("Frequencies").src = [a.src("Natural Vibration", "Period")]; },
        title: "That's a period, not a frequency.", body: `The panel reads 0.516: the Period, the time one bounce takes, in seconds. The frequency is one over it, 1${NB}/${NB}0.516${NB}=${NB}1.94${NB}Hz. Follow the panel's wire back to the output it starts from.`,
        react: (s) => { s.mode("simple", HZ.built); s.tag("0.516 s for one bounce", () => s.at(0, 2.6, 0), "wrong"); } },
      { key: "eigen", says: "Assemble Model into Natural Vibration, Modes 3, its Eigenvalues into the panel and its model into Model View.",
        patch: (a) => { a.get("Frequencies").src = [a.src("Natural Vibration", "Eigenvalues")]; },
        title: "That's an eigenvalue, not a frequency.", body: `The panel reads 148: the eigenvalue, the square of the circular frequency ω, in rad²/s². The frequency is √148${NB}/${NB}2π${NB}=${NB}1.94${NB}Hz, and Natural Vibration works it out for you: wire Frequencies.`,
        react: (s) => { s.mode("simple", HZ.built); s.tag("148 rad²/s²", () => s.at(0, 2.6, 0), "wrong"); } },
      { key: "symm", says: "Assemble Model into Natural Vibration, Modes 3, a panel reading -symmBandLapack into its Solver, and its Frequencies into the panel.",
        patch: (a) => {
          const v = a.get("Natural Vibration");
          a.add({ kind: "panel", id: "solver", type: "59e0b89a-e487-49f8-bab8-b5bab16be14c", name: "Panel", nick: "Solver", desc: "A panel", text: "-symmBandLapack", box: [v.pivot[0] - 230, v.pivot[1] + 70, 110, 24], src: [], colour: [255, 255, 250, 90] });
          a.wire("Natural Vibration", "Solver", "solver");
        },
        title: "That solver leaves the mass out.", body: "Natural Vibration stops: “-symmBandLapack solves only the standard eigenvalue problem, without the mass, so it cannot give natural frequencies. Use -genBandArpack, or -fullGenLapack for every mode of a small model.” Leave Solver empty: -genBandArpack is its default.",
        react: (s) => { s.tag("-symmBandLapack cannot give natural frequencies", () => s.at(0, 1.6, 0), "wrong"); } },
    ],
  },
  {
    name: "Pier", title: "The pier", guess: { question: "With a pier under the middle, how many times a second will the deck bounce?", unit: "Hz", step: "0.1", min: 0 },
    task: `1.9${NB}Hz is in step with the herd. Get the deck above 5${NB}Hz: build a pier in the lake under mid-span, and wire it into Assemble Model's Supports beside the other two, holding Shift. First, make a guess.`,
    tip: "A pier holds the deck up in the middle: Tz held, the rest free, as the roller has it. Each half is then a bridge of its own.",
    options: [
      { key: "right", says: "Curve Middle into the Pier's Position, and Free into its Tx, Ry and Rz.",
        title: `${f2(HZ.pier)}${NB}Hz.`,
        react: (s) => { s.pier("holds"); s.mode("pier", HZ.pier); s.play(s.wait(0.4), s.hop()); s.tag(`${f2(HZ.pier)} Hz, drawn at half speed`, () => s.at(0, -1.6, 2.2), "right", true); } },
      { key: "tz", says: "Curve Middle into the Pier's Position, and Free into its Tx, Tz, Ry and Rz.",
        patch: (a) => a.wire("Pier", "Tz", a.src("Free")),
        title: "The pier holds nothing up.", body: `Free goes into Tz as well, so the pier lets the deck move up and down at mid-span: it stands there and does nothing, and the deck still bounces at 1.94${NB}Hz. A support holds only what is left empty.`,
        react: (s) => { s.pier("gap"); s.mode("simple", HZ.built); s.tag("Free in Tz: it holds nothing up", () => s.at(0, 2.6, 0), "wrong"); } },
      { key: "sand", says: "A tonne of sandbags at Curve Middle, as a Mass Point, instead of the pier.",
        patch: (a) => {
          const p = a.get("Pier"), m = a.get("Mid-span");
          a.remove("Pier");
          a.add(a.newSlider("bags", "Sandbags", 1000, 0, 2000, 0, m.box[0] - 210, p.box[1] + 150));
          a.add(a.newComponent("tonne", "Each alpaca", "A tonne", m.box[0], p.box[1] + 120, { X: ["bags"], Y: ["bags"], Z: ["bags"] }));
          a.add(a.newComponent("sand", "Herd", "Sandbags", p.box[0], p.box[1] + 30, { Point: [a.src("Mid-span", "M")], TransMass: ["tonne.out0"] }));
        },
        title: "Heavier is slower.", body: `A tonne of sandbags calms nothing: the deck has more to move and no more stiffness to move it, so it is slower, 1.2${NB}Hz, deeper into the pace of walking. Frequency falls with mass and rises with stiffness, and a pier is stiffness.`,
        react: (s) => { s.sandbags(); s.mode("simple", HZ.sand); s.tag("A tonne of sandbags", () => s.at(0, 2.8, 0), "wrong"); } },
    ],
  },
];

// ---- The scene: the deck across the lake, as each round builds it ----
// A mode's shape along the deck, s from 0 at Bank A to 1 at Bank B, largest 1.
const SHAPES = {
  simple: (s) => Math.sin(Math.PI * s),
  clamped: (s) => (s <= 0 || s >= 1 ? 0 : (1 - Math.cos(2 * Math.PI * s)) / 2),
  pier: (s) => Math.sin(2 * Math.PI * s),
  overhang: (s) => (s < 0.5 ? -0.3 * Math.sin(2 * Math.PI * s) : ((s - 0.5) / 0.5) ** 1.6),
  side: (s) => Math.sin(Math.PI * s),
};

function scene(kit) {
  const { g, world, solid, add, clear, arrow, groundAt, tag, al, reduceMotion } = kit;
  const HALF = 8;                             // the toy world's distance from mid-span to an abutment
  const k = (2 * HALF) / SPAN;                // the toy world's metres per real metre
  const X = (m) => -HALF + m * k;             // metres from Bank A, in the area's frame
  const OVER = 0.35;                          // how far the deck runs past each abutment
  const SEAT = 0.42;                          // the abutments' top, under the deck
  const LAKE = -0.55;                         // the lake's water, in the area's frame
  kit.home = -HALF - 3.4;
  kit.view = { at: V(-0.9, 0.3, 0), w: 25, h: 12 };
  kit.hideStructure();

  // The abutments, always there: the deck rests on them.
  const stone = solid(STONE);
  for (const s of [-1, 1]) {
    const x = s * (HALF + 0.15), bottom = Math.min(groundAt(x - 0.8), groundAt(x + 0.8)) - 0.6, h = SEAT - bottom;
    const m = add(g, new THREE.Mesh(new THREE.BoxGeometry(1.6, h, 3.4), stone));
    m.position.set(x, bottom + h / 2, 0);
    m.receiveShadow = true;
  }

  const parts = { nodes: new THREE.Group(), supports: new THREE.Group(), herd: new THREE.Group(), masses: new THREE.Group(), pier: new THREE.Group() };
  Object.values(parts).forEach((p) => g.add(p));
  let deck = null, motion = null, splash = null;
  const red = solid(RED), ink = solid(INK), orange = solid(ORANGE);

  // The deck as a section builds it: segmented, so it can bounce.
  function deckOf(spec) {
    if (deck) { g.remove(deck.mesh); deck.mesh.geometry.dispose(); deck = null; }
    if (!spec) return;
    const geo = new THREE.BoxGeometry(2 * (HALF + OVER), 1, 1, 64, 1, 1);
    const mat = solid(spec.colour, { roughness: spec.metal ? 0.35 : 0.8, metalness: spec.metal ? 0.55 : 0, transparent: true });
    const mesh = add(g, new THREE.Mesh(geo, mat));
    mesh.receiveShadow = true;
    deck = { spec, mesh, size: { y: Math.max(spec.h * k, 0.12), z: Math.max(spec.b * k, 0.12) }, grow: reduceMotion ? 1 : 0, rest: geo.attributes.position.array.slice() };
    sizeDeck();
  }
  function sizeDeck() {
    const t = smooth(deck.grow);
    const sy = mix(0.1, deck.size.y, t), sz = mix(0.1, deck.size.z, t);
    deck.mesh.scale.set(1, sy, sz);
    deck.mesh.position.y = SEAT + sy / 2;
  }
  const deckTop = () => (deck ? SEAT + deck.mesh.scale.y : SEAT);
  const halfWidth = () => (deck ? deck.mesh.scale.z / 2 : 0.9);

  // The deck moving in a mode: how far each point is off its rest, up (or sideways), now.
  function modeOf(shape, hz) {
    motion = shape ? { shape, hz, t: 0 } : null;
  }
  function offset(x) {
    if (!motion) return 0;
    const s = (x + HALF) / (2 * HALF);
    const amp = (motion.shape === "side" ? 0.7 : 0.5) * Math.min(1, motion.t / 0.8);
    return amp * SHAPES[motion.shape](s) * Math.sin(2 * Math.PI * motion.hz * SLOW * motion.t);
  }
  const up = (x) => (motion && motion.shape !== "side" ? offset(x) : 0);
  const aside = (x) => (motion && motion.shape === "side" ? offset(x) : 0);
  const onDeck = (x) => deckTop() + up(x);

  // Nodes, as dots on the deck: n of them, from bank to bank.
  function nodes(n) {
    clear(parts.nodes);
    for (let i = 0; n && i < n; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 8), ink);
      dot.userData.x = X((SPAN * i) / (n - 1));
      parts.nodes.add(dot);
    }
  }
  // Support symbols beside the deck's ends, on the abutments: a pyramid for a pin, on rollers for a
  // roller, a clamp over the end for one built in; the overhang's roller at mid-span.
  function supports(kind) {
    clear(parts.supports);
    if (!kind) return;
    const z = 1.35;
    const symbol = (x, roller) => {
      const lift = roller ? 0.26 : 0;
      const p = add(parts.supports, new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.62, 4), orange));
      p.position.set(x, SEAT + lift + 0.31, z);
      if (roller) for (const dx of [-0.24, 0.24]) {
        const c = add(parts.supports, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 10).rotateX(Math.PI / 2), ink));
        c.position.set(x + dx, SEAT + 0.12, z);
      }
    };
    if (kind === "fixed") {
      for (const s of [-1, 1]) {
        const c = add(parts.supports, new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.5, 2.6), ink));
        c.position.set(s * (HALF + 0.2), SEAT + 0.45, 0);
      }
    } else if (kind === "overhang") {
      symbol(X(0), false);
      symbol(X(5), true);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.07, 6, 20).rotateX(Math.PI / 2), red);
      ring.position.set(X(5), SEAT + 0.04, z);
      parts.supports.add(ring);
    } else {
      symbol(X(0), false);
      symbol(X(SPAN), true);
    }
  }

  // The herd: little alpacas on the deck, and the model's masses beside it, a block per node -
  // as big as the mass, along X only, or one in the middle.
  let herdKind = null;
  function herd(kind) {
    herdKind = kind;
    clear(parts.herd);
    clear(parts.masses);
    if (!kind) return;
    const src = world.alpaca.children[0];
    const at = kind === "one" ? [5] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    if (src) at.forEach((m, i) => {
      const a = src.clone();
      a.scale.multiplyScalar(0.3);
      a.userData.x = X(m);
      a.userData.z = kind === "one" ? 0 : (i % 2 ? 0.35 : -0.35);
      parts.herd.add(a);
    });
    const size = kind === "hamsters" ? 0.09 : 0.36;
    for (let i = 0; i <= SPAN; i++) {
      if (kind === "one" && i !== 5) continue;
      const block = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), ink);
      block.userData.x = X(i);
      parts.masses.add(block);
      if (kind === "x") {
        const arr = new THREE.Group();
        arrow(arr, V(-0.55, 0, 0), V(0.55, 0, 0), 0.05, orange);
        arr.userData.x = X(i);
        arr.userData.arrow = true;
        parts.masses.add(arr);
      }
    }
  }
  // The pier under mid-span: holding the deck up, or stopping short of it.
  function pier(kind) {
    clear(parts.pier);
    if (!kind) return;
    const floor = groundAt(0), top = kind === "gap" ? SEAT - 0.55 : SEAT, h = top - floor;
    const col = add(parts.pier, new THREE.Mesh(new THREE.BoxGeometry(0.8, h, 1.6), stone));
    col.position.set(0, floor + h / 2, 0);
    if (kind === "gap") {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.07, 6, 20).rotateX(Math.PI / 2), red);
      ring.position.set(0, top + 0.2, 0);
      parts.pier.add(ring);
    }
  }
  function sandbags() {
    clear(parts.pier);
    const bag = solid("#a07850");
    [[-0.5, 0, -0.3], [0.5, 0, 0.3], [0, 0, -0.1], [-0.2, 1, 0.1], [0.3, 1, -0.2], [0, 2, 0]].forEach(([dx, row, dz], i) => {
      const b = add(parts.pier, new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.36, 0.7), bag));
      b.userData = { x: dx, row, dz, deck: true };
      b.rotation.y = i * 0.4;
    });
  }

  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    if (deck) deck.mesh.material.opacity = !has || has("Elements", "Deck") ? 1 : 0.28;
    parts.supports.children.forEach((m) => { m.visible = !has || has("Supports", m.position.x < 0 ? "Pin" : "Roller"); });
    parts.herd.visible = parts.masses.visible = !has || has("LoadPatterns", "Herd");
  }

  // Into the lake off the side of the deck, with a splash.
  const dunk = () => {
    let y0;
    return { dur: 0.8, start() { y0 = surface(al.x, al.z); }, run(t) {
      al.roll = mix(0, 1.7, smooth(t));
      al.z = mix(0, 2.8, t);
      al.y = mix(y0, LAKE - 0.8, t * t) + Math.sin(Math.PI * t) * 0.6;
      if (t === 1) { if (splash) g.remove(splash.mesh); splash = { mesh: ripple(al.x, al.z), t: 0 }; }
    } };
  };
  function ripple(x, z) {
    const mesh = new THREE.Mesh(new THREE.RingGeometry(0.6, 1.1, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.9 }));
    mesh.position.set(x, LAKE + 0.06, z);
    g.add(mesh);
    return mesh;
  }

  // Where the alpaca's feet are at x: on the deck, or on the ground with a step up to it.
  function surface(x) {
    const ground = groundAt(x);
    const end = HALF + OVER;
    if (!deck || Math.abs(x) > end + 1.2) return ground;
    const top = onDeck(Math.max(-end, Math.min(end, x)));
    return mix(ground, top, smooth(Math.min(1, (end + 1.2 - Math.abs(x)) / 1.2)));
  }

  function frame(dt) {
    if (motion) motion.t += dt;
    if (deck) {
      if (deck.grow < 1) { deck.grow = Math.min(1, deck.grow + dt / 0.45); sizeDeck(); }
      const pos = deck.mesh.geometry.attributes.position, rest = deck.rest, sy = deck.mesh.scale.y, sz = deck.mesh.scale.z;
      for (let i = 0; i < pos.count; i++) {
        const x = rest[i * 3];
        pos.array[i * 3 + 1] = rest[i * 3 + 1] + up(x) / sy;
        pos.array[i * 3 + 2] = rest[i * 3 + 2] + aside(x) / sz;
      }
      pos.needsUpdate = true;
      deck.mesh.geometry.computeVertexNormals();
    }
    parts.nodes.children.forEach((d) => d.position.set(d.userData.x, onDeck(d.userData.x) + 0.12, aside(d.userData.x)));
    parts.herd.children.forEach((a) => a.position.set(a.userData.x, onDeck(a.userData.x), a.userData.z + aside(a.userData.x)));
    parts.masses.children.forEach((b) => b.position.set(b.userData.x, onDeck(b.userData.x) - 0.05, halfWidth() + 0.5 + aside(b.userData.x)));
    parts.pier.children.forEach((b) => { if (b.userData.deck) b.position.set(b.userData.x, onDeck(0) + 0.18 + b.userData.row * 0.34, b.userData.dz); });
    if (splash) {
      splash.t += dt;
      splash.mesh.scale.setScalar(1 + splash.t * 3);
      splash.mesh.material.opacity = Math.max(0, 0.9 - splash.t * 1.1);
      if (splash.t > 0.9) { g.remove(splash.mesh); splash = null; }
    }
  }

  // The scene as the rounds before r left it: in the last, the deck bounces, as the analysis found.
  function setScene(r) {
    if (splash) { g.remove(splash.mesh); splash = null; }
    deckOf(r > 0 ? BUILT : null);
    nodes(r > 1 ? 11 : 0);
    supports(r > 2 ? "pin-roller" : null);
    herd(r > 3 ? "all" : null);
    pier(null);
    modeOf(r > 5 ? "simple" : null, HZ.built);
    if (r === 0 || r === 2) for (const [name, m] of [["Bank A", 0], ["Bank B", SPAN]]) tag(name, () => V(X(m) + (m ? 1.2 : -1.2), SEAT + 0.3, 2.6), "bank", false, "scene");
  }

  // The scene's hands, for the rounds' reactions.
  const api = {
    x: X, at: (x, y, z) => V(x, SEAT + y, z), tag,
    deck: (spec, label) => {
      deckOf(spec);
      // On its edge, the deck sways sideways, as its first mode does.
      if (spec && spec.b < spec.h) modeOf("side", HZ.side);
      if (spec && label) tag(label, () => V(0, deckTop() + 1.4, -halfWidth()));
    },
    nodes, supports, herd, pier, sandbags,
    mode: (shape, hz) => modeOf(shape, hz),
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, climbBack: kit.climbBack, lookUp: kit.lookUp, dunk,
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, ghost, stop: () => { deckOf(null); if (splash) g.remove(splash.mesh); } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "footbridge", chip: "Area 8 · Footbridge", def, gh: { url: GH_FILE, name: "Footbridge.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - HZ.pier) <= HZ.pier * 0.2 ? `You guessed ${guess}${NB}Hz: within a fifth of it. ` : `You guessed ${guess}${NB}Hz. `;
      return [
        el("p", "", `${said}OpenSees finds ${f2(HZ.pier)}${NB}Hz, four times 1.94: the pier halves the span, and a frequency goes with one over the span squared. The deck is well above 5${NB}Hz now, too quick for anyone to walk in step with.`),
        el("p", "pg-calc", `By hand: f = π/(2L²)·√(EI/m) = π/(2 × 5²) × √(1${NB}814${NB}000 / 119) = ${f2(BY_HAND(SPAN / 2))}${NB}Hz, with EI = 10${NB}500 MPa × 1.2 × 0.12³ / 12 = 1${NB}814${NB}000 N·m² and m = 410 × 1.2 × 0.12 + 60 = 119 kg/m.`),
      ];
    },
    done: { title: "The Footbridge is done.", body: "You found what makes a deck bounce: its stiffness against its mass, and how far it spans. The file is the definition you put together, the pier and all, ready to open in Grasshopper with Alpaca4d." },
  });
}
