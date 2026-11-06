// Area 4, the Barn: a portal frame in the wind. In seven rounds the player builds the Grasshopper
// definition of one frame of a timber barn, two posts and a beam: the frame's lines, the posts, the
// beam with its knees, the footings, the wind, the wires into Assemble Model, and the analysis.
// The posts are set in concrete footings and the beam is bolted across their tops, so the knees are
// hinges: the lesson is about what a joint holds, and how far the frame sways for it.
//
// The definition is barn.gh, written by Alpaca4d's Tools/Examples/PlaygroundBarn.py. The numbers
// are Alpaca4d's and OpenSees's: metres and kN, C24 timber 200 x 300 mm (E = 10 500 MPa), 3 kN of
// wind at the top of a post 4 m tall, and 6.8 mm of sway, which each post's cantilever gives by
// hand too. The panel, the rounds and the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

const SPAN = 6, HEIGHT = 4;              // m: between the posts, and up to the knees
const WIND = 3;                          // kN, at the top of Post A
const E_TIMBER = 10.5e6;                 // kN/m²
const B = 0.2, D = 0.3;                  // m: the section's Width, across the barn, and Height, in the frame's plane
const EXAGGERATE = 100;                  // as Model View draws it in barn.gh
const TIMBER = "#d7a865", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c", CONCRETE = "#b9b2a2";
const HAND = ((WIND * HEIGHT ** 3) / (6 * E_TIMBER * (B * D ** 3) / 12)) * 1000;   // mm
// The sway of the top of each post, in mm, as OpenSees gives it for each definition (Alpaca4d's
// Tcl, BandGeneral, BandSPD and Mumps agree): A and B along X, and their feet's slide.
const SWAY = {
  right: { a: 6.81, b: 6.80 },             // footings fixed, knees hinged
  roller: { a: 13.61, b: 13.61, bBase: 13.61 },   // Footing B free along X
  across: { ya: 22.95, yb: 7.59 },         // the wind along Y, out of the frame's plane
};

