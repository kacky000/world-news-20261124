// ink.mjs — a very small SVG writer built on tagged templates.
// Every interpolated value is escaped unless it is a Raw (the result of another svg`` call).

class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

const escape = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function flat(v) {
  if (v === null || v === undefined || v === false) return '';
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(flat).join('');
  if (typeof v === 'number') return String(Math.round(v * 100) / 100);
  return escape(v);
}

export function svg(strings, ...vals) {
  let out = strings[0];
  for (let i = 0; i < vals.length; i++) out += flat(vals[i]) + strings[i + 1];
  return new Raw(out);
}

export const raw = (s) => new Raw(s);
export const join = (parts) => new Raw(parts.map(flat).join(''));

// Rough average glyph widths (as a share of font size) for the faces used on the page.
const WIDTH = { cond: 0.47, sans: 0.53, serif: 0.5, mono: 0.6, heavy: 0.62 };

export function measure(text, size, face = 'sans') {
  let w = 0;
  for (const ch of String(text)) {
    let k = WIDTH[face] ?? 0.53;
    if ('il.,:;|!\'1 '.includes(ch)) k *= 0.55;
    else if ('MWmw@'.includes(ch)) k *= 1.45;
    else if (ch >= 'A' && ch <= 'Z') k *= 1.18;
    w += k * size;
  }
  return w;
}

// Greedy word wrap into at most maxLines lines; the last line gets an ellipsis if it overflows.
export function wrap(text, width, size, face = 'sans', maxLines = 9) {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const next = cur ? cur + ' ' + w : w;
    if (measure(next, size, face) <= width || !cur) cur = next;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    while (last.length > 1 && measure(last + '…', size, face) > width) last = last.slice(0, -1);
    kept[maxLines - 1] = last.replace(/[\s,;:]+$/, '') + '…';
    return kept;
  }
  return lines;
}

export const FONT = {
  cond: "Bahnschrift SemiCondensed, 'Arial Narrow', sans-serif",
  sans: "'Segoe UI', Arial, sans-serif",
  serif: "Georgia, 'Times New Roman', serif",
  mono: "Consolas, 'Courier New', monospace",
  heavy: "Bahnschrift, 'Arial Black', sans-serif",
};

// A block of wrapped text, returned with the height it used.
export function para(x, y, text, { width, size, face = 'sans', weight = 400, fill = '#111', lead = 1.18, max = 9, anchor = 'start' }) {
  const lines = wrap(text, width, size, face, max);
  const step = size * lead;
  const body = lines.map((ln, i) => svg`<tspan x="${x}" y="${y + size + i * step}">${ln}</tspan>`);
  return {
    node: svg`<text font-family="${raw(FONT[face])}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${body}</text>`,
    height: lines.length * step,
    lines: lines.length,
  };
}

export function label(x, y, text, { size = 12, face = 'sans', weight = 400, fill = '#111', anchor = 'start', spacing = 0, extra = '' } = {}) {
  return svg`<text x="${x}" y="${y}" font-family="${raw(FONT[face])}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}" letter-spacing="${spacing}" ${raw(extra)}>${text}</text>`;
}
