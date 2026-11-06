// Area 9, the Wall with a window. In seven rounds the player builds the Grasshopper definition of a
// concrete wall standing on its foundation, with a window cut into it and a floor bearing on its
// top: the wall, its mesh, the shell, the supports, the floor, the wires into Assemble Model, and the
// analysis with its principal stress lines. Each round but one shows snippets to pick from, only
// one of them right, and the scene shows what each would build; a wrong one can be tried again.
//
// The definition is wall.gh, written by Alpaca4d's Tools/Examples/PlaygroundWall.py. The numbers
// are OpenSees's, for the wall as Alpaca4d writes it - ASDShellQ4 on a PlateFiber section of
// ElasticIsotropic concrete, kN and m, on quads 0.25 m across - and wall-stress.json holds what it
// gave: the larger principal stress at each node and the principal stress lines traced through it,
// for the wall as built, without its window, and pushed along its length. The panel, the rounds and
// the alpaca are lesson.js's.

import * as THREE from "three";
import { NB, V, mix, smooth, el, loadDefinition, runLesson } from "./lesson.js";

// The wall, in metres: 5.5 long, 4 tall, 0.2 thick, with a window 1.5 square whose sill is 1 up.
const L = 5.5, H = 4, T = 0.2, STEP = 0.25;
const WIN = { x0: 2, x1: 3.5, z0: 1, z1: 2.5 };
const POINTS = Array.from({ length: 12 }, (_, i) => i * 0.5);    // along the base and the top
const FLOOR = 600;                                                // kN: 50 on each of the 12
const FAR = FLOOR / (L * T) / 1000;                               // MPa, far from the window
const PIER = FLOOR / ((L - (WIN.x1 - WIN.x0)) * T) / 1000;        // MPa, beside it: 0.75
const EDGE = 1.0, CORNER = 1.5;                                   // MPa, OpenSees: at its edge, at its top corners
const SHEAR_CORNER = 4.5;                                         // MPa, pushed along: at its corners
const COARSE = { xs: [0, 1, 2, 3.5, 4.5, 5.5], zs: [0, 1, 2.5, 4] };   // quads about 1.5 m, roughly
const CONCRETE = "#cfc9be", ORANGE = "#eb6c3f", INK = "#2a2d31", RED = "#d23c3c", PURPLE = "#9e35da", BLUE = "#4288f7";

// Grasshopper's own components some wrong snippets swap in, with their icons: the definition has no
// Unit Y or Mesh Plane of its own to copy them from.
const UNIT_X = "79f9fbb3-8f1d-4d9a-88a9-f7961b1012cd", UNIT_Y = "d3d195ea-2d59-4ffa-90b1-8b7ff3369f69";
const MESH_PLANE = "8adbf481-7589-4a40-b490-006531ea001d", TOGGLE = "2e78987b-9dfb-42a2-8b76-3923ac8bd91a";
const ICONS = {
  [UNIT_Y]: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAfBJREFUSInd1T+LE1EUBfDfbGJMdN31Hygq/ivUUthKUbTWQm3EykYWtLD3K/glxEYbGxcbUbAQVhtBELfwAyioheiKEpNsLN6dZHYyYbNsIx54kLmTuefce+57j/8ZWawNoTYmfhZH8RErGyUpI8MiXmMWm62upIZNqJfiWcTGiR7gPPqxLmNnJIR7EW9jHo1IfAHLuB+CxpJkeFUgeIMD2BrqmniB7zgc5E1sx/uoeFuRZKpEcA6nCs9zOBNJMsmPu5jBxUgkKngU+fK29arULxbUF6vYg1YkmI7YEvaH4uc4jh1RbVk4UVILuwrJT+NYxFqGBl+P91dwEs+CaFbyZYB64XcPf0p/WEYH3XjXizYtSCN8C+/wIFR3TTDWzUIFJ7A3YkU0cCcIP+BIVJl7NUBVr8rmdCpiXWkkf+FlVJd/21+LYBKs4Js0FA+DsErIKg/Wi4Zk/FIkbqvo/yQE5SqnYt2QZr9jjPpxuGRo8k3sM5yseWl6nuAtdkuj2awQUokMn/oBfMFBbJH2wDX8lIydKxA0qtONtqhm9ITMpM3VxWM8je+mpJ53DKdoTdRxFZ/xFbdxKFTmx3NTOoumje6PEZRvrEyajBnDg6yNH/gt+ZJFpX0TGFt1JeYk+R3QKSRfN8bdublKKnbnP4W/kkN0LnNrPT0AAAAASUVORK5CYII=",
  [MESH_PLANE]: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAiBJREFUSIntlcluE0EQhr+xbA4hIewCJSgCIXEB7NgBJF6CE0+HlEfgJZAIBA5wYEliFIQQS1hEIIpmPN1VOVT32B4mXhDcqIurq9v1d/39Vw38tzGWHBKvj9gbZwq4QwFuJ/ysKXN/kllg7yEsAPsRpF46U68pcw9WG0gOa8+VW1dAcnj0Qrl5KUEcrL9WOkugDp50lfZiguZw556fBeZDrn3A1UoACYD0QHNQp0ivv5bcfHHaXzuKM8FmgEbMVa4AgLVninrl1VtFUlCBjXeKZIp62PygSAbqYetzPx6sMURJFcCNy6AuQVJYuZigDnyqdC4EP4P2efMlVZbPGHX2vsPvWgkgPeM3lq9ObZ1H6vpx8f3zVVYJ8PilJdx4L0iWGC0fB2jZCbQ46H61KgYoGg+wspQgueKzhM6ilS8ZtM9ZXFJonTblSKY0TySo08kBpGe3i1SIiwpS8x1oiKsHDfGJAdY3g1o+RVqUrR0KirrfKJTz5gf4lOkoai/E8mH5rCnKZ0rrVFBOpjSPU5y5fpTpKhhqtNzACI1VKCo2X6GuKd7g6bYYFV9M/+qh+x18pGXXekE9bP+iUNTEALFxJFVaJ4PfU5rHKBR1bYai0a4eAS0PnbEUOayJci3NIduLyolqG7Ahrn4DENi7e19mq+8z2tQmaD4YK38P6tg0nKc0FSfLT46B7IZfV/XnCNKo2JvEIohjxO3+2ifzn9sBpTSjAOmpidcAAAAASUVORK5CYII=",
};

