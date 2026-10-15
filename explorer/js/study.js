// Reading a study: data.csv, and where its pictures and models are.
//
// The columns are the ones Explorer Record writes, which are the ones Colibri wrote for Design
// Explorer, so studies from either open here:
//   in:Name    an input          out:Name   a result
//   img        the picture       img:View   one of several pictures (img_1 and img_2 work too)
//   threeD     the 3D model, a .glb
// Anything else is kept: a numeric column becomes an axis among the results, a "Rating" column
// fills in the stars, and text is shown with the design.

const d3 = () => window.d3;

const ABSOLUTE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

/** Splits "Span [m]" into a label and its unit, for axes that have little room. */
export function splitUnit(name) {
  const match = /^(.*?)\s*[[(]([^\])]{1,16})[\])]\s*$/.exec(name);
  return match ? { label: match[1] || name, unit: match[2] } : { label: name, unit: '' };
}

function classify(header) {
  const h = header.trim();
  let m;
  if ((m = /^in:\s*(.*)$/i.exec(h))) return { kind: 'in', name: m[1] || 'Input' };
  if ((m = /^out:\s*(.*)$/i.exec(h))) return { kind: 'out', name: m[1] || 'Result' };
  if (/^threed$/i.test(h)) return { kind: 'model' };
  if ((m = /^img(?:[:_ ]\s*(.*))?$/i.exec(h)) || /^image$/i.test(h)) {
    const label = m && m[1] ? (/^\d+$/.test(m[1]) ? `Image ${m[1]}` : m[1]) : 'Image';
    return { kind: 'image', name: label };
  }
  if (/^rating$/i.test(h)) return { kind: 'rating' };
  return { kind: 'other', name: h };
}

