// Parallel coordinates: one vertical axis per input and result, one line per design.
//
// The lines are drawn on canvas, so a study of thousands of designs still brushes smoothly; the
// axes, the brushes and the highlighted designs are SVG on top. Filters are kept as values, not
// pixels, so they survive a resize, a flip or a change of scale.

import { fmt, cssVar, tooltip, popupMenu, escapeHtml } from './ui.js';

const d3 = () => window.d3;
const MISSING_GAP = 16;

export class ParCoords {
  constructor(root, explorer) {
    this.root = root;
    this.x = explorer;
    this.margin = { top: 70, right: 54, bottom: 30, left: 54 };

    this.back = root.appendChild(document.createElement('canvas'));
    this.front = root.appendChild(document.createElement('canvas'));
    this.svg = d3().select(root).append('svg');
    this.measure = document.createElement('canvas').getContext('2d');
    this.brushes = new Map();
    this.brushing = null;

    this.svg.append('rect').attr('class', 'hit').attr('fill', 'transparent');
    this.groups = this.svg.append('g').attr('class', 'groups');
    this.axes = this.svg.append('g').attr('class', 'axes');
    this.highlight = this.svg.append('g').attr('class', 'highlight');

    this.svg.select('.hit')
      .on('pointermove', (event) => this.pointer(event))
      .on('pointerleave', () => {
        tooltip.hide();
        this.x.hover(null);
      })
      .on('click', (event) => {
        const id = this.pick(event);
        if (id != null) this.x.select(id);
      });

    new ResizeObserver(() => this.layout()).observe(root);
    explorer.subscribe((reasons) => this.update(reasons));
  }

  update(reasons) {
    if (!this.x.study) return;
    if (['study', 'axes', 'excluded', 'goals', 'colour', 'theme'].some((r) => reasons.has(r))) this.layout();
    else if (reasons.has('filters') || reasons.has('pareto')) {
      this.drawLines();
      this.drawHighlight();
      if (reasons.has('filters')) this.syncBrushes();
    } else if (reasons.has('hover') || reasons.has('select')) this.drawHighlight();
  }

  // ---------- layout ----------

  layout() {
    const x = this.x;
    if (!x.study) return;
    const { width, height } = this.root.getBoundingClientRect();
    if (width < 10 || height < 10) return;
    this.width = width;
    this.height = height;
    const m = this.margin;
    this.top = m.top;
    this.bottom = height - m.bottom;

    this.dims = x.visibleDims;
    this.xScale = d3().scalePoint(this.dims.map((d) => d.key), [m.left, width - m.right]);
    if (this.dims.length === 1) this.xScale = () => width / 2;
    this.spacing = this.dims.length > 1 ? (width - m.left - m.right) / (this.dims.length - 1) : width;
    this.yScales = new Map(this.dims.map((dim) => [dim.key, this.yScale(dim)]));

    // Where every design crosses every axis, worked out once per layout.
    const count = x.study.designs.length;
    this.ys = this.dims.map((dim) => {
      const y = this.yScales.get(dim.key);
      const column = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const v = dim.values[i];
        const p = v == null ? NaN : y(v);
        column[i] = Number.isFinite(p) ? p : this.bottom + MISSING_GAP;
      }
      return column;
    });
    this.xs = this.dims.map((d) => this.xScale(d.key));

    for (const canvas of [this.back, this.front]) {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    this.svg.attr('width', width).attr('height', height);
    this.svg.select('.hit').attr('width', width).attr('height', height);

    this.drawGroups();
    this.drawAxes();
    this.drawLines();
    this.drawHighlight();
  }

  yScale(dim) {
    const range = this.x.flipped.has(dim.key) ? [this.top, this.bottom] : [this.bottom, this.top];
    const domain = this.x.domains.get(dim.key);
    if (dim.type === 'category') return d3().scalePoint(domain.length ? domain : ['–'], range).padding(0.35);
    let [min, max] = domain;
    if (min === max) {
      const pad = Math.abs(min) * 0.1 || 1;
      min -= pad;
      max += pad;
    }
    if (this.x.log.has(dim.key) && min > 0) return d3().scaleLog().domain([min, max]).range(range).nice();
    return d3().scaleLinear().domain([min, max]).range(range).nice();
  }

