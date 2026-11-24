// sheet.mjs — lays the day's stories out on one 1024 x 1024 page and writes art/front-page.html.
// Run: node art/sheet.mjs
import { writeFileSync } from 'node:fs';
import { svg, join, raw, para, label, measure, FONT } from './ink.mjs';
import { mark, scene } from './marks.mjs';
import { makeMap } from './globe.mjs';
import { DAY, STORIES, LEFT_OUT, SOURCES } from './news.mjs';

const W = 1024, H = 1024, PAD = 18;
const INK = '#14161c', PAPER = '#f7f3ea', RULE = '#1b1b1f';

const TAGS = {
  CONFIRMED: { c: '#1d7f46', note: 'seen and reported by several outlets' },
  OFFICIAL: { c: '#1f58b8', note: 'stated by a government or agency' },
  REPORTED: { c: '#b77900', note: 'one outlet so far' },
  CLAIM: { c: '#8b3bb3', note: 'one side says so; not verified' },
  FORECAST: { c: '#5f6673', note: 'on the day’s official schedule' },
};
const REGIONS = {
  ASIA: '#d1462f', 'MIDDLE EAST': '#c98a12', AFRICA: '#2f8f5b', EUROPE: '#2c62c4',
  'N. AMERICA': '#7a3fb0', 'LATIN AMERICA': '#c23d7e', OCEANIA: '#178a9e',
};

const ABBR = { ASIA: 'ASIA', 'MIDDLE EAST': 'MIDEAST', AFRICA: 'AFRICA', EUROPE: 'EUROPE', 'N. AMERICA': 'N.AM', 'LATIN AMERICA': 'LATAM', OCEANIA: 'OCEANIA' };

// Number every story in page order: leads, then cards, then briefs.
const order = { lead: 0, card: 1, brief: 2 };
const all = STORIES.map((s, i) => ({ ...s, i })).sort((a, b) => order[a.kind] - order[b.kind] || a.i - b.i);
all.forEach((s, k) => { s.n = k + 1; });
const leads = all.filter((s) => s.kind === 'lead');
const cards = all.filter((s) => s.kind === 'card');
const briefs = all.filter((s) => s.kind === 'brief');
const regionCount = new Set(all.map((s) => s.region)).size;
const fields = new Set(all.map((s) => s.field));

for (const s of all) {
  if (!TAGS[s.tag]) throw new Error(`story ${s.n}: unknown tag ${s.tag}`);
  if (!REGIONS[s.region]) throw new Error(`story ${s.n}: unknown region ${s.region}`);
}

const parts = [];
const add = (x) => parts.push(x);

// ---------- masthead ----------
add(svg`<rect width="${W}" height="${H}" fill="${PAPER}"/>`);
add(svg`<rect width="${W}" height="148" fill="${INK}"/>`);
add(label(PAD, 30, 'THE WORLD ON ONE PAGE · DAILY EDITION · 00:00–24:00 UTC', { size: 13, face: 'cond', weight: 700, fill: '#9aa3b5', spacing: 1.5 }));
add(label(PAD, 62, DAY.weekday, { size: 34, face: 'heavy', weight: 700, fill: '#ffcf3a', spacing: 3 }));
add(svg`<text x="${PAD - 3}" y="136" font-family="${raw(FONT.heavy)}" font-size="84" font-weight="700" fill="#ffffff" textLength="600" lengthAdjust="spacingAndGlyphs">${DAY.big}</text>`);

const stats = [[all.length, 'STORIES'], [regionCount, 'REGIONS'], [fields.size, 'FIELDS']];
stats.forEach(([v, k], i) => {
  const x = 650 + i * 122;
  add(svg`<rect x="${x}" y="22" width="112" height="98" fill="none" stroke="#3a3f4c" stroke-width="1.5"/>`);
  add(label(x + 56, 86, String(v), { size: 58, face: 'heavy', weight: 700, fill: '#ffffff', anchor: 'middle' }));
  add(label(x + 56, 110, k, { size: 15, face: 'cond', weight: 700, fill: '#ffcf3a', anchor: 'middle', spacing: 2 }));
});
add(label(650 + 178, 140, `TODAY IS ${DAY.iso} · NOT A DAY EARLIER, NOT A DAY LATER`, { size: 10.5, face: 'cond', weight: 700, fill: '#9aa3b5', anchor: 'middle', spacing: 1 }));

