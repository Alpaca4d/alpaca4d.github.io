// The scroll story: a corner-supported concrete shell goes through the four steps of an
// Alpaca4d model as the text beside it scrolls by - drawn, meshed, supported and loaded,
// analysed, then explored as a family of designs. The deflected shape is a smooth stand-in,
// zero at the supports and largest at the crown and the free edges, not a solved result.

import * as THREE from "three";

const section = document.querySelector("[data-story]");
if (section) init(section);

function init(section) {
  const holder = section.querySelector(".story-canvas");
  const steps = [...section.querySelectorAll(".story-step")];
  const bar = section.querySelector(".story-hud .progress i");
  const tag = section.querySelector(".story-hud .tag");
  const legend = section.querySelector(".story-hud .legend");
  const explore = section.querySelector(".story-hud .explore");
  const count = section.querySelector(".story-hud .count");
  const plot = section.querySelector(".story-hud .explore svg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const names = steps.map((s) => s.dataset.tag || "");

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  } catch (e) {
    holder.classList.add("no-webgl");
    return;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  holder.appendChild(renderer.domElement);
  renderer.domElement.setAttribute("aria-hidden", "true");

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.05, 50);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x30343a, 1.5));
  const key = new THREE.DirectionalLight(0xffffff, 2.0);
  key.position.set(2.5, 4, 3);
  scene.add(key);
  const fill = new THREE.DirectionalLight(0x9fc0ff, 0.6);
  fill.position.set(-3, 1.5, -2);
  scene.add(fill);

  const grid = new THREE.GridHelper(5, 25, 0x464b53, 0x31353b);
  grid.position.y = -0.002;
  scene.add(grid);

  const C = (h) => new THREE.Color(h);
  const stops = ["#011efe", "#4288f7", "#afc930", "#eb6c3f", "#fe0000"].map(C);
  const contour = (t, out) => {
    const x = Math.min(0.9999, Math.max(0, t)) * (stops.length - 1);
    const i = Math.floor(x);
    return out.copy(stops[i]).lerp(stops[i + 1], x - i);
  };
  const shellBlue = C("#4288f7");
  const sketch = C("#c9ced6");

  // ---- The shell: a square plan, 2 x 2, sampled N x N ----
  const N = 32;
  const S = 1;
  const count1 = (N + 1) * (N + 1);
  const uv = new Float32Array(count1 * 2);
  for (let j = 0, k = 0; j <= N; j++) {
    for (let i = 0; i <= N; i++, k++) {
      uv[2 * k] = -1 + (2 * i) / N;
      uv[2 * k + 1] = -1 + (2 * j) / N;
    }
  }
  const pos = new THREE.BufferAttribute(new Float32Array(count1 * 3), 3);
  const col = new THREE.BufferAttribute(new Float32Array(count1 * 3), 3);
  const tri = [];
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const a = j * (N + 1) + i, b = a + 1, c = a + N + 1, d = c + 1;
      tri.push(a, c, b, b, c, d);
    }
  }
  const surfGeo = new THREE.BufferGeometry();
  surfGeo.setAttribute("position", pos);
  surfGeo.setAttribute("color", col);
  surfGeo.setIndex(tri);
  const surfMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    side: THREE.DoubleSide,
    roughness: 0.6,
    metalness: 0.05,
    transparent: true,
    opacity: 0,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  });
  const surface = new THREE.Mesh(surfGeo, surfMat);
  scene.add(surface);

  // Grid lines sharing the surface's positions: every 8th line is a Rhino isocurve, all of them
  // together are the mesh of shell elements.
  const lines = (every) => {
    const idx = [];
    for (let j = 0; j <= N; j++) {
      for (let i = 0; i <= N; i++) {
        const a = j * (N + 1) + i;
        if (i < N && j % every === 0) idx.push(a, a + 1);
        if (j < N && i % every === 0) idx.push(a, a + N + 1);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", pos);
    g.setIndex(idx);
    return g;
  };
  const iso = new THREE.LineSegments(lines(8), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0 }));
  const meshLines = new THREE.LineSegments(lines(2), new THREE.LineBasicMaterial({ color: 0x15171a, transparent: true, opacity: 0 }));
  scene.add(iso, meshLines);

  const nodes = new THREE.Points(
    (() => { const g = new THREE.BufferGeometry(); g.setAttribute("position", pos); g.setIndex([...Array(count1).keys()].filter((k) => (k % (N + 1)) % 2 === 0 && Math.floor(k / (N + 1)) % 2 === 0)); return g; })(),
    new THREE.PointsMaterial({ color: 0xffffff, size: 0.028, transparent: true, opacity: 0 })
  );
  scene.add(nodes);

  // Supports at the four corners: the green pyramid of the Support component.
  const supports = new THREE.Group();
  const pyr = new THREE.ConeGeometry(0.085, 0.12, 4);
  pyr.translate(0, -0.06, 0);
  const supMat = new THREE.MeshStandardMaterial({ color: 0xafc930, flatShading: true, roughness: 0.5 });
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([x, z]) => {
    const m = new THREE.Mesh(pyr, supMat);
    m.add(new THREE.LineSegments(new THREE.EdgesGeometry(pyr), new THREE.LineBasicMaterial({ color: 0x15171a })));
    m.position.set(x * S, 0, z * S);
    m.rotation.y = Math.PI / 4;
    supports.add(m);
  });
  scene.add(supports);

  // Load arrows: a 6 x 6 field of red arrows pointing down, as Model View draws a load.
  const A = 6;
  const arrowPts = [];
  for (let j = 0; j < A; j++) for (let i = 0; i < A; i++) arrowPts.push([-0.8 + (1.6 * i) / (A - 1), -0.8 + (1.6 * j) / (A - 1)]);
  const shaftGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.26, 6);
  shaftGeo.translate(0, 0.13 + 0.07, 0);
  const headGeo = new THREE.ConeGeometry(0.03, 0.07, 10);
  headGeo.rotateX(Math.PI);
  headGeo.translate(0, 0.035, 0);
  const red = new THREE.MeshBasicMaterial({ color: 0xfe0000, transparent: true, opacity: 0 });
  const shafts = new THREE.InstancedMesh(shaftGeo, red, arrowPts.length);
  const heads = new THREE.InstancedMesh(headGeo, red, arrowPts.length);
  scene.add(shafts, heads);

  // ---- Shapes ----
  // Rise of the shell over the plan: zero at the corners, half at the edge midpoints.
  const shape = (x, z, rise) => rise * 0.5 * (Math.cos((Math.PI * x) / 2) + Math.cos((Math.PI * z) / 2));
  // Deflection, normalised to 1 at the crown: zero at the corners, a little less at the edges.
  const sag = (x, z) => (1 - x * x * z * z) * (0.55 + 0.45 * (1 - x * x) * (1 - z * z));

  // A design study: rise and thickness picked with a Halton sequence, each design's mass and
  // crown deflection from simple rules of thumb - more rise or thickness, less deflection.
  const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
  const designs = [];
  for (let i = 1; i <= 64; i++) {
    const rise = 0.32 + 0.6 * halton(i, 2);
    const thick = 0.6 + 0.8 * halton(i, 3);
    const mass = thick * (1 + 0.35 * rise * rise);
    const defl = 1 / (rise * Math.pow(thick, 1.6));
    designs.push({ rise, thick, mass, defl });
  }
  const dMin = Math.min(...designs.map((d) => d.defl)), dMax = Math.max(...designs.map((d) => d.defl));
  const mMin = Math.min(...designs.map((d) => d.mass)), mMax = Math.max(...designs.map((d) => d.mass));
  const baseDesign = { rise: 0.62, thick: 1 };

  // The little Explorer chart: mass across, deflection up, one dot per design as it is recorded.
  const dots = [];
  if (plot) {
    const ns = "http://www.w3.org/2000/svg";
    const W = 240, H = 150, pad = 18;
    plot.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const axis = document.createElementNS(ns, "path");
    axis.setAttribute("d", `M${pad},${pad - 6} V${H - pad} H${W - 8}`);
    axis.setAttribute("stroke", "rgba(255,255,255,.35)");
    axis.setAttribute("fill", "none");
    plot.append(axis);
    const lab = (t, x, y, anchor) => {
      const e = document.createElementNS(ns, "text");
      e.textContent = t;
      e.setAttribute("x", x); e.setAttribute("y", y);
      e.setAttribute("fill", "rgba(255,255,255,.55)");
      e.setAttribute("font-size", "9");
      e.setAttribute("font-family", "Overpass Mono, monospace");
      if (anchor) e.setAttribute("text-anchor", anchor);
      plot.append(e);
    };
    lab("mass →", W - 8, H - 5, "end");
    lab("deflection ↑", pad + 4, 10);
    const tmpC = new THREE.Color();
    designs.forEach((d) => {
      const c = document.createElementNS(ns, "circle");
      const x = pad + 6 + ((d.mass - mMin) / (mMax - mMin)) * (W - pad - 20);
      const y = H - pad - 6 - ((d.defl - dMin) / (dMax - dMin)) * (H - 2 * pad - 6);
      c.setAttribute("cx", x.toFixed(1)); c.setAttribute("cy", y.toFixed(1)); c.setAttribute("r", "3.2");
      c.setAttribute("fill", "#" + contour((d.defl - dMin) / (dMax - dMin), tmpC).getHexString());
      c.style.opacity = "0";
      c.style.transition = "opacity .2s, r .2s";
      plot.append(c);
      dots.push(c);
    });
  }

  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const lerp = (a, b, t) => a + (b - a) * t;
  const tmp = new THREE.Color();
  const tmp2 = new THREE.Color();
  const m4 = new THREE.Matrix4();

  // ---- Everything the scene shows at a story progress p, 0 to 1 over the four steps ----
  let shown = -1;
  function apply(p) {
    const s1 = smooth(0.0, 0.2, p);   // draw
    const s2 = smooth(0.2, 0.3, p);   // mesh
    const sSup = smooth(0.27, 0.4, p);
    const sLoad = smooth(0.3, 0.47, p);
    const sDef = smooth(0.52, 0.7, p);
    const sCol = smooth(0.5, 0.62, p);
    const sExp = smooth(0.76, 0.98, p);

    // Which design is on show: the base one until Explore, then one after another.
    let rise = baseDesign.rise, thick = baseDesign.thick, amp = 1;
    let recorded = 0;
    if (p > 0.76) {
      const f = sExp * (designs.length - 1);
      const i = Math.floor(f), t = f - i;
      const a = designs[i], b = designs[Math.min(designs.length - 1, i + 1)];
      const k = t * t * (3 - 2 * t);
      rise = lerp(lerp(baseDesign.rise, a.rise, Math.min(1, sExp * 8)), b.rise, k);
      thick = lerp(lerp(baseDesign.thick, a.thick, Math.min(1, sExp * 8)), b.thick, k);
      recorded = i + 1;
    }
    amp = 1 / (rise * Math.pow(thick, 1.6)) / (1 / (baseDesign.rise * Math.pow(baseDesign.thick, 1.6)));
    // Drawn deflection grows with the square root of the real ratio, so the floppiest design
    // still reads as a shell rather than a hammock.
    const defScale = 0.11 * sDef * Math.sqrt(amp);
    // While exploring, the colours share one range across all designs, as Explorer's would.
    const sameRange = Math.min(1, amp / (dMax / (1 / (baseDesign.rise * Math.pow(baseDesign.thick, 1.6)))));
    const scaleT = lerp(1, sameRange, smooth(0.76, 0.8, p));

    const P = pos.array, Co = col.array;
    for (let k = 0; k < count1; k++) {
      const x = uv[2 * k], z = uv[2 * k + 1];
      const w = sag(x, z);
      const y = shape(x, z, rise) - defScale * w;
      P[3 * k] = x * S; P[3 * k + 1] = y; P[3 * k + 2] = z * S;
      // Grey sketch, then the shell blue of Model View, then the displacement contour.
      tmp.copy(sketch).lerp(shellBlue, s2);
      contour(w * scaleT, tmp2);
      tmp.lerp(tmp2, sCol);
      Co[3 * k] = tmp.r; Co[3 * k + 1] = tmp.g; Co[3 * k + 2] = tmp.b;
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
    surfGeo.computeVertexNormals();
    surfGeo.computeBoundingSphere();

    surfMat.opacity = lerp(0, 0.3, s1) + 0.7 * s2;
    surfMat.depthWrite = s2 > 0.5;
    iso.material.opacity = s1 * (1 - 0.85 * s2);
    meshLines.material.opacity = 0.55 * s2;
    nodes.material.opacity = 0.9 * s2 * (1 - sCol * 0.8);

    supports.children.forEach((m, i) => {
      const k = smooth(i * 0.15, 0.55 + i * 0.15, sSup);
      m.scale.setScalar(Math.max(0.0001, k * (1 + 0.3 * Math.sin(k * Math.PI))));
      const x = Math.sign(m.position.x), z = Math.sign(m.position.z);
      m.position.y = shape(x, z, rise);
    });

    const loadOut = smooth(0.62, 0.72, p);
    red.opacity = sLoad * (1 - loadOut);
    shafts.visible = heads.visible = red.opacity > 0.01;
    arrowPts.forEach(([x, z], i) => {
      const delay = ((i * 7) % arrowPts.length) / arrowPts.length;
      const k = smooth(delay * 0.5, 0.5 + delay * 0.5, sLoad);
      const surfaceY = shape(x, z, rise) - defScale * sag(x, z);
      const y = surfaceY + 0.01 + (1 - k) * 0.9;
      m4.makeTranslation(x * S, y, z * S);
      shafts.setMatrixAt(i, m4);
      heads.setMatrixAt(i, m4);
    });
    shafts.instanceMatrix.needsUpdate = true;
    heads.instanceMatrix.needsUpdate = true;

    // HUD
    if (bar) bar.style.width = (p * 100).toFixed(1) + "%";
    const step = Math.min(steps.length - 1, Math.floor(p * steps.length + 0.02));
    if (tag && names[step]) tag.textContent = names[step];
    if (legend) legend.classList.toggle("show", sCol > 0.5);
    if (explore) explore.classList.toggle("show", p > 0.76);
    if (count) count.textContent = `Design ${String(Math.max(1, recorded)).padStart(2, "0")} of ${designs.length}`;
    if (recorded !== shown) {
      dots.forEach((d, i) => {
        d.style.opacity = i < recorded ? (i === recorded - 1 ? "1" : "0.75") : "0";
        d.setAttribute("r", i === recorded - 1 ? "5.5" : "3.2");
        d.setAttribute("stroke", i === recorded - 1 ? "#fff" : "none");
      });
      shown = recorded;
    }
    return step;
  }

  // ---- Progress through the pin: 0 as it pins, 1 a little before it lets go, so the last
  // design stays on screen for a moment before the page moves on ----
  const pin = section.querySelector(".story-pin");
  const sticky = section.querySelector(".story-sticky");
  function progress() {
    const top = parseFloat(getComputedStyle(sticky).top) || 0;
    const run = Math.max(1, pin.offsetHeight - sticky.offsetHeight);
    const raw = (top - pin.getBoundingClientRect().top) / run;
    return Math.min(1, Math.max(0, raw / 0.93));
  }

  let width = 1, height = 1;
  function fit() {
    const r = holder.getBoundingClientRect();
    width = Math.max(1, r.width);
    height = Math.max(1, r.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  if ("ResizeObserver" in window) new ResizeObserver(fit).observe(holder);
  else window.addEventListener("resize", fit);

  let visible = false;
  let dirty = true;
  let running = false;
  let current = -1;
  let shownP = -1;
  let t0 = performance.now();

  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const target = reduceMotion ? stepSnap(progress()) : progress();
    // Ease towards the scroll position so a flick of the wheel still animates.
    const p = shownP < 0 ? target : shownP + (target - shownP) * 0.16;
    if (Math.abs(p - shownP) > 0.0002 || dirty) {
      const step = apply(p);
      shownP = p;
      dirty = false;
      if (step !== current) {
        steps.forEach((s, i) => s.classList.toggle("active", i === step));
        current = step;
      }
    }
    // Camera: a slow orbit across the story, closer while the results are on.
    const t = (now - t0) / 1000;
    const az = THREE.MathUtils.degToRad(lerp(28, 118, shownP) + (reduceMotion ? 0 : Math.sin(t * 0.25) * 3));
    const el = THREE.MathUtils.degToRad(lerp(30, 24, smooth(0.5, 0.8, shownP)));
    // Far enough for a sphere round the shell and its supports to fit the narrower of the two
    // fields of view, a little closer while the results are on.
    const vHalf = THREE.MathUtils.degToRad(camera.fov / 2);
    const hHalf = Math.atan(Math.tan(vHalf) * camera.aspect);
    // While exploring, back out a little and raise the shell, clear of the chart and legend.
    const exploring = smooth(0.72, 0.84, shownP);
    const dist = (1.5 / Math.sin(Math.min(vHalf, hHalf))) * lerp(lerp(1.0, 0.9, smooth(0.45, 0.7, shownP)), 1.08, exploring);
    camera.position.set(Math.sin(az) * Math.cos(el) * dist, Math.sin(el) * dist + 0.1, Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(0, lerp(0.22, -0.12, exploring), 0);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  const stepSnap = (p) => (Math.floor(p * steps.length) + 0.999) / steps.length;

  function start() {
    if (running || !visible || document.hidden) return;
    running = true;
    requestAnimationFrame(frame);
  }
  if ("IntersectionObserver" in window) {
    new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; start(); }, { rootMargin: "200px 0px" }).observe(section);
  } else {
    visible = true;
  }
  document.addEventListener("visibilitychange", start);
  fit();
  apply(0);
  steps[0]?.classList.add("active");
  start();
}
