// Alpaca4d Explorer: opening a study and everything around the three views.

import { Explorer, PALETTES } from './state.js';
import { parseStudy, openUrl, openFiles, entriesFromDrop, entriesFromInput } from './study.js';
import { ParCoords } from './parcoords.js';
import { Results } from './results.js';
import { Detail } from './detail.js';
import { wireLayout } from './layout.js';
import { hydrateIcons, toast, openMenu, closeMenus, download, el, icon, fmt } from './ui.js';

const SAMPLE = 'sample/footbridge/';
// A light design that passes, so the sample behind the welcome card shows a design panel.
const SAMPLE_DESIGN = 25;
const $ = (id) => document.getElementById(id);

const explorer = new Explorer();
let views = null;
let layout = null;

// ---------- opening a study ----------

/**
 * Opens a study; true when it opened. Behind the welcome card it opens quietly: what goes wrong
 * there is for the console, not for someone who has not asked for anything yet.
 */
async function load(open, { design = 0, behindWelcome = false } = {}) {
  document.body.style.cursor = 'progress';
  try {
    const { text, source, onlyCsv } = await open();
    source.onlyCsv = !!onlyCsv;
    const study = parseStudy(text, source);
    show(study, behindWelcome);
    if (design > 0 && design <= study.designs.length) explorer.select(design - 1);
    if (behindWelcome) return true;
    for (const warning of study.warnings) toast(warning, 'info', 9000);
    const wantsFiles = (study.images.length && !study.hasImages) || (study.header.some((h) => /^threed$/i.test(h.trim())) && !study.hasModel);
    if (onlyCsv && wantsFiles) toast('Only data.csv was opened, so its pictures and models cannot be found. Open the whole folder to see them.', 'info', 7000);
    return true;
  } catch (error) {
    console.error(error);
    if (!behindWelcome) toast(error.message || String(error), 'error', 8000);
    return false;
  } finally {
    document.body.style.cursor = '';
  }
}

function show(study, behindWelcome) {
  $('workspace').hidden = false;
  layout.apply();
  for (const button of document.querySelectorAll('.needs-study')) button.disabled = false;

  if (!views) {
    views = {
      pc: new ParCoords($('pc'), explorer),
      results: new Results($('results'), $('results-tools'), document.querySelector('.results-panel .tabs'), explorer),
      detail: new Detail($('detail'), explorer),
    };
  }
  explorer.setStudy(study);
  setWelcome(behindWelcome);
  updateAddress();
}

/** The welcome card, over the study (if one opened) that waits behind it. */
function setWelcome(open) {
  $('welcome').hidden = !open;
  $('workspace').inert = open;
  document.body.classList.toggle('welcoming', open);
  $('welcome-close').hidden = !explorer.study;
  document.title = explorer.study && !open ? `${explorer.study.name} · Alpaca4d Explorer` : 'Alpaca4d Explorer';
}

function closeWelcome() {
  setWelcome(false);
  updateAddress();
}

/**
 * Keeps the address bar pointing at a study opened from the web, so it can be bookmarked. Not the
 * sample behind the welcome card: the plain address is the one that shows the card.
 */
function updateAddress() {
  const study = explorer.study;
  const url = new URL(location.href);
  url.search = '';
  if (study?.source.kind === 'url' && $('welcome').hidden) {
    url.searchParams.set('study', study.source.url);
    if (explorer.selected != null) url.searchParams.set('design', String(explorer.selected + 1));
  }
  history.replaceState(null, '', url);
}

// ---------- chrome that follows the study ----------

explorer.subscribe((reasons) => {
  const x = explorer;
  if (!x.study) return;
  const total = x.study.designs.length;
  const aside = x.excluded.size;
  $('filter-count').textContent = x.filtered.length === total
    ? `${total.toLocaleString()} designs`
    : `${x.filtered.length.toLocaleString()} of ${total.toLocaleString()}${aside ? ` · ${aside.toLocaleString()} set aside` : ''}`;
  $('filter-count').classList.toggle('accent', x.filtered.length !== total);

  const narrowed = x.filters.size > 0 || x.paretoOnly;
  $('reset-button').disabled = !narrowed && !aside;
  $('exclude-button').disabled = !narrowed || !x.filtered.length;
  $('keep-button').disabled = !narrowed || !x.filtered.length;
  $('pareto-chip').setAttribute('aria-pressed', String(x.paretoOnly));
  $('pareto-chip').title = x.goals.size
    ? `Keep only the ${x.pareto.size} designs no other design beats on every goal`
    : 'Set goals first: click a result’s name on the axes, then Minimise or Maximise';

  if (['study', 'colour', 'goals', 'excluded', 'theme'].some((r) => reasons.has(r))) renderLegend();
  if (reasons.has('select')) updateAddress();
});

