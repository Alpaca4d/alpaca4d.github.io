// Small helpers shared by every view: icons, elements, number formatting, tooltip, toasts.

const ICONS = {
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/>',
  sparkle: '<path d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8z"/><path d="M19 14.5l.7 2 2 .7-2 .8-.7 2-.8-2-2-.8 2-.7z"/>',
  download: '<path d="M12 4v11"/><path d="M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
  upload: '<path d="M12 16V5"/><path d="M7 10l5-5 5 5"/><path d="M5 20h14"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
  columns: '<path d="M5 4v16M12 4v16M19 4v16"/>',
  'minus-circle': '<circle cx="12" cy="12" r="9"/><path d="M8 12h8"/>',
  zoom: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/><path d="M8.5 11h5M11 8.5v5"/>',
  reset: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.3h4.3"/>',
  grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
  table: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M3.5 14.5h17M9.5 9.5v10"/>',
  scatter: '<path d="M4 4v16h16"/><circle cx="9" cy="14" r="1.6" fill="currentColor"/><circle cx="12.5" cy="9" r="1.6" fill="currentColor"/><circle cx="17" cy="12.5" r="1.6" fill="currentColor"/><circle cx="16.5" cy="6.5" r="1.6" fill="currentColor"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  'chevron-left': '<path d="M15 5l-7 7 7 7"/>',
  'chevron-right': '<path d="M9 5l7 7-7 7"/>',
  star: '<path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" fill="currentColor" stroke-width="1"/>',
  image: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M20.5 16l-5-5-8 8.5"/>',
  cube: '<path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5l8 4.5 8-4.5M12 12v9"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  'eye-off': '<path d="M3 3l18 18"/><path d="M10.6 6.1A9.6 9.6 0 0 1 12 6c5 0 9 6 9 6a16.8 16.8 0 0 1-3 3.4M6.6 6.6A16.6 16.6 0 0 0 3 12s4 6 9 6a9.6 9.6 0 0 0 4.4-1.1"/>',
  flip: '<path d="M8 20V4M8 4L5 7M8 4l3 3"/><path d="M16 4v16M16 20l-3-3M16 20l3-3"/>',
  'arrow-down': '<path d="M12 5v14M6 13l6 6 6-6"/>',
  'arrow-up': '<path d="M12 19V5M6 11l6-6 6 6"/>',
  check: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  log: '<path d="M4 20c5-.5 7-5 8-9s3-6.5 8-7"/><path d="M4 4v16h16"/>',
  paint: '<circle cx="12" cy="12" r="9"/><circle cx="8" cy="10.5" r="1.3" fill="currentColor"/><circle cx="12" cy="7.5" r="1.3" fill="currentColor"/><circle cx="16" cy="10.5" r="1.3" fill="currentColor"/><path d="M12 21a3 3 0 0 1 0-6"/>',
  tag: '<path d="M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/>',
  maximize: '<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  minimize: '<path d="M4 14h6v6M20 10h-6V4M14 10l7-7M3 21l7-7"/>',
  pointer: '<path d="M9 9l5 12 1.8-5.2L21 14z"/><path d="M7.2 2.2L8 5.1M5.1 8l-2.9-.8M14 4.1L12 6M6 12l-1.9 2"/>',
  'filter-off': '<path d="M4 5h16l-6 7v6l-4 2v-8z"/><path d="M3 3l18 18"/>',
  'sort-asc': '<path d="M7 18V6M4 9l3-3 3 3"/><path d="M13 7h7M13 12h5M13 17h3"/>',
  'sort-desc': '<path d="M7 6v12M4 15l3 3 3-3"/><path d="M13 7h3M13 12h5M13 17h7"/>',
};

export function icon(name, className = 'icon') {
  const body = ICONS[name] || '';
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/** Fills every [data-icon] placeholder under root with its icon. */
export function hydrateIcons(root = document) {
  for (const node of root.querySelectorAll('[data-icon]')) {
    if (node.dataset.hydrated) continue;
    node.insertAdjacentHTML('afterbegin', icon(node.dataset.icon));
    node.dataset.hydrated = '1';
  }
}

/** Makes an element: el('button', {class: 'btn', onclick}, 'text', child). */
export function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value == null || value === false) continue;
    if (key.startsWith('on') && typeof value === 'function') node.addEventListener(key.slice(2), value);
    else if (key === 'html') node.innerHTML = value;
    else if (key === 'dataset') Object.assign(node.dataset, value);
    else if (key === 'style' && typeof value === 'object') Object.assign(node.style, value);
    else node.setAttribute(key, value === true ? '' : value);
  }
  for (const child of children.flat(Infinity)) {
    if (child == null || child === false) continue;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
  return node;
}