const ready = loadDefinition(new URL("./barn-definition.json", import.meta.url));
const GH_FILE = new URL("./barn.gh", import.meta.url).href;

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Frame", title: "The frame",
    task: `A portal frame is two posts and a beam, and a barn's wall is a row of them. Draw this one's three lines: Post A from Base A, at the origin, up to Top A; the beam across to Top B, 6${NB}m along X; and Post B up from Base B. Each line has to end exactly where the next begins.`,
    tip: "Follow each wire from a point into a Line's A or B: which two points does each line join?",
    options: [
      { key: "right", says: "Height into the Z of Top A and Top B, Span into the X of Top B and Base B, and each line between its two points.",
        title: "Two posts and a beam.", body: `Base A and Base B stand on the ground 6${NB}m apart along X, and Top A and Top B are 4${NB}m above them: Height goes into their Z. Each line ends on a point the next one starts from, so the posts and the beam will share their nodes at the knees.`,
        react: (s) => { s.lines("right"); s.play(s.wait(0.4), s.hop()); } },
      { key: "diagonal", says: "The beam line's B wired from Base B instead of Top B.",
        patch: (a) => a.wire("Beam line", "B", a.src("Base B", "Pt")),
        title: "That's a brace, not a beam.", body: "The beam line's B comes from Base B, so it runs from Top A down to the far footing: a diagonal. Post B stands on its own, its top joined to nothing.",
        react: (s) => { s.lines("diagonal"); s.tag("Top B joined to nothing", () => s.at(SPAN, HEIGHT + 0.9, 0), "wrong"); } },
      { key: "flat", says: "Height wired into Top B's Y instead of its Z.",
        patch: (a) => { a.wire("Top B", "Z"); a.wire("Top B", "Y", a.src("Height")); },
        title: "Top B lies on the ground.", body: `Height goes into Top B's Y, not its Z, so Top B is 4${NB}m along Y at ground level: Post B lies flat on the barn floor, and the beam slopes down to it. Z points up; Y runs across the barn.`,
        react: (s) => { s.lines("flat"); s.tag("Along Y: flat on the floor", () => s.at(SPAN, 0.4, 2.4), "wrong"); } },
    ],
  },
  {
    name: "Posts", title: "The posts",
    task: `Make the two posts elements: one ForceBeamColumn with both posts' lines, C24 timber 200${NB}mm by 300${NB}mm, with the 300 in the frame's plane, so that they bend their strong way when the wind pushes.`,
    tip: "On a post, a rectangle's Height lies along X, in the frame's plane, and its Width along Y. Two lines into one input make two elements, but the second wire has to be added with Shift, or it replaces the first.",
    options: [
      { key: "right", says: "Post A and Post B both into Line, Width 0.200 into Width, Depth 0.300 into Height, and the section into Section.",
        title: "Two posts, standing the strong way.", body: `Both lines go into Line, so ForceBeamColumn makes two elements, one per post. On an upright member Alpaca4d points the side Height measures along X, so the 300 lies in the frame's plane and the posts resist the sway with I${NB}=${NB}0.2${NB}×${NB}0.3³${NB}/${NB}12.`,
        react: (s) => { s.posts({}, "C24 · 200 × 300 mm"); s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.hop()); } },
      { key: "replaced", says: "Only Post B wired into Line: its wire replaced Post A's.",
        patch: (a) => a.wire("Posts", "Line", a.src("Post B", "L")),
        title: "Only Post B is an element.", body: "Post B's wire took the place of Post A's: in Grasshopper a new wire into an input replaces the one there, unless you hold Shift as you let go. Post A is still only a line, and nothing would hold Top A up.",
        react: (s) => { s.posts({ only: "b" }); s.tag("Post A: only a line", () => s.at(0, HEIGHT / 2, -0.6), "wrong"); } },
      { key: "weak", says: "Width wired from Depth 0.300 and Height from Width 0.200: the wires crossed.",
        patch: (a) => { a.wire("RectangleCS", "Width", a.src("Depth")); a.wire("RectangleCS", "Height", a.src("Width")); },
        title: "The posts stand the weak way.", body: `The wires cross, so Height is 0.2 and Width 0.3. On a post Height lies along X, so the 300 now runs across the barn, out of the frame's plane, and in the plane the posts bend about their weak axis: 2.25 times less stiff. In the wind the frame would sway 15.3${NB}mm instead of 6.8.`,
        react: (s) => { s.posts({ weak: true }, "300 across the barn · the weak way"); s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.wobble(1)); } },
    ],
  },
  {
    name: "Beam", title: "The beam",
    task: "The beam is bolted across the posts' tops, and bolts let it turn there: the knees are hinges. Make the beam a ForceBeamColumn WithHinges and give both its ends, ReleaseI at Top A and ReleaseJ at Top B, a Hinge Release that lets them turn in the frame's plane.",
    tip: "A Hinge Release holds every direction left empty, as a Support does. Its Tx to Rz are the beam's own axes: x along the beam, y up, z across the barn. A beam bends in the frame's plane by turning about its own z.",
    options: [
      { key: "right", says: "Free wired into the Knee's Rz, and the Knee into both the beam's ReleaseI and ReleaseJ.",
        title: "Hinged at both knees.", body: "Free is False, and it goes into the Knee's Rz: each end of the beam is free to turn in the frame's plane. The beam can't hold the posts square any more. It only ties their tops together, so in the wind each post will stand as a cantilever from its footing.",
        react: (s) => { s.beam("both"); s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.hop()); } },
      { key: "rigid", says: "Nothing wired into the Knee, and the Knee into both ReleaseI and ReleaseJ.",
        patch: (a) => a.wire("Knee", "Rz"),
        title: "Those knees are rigid.", body: `Nothing goes into the Knee, so it holds every direction: both knees are rigid, as if glued or welded. Bolts let a beam turn. In the wind the model would sway 2.8${NB}mm where the barn sways 6.8: it flatters the frame.`,
        react: (s) => { s.beam("none"); s.tag("Rigid knees: 2.8 mm, not 6.8", () => s.at(SPAN / 2, HEIGHT + 1.1, 0), "wrong"); } },
      { key: "sideways", says: "Free wired into the Knee's Ry instead of its Rz.",
        patch: (a) => { a.wire("Knee", "Rz"); a.wire("Knee", "Ry", a.src("Free")); },
        title: "Hinges that turn the wrong way.", body: `Free goes into the Knee's Ry, the turn about the beam's own y, which points up: a hinge that lets the beam swing sideways, out of the frame's plane. In the plane the knees stay rigid, and the model flatters the frame just as much: 2.8${NB}mm instead of 6.8. In the frame's plane a beam turns about its z.`,
        react: (s) => { s.beam("sideways"); s.tag("Hinged about y: sideways", () => s.at(SPAN / 2, HEIGHT + 1.1, 0), "wrong"); } },
      { key: "one", says: "Free into the Knee's Rz, and the Knee into ReleaseI only.",
        patch: (a) => a.wire("Beam", "ReleaseJ"),
        title: "One knee hinged, one rigid.", body: `The Knee goes into ReleaseI only, the beam's end at Top A. ReleaseJ is empty, and an empty release holds everything, so the knee at Top B stays rigid. The model would sway 4.6${NB}mm instead of 6.8.`,
        react: (s) => { s.beam("one"); s.tag("Top B: still rigid", () => s.at(SPAN, HEIGHT + 1.1, 0), "wrong"); } },
    ],
  },
  {
    name: "Footings", title: "The footings",
    task: "Each post is set in a concrete footing, which holds it every way. Put a Support at each post's foot.",
    tip: "A Support holds every direction left empty: True. Free, from the beam, is still False, and each wire from it frees that way.",
    options: [
      { key: "right", says: "Footing A at Base A and Footing B at Base B, nothing wired into their Tx to Rz.",
        title: "Set in concrete.", body: "Nothing goes into either Support's Tx to Rz, so each holds every direction: the posts are clamped at their feet. With the knees hinged, that is what holds the frame upright: each post a cantilever from its footing.",
        react: (s) => { s.footings("fixed"); s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.hop()); } },
      { key: "pinned", says: "Free wired into both footings' Ry as well.",
        patch: (a) => { a.wire("Footing A", "Ry", a.src("Free")); a.wire("Footing B", "Ry", a.src("Free")); },
        title: "Four hinges: it folds.", body: `Free goes into both footings' Ry, so the posts can turn at their feet as well as at the knees. Four hinges, and nothing holds the frame square: it folds over. OpenSees still solves it, because Alpaca4d leaves a released joint a millionth of its stiffness, and sways it 1.5${NB}km. A frame needs rigid joints somewhere: at its knees, or at its feet.`,
        react: (s) => { s.footings("pinned"); s.fold(); s.play(s.wait(0.3), s.wobble(1.2), s.lookUp()); s.tag("1.5 km: the frame folds", () => s.at(SPAN / 2, 1.2, -1.2), "wrong"); } },
      { key: "roller", says: "Free wired into Footing B's Tx.",
        patch: (a) => a.wire("Footing B", "Tx", a.src("Free")),
        title: "Post B slides on its footing.", body: `Free goes into Footing B's Tx, so Post B's foot can slide along X, as the River's roller could. The frame stands, but Post B pushes back on nothing: Post A carries all the wind alone, and the frame sways 13.6${NB}mm, twice as far.`,
        react: (s) => { s.footings("roller"); s.wind("gusts"); s.sway(SWAY.roller); s.tag("13.6 mm: Post A alone", () => s.at(0, HEIGHT + 1.1, 0), "wrong"); } },
    ],
  },
  {
    name: "Wind", title: "The wind",
    task: `The wind on this bay of the barn's wall gathers at the top of Post A: 3${NB}kN, blowing along X. Put it there as a Point Load, in a Load Pattern.`,
    tip: "Vector XYZ makes a vector from its X, Y and Z: a number wired into one of them points that way. A Point Load acts on the point wired into its Point.",
    options: [
      { key: "right", says: "Wind 3 into Push's X, Push into the Gust's Force, and Top A into its Point.",
        title: "The barn sways.", body: `Push turns 3 into a vector 3${NB}kN long along X, and the Gust puts it at Top A. Each post bends as a cantilever under half of it: the beam passes the other half across to Post B.`,
        react: (s) => { s.wind("x"); s.sway(SWAY.right); s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.hop()); } },
      { key: "across", says: "Wind 3 into Push's Y instead of its X.",
        patch: (a) => { a.wire("Push", "X"); a.wire("Push", "Y", a.src("Wind")); },
        title: "The wind blows across the frame.", body: `Wind goes into Push's Y: 3${NB}kN across the barn, out of the frame's plane, where one frame is at its weakest. Post A bends sideways 23${NB}mm and Post B 7.6. A barn's wall and roof bracing take the wind that way; this frame alone can't.`,
        react: (s) => { s.wind("y"); s.sway(SWAY.across); s.play(s.wait(0.4), s.wobble(1.2)); s.tag("23 mm across the barn", () => s.at(0, HEIGHT + 1.1, 4.4), "wrong"); } },
      { key: "up", says: "Wind 3 into Push's Z instead of its X.",
        patch: (a) => { a.wire("Push", "X"); a.wire("Push", "Z", a.src("Wind")); },
        title: "That lifts the eaves.", body: `Wind goes into Push's Z: 3${NB}kN straight up at Top A. The frame doesn't sway: it stretches Post A by two hundredths of a millimetre. Wind can lift a roof, but this wind blows along X.`,
        react: (s) => { s.wind("z"); s.tag("Straight up: no sway", () => s.at(0, HEIGHT + 2.4, -0.6), "wrong"); } },
      { key: "base", says: "Base A, not Top A, wired into the Gust's Point.",
        patch: (a) => a.wire("Gust", "Point", a.src("Base A", "Pt")),
        title: "The footing takes it.", body: "The Gust sits at Base A, on the footing: the support holds it, and nothing sways. Put a load where it reaches the structure: the wind on the wall reaches this frame at the top of its post.",
        react: (s) => { s.wind("base"); s.tag("On the footing: nothing moves", () => s.at(0, 1.1, -1.4), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Everything is built: now wire it into Assemble Model. It needs both members, both footings and the wind's load pattern: two wires each into Elements and Supports.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The five it needs, one under the other, and two that people wire in by mistake.
      offered: ["Posts", "Beam", "Knee", "Footing A", "Footing B", "Gust", "Wind load"],
      wants: { Elements: ["Posts", "Beam"], Supports: ["Footing A", "Footing B"], LoadPatterns: ["Wind load"] },
      takes: {
        Elements: "the elements, from ForceBeamColumn", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the frame has none", Recorders: "recorders: leave it empty and Run Analysis picks one",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Posts: "the posts' two elements", Beam: "the beam's element", "Footing A": "a support", "Footing B": "a support", "Wind load": "the load pattern",
        Knee: "a hinge release, which goes into the beam's ReleaseI and ReleaseJ", Gust: "the wind's point load, which goes through the Load Pattern",
      },
      checks: [
        [(has) => has("Elements", "Posts") && has("Elements", "Beam"), "Elements: the posts and the beam"],
        [(has) => has("Supports", "Footing A") && has("Supports", "Footing B"), "Supports: both footings"],
        [(has) => has("LoadPatterns", "Wind load"), "LoadPatterns: the wind"],
      ],
      first: "Start with the posts: drag a wire from Posts' output, the circle on its right, to Assemble Model's Elements, then add the Beam's with Shift.",
      done: { title: "That's the frame.", body: `Assemble Model joins the posts and the beam at the knees, where their lines share their ends, and puts each footing and the gust on its node, within its Tolerance of 1${NB}cm. What comes out of AlpacaModel is the frame, ready to solve.` },
    },
  },
  {
    name: "Run", title: "Run", guess: { question: "How far will the tops of the posts sway?", unit: "mm", step: "0.1", min: 0 },
    task: "Solve it, and see how far the frame sways in the wind. First, make a guess.",
    tip: "Run Analysis needs Analysis Settings; Model View draws whatever it is given.",
    options: [
      { key: "right", says: "Assemble Model into Run Analysis, with Analysis Settings, and Run Analysis into Model View.",
        title: `${HAND.toFixed(1)}${NB}mm.`,
        react: (s) => { s.play(s.wait(0.4), s.walkTo(s.INSIDE), s.hop()); s.tag(`${HAND.toFixed(1)} mm · drawn 100 times bigger`, () => s.at(SPAN / 2, -0.4, -2.2), "right", true); } },
      { key: "unsolved", says: "Assemble Model straight into Model View; Run Analysis's output goes nowhere.",
        patch: (a) => a.wire("The barn", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")),
        title: "Nothing has been solved.", body: "Model View is fed straight from Assemble Model, so it draws the frame as it was built and says: “Deformed shape needs an analysed model, from Run Analysis or another analysis.” Feed it the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.sway(null); s.tag("Deformed shape needs an analysed model", () => s.at(SPAN / 2, HEIGHT + 1.1, 0), "wrong"); } },
      { key: "nosettings", says: "Assemble Model into Run Analysis with nothing in Settings, and Run Analysis into Model View.",
        patch: (a) => a.wire("Run Analysis", "Settings"),
        title: "Run Analysis waits for its settings.", body: "Settings is empty, so Run Analysis stops at “Input parameter Settings failed to collect data” and gives nothing to Model View, which draws nothing. Analysis Settings, left as it is, is a plain static analysis: wire it in.",
        react: (s) => { s.lines(null); s.posts(null); s.beam(null); s.footings(null); s.wind(null); s.tag("Input parameter Settings failed to collect data", () => s.at(SPAN / 2, HEIGHT / 2, 0), "wrong"); } },
    ],
  },
];

// A cantilever's shape: how far along its tip's sway a point at s (0 at the foot, 1 at the top) is.
const cantilever = (s) => (3 * s * s - s * s * s) / 2;

// ---- The scene: the frame on its footings, in the barn, as each round builds it ----
function scene(kit) {
  const { g, solid, add, clear, rod, arrow, groundAt, tag, reduceMotion } = kit;
  const k = 1.8;                             // the toy world's metres per real metre
  const FLOOR = 0.3;                         // the barn floor's top, in the area's frame
  const Y0 = FLOOR + 0.3;                    // the footings' top, where the posts stand
  const XA = (SPAN * k) / 2;                 // Post A's foot, in the area's frame
  const HOME = XA + 4, INSIDE = 0;           // where the alpaca waits, upwind, and its place in the barn
  const DRAWN = EXAGGERATE / 1000;           // m drawn per mm of sway: 100 times bigger
  const FRONT = -1;                          // the side of the frame the camera sees: Grasshopper's -Y
  // A point of Grasshopper's model (m) in the area's frame. The island turns the barn so that its
  // x points left on the screen: the frame is drawn turned round, its X along -x and its Y along z,
  // so that the wind blows from left to right. Z is up.
  const P = (x, y, z) => V(XA - x * k, Y0 + z * k, y * k);
  kit.home = HOME;
  kit.view = { at: V(2.2, 4.6, 0), w: 23, h: 14 };
  kit.hideStructure();

  const parts = { lines: new THREE.Group(), members: new THREE.Group(), hinges: new THREE.Group(), footings: new THREE.Group(), wind: new THREE.Group(), streaks: new THREE.Group(), gizmo: new THREE.Group(), blocks: new THREE.Group() };
  Object.values(parts).forEach((p) => g.add(p));
  const red = solid(RED, { roughness: 0.5 });
  const timber = solid(TIMBER, { roughness: 0.8, transparent: true });
  const beamTimber = solid(TIMBER, { roughness: 0.8, transparent: true });
  const ink = solid(INK), orange = solid(ORANGE);

  // The concrete footings, always there, as the River's blocks are.
  for (const x of [XA, -XA]) {
    const b = add(parts.blocks, new THREE.Mesh(new THREE.BoxGeometry(1.5, Y0 - FLOOR + 0.02, 1.5), solid(CONCRETE)));
    b.position.set(x, (FLOOR + Y0) / 2, 0);
    b.receiveShadow = true;
  }

  // ---- What the scene shows ----
  const state = { lines: null, posts: null, beam: null, footings: null, wind: null, sway: null, fold: null, t: 0 };

  // Round 1's lines, red as Grasshopper previews curves: right, the beam down to Base B, or Top B flat.
  function lines(kind) {
    state.lines = kind;
    clear(parts.lines);
    if (!kind) return;
    const baseA = P(0, 0, 0), topA = P(0, 0, HEIGHT), baseB = P(SPAN, 0, 0);
    const topB = kind === "flat" ? P(SPAN, HEIGHT, 0) : P(SPAN, 0, HEIGHT);
    const make = (name, a, b) => { const r = rod(parts.lines, a, b, 0.07, red); r.name = name; };
    make("a", baseA, topA);
    make("beam", topA, kind === "diagonal" ? baseB : topB);
    make("b", baseB, topB);
    for (const p of [baseA, topA, topB, baseB]) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 6), red); s.position.copy(p); parts.lines.add(s); }
  }
  // Rhino's axes at Base A, with their names.
  function gizmo(on) {
    clear(parts.gizmo);
    if (!on) return;
    const o = P(0, 0, 0).add(V(0, 0.05, 0)), len = 2.4;
    for (const [name, d, c] of [["X", V(-1, 0, 0), "#e23b3b"], ["Y", V(0, 0, 1), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
      arrow(parts.gizmo, o, o.clone().addScaledVector(d, len), 0.06, solid(c));
      tag(name, () => o.clone().addScaledVector(d, len + 0.5), "axis", false, "scene");
    }
  }

  // A member drawn as a string of short boxes along its shape, so that it can bend: in-plane depth
  // along the box's y, the width across the barn along its z.
  const SEGMENTS = 12;
  function member(mat) {
    const grp = new THREE.Group();
    const segs = [];
    for (let i = 0; i < SEGMENTS; i++) segs.push(add(grp, new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat)));
    parts.members.add(grp);
    return { grp, segs, depth: D * k, width: B * k };
  }
  const xAxis = V(1, 0, 0), dir = V(0, 0, 0);
  function place(m, pts) {
    for (let i = 0; i < SEGMENTS; i++) {
      const a = pts[i], b = pts[i + 1], s = m.segs[i];
      dir.copy(b).sub(a);
      const len = dir.length();
      s.position.copy(a).addScaledVector(dir, 0.5);
      s.quaternion.setFromUnitVectors(xAxis, dir.normalize());
      // A little longer than the step, so that the boxes overlap where the member bends.
      s.scale.set(len + m.depth * 0.12, m.depth, m.width);
    }
  }
  let postA = null, postB = null, beam = null;
  function posts(spec, label) {
    state.posts = spec;
    for (const m of [postA, postB]) if (m) parts.members.remove(m.grp);
    postA = postB = null;
    if (!spec) return;
    const weak = !!spec.weak;
    const make = () => { const m = member(timber); if (weak) { m.depth = B * k; m.width = D * k; } return m; };
    if (spec.only !== "b") postA = make();
    postB = make();
    if (label) tag(label, () => P(0, 0, HEIGHT).add(V(-0.4, 1.0, 0)));
  }
  // The beam, and its knees: hinged at both ends, at one, about its y (sideways), or rigid.
  function beamOf(knees) {
    state.beam = knees;
    if (beam) parts.members.remove(beam.grp);
    beam = null;
    clear(parts.hinges);
    if (!knees) return;
    beam = member(beamTimber);
    const ends = knees === "both" || knees === "sideways" ? [0, 1] : knees === "one" ? [0] : [];
    for (const end of ends) {
      const h = new THREE.Group();
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.26, 18), solid("#ffffff", { side: THREE.DoubleSide }));
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.065, 6, 20), ink);
      h.add(face, ring);
      if (knees === "sideways") { h.rotation.x = -Math.PI / 2; h.userData.up = true; }
      h.userData.end = end;
      parts.hinges.add(h);
    }
  }
  // The footings' symbols: a dark collar for one set in concrete, a pin's pyramid in front of the
  // foot, or one on rollers.
  function footings(kind) {
    state.footings = kind;
    clear(parts.footings);
    if (!kind) return;
    for (const which of ["a", "b"]) {
      const h = new THREE.Group();
      h.userData.which = which;
      if (kind === "fixed" || (kind === "roller" && which === "a")) {
        const c = add(h, new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.7, 0.85), ink));
        c.position.set(0, 0.35, 0);
      } else {
        const roller = kind === "roller";
        const lift = roller ? 0.26 : 0;
        const p = add(h, new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.62, 4), orange));
        p.position.set(0, lift + 0.31, FRONT * 0.95);
        if (roller) for (const dx of [-0.24, 0.24]) {
          const c = add(h, new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 10).rotateX(Math.PI / 2), ink));
          c.position.set(dx, 0.12, FRONT * 0.95);
        }
      }
      parts.footings.add(h);
    }
  }
  // The wind: the model's load, an arrow at Top A along X, across (Y), up (Z) or at the foot; and
  // streaks blowing past for any of them, or for a gust on its own.
  function wind(kind) {
    state.wind = kind;
    clear(parts.wind);
    if (kind && kind !== "gusts") {
      const holder = new THREE.Group();
      holder.userData.at = kind === "base" ? "base" : "top";
      const len = 2.4, r = 0.08;
      const [from, to] = kind === "y" ? [V(0, 0, -len - 0.4), V(0, 0, -0.4)] : kind === "z" ? [V(0, 0.45, 0), V(0, len + 0.45, 0)] : [V(len + 0.4, 0, 0), V(0.4, 0, 0)];
      arrow(holder, from, to, r, orange);
      parts.wind.add(holder);
    }
    parts.streaks.visible = !!kind;
  }
  // Streaks of wind, blowing along X past the frame.
  const streakMat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.7 });
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.06, 0.06), streakMat);
    s.userData = { y: 1 + ((i * 3.7) % 9), z: -3 + ((i * 2.3) % 6), speed: 7 + (i % 3) * 2, phase: i * 2.9 };
    parts.streaks.add(s);
  }
  parts.streaks.visible = false;

  // How the frame moves: a sway, drawn growing in and then breathing with the gusts, or folding over.
  function sway(spec) { state.sway = spec; state.fold = null; state.t = 0; }
  function fold() { state.fold = { t: 0 }; state.sway = null; }

  // ---- The frame's shape now ----
  const pts = Array.from({ length: SEGMENTS + 1 }, () => V(0, 0, 0));
  const top = { a: V(0, 0, 0), b: V(0, 0, 0) }, foot = { a: V(0, 0, 0), b: V(0, 0, 0) }, along = V(0, 0, 0);
  function shape(dt) {
    state.t += dt;
    const grow = reduceMotion ? 1 : smooth(Math.min(1, state.t / 0.9));
    const breathe = reduceMotion ? 1 : 1 + 0.08 * Math.sin(kit.time() * 2.3) * Math.min(1, state.t);
    const f = grow * breathe;
    const sw = state.sway || {};
    let phi = 0;
    if (state.fold) {
      state.fold.t += dt;
      const t = reduceMotion ? 1 : Math.min(1, state.fold.t / 1.6);
      phi = 1.38 * t * t;
    }
    for (const [which, x0] of [["a", 0], ["b", SPAN]]) {
      // In Grasshopper's metres, drawn 100 times bigger: along X at the top and the foot, and along Y.
      const tipX = (sw[which] || 0) * DRAWN * f, baseX = (sw[which + "Base"] || 0) * DRAWN * f, tipY = (sw["y" + which] || 0) * DRAWN * f;
      foot[which].copy(P(x0 + baseX, 0, 0));
      const m = which === "a" ? postA : postB;
      for (let i = 0; i <= SEGMENTS; i++) {
        const s = i / SEGMENTS, c = cantilever(s);
        if (phi) pts[i].copy(P(x0 + s * HEIGHT * Math.sin(phi), 0, s * HEIGHT * Math.cos(phi)));
        else pts[i].copy(P(x0 + baseX + (tipX - baseX) * c, tipY * c, s * HEIGHT));
      }
      top[which].copy(pts[SEGMENTS]);
      if (m) place(m, pts);
    }
    if (beam) {
      for (let i = 0; i <= SEGMENTS; i++) pts[i].lerpVectors(top.a, top.b, i / SEGMENTS);
      // The beam sits on the posts' tops: its axis half its depth below them.
      for (const p of pts) p.y -= (D * k) / 2;
      place(beam, pts);
    }
    along.copy(top.b).sub(top.a).normalize();
    for (const hn of parts.hinges.children) {
      const end = hn.userData.end ? top.b : top.a;
      hn.position.copy(end).addScaledVector(along, hn.userData.end ? -0.55 : 0.55);
      hn.position.y += hn.userData.up ? 0.02 : -(D * k) / 2;
      if (!hn.userData.up) hn.position.z += FRONT * ((B * k) / 2 + 0.02);
    }
    for (const fs of parts.footings.children) fs.position.copy(foot[fs.userData.which]);
    for (const w of parts.wind.children) w.position.copy(w.userData.at === "base" ? foot.a.clone().add(V(0, 0.5, 0)) : top.a);
  }
  function frame(dt) {
    shape(dt);
    // Each red line shows while its member isn't built.
    for (const l of parts.lines.children) {
      if (l.name === "a") l.visible = !postA;
      else if (l.name === "b") l.visible = !postB;
      else if (l.name === "beam") l.visible = !beam;
      else l.visible = !(postA && postB && beam);
    }
    if (parts.streaks.visible) {
      const t = kit.time();
      for (const s of parts.streaks.children) {
        const u = s.userData;
        s.position.set(15 - ((t * u.speed + u.phase * 3) % 24), u.y, u.z);
      }
    }
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    timber.opacity = !has || has("Elements", "Posts") ? 1 : 0.28;
    beamTimber.opacity = !has || has("Elements", "Beam") ? 1 : 0.28;
    parts.hinges.visible = !has || has("Elements", "Beam");
    parts.footings.children.forEach((f) => { f.visible = !has || has("Supports", f.userData.which === "a" ? "Footing A" : "Footing B"); });
    const blowing = !has || has("LoadPatterns", "Wind load");
    parts.wind.visible = blowing;
    parts.streaks.visible = blowing && !!state.wind;
    if (has && !blowing) state.t = 0;
    state.sway = has && !blowing ? null : state.sway || (state.wind === "x" ? SWAY.right : null);
  }
  // Where the alpaca's feet are: on the barn floor, or on the ground around it.
  function surface(x, z) {
    const ground = groundAt(x, z);
    return Math.abs(x) < 5.75 && Math.abs(z) < 3.7 ? Math.max(ground, FLOOR) : ground;
  }
  // The scene as the rounds before r left it.
  function setScene(r) {
    lines(r > 0 ? "right" : null);
    posts(r > 1 ? {} : null);
    beamOf(r > 2 ? "both" : null);
    footings(r > 3 ? "fixed" : null);
    wind(r > 4 ? "x" : null);
    sway(r > 4 ? SWAY.right : null);
    gizmo(r === 0);
    if (r === 0 || r === 3) for (const [name, x] of [["Base A", 0], ["Base B", SPAN]]) tag(name, () => P(x, 0, 0).add(V(x ? -0.9 : 0.9, -0.2, FRONT * 2.2)), "bank", false, "scene");
  }

  // The scene's hands, for the rounds' reactions.
  const api = {
    INSIDE, at: (x, y, z) => P(x, 0, y).add(V(0, 0, z)),
    lines, posts, beam: beamOf, footings, wind, sway, fold, tag,
    play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, wobble: kit.wobble, lookUp: kit.lookUp,
  };
  return { api, setScene, frame, surface, ghost, stop: () => { clear(parts.members); } };
}