function renderLegend() {
  const x = explorer;
  const legend = $('legend');
  const scale = x.colourScale;
  if (!scale) {
    legend.replaceChildren();
    return;
  }
  const name = el('span', { class: 'legend-name', title: `Coloured by ${scale.dim.name}` }, scale.dim.label);
  if (scale.categorical) {
    const shown = scale.dim.categories.slice(0, 8);
    legend.replaceChildren(name, el('span', { class: 'legend-swatches' },
      shown.map((c) => el('span', {}, el('i', { style: { background: scale.colour(c) } }), c)),
      scale.dim.categories.length > shown.length ? el('span', { class: 'muted' }, `+${scale.dim.categories.length - shown.length}`) : ''));
    return;
  }
  const stops = Array.from({ length: 11 }, (_, i) => scale.interpolate(i / 10));
  const ramp = el('span', { class: 'legend-ramp', style: { background: `linear-gradient(90deg, ${(scale.reversed ? [...stops].reverse() : stops).join(',')})` } });
  const palette = el('select', { 'aria-label': 'Colours', title: 'Colours', onchange: (e) => x.setPalette(e.target.value) },
    Object.entries(PALETTES).map(([key, p]) => el('option', { value: key, selected: key === x.palette }, p.name)));
  legend.replaceChildren(name,
    el('span', { class: 'legend-values' }, fmt(scale.min)),
    ramp,
    el('span', { class: 'legend-values' }, `${fmt(scale.max)}${scale.dim.unit ? ` ${scale.dim.unit}` : ''}`),
    palette);
}

function renderAxesMenu() {
  const x = explorer;
  const menu = $('axes-menu');
  const kinds = { in: 'input', out: 'result', other: '' };
  menu.replaceChildren(
    el('div', { class: 'menu-label' }, 'Axes'),
    x.order.map((key) => {
      const dim = x.dim(key);
      const box = el('input', { type: 'checkbox', checked: !x.hidden.has(key), onchange: (e) => x.setHidden(key, !e.target.checked) });
      return el('label', {}, box, el('span', {}, dim.name), el('span', { class: 'kind' }, kinds[dim.kind]));
    }),
    el('hr'),
    el('button', {
      html: `${icon('reset')}<span>Show all, in the study’s order</span>`,
      onclick: () => {
        for (const key of [...x.hidden]) x.hidden.delete(key);
        x.reorder(x.study.dims.map((d) => d.key));
        closeMenus();
      },
    }));
}

// ---------- actions ----------

function exportCsv() {
  const x = explorer;
  const study = x.study;
  const ratingIndex = study.header.findIndex((h) => /^rating$/i.test(h.trim()));
  const header = ratingIndex >= 0 ? study.header : [...study.header, 'Rating'];
  const rows = x.sorted.map((design) => {
    const row = [...design.raw];
    while (row.length < study.header.length) row.push('');
    const stars = x.rating(design);
    if (ratingIndex >= 0) row[ratingIndex] = stars ? String(stars) : '';
    else row.push(stars ? String(stars) : '');
    return row;
  });
  const safe = study.name.replace(/[^\w.-]+/g, '-').replace(/^-|-$/g, '') || 'study';
  download(`${safe}-${rows.length}-designs.csv`, window.d3.csvFormatRows([header, ...rows]));
  toast(`Exported ${rows.length.toLocaleString()} designs, with their ratings.`);
}

function toggleTheme() {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  root.dataset.theme = dark ? 'light' : 'dark';
  try {
    localStorage.setItem('alpaca4d-explorer:theme', root.dataset.theme);
  } catch (e) { /* not remembered */ }
  if (explorer.study) explorer.changed('theme');
}

function runAction(action) {
  closeMenus();
  if (action === 'open-folder') $('folder-input').click();
  else if (action === 'open-csv') $('csv-input').click();
  else if (action === 'open-sample') load(() => openUrl(SAMPLE));
  else if (action === 'open-url') {
    $('url-dialog-input').value = explorer.study?.source.kind === 'url' ? explorer.study.source.url : '';
    $('url-dialog').showModal();
  }
}

