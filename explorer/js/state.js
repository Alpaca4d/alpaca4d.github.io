// What the user is looking at, and everything worked out from it.
//
// One object holds the study and the view of it - filters, what was set aside, the axis order,
// the colouring, goals, the selection - and tells the views when something changed. Changes made
// in the same frame reach the views as one, so dragging a brush redraws each view once a frame.

import { debounce } from './ui.js';

const d3 = () => window.d3;

export const PALETTES = {
  turbo: { name: 'Turbo (Alpaca4d)', interpolate: () => d3().interpolateTurbo },
  viridis: { name: 'Viridis', interpolate: () => d3().interpolateViridis },
  plasma: { name: 'Plasma', interpolate: () => d3().interpolatePlasma },
  coolwarm: { name: 'Cool – warm', interpolate: () => (t) => d3().interpolateRdBu(1 - t) },
};

const CATEGORY_COLOURS = ['#4288f7', '#eb6c3f', '#9e35da', '#afc930', '#fe0000', '#011efe', '#2bb3a3', '#f2b705', '#8a5a44', '#e05fa8'];

export class Explorer {
  constructor() {
    this.listeners = new Set();
    this.pending = new Set();
    this.study = null;
    this.save = debounce(() => this.persist(), 300);
  }

  // ---------- notifications ----------

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Marks what changed; views hear about it once, on the next frame. */
  changed(...reasons) {
    for (const reason of reasons) this.pending.add(reason);
    if (this.flushQueued) return;
    this.flushQueued = true;
    // A frame when the page is painting; the timer when it is not - a browser holds frames back
    // from a page it is not showing, and a study opened then would wait to appear.
    const flush = () => {
      if (!this.flushQueued) return;
      this.flushQueued = false;
      const reasons = new Set(this.pending);
      this.pending.clear();
      this.derive(reasons);
      for (const listener of this.listeners) listener(reasons);
    };
    requestAnimationFrame(flush);
    setTimeout(flush, 60);
  }

  // ---------- study ----------

  setStudy(study) {
    this.study?.source?.release?.();
    this.study = study;
    this.filters = new Map();
    this.excluded = new Set();
    this.selected = null;
    this.hovered = null;
    this.paretoOnly = false;
    this.view = study.hasImages ? 'gallery' : 'table';
    this.sortKey = null;
    this.sortDesc = false;

    const outputs = study.dims.filter((d) => d.kind === 'out');
    const numericOutputs = outputs.filter((d) => d.type === 'number');
    this.order = study.dims.map((d) => d.key);
    this.hidden = new Set();
    this.flipped = new Set();
    this.log = new Set();
    this.goals = new Map();
    this.colorKey = (numericOutputs[0] || outputs[0] || study.dims[study.dims.length - 1])?.key ?? null;
    this.palette = 'turbo';
    this.scatterX = (numericOutputs[0] || study.dims[0])?.key;
    this.scatterY = (numericOutputs[1] || study.dims.find((d) => d.type === 'number' && d.key !== this.scatterX) || study.dims[1] || study.dims[0])?.key;
    this.ratings = new Map();
    for (const design of study.designs) if (design.initialRating > 0) this.ratings.set(design.key, Math.min(5, design.initialRating));

    this.restore();
    this.derive(new Set(['study']));
    this.changed('study');
  }

  dim(key) {
    return this.study?.dims.find((d) => d.key === key) || null;
  }

  get visibleDims() {
    return this.order.map((key) => this.dim(key)).filter((d) => d && !this.hidden.has(d.key));
  }

  // ---------- derived ----------

  derive(reasons) {
    if (!this.study) return;
    const all = reasons.has('study');
    if (all || reasons.has('excluded') || reasons.has('goals')) {
      this.active = this.study.designs.filter((d) => !this.excluded.has(d.id));
      this.pareto = this.computePareto();
      this.domains = new Map(this.study.dims.map((dim) => [dim.key, this.computeDomain(dim)]));
    }
    if (all || reasons.has('excluded') || reasons.has('goals') || reasons.has('filters') || reasons.has('pareto')) {
      this.filtered = this.active.filter((d) => this.passes(d));
      this.filteredIds = new Set(this.filtered.map((d) => d.id));
    }
    if (all || reasons.has('excluded') || reasons.has('colour') || reasons.has('goals')) {
      this.colourScale = this.computeColourScale();
    }
    if (all || reasons.has('excluded') || reasons.has('goals') || reasons.has('filters') || reasons.has('pareto') || reasons.has('sort') || reasons.has('rating')) {
      this.sorted = this.computeSorted();
    }
  }