// ---------- the promise band ----------
add(svg`<rect y="148" width="${W}" height="26" fill="#ffcf3a"/>`);
add(label(W / 2, 167, `${all.length} STORIES · ${regionCount} REGIONS · ${fields.size} FIELDS · EVERY ONE FROM THIS ${DAY.weekday}, ${DAY.big}`,
  { size: 15.5, face: 'cond', weight: 700, fill: INK, anchor: 'middle', spacing: 1.2 }));

// ---------- the day in UTC ----------
{
  const y0 = 182, x0 = 132, x1 = W - PAD - 8;
  add(svg`<rect x="${PAD}" y="${y0}" width="${W - 2 * PAD}" height="50" fill="#ffffff" stroke="${RULE}" stroke-width="1"/>`);
  add(label(PAD + 8, y0 + 21, 'THE DAY', { size: 14, face: 'heavy', weight: 700, fill: INK }));
  add(label(PAD + 8, y0 + 39, 'IN UTC', { size: 14, face: 'heavy', weight: 700, fill: '#d1462f' }));
  const tx = (t) => { const [h, m] = t.split(':').map(Number); return x0 + ((h * 60 + m) / 1440) * (x1 - x0); };
  const axisY = y0 + 30;
  add(svg`<path d="M${x0} ${axisY} H${x1}" stroke="${RULE}" stroke-width="1.5"/>`);
  for (let h = 0; h <= 24; h += 3) {
    const x = x0 + (h / 24) * (x1 - x0);
    add(svg`<path d="M${x} ${axisY - 3} V${axisY + 3}" stroke="${RULE}" stroke-width="1.2"/>`);
    add(label(x, axisY + 15, String(h).padStart(2, '0'), { size: 9.5, face: 'mono', fill: '#555', anchor: 'middle' }));
  }
  const timed = all.filter((s) => s.t).sort((a, b) => a.t.localeCompare(b.t));
  // Labels go above or below the axis, whichever side has room; a label is cut to the room it has.
  const free = { up: -99, down: -99 };
  const marks = [];
  for (const s of timed) {
    const x = tx(s.t);
    const side = free.up <= x + 9 ? 'up' : free.down <= x + 9 ? 'down' : (free.up < free.down ? 'up' : 'down');
    const nextSame = timed.filter((o) => o !== s && tx(o.t) > x).map((o) => tx(o.t));
    let txt = `${s.t} ${s.short ?? s.head}`;
    const limit = Math.min(x1 + 6, (nextSame[1] ?? x1 + 6) - 6) - (x + 10);
    while (measure(txt, 9.5, 'cond') > limit && txt.length > 6) txt = txt.slice(0, -1);
    free[side] = x + 10 + measure(txt, 9.5, 'cond') + 4;
    marks.push(label(x + 10, side === 'up' ? axisY - 7 : axisY + 15, txt, { size: 9.5, face: 'cond', weight: 700, fill: INK }));
    const c = REGIONS[s.region];
    marks.push(svg`<circle cx="${x}" cy="${axisY}" r="7.5" fill="${c}" stroke="#fff" stroke-width="1.2"/>`);
    marks.push(label(x, axisY + 3.3, String(s.n), { size: 9, face: 'cond', weight: 700, fill: '#fff', anchor: 'middle' }));
  }
  add(join(marks));
}

// ---------- chips ----------
function chip(x, y, s, size = 10) {
  const t = TAGS[s.tag];
  const w1 = measure(s.tag, size, 'cond') + 10;
  const src = `${s.src}`;
  return join([
    svg`<rect x="${x}" y="${y}" width="${w1}" height="${size + 5}" fill="${t.c}"/>`,
    label(x + 5, y + size + 1, s.tag, { size, face: 'cond', weight: 700, fill: '#fff' }),
    label(x + w1 + 5, y + size + 1, src, { size, face: 'cond', weight: 700, fill: '#444' }),
  ]);
}
function meta(x, y, s, size = 10) {
  return label(x, y, `${s.region}${s.t ? ' · ' + s.t + ' UTC' : ''} · ${s.field}`, { size, face: 'cond', weight: 700, fill: REGIONS[s.region], spacing: 0.6 });
}
function badge(x, y, n, r = 11, fill = INK) {
  return join([
    svg`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`,
    label(x, y + r * 0.36, String(n), { size: r * 1.05, face: 'heavy', weight: 700, fill: '#fff', anchor: 'middle' }),
  ]);
}