  // ---------- drawing ----------

  drawGroups() {
    const runs = [];
    for (const dim of this.dims) {
      const last = runs[runs.length - 1];
      if (last && last.kind === dim.kind) last.keys.push(dim.key);
      else runs.push({ kind: dim.kind, keys: [dim.key] });
    }
    const names = { in: 'INPUTS', out: 'RESULTS', other: 'OTHER' };
    const half = Math.min(this.spacing / 2 - 6, 60);
    const group = this.groups.selectAll('g.group').data(runs).join((enter) => {
      const g = enter.append('g').attr('class', 'group');
      g.append('line');
      g.append('text').attr('class', 'group-label');
      return g;
    });
    group.select('line')
      .attr('class', (r) => `group-line ${r.kind === 'in' ? 'inputs' : r.kind === 'out' ? 'outputs' : ''}`)
      .attr('x1', (r) => this.xScale(r.keys[0]) - half)
      .attr('x2', (r) => this.xScale(r.keys[r.keys.length - 1]) + half)
      .attr('y1', 18).attr('y2', 18);
    group.select('text')
      .attr('x', (r) => this.xScale(r.keys[0]) - half)
      .attr('y', 12)
      .text((r) => names[r.kind]);
  }

  drawAxes() {
    const x = this.x;
    const that = this;
    const dimGroups = this.axes.selectAll('g.dim').data(this.dims, (d) => d.key).join((enter) => {
      const g = enter.append('g').attr('class', 'dim');
      g.append('g').attr('class', 'axis');
      const title = g.append('g').attr('class', 'axis-title');
      title.append('rect').attr('fill', 'transparent');
      title.append('text').attr('class', 'name').attr('text-anchor', 'middle');
      title.append('text').attr('class', 'unit').attr('text-anchor', 'middle');
      g.append('text').attr('class', 'missing').attr('text-anchor', 'middle');
      g.append('g').attr('class', 'brush');
      return g;
    });

    dimGroups.attr('transform', (d) => `translate(${this.xScale(d.key)},0)`);

    dimGroups.each(function (dim) {
      const g = d3().select(this);
      const y = that.yScales.get(dim.key);
      let axis = d3().axisLeft(y).tickSizeOuter(0).tickSize(4);
      if (dim.type === 'number') {
        axis = axis.ticks(Math.max(2, Math.round((that.bottom - that.top) / 44))).tickFormat((v) => fmt(v));
      } else {
        const domain = y.domain();
        const step = Math.ceil(domain.length / Math.max(2, Math.floor((that.bottom - that.top) / 16)));
        axis = axis.tickValues(domain.filter((_, i) => i % step === 0)).tickFormat((v) => that.fit(String(v), 70, '10.5px'));
      }
      g.select('.axis').call(axis);

      const goal = x.goals.get(dim.key);
      const coloured = x.colorKey === dim.key;
      const room = Math.max(40, Math.min(that.spacing - 10, 180));
      const prefix = (coloured ? '● ' : '') + (goal === 'min' ? '↓ ' : goal === 'max' ? '↑ ' : '');
      const name = g.select('.axis-title .name').attr('y', that.top - 30);
      name.selectAll('*').remove();
      if (prefix) {
        name.append('tspan').attr('class', coloured ? 'coloured' : 'goal').text(coloured ? '● ' : '');
        if (goal) name.append('tspan').attr('class', 'goal').text(goal === 'min' ? '↓ ' : '↑ ');
      }
      name.append('tspan').text(that.fit(dim.label, room - (prefix ? 22 : 0), '600 12px'));
      g.select('.axis-title .unit').attr('y', that.top - 15).text(dim.unit ? that.fit(dim.unit, room, '500 11px') : '');
      g.select('.axis-title rect').attr('x', -room / 2).attr('y', that.top - 46).attr('width', room).attr('height', 38);
      g.select('.axis-title').selectAll('title').data([dim]).join('title').text(`${dim.name}\nClick for options, drag to move`);

      const missing = dim.values.some((v, i) => v == null && !x.excluded.has(i));
      g.select('.missing').attr('y', that.bottom + MISSING_GAP + 4).text(missing ? 'no data' : '');

      // The axis being brushed is left alone until the brush is let go; a category axis then
      // snaps to the values it caught.
      const brush = d3().brushY()
        .extent([[-13, that.top - 4], [13, that.bottom + 4]])
        .on('start', (event) => {
          if (event.sourceEvent) that.brushing = dim.key;
        })
        .on('brush end', (event) => {
          if (!event.sourceEvent) return;
          if (event.type === 'end') that.brushing = null;
          x.setFilter(dim.key, event.selection ? that.filterFrom(dim, event.selection) : null);
        });
      g.select('.brush').call(brush);
      that.brushes.set(dim.key, brush);
    });

    dimGroups.select('.axis-title').call(this.titleDrag());
    this.syncBrushes();
  }