  passes(design) {
    for (const [key, filter] of this.filters) {
      const dim = this.dim(key);
      if (!dim) continue;
      const value = dim.values[design.id];
      if (value == null) return false;
      if (filter.values ? !filter.values.has(value) : value < filter.lo || value > filter.hi) return false;
    }
    return !this.paretoOnly || this.pareto.has(design.id);
  }

  computeDomain(dim) {
    const values = this.active.map((d) => dim.values[d.id]).filter((v) => v != null);
    if (dim.type === 'category') {
      const present = new Set(values);
      return dim.categories.filter((c) => present.has(c));
    }
    const [min, max] = values.length ? d3().extent(values) : [0, 1];
    return [min, max];
  }

  /** The designs no other design beats on every goal at once. */
  computePareto() {
    const goals = [...this.goals].map(([key, goal]) => ({ dim: this.dim(key), sign: goal === 'max' ? -1 : 1 })).filter((g) => g.dim && g.dim.type === 'number');
    const front = new Set();
    if (!goals.length) return front;
    const points = this.active
      .map((d) => ({ id: d.id, v: goals.map((g) => g.dim.values[d.id]) }))
      .filter((p) => p.v.every((v) => v != null))
      .map((p) => ({ id: p.id, v: p.v.map((v, i) => v * goals[i].sign) }));
    // In lexicographic order a design can only be beaten by one before it, and if it is beaten at
    // all, it is beaten by one already kept - so each is checked against the front so far only.
    points.sort((a, b) => {
      for (let i = 0; i < a.v.length; i++) if (a.v[i] !== b.v[i]) return a.v[i] - b.v[i];
      return 0;
    });
    const kept = [];
    for (const p of points) {
      const beaten = kept.some((q) => q.v.every((v, i) => v <= p.v[i]) && q.v.some((v, i) => v < p.v[i]));
      if (!beaten) {
        kept.push(p);
        front.add(p.id);
      }
    }
    return front;
  }

  computeColourScale() {
    const dim = this.dim(this.colorKey);
    if (!dim) return null;
    if (dim.type === 'category') {
      const scale = d3().scaleOrdinal(dim.categories, CATEGORY_COLOURS);
      return { dim, categorical: true, scale, colour: (v) => (v == null ? null : scale(v)) };
    }
    const [min, max] = this.domains.get(dim.key);
    // With a goal of maximising, high is good; the gradient turns round so red still means worse.
    const reversed = this.goals.get(dim.key) === 'max';
    const interpolate = (PALETTES[this.palette] || PALETTES.turbo).interpolate();
    const scale = d3().scaleSequential(interpolate).domain(reversed ? [max, min] : [min, max === min ? min + 1 : max]);
    return { dim, categorical: false, scale, reversed, min, max, interpolate, colour: (v) => (v == null ? null : scale(v)) };
  }

  colourOf(design) {
    if (!this.colourScale) return null;
    return this.colourScale.colour(this.colourScale.dim.values[design.id]);
  }

  computeSorted() {
    const list = [...this.filtered];
    const key = this.sortKey;
    if (key === '#rating') {
      list.sort((a, b) => (this.rating(b) - this.rating(a)) || a.id - b.id);
      if (this.sortDesc) list.reverse();
    } else if (key) {
      const dim = this.dim(key);
      if (dim) {
        const value = (d) => dim.values[d.id];
        const compare = dim.type === 'category'
          ? (a, b) => dim.categories.indexOf(value(a)) - dim.categories.indexOf(value(b))
          : (a, b) => value(a) - value(b);
        list.sort((a, b) => {
          const va = value(a);
          const vb = value(b);
          if (va == null || vb == null) return (va == null) - (vb == null);
          return (this.sortDesc ? -compare(a, b) : compare(a, b)) || a.id - b.id;
        });
      }
    } else if (this.sortDesc) {
      list.reverse();
    }
    return list;
  }

  // ---------- actions ----------

  setFilter(key, filter) {
    if (filter) this.filters.set(key, filter);
    else this.filters.delete(key);
    this.changed('filters');
  }

  clearFilters() {
    this.filters.clear();
    this.paretoOnly = false;
    this.changed('filters', 'pareto');
  }

  /** Sets the designs passing the filters aside. */
  excludeFiltered() {
    for (const d of this.filtered) this.excluded.add(d.id);
    this.filters.clear();
    this.paretoOnly = false;
    this.changed('excluded', 'filters', 'pareto');
  }