// ---------- leads ----------
{
  const y0 = 240, hgt = 246, gap = 10;
  const n = leads.length;
  const w = (W - 2 * PAD - gap * (n - 1)) / n;
  leads.forEach((s, i) => {
    const x = PAD + i * (w + gap);
    add(svg`<rect x="${x}" y="${y0}" width="${w}" height="${hgt}" fill="#ffffff" stroke="${RULE}" stroke-width="1.2"/>`);
    const picH = 92;
    add(scene(s.pic, x + 1, y0 + 1, w - 2, picH, s.sky ?? '#cfe0ee', REGIONS[s.region]));
    add(badge(x + 16, y0 + 16, s.n, 12, REGIONS[s.region]));
    add(meta(x + 10, y0 + picH + 16, s, 10.5));
    const hd = para(x + 10, y0 + picH + 19, s.head, { width: w - 18, size: 17.5, face: 'heavy', weight: 700, fill: INK, lead: 1.06, max: 3 });
    add(hd.node);
    // the summary gets whatever lines fit between the headline and the tag chip
    const top = y0 + picH + 24 + hd.height, room = y0 + hgt - 24 - top;
    const sb = para(x + 10, top, s.sub, { width: w - 18, size: 11.6, face: 'sans', fill: '#2b2b2b', lead: 1.2, max: Math.max(1, Math.floor(room / (11.6 * 1.2))) });
    add(sb.node);
    add(chip(x + 10, y0 + hgt - 20, s, 10));
  });
}

// ---------- cards ----------
{
  const y0 = 494, cols = 6, rows = Math.ceil(cards.length / cols), gap = 7, ch = 84;
  const cw = (W - 2 * PAD - gap * (cols - 1)) / cols;
  cards.forEach((s, k) => {
    const x = PAD + (k % cols) * (cw + gap), y = y0 + Math.floor(k / cols) * (ch + gap);
    add(svg`<rect x="${x}" y="${y}" width="${cw}" height="${ch}" fill="#ffffff" stroke="${RULE}" stroke-width="1"/>`);
    add(svg`<rect x="${x}" y="${y}" width="4" height="${ch}" fill="${REGIONS[s.region]}"/>`);
    add(svg`<rect x="${x + 7}" y="${y + 6}" width="40" height="40" fill="#eef1f4"/>`);
    add(mark(s.pic, x + 27, y + 26, 34, REGIONS[s.region]));
    add(badge(x + 12, y + 56, s.n, 8, INK));
    const hd = para(x + 52, y + 3, s.head, { width: cw - 57, size: 11.6, face: 'cond', weight: 700, fill: INK, lead: 1.1, max: 4 });
    add(hd.node);
    add(label(x + 23, y + 60, `${ABBR[s.region]}${s.t ? ' ' + s.t + 'Z' : ''}`, { size: 8.5, face: 'cond', weight: 700, fill: REGIONS[s.region] }));
    add(chip(x + 7, y + ch - 16, s, 9));
  });
  void rows;
}

// ---------- briefs ----------
{
  const y0 = 696, colW = 272, rowH = 15.6, x0 = PAD;
  add(label(x0, y0 - 6, 'ALSO ON THIS DAY', { size: 14, face: 'heavy', weight: 700, fill: INK }));
  add(label(x0 + 132, y0 - 6, 'tag letter: C confirmed · O official · R reported · X claim · F forecast', { size: 9.5, face: 'cond', fill: '#555' }));
  const per = Math.ceil(briefs.length / 2);
  briefs.forEach((s, k) => {
    const col = Math.floor(k / per), row = k % per;
    const x = x0 + col * (colW + 8), y = y0 + 4 + row * rowH;
    if (row % 2 === 0) add(svg`<rect x="${x}" y="${y}" width="${colW}" height="${rowH}" fill="#ece6d8"/>`);
    add(label(x + 13, y + 11.6, String(s.n), { size: 10.5, face: 'heavy', weight: 700, fill: REGIONS[s.region], anchor: 'middle' }));
    const L = { CONFIRMED: 'C', OFFICIAL: 'O', REPORTED: 'R', CLAIM: 'X', FORECAST: 'F' }[s.tag];
    add(svg`<rect x="${x + 25}" y="${y + 2.6}" width="11" height="11" fill="${TAGS[s.tag].c}"/>`);
    add(label(x + 30.5, y + 11.6, L, { size: 9, face: 'cond', weight: 700, fill: '#fff', anchor: 'middle' }));
    let txt = `${s.head} — ${s.sub}`;
    const room = colW - 42;
    const full = txt;
    while (measure(txt, 10.1, 'cond') > room && txt.length > 4) txt = txt.slice(0, -1);
    if (txt !== full) txt = txt.replace(/[\s,;:—-]+$/, '') + '…';
    const cut = txt.indexOf(' — ');
    add(svg`<text x="${x + 40}" y="${y + 11.6}" font-family="${raw(FONT.cond)}" font-size="10.1" fill="${INK}"><tspan font-weight="700">${txt.slice(0, cut)}</tspan>${txt.slice(cut)}</text>`);
  });
}

