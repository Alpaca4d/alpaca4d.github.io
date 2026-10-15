// The selected design: its picture or its 3D model, its rating, every value it has, and a way
// to step to its neighbours one input at a time.

import { el, icon, fmt, toast } from './ui.js';
import { expandButton } from './layout.js';

export class Detail {
  constructor(root, explorer) {
    this.root = root;
    this.x = explorer;
    this.mode = 'image';
    this.imageIndex = 0;
    this.viewer = null;
    this.note = '';

    this.head = el('div', { class: 'detail-head' });
    this.switchRow = el('div', { class: 'media-switch' });
    this.media = el('div', { class: 'media' });
    this.info = el('div', { class: 'detail-info' });
    explorer.subscribe((reasons) => this.update(reasons));
  }

  update(reasons) {
    const x = this.x;
    if (!x.study) return;
    if (reasons.has('study')) {
      this.mode = 'image';
      this.imageIndex = 0;
      this.viewer?.clear();
      this.render();
      return;
    }
    if (reasons.has('select')) {
      if (!this.keepNote) this.note = '';
      this.keepNote = false;
      this.render();
      return;
    }
    if (['rating', 'goals', 'filters', 'pareto', 'excluded', 'colour', 'sort', 'axes'].some((r) => reasons.has(r))) {
      if (x.selected == null) this.renderSummary();
      else {
        this.renderHead();
        this.renderInfo();
      }
    }
    if (reasons.has('theme')) this.viewer?.setTheme();
  }

  get design() {
    const id = this.x.selected;
    return id == null ? null : this.x.study.designs[id];
  }

  render() {
    if (!this.design) {
      this.renderSummary();
      return;
    }
    if (!this.root.contains(this.media)) this.root.replaceChildren(this.head, this.switchRow, this.media, this.info);
    this.renderHead();
    this.renderSwitch();
    this.renderMedia();
    this.renderInfo();
  }

  // ---------- nothing selected ----------

  /** Nothing selected: a hint, and nothing the axes and the counts above already say. */
  renderSummary() {
    this.viewer?.clear();
    this.root.replaceChildren(el('div', { class: 'detail-empty' },
      el('span', { class: 'detail-empty-expand' }, expandButton('detail')),
      el('span', { class: 'detail-empty-icon', html: icon('pointer') }),
      el('p', { class: 'detail-empty-title' }, 'No design selected'),
      el('p', {}, 'Click a line, a picture or a point.'),
      el('p', { class: 'detail-empty-keys' }, el('kbd', {}, '←'), el('kbd', {}, '→'), ' step through the designs'),
    ));
  }

  // ---------- header ----------

  renderHead() {
    const x = this.x;
    const design = this.design;
    if (!design) return;
    const inputs = x.study.dims.filter((d) => d.kind === 'in');
    const summary = inputs.map((d) => `${fmt(d.values[design.id])}${d.unit ? ` ${d.unit}` : ''}`).join(' · ');
    const passes = x.filteredIds.has(design.id);
    this.head.replaceChildren(
      el('div', { class: 'titles' },
        el('h2', {}, `Design ${design.id + 1}`),
        el('div', { class: 'sub', title: summary }, summary)),
      el('div', { class: 'nav' },
        el('button', { class: 'btn icon-only', title: 'Previous design (←)', 'aria-label': 'Previous design', html: icon('chevron-left'), onclick: () => x.step(-1), disabled: !x.sorted.length }),
        el('button', { class: 'btn icon-only', title: 'Next design (→)', 'aria-label': 'Next design', html: icon('chevron-right'), onclick: () => x.step(1), disabled: !x.sorted.length }),
        expandButton('detail')),
    );
    if (!passes) this.head.querySelector('.titles').append(el('span', { class: 'pill warn', style: { marginTop: '4px' } }, x.excluded.has(design.id) ? 'Set aside' : 'Filtered out'));
  }

  // ---------- picture / 3D ----------

  renderSwitch() {
    const x = this.x;
    const study = x.study;
    const design = this.design;
    const parts = [];
    if (study.hasModel) {
      const button = (mode, label, iconName) => el('button', {
        'aria-pressed': String(this.mode === mode),
        html: `${icon(iconName)}${label}`,
        onclick: () => {
          this.mode = mode;
          this.renderSwitch();
          this.renderMedia();
        },
      });
      parts.push(el('div', { class: 'segmented', role: 'group', 'aria-label': 'Show' }, button('image', 'Picture', 'image'), button('3d', '3D', 'cube')));
    }
    if (this.mode === 'image' && study.images.length > 1) {
      parts.push(el('div', { class: 'segmented', role: 'group', 'aria-label': 'View' }, study.images.map((image, i) => el('button', {
        'aria-pressed': String(this.imageIndex === i),
        disabled: !design.images[i],
        onclick: () => {
          this.imageIndex = i;
          this.renderSwitch();
          this.renderMedia();
        },
      }, image.label))));
    }
    this.switchRow.replaceChildren(...parts);
    this.switchRow.hidden = !parts.length;
  }