  /** Text cut to fit a width, with an ellipsis. */
  fit(text, width, font) {
    this.measure.font = `${font} ${getComputedStyle(document.body).fontFamily}`;
    if (this.measure.measureText(text).width <= width) return text;
    let cut = text;
    while (cut.length > 1 && this.measure.measureText(`${cut}…`).width > width) cut = cut.slice(0, -1);
    return `${cut}…`;
  }

  drawLines() {
    const x = this.x;
    const ratio = window.devicePixelRatio || 1;
    const back = this.back.getContext('2d');
    const front = this.front.getContext('2d');
    back.clearRect(0, 0, this.back.width / ratio, this.back.height / ratio);
    front.clearRect(0, 0, this.front.width / ratio, this.front.height / ratio);
    if (!this.dims.length) return;

    const trace = (ctx, id) => {
      if (this.xs.length === 1) {
        ctx.moveTo(this.xs[0] - 10, this.ys[0][id]);
        ctx.lineTo(this.xs[0] + 10, this.ys[0][id]);
        return;
      }
      ctx.moveTo(this.xs[0], this.ys[0][id]);
      for (let i = 1; i < this.xs.length; i++) ctx.lineTo(this.xs[i], this.ys[i][id]);
    };

    back.strokeStyle = cssVar('--line-muted');
    back.lineWidth = 1;
    back.beginPath();
    for (const design of x.active) if (!x.filteredIds.has(design.id)) trace(back, design.id);
    back.stroke();

    const n = x.filtered.length;
    front.globalAlpha = n <= 150 ? 0.9 : n <= 600 ? 0.7 : n <= 2500 ? 0.45 : 0.28;
    front.lineWidth = n <= 150 ? 1.6 : 1.2;
    front.lineJoin = 'round';
    const fallback = cssVar('--text-3');
    for (const design of x.filtered) {
      front.strokeStyle = x.colourOf(design) || fallback;
      front.beginPath();
      trace(front, design.id);
      front.stroke();
    }
    front.globalAlpha = 1;
  }