export function escapeHtml(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** A number as people read it: four significant figures, thousands separated, no trailing zeros. */
export function fmt(value) {
  if (value == null || (typeof value === 'number' && Number.isNaN(value))) return '–';
  if (typeof value !== 'number') return String(value);
  const d3 = window.d3;
  const a = Math.abs(value);
  if (a !== 0 && (a >= 1e7 || a < 1e-3)) return d3.format('.3~e')(value);
  if (a >= 1000) return d3.format(',.0f')(value);
  return d3.format('.4~r')(value);
}

/** The value of a CSS custom property, as the current theme has it. */
export function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/** Runs fn at most once per animation frame, with the latest arguments. */
export function perFrame(fn) {
  let queued = false;
  let last;
  return (...args) => {
    last = args;
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      fn(...last);
    });
  };
}

export function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

const tooltipNode = () => document.getElementById('tooltip');

export const tooltip = {
  show(html, x, y) {
    const node = tooltipNode();
    node.innerHTML = html;
    node.hidden = false;
    const rect = node.getBoundingClientRect();
    let left = x + 14;
    let top = y + 14;
    if (left + rect.width > window.innerWidth - 8) left = x - rect.width - 14;
    if (top + rect.height > window.innerHeight - 8) top = y - rect.height - 14;
    node.style.left = `${Math.max(8, left)}px`;
    node.style.top = `${Math.max(8, top)}px`;
  },
  hide() {
    tooltipNode().hidden = true;
  },
};

export function toast(message, kind = 'info', ms = 4200) {
  const node = el('div', { class: `toast ${kind}`, role: kind === 'error' ? 'alert' : 'status' }, message);
  document.getElementById('toasts').append(node);
  setTimeout(() => node.remove(), ms);
}

export function download(filename, text, type = 'text/csv') {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = el('a', { href: url, download: filename });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Opens a menu under its button, and closes it on a click outside, on Escape or on a choice.
 * Returns a function that closes it.
 */
export function openMenu(button, menu) {
  closeMenus();
  menu.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  const close = () => {
    menu.hidden = true;
    button.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', outside, true);
    document.removeEventListener('keydown', escape, true);
    openMenus.delete(close);
  };
  const outside = (event) => {
    if (!menu.contains(event.target) && !button.contains(event.target)) close();
  };
  const escape = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      close();
      button.focus();
    }
  };
  setTimeout(() => {
    document.addEventListener('pointerdown', outside, true);
    document.addEventListener('keydown', escape, true);
  });
  openMenus.add(close);
  menu.querySelector('button, input, select')?.focus({ preventScroll: true });
  return close;
}

const openMenus = new Set();
export function closeMenus() {
  for (const close of [...openMenus]) close();
}

/** A floating menu at a point on the page, for the axis options. */
export function popupMenu(x, y, items) {
  closeMenus();
  const menu = el('div', { class: 'menu', role: 'menu', style: { position: 'fixed', left: `${x}px`, top: `${y}px` } });
  for (const item of items) {
    if (item === '-') menu.append(el('hr'));
    else if (item.label && !item.onclick) menu.append(el('div', { class: 'menu-label' }, item.label));
    else {
      menu.append(el('button', {
        role: item.checked != null ? 'menuitemcheckbox' : 'menuitem',
        'aria-checked': item.checked != null ? String(!!item.checked) : null,
        disabled: item.disabled,
        html: `${icon(item.icon || (item.checked ? 'check' : ''))}<span>${escapeHtml(item.text)}</span>`,
        onclick: () => {
          close();
          item.onclick();
        },
      }));
    }
  }
  document.body.append(menu);
  const rect = menu.getBoundingClientRect();
  if (rect.right > window.innerWidth - 8) menu.style.left = `${Math.max(8, window.innerWidth - rect.width - 8)}px`;
  if (rect.bottom > window.innerHeight - 8) menu.style.top = `${Math.max(8, y - rect.height - 12)}px`;
  const anchor = { contains: () => false, setAttribute() {}, focus() {} };
  const closeMenu = openMenu(anchor, menu);
  const close = () => {
    closeMenu();
    menu.remove();
  };
  // openMenu hides it; removing it as well keeps the page clean.
  const observer = new MutationObserver(() => {
    if (menu.hidden) {
      observer.disconnect();
      menu.remove();
    }
  });
  observer.observe(menu, { attributes: true, attributeFilter: ['hidden'] });
  return close;
}
