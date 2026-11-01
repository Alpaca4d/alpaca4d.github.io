// The Playground's island: ten areas on a winding path, each with the structure its level
// teaches, seen from above at a fixed angle like a strategy game. A sketch of the map only: there
// are no exercises yet, and the progress shown is an example.

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// ---- Small helpers ----
const S = Math.SQRT1_2;
// The camera looks along -x -z, so the map's u and v are the world's diagonals.
const toWorld = (u, v, y = 0) => new THREE.Vector3((u - v) * S, y, (-u - v) * S);
const smoothstep = (e0, e1, x) => { const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
const mix = (a, b, t) => a + (b - a) * t;
function hash(i, j) {
  let h = (Math.imul(i, 374761393) + Math.imul(j, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function noise(x, y) {
  const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}
const fbm = (x, y) => noise(x, y) * 0.55 + noise(x * 2.03 + 5.2, y * 2.03) * 0.3 + noise(x * 4.1, y * 4.1 + 1.7) * 0.15;
function random(seed) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function distToSegment(u, v, a, b) {
  const du = b[0] - a[0], dv = b[1] - a[1], len = du * du + dv * dv;
  const t = len ? Math.max(0, Math.min(1, ((u - a[0]) * du + (v - a[1]) * dv) / len)) : 0;
  return Math.hypot(u - a[0] - t * du, v - a[1] - t * dv);
}
const distToLine = (u, v, pts) => {
  let d = Infinity;
  for (let i = 1; i < pts.length; i++) d = Math.min(d, distToSegment(u, v, pts[i - 1], pts[i]));
  return d;
};

// ---- The levels, and where they sit on the island ----
// Map coordinates: u runs to the right of the screen, v away from the viewer; heights in metres
// of the toy world. "face" turns a structure towards a direction, at 45 degrees to the view as a
// strategy game's buildings are; crossings follow the path.
const LEVELS = [
  { name: "River", u: -30, v: -36, h: 1.4, kind: "river",
    build: "A simply supported plank, with the alpaca on it",
    skill: "Material, Section, Beam, Support, Load, Assemble, Run Analysis, View Results",
    idea: "Pin and roller supports, and how far a plank bends" },
  { name: "Cliff", u: 6, v: -30, h: 4.8, kind: "cliff", face: [1, -1],
    build: "A cantilever balcony over the drop",
    skill: "Fixed support, Nodal Displacements",
    idea: "The same span and load bend a cantilever 16 times as much" },
  { name: "Snowy roof", u: 34, v: -16, h: 4.2, kind: "cabin", face: [-1, -1], snow: true,
    build: "A rafter under snow, and how deep it must be",
    skill: "Beam load, Gravity, Load Pattern, a slider on the section",
    idea: "Twice as deep is 8 times as stiff; the L/250 limit" },
  { name: "Barn", u: 8, v: -6, h: 3.8, kind: "barn",
    build: "A portal frame in the wind",
    skill: "Several elements, Assemble, Hinge Release",
    idea: "Rigid joints or hinges, and how much it sways" },
  { name: "Valley", u: -26, v: 0, h: 4.4, kind: "gorge",
    build: "A truss bridge over the gorge",
    skill: "Truss elements",
    idea: "Why triangles; tension and compression" },
  { name: "Market", u: -34, v: 18, h: 5.6, kind: "market", face: [1, -1],
    build: "Predict the reactions and moments, then check them",
    skill: "Reaction Forces, Beam Forces",
    idea: "Equilibrium and moment diagrams" },
  { name: "Watchtower", u: -6, v: 20, h: 6.6, kind: "tower", face: [1, -1],
    build: "Slender legs that must not buckle",
    skill: "Linear Buckling",
    idea: "How end fixity and bracing raise the buckling load" },
  { name: "Footbridge", u: 24, v: 14, h: 5.4, kind: "lake",
    build: "A footbridge that bounces too much",
    skill: "Natural Vibration, Mass Point",
    idea: "Frequency rises with stiffness and falls with mass" },
  { name: "Wall with a window", u: 30, v: 34, h: 7.2, kind: "wall", face: [-1, -1],
    build: "A window cut into a wall",
    skill: "Shell, Shell load, Shell Forces, Principal Stress Lines",
    idea: "How forces flow around an opening" },
  { name: "Summit bridge", u: 2, v: 40, h: 9, kind: "chasm",
    build: "The lightest bridge across the chasm",
    skill: "Topology Optimisation",
    idea: "Material only where the forces flow" },
];
LEVELS.forEach((a) => {
  a.r = a.r || 9;
  if (a.face) { const d = Math.hypot(a.face[0], a.face[1]); a.face = [a.face[0] / d, a.face[1] / d]; }
});

// The sketch's example progress: three areas done, with their stars, and the fourth open.
const STARS = [3, 2, 3];
const CURRENT = 3;
const stateOf = (i) => (i < CURRENT ? "done" : i === CURRENT ? "current" : "locked");

// The path, from the pier on the beach to the flag on the summit, through every area.
// The pier, on the west beach above the river's mouth: the alpaca lands there, and the river is
// the first thing in its way.
const START = [-46.5, -22];
const TO_SEA = [-1, 0.15];
const FLAG = [-11, 47];
const pathMap = [START];
const at = [];
const via = [[-13, -39], [22, -27], [24, -9], [-9, -5], [-37, 7], [-21, 25], [8, 17], [36, 22], [18, 41]];
LEVELS.forEach((a, i) => {
  at.push(pathMap.length);
  pathMap.push([a.u, a.v]);
  if (via[i]) pathMap.push(via[i]);
});
pathMap.push(FLAG);
// The direction of the path through each area, in map coordinates.
LEVELS.forEach((a, i) => {
  const p = pathMap[at[i] - 1], n = pathMap[at[i] + 1];
  const d = Math.hypot(n[0] - p[0], n[1] - p[1]);
  a.t = [(n[0] - p[0]) / d, (n[1] - p[1]) / d];
  a.n = [-a.t[1], a.t[0]];
});

// ---- The ground ----
// Cuts across the path where a level needs something to cross: the river runs from a spring to
// the sea, the gorge and the chasm are short trenches, the footbridge's area is a lake.
const cuts = [];
LEVELS.forEach((a) => {
  const along = (k) => [a.u + a.n[0] * k, a.v + a.n[1] * k];
  if (a.kind === "river") cuts.push({ a, pts: [along(22), along(12), [a.u, a.v], along(-12), along(-34)], hw: 3.2, bank: 2.4, floor: -1.4 });
  if (a.kind === "gorge") cuts.push({ a, pts: [along(15), along(-15)], hw: 3, bank: 1.4, floor: -1.3 });
  if (a.kind === "chasm") cuts.push({ a, pts: [along(12), along(-12)], hw: 2.6, bank: 1, floor: -1.6 });
  if (a.kind === "lake") cuts.push({ a, pts: [[a.u, a.v], [a.u, a.v]], hw: 5.6, bank: 3, floor: a.h - 1.9, water: a.h - 0.55 });
  const c = cuts.find((x) => x.a === a);
  // The span of the structure that crosses it, from bank to bank and a little over.
  a.span = c ? 2 * (c.hw + c.bank) + 2.4 : 0;
});

function island(u, v) {
  const n = fbm(u * 0.035 + 7, v * 0.035 - 3);
  const du = u / 63, dv = (v - 4) / 58;
  const d = Math.sqrt(du * du + dv * dv) + (n - 0.5) * 0.34;
  const land = 1 - smoothstep(0.76, 1.0, d);
  // The island climbs towards the back, to the summit.
  const rise = 1.2 + Math.max(0, v + 40) * 0.085;
  const hills = (fbm(u * 0.07 + 2, v * 0.07) - 0.42) * 4.2;
  return land * (rise + hills * land) - (1 - land) * 3.2;
}

function height(u, v) {
  let h = island(u, v);
  for (const a of LEVELS) {
    const d = Math.hypot(u - a.u, v - a.v);
    const w = 1 - smoothstep(a.r * 0.5, a.r * 1.3, d);
    if (w > 0) h += (a.h - h) * w;
    if (a.kind === "cliff") {
      // A drop on the side the balcony faces, for it to hang over.
      const out = (u - a.u) * a.face[0] + (v - a.v) * a.face[1];
      const s = smoothstep(2.6, 4.4, out) * (1 - smoothstep(a.r * 0.9, a.r * 1.7, d));
      h += (1.0 - h) * s;
    }
  }
  for (const c of cuts) {
    const d = distToLine(u, v, c.pts);
    if (d < c.hw + c.bank) h = c.floor + (h - c.floor) * smoothstep(c.hw, c.hw + c.bank, d);
  }
  return h;
}
const cutWeight = (u, v) => cuts.reduce((m, c) => Math.max(m, 1 - smoothstep(c.hw, c.hw + c.bank * 0.6, distToLine(u, v, c.pts))), 0);

const C = (hex) => new THREE.Color(hex);
const PAL = {
  deep: C("#2f6fdc"), seabed: C("#c9b483"), sand: C("#ecdeb0"), grass: C("#c3d872"), meadow: C("#96b653"),
  rock: C("#a39f96"), rockDark: C("#8b877e"), snow: C("#f6f7f9"), clearing: C("#e6d8ad"), grey: C("#c4c6c9"),
};

function groundColour(u, v, h, ny, locked) {
  const c = new THREE.Color();
  const lake = cuts.find((x) => x.water !== undefined && h < x.water && distToLine(u, v, x.pts) < x.hw + x.bank);
  if (lake) c.copy(PAL.seabed).lerp(PAL.deep, smoothstep(lake.water - 0.2, lake.water - 1.6, h));
  else if (h < -0.15) c.copy(PAL.seabed).lerp(PAL.deep, smoothstep(-0.2, -2.6, h));
  else if (h < 0.55) c.copy(PAL.sand);
  else {
    const snowy = LEVELS.some((a) => a.snow && Math.hypot(u - a.u, v - a.v) < a.r * 1.25 + (noise(u * 0.3, v * 0.3) - 0.5) * 4);
    if (snowy || h > 8.6 + noise(u * 0.2, v * 0.2) * 1.2) c.copy(PAL.snow);
    else if (ny < 0.74) c.copy(PAL.rock).lerp(PAL.rockDark, noise(u * 0.4, v * 0.4));
    else c.copy(PAL.grass).lerp(PAL.meadow, smoothstep(0.35, 0.75, fbm(u * 0.09 - 4, v * 0.09 + 9)));
    for (const a of LEVELS) {
      const d = Math.hypot(u - a.u, v - a.v);
      if (d < a.r * 0.45 && !a.snow) c.lerp(PAL.clearing, 0.55 * (1 - smoothstep(a.r * 0.3, a.r * 0.45, d)));
    }
  }
  // Areas still locked look a little faded, like a map not yet explored.
  if (locked > 0) c.lerp(PAL.grey, 0.32 * locked);
  return c;
}

function buildGround() {
  const U0 = -86, U1 = 86, V0 = -76, V1 = 80, CELL = 2;
  const nu = (U1 - U0) / CELL, nv = (V1 - V0) / CELL;
  const rnd = random(7);
  const grid = [];
  for (let j = 0; j <= nv; j++) {
    for (let i = 0; i <= nu; i++) {
      const edge = i === 0 || j === 0 || i === nu || j === nv;
      const u = U0 + i * CELL + (edge ? 0 : (rnd() - 0.5) * CELL * 0.45);
      const v = V0 + j * CELL + (edge ? 0 : (rnd() - 0.5) * CELL * 0.45);
      grid.push([u, v, height(u, v)]);
    }
  }
  const lockedAt = (u, v) => LEVELS.reduce((m, a, i) => (stateOf(i) === "locked" ? Math.max(m, 1 - smoothstep(a.r * 0.8, a.r * 1.4, Math.hypot(u - a.u, v - a.v))) : m), 0);
  const pos = [], col = [];
  const A = new THREE.Vector3(), B = new THREE.Vector3(), Cc = new THREE.Vector3(), n = new THREE.Vector3();
  const tri = (p, q, r) => {
    A.copy(toWorld(p[0], p[1], p[2])); B.copy(toWorld(q[0], q[1], q[2])); Cc.copy(toWorld(r[0], r[1], r[2]));
    n.subVectors(B, A).cross(Cc.clone().sub(A)).normalize();
    if (n.y < 0) { const t = B.clone(); B.copy(Cc); Cc.copy(t); n.negate(); }
    const u = (p[0] + q[0] + r[0]) / 3, v = (p[1] + q[1] + r[1]) / 3, h = (p[2] + q[2] + r[2]) / 3;
    const c = groundColour(u, v, h, n.y, lockedAt(u, v)).multiplyScalar(0.96 + hash(Math.round(u * 7), Math.round(v * 7)) * 0.08);
    pos.push(A.x, A.y, A.z, B.x, B.y, B.z, Cc.x, Cc.y, Cc.z);
    for (let k = 0; k < 3; k++) col.push(c.r, c.g, c.b);
  };
  for (let j = 0; j < nv; j++) {
    for (let i = 0; i < nu; i++) {
      const a = grid[j * (nu + 1) + i], b = grid[j * (nu + 1) + i + 1];
      const c = grid[(j + 1) * (nu + 1) + i], d = grid[(j + 1) * (nu + 1) + i + 1];
      if ((i + j) % 2) { tri(a, b, d); tri(a, d, c); } else { tri(a, b, c); tri(b, d, c); }
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(col, 3));
  geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, flatShading: true, roughness: 0.95 }));
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  return mesh;
}

// ---- Structures ----
const solid = (hex) => new THREE.MeshStandardMaterial({ color: hex, flatShading: true, roughness: 0.7 });
const ghostFace = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, depthWrite: false });
const ghostEdge = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
const nextEdge = new THREE.LineBasicMaterial({ color: 0xeb6c3f });
// A look makes the meshes of a part: solid and coloured once built, a white outline before.
const builtLook = (hex) => (geo) => { const m = new THREE.Mesh(geo, solid(hex)); m.castShadow = m.receiveShadow = true; return m; };
const ghostLook = (edge) => (geo) => { const g = new THREE.Group(); g.add(new THREE.Mesh(geo, ghostFace), new THREE.LineSegments(new THREE.EdgesGeometry(geo), edge)); return g; };
const V = (x, y, z) => new THREE.Vector3(x, y, z);
function box(g, look, w, h, d, x, y, z, rz = 0, rx = 0) {
  const m = look(new THREE.BoxGeometry(w, h, d));
  m.position.set(x, y, z);
  m.rotation.set(rx, 0, rz);
  g.add(m);
  return m;
}
function member(g, look, a, b, t) {
  const d = new THREE.Vector3().subVectors(b, a);
  const m = look(new THREE.BoxGeometry(d.length(), t, t));
  m.position.copy(a).addScaledVector(d, 0.5);
  m.quaternion.setFromUnitVectors(V(1, 0, 0), d.normalize());
  g.add(m);
}
function cylinder(g, look, r, h, x, y, z, seg = 8, rx = 0) {
  const m = look(new THREE.CylinderGeometry(r, r, h, seg));
  m.position.set(x, y, z);
  m.rotation.x = rx;
  g.add(m);
}