  drawHighlight() {
    const x = this.x;
    if (!this.dims) return;
    const line = (id) => {
      if (this.xs.length === 1) return `M${this.xs[0] - 12},${this.ys[0][id]}H${this.xs[0] + 12}`;
      return this.xs.map((px, i) => `${i ? 'L' : 'M'}${px},${this.ys[i][id]}`).join('');
    };
    const hovered = x.hovered != null && x.hovered !== x.selected ? [x.hovered] : [];
    this.highlight.selectAll('path.hover-line').data(hovered).join('path').attr('class', 'hover-line').attr('d', line);

    const selected = x.selected != null ? [x.selected] : [];
    this.highlight.selectAll('path.selected-halo').data(selected).join('path').attr('class', 'selected-halo').attr('d', line);
    this.highlight.selectAll('path.selected-line').data(selected).join('path').attr('class', 'selected-line').attr('d', line);

    const points = selected.length ? this.dims.map((dim, i) => ({ dim, x: this.xs[i], y: this.ys[i][x.selected], value: dim.values[x.selected] })) : [];
    this.highlight.selectAll('circle.selected-dot').data(points).join('circle')
      .attr('class', 'selected-dot').attr('r', 4).attr('cx', (p) => p.x).attr('cy', (p) => p.y);

    const tags = this.highlight.selectAll('g.value-tag').data(points).join((enter) => {
      const g = enter.append('g').attr('class', 'value-tag');
      g.append('rect').attr('rx', 5).attr('height', 17);
      g.append('text').attr('y', 12).attr('x', 6);
      return g;
    });
    tags.attr('transform', (p) => `translate(${p.x + 7},${Math.min(this.bottom + 8, Math.max(this.top - 8, p.y - 8.5))})`);
    tags.select('text').text((p) => fmt(p.value));
    tags.select('rect').attr('width', (p, i, nodes) => nodes[i].parentNode.querySelector('text').getComputedTextLength() + 12);
  }

  // ---------- filtering ----------

  /**
   * The filter a brush stands for. On a category axis each value owns the band of axis around
   * it, so a brush anywhere near a value catches it; one catching none clears the filter rather
   * than leaving every design filtered out behind a brush that is no longer drawn.
   */
  filterFrom(dim, [y0, y1]) {
    const y = this.yScales.get(dim.key);
    if (dim.type === 'category') {
      const half = y.step() / 2;
      const values = y.domain().filter((c) => y(c) + half >= y0 && y(c) - half <= y1);
      return values.length ? { values: new Set(values) } : null;
    }
    const a = y.invert(y0);
    const b = y.invert(y1);
    return { lo: Math.min(a, b), hi: Math.max(a, b) };
  }

  pixelsOf(dim, filter) {
    const y = this.yScales.get(dim.key);
    if (filter.values) {
      const ys = [...filter.values].map((v) => y(v)).filter((p) => p != null);
      if (!ys.length) return null;
      const pad = Math.max(7, Math.min(y.step() / 2 - 3, 18));
      return [Math.min(...ys) - pad, Math.max(...ys) + pad];
    }
    const a = y(filter.lo);
    const b = y(filter.hi);
    const lo = Math.max(this.top - 4, Math.min(a, b));
    const hi = Math.min(this.bottom + 4, Math.max(a, b));
    return hi - lo < 1 ? [lo - 1, hi + 1] : [lo, hi];
  }

  /** Puts every brush where its filter is, without raising brush events. */
  syncBrushes() {
    const that = this;
    this.axes.selectAll('g.dim').each(function (dim) {
      if (dim.key === that.brushing || !that.brushes.has(dim.key)) return;
      const filter = that.x.filters.get(dim.key);
      const g = d3().select(this).select('.brush');
      const current = d3().brushSelection(g.node());
      const wanted = filter ? that.pixelsOf(dim, filter) : null;
      if (!wanted && !current) return;
      if (wanted && current && Math.abs(wanted[0] - current[0]) < 0.5 && Math.abs(wanted[1] - current[1]) < 0.5) return;
      g.call(that.brushes.get(dim.key).move, wanted);
    });
  }

  // ---------- pointer ----------

  /** The design whose line passes nearest the pointer, within a few pixels. */
  pick(event) {
    const [px, py] = d3().pointer(event, this.svg.node());
    if (!this.xs?.length) return null;
    let i = 0;
    while (i < this.xs.length - 2 && px > this.xs[i + 1]) i++;
    const x0 = this.xs[i];
    const x1 = this.xs.length > 1 ? this.xs[i + 1] : x0;
    const t = x1 === x0 ? 0 : Math.min(1, Math.max(0, (px - x0) / (x1 - x0)));
    const c0 = this.ys[i];
    const c1 = this.xs.length > 1 ? this.ys[i + 1] : c0;
    let best = null;
    let bestDistance = 7;
    for (const design of this.x.filtered) {
      const y = c0[design.id] + (c1[design.id] - c0[design.id]) * t;
      const distance = Math.abs(y - py);
      if (distance < bestDistance) {
        bestDistance = distance;
        best = design.id;
      }
    }
    return best;
  }