  /** Keeps only the designs passing the filters, and fits the axes to them. */
  keepFiltered() {
    const keep = this.filteredIds;
    for (const d of this.study.designs) if (!keep.has(d.id)) this.excluded.add(d.id);
    this.filters.clear();
    this.paretoOnly = false;
    this.changed('excluded', 'filters', 'pareto');
  }

  resetAll() {
    this.filters.clear();
    this.excluded.clear();
    this.paretoOnly = false;
    this.changed('excluded', 'filters', 'pareto');
  }

  setParetoOnly(on) {
    this.paretoOnly = on;
    this.changed('pareto');
  }

  setColour(key) {
    this.colorKey = key;
    this.changed('colour');
    this.save();
  }

  setPalette(name) {
    this.palette = name;
    this.changed('colour');
    this.save();
  }

  setGoal(key, goal) {
    if (goal) this.goals.set(key, goal);
    else this.goals.delete(key);
    this.changed('goals');
    this.save();
  }

  toggle(set, key, reason) {
    if (set.has(key)) set.delete(key);
    else set.add(key);
    this.changed(reason);
    this.save();
  }

  toggleFlip(key) { this.toggle(this.flipped, key, 'axes'); }
  toggleLog(key) { this.toggle(this.log, key, 'axes'); }

  setHidden(key, hidden) {
    if (hidden) {
      this.hidden.add(key);
      this.filters.delete(key);
    } else this.hidden.delete(key);
    this.changed('axes', 'filters');
    this.save();
  }

  reorder(keys) {
    const rest = this.order.filter((k) => !keys.includes(k));
    this.order = [...keys, ...rest];
    this.changed('axes');
    this.save();
  }

  select(id) {
    if (this.selected === id) return;
    this.selected = id;
    this.changed('select');
  }

  hover(id) {
    if (this.hovered === id) return;
    this.hovered = id;
    this.changed('hover');
  }

  /** The design before or after the selected one, in the order the results are listed. */
  step(by) {
    const list = this.sorted;
    if (!list.length) return;
    const index = list.findIndex((d) => d.id === this.selected);
    const next = index < 0 ? (by > 0 ? 0 : list.length - 1) : (index + by + list.length) % list.length;
    this.select(list[next].id);
  }

  rating(design) {
    return this.ratings.get(design.key) || 0;
  }

  rate(design, stars) {
    if (stars > 0) this.ratings.set(design.key, stars);
    else this.ratings.delete(design.key);
    this.changed('rating');
    this.save();
  }

  setSort(key, desc) {
    this.sortKey = key;
    this.sortDesc = desc;
    this.changed('sort');
  }

  setView(view) {
    this.view = view;
    this.changed('view');
  }

  setScatter(x, y) {
    this.scatterX = x;
    this.scatterY = y;
    this.changed('scatter');
    this.save();
  }

  // ---------- remembering ----------

  get storageName() {
    return `alpaca4d-explorer:study:${this.study.storageKey}`;
  }

  persist() {
    if (!this.study) return;
    const settings = {
      order: this.order,
      hidden: [...this.hidden],
      flipped: [...this.flipped],
      log: [...this.log],
      goals: [...this.goals],
      colorKey: this.colorKey,
      palette: this.palette,
      scatter: [this.scatterX, this.scatterY],
      ratings: [...this.ratings],
    };
    try {
      localStorage.setItem(this.storageName, JSON.stringify(settings));
    } catch (e) { /* storage full or blocked: settings last as long as the page */ }
  }

  restore() {
    let settings;
    try {
      settings = JSON.parse(localStorage.getItem(this.storageName) || 'null');
    } catch (e) {
      settings = null;
    }
    if (!settings) return;
    const known = (key) => !!this.dim(key);
    if (Array.isArray(settings.order)) {
      const saved = settings.order.filter(known);
      this.order = [...saved, ...this.order.filter((k) => !saved.includes(k))];
    }
    this.hidden = new Set((settings.hidden || []).filter(known));
    this.flipped = new Set((settings.flipped || []).filter(known));
    this.log = new Set((settings.log || []).filter(known));
    this.goals = new Map((settings.goals || []).filter(([k]) => known(k)));
    if (known(settings.colorKey)) this.colorKey = settings.colorKey;
    if (PALETTES[settings.palette]) this.palette = settings.palette;
    if (settings.scatter && known(settings.scatter[0]) && known(settings.scatter[1])) [this.scatterX, this.scatterY] = settings.scatter;
    for (const [key, stars] of settings.ratings || []) this.ratings.set(key, stars);
  }
}
