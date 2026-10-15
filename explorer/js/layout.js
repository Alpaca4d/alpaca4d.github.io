// The two handles that resize the workspace: one between the axes and the designs under them,
// one between the left side and the design panel.
//
// A study of eight inputs wants tall axes; a study read mostly through its pictures wants a big
// gallery. So the split is the reader's to move. Drag a handle, or focus it and use the arrow
// keys; double-click or Enter puts it back. The sizes are remembered in this browser, for every
// study, and kept within limits so no panel can be squeezed to nothing.
//
// Each panel also has an expand button that gives it the whole workspace for a while; the
// button again, or Esc, puts the panels back as they were.

import { el, icon } from './ui.js';

const KEY = 'alpaca4d-explorer:layout';
const HANDLE = 14;
const PANEL_NAMES = { pc: 'the axes', results: 'the designs', detail: 'the design' };

let controller = null;

export function wireLayout(workspace) {
  const rows = document.getElementById('split-rows');
  const columns = document.getElementById('split-columns');
  const pcPanel = workspace.querySelector('.pc-panel');
  const detail = workspace.querySelector('.detail-panel');
  const sizes = load();

  const inner = () => {
    const style = getComputedStyle(workspace);
    return {
      height: workspace.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
      width: workspace.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight),
    };
  };

  // At least a readable set of axes and a row of designs under them; at least a usable design
  // panel and room for the axes beside it.
  const limits = {
    pc: () => [290, Math.max(290, inner().height - HANDLE - 180)],
    detail: () => [300, Math.max(300, inner().width - HANDLE - 460)],
  };
  const clamp = (name, value) => {
    const [lo, hi] = limits[name]();
    return Math.round(Math.min(hi, Math.max(lo, value)));
  };
  const current = (name) => (name === 'pc' ? pcPanel.getBoundingClientRect().height : detail.getBoundingClientRect().width);

  function apply() {
    // Hidden, the workspace has no size to fit to; the sizes wait until it is shown.
    if (!workspace.clientWidth) return;
    for (const [name, property, handle] of [['pc', '--pc-height', rows], ['detail', '--detail-width', columns]]) {
      if (sizes[name] == null) workspace.style.removeProperty(property);
      else workspace.style.setProperty(property, `${clamp(name, sizes[name])}px`);
      const [lo, hi] = limits[name]();
      handle.setAttribute('aria-valuemin', String(Math.round(lo)));
      handle.setAttribute('aria-valuemax', String(Math.round(hi)));
      handle.setAttribute('aria-valuenow', String(Math.round(current(name))));
    }
  }

  function set(name, value) {
    sizes[name] = value == null ? null : clamp(name, value);
    apply();
  }

  /** @param sign +1 when moving the pointer down or right makes the panel bigger, -1 when smaller. */
  function wire(handle, name, vertical, sign) {
    handle.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      handle.setPointerCapture(event.pointerId);
      const start = vertical ? event.clientY : event.clientX;
      const from = current(name);
      handle.classList.add('dragging');
      document.body.classList.add('resizing', vertical ? 'rows' : 'columns');

      const move = (e) => set(name, from + sign * ((vertical ? e.clientY : e.clientX) - start));
      const end = () => {
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
        handle.classList.remove('dragging');
        document.body.classList.remove('resizing', 'rows', 'columns');
        save(sizes);
      };
      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    });

    handle.addEventListener('dblclick', () => {
      set(name, null);
      save(sizes);
    });

    handle.addEventListener('keydown', (event) => {
      const keys = vertical ? { ArrowUp: -1, ArrowDown: 1 } : { ArrowLeft: -1, ArrowRight: 1 };
      if (event.key in keys) {
        event.preventDefault();
        event.stopPropagation();
        set(name, current(name) + sign * keys[event.key] * (event.shiftKey ? 80 : 20));
        save(sizes);
      } else if (event.key === 'Enter') {
        event.preventDefault();
        set(name, null);
        save(sizes);
      }
    });
  }

  wire(rows, 'pc', true, 1);
  wire(columns, 'detail', false, -1);
  window.addEventListener('resize', apply);
  apply();

  // ---------- expanding a panel ----------

  const panels = { pc: pcPanel, detail, results: workspace.querySelector('.results-panel') };

  function expand(name) {
    const next = name && workspace.dataset.expanded !== name ? name : null;
    if (next) workspace.dataset.expanded = next;
    else delete workspace.dataset.expanded;
    for (const [key, panel] of Object.entries(panels)) panel.classList.toggle('expanded', key === next);
    for (const button of document.querySelectorAll('[data-expand]')) paint(button, button.dataset.expand === next);
    if (!next) apply();
  }

  pcPanel.querySelector('.panel-tools').append(expandButton('pc'));
  panels.results.querySelector('.panel-head').append(expandButton('results'));
  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-expand]');
    if (button) expand(button.dataset.expand);
  });
  // On a phone the panels are full width already, and stacked; an expanded one is put back.
  matchMedia('(max-width: 900px)').addEventListener('change', (e) => {
    if (e.matches) expand(null);
  });

  controller = {
    apply,
    expand,
    get expanded() {
      return workspace.dataset.expanded || null;
    },
  };
  return controller;
}

/** The expand button of a panel, showing whether that panel is the one expanded now. */
export function expandButton(name) {
  const button = el('button', { class: 'btn icon-only panel-expand', type: 'button', dataset: { expand: name } });
  paint(button, controller?.expanded === name);
  return button;
}

function paint(button, expanded) {
  const what = PANEL_NAMES[button.dataset.expand] || 'the panel';
  button.innerHTML = icon(expanded ? 'minimize' : 'maximize');
  button.title = expanded ? 'Put the panels back (Esc)' : `Expand ${what}`;
  button.setAttribute('aria-label', button.title);
  button.setAttribute('aria-pressed', String(expanded));
}

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { pc: Number.isFinite(saved.pc) ? saved.pc : null, detail: Number.isFinite(saved.detail) ? saved.detail : null };
  } catch (e) {
    return { pc: null, detail: null };
  }
}

function save(sizes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(sizes));
  } catch (e) { /* not remembered */ }
}