  pointer(event) {
    const id = this.pick(event);
    this.x.hover(id);
    if (id == null) {
      tooltip.hide();
      return;
    }
    const scale = this.x.colourScale;
    const rows = scale ? `<div class="row"><span>${escapeHtml(scale.dim.label)}</span><span>${escapeHtml(fmt(scale.dim.values[id]))}${scale.dim.unit ? ` ${escapeHtml(scale.dim.unit)}` : ''}</span></div>` : '';
    tooltip.show(`<strong>Design ${id + 1}</strong>${rows}`, event.clientX, event.clientY);
  }

  // ---------- axis titles ----------

  titleDrag() {
    const that = this;
    let start;
    let moved;
    return d3().drag()
      .container(this.svg.node())
      .subject((event, dim) => ({ x: this.xScale(dim.key), y: 0 }))
      .on('start', function (event) {
        start = event.x;
        moved = false;
        d3().select(this).classed('dragging', true);
      })
      .on('drag', function (event, dim) {
        if (Math.abs(event.x - start) > 4) moved = true;
        if (!moved) return;
        const left = that.margin.left - 20;
        const right = that.width - that.margin.right + 20;
        const position = Math.max(left, Math.min(right, event.x));
        const order = [...that.dims].sort((a, b) => (a === dim ? position : that.xScale(a.key)) - (b === dim ? position : that.xScale(b.key)));
        const slots = d3().scalePoint(order.map((d) => d.key), [that.margin.left, that.width - that.margin.right]);
        that.axes.selectAll('g.dim').attr('transform', (d) => `translate(${d === dim ? position : slots(d.key)},0)`);
        that.dragOrder = order.map((d) => d.key);
      })
      .on('end', function (event, dim) {
        d3().select(this).classed('dragging', false);
        if (moved && that.dragOrder) {
          that.x.reorder(that.dragOrder);
          that.dragOrder = null;
        } else {
          that.axisMenu(dim, event.sourceEvent);
        }
      });
  }

  axisMenu(dim, event) {
    const x = this.x;
    const filter = x.filters.get(dim.key);
    const numeric = dim.type === 'number';
    const [min] = x.domains.get(dim.key) || [0];
    const goal = x.goals.get(dim.key);
    const items = [
      { label: dim.name },
      { text: 'Colour by this', icon: 'paint', checked: x.colorKey === dim.key, onclick: () => x.setColour(dim.key) },
      { text: 'Flip axis', icon: 'flip', checked: x.flipped.has(dim.key), onclick: () => x.toggleFlip(dim.key) },
    ];
    if (numeric) items.push({ text: 'Log scale', icon: 'log', checked: x.log.has(dim.key), disabled: !(min > 0), onclick: () => x.toggleLog(dim.key) });
    if (numeric) {
      items.push('-', { label: 'Goal' });
      items.push({ text: 'Minimise', icon: 'arrow-down', checked: goal === 'min', onclick: () => x.setGoal(dim.key, goal === 'min' ? null : 'min') });
      items.push({ text: 'Maximise', icon: 'arrow-up', checked: goal === 'max', onclick: () => x.setGoal(dim.key, goal === 'max' ? null : 'max') });
    }
    items.push('-');
    items.push({ text: 'Sort designs by this', icon: 'sort-asc', onclick: () => x.setSort(dim.key, false) });
    if (filter) items.push({ text: 'Clear filter', icon: 'filter-off', onclick: () => x.setFilter(dim.key, null) });
    items.push({ text: 'Hide axis', icon: 'eye-off', disabled: this.dims.length < 2, onclick: () => x.setHidden(dim.key, true) });
    const point = event && 'clientX' in event ? event : { clientX: 100, clientY: 100 };
    popupMenu(point.clientX + 4, point.clientY + 8, items);
  }
}
