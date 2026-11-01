// The parts every page shares - header, footer, menu - and the scroll effects that need no
// WebGL. A page says where the site root is with <body data-root="../"> and which nav entry is
// its own with data-page.

(function () {
  const body = document.body;
  const root = body.dataset.root || "./";
  const page = body.dataset.page || "";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // The docs are on GitBook. In the local preview the VitePress docs (docs-prototype branch) are
  // served at /docs/, and every GitBook link goes there instead.
  const docs = "https://alpaca4d.gitbook.io/docs";
  const localDocs = ["localhost", "127.0.0.1"].includes(location.hostname);
  const toLocalDocs = (href) =>
    root + "docs/" + href.slice(docs.length).replace(/^\//, "").replace(/^examples\/([^/#]+)/, "examples/$1/$1");

  // Features and About us are links; Learn and Tools open a menu of pages. Each page's icon and
  // colour are the ones of its card on the home page.
  const nav = [
    { id: "features", label: "Features", href: root + "index.html#features" },
    { id: "learn", label: "Learn", items: [
      { id: "docs", label: "Docs", note: "Every component, with its inputs and outputs", href: docs, icon: "legend", c: "blue" },
      { id: "examples", label: "Examples", note: "Grasshopper files to open and take apart", href: root + "index.html#examples", icon: "shell", c: "green" },
      { id: "workshop", label: "Workshop", note: "A day online with the developer", href: root + "workshop.html", icon: "supporter", c: "orange" },
    ] },
    { id: "tools", label: "Tools", items: [
      { id: "explorer", label: "Explorer", note: "Compare design studies in your browser", href: root + "explorer/", icon: "explorer", c: "purple" },
      { id: "playground", label: "Playground", note: "Coming soon", href: root + "playground.html", c: "white" },
    ] },
    { id: "about", label: "About us", href: root + "about/" },
  ];
  const current = (id) => (id === page ? ' aria-current="page"' : "");
  const navLink = (n) => `<a href="${n.href}"${current(n.id)}>${n.label}</a>`;
  const navGroup = (g) => `
    <div class="nav-group${g.items.some((i) => i.id === page) ? " current" : ""}">
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-${g.id}">${g.label}<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 6 8l3.5-3.5"/></svg></button>
      <div class="nav-menu" id="nav-${g.id}">
        ${g.items.map((i) => `<a href="${i.href}"${current(i.id)}><span class="nav-icon" style="--c: var(--${i.c})"><img src="${root}assets/site/img/${i.icon ? `icons/${i.icon}.svg` : "logo.png"}" alt=""></span><span><b>${i.label}</b><small>${i.note}</small></span></a>`).join("")}
      </div>
    </div>`;

  const icons = {
    mail: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.82-.26.82-.57v-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.94 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.92.42.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3"/></svg>',
  };

  // ---- Header ----
  const header = document.getElementById("site-header");
  if (header) {
    header.innerHTML = `
      <div class="wrap">
        <a class="brand" href="${root}index.html" aria-label="Alpaca4d home">
          <img src="${root}assets/site/img/logo.png" alt="" width="34" height="41">
          <span>Alpaca4d</span>
        </a>
        <nav class="nav" id="site-nav" aria-label="Main">
          ${nav.map((n) => (n.items ? navGroup(n) : navLink(n))).join("")}
        </nav>
        <div class="nav-cta">
          <a class="btn btn-small" href="${root}buy.html">Buy</a>
          <a class="btn btn-small btn-primary" href="${root}download.html">Download</a>
        </div>
        <button class="burger" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav"><span></span><span></span><span></span></button>
      </div>`;

    // Learn and Tools: a click opens the menu; a click elsewhere, Escape or tabbing away closes
    // it. In the phone menu they open in place, the one holding this page already open.
    const groups = [...header.querySelectorAll(".nav-group")];
    const setGroup = (g, open) => {
      g.classList.toggle("open", open);
      g.querySelector(".nav-toggle").setAttribute("aria-expanded", String(open));
    };
    groups.forEach((g) => {
      g.querySelector(".nav-toggle").addEventListener("click", () => {
        const open = !g.classList.contains("open");
        groups.forEach((o) => setGroup(o, o === g && open));
      });
      g.addEventListener("focusout", (e) => {
        if (!body.classList.contains("menu-open") && !g.contains(e.relatedTarget)) setGroup(g, false);
      });
    });
    document.addEventListener("click", (e) => {
      if (!body.classList.contains("menu-open") && !e.target.closest(".nav-group")) groups.forEach((g) => setGroup(g, false));
    });

    const burger = header.querySelector(".burger");
    const setMenu = (open) => {
      body.classList.toggle("menu-open", open);
      burger.setAttribute("aria-expanded", String(open));
      groups.forEach((g) => setGroup(g, open && g.classList.contains("current")));
    };
    burger.addEventListener("click", () => setMenu(!body.classList.contains("menu-open")));
    header.querySelectorAll(".nav a, .nav-cta a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      const open = document.activeElement && document.activeElement.closest(".nav-group.open");
      setMenu(false);
      if (open) open.querySelector(".nav-toggle").focus();
    });

    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // ---- Footer ----
  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">
            <a class="brand" href="${root}index.html"><img src="${root}assets/site/img/logo.png" alt="" width="34" height="41"><span>Alpaca4d</span></a>
            <p>OpenSees for Grasshopper. Structural analysis that keeps up with parametric design.</p>
            <div class="socials">
              <a href="mailto:alpaca4d@gmail.com" aria-label="Email alpaca4d@gmail.com">${icons.mail}</a>
              <a href="https://www.linkedin.com/company/alpaca4d/" aria-label="Alpaca4d on LinkedIn" rel="noopener">${icons.linkedin}</a>
              <a href="https://github.com/Alpaca4d/Alpaca4d/issues/new" aria-label="Ask for help on GitHub" rel="noopener">${icons.github}</a>
            </div>
          </div>
          <div>
            <h4>Product</h4>
            <ul>
              <li><a href="${root}download.html">Download</a></li>
              <li><a href="${root}buy.html">Buy a license</a></li>
              <li><a href="${root}explorer/">Explorer</a></li>
              <li><a href="${root}playground.html">Playground</a></li>
            </ul>
          </div>
          <div>
            <h4>Learn</h4>
            <ul>
              <li><a href="${docs}">Documentation</a></li>
              <li><a href="${docs}/examples/multi-storey-building">Examples</a></li>
              <li><a href="${root}workshop.html">Workshop</a></li>
              <li><a href="${docs}/benchmark/intro">Benchmarks</a></li>
              <li><a href="${docs}/references/publications">Publications</a></li>
            </ul>
          </div>
          <div>
            <h4>Project</h4>
            <ul>
              <li><a href="${root}about/">About us</a></li>
              <li><a href="${root}about/#thanks">Supporters</a></li>
              <li><a href="mailto:alpaca4d@gmail.com">Contact</a></li>
              <li><a href="https://github.com/Alpaca4d/Alpaca4d/issues/new" rel="noopener">Report an issue</a></li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li><a href="${docs}/references/license">License</a></li>
              <li><a href="${docs}/references/opensees">OpenSees terms</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2020–${new Date().getFullYear()} Alpaca4d. Made with ❤️ by engineers.</p>
          <p>Alpaca4d is an independent project. It is not affiliated with, endorsed by, or sponsored by the University of California, Berkeley or the OpenSees developers.</p>
        </div>
      </div>`;
  }

  if (localDocs) document.querySelectorAll(`a[href^="${docs}"]`).forEach((a) => (a.href = toLocalDocs(a.getAttribute("href"))));

  // ---- Page colour: each shown section names its colour in data-bg. Around the edge between two
  // sections, over a band 60% of the screen high centred on the middle of the screen, the page is
  // the colour in between, following the scroll; mixed in OKLab, so blue to green stays bright.
  // The text takes the nearer section's colours (body[data-bg], in site.css). ----
  const scenes = [...document.querySelectorAll("[data-bg]:not([hidden])")];
  if (scenes.length) {
    body.classList.add("scroll-colours");
    const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
    const toGamma = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
    const toOklab = (hex) => {
      const [r, g, b] = [1, 3, 5].map((i) => toLinear(parseInt(hex.slice(i, i + 2), 16) / 255));
      const [l, m, s] = [
        0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b,
        0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b,
        0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b,
      ].map(Math.cbrt);
      return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
      ];
    };
    const toRgb = ([L, A, B]) => {
      const [l, m, s] = [L + 0.3963377774 * A + 0.2158037573 * B, L - 0.1055613458 * A - 0.0638541728 * B, L - 0.0894841775 * A - 1.291485548 * B].map((v) => v ** 3);
      const rgb = [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
      ];
      return `rgb(${rgb.map((c) => Math.round(255 * Math.min(1, Math.max(0, toGamma(c))))).join(",")})`;
    };
    const css = getComputedStyle(document.documentElement);
    const labs = scenes.map((s) => toOklab(css.getPropertyValue("--" + s.dataset.bg).trim()));
    let queued = false;
    const paint = () => {
      queued = false;
      const middle = innerHeight / 2, band = innerHeight * 0.6;
      let from = 0, t = 0;
      for (let k = 1; k < scenes.length; k++) {
        const edge = scenes[k].getBoundingClientRect().top;
        if (middle < edge - band / 2) break;
        if (middle < edge + band / 2) { from = k - 1; t = (middle - edge + band / 2) / band; break; }
        from = k;
      }
      const to = Math.min(from + 1, scenes.length - 1);
      body.style.backgroundColor = toRgb(labs[from].map((v, i) => v + (labs[to][i] - v) * t));
      const near = scenes[t < 0.5 ? from : to].dataset.bg;
      if (body.dataset.bg !== near) body.dataset.bg = near;
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(paint); } };
    addEventListener("scroll", queue, { passive: true });
    addEventListener("resize", queue);
    paint();
  }

  // ---- Grasshopper toolbar: the name and description of the icon under the pointer ----
  document.querySelectorAll("[data-ribbon]").forEach((win) => {
    const tip = win.querySelector(".rb-tip");
    const [name, panel, desc] = tip.children;
    const show = (item) => {
      name.textContent = item.dataset.name;
      panel.textContent = "Alpaca4d ▸ " + item.dataset.panel;
      desc.textContent = item.dataset.desc;
      tip.hidden = false;
      const r = item.getBoundingClientRect(), w = win.getBoundingClientRect();
      const left = r.left - w.left + r.width / 2 - tip.offsetWidth / 2;
      tip.style.left = Math.max(8, Math.min(left, w.width - tip.offsetWidth - 8)) + "px";
      tip.style.top = r.bottom - w.top + 10 + "px";
    };
    const hide = () => (tip.hidden = true);
    win.querySelectorAll(".rb-item").forEach((item) => {
      item.addEventListener("pointerenter", (e) => e.pointerType !== "touch" && show(item));
      item.addEventListener("pointerleave", hide);
      item.addEventListener("focus", () => show(item));
      item.addEventListener("blur", hide);
    });
    win.querySelector(".gh-ribbon").addEventListener("scroll", hide, { passive: true });
  });

  // ---- Reveal on scroll ----
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // ---- Numbers that count up once they are seen ----
  const counters = document.querySelectorAll("[data-count]");
  const runCounter = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const show = (v) => { el.textContent = v.toLocaleString("en-US") + suffix; };
    if (reduceMotion) { show(end); return; }
    const t0 = performance.now();
    const dur = 1400;
    const tick = (t) => {
      const k = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      show(Math.round(end * eased));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); io.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach((el) => io.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  // ---- Marquee: the track holds its items twice so the loop has no seam ----
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
    [...track.children].slice(track.children.length / 2).forEach((c) => c.setAttribute("aria-hidden", "true"));
  });

  // Progress of an element through the viewport: 0 when its top reaches `start` (a fraction
  // of the viewport height from the top), 1 when its bottom reaches `end`.
  const progressOf = (el, start, end) => {
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const from = r.top - vh * start;
    const span = r.height - vh * end + vh * start;
    return Math.min(1, Math.max(0, -from / Math.max(1, span)));
  };

  const scrollers = [];
  let ticking = false;
  const update = () => { ticking = false; scrollers.forEach((f) => f()); };
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);

  // ---- Grasshopper definition: wires draw themselves in as the section scrolls by ----
  document.querySelectorAll("[data-definition]").forEach((def) => {
    const svg = def.querySelector("svg.wires");
    const comps = [...def.querySelectorAll(".gh[data-id]")];
    const byId = Object.fromEntries(comps.map((c) => [c.dataset.id, c]));
    const links = (def.dataset.definition || "").split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
      const [from, to] = s.split(">");
      const [a, ai] = from.split(":");
      const [b, bi] = to.split(":");
      return { a, ai: Number(ai), b, bi: Number(bi) };
    });
    const ns = "http://www.w3.org/2000/svg";
    const paths = links.map(() => {
      const glow = document.createElementNS(ns, "path");
      glow.setAttribute("class", "glow");
      const p = document.createElementNS(ns, "path");
      svg.append(glow, p);
      return { p, glow, len: 0 };
    });

    const port = (comp, side, i) => {
      const spans = comp.querySelectorAll(`.gh-io.${side} span`);
      const s = spans[Math.min(i, spans.length - 1)];
      const box = def.getBoundingClientRect();
      const r = s.getBoundingClientRect();
      // Same offsets as the port circles in the CSS: 21 px outside the label, 5 px radius.
      const x = side === "out" ? r.right + 16 : r.left - 16;
      return { x: x - box.left, y: r.top + r.height / 2 - box.top };
    };

    const grid = def.querySelector(".def-grid");
    const nodes = [...grid.children];

    const layout = () => {
      const box = def.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
      const cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      const rows = nodes.map((n, i) => {
        const r = n.getBoundingClientRect();
        return { row: Math.floor(i / cols), top: r.top - box.top, bottom: r.bottom - box.top };
      });
      links.forEach((l, i) => {
        const A = port(byId[l.a], "out", l.ai);
        const B = port(byId[l.b], "in", l.bi);
        const ra = rows[nodes.indexOf(byId[l.a].closest(".node"))].row;
        const rb = rows[nodes.indexOf(byId[l.b].closest(".node"))].row;
        let d;
        if (B.x < A.x + 40 && rb > ra) {
          // Back to the start of the next row: loop out past the component, run along the
          // gap between the rows, and loop into the input, as a tidy canvas would.
          const gapY = (Math.max(...rows.filter((r) => r.row === ra).map((r) => r.bottom)) +
                        Math.min(...rows.filter((r) => r.row === rb).map((r) => r.top))) / 2;
          // The loops may reach into the page gutter, but not off the screen.
          const roomRight = document.documentElement.clientWidth - box.left - A.x - 8;
          const roomLeft = box.left + B.x - 8;
          const k = Math.max(16, Math.min(110, roomRight, roomLeft)) / 0.75;
          d = `M${A.x},${A.y} C${A.x + k},${A.y} ${A.x + k},${gapY} ${A.x},${gapY} L${B.x},${gapY} C${B.x - k},${gapY} ${B.x - k},${B.y} ${B.x},${B.y}`;
        } else {
          const dx = Math.max(60, Math.abs(B.x - A.x) * 0.5);
          d = `M${A.x},${A.y} C${A.x + dx},${A.y} ${B.x - dx},${B.y} ${B.x},${B.y}`;
        }
        paths[i].p.setAttribute("d", d);
        paths[i].glow.setAttribute("d", d);
        paths[i].len = paths[i].p.getTotalLength();
        [paths[i].p, paths[i].glow].forEach((el) => { el.style.strokeDasharray = `${paths[i].len}`; });
      });
      draw();
    };

    const draw = () => {
      const t = reduceMotion ? 1 : progressOf(def, 0.85, 0.55);
      const n = links.length;
      const lit = new Set([links[0]?.a]);
      links.forEach((l, i) => {
        const k = Math.min(1, Math.max(0, t * n - i));
        const off = paths[i].len * (1 - k);
        paths[i].p.style.strokeDashoffset = off;
        paths[i].glow.style.strokeDashoffset = off;
        paths[i].glow.style.opacity = k > 0 && k < 1 ? 0.45 : 0;
        if (k > 0) lit.add(l.a);
        if (k >= 1) lit.add(l.b);
      });
      if (t <= 0) lit.clear();
      comps.forEach((c) => c.classList.toggle("on", lit.has(c.dataset.id) || reduceMotion));
    };

    if ("ResizeObserver" in window) new ResizeObserver(layout).observe(def);
    window.addEventListener("load", layout);
    if (document.fonts) document.fonts.ready.then(layout);
    layout();
    scrollers.push(draw);
  });

  // ---- Timeline on the About page: the rail fills and each year lights up as it is reached ----
  document.querySelectorAll("[data-timeline]").forEach((tl) => {
    const fill = tl.querySelector(".rail i");
    const moments = [...tl.querySelectorAll(".moment")];
    const draw = () => {
      const t = reduceMotion ? 1 : progressOf(tl, 0.6, 0.6);
      fill.style.height = (t * 100).toFixed(2) + "%";
      const line = window.innerHeight * 0.62;
      moments.forEach((m) => m.classList.toggle("on", reduceMotion || m.getBoundingClientRect().top < line));
    };
    scrollers.push(draw);
    draw();
  });

  request();
})();