// Each kind builds its decor, always there, and its structure, solid once the level is done.
// Local axes: x along the path (or towards "face"), y up, ground at y = 0.
const KINDS = {
  river(g, look, deco, a) {
    for (const s of [-1, 1]) box(g, deco("#b9b2a2"), 2, 1.4, 3.4, s * (a.span / 2 - 0.6), 0.1, 0);
    box(g, look, a.span + 1.6, 0.45, 2.4, 0, 1.0, 0);
  },
  cliff(g, look, deco) {
    box(g, deco("#b9b2a2"), 2.4, 0.9, 3.6, -0.8, 0.45, 0);
    box(g, look, 9, 0.4, 3.2, 4.2, 0.95, 0);
    for (const z of [-1.4, 1.4]) {
      member(g, look, V(8.4, 1.1, z), V(8.4, 2.2, z), 0.16);
      member(g, look, V(0.4, 2.2, z), V(8.4, 2.2, z), 0.14);
    }
  },
  cabin(g, look, deco) {
    box(g, deco("#efe7d6"), 4.2, 2.6, 5, 0, 1.3, 0);
    box(g, deco("#8a6a4a"), 0.1, 1.5, 1, 2.12, 0.75, 0);
    box(g, deco("#a39f96"), 0.7, 1.6, 0.7, -0.9, 4.1, 1.6);
    for (const s of [-1, 1]) {
      box(g, look, 2.9, 0.28, 5.8, s * 1.2, 3.35, 0, -s * 0.58);
      box(g, deco("#ffffff"), 2.7, 0.18, 5.6, s * 1.14, 3.58, 0, -s * 0.58);
    }
  },
  barn(g, look, deco) {
    box(g, deco("#cdbb92"), 11.5, 0.3, 7.4, 0, 0.15, 0);
    for (const [x, z] of [[-6.8, 2.4], [-7.4, 1], [6.9, -2.6]]) cylinder(g, deco("#e8c35a"), 0.6, 1.1, x, 0.6, z, 10, Math.PI / 2);
    for (const x of [-4.5, -1.5, 1.5, 4.5]) {
      for (const z of [-2.8, 2.8]) {
        member(g, look, V(x, 0.3, z), V(x, 4, z), 0.32);
        member(g, look, V(x, 4, z), V(x, 5.7, 0), 0.28);
      }
    }
    member(g, look, V(-4.5, 5.7, 0), V(4.5, 5.7, 0), 0.26);
    for (const z of [-2.8, 2.8]) member(g, look, V(-4.5, 4, z), V(4.5, 4, z), 0.24);
  },
  gorge(g, look, deco, a) {
    const L = a.span / 2, n = 6, top = 2.2;
    for (const s of [-1, 1]) box(g, deco("#b9b2a2"), 1.6, 1, 3.8, s * (L + 0.4), 0.2, 0);
    box(g, look, 2 * L, 0.22, 3, 0, 0.35, 0);
    for (const z of [-1.5, 1.5]) {
      member(g, look, V(-L, 0.45, z), V(L, 0.45, z), 0.2);
      member(g, look, V(-L + L / n, top, z), V(L - L / n, top, z), 0.2);
      for (let k = 0; k < n; k++) {
        const x0 = -L + (2 * L * k) / n, x1 = -L + (2 * L * (k + 1)) / n, xm = (x0 + x1) / 2;
        member(g, look, V(x0, 0.45, z), V(xm, top, z), 0.16);
        member(g, look, V(xm, top, z), V(x1, 0.45, z), 0.16);
      }
    }
  },
  market(g, look, deco) {
    for (const z of [-4.6, 4.6]) {
      box(g, deco("#c99a6b"), 1.8, 1, 3, 0, 0.5, z);
      for (let k = 0; k < 4; k++) box(g, deco(k % 2 ? "#ffffff" : "#fe0000"), 2.2, 0.16, 0.85, 0.2, 2.3, z - 1.28 + k * 0.85, 0.25);
      for (const dz of [-1.4, 1.4]) member(g, deco("#8a6a4a"), V(-0.8, 0, z + dz), V(-0.8, 2.4, z + dz), 0.12);
    }
    member(g, look, V(0, 0, 0), V(0, 3.4, 0), 0.3);
    member(g, look, V(0, 3.4, -2.8), V(0, 3.4, 2.8), 0.22);
    for (const z of [-2.8, 2.8]) {
      member(g, look, V(0, 3.4, z), V(0, 1.7, z), 0.06);
      cylinder(g, look, 0.9, 0.18, 0, 1.6, z, 10);
    }
  },
  tower(g, look) {
    const legs = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
    const leg = (s, t, y) => V(s * mix(2.3, 1.3, y / 9), y, t * mix(2.3, 1.3, y / 9));
    legs.forEach(([s, t]) => member(g, look, leg(s, t, 0), leg(s, t, 9), 0.22));
    for (const [y0, y1] of [[0, 3], [3, 6], [6, 9]]) {
      for (let k = 0; k < 4; k++) {
        const [s0, t0] = legs[k], [s1, t1] = legs[(k + 1) % 4];
        member(g, look, leg(s0, t0, y0), leg(s1, t1, y1), 0.1);
        member(g, look, leg(s1, t1, y0), leg(s0, t0, y1), 0.1);
      }
    }
    box(g, look, 3.8, 0.3, 3.8, 0, 9.15, 0);
    const roof = look(new THREE.ConeGeometry(2.9, 1.9, 4));
    roof.position.set(0, 11.6, 0);
    roof.rotation.y = Math.PI / 4;
    g.add(roof);
    for (const [s, t] of legs) member(g, look, V(s * 1.6, 9.3, t * 1.6), V(s * 1.6, 10.65, t * 1.6), 0.12);
  },
  lake(g, look, deco, a) {
    const L = a.span / 2;
    box(g, look, 2 * L, 0.3, 2.2, 0, 0.55, 0);
    for (const z of [-1, 1]) {
      member(g, look, V(-L, 1.5, z), V(L, 1.5, z), 0.1);
      for (let x = -L; x <= L + 0.01; x += L / 4) member(g, look, V(x, 0.7, z), V(x, 1.5, z), 0.1);
    }
  },
  wall(g, look, deco) {
    box(g, look, 0.6, 5.5, 3.5, 0, 2.75, -2.75);
    box(g, look, 0.6, 5.5, 3.5, 0, 2.75, 2.75);
    box(g, look, 0.6, 1.8, 2, 0, 0.9, 0);
    box(g, look, 0.6, 1.9, 2, 0, 4.55, 0);
    for (const [x, z] of [[1.6, -3.5], [2.2, 3.1], [-1.8, 4.2]]) {
      const r = deco("#a39f96")(new THREE.IcosahedronGeometry(0.55, 0));
      r.position.set(x, 0.3, z);
      g.add(r);
    }
  },
  chasm(g, look, deco, a) {
    const L = a.span / 2;
    box(g, look, 2 * L, 0.3, 2.6, 0, 0.35, 0);
    const n = 8, pts = [];
    for (let k = 0; k <= n; k++) {
      const x = -L + 0.8 + ((2 * L - 1.6) * k) / n;
      pts.push(V(x, -2.6 + 2.6 * Math.sin((Math.PI * k) / n), 0));
    }
    for (const z of [-1, 1]) {
      for (let k = 0; k < n; k++) member(g, look, V(pts[k].x, pts[k].y, z), V(pts[k + 1].x, pts[k + 1].y, z), 0.24);
      for (let k = 1; k < n; k++) member(g, look, V(pts[k].x, pts[k].y, z), V(pts[k].x, 0.2, z), 0.1);
    }
  },
};

