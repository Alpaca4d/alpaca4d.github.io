// The hero alpaca. The low-poly model from alpaca4d_modelViewer turns slowly; scrolling the hero
// away turns it into a finite element model: its mesh edges and the supports under its hooves
// appear, then it sways under an exaggerated load, coloured by how far each node has moved.
// It is a picture of the idea, not an analysis.

import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

// The meshed alpaca: no mesh edge longer than this share of its height, and its colour.
const MESH_SIZE = 0.1;
const MESH_GREY = "#d4d7db";

const stage = document.querySelector("[data-hero-stage]");
if (stage) init(stage);

// Splits the longest edge of a non-indexed triangle geometry, again and again, until none is
// longer than h. Splitting an edge splits every triangle on it, so the mesh stays conforming,
// and always splitting the longest one keeps the triangles' shapes. Colours are interpolated.
function refine(geo, h) {
  const p = geo.attributes.position.array;
  const c = geo.attributes.color ? geo.attributes.color.array : null;
  const verts = [];
  const ids = new Map();
  const vert = (x, y, z) => {
    const k = `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    if (!ids.has(k)) { ids.set(k, verts.length); verts.push([x, y, z]); }
    return ids.get(k);
  };
  // A triangle is its three vertices and the colours at its three corners.
  const tris = [];
  for (let i = 0; i < p.length; i += 9) {
    const v = [0, 1, 2].map((j) => vert(p[i + 3 * j], p[i + 3 * j + 1], p[i + 3 * j + 2]));
    const col = [0, 1, 2].map((j) => (c ? [c[i + 3 * j], c[i + 3 * j + 1], c[i + 3 * j + 2]] : [0.7, 0.7, 0.7]));
    if (v[0] !== v[1] && v[1] !== v[2] && v[2] !== v[0]) tris.push({ v, col, i: tris.length });
  }

  const key = (a, b) => (a < b ? a * 1e7 + b : b * 1e7 + a);
  const onEdge = new Map();
  const heap = []; // A max-heap of [length, a, b].
  const push = (e) => {
    heap.push(e);
    for (let i = heap.length - 1; i > 0;) {
      const up = (i - 1) >> 1;
      if (heap[up][0] >= heap[i][0]) break;
      [heap[up], heap[i]] = [heap[i], heap[up]];
      i = up;
    }
  };
  const pop = () => {
    const top = heap[0];
    const last = heap.pop();
    if (heap.length) {
      heap[0] = last;
      for (let i = 0; ;) {
        const l = 2 * i + 1, r = l + 1;
        let m = i;
        if (l < heap.length && heap[l][0] > heap[m][0]) m = l;
        if (r < heap.length && heap[r][0] > heap[m][0]) m = r;
        if (m === i) break;
        [heap[m], heap[i]] = [heap[i], heap[m]];
        i = m;
      }
    }
    return top;
  };
  const link = (t) => {
    for (let j = 0; j < 3; j++) {
      const a = t.v[j], b = t.v[(j + 1) % 3], k = key(a, b);
      if (!onEdge.has(k)) {
        onEdge.set(k, new Set());
        const len = Math.hypot(verts[a][0] - verts[b][0], verts[a][1] - verts[b][1], verts[a][2] - verts[b][2]);
        if (len > h) push([len, a, b]);
      }
      onEdge.get(k).add(t);
    }
  };
  const unlink = (t) => {
    for (let j = 0; j < 3; j++) onEdge.get(key(t.v[j], t.v[(j + 1) % 3])).delete(t);
  };
  tris.forEach(link);

  while (heap.length) {
    const [, a, b] = pop();
    const k = key(a, b);
    const on = onEdge.get(k);
    if (!on || !on.size) continue;
    const m = verts.length;
    verts.push([0, 1, 2].map((j) => (verts[a][j] + verts[b][j]) / 2));
    for (const t of [...on]) {
      // Turn the triangle so the split edge is its first one, then cut it from the midpoint
      // to the opposite corner.
      const j = t.v.findIndex((x, i) => key(x, t.v[(i + 1) % 3]) === k);
      const [P, Q, R] = [0, 1, 2].map((i) => t.v[(j + i) % 3]);
      const [cP, cQ, cR] = [0, 1, 2].map((i) => t.col[(j + i) % 3]);
      const cM = cP.map((x, i) => (x + cQ[i]) / 2);
      unlink(t);
      const t1 = { v: [P, m, R], col: [cP, cM, cR], i: t.i };
      const t2 = { v: [m, Q, R], col: [cM, cQ, cR], i: tris.length };
      tris[t.i] = t1;
      tris.push(t2);
      link(t1);
      link(t2);
    }
    onEdge.delete(k);
  }

  const pos = new Float32Array(tris.length * 9);
  const col = new Float32Array(tris.length * 9);
  tris.forEach((t, i) => {
    for (let j = 0; j < 3; j++) {
      pos.set(verts[t.v[j]], 9 * i + 3 * j);
      col.set(t.col[j], 9 * i + 3 * j);
    }
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  out.setAttribute("color", new THREE.BufferAttribute(col, 3));
  return out;
}

function init(stage) {
  const legend = stage.querySelector(".hero-legend");
  const hud = [...stage.querySelectorAll(".hero-hud li")];
  const hero = stage.closest(".hero") || stage;
  const pin = stage.closest("[data-hero-pin]");
  const hint = hero.querySelector(".scroll-hint");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) {
    return; // No WebGL: the poster stays.
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  stage.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1, 1, 2000);

  scene.add(new THREE.HemisphereLight(0xffffff, 0xb9bcc2, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(40, 90, 70);
  scene.add(sun);
  const rim = new THREE.DirectionalLight(0xffffff, 0.8);
  rim.position.set(-60, 30, -50);
  scene.add(rim);

  // The Alpaca4d contour: dark blue, light blue, light green, orange, red.
  const stops = ["#011efe", "#4288f7", "#afc930", "#eb6c3f", "#fe0000"].map((c) => new THREE.Color(c));
  const contour = (t, out) => {
    const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
    const i = Math.floor(x);
    return out.copy(stops[i]).lerp(stops[i + 1], x - i);
  };

  const pivot = new THREE.Group();
  scene.add(pivot);

  const smooth = (a, b, x) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  let model = null;

  new GLTFLoader().load(stage.dataset.model, (gltf) => {
    let src = null;
    gltf.scene.traverse((o) => { if (o.isMesh && !src) src = o; });
    if (!src) return;

    src.updateWorldMatrix(true, false);
    let geo = src.geometry.clone().applyMatrix4(src.matrixWorld).toNonIndexed();
    geo.computeBoundingBox();
    // A denser mesh than the low-poly model, for the finite element look. The faces stay flat,
    // so the alpaca looks the same until it is meshed.
    geo = refine(geo, geo.boundingBox.getSize(new THREE.Vector3()).y * MESH_SIZE);
    geo.computeBoundingBox();
    const bb = geo.boundingBox;
    const size = bb.getSize(new THREE.Vector3());
    const centre = bb.getCenter(new THREE.Vector3());
    geo.translate(-centre.x, -bb.min.y, -centre.z);
    const H = size.y;
    const W = Math.max(size.x, size.z);

    const rest = geo.attributes.position.array.slice();
    const restColour = geo.attributes.color ? geo.attributes.color.array.slice() : null;
    const n = rest.length / 3;
    if (!restColour) geo.setAttribute("color", new THREE.BufferAttribute(new Float32Array(n * 3).fill(0.7), 3));
    const colours = geo.attributes.color;
    const base = restColour || colours.array.slice();

    const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true,
      flatShading: true,
      roughness: 0.55,
      metalness: 0.05,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    }));

    // Mesh edges, kept as the indices of the triangle corners they join so they bend with it.
    const edgeIdx = [];
    const seen = new Set();
    const key = (i) => `${rest[3 * i].toFixed(3)},${rest[3 * i + 1].toFixed(3)},${rest[3 * i + 2].toFixed(3)}`;
    const nodeKeys = new Set();
    for (let t = 0; t < n; t += 3) {
      for (const [a, b] of [[t, t + 1], [t + 1, t + 2], [t + 2, t]]) {
        const ka = key(a), kb = key(b);
        nodeKeys.add(ka);
        const k = ka < kb ? ka + "|" + kb : kb + "|" + ka;
        if (!seen.has(k)) { seen.add(k); edgeIdx.push(a, b); }
      }
    }
    const meshLabel = stage.querySelector('[data-hud="mesh"]');
    const count = (x) => x.toLocaleString("en").replace(/,/g, " ");
    if (meshLabel) meshLabel.textContent = `${count(n / 3)} triangles · ${count(nodeKeys.size)} nodes`;
    const edgePos = new Float32Array(edgeIdx.length * 3);
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute("position", new THREE.BufferAttribute(edgePos, 3));
    const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x2a2d31, transparent: true, opacity: 0 }));

    // Supports: one green pyramid under each hoof. The hooves are the lowest vertices, sorted
    // into four groups by k-means from the four corners of their footprint.
    const low = [];
    for (let i = 0; i < n; i++) if (rest[3 * i + 1] < H * 0.03) low.push([rest[3 * i], rest[3 * i + 2]]);
    let xs = low.map((p) => p[0]), zs = low.map((p) => p[1]);
    let seeds = [[Math.min(...xs), Math.min(...zs)], [Math.min(...xs), Math.max(...zs)], [Math.max(...xs), Math.min(...zs)], [Math.max(...xs), Math.max(...zs)]];
    for (let it = 0; it < 8; it++) {
      const acc = seeds.map(() => [0, 0, 0]);
      low.forEach((p) => {
        let best = 0, bd = Infinity;
        seeds.forEach((s, j) => { const d = (p[0] - s[0]) ** 2 + (p[1] - s[1]) ** 2; if (d < bd) { bd = d; best = j; } });
        acc[best][0] += p[0]; acc[best][1] += p[1]; acc[best][2]++;
      });
      seeds = seeds.map((s, j) => (acc[j][2] ? [acc[j][0] / acc[j][2], acc[j][1] / acc[j][2]] : s));
    }
    const supports = new THREE.Group();
    const pyramid = new THREE.ConeGeometry(W * 0.06, W * 0.075, 4);
    pyramid.translate(0, -W * 0.0375, 0);
    const supportMat = new THREE.MeshStandardMaterial({ color: 0xafc930, roughness: 0.6, flatShading: true });
    const supportEdge = new THREE.LineBasicMaterial({ color: 0x2a2d31 });
    seeds.forEach(([x, z]) => {
      const s = new THREE.Mesh(pyramid, supportMat);
      s.add(new THREE.LineSegments(new THREE.EdgesGeometry(pyramid), supportEdge));
      s.position.set(x, 0, z);
      s.rotation.y = Math.PI / 4;
      s.scale.setScalar(0.0001);
      supports.add(s);
    });

    // A soft shadow on the floor.
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(64, 64, 4, 64, 64, 64);
    grad.addColorStop(0, "rgba(42,45,49,0.28)");
    grad.addColorStop(1, "rgba(42,45,49,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.5, W * 1.5), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -W * 0.075;

    const body = new THREE.Group();
    body.add(mesh, edges, supports, shadow);
    body.position.y = -H * 0.5;
    pivot.add(body);

    // The displacement each vertex gets at full load: a sway that grows with height like a
    // cantilever's, with a little sideways twist so it reads in 3D.
    const disp = new Float32Array(n * 3);
    let maxU = 0;
    for (let i = 0; i < n; i++) {
      const y = rest[3 * i + 1] / H;
      const ux = 0.16 * H * y * y;
      const uz = 0.05 * H * y * y * y;
      const uy = -0.03 * H * y * y;
      disp[3 * i] = ux; disp[3 * i + 1] = uy; disp[3 * i + 2] = uz;
      maxU = Math.max(maxU, Math.hypot(ux, uy, uz));
    }
    const tint = new Float32Array(n * 3);
    const tmp = new THREE.Color();
    const grey = new THREE.Color(MESH_GREY);
    for (let i = 0; i < n; i++) {
      contour(Math.hypot(disp[3 * i], disp[3 * i + 1], disp[3 * i + 2]) / maxU, tmp);
      tint[3 * i] = tmp.r; tint[3 * i + 1] = tmp.g; tint[3 * i + 2] = tmp.b;
    }

    model = {
      apply(p) {
        // Mesh (the colours turn grey), then supports, then the results; the last stretch of
        // the pin holds the finished picture before the page moves on.
        const edgeK = smooth(0.02, 0.22, p);
        const supportK = smooth(0.2, 0.4, p);
        const colourK = smooth(0.4, 0.58, p);
        const loadK = smooth(0.45, 0.86, p);
        const pos = geo.attributes.position.array;
        const col = colours.array;
        const greyRGB = [grey.r, grey.g, grey.b];
        for (let i = 0; i < n * 3; i++) {
          pos[i] = rest[i] + disp[i] * loadK;
          const meshed = base[i] + (greyRGB[i % 3] - base[i]) * edgeK;
          col[i] = meshed + (tint[i] - meshed) * colourK;
        }
        for (let j = 0; j < edgeIdx.length; j++) {
          const v = edgeIdx[j];
          edgePos[3 * j] = pos[3 * v]; edgePos[3 * j + 1] = pos[3 * v + 1]; edgePos[3 * j + 2] = pos[3 * v + 2];
        }
        geo.attributes.position.needsUpdate = true;
        colours.needsUpdate = true;
        edgeGeo.attributes.position.needsUpdate = true;
        edges.material.opacity = 0.75 * edgeK;
        edges.visible = edgeK > 0.001;
        supports.children.forEach((s, j) => {
          const k = smooth(j * 0.12, 0.64 + j * 0.12, supportK);
          s.scale.setScalar(Math.max(0.0001, k * (1 + 0.25 * Math.sin(k * Math.PI))));
        });
        if (legend) legend.classList.toggle("show", colourK > 0.6);
        [[0.01, edgeK], [0.2, supportK], [0.4, loadK]].forEach(([from, k], i) => {
          if (!hud[i]) return;
          hud[i].classList.toggle("on", p > from);
          hud[i].classList.toggle("done", k > 0.99);
        });
        if (hint) hint.classList.toggle("gone", p > 0.03);
      },
    };

    const radius = Math.hypot(size.x, size.y, size.z) * 0.5;
    model.radius = radius;
    fit();
    model.apply(scrollP());
    renderer.render(scene, camera);
    stage.classList.add("ready");
    start();
  });

  // ---- Framing, pointer and scroll ----
  let lastP = -1;
  let width = 1, height = 1;
  function fit() {
    const r = stage.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    const radius = model ? model.radius : 40;
    const fov = THREE.MathUtils.degToRad(camera.fov);
    const fitH = radius / Math.sin(fov / 2);
    const fitW = radius / Math.sin(Math.atan(Math.tan(fov / 2) * camera.aspect));
    const dist = Math.max(fitH, fitW) * 0.76;
    camera.position.set(0, radius * 0.24, dist);
    camera.lookAt(0, -radius * 0.08, 0);
    camera.near = dist / 20;
    camera.far = dist * 4;
    camera.updateProjectionMatrix();
    lastP = -1;
  }
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(stage);
  else window.addEventListener("resize", fit);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  }, { passive: true });

  // How far through its pin the hero is: 0 as it pins, 1 as it lets go. Without a pin, the
  // first half of the hero's height.
  const scrollP = () => {
    if (!pin) return Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.5)));
    const top = parseFloat(getComputedStyle(hero).top) || 0;
    const run = Math.max(1, pin.offsetHeight - hero.offsetHeight);
    return Math.min(1, Math.max(0, (top - pin.getBoundingClientRect().top) / run));
  };

  let visible = true;
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      start();
    }).observe(stage);
  }
  document.addEventListener("visibilitychange", start);

  let yaw = -0.5;
  let last = 0;
  let running = false;
  function start() {
    if (running || !model || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(frame);
  }
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    last = now;
    const p = scrollP();
    if (Math.abs(p - lastP) > 0.0005) { model.apply(p); lastP = p; }
    if (!reduceMotion) {
      yaw += dt * 0.28;
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
    }
    pivot.rotation.y = yaw + pointer.x * 0.35;
    pivot.rotation.x = pointer.y * 0.08;
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
}