// ---------- map, legend, date check ----------
{
  const x = 582, y = 680, w = W - PAD - x, h = 184;
  const map = makeMap(x, y, w, h);
  add(map.base);
  add(map.pins(all.filter((s) => s.lon !== undefined && s.kind !== 'brief').concat(all.filter((s) => s.lon !== undefined && s.kind === 'brief'))
    .map((s) => ({ n: s.n, lon: s.lon, lat: s.lat, color: REGIONS[s.region] }))));
  add(svg`<rect x="${x + 4}" y="${y + h - 19}" width="${w - 8}" height="15" fill="#ffffff" opacity="0.85"/>`);
  let lx = x + 8;
  for (const [r, c] of Object.entries(REGIONS)) {
    const n = all.filter((s) => s.region === r).length;
    add(svg`<rect x="${lx}" y="${y + h - 15}" width="8" height="8" fill="${c}"/>`);
    const t = `${ABBR[r]} ${n}`;
    add(label(lx + 11, y + h - 7.5, t, { size: 9, face: 'cond', weight: 700, fill: INK }));
    lx += measure(t, 9, 'cond') + 15;
  }
  add(label(x + 6, y + 13, 'WHERE IT HAPPENED · PIN = STORY NUMBER', { size: 10, face: 'cond', weight: 700, fill: INK }));

  // HOW SURE legend
  const ly = y + h + 6;
  add(label(x, ly + 11, 'HOW SURE', { size: 12, face: 'heavy', weight: 700, fill: INK }));
  const tagCounts = Object.keys(TAGS).map((k) => [k, all.filter((s) => s.tag === k).length]);
  let tx2 = x + 70;
  for (const [k, n] of tagCounts) {
    const wd = measure(`${k} ${n}`, 9.5, 'cond') + 10;
    add(svg`<rect x="${tx2}" y="${ly + 1}" width="${wd}" height="13" fill="${TAGS[k].c}"/>`);
    add(label(tx2 + 5, ly + 11, `${k} ${n}`, { size: 9.5, face: 'cond', weight: 700, fill: '#fff' }));
    tx2 += wd + 4;
  }
  add(label(x, ly + 26, 'C seen by several outlets · O government/agency statement · R one outlet · X one side’s claim · F scheduled today', { size: 9, face: 'cond', fill: '#444' }));

  // DATE CHECK
  const dy = ly + 34;
  add(svg`<rect x="${x}" y="${dy}" width="${w}" height="${H - 24 - dy}" fill="#ffffff" stroke="${RULE}" stroke-width="1"/>`);
  add(svg`<rect x="${x}" y="${dy}" width="${w}" height="16" fill="${INK}"/>`);
  add(label(x + 6, dy + 12, `DATE CHECK · LEFT OUT BECAUSE THEY ARE NOT ${DAY.short}`, { size: 10.5, face: 'cond', weight: 700, fill: '#ffcf3a', spacing: 0.6 }));
  LEFT_OUT.forEach((d, k) => {
    const yy = dy + 28 + k * 12.8;
    add(svg`<rect x="${x + 5}" y="${yy - 10}" width="56" height="12" fill="${d.later ? '#5f6673' : '#d1462f'}"/>`);
    add(label(x + 33, yy - 0.8, d.real, { size: 9, face: 'cond', weight: 700, fill: '#fff', anchor: 'middle' }));
    let t = d.what;
    while (measure(t, 9.8, 'cond') > w - 74 && t.length > 4) t = t.slice(0, -2);
    if (t !== d.what) t = t.replace(/[\s,;:]+$/, '') + '…';
    add(label(x + 66, yy, t, { size: 9.8, face: 'cond', fill: INK }));
  });
}

// ---------- footer ----------
add(svg`<rect y="${H - 20}" width="${W}" height="20" fill="${INK}"/>`);
add(label(PAD, H - 6, `SOURCES: ${SOURCES}`, { size: 9.4, face: 'cond', fill: '#c9cfdb' }));

const page = `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;background:${PAPER}}svg{display:block}</style></head>
<body><svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${join(parts)}</svg></body></html>`;
writeFileSync(new URL('./front-page.html', import.meta.url), page);
console.log(`${all.length} stories (${leads.length} leads, ${cards.length} cards, ${briefs.length} briefs), ${regionCount} regions, ${fields.size} fields`);