// ---------- wiring ----------

function wire() {
  hydrateIcons();
  layout = wireLayout($('workspace'));

  document.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (target) runAction(target.dataset.action);
  });

  $('open-menu-button').addEventListener('click', () => {
    if ($('open-menu').hidden) openMenu($('open-menu-button'), $('open-menu'));
    else closeMenus();
  });
  $('axes-button').addEventListener('click', () => {
    if (!$('axes-menu').hidden) return closeMenus();
    renderAxesMenu();
    openMenu($('axes-button'), $('axes-menu'));
  });

  $('folder-input').addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length) load(() => openFiles(entriesFromInput(files)));
    event.target.value = '';
  });
  $('csv-input').addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length) load(() => openFiles(entriesFromInput(files)));
    event.target.value = '';
  });

  $('url-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const value = $('url-input').value;
    load(() => openUrl(value));
  });
  $('url-dialog').addEventListener('close', () => {
    const dialog = $('url-dialog');
    if (dialog.returnValue === 'open' && $('url-dialog-input').value) {
      const value = $('url-dialog-input').value;
      load(() => openUrl(value));
    }
  });

  $('welcome-close').addEventListener('click', closeWelcome);
  $('theme-button').addEventListener('click', toggleTheme);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => explorer.study && explorer.changed('theme'));
  $('export-button').addEventListener('click', exportCsv);

  $('reset-button').addEventListener('click', () => explorer.resetAll());
  $('exclude-button').addEventListener('click', () => explorer.excludeFiltered());
  $('keep-button').addEventListener('click', () => explorer.keepFiltered());
  $('pareto-chip').addEventListener('click', () => {
    if (!explorer.goals.size) {
      toast('Give two or more results a goal first: click a result’s name on the axes and pick Minimise or Maximise.', 'info', 7000);
      return;
    }
    explorer.setParetoOnly(!explorer.paretoOnly);
  });

  wireDrop();
  wireKeys();
}

function wireDrop() {
  const overlay = $('drop-overlay');
  const zone = $('dropzone');
  let depth = 0;
  const hasFiles = (event) => [...(event.dataTransfer?.types || [])].includes('Files');

  window.addEventListener('dragenter', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth++;
    if ($('welcome').hidden) overlay.hidden = false;
    else zone.classList.add('over');
  });
  window.addEventListener('dragover', (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  window.addEventListener('dragleave', () => {
    depth = Math.max(0, depth - 1);
    if (!depth) {
      overlay.hidden = true;
      zone.classList.remove('over');
    }
  });
  window.addEventListener('drop', async (event) => {
    if (!hasFiles(event)) return;
    event.preventDefault();
    depth = 0;
    overlay.hidden = true;
    zone.classList.remove('over');
    const entries = await entriesFromDrop(event.dataTransfer);
    load(() => openFiles(entries));
  });
  zone.addEventListener('keydown', (event) => {
    // Only the zone itself: the address field inside it takes its own keys.
    if (event.target !== zone) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      $('folder-input').click();
    }
  });
}

function wireKeys() {
  document.addEventListener('keydown', (event) => {
    if (!explorer.study || event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.target.closest('input, select, textarea, dialog[open]')) return;
    // Over the sample, the keys are the card's: Esc puts it away, the rest wait for it to go.
    if (!$('welcome').hidden) {
      if (event.key === 'Escape') closeWelcome();
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      explorer.step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      explorer.step(-1);
    } else if (event.key === 'Escape') {
      closeMenus();
      // Esc first puts an expanded panel back, and only then closes the design.
      if (layout.expanded) layout.expand(null);
      else explorer.select(null);
    } else if (/^[0-5]$/.test(event.key) && explorer.selected != null) {
      explorer.rate(explorer.study.designs[explorer.selected], Number(event.key));
    }
  });
}

async function start() {
  wire();
  const params = new URLSearchParams(location.search);
  const address = params.get('study');
  const opened = address && await load(() => openUrl(address), { design: Number(params.get('design')) || 0 });
  // No study asked for, or it would not open: the welcome card, over the sample, with the
  // address that failed in its field to put right.
  if (address && !opened) $('url-input').value = address;
  if (!opened) load(() => openUrl(SAMPLE), { design: SAMPLE_DESIGN, behindWelcome: true });
}

if (window.d3) start();
else window.addEventListener('load', start, { once: true });