export async function start(world, host, onExit) {
  const def = await ready;
  return runLesson(world, host, onExit, {
    id: "barn", chip: "Area 4 · Barn", def, gh: { url: GH_FILE, name: "Barn.gh" },
    rounds: ROUNDS, scene,
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - HAND) <= HAND * 0.2 ? `You guessed ${guess}${NB}mm: within a fifth of it. ` : `You guessed ${guess}${NB}mm. `;
      return [
        el("p", "", `${said}OpenSees sways the tops of the posts ${SWAY.right.a.toFixed(1)}${NB}mm in 3${NB}kN of wind, and Model View draws it a hundred times bigger.`),
        el("p", "pg-calc", `By hand: each post is a cantilever pushed by half the wind, so δ = (H/2)h³ / 3EI = Hh³ / 6EI = 3 × 4³ / (6 × 10${NB}500${NB}000 × 4.5·10⁻⁴) = ${HAND.toFixed(1)}${NB}mm, with I = bh³/12 = 0.2 × 0.3³ / 12 = 4.5·10⁻⁴${NB}m⁴.`),
      ];
    },
    done: { title: "The Barn is done.", body: "You built a frame of several elements and gave its joints what they really hold: hinges where the beam is bolted on, clamps where the posts are set in concrete. That decides how far it sways, or whether it stands at all. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