  async renderMedia() {
    const design = this.design;
    if (!design) return;
    const tools = el('div', { class: 'media-tools' });
    const fullscreen = el('button', {
      class: 'btn icon-only', title: 'Full screen', 'aria-label': 'Full screen', html: icon('expand'),
      onclick: () => (document.fullscreenElement ? document.exitFullscreen() : this.media.requestFullscreen?.()),
    });

    if (this.mode === '3d') {
      if (!design.model) {
        this.viewer?.clear();
        this.media.replaceChildren(el('div', { class: 'media-empty' }, 'This design has no 3D model.'));
        return;
      }
      let holder = this.media.querySelector('.viewer3d');
      if (!holder) {
        holder = el('div', { class: 'viewer3d' });
        const loading = el('div', { class: 'loading' }, 'Loading 3D…');
        this.media.replaceChildren(holder, loading, tools);
        tools.append(
          el('button', { class: 'btn icon-only', title: 'Fit the model', 'aria-label': 'Fit the model', html: icon('zoom'), onclick: () => this.viewer?.frame() }),
          fullscreen);
      }
      try {
        if (!this.viewer) {
          const { Viewer } = await import('./viewer3d.js');
          this.viewer = new Viewer();
        }
        this.viewer.attach(holder);
        const loading = this.media.querySelector('.loading');
        const labels = await this.viewer.load(design.model);
        loading?.remove();
        this.labelsButton(labels);
      } catch (error) {
        console.error(error);
        this.media.querySelector('.loading')?.remove();
        this.media.append(el('div', { class: 'media-empty' }, `The 3D model could not be shown. ${error.message || ''}`));
      }
      return;
    }

    this.viewer?.detach();
    const src = design.images[this.imageIndex] || design.images.find(Boolean);
    if (!src) {
      this.media.replaceChildren(el('div', { class: 'media-empty' }, this.x.study.images.length ? 'No picture for this design.' : 'This study has no pictures.'));
      return;
    }
    const img = el('img', { src, alt: `Design ${design.id + 1}` });
    img.addEventListener('error', () => {
      const hint = this.x.study.source.kind === 'files' && this.x.study.source.onlyCsv
        ? 'Open the whole folder, not only data.csv, to see its pictures.'
        : 'The picture could not be loaded.';
      this.media.replaceChildren(el('div', { class: 'media-empty' }, hint));
    }, { once: true });
    tools.append(fullscreen);
    this.media.replaceChildren(img, tools);
  }

  /** The button that shows and hides a model's labels, there only when it has some. */
  labelsButton(count) {
    const tools = this.media.querySelector('.media-tools');
    if (!tools) return;
    let button = tools.querySelector('[data-labels]');
    if (!count) {
      button?.remove();
      return;
    }
    if (!button) {
      button = el('button', {
        class: 'btn icon-only',
        dataset: { labels: '' },
        html: icon('tag'),
        onclick: () => {
          this.viewer.setLabelsVisible(!this.viewer.labelsVisible);
          this.labelsButton(this.viewer.labelCount);
        },
      });
      tools.prepend(button);
    }
    const shown = this.viewer.labelsVisible;
    button.title = shown ? `Hide the ${count} labels` : `Show the ${count} labels`;
    button.setAttribute('aria-label', button.title);
    button.setAttribute('aria-pressed', String(shown));
  }

  // ---------- rating and values ----------

  renderInfo() {
    const x = this.x;
    const design = this.design;
    if (!design) return;
    const stars = x.rating(design);

    const rating = el('div', { class: 'rating-row' },
      el('div', { class: 'stars', role: 'radiogroup', 'aria-label': 'Rating' }, [1, 2, 3, 4, 5].map((n) => el('button', {
        class: n <= stars ? 'on' : '',
        role: 'radio',
        'aria-checked': String(n === stars),
        'aria-label': `${n} star${n > 1 ? 's' : ''}`,
        title: n === stars ? 'Clear the rating' : `${n} star${n > 1 ? 's' : ''}`,
        html: icon('star'),
        onclick: () => x.rate(design, n === stars ? 0 : n),
      }))),
      x.pareto.has(design.id) ? el('span', { class: 'pill pareto', title: 'No other design beats it on every goal' }, 'Pareto front') : '',
    );

    // Inputs have arrows either side of their value, to step to the design next door - among the
    // designs that pass the filters only, so stepping never leaves what the axes are showing, and
    // from a design that is filtered out leads back in.
    const inputs = x.study.dims.filter((d) => d.kind === 'in');
    const groups = [
      ['in', 'Inputs'],
      ['out', 'Results'],
      ['other', 'Other'],
    ].map(([kind, title]) => {
      const dims = x.order.map((k) => x.dim(k)).filter((d) => d && d.kind === kind);
      if (!dims.length) return null;
      if (kind === 'in') {
        return [el('h3', { class: kind }, title), dims.map((dim) => this.inputRow(dim, design, inputs, x.filtered)),
          this.note ? el('p', { class: 'closest-note' }, this.note) : ''];
      }
      return [el('h3', { class: kind }, title), dims.map((dim) => this.valueRow(dim, design))];
    });
    const notes = x.study.notes.map((column) => {
      const text = design.raw[column.index];
      return text ? el('div', { class: 'value-row' }, el('span', { class: 'name' }, column.name), el('span', { class: 'val', style: { gridColumn: 'span 2', fontWeight: 400 } }, text)) : null;
    });

    this.info.replaceChildren(rating, el('div', { class: 'values' }, groups, notes));
  }