function toNumber(text) {
  if (text == null) return null;
  const t = String(text).trim();
  if (t === '' || /^(nan|null|none|-999)$/i.test(t)) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

/** Sorts text the way people expect: HEA160 before HEA1000, 2 before 10. */
const naturally = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' }).compare;

/**
 * Turns the text of data.csv into a study.
 * @param {string} text    the file
 * @param {object} source  {name, resolve(path) -> url|null, url?, kind}
 */
export function parseStudy(text, source) {
  const rows = d3().csvParseRows(text.replace(/^﻿/, '')).filter((row) => row.some((cell) => cell.trim() !== ''));
  if (rows.length < 2) throw new Error('data.csv has no designs in it.');

  const header = rows[0];
  const body = rows.slice(1);
  const warnings = [];
  const ragged = body.filter((row) => row.length !== header.length).length;
  if (ragged) {
    warnings.push(`${ragged} of the ${body.length} designs have ${ragged === 1 ? 'a row' : 'rows'} of a different length from the header of data.csv. ` +
      'Values that are missing are shown as no data, and extra ones are left out.');
  }
  const columns = header.map((h, index) => ({ index, header: h, ...classify(h) }));
  if (!columns.some((c) => c.kind === 'in' || c.kind === 'out')) {
    throw new Error('data.csv has no in: or out: columns, so it is not a design study.');
  }

  const dims = [];
  const notes = [];
  for (const column of columns) {
    if (column.kind !== 'in' && column.kind !== 'out' && column.kind !== 'other') continue;
    const raw = body.map((row) => row[column.index] ?? '');
    const numbers = raw.map(toNumber);
    const numeric = numbers.every((n) => n === null || Number.isFinite(n)) && numbers.some((n) => n !== null);

    let dim;
    if (numeric) {
      dim = { type: 'number', values: numbers };
    } else {
      const values = raw.map((t) => (t.trim() === '' ? null : t.trim()));
      const categories = [...new Set(values.filter((v) => v !== null))].sort(naturally);
      // A text column with a value per design is a description, not something to filter on.
      if (column.kind === 'other' && categories.length > Math.min(40, body.length * 0.8)) {
        notes.push(column);
        continue;
      }
      dim = { type: 'category', values, categories };
    }
    const { label, unit } = splitUnit(column.name);
    dims.push({ key: column.header, column: column.index, kind: column.kind === 'other' ? 'other' : column.kind, name: column.name, label, unit, ...dim });
  }

  const imageColumns = columns.filter((c) => c.kind === 'image');
  const modelColumn = columns.find((c) => c.kind === 'model');
  const ratingColumn = columns.find((c) => c.kind === 'rating');
  const inputDims = dims.filter((d) => d.kind === 'in');

  const designs = body.map((row, id) => ({
    id,
    // What identifies a design across sessions: its inputs, as Explorer Record keys it.
    key: inputDims.length ? inputDims.map((d) => (row[d.column] ?? '').trim()).join('\u001f') : `#${id}`,
    raw: row,
    images: imageColumns.map((c) => resolveCell(row[c.index], source)),
    // glTF only: Design Explorer's threeD was a Spectacles .json, which nothing reads any more.
    model: modelColumn && /\.(glb|gltf)(?:[?#].*)?$/i.test((row[modelColumn.index] ?? '').trim()) ? resolveCell(row[modelColumn.index], source) : null,
    initialRating: ratingColumn ? Math.round(Number(row[ratingColumn.index])) || 0 : 0,
  }));

  return {
    name: source.name || 'Study',
    source,
    header,
    dims,
    notes,
    warnings,
    designs,
    images: imageColumns.map((c) => ({ header: c.header, label: c.name })),
    hasImages: imageColumns.length > 0 && designs.some((d) => d.images.some(Boolean)),
    hasModel: !!modelColumn && designs.some((d) => d.model),
    // Settings are remembered per study: the same columns in a folder of the same name.
    storageKey: `${source.name || 'Study'}|${header.join(',')}`,
  };
}

function resolveCell(value, source) {
  const text = (value ?? '').trim();
  if (!text || /^(0|null|none)$/i.test(text)) return null;
  return source.resolve(text);
}

// ---------- sources ----------

/** A study on the web, by the address of its folder or of its data.csv. */
export async function openUrl(raw) {
  const address = githubToRaw(raw.trim());
  const page = new URL(location.href);
  let csvUrl;
  let base;
  if (/\.csv(?:[?#].*)?$/i.test(address)) {
    csvUrl = new URL(address, page);
    base = new URL('.', csvUrl);
  } else {
    base = new URL(address.endsWith('/') ? address : `${address}/`, page);
    csvUrl = new URL('data.csv', base);
  }

  let response;
  try {
    response = await fetch(csvUrl, { cache: 'no-cache' });
  } catch (error) {
    throw new Error(`Could not reach ${csvUrl.href}. The server may not allow other pages to read it.`);
  }
  if (!response.ok) throw new Error(`Could not read ${csvUrl.href} (${response.status} ${response.statusText}).`);
  const text = await response.text();
  // Some hosts answer any address with their home page, and a GitHub page is not its raw file.
  if (/text\/html/i.test(response.headers.get('content-type') || '') || /^\s*</.test(text)) {
    throw new Error(`${csvUrl.href} is a web page, not a study's data.csv. Give the address of the folder holding data.csv, or of data.csv itself.`);
  }

  const parts = base.pathname.split('/').filter(Boolean);
  return {
    text,
    source: {
      kind: 'url',
      url: address,
      name: decodeURIComponent(parts[parts.length - 1] || base.hostname),
      resolve: (path) => (ABSOLUTE.test(path) ? path : new URL(path, base).href),
    },
  };
}

/** A GitHub page address of a folder or a file, as the raw address its files are served from. */
function githubToRaw(address) {
  const m = /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/(?:tree|blob)\/([^/]+)\/?(.*)$/i.exec(address);
  return m ? `https://raw.githubusercontent.com/${m[1]}/${m[2]}/${m[3]}/${m[4]}` : address;
}

/**
 * A study from files on this computer: a dropped or chosen folder, or just a data.csv.
 * The files are read where they are; pictures and models are shown through object URLs.
 * @param {{path: string, file: File}[]} entries
 */
export async function openFiles(entries) {
  const csvs = entries.filter((e) => /(^|\/)data\.csv$/i.test(e.path));
  const candidates = csvs.length ? csvs : entries.filter((e) => /\.csv$/i.test(e.path));
  if (!candidates.length) throw new Error('There is no data.csv in what was opened.');
  candidates.sort((a, b) => depth(a.path) - depth(b.path));
  const csv = candidates[0];

  const folder = csv.path.includes('/') ? csv.path.slice(0, csv.path.lastIndexOf('/') + 1) : '';
  const byPath = new Map();
  const byName = new Map();
  for (const entry of entries) {
    byPath.set(entry.path.toLowerCase(), entry.file);
    const name = entry.path.slice(entry.path.lastIndexOf('/') + 1).toLowerCase();
    if (!byName.has(name)) byName.set(name, entry.file);
  }
  const urls = new Map();

  const folderName = folder ? folder.split('/').filter(Boolean).pop() : '';
  const fileName = csv.file.name.replace(/\.csv$/i, '');
  const text = await csv.file.text();
  const onlyCsv = entries.length === 1;

  return {
    text,
    onlyCsv,
    source: {
      kind: 'files',
      name: folderName || (fileName.toLowerCase() === 'data' ? 'Study' : fileName),
      resolve: (path) => {
        if (ABSOLUTE.test(path)) return path;
        const clean = normalise(folder + path.replace(/\\/g, '/'));
        const file = byPath.get(clean.toLowerCase()) || byName.get(clean.slice(clean.lastIndexOf('/') + 1).toLowerCase());
        if (!file) return null;
        if (!urls.has(file)) urls.set(file, URL.createObjectURL(file));
        return urls.get(file);
      },
      release: () => {
        for (const url of urls.values()) URL.revokeObjectURL(url);
      },
    },
  };
}

function depth(path) {
  return path.split('/').length;
}

function normalise(path) {
  const parts = [];
  for (const part of path.split('/')) {
    if (part === '' || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return parts.join('/');
}

/** The files of a <input type=file webkitdirectory> or a plain file input. */
export function entriesFromInput(fileList) {
  return [...fileList].map((file) => ({ path: file.webkitRelativePath || file.name, file }));
}

/** The files of a drop: a folder is walked, however deep. */
export async function entriesFromDrop(dataTransfer) {
  const items = [...(dataTransfer.items || [])];
  const roots = items.map((item) => (item.webkitGetAsEntry ? item.webkitGetAsEntry() : null)).filter(Boolean);
  if (!roots.length) return [...dataTransfer.files].map((file) => ({ path: file.name, file }));

  const entries = [];
  const walk = async (entry, prefix) => {
    if (entry.isFile) {
      const file = await new Promise((resolve, reject) => entry.file(resolve, reject));
      entries.push({ path: prefix + file.name, file });
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      for (;;) {
        const batch = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
        if (!batch.length) break;
        for (const child of batch) await walk(child, `${prefix}${entry.name}/`);
      }
    }
  };
  for (const root of roots) await walk(root, '');
  return entries;
}