const ready = Promise.all([
  loadDefinition(new URL("./wall-definition.json", import.meta.url)),
  fetch(new URL("./wall-stress.json", import.meta.url)).then((r) => r.json()),
]);
const GH_FILE = new URL("./wall.gh", import.meta.url).href;

// A toggle made here, as the definition draws its own.
const toggle = (id, nick, value, x, y) => ({ kind: "toggle", id, type: TOGGLE, name: "Boolean Toggle", nick, desc: "Boolean (true/false) toggle", box: [x, y, 77, 22], src: [], value });
// One of the definition's components as another of Grasshopper's: the same ports, another kind.
function swapped(a, id, like, nick, type, name, desc, inputs) {
  const o = a.get(like), c = a.newComponent(id, like, nick, o.box[0], o.box[1], inputs);
  Object.assign(c, { type, name, desc });
  a.remove(like);
  a.add(c);
  return c;
}

// ---- The rounds ----
const ROUNDS = [
  {
    name: "Wall", title: "The wall",
    task: `Draw the wall: 5.5${NB}m long and 4${NB}m tall, standing up along X, with a window 1.5${NB}m square cut into it, its sill 1${NB}m up. Rectangle 3Pt draws a rectangle through a corner, the next corner along, and a point on the far side.`,
    tip: "Follow Height's wire: which input of the Up corner does it set? And which curves reach Boundary Surfaces?",
    options: [
      { key: "right", says: "Height wired into the Up corner's Z, and both the outline and the window into Boundary Surfaces.",
        title: "A wall with a window.", body: `The outline runs 5.5${NB}m along X and 4${NB}m up Z, and the window lies inside it, in the same plane: Boundary Surfaces makes one surface of the two, with the window cut out of it.`,
        react: (s) => { s.wall("window"); s.play(s.wait(0.4), s.toWindow(), s.peek()); } },
      { key: "flat", says: "Height wired into the Up corner's Y, and both the outline and the window into Boundary Surfaces.",
        patch: (a) => { a.wire("Up", "Z"); a.wire("Up", "Y", a.src("Height")); },
        title: "That wall lies on the ground.", body: `Height goes into Y, so the outline's far side is 4${NB}m along Y: it lies flat, like a floor. The window, still standing up, is not in the floor's plane, so Boundary Surfaces cannot cut it out of it.`,
        react: (s) => { s.wall("flat"); s.play(s.wait(0.4), s.walkTo(s.ONTO, 3), s.hop()); s.tag("Height along Y: it lies flat", () => s.at(0, 2.2, 0), "wrong"); } },
      { key: "nowindow", says: "Height wired into the Up corner's Z, and only the outline into Boundary Surfaces.",
        patch: (a) => a.wire("Wall surface", "E", a.src("Wall outline", "R")),
        title: "No window.", body: "Only the outline reaches Boundary Surfaces, so it fills the whole rectangle: the window is drawn, but nothing cuts it out. Every closed curve to be a hole has to go into Boundary Surfaces with the outline.",
        react: (s) => { s.wall("solid"); s.play(s.wait(0.4), s.toWindow(), s.bump()); s.tag("The window is drawn, but not cut out", () => s.at(0, s.MID + 1, 0), "wrong"); } },
    ],
  },
  {
    name: "Mesh", title: "The mesh",
    task: `A shell is made of quads: mesh the wall. Its base will stand on supports and its top will carry a floor, at points 0.5${NB}m apart, and each of them needs a node.`,
    tip: "Mesh Brep makes quads about Edge Length across, and pulls a node onto each of its Points. Divide Curve cuts the base and the top into Divisions parts.",
    options: [
      { key: "right", says: "Edge length 0.25 into Mesh Brep, with the wall, and the base and top points into Points.",
        title: "Quads 0.25 metres across.", body: `Mesh Brep keeps the wall's edges, the window's too, and meshes the rest in quads about 0.25${NB}m across: two to every 0.5${NB}m, so each point along the base and the top pulls a node of its own onto itself.`,
        react: (s) => { s.wall("window"); s.mesh("fine"); s.points(); s.play(s.wait(0.4), s.toWindow(), s.peek()); } },
      { key: "coarse", says: "Edge length 1.5 into Mesh Brep, with the wall, and the base and top points into Points.",
        patch: (a) => a.slider("Edge length", 1.5),
        title: "Too few nodes for the points.", body: `Quads 1.5${NB}m across leave only a few nodes along the base and the top, and the 12 points on each, 0.5${NB}m apart, cannot each have one: Mesh Brep warns “Point … found no node left to move onto it: the ones near it are already taken.” Assemble Model will stop at the first support with no node, and quads this big could not show the forces bending round a window 1.5${NB}m across anyway.`,
        react: (s) => { s.wall("window"); s.mesh("coarse"); s.points(true); s.tag("Points with no node", () => s.at(0, s.TOP + 1.6, 0), "wrong"); } },
      { key: "plane", says: "Mesh Plane, 22 by 16 quads, in place of Mesh Brep, on the wall's outline.",
        patch: (a) => {
          const o = a.get("Mesh Brep"), e = a.get("Edge length");
          a.remove("Mesh Brep");
          a.remove("Edge length");
          a.add(a.newSlider("across", "Across", 22, 1, 40, 0, e.box[0], e.box[1]));
          a.add(a.newSlider("up", "Up", 16, 1, 40, 0, e.box[0], e.box[1] + 34));
          a.add({ kind: "component", id: "plane", type: MESH_PLANE, name: "Mesh Plane", nick: "Mesh Plane", desc: "Create a mesh plane.", box: [o.box[0], o.box[1], 131, 64],
            inputs: [{ id: "plane.in0", name: "Boundary", nick: "Boundary", src: [a.src("Wall outline", "R")] }, { id: "plane.in1", name: "Width count", nick: "Width count", src: ["across"] }, { id: "plane.in2", name: "Height count", nick: "Height count", src: ["up"] }],
            outputs: [{ id: "plane.out0", name: "Mesh", nick: "Mesh", src: [] }, { id: "plane.out1", name: "Area", nick: "Area", src: [] }] });
        },
        title: "The window is filled in.", body: "Mesh Plane meshes the whole rectangle it is given, the wall's outline: it knows nothing of the surface with its window cut out, so the quads run straight across the window. The model would be a wall without one.",
        react: (s) => { s.wall("solid"); s.mesh("plane"); s.play(s.wait(0.4), s.toWindow(), s.bump()); s.tag("Quads across the window", () => s.at(0, s.MID + 1, 0), "wrong"); } },
    ],
  },
  {
    name: "Shell", title: "The shell",
    task: `Make the mesh a concrete wall 200${NB}mm thick: a Plate Fiber Section of the concrete, and an ASD Shell on each quad. Its Local X sets the axes its stresses are read in: along the wall, σ22 is the vertical stress.`,
    tip: "Local X has to run along the shell: ASD Shell flattens it onto each quad.",
    options: [
      { key: "right", says: "Thickness 0.20 into the Plate Fiber Section, and Unit X, along the wall, into Local X.",
        title: "A concrete wall.", body: `Each quad is an ASD Shell of 200${NB}mm of concrete, E${NB}=${NB}33${NB}000${NB}MPa. Unit X runs along the wall, so σ11 is the stress along it and σ22 the stress up it.`,
        react: (s) => { s.wall("window"); s.mesh("fine"); s.points(); s.play(s.wait(0.4), s.toWindow(), s.peek()); } },
      { key: "normal", says: "Thickness 0.20 into the Plate Fiber Section, and Unit Y, square to the wall, into Local X.",
        patch: (a) => { const c = swapped(a, "across", "Along the wall", "Across the wall", UNIT_Y, "Unit Y", "Unit vector parallel to the world {y} axis.", {}); a.wire("Wall", "LocalX", c.outputs[0].id); },
        title: "Local X stands square to the wall.", body: "The wall stands in the XZ plane, so Y is its normal: there is nothing left of it to flatten onto a quad. ASD Shell turns red: “The Local X Axis (0, 1, 0) lies within 1° of the normal of … faces … so it cannot be flattened into them to give an axis.” Give a Local X that runs along the shell.",
        react: (s) => { s.wall("ghost"); s.mesh("fine"); s.tag("Local X square to the wall", () => s.at(0, s.TOP + 1.6, 0), "wrong"); } },
      { key: "thick", says: "Thickness 200 into the Plate Fiber Section, and Unit X into Local X.",
        patch: (a) => a.slider("Thickness", 200, { max: 1000, digits: 0 }),
        title: "A wall 200 metres thick.", body: `Alpaca4d works in metres, so 200 is 200${NB}m, not 200${NB}mm: a block of concrete as thick as a city block, and a thousand times less stressed than the real wall. Type 0.2.`,
        react: (s) => { s.wall("giant"); s.zoom(0.45); s.play(s.wait(0.8), s.lookUp()); s.tag("200 m thick: drawn far thinner", () => s.at(0, s.TOP + 2, 0), "wrong"); } },
    ],
  },
  {
    name: "Supports", title: "The supports",
    task: "Stand the wall on its foundation: a Support at each point along its base. On a foundation it cannot move or turn any way.",
    tip: "A Support holds every direction left empty: True. Tx, Ty and Tz move along X, Y and Z; Rx, Ry and Rz turn about them.",
    options: [
      { key: "right", says: "The base points into the Support's Position, and nothing else wired: held every way.",
        title: "On its foundation.", body: `A Support at each of the 12 points along the base, every input left empty, so held every way: the wall stands on its foundation as if cast onto it.`,
        react: (s) => { s.supports("base"); s.play(s.wait(0.4), s.toWindow(), s.peek()); } },
      { key: "hanging", says: "The top points into the Support's Position.",
        patch: (a) => a.wire("Foundation", "Position", a.src("Top points", "P")),
        title: "The wall hangs from its top.", body: "The top points go into Position, so the wall is held along its top and free at its foot, like a curtain. And the floor will sit on those same points: its load goes straight into the supports, and the wall carries nothing at all.",
        react: (s) => { s.supports("top"); s.tag("Hanging from its top", () => s.at(0, s.TOP + 1.6, 0), "wrong"); } },
      { key: "slip", says: "The base points into Position, and Free, False, into Tz.",
        patch: (a) => { const f = a.get("Foundation"); a.add(toggle("free", "Free", false, f.box[0] - 130, f.box[1] + 64)); a.wire("Foundation", "Tz", "free"); },
        title: "Nothing holds it up.", body: "Free goes into Tz, so no support holds the wall up: it can sink straight down, and Run Analysis stops with “Analysis Failed: OpenSees 'analyze' did not converge”. A wall standing on the ground needs the ground to hold it up, along Z.",
        react: (s) => { s.supports("rollers"); s.sink(); s.tag("Free along Z: it sinks", () => s.at(0, 1.2, 0), "wrong"); } },
    ],
  },
  {
    name: "Floor", title: "The floor",
    task: `A floor bears on the wall's top: 50${NB}kN on each of the 12 points along it, 600${NB}kN in all. Put it there as a Point Load, in a Load Pattern.`,
    tip: "Unit Z makes a vector along Z as long as its F. Point Load puts it on each point it is given.",
    options: [
      { key: "right", says: "Floor minus 50 into Unit Z, Unit Z into Force, and the top points into Point.",
        title: "The floor bears on the wall.", body: `Unit Z turns −50 into 50${NB}kN pointing down, and Point Load puts it on each of the 12 points along the top, where Mesh Brep put nodes: 600${NB}kN, about what four floors of flats put on a wall this long.`,
        react: (s) => { s.loads("down"); s.play(s.wait(0.4), s.toWindow(), s.peek()); } },
      { key: "sideways", says: "Floor minus 50 into Unit X, Unit X into Force, and the top points into Point.",
        patch: (a) => { const c = swapped(a, "along", "Down", "Along", UNIT_X, "Unit X", "Unit vector parallel to the world {x} axis.", { F: [a.src("Floor")] }); a.wire("The floor", "Force", c.outputs[0].id); },
        title: "That pushes the wall along its length.", body: `Unit X points along the wall, so the floor pushes its top sideways, as wind or an earthquake would, and nothing weighs down on it. The wall stands up to it, a shear wall, but the forces now cross it on the diagonals and gather at the window's corners, ${SHEAR_CORNER}${NB}MPa there: where earthquakes crack walls.`,
        react: (s) => { s.loads("along"); s.shear(); s.tag("Along X: pushed sideways", () => s.at(0, s.TOP + 2.4, 0), "wrong"); } },
      { key: "onbase", says: "Floor minus 50 into Unit Z, Unit Z into Force, and the base points into Point.",
        patch: (a) => a.wire("The floor", "Point", a.src("Base points", "P")),
        title: "That load never reaches the wall.", body: "The base points go into Point, so the floor's 600 kN lands on the nodes the supports hold: it goes straight into the foundation, and the wall above feels nothing. A load has to be where it acts, along the top.",
        react: (s) => { s.loads("base"); s.tag("Straight into the supports", () => s.at(0, 1.6, 0), "wrong"); } },
      { key: "newtons", says: "Floor minus 50 000 into Unit Z, Unit Z into Force, and the top points into Point.",
        patch: (a) => a.slider("Floor", -50000, { min: -100000, max: 0, digits: 0 }),
        title: "50 000 kN crushes the wall.", body: `Alpaca4d works in kN, so 50${NB}000 is 50${NB}000${NB}kN on each point, five thousand tonnes: 750${NB}MPa beside the window, where concrete crushes at about 30. Alpaca4d itself would not tell you: its analysis is elastic. 50${NB}000${NB}N is 50${NB}kN.`,
        react: (s) => { s.loads("huge"); s.crush(); s.tag("50 000 kN on each point", () => s.at(0, s.TOP + 5.4, 0), "wrong"); } },
    ],
  },
  {
    name: "Assemble", title: "Assemble",
    task: "Everything is built: now wire it into Assemble Model. It needs the wall's shells, the supports and the load pattern.",
    tip: "As in Grasshopper: drag a wire from an output, the circle on the right, to the input of Assemble Model it goes into. A new wire into an input replaces the one there: hold Shift as you let go to add another, Ctrl to take one away. On a touch screen, tick Shift below.",
    wiring: {
      target: "Assemble Model",
      // The three it needs, and two that people wire in by mistake.
      offered: ["Mesh Brep", "Wall", "Foundation", "The floor", "Load Pattern"],
      wants: { Elements: ["Wall"], Supports: ["Foundation"], LoadPatterns: ["Load Pattern"] },
      takes: {
        Elements: "the elements, from ASD Shell", Supports: "the supports", LoadPatterns: "the load patterns",
        Constraints: "rigid links and diaphragms, and the wall has none", Recorders: "recorders: leave it empty and Run Analysis picks one",
        Tolerance: "a distance: its default, 1 cm, is right here",
      },
      is: {
        Wall: "the wall's shells", Foundation: "the supports", "Load Pattern": "the load pattern",
        "Mesh Brep": "the mesh, only geometry: ASD Shell makes the shells of it", "The floor": "the floor's point loads, which go through the Load Pattern",
      },
      checks: [
        [(has) => has("Elements", "Wall"), "Elements: the wall's shells"],
        [(has) => has("Supports", "Foundation"), "Supports: the foundation"],
        [(has) => has("LoadPatterns", "Load Pattern"), "LoadPatterns: the load pattern"],
      ],
      first: "Start with the shells: drag a wire from Wall's output, the circle on its right, to Assemble Model's Elements.",
      done: { title: "That's the model.", body: `Assemble Model joins the shells at the nodes they share, and lands each support and each of the floor's loads on a node within its Tolerance, 1${NB}cm. What comes out of AlpacaModel is the wall, ready to solve.` },
    },
  },
  {
    name: "Run", title: "Run",
    guess: { question: `Far from the window the wall carries ${FAR.toFixed(2)}${NB}MPa. Beside it, on average?`, unit: "MPa", step: "0.01", min: 0 },
    task: "Solve it, and see how the floor's forces get round the window to the ground: the colours show how hard the concrete is pressed, and the principal stress lines which way. First, make a guess.",
    tip: "Model View colours the wall by a result. Principal Stress Lines traces lines along the principal stresses, from a seed, through an analysed model.",
    options: [
      { key: "right", says: "Run Analysis into Model View and into Principal Stress Lines, with a seed in the left pier.",
        title: `${PIER.toFixed(2)}${NB}MPa beside the window.`,
        react: (s) => { s.results("right", true); s.play(s.wait(0.4), s.toWindow(), s.peek()); s.tag(`${PIER.toFixed(2)} MPa beside the window`, () => s.at(0, -0.9, 0), "right", true); } },
      { key: "single", says: "Run Analysis into Principal Stress Lines, with Single Line, True, wired into SL.",
        patch: (a) => { const f = a.get("Flow"); a.add(toggle("single", "Single", true, f.box[0] - 130, f.box[1] + 88)); a.wire("Flow", "SL", "single"); },
        title: "One line of each.", body: "Single Line is True, so the component traces one line of each family through the seed, and stops: you see a path, not the flow. Left False, it grows a field of lines from the seed, evenly spaced, over the whole wall.",
        react: (s) => { s.results("single", false); s.tag("One line of each", () => s.at(0, s.TOP + 1.4, 0), "wrong"); } },
      { key: "unsolved", says: "Assemble Model straight into Principal Stress Lines; Run Analysis only into Model View.",
        patch: (a) => a.wire("Flow", "AlpacaModel", a.src("Assemble Model", "AlpacaModel")),
        title: "Nothing to trace.", body: "Principal Stress Lines is fed straight from Assemble Model, a model nothing has solved, so there are no results to trace: it turns orange and says “The model is not analysed.” Model View, fed from Run Analysis, still colours the wall. Feed the lines the AlpacaModel that comes out of Run Analysis.",
        react: (s) => { s.results("colours", false); s.tag("The model is not analysed.", () => s.at(0, s.TOP + 1.4, 0), "wrong"); } },
    ],
  },
];