  valueRow(dim, design) {
    const x = this.x;
    const value = dim.values[design.id];
    const raw = (design.raw[dim.column] ?? '').trim();
    const goal = x.goals.get(dim.key);
    let bar = el('span');
    if (value != null) {
      const domain = x.domains.get(dim.key);
      let t = 0.5;
      if (dim.type === 'number') t = domain[1] > domain[0] ? (value - domain[0]) / (domain[1] - domain[0]) : 0.5;
      else if (domain.length > 1) t = domain.indexOf(value) / (domain.length - 1);
      const colour = x.colourScale?.dim === dim ? x.colourScale.colour(value) : 'var(--accent)';
      bar = el('span', { class: 'range-bar', title: dim.type === 'number' ? `${fmt(domain[0])} – ${fmt(domain[1])}` : domain.join(', ') },
        el('i', { style: { left: `${Math.max(0, Math.min(1, t)) * 100}%`, background: colour } }));
    }
    return el('div', { class: 'value-row' },
      el('span', { class: 'name', title: dim.name }, dim.name, goal ? el('span', { class: 'goal', title: goal === 'min' ? 'Minimise' : 'Maximise' }, goal === 'min' ? '↓' : '↑') : ''),
      el('span', { class: 'val', title: raw }, value == null ? '–' : dim.type === 'number' && raw.length <= 12 ? raw : fmt(value)),
      bar);
  }

  /**
   * An input, with arrows either side of its value. It offers the values the designs in the pool
   * have, and goes to the one with that value and the other inputs as they are or, when there is
   * none, the closest one. The design's own value is always shown; when no design in the pool
   * has it, it is there but greyed, and the arrows go to the nearest values that are.
   */
  inputRow(dim, design, inputs, pool) {
    const x = this.x;
    const current = dim.values[design.id];
    const present = new Set(pool.map((d) => dim.values[d.id]).filter((v) => v != null));
    const shown = (v) => present.has(v) || v === current;
    const values = dim.type === 'category'
      ? dim.categories.filter(shown)
      : [...new Set([...present, ...(current == null ? [] : [current])])].sort((a, b) => a - b);
    const index = values.indexOf(current);
    const before = values.slice(0, Math.max(index, 0)).reverse().find((v) => present.has(v));
    const after = values.slice(index + 1).find((v) => present.has(v));
    const go = (value) => this.goTo(dim, value, inputs, pool);

    const select = el('select', { 'aria-label': dim.name, disabled: !present.size, onchange: (e) => go(values[Number(e.target.value)]) },
      values.map((v, i) => el('option', { value: i, selected: i === index, disabled: !present.has(v) }, fmt(v))));
    return el('div', { class: 'value-row input-row' },
      el('span', { class: 'name', title: dim.name }, dim.name),
      el('span', { class: 'stepper' },
        el('button', { 'aria-label': `Lower ${dim.name}`, html: icon('chevron-left'), disabled: before === undefined, onclick: () => go(before) }),
        select,
        el('button', { 'aria-label': `Higher ${dim.name}`, html: icon('chevron-right'), disabled: after === undefined, onclick: () => go(after) })));
  }

  goTo(dim, value, inputs, pool) {
    const x = this.x;
    const design = this.design;
    const wanted = new Map(inputs.map((d) => [d.key, d === dim ? value : d.values[design.id]]));
    const matching = pool.filter((d) => dim.values[d.id] === value);
    const candidates = matching.length ? matching : pool;
    let best = null;
    let bestDistance = Infinity;
    for (const d of candidates) {
      let distance = 0;
      for (const input of inputs) {
        const a = input.values[d.id];
        const b = wanted.get(input.key);
        if (a === b) continue;
        if (input.type === 'number' && a != null && b != null) {
          const [lo, hi] = x.domains.get(input.key);
          distance += Math.abs(a - b) / (hi - lo || 1);
        } else distance += 1;
      }
      if (distance < bestDistance) {
        bestDistance = distance;
        best = d;
      }
    }
    if (!best) {
      toast('No design to go to.');
      return;
    }
    this.note = bestDistance > 0 ? 'No design has exactly these inputs, so this is the closest one.' : '';
    this.keepNote = true;
    if (best.id === x.selected) this.renderInfo();
    else x.select(best.id);
  }
}

