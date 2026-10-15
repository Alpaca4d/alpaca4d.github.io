// The designs that pass the filters, three ways: pictures, a table, and a scatter of any two
// columns. All three follow the same sort, colouring, hover and selection as the axes above.

import { el, icon, fmt, escapeHtml, tooltip } from './ui.js';

const d3 = () => window.d3;
const PAGE = 120;

export class Results {
  constructor(root, tools, tabs, explorer) {
    this.root = root;
    this.tools = tools;
    this.tabs = tabs;
    this.x = explorer;
    this.cards = new Map();
    this.limit = PAGE;
    this.thumb = 200;

    for (const tab of tabs.querySelectorAll('[data-view]')) {
      tab.addEventListener('click', () => this.x.setView(tab.dataset.view));
    }
    new ResizeObserver(() => {
      if (this.x.view === 'scatter') this.renderScatter();
    }).observe(root);
    explorer.subscribe((reasons) => this.update(reasons));
  }

  update(reasons) {
    const x = this.x;
    if (!x.study) return;
    if (reasons.has('study')) {
      this.cards.clear();
      this.limit = PAGE;
      this.root.scrollTop = 0;
    }
    const structural = ['study', 'view', 'filters', 'pareto', 'excluded', 'sort', 'colour', 'goals', 'axes', 'rating', 'scatter', 'theme'];
    if (structural.some((r) => reasons.has(r))) {
      if (reasons.has('filters') || reasons.has('pareto') || reasons.has('excluded')) this.limit = PAGE;
      this.render(reasons);
    } else if (reasons.has('select') || reasons.has('hover')) {
      this.mark();
      if (reasons.has('select')) this.reveal();
    }
  }

  render(reasons) {
    const view = this.x.view;
    for (const tab of this.tabs.querySelectorAll('[data-view]')) tab.setAttribute('aria-selected', String(tab.dataset.view === view));
    this.renderTools();
    if (view === 'table') this.renderTable();
    else if (view === 'scatter') this.renderScatter();
    else this.renderGallery(reasons);
  }

  // ---------- tools ----------

  renderTools() {
    const x = this.x;
    const dims = x.study.dims;
    this.tools.replaceChildren();
    if (x.view === 'scatter') {
      const pick = (value, onchange) => el('select', { onchange: (e) => onchange(e.target.value) },
        dims.map((d) => el('option', { value: d.key, selected: d.key === value }, d.name)));
      this.tools.append(
        el('span', { class: 'tool-group' }, el('span', { class: 'results-tools-label' }, 'X'), pick(x.scatterX, (v) => x.setScatter(v, x.scatterY))),
        el('span', { class: 'tool-group' }, el('span', { class: 'results-tools-label' }, 'Y'), pick(x.scatterY, (v) => x.setScatter(x.scatterX, v))),
        el('button', { class: 'chip', title: 'Swap the axes', onclick: () => x.setScatter(x.scatterY, x.scatterX), html: `${icon('flip')}Swap` }),
      );
      return;
    }

    const sort = el('select', { 'aria-label': 'Sort by', onchange: (e) => x.setSort(e.target.value || null, x.sortDesc) },
      el('option', { value: '' }, 'Design number'),
      el('option', { value: '#rating', selected: x.sortKey === '#rating' }, 'Rating'),
      dims.map((d) => el('option', { value: d.key, selected: d.key === x.sortKey }, d.name)));
    const order = el('button', {
      class: 'btn small icon-only',
      title: x.sortDesc ? 'Largest first' : 'Smallest first',
      'aria-label': x.sortDesc ? 'Largest first' : 'Smallest first',
      html: icon(x.sortDesc ? 'sort-desc' : 'sort-asc'),
      onclick: () => x.setSort(x.sortKey, !x.sortDesc),
    });
    this.tools.append(el('span', { class: 'tool-group' }, el('span', { class: 'results-tools-label' }, 'Sort'), sort, order));

    if (x.view === 'gallery') {
      const size = el('input', {
        type: 'range', class: 'size-range', min: 130, max: 340, step: 10, value: this.thumb, 'aria-label': 'Picture size',
        oninput: (e) => {
          this.thumb = Number(e.target.value);
          this.root.style.setProperty('--thumb', `${this.thumb}px`);
        },
      });
      this.tools.append(el('span', { class: 'tool-group' }, el('span', { class: 'results-tools-label', html: icon('image') }), size));
    }
  }

  // ---------- gallery ----------

  /** What a card says under its picture: the sorted column, or the coloured one. */
  metricDim() {
    const x = this.x;
    return (x.sortKey && x.sortKey !== '#rating' && x.dim(x.sortKey)) || x.colourScale?.dim || null;
  }