function flag(colours) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 5.2, 6), solid("#2a2d31"));
  pole.position.y = 2.6;
  pole.castShadow = true;
  g.add(pole);
  colours.forEach((c, k) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.3 / colours.length, 0.08), solid(c));
    s.position.set(1.32, 4.9 - (k + 0.5) * (1.3 / colours.length), 0);
    s.castShadow = true;
    g.add(s);
  });
  return g;
}

// ---- The page ----
const root = document.querySelector("[data-playground]");
if (root) init(root);

function init(root) {
  const stage = root.querySelector("[data-stage]");
  const markersBox = root.querySelector("[data-markers]");
  const card = root.querySelector("[data-card]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true });
  } catch (e) {
    root.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setClearColor("#3778e4");
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight("#ffffff", "#b6c39b", 1.5));
  const sun = new THREE.DirectionalLight("#fff4e0", 2.4);
  sun.position.copy(toWorld(50, 20, 90));
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -110, right: 110, top: 110, bottom: -110, near: 1, far: 300 });
  sun.shadow.bias = -0.0005;
  sun.shadow.normalBias = 0.4;
  scene.add(sun);

  scene.add(buildGround());

  // The sea, with slow low-poly waves.
  const seaGeo = new THREE.PlaneGeometry(560, 560, 64, 64).toNonIndexed();
  seaGeo.rotateX(-Math.PI / 2);
  const seaRest = seaGeo.attributes.position.array.slice();
  const sea = new THREE.Mesh(seaGeo, new THREE.MeshStandardMaterial({ color: "#4d93f6", transparent: true, opacity: 0.8, flatShading: true, roughness: 0.3 }));
  scene.add(sea);
  // A lake up the hill has its own water, at its own level.
  for (const c of cuts) {
    if (c.water === undefined) continue;
    const lake = new THREE.Mesh(new THREE.CircleGeometry(c.hw + c.bank * 0.55, 18).rotateX(-Math.PI / 2), sea.material);
    lake.position.copy(toWorld(c.a.u, c.a.v, c.water));
    scene.add(lake);
  }
  const waves = (t) => {
    const p = seaGeo.attributes.position.array;
    for (let k = 0; k < p.length; k += 3) {
      const x = seaRest[k], z = seaRest[k + 2];
      p[k + 1] = 0.16 * Math.sin(0.11 * x + t * 0.9) + 0.12 * Math.sin(0.13 * z - t * 1.1);
    }
    seaGeo.attributes.position.needsUpdate = true;
    seaGeo.computeVertexNormals();
  };
  waves(0);

  // The path: stepping stones, white where the alpaca has been, grey where it has yet to go.
  const curve = new THREE.CatmullRomCurve3(pathMap.map(([u, v]) => toWorld(u, v)), false, "centripetal");
  const N = 1400;
  const samples = curve.getSpacedPoints(N).map((p) => {
    const u = (p.x - p.z) * S, v = (-p.x - p.z) * S;
    return { u, v, h: height(u, v), cut: cutWeight(u, v) };
  });
  const sampleNear = (u, v) => samples.reduce((best, s, i) => (Math.hypot(s.u - u, s.v - v) < Math.hypot(samples[best].u - u, samples[best].v - v) ? i : best), 0);
  LEVELS.forEach((a) => { a.at = sampleNear(a.u, a.v); });
  // Where the alpaca walks: on the ground, or on the deck of a structure over a cut.
  samples.forEach((s) => {
    s.y = Math.max(s.h, 0) + 0.05;
    for (const a of LEVELS) {
      if (a.span && Math.hypot(s.u - a.u, s.v - a.v) < a.span / 2 + 0.6) s.y = Math.max(s.y, a.h + (a.kind === "river" ? 1.25 : 0.7));
    }
  });
  const stones = [];
  for (let i = 0; i < samples.length; i += 9) {
    const s = samples[i];
    if (s.h < 0.15 || s.cut > 0.25) continue;
    stones.push({ i, ...s });
  }
  const stoneMesh = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.42, 0.46, 0.2, 7), solid("#ffffff"), stones.length);
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3();
  stones.forEach((s, k) => {
    const ahead = s.i > LEVELS[CURRENT].at;
    sc.setScalar(ahead ? 0.75 : 1);
    m4.compose(toWorld(s.u, s.v, s.h + 0.08), q, sc);
    stoneMesh.setMatrixAt(k, m4);
    stoneMesh.setColorAt(k, C(ahead ? "#c5c7c4" : "#ffffff"));
  });
  stoneMesh.receiveShadow = true;
  scene.add(stoneMesh);

  // Trees and rocks, away from the path, the areas and the water.
  const rnd = random(11);
  const pathNear = (u, v, r) => samples.some((s, i) => i % 6 === 0 && Math.abs(s.u - u) < r && Math.abs(s.v - v) < r && Math.hypot(s.u - u, s.v - v) < r);
  const trees = [], rocks = [];
  for (let k = 0; k < 4200 && trees.length < 340; k++) {
    const u = (rnd() - 0.5) * 132, v = (rnd() - 0.5) * 124 + 2;
    const h = height(u, v);
    if (h < 0.9 || h > 8.2 || cutWeight(u, v) > 0) continue;
    if (LEVELS.some((a) => Math.hypot(u - a.u, v - a.v) < a.r * (a.snow ? 1.3 : 1.05))) continue;
    if (pathNear(u, v, 2.6)) continue;
    const slope = Math.abs(height(u + 1, v) - h) + Math.abs(height(u, v + 1) - h);
    if (slope > 1.1) { if (rocks.length < 70 && rnd() < 0.5) rocks.push([u, v, h]); continue; }
    if (fbm(u * 0.08 + 31, v * 0.08 - 12) < 0.47) { if (rocks.length < 70 && rnd() < 0.04) rocks.push([u, v, h]); continue; }
    trees.push([u, v, h]);
  }
  const canopy = new THREE.InstancedMesh(new THREE.ConeGeometry(1.15, 2.7, 6).translate(0, 2.05, 0), solid("#ffffff"), trees.length);
  const trunk = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.28, 0.9, 5).translate(0, 0.45, 0), solid("#8a6a4a"), trees.length);
  const greens = ["#79a347", "#8bb253", "#6a9540", "#9cc05e"].map(C);
  trees.forEach(([u, v, h], k) => {
    sc.setScalar(0.75 + rnd() * 0.6);
    q.setFromAxisAngle(V(0, 1, 0), rnd() * Math.PI);
    m4.compose(toWorld(u, v, h - 0.1), q, sc);
    canopy.setMatrixAt(k, m4);
    trunk.setMatrixAt(k, m4);
    canopy.setColorAt(k, greens[k % greens.length]);
  });
  canopy.castShadow = trunk.castShadow = true;
  scene.add(canopy, trunk);
  const rockMesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.8, 0), solid("#ffffff"), rocks.length);
  rocks.forEach(([u, v, h], k) => {
    sc.set(0.7 + rnd(), 0.5 + rnd() * 0.6, 0.7 + rnd());
    q.setFromAxisAngle(V(0, 1, 0), rnd() * Math.PI);
    m4.compose(toWorld(u, v, h), q, sc);
    rockMesh.setMatrixAt(k, m4);
    rockMesh.setColorAt(k, C(k % 2 ? "#a7a399" : "#bdb8ad"));
  });
  rockMesh.castShadow = true;
  scene.add(rockMesh);

  // The areas: a ring on the ground, the decor, and the level's structure.
  const BUILT = ["#eb6c3f", "#4288f7", "#9e35da", "#afc930", "#eb6c3f", "#4288f7", "#9e35da", "#afc930", "#4288f7", "#eb6c3f"];
  const rings = [];
  const hits = [];
  LEVELS.forEach((a, i) => {
    const st = stateOf(i);
    const g = new THREE.Group();
    const dir = a.face || a.t;
    const w = toWorld(dir[0], dir[1]).normalize();
    g.rotation.y = Math.atan2(-w.z, w.x);
    g.position.copy(toWorld(a.u, a.v, a.h));
    const look = st === "done" ? builtLook(BUILT[i]) : ghostLook(st === "current" ? nextEdge : ghostEdge);
    KINDS[a.kind](g, look, builtLook, a);
    scene.add(g);

    const ring = new THREE.Mesh(new THREE.RingGeometry(a.r * 0.62, a.r * 0.62 + 0.45, 6, 1).rotateX(-Math.PI / 2).rotateY(Math.PI / 6),
      new THREE.MeshBasicMaterial({ color: st === "done" ? "#ffffff" : st === "current" ? "#eb6c3f" : "#d3d5d8", transparent: true, opacity: st === "locked" ? 0.55 : 0.9 }));
    ring.position.copy(toWorld(a.u, a.v, a.h + 0.07));
    ring.userData.base = ring.material.opacity;
    scene.add(ring);
    rings.push(ring);

    const hit = new THREE.Mesh(new THREE.CircleGeometry(a.r * 0.75, 12).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
    hit.position.copy(toWorld(a.u, a.v, a.h + 0.3));
    hit.userData.level = i;
    scene.add(hit);
    hits.push(hit);
  });

  // The pier the alpaca arrives at, and the flag at the top.
  const pier = new THREE.Group();
  const toSea = toWorld(TO_SEA[0], TO_SEA[1]).normalize();
  pier.rotation.y = Math.atan2(-toSea.z, toSea.x);
  pier.position.copy(toWorld(START[0], START[1], 0.35));
  for (let k = 0; k < 6; k++) box(pier, builtLook("#a07850"), 1.1, 0.2, 3, 0.6 + k * 1.2, 0.1, 0);
  for (const z of [-1.4, 1.4]) for (const x of [2.4, 6]) member(pier, builtLook("#7a5a3c"), V(x, -1.6, z), V(x, 0.4, z), 0.22);
  scene.add(pier);
  const summit = flag(["#fe0000", "#eb6c3f", "#9e35da", "#afc930", "#4288f7", "#011efe"]);
  summit.position.copy(toWorld(FLAG[0], FLAG[1], height(FLAG[0], FLAG[1])));
  summit.rotation.y = Math.PI / 4;
  scene.add(summit);

  // Clouds drifting over: flat and a little see-through, so from above they read as clouds and
  // not as boulders on the ground.
  const clouds = [];
  const cloudMat = new THREE.MeshStandardMaterial({ color: "#ffffff", flatShading: true, roughness: 1, transparent: true, opacity: 0.88 });
  for (let k = 0; k < 6; k++) {
    const c = new THREE.Group();
    c.scale.set(1.3, 0.5, 1.3);
    for (let b = 0; b < 4; b++) {
      const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8 + rnd() * 1.8, 0), cloudMat);
      puff.position.set((b - 1.5) * 2.4, rnd() * 0.8, (rnd() - 0.5) * 2);
      puff.castShadow = true;
      c.add(puff);
    }
    c.userData.uv = [(rnd() - 0.5) * 170, (rnd() - 0.5) * 150];
    c.userData.speed = 1.2 + rnd() * 1.4;
    c.position.copy(toWorld(c.userData.uv[0], c.userData.uv[1], 30 + rnd() * 6));
    scene.add(c);
    clouds.push(c);
  }

  // ---- The alpaca ----
  const alpaca = new THREE.Group();
  scene.add(alpaca);
  let walkAt = LEVELS[CURRENT].at;
  let walkTo = walkAt;
  let heading = toWorld(LEVELS[CURRENT].t[0], LEVELS[CURRENT].t[1]).normalize();
  new GLTFLoader().load(root.dataset.model, (gltf) => {
    let src = null;
    gltf.scene.traverse((o) => { if (o.isMesh && !src) src = o; });
    if (!src) return;
    src.updateWorldMatrix(true, false);
    const geo = src.geometry.clone().applyMatrix4(src.matrixWorld);
    geo.computeBoundingBox();
    const bb = geo.boundingBox, size = bb.getSize(V(0, 0, 0)), mid = bb.getCenter(V(0, 0, 0));
    geo.translate(-mid.x, -bb.min.y, -mid.z);
    // Its nose: the middle of the highest part of the model, seen from above.
    const p = geo.attributes.position, head = V(0, 0, 0);
    let count = 0;
    for (let k = 0; k < p.count; k++) if (p.getY(k) > size.y * 0.8) { head.x += p.getX(k); head.z += p.getZ(k); count++; }
    head.divideScalar(Math.max(1, count));
    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: !!geo.attributes.color, flatShading: true, roughness: 0.6 }));
    mesh.castShadow = true;
    mesh.rotation.y = Math.atan2(head.z, head.x);
    mesh.scale.setScalar(6 / size.y);
    alpaca.add(mesh);
  });

  // ---- Camera ----
  const EL = THREE.MathUtils.degToRad(30);
  const FH = 112;
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 1000);
  const target = toWorld(0, 4, 4);
  const away = V(S * Math.cos(EL), Math.sin(EL), S * Math.cos(EL));
  const R = toWorld(1, 0), F = toWorld(0, 1);
  const ZMIN = 0.32, ZMAX = 3.6;
  let glide = null;
  const placeCamera = () => {
    const pu = THREE.MathUtils.clamp((target.x - target.z) * S, -72, 72);
    const pv = THREE.MathUtils.clamp((-target.x - target.z) * S, -66, 74);
    const t = toWorld(pu, pv, target.y);
    target.set(t.x, target.y, t.z);
    camera.position.copy(target).addScaledVector(away, 300);
    camera.lookAt(target);
  };
  const resize = () => {
    const w = Math.max(1, stage.clientWidth), h = Math.max(1, stage.clientHeight);
    renderer.setSize(w, h, false);
    const aspect = w / h;
    Object.assign(camera, { left: (-FH * aspect) / 2, right: (FH * aspect) / 2, top: FH / 2, bottom: -FH / 2 });
    camera.updateProjectionMatrix();
  };
  const home = () => {
    resize();
    const aspect = stage.clientWidth / Math.max(1, stage.clientHeight);
    if (aspect < 0.9) {
      // A phone: start close, on the open area.
      camera.zoom = 0.85;
      target.copy(toWorld(LEVELS[CURRENT].u, LEVELS[CURRENT].v, LEVELS[CURRENT].h));
    } else {
      camera.zoom = THREE.MathUtils.clamp(Math.min(1.05, (FH * aspect) / 150), ZMIN, ZMAX);
      target.copy(toWorld(4, 6, 4));
    }
    camera.updateProjectionMatrix();
    placeCamera();
  };
  home();

  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const ground = new THREE.Plane(V(0, 1, 0), -4);
  const groundAt = (cx, cy) => {
    const r = stage.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    return raycaster.ray.intersectPlane(ground, V(0, 0, 0));
  };
  const zoomAt = (factor, cx, cy) => {
    const before = groundAt(cx, cy);
    camera.zoom = THREE.MathUtils.clamp(camera.zoom * factor, ZMIN, ZMAX);
    camera.updateProjectionMatrix();
    const after = groundAt(cx, cy);
    if (before && after) target.add(before.sub(after));
    placeCamera();
  };
  const pan = (dx, dy) => {
    const k = FH / camera.zoom / stage.clientHeight;
    target.addScaledVector(R, -dx * k).addScaledVector(F, (dy * k) / Math.sin(EL));
    placeCamera();
  };

  // ---- Markers and the level card ----
  const markers = LEVELS.map((a, i) => {
    const st = stateOf(i);
    const b = document.createElement("button");
    b.type = "button";
    b.className = `pg-marker ${st}`;
    const stars = st === "done" ? `<span class="pg-stars" aria-hidden="true">${"★".repeat(STARS[i])}${"☆".repeat(3 - STARS[i])}</span>` : "";
    b.innerHTML = `<span class="pg-pin"><span class="pg-num">${i + 1}</span></span>${stars}<span class="pg-name">${a.name}</span>`;
    b.setAttribute("aria-label", `Area ${i + 1}, ${a.name}: ${st === "done" ? `done, ${STARS[i]} stars of 3` : st === "current" ? "open, the next to do" : "locked"}`);
    b.addEventListener("click", () => select(i));
    markersBox.appendChild(b);
    return { el: b, anchor: toWorld(a.u, a.v, a.h + (a.kind === "tower" ? 13 : 6.5)) };
  });
  const STATE_TEXT = { done: "Done", current: "Next", locked: "Locked" };
  let selected = -1;
  function select(i) {
    selected = i;
    const a = LEVELS[i], st = stateOf(i);
    markers.forEach((m, k) => m.el.classList.toggle("selected", k === i));
    card.querySelector("[data-chip]").textContent = `Area ${i + 1} · ${STATE_TEXT[st]}${st === "done" ? ` · ${"★".repeat(STARS[i])}${"☆".repeat(3 - STARS[i])}` : ""}`;
    card.querySelector("[data-chip]").className = `pg-chip ${st}`;
    card.querySelector("[data-title]").textContent = a.name;
    card.querySelector("[data-build]").textContent = a.build;
    card.querySelector("[data-skill]").textContent = a.skill;
    card.querySelector("[data-idea]").textContent = a.idea;
    const start = card.querySelector("[data-start]");
    start.textContent = st === "locked" ? `Finish area ${CURRENT + 1} to open it` : st === "done" ? "Play again · coming soon" : "Start · coming soon";
    card.hidden = false;
    hideHint();
    if (st !== "locked") walkTo = a.at;
    glide = toWorld(a.u, a.v, a.h);
    if (reduceMotion) { if (st !== "locked") walkAt = walkTo; target.copy(glide); glide = null; placeCamera(); }
  }
  card.querySelector("[data-close]").addEventListener("click", () => {
    card.hidden = true;
    markers.forEach((m) => m.el.classList.remove("selected"));
    selected = -1;
  });
  root.querySelector("[data-zoom-in]").addEventListener("click", () => { const r = stage.getBoundingClientRect(); zoomAt(1.3, r.left + r.width / 2, r.top + r.height / 2); });
  root.querySelector("[data-zoom-out]").addEventListener("click", () => { const r = stage.getBoundingClientRect(); zoomAt(1 / 1.3, r.left + r.width / 2, r.top + r.height / 2); });
  root.querySelector("[data-home]").addEventListener("click", () => { glide = null; home(); });

  // ---- Pointer: drag to move, wheel or pinch to zoom, click an area to pick it ----
  const hint = root.querySelector("[data-hint]");
  if (hint && window.matchMedia("(pointer: coarse)").matches) hint.textContent = "Drag to move · pinch to zoom · tap an area";
  const pointers = new Map();
  let moved = 0, pinch = 0;
  const hideHint = () => hint && hint.classList.add("gone");
  stage.addEventListener("pointerdown", (e) => {
    stage.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved = 0;
    if (pointers.size === 2) { const [a, b] = [...pointers.values()]; pinch = Math.hypot(a.x - b.x, a.y - b.y); }
  });
  stage.addEventListener("pointermove", (e) => {
    const p = pointers.get(e.pointerId);
    if (!p) { hover(e); return; }
    const dx = e.clientX - p.x, dy = e.clientY - p.y;
    p.x = e.clientX; p.y = e.clientY;
    if (pointers.size === 1) {
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved > 4) { stage.classList.add("dragging"); glide = null; pan(dx, dy); hideHint(); }
    } else if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (pinch) zoomAt(d / pinch, (a.x + b.x) / 2, (a.y + b.y) / 2);
      pinch = d;
      moved = 99;
      hideHint();
    }
  });
  const up = (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    stage.classList.remove("dragging");
    if (pointers.size < 2) pinch = 0;
    if (moved < 5 && pointers.size === 0) {
      const i = pick(e);
      if (i >= 0) select(i);
    }
  };
  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
  stage.addEventListener("wheel", (e) => {
    e.preventDefault();
    glide = null;
    zoomAt(Math.exp(-e.deltaY * 0.0016), e.clientX, e.clientY);
    hideHint();
  }, { passive: false });
  const pick = (e) => {
    const r = stage.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    const hit = raycaster.intersectObjects(hits)[0];
    return hit ? hit.object.userData.level : -1;
  };
  let hovered = -1;
  const hover = (e) => {
    const i = pick(e);
    if (i === hovered) return;
    hovered = i;
    stage.classList.toggle("over-area", i >= 0);
    markers.forEach((m, k) => m.el.classList.toggle("hover", k === i));
  };
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !card.hidden) card.querySelector("[data-close]").click();
  });

  // ---- Loop ----
  const tmp = V(0, 0, 0);
  const placeMarkers = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    markers.forEach((m) => {
      tmp.copy(m.anchor).project(camera);
      const x = ((tmp.x + 1) / 2) * w, y = ((1 - tmp.y) / 2) * h;
      const out = x < -60 || x > w + 60 || y < -40 || y > h + 80;
      m.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
      m.el.classList.toggle("off", out);
    });
  };
  const walkPoint = (f) => {
    const i = Math.floor(f), k = f - i, a = samples[i], b = samples[Math.min(samples.length - 1, i + 1)];
    return toWorld(mix(a.u, b.u, k), mix(a.v, b.v, k), mix(a.y, b.y, k));
  };
  let time = 0, last = performance.now(), stride = 0, walkSpeed = 0;
  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    time += dt;
    if (!reduceMotion) {
      waves(time);
      clouds.forEach((c) => {
        c.userData.uv[0] += c.userData.speed * dt;
        if (c.userData.uv[0] > 95) c.userData.uv[0] = -95;
        const p = toWorld(c.userData.uv[0], c.userData.uv[1], c.position.y);
        c.position.set(p.x, c.position.y, p.z);
      });
      const pulse = 0.5 + 0.5 * Math.sin(time * 3);
      rings.forEach((r, i) => { if (stateOf(i) === "current") r.material.opacity = 0.45 + 0.5 * pulse; });
    }
    // The alpaca walks the path, the camera following: at least 18 m a second, and never more
    // than about three seconds from one area to another.
    const walking = Math.abs(walkTo - walkAt) > 0.5;
    if (walking) {
      if (!walkSpeed) walkSpeed = Math.max(70, Math.abs(walkTo - walkAt) / 3);
      const step = Math.min(Math.abs(walkTo - walkAt), dt * walkSpeed);
      const before = walkPoint(walkAt);
      walkAt += Math.sign(walkTo - walkAt) * step;
      const after = walkPoint(walkAt);
      const d = after.clone().sub(before).setY(0);
      if (d.lengthSq() > 1e-6) heading.lerp(d.normalize(), 0.25).normalize();
      stride += dt * 11;
      glide = after.clone();
    } else {
      walkAt = walkTo;
      walkSpeed = 0;
      stride = 0;
    }
    const p = walkPoint(walkAt);
    alpaca.position.set(p.x, p.y + (walking ? Math.abs(Math.sin(stride)) * 0.5 : 0), p.z);
    alpaca.rotation.set(0, Math.atan2(-heading.z, heading.x), walking ? Math.sin(stride) * 0.05 : 0);
    if (glide) {
      target.lerp(V(glide.x, target.y, glide.z), 1 - Math.exp(-dt * (walking ? 6 : 3.5)));
      placeCamera();
      if (!walking && Math.hypot(target.x - glide.x, target.z - glide.z) < 0.05) glide = null;
    }
    renderer.render(scene, camera);
    placeMarkers();
    if (!document.hidden) requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) { last = performance.now(); requestAnimationFrame(frame); }
  });
  if ("ResizeObserver" in window) new ResizeObserver(() => { resize(); placeCamera(); }).observe(stage);
  else window.addEventListener("resize", () => { resize(); placeCamera(); });
  requestAnimationFrame(frame);
  root.classList.add("ready");
}