// ---- The scene: the wall in its clearing, as each round builds it ----
// The wall stands along the area's z axis, its faces looking along x; real X (along the wall) is
// the area's z, real Z (up) its y.
function scene(kit, stress) {
  const { g, solid, add, clear, arrow, tag, al, reduceMotion } = kit;
  const K = 2.2;                          // the toy world's metres per real metre
  const HT = 0.24;                        // half the wall's thickness, as drawn
  const FACE = 1;                         // the face the camera sees, along x
  const SIDE = -1;                        // which way along z real X runs
  const Z = (x) => SIDE * (x - L / 2) * K, Y = (z) => z * K;
  const TOP = Y(H), MID = Y((WIN.z0 + WIN.z1) / 2);
  const HOME = FACE * 9.5, NEAR = FACE * 1.3, ONTO = FACE * 6.5;
  kit.home = HOME;
  kit.view = { at: V(FACE * 2, Y(2), 0), w: 25, h: 15 };
  kit.hideStructure();

  const wg = new THREE.Group();             // the wall and everything drawn on it
  g.add(wg);
  const parts = { slab: new THREE.Group(), wire: new THREE.Group(), points: new THREE.Group(), supports: new THREE.Group(), loads: new THREE.Group(), lines: new THREE.Group() };
  Object.values(parts).forEach((p) => wg.add(p));
  const state = { wall: null, anim: null, lines: [] };

  // The colour of a stress, MPa: pale where the concrete is hardly pressed, through sand, to orange
  // at 1.2 and up - warm, so that the blue and purple lines stand out on it.
  const stops = [[0, new THREE.Color("#f6f5f2")], [0.5, new THREE.Color("#f1dcc0")], [0.85, new THREE.Color("#f2a873")], [1.2, new THREE.Color(ORANGE)]];
  function ramp(m) {
    for (let i = 1; i < stops.length; i++) if (m <= stops[i][0] || i === stops.length - 1) {
      const [a, ca] = stops[i - 1], [b, cb] = stops[i];
      return ca.clone().lerp(cb, Math.max(0, Math.min(1, (m - a) / (b - a))));
    }
    return stops[0][1].clone();
  }

  // The slab: a face of quads each side, and the sides round the outline and the window. kind:
  // window, solid (no window), ghost (faint), giant (200 m thick), flat; field: a variant's stresses.
  const NX = Math.round(L / STEP), NZ = Math.round(H / STEP);
  const inWindow = (i, j) => (i + 0.5) * STEP > WIN.x0 && (i + 0.5) * STEP < WIN.x1 && (j + 0.5) * STEP > WIN.z0 && (j + 0.5) * STEP < WIN.z1;
  function slab(kind, field) {
    clear(parts.slab);
    state.wall = kind;
    wg.rotation.set(0, 0, 0);
    wg.position.set(0, 0, 0);
    wg.scale.set(1, 1, 1);
    if (!kind) return;
    const holed = kind !== "solid";
    const solidAt = (i, j) => i >= 0 && j >= 0 && i < NX && j < NZ && !(holed && inWindow(i, j));
    const ht = kind === "giant" ? 30 : HT;
    const base = new THREE.Color(CONCRETE);
    const colourAt = (i, j) => {
      if (!field) return base;
      const m = field.m[j * (field.nx + 1) + i];
      return m == null ? base : ramp(m);
    };
    const pos = [], col = [];
    const quad = (a, b, c, d, ca, cb, cc, cd) => {
      pos.push(...a, ...b, ...c, ...a, ...c, ...d);
      for (const k of [ca, cb, cc, ca, cc, cd]) col.push(k.r, k.g, k.b);
    };
    const p = (x, i, j) => [x, Y(j * STEP), Z(i * STEP)];
    const grey = new THREE.Color("#a9a39a");
    for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) {
      if (!solidAt(i, j)) continue;
      const c = [colourAt(i, j), colourAt(i + 1, j), colourAt(i + 1, j + 1), colourAt(i, j + 1)];
      for (const s of [1, -1]) {
        const x = s * ht;
        if (s * SIDE > 0) quad(p(x, i, j), p(x, i + 1, j), p(x, i + 1, j + 1), p(x, i, j + 1), c[0], c[1], c[2], c[3]);
        else quad(p(x, i, j), p(x, i, j + 1), p(x, i + 1, j + 1), p(x, i + 1, j), c[0], c[3], c[2], c[1]);
      }
      // the sides where the slab ends: round the outline, and round the window
      const side = (a, b) => { quad(p(-ht, ...a), p(ht, ...a), p(ht, ...b), p(-ht, ...b), grey, grey, grey, grey); quad(p(-ht, ...b), p(ht, ...b), p(ht, ...a), p(-ht, ...a), grey, grey, grey, grey); };
      if (!solidAt(i, j - 1)) side([i, j], [i + 1, j]);
      if (!solidAt(i, j + 1)) side([i, j + 1], [i + 1, j + 1]);
      if (!solidAt(i - 1, j)) side([i, j], [i, j + 1]);
      if (!solidAt(i + 1, j)) side([i + 1, j], [i + 1, j + 1]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
    geo.computeVertexNormals();
    const mat = new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.85, transparent: true, opacity: kind === "ghost" ? 0.3 : 1, side: THREE.DoubleSide });
    const mesh = add(parts.slab, new THREE.Mesh(geo, mat));
    mesh.receiveShadow = true;
    // A foundation strip under it, always there once it stands.
    if (kind !== "flat" && kind !== "giant") {
      const f = add(parts.slab, new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.5, L * K + 0.8), solid("#9b958b")));
      f.position.set(0, -0.2, 0);
    }
    if (kind === "flat") {
      // Laid down about its base, towards the alpaca, onto the ground.
      wg.rotation.z = -FACE * Math.PI / 2;
      wg.position.y = HT + 0.02;
    }
    if (kind === "giant") wg.position.x = -FACE * (ht - HT);   // its face where the wall's was, the rest behind
  }

  // The mesh's quads, drawn over both faces: fine (Mesh Brep, 0.25 m), coarse (1.5 m, roughly) or
  // plane (Mesh Plane, straight across the window).
  function mesh(kind) {
    clear(parts.wire);
    if (!kind) return;
    let xs, zs, keep;
    if (kind === "coarse") { xs = COARSE.xs; zs = COARSE.zs; keep = (x0, x1, z0, z1) => !((x0 + x1) / 2 > WIN.x0 && (x0 + x1) / 2 < WIN.x1 && (z0 + z1) / 2 > WIN.z0 && (z0 + z1) / 2 < WIN.z1); }
    else {
      xs = Array.from({ length: NX + 1 }, (_, i) => i * STEP); zs = Array.from({ length: NZ + 1 }, (_, j) => j * STEP);
      keep = kind === "plane" ? () => true : (x0, x1, z0, z1) => !inWindow(Math.round(x0 / STEP), Math.round(z0 / STEP));
    }
    const seg = new Set(), pts = [];
    const line = (a, b) => { const k = a.join() + "|" + b.join(); if (seg.has(k)) return; seg.add(k); for (const s of [1, -1]) pts.push(s * (HT + 0.015), Y(a[1]), Z(a[0]), s * (HT + 0.015), Y(b[1]), Z(b[0])); };
    for (let j = 0; j < zs.length - 1; j++) for (let i = 0; i < xs.length - 1; i++) {
      if (!keep(xs[i], xs[i + 1], zs[j], zs[j + 1])) continue;
      line([xs[i], zs[j]], [xs[i + 1], zs[j]]); line([xs[i], zs[j + 1]], [xs[i + 1], zs[j + 1]]);
      line([xs[i], zs[j]], [xs[i], zs[j + 1]]); line([xs[i + 1], zs[j]], [xs[i + 1], zs[j + 1]]);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    parts.wire.add(new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: INK, transparent: true, opacity: kind === "coarse" ? 0.9 : 0.45 })));
  }

  // The points along the base and the top, a node on each; with no node, a red ring round it.
  function points(missing) {
    clear(parts.points);
    const dark = solid(INK), red = solid(RED);
    for (const z of [0, H]) for (const x of POINTS) {
      const lost = missing && !COARSE.xs.includes(x);
      const d = add(parts.points, new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), lost ? red : dark));
      d.position.set(FACE * (HT + 0.06), Y(z), Z(x));
      if (lost) {
        const ring = add(parts.points, new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.05, 6, 18).rotateY(Math.PI / 2), red));
        ring.position.copy(d.position);
      }
    }
  }

  // Supports at the points: clamps under the base, clamps over the top, or rollers under the base.
  function supports(kind) {
    clear(parts.supports);
    if (!kind) return;
    const dark = solid(INK), mat = solid(ORANGE);
    for (const x of POINTS) {
      if (kind === "rollers") {
        const c = add(parts.supports, new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.9, 10).rotateZ(Math.PI / 2), mat));
        c.position.set(0, 0.05, Z(x));
      } else {
        const b = add(parts.supports, new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.34, 0.3), dark));
        b.position.set(0, kind === "top" ? TOP + 0.17 : 0.1, Z(x));
      }
    }
    if (kind === "top") {
      const beam = add(parts.supports, new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, L * K + 1.2), dark));
      beam.position.set(0, TOP + 0.55, 0);
    }
  }

  // The floor's loads: down on the top points, along the wall, on the base, or huge.
  function loads(kind) {
    clear(parts.loads);
    if (!kind) return;
    const mat = solid(ORANGE);
    for (const x of POINTS) {
      const z = Z(x), y = kind === "base" ? 0.3 : TOP + 0.1;
      if (kind === "along") arrow(parts.loads, V(FACE * 0.4, TOP + 0.5, z + SIDE * 0.8), V(FACE * 0.4, TOP + 0.5, z - SIDE * 0.8), 0.06, mat);   // -50 along X
      else if (kind === "huge") arrow(parts.loads, V(0, y + 5, z), V(0, y, z), 0.14, mat);
      else arrow(parts.loads, V(FACE * (kind === "base" ? 0.6 : 0), y + 2, z), V(FACE * (kind === "base" ? 0.6 : 0), y, z), 0.06, mat);
    }
  }

  // Principal stress lines on the face the camera sees: purple along the larger principal stress,
  // blue along the smaller, the most compressive. They grow from nothing when they appear.
  function lines(variant, single) {
    clear(parts.lines);
    state.lines = [];
    const v = stress.variants[variant];
    const fams = single ? [[[stress.single.sl1], PURPLE], [[stress.single.sl2], BLUE]] : [[v.sl1, PURPLE], [v.sl2, BLUE]];
    for (const [list, colour] of fams) {
      const mat = new THREE.MeshStandardMaterial({ color: colour, roughness: 0.5 });
      for (const l of list) {
        if (l.length < 2) continue;
        const curve = new THREE.CatmullRomCurve3(l.map(([x, z]) => V(FACE * (HT + 0.05), Y(z), Z(x))));
        const geo = new THREE.TubeGeometry(curve, Math.max(4, l.length * 2), single ? 0.1 : 0.05, 5, false);
        const m = new THREE.Mesh(geo, mat);
        parts.lines.add(m);
        state.lines.push(m);
      }
    }
    if (single) {
      const s = add(parts.lines, new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 10), solid(INK)));
      s.position.set(FACE * (HT + 0.08), Y(stress.single.seed[1]), Z(stress.single.seed[0]));
    }
    grow(0);
    state.anim = { kind: "grow", t: 0 };
    if (reduceMotion) grow(1);
  }
  function grow(t) {
    for (const m of state.lines) {
      const n = m.geometry.index.count;
      m.geometry.setDrawRange(0, Math.floor((n * smooth(Math.min(1, t))) / 6) * 6);
    }
  }
  // The analysed wall: coloured by its stresses, with its lines or one of each, or colours alone.
  function results(kind, withLines) {
    slab("window", stress.variants.right);
    mesh(null);
    supports("base");
    loads("down");
    if (kind === "right") lines("right", false);
    else if (kind === "single") lines("right", true);
  }

  // What a wrong support or load does: sinks, leans along its length, or crushes.
  const animate = (kind) => { state.anim = { kind, t: 0 }; if (reduceMotion) step(10); };
  function step(dt) {
    const a = state.anim;
    if (!a) return;
    a.t += dt;
    if (a.kind === "grow") { grow(a.t / 1.8); if (a.t > 1.8) state.anim = null; }
    else if (a.kind === "sink") {
      const t = Math.min(1, a.t / 1.6);
      wg.position.y = -Y(H) * 0.55 * t * t;
      if (t === 1 && !a.done) { a.done = true; kit.makeSplash(0, 0); }
    } else if (a.kind === "shear") {
      // Swayed along its length, back and forth, and left leaning: drawn far bigger than its 0.65 mm.
      const t = Math.min(1, a.t / 2.4), sway = Math.sin(t * Math.PI * 3) * (1 - t) * 0.12 + 0.05 * smooth(t);
      wg.matrixAutoUpdate = false;
      wg.matrix.makeShear(0, 0, 0, 0, 0, -SIDE * sway);
    } else if (a.kind === "crush") {
      const t = Math.min(1, a.t / 0.9);
      wg.scale.y = 1 - 0.18 * smooth(t);
      parts.slab.children.forEach((m) => { if (m.material.color) m.material.color.lerpColors(new THREE.Color("#ffffff"), new THREE.Color(RED), smooth(t) * 0.7); });
      if (t === 1 && !a.done) { a.done = true; kit.makeSplash(0, 0); }
    }
  }

  // The alpaca: up to the window, and a hopeful look up at it; or a bump against the wall. It looks
  // along +x, so on the +x side it is turned round to face the wall.
  const STAND = NEAR + FACE * 1.2;
  const toWindow = () => kit.walkTo(STAND);
  const peek = () => kit.step(1.3, (t) => { al.pitch = 0.3 * Math.sin(Math.PI * t); al.lift = 0.7 * Math.sin(Math.PI * Math.min(1, t * 2)); });
  const bump = () => kit.step(0.7, (t) => { al.x = STAND - FACE * 0.45 * Math.sin(Math.PI * t); al.roll = 0.15 * Math.sin(Math.PI * t * 2); });

  function surface(x, z) {
    const ground = kit.groundAt(x, z);
    if (state.wall === "flat" && FACE * x > 0 && FACE * x < Y(H) && Math.abs(z) < (L * K) / 2) return Math.max(ground, 2 * HT + 0.02);
    return ground;
  }

  function frame(dt) {
    step(dt);
    if (state.anim && state.anim.kind !== "shear" && !wg.matrixAutoUpdate) wg.matrixAutoUpdate = true;
    al.turn = FACE > 0 ? Math.PI : 0;
  }

  // The scene as the rounds before r left it.
  function setScene(r) {
    state.anim = null;
    wg.matrixAutoUpdate = true;
    slab(r > 0 ? "window" : null);
    mesh(r > 1 ? "fine" : null);
    if (r > 1) points(); else clear(parts.points);
    supports(r > 3 ? "base" : null);
    loads(r > 4 ? "down" : null);
    clear(parts.lines);
    state.lines = [];
    if (r === 0) {
      // Rhino's axes at the wall's corner, as the River draws them.
      const o = V(FACE * 0.4, 0.05, Z(0));
      for (const [name, d, c] of [["X", V(0, 0, SIDE), "#e23b3b"], ["Y", V(-FACE, 0, 0), "#3fae49"], ["Z", V(0, 1, 0), "#3b6fe2"]]) {
        kit.arrow(parts.points, o, o.clone().addScaledVector(d, 2.4), 0.06, solid(c));
        tag(name, () => o.clone().addScaledVector(d, 2.9), "axis", false, "scene");
      }
    }
  }
  // The wiring round: what Assemble Model has not been given yet is drawn faint, or not at all.
  function ghost(has) {
    parts.slab.children.forEach((m) => { m.material.opacity = !has || has("Elements", "Wall") ? 1 : 0.3; });
    parts.supports.visible = !has || has("Supports", "Foundation");
    parts.loads.visible = !has || has("LoadPatterns", "Load Pattern");
  }

  const api = {
    TOP, MID, ONTO, at: (x, y, z) => V(x, y, z),
    wall: (kind) => slab(kind), mesh, points: (missing) => points(missing), supports, loads, results,
    sink: () => animate("sink"), shear: () => animate("shear"), crush: () => animate("crush"),
    tag, play: kit.play, wait: kit.wait, walkTo: kit.walkTo, hop: kit.hop, lookUp: kit.lookUp, toWindow, peek, bump,
    zoom: kit.zoom,
  };
  return { api, setScene, frame, surface, ghost, stop: () => { g.remove(wg); } };
}