  renderGallery(reasons) {
    const x = this.x;
    const list = x.sorted;
    if (!list.length) return this.empty();
    if (!x.study.hasImages) {
      this.root.replaceChildren(el('div', { class: 'empty-state' }, el('div', {},
        el('div', { html: icon('image') }), 'This study has no pictures. ', el('button', { class: 'btn small', onclick: () => x.setView('table') }, 'Show the table'))));
      return;
    }

    let grid = this.root.querySelector(':scope > .gallery');
    if (!grid) {
      grid = el('div', { class: 'gallery' });
      this.root.replaceChildren(grid);
    }
    const refresh = reasons.has('colour') || reasons.has('sort') || reasons.has('rating') || reasons.has('goals') || reasons.has('excluded') || reasons.has('theme');
    const metric = this.metricDim();
    const shown = list.slice(0, this.limit).map((design) => this.card(design, metric, refresh));
    grid.replaceChildren(...shown);

    this.root.querySelector(':scope > .more-sentinel')?.remove();
    if (list.length > this.limit) {
      const sentinel = el('div', { class: 'more-sentinel' });
      this.root.append(sentinel);
      const observer = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          observer.disconnect();
          this.limit += PAGE;
          this.renderGallery(new Set());
        }
      }, { root: this.root, rootMargin: '400px' });
      observer.observe(sentinel);
    }
    this.mark();
  }

  card(design, metric, refresh) {
    const x = this.x;
    let card = this.cards.get(design.id);
    if (!card) {
      const src = design.images.find(Boolean);
      const thumb = el('div', { class: 'thumb' });
      if (src) {
        const img = el('img', { src, alt: `Design ${design.id + 1}`, loading: 'lazy', decoding: 'async' });
        img.addEventListener('error', () => thumb.replaceChildren(el('span', { class: 'no-image', html: `${icon('image')}Picture missing` })), { once: true });
        thumb.append(img);
      } else {
        thumb.append(el('span', { class: 'no-image', html: `${icon('image')}No picture` }));
      }
      card = el('button', {
        class: 'design-card',
        dataset: { id: design.id },
        onclick: () => x.select(design.id),
        onmouseenter: () => x.hover(design.id),
        onmouseleave: () => x.hover(null),
      }, thumb, el('span', { class: 'swatch' }), el('span', { class: 'badge' }), el('span', { class: 'meta' }));
      this.cards.set(design.id, card);
      refresh = true;
    }
    if (refresh || card.dataset.metric !== (metric?.key || '')) {
      card.dataset.metric = metric?.key || '';
      const colour = x.colourOf(design);
      const swatch = card.querySelector('.swatch');
      swatch.style.background = colour || 'transparent';
      swatch.style.display = colour ? '' : 'none';
      card.querySelector('.badge').replaceChildren(...(x.pareto.has(design.id) ? [el('span', { class: 'pill pareto', title: 'On the Pareto front' }, 'Pareto')] : []));
      const stars = x.rating(design);
      const value = metric ? metric.values[design.id] : null;
      card.querySelector('.meta').replaceChildren(
        el('span', { class: 'id' }, `#${design.id + 1}`),
        metric ? el('span', { class: 'metric', title: metric.name }, `${fmt(value)}${metric.unit && value != null ? ` ${metric.unit}` : ''}`) : '',
        stars ? el('span', { class: 'stars-mini', 'aria-label': `${stars} stars` }, '★'.repeat(stars)) : '',
      );
    }
    return card;
  }

  // ---------- table ----------

  renderTable() {
    const x = this.x;
    const list = x.sorted;
    if (!list.length) return this.empty();
    const dims = x.order.map((k) => x.dim(k)).filter(Boolean);
    const limit = this.tableLimit || 300;

    const sortHeader = (key, label, kind, numeric) => {
      const active = x.sortKey === key;
      return el('th', {
        class: `${kind || ''} ${numeric ? '' : 'text'}`,
        'aria-sort': active ? (x.sortDesc ? 'descending' : 'ascending') : null,
        title: 'Sort',
        onclick: () => x.setSort(key, active ? !x.sortDesc : false),
      }, kind ? el('span', { class: 'kind' }, kind === 'in' ? 'IN' : kind === 'out' ? 'OUT' : '') : el('span', { class: 'kind' }, ' '), label, active ? (x.sortDesc ? ' ↓' : ' ↑') : '');
    };

    const head = el('tr', {},
      sortHeader(null, '#', '', false),
      sortHeader('#rating', '★', '', false),
      dims.map((d) => sortHeader(d.key, d.name, d.kind === 'other' ? '' : d.kind, d.type === 'number')));

    const rows = list.slice(0, limit).map((design) => {
      const colour = x.colourOf(design);
      const stars = x.rating(design);
      return el('tr', {
        dataset: { id: design.id },
        onclick: () => x.select(design.id),
        onmouseenter: () => x.hover(design.id),
        onmouseleave: () => x.hover(null),
      },
      el('td', { class: 'text' }, el('span', { class: 'swatch', style: { background: colour || 'transparent' } }), `${design.id + 1}`, x.pareto.has(design.id) ? el('span', { class: 'pill pareto', style: { marginLeft: '6px' } }, 'P') : ''),
      el('td', { class: 'text' }, stars ? el('span', { class: 'stars-mini' }, '★'.repeat(stars)) : ''),
      dims.map((d) => el('td', { class: d.type === 'number' ? '' : 'text' }, fmt(d.values[design.id]))));
    });

    const table = el('table', { class: 'designs' }, el('thead', {}, head), el('tbody', {}, rows));
    const parts = [el('div', { class: 'table-wrap' }, table)];
    if (list.length > limit) {
      parts.push(el('div', { class: 'show-more' }, el('button', {
        class: 'btn',
        onclick: () => {
          this.tableLimit = list.length;
          this.renderTable();
        },
      }, `Show all ${list.length.toLocaleString()} designs`)));
    }
    this.root.replaceChildren(...parts);
    this.mark();
  }

  // ---------- scatter ----------

  renderScatter() {
    const x = this.x;
    if (!x.study || x.view !== 'scatter') return;
    const xDim = x.dim(x.scatterX);
    const yDim = x.dim(x.scatterY);
    if (!xDim || !yDim) return this.root.replaceChildren(el('div', { class: 'empty-state' }, 'Pick two columns to plot.'));

    let holder = this.root.querySelector(':scope > .scatter');
    if (!holder) {
      holder = el('div', { class: 'scatter' });
      this.root.replaceChildren(holder);
    }
    const { width } = this.root.getBoundingClientRect();
    const height = Math.max(320, this.root.clientHeight - 26);
    const w = Math.max(280, width - 28);
    const m = { top: 14, right: 18, bottom: 50, left: 66 };

    const scale = (dim, range) => {
      const domain = x.domains.get(dim.key);
      if (dim.type === 'category') return d3().scalePoint(domain, range).padding(0.5);
      let [lo, hi] = domain;
      if (lo === hi) { lo -= 1; hi += 1; }
      if (x.log.has(dim.key) && lo > 0) return d3().scaleLog().domain([lo, hi]).range(range).nice();
      const pad = (hi - lo) * 0.04;
      return d3().scaleLinear().domain([lo - pad, hi + pad]).range(range).nice();
    };
    const sx = scale(xDim, [m.left, w - m.right]);
    const sy = scale(yDim, [height - m.bottom, m.top]);
    const px = (d) => sx(xDim.values[d.id]);
    const py = (d) => sy(yDim.values[d.id]);
    const has = (d) => xDim.values[d.id] != null && yDim.values[d.id] != null;

    const svg = d3().select(holder).selectAll('svg').data([0]).join('svg').attr('viewBox', `0 0 ${w} ${height}`).attr('height', height);
    svg.selectAll('*').remove();

    const xAxis = xDim.type === 'number' ? d3().axisBottom(sx).ticks(Math.max(3, w / 90)).tickFormat(fmt) : d3().axisBottom(sx);
    const yAxis = yDim.type === 'number' ? d3().axisLeft(sy).ticks(Math.max(3, height / 60)).tickFormat(fmt) : d3().axisLeft(sy);
    if (yDim.type === 'number') {
      svg.append('g').attr('class', 'grid').attr('transform', `translate(${m.left},0)`)
        .call(d3().axisLeft(sy).ticks(Math.max(3, height / 60)).tickSize(-(w - m.left - m.right)).tickFormat(''))
        .call((g) => g.select('.domain').remove());
    }
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${height - m.bottom})`).call(xAxis);
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${m.left},0)`).call(yAxis);
    const goalMark = (dim) => (x.goals.get(dim.key) === 'min' ? ' ↓' : x.goals.get(dim.key) === 'max' ? ' ↑' : '');
    svg.append('text').attr('class', 'axis-label').attr('x', (m.left + w - m.right) / 2).attr('y', height - 6).attr('text-anchor', 'middle').text(xDim.name + goalMark(xDim));
    svg.append('text').attr('class', 'axis-label').attr('transform', `translate(16,${(m.top + height - m.bottom) / 2}) rotate(-90)`).attr('text-anchor', 'middle').text(yDim.name + goalMark(yDim));

    const out = x.active.filter((d) => !x.filteredIds.has(d.id) && has(d));
    const inside = x.filtered.filter(has);
    svg.append('g').selectAll('circle').data(out).join('circle').attr('class', 'dot-out').attr('r', 2.6).attr('cx', px).attr('cy', py);

    // The front of these two columns, when both have a goal: the designs neither beats.
    const gx = x.goals.get(xDim.key);
    const gy = x.goals.get(yDim.key);
    if (gx && gy && xDim.type === 'number' && yDim.type === 'number') {
      const sign = (g) => (g === 'max' ? -1 : 1);
      const pts = inside.map((d) => ({ d, a: sign(gx) * xDim.values[d.id], b: sign(gy) * yDim.values[d.id] }))
        .sort((p, q) => p.a - q.a || p.b - q.b);
      const front = [];
      let best = Infinity;
      for (const p of pts) if (p.b < best) { front.push(p.d); best = p.b; }
      const line = d3().line().curve(d3().curveStepAfter).x(px).y(py);
      svg.append('path').attr('class', 'front').attr('d', line(front.sort((a, b) => px(a) - px(b))));
      svg.append('g').selectAll('circle').data(front).join('circle').attr('class', 'front-dot').attr('r', 7).attr('cx', px).attr('cy', py);
    } else if (x.pareto.size) {
      svg.append('g').selectAll('circle').data(inside.filter((d) => x.pareto.has(d.id))).join('circle').attr('class', 'front-dot').attr('r', 7).attr('cx', px).attr('cy', py);
    }

    svg.append('g').selectAll('circle').data(inside).join('circle')
      .attr('class', 'dot').attr('r', inside.length > 1500 ? 3 : 4.5)
      .attr('cx', px).attr('cy', py)
      .attr('fill', (d) => x.colourOf(d) || 'var(--text-3)');

    this.scatterMarks = svg.append('g');
    this.scatterPosition = (id) => {
      const d = x.study.designs[id];
      return d && has(d) ? [px(d), py(d)] : null;
    };
    const delaunay = d3().Delaunay.from(inside, px, py);
    svg.on('pointermove', (event) => {
      const [mx, my] = d3().pointer(event);
      const i = inside.length ? delaunay.find(mx, my) : -1;
      const d = inside[i];
      if (!d || Math.hypot(px(d) - mx, py(d) - my) > 24) {
        x.hover(null);
        tooltip.hide();
        return;
      }
      x.hover(d.id);
      const row = (dim) => `<div class="row"><span>${escapeHtml(dim.label)}</span><span>${escapeHtml(fmt(dim.values[d.id]))}${dim.unit ? ` ${escapeHtml(dim.unit)}` : ''}</span></div>`;
      tooltip.show(`<strong>Design ${d.id + 1}</strong>${row(xDim)}${row(yDim)}`, event.clientX, event.clientY);
    }).on('pointerleave', () => {
      x.hover(null);
      tooltip.hide();
    }).on('click', () => {
      if (x.hovered != null) x.select(x.hovered);
    });

    this.mark();
  }

  // ---------- shared ----------

  empty() {
    const x = this.x;
    const why = x.paretoOnly && !x.pareto.size
      ? 'Give two or more results a goal - click a result’s name on the axes - to find the Pareto front.'
      : 'No design passes the filters.';
    this.root.replaceChildren(el('div', { class: 'empty-state' }, el('div', {},
      el('div', { html: icon('filter-off') }), el('p', {}, why),
      el('button', { class: 'btn small', onclick: () => x.clearFilters() }, 'Clear the filters'))));
  }

  /** Marks the hovered and the selected design wherever they are shown. */
  mark() {
    const x = this.x;
    for (const node of this.root.querySelectorAll('.selected, .hovered')) node.classList.remove('selected', 'hovered');
    if (x.selected != null) for (const node of this.root.querySelectorAll(`[data-id="${x.selected}"]`)) node.classList.add('selected');
    if (x.hovered != null) for (const node of this.root.querySelectorAll(`[data-id="${x.hovered}"]`)) node.classList.add('hovered');

    if (x.view === 'scatter' && this.scatterMarks) {
      const ring = (id, cls, r) => {
        const p = id == null ? null : this.scatterPosition(id);
        this.scatterMarks.selectAll(`circle.${cls}`).data(p ? [p] : []).join('circle').attr('class', cls).attr('r', r).attr('cx', (q) => q[0]).attr('cy', (q) => q[1]);
      };
      ring(x.hovered !== x.selected ? x.hovered : null, 'hover-dot', 8);
      ring(x.selected, 'selected-dot', 9);
    }
  }

  /** Scrolls the selected design into view, if it is listed and out of sight. */
  reveal() {
    const node = this.root.querySelector(`[data-id="${this.x.selected}"]`);
    if (!node) return;
    const box = node.getBoundingClientRect();
    const view = this.root.getBoundingClientRect();
    if (box.top < view.top || box.bottom > view.bottom) node.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
}