export async function start(world, host, onExit) {
  const [def, stress] = await ready;
  Object.assign(def.icons, ICONS);
  // A component with menus is measured thousands wide where the .gh is written without Rhino: its
  // box from its ports, so that a snippet with it is the size it is drawn.
  for (const o of def.objects) {
    // The ports near it: one its menu holds may be left at the origin.
    const near = (p) => p.box && (!o.pivot || (Math.abs(p.box[0] - o.pivot[0]) < 300 && Math.abs(p.box[1] - o.pivot[1]) < 300));
    const ports = [...(o.inputs || []), ...(o.outputs || [])].filter(near);
    if (o.box && o.box[2] > 1000 && ports.length) {
      const x0 = Math.min(...ports.map((p) => p.box[0])), x1 = Math.max(...ports.map((p) => p.box[0] + p.box[2]));
      const y0 = Math.min(...ports.map((p) => p.box[1])), y1 = Math.max(...ports.map((p) => p.box[1] + p.box[3]));
      o.box = [x0 - 2, y0 - 2, x1 - x0 + 4, y1 - y0 + 4];
    }
  }
  return runLesson(world, host, onExit, {
    id: "wall", chip: "Area 9 · Wall with a window", def, gh: { url: GH_FILE, name: "Wall with a window.gh" },
    rounds: ROUNDS, scene: (kit) => scene(kit, stress),
    finish: (guess) => {
      const said = guess == null ? "" : Math.abs(guess - PIER) <= PIER * 0.1 ? `You guessed ${guess}${NB}MPa: right on. ` : `You guessed ${guess}${NB}MPa. `;
      return [
        el("p", "", `${said}Beside the window the concrete carries ${PIER.toFixed(2)}${NB}MPa on average, a third more than the ${FAR.toFixed(2)}${NB}MPa far from it: the floor's forces bend round the window into the two piers, as the blue lines show, and arch over it, as the purple ones do. Right at the window's edge it is ${EDGE.toFixed(1)}${NB}MPa, and at its top corners about ${CORNER}${NB}MPa: where walls crack first.`),
        el("p", "pg-calc", `By hand: the piers are 5.5 − 1.5 = 4${NB}m long and 0.2${NB}m thick, so σ = 600${NB}kN / (4 × 0.2${NB}m²) = 750${NB}kN/m² = ${PIER.toFixed(2)}${NB}MPa; far from the window, 600 / (5.5 × 0.2) = ${FAR.toFixed(2)}${NB}MPa. OpenSees gives the same mean across the piers.`),
      ];
    },
    done: { title: "The Wall with a window is done.", body: "You built a shell model the way every Alpaca4d shell model is built: a surface, a mesh with a node wherever a support or a load goes, a section and shells, supports, loads, Assemble Model, then an analysis, with stress lines to read how the forces flow. The file is the definition you put together, ready to open in Grasshopper with Alpaca4d." },
  });
}
