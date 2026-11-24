// marks.mjs — flat pictograms, each drawn around (0,0) in a 100-unit square and placed with a transform.
import { svg, join } from './ink.mjs';

const INK = '#1b1b1f';

const M = {
  quake: (c) => svg`
    <path d="M-46 22 L-30 22 L-24 6 L-16 36 L-8 -30 L2 40 L10 -10 L16 22 L46 22" fill="none" stroke="${c}" stroke-width="7" stroke-linejoin="round"/>
    <path d="M-40 36 h80" stroke="${INK}" stroke-width="4"/>`,
  ballot: (c) => svg`
    <rect x="-34" y="-6" width="68" height="44" rx="4" fill="${c}"/>
    <rect x="-16" y="-8" width="32" height="6" fill="${INK}"/>
    <rect x="-12" y="-44" width="24" height="34" fill="#fff" stroke="${INK}" stroke-width="3" transform="rotate(8)"/>
    <path d="M-6 -30 l5 6 l9 -12" stroke="${c}" stroke-width="4" fill="none" transform="rotate(8)"/>`,
  rocket: (c) => svg`
    <path d="M0 -46 C16 -30 16 0 12 22 L-12 22 C-16 0 -16 -30 0 -46Z" fill="#f4f4f4" stroke="${INK}" stroke-width="3"/>
    <circle cx="0" cy="-14" r="7" fill="${c}" stroke="${INK}" stroke-width="2"/>
    <path d="M-12 8 L-24 28 L-10 22Z M12 8 L24 28 L10 22Z" fill="${c}"/>
    <path d="M-8 24 Q0 50 8 24Z" fill="#ff9a1f"/>`,
  up: (c) => svg`
    <path d="M-42 36 V-40 M-42 36 H44" stroke="${INK}" stroke-width="4" fill="none"/>
    <path d="M-34 24 L-14 6 L2 14 L36 -28" stroke="${c}" stroke-width="8" fill="none" stroke-linejoin="round"/>
    <path d="M22 -32 L40 -32 L40 -14" stroke="${c}" stroke-width="8" fill="none"/>`,
  down: (c) => svg`
    <path d="M-42 36 V-40 M-42 36 H44" stroke="${INK}" stroke-width="4" fill="none"/>
    <path d="M-34 -26 L-14 -6 L2 -14 L36 24" stroke="${c}" stroke-width="8" fill="none" stroke-linejoin="round"/>
    <path d="M22 28 L40 28 L40 10" stroke="${c}" stroke-width="8" fill="none"/>`,
  bank: (c) => svg`
    <path d="M-44 -14 L0 -42 L44 -14Z" fill="${c}"/>
    ${[-32, -12, 8, 28].map((x) => svg`<rect x="${x}" y="-10" width="8" height="36" fill="${INK}"/>`)}
    <rect x="-46" y="28" width="92" height="10" fill="${c}"/>`,
  gavel: (c) => svg`
    <rect x="-34" y="-30" width="44" height="20" rx="4" fill="${c}" transform="rotate(-35)"/>
    <rect x="-6" y="-12" width="10" height="56" fill="${INK}" transform="rotate(-35)"/>
    <rect x="-44" y="32" width="56" height="10" fill="${INK}"/>`,
  ship: (c) => svg`
    <path d="M-46 8 L46 8 L32 30 L-34 30Z" fill="${c}"/>
    <rect x="-24" y="-14" width="34" height="22" fill="#f4f4f4" stroke="${INK}" stroke-width="3"/>
    <rect x="-4" y="-32" width="8" height="18" fill="${INK}"/>
    <path d="M-50 40 q12 -8 25 0 t25 0 t25 0 t25 0" stroke="#2a7bd6" stroke-width="4" fill="none"/>`,
  plane: (c) => svg`
    <path d="M-44 4 L40 -6 Q50 -6 44 2 L-40 14Z" fill="${c}"/>
    <path d="M-4 0 L-24 -34 L-12 -34 L16 -2Z M-4 8 L-20 36 L-8 36 L14 8Z" fill="${INK}"/>`,
  ball: (c) => svg`
    <circle r="36" fill="#fff" stroke="${INK}" stroke-width="4"/>
    <path d="M0 -14 L13 -4 L8 12 L-8 12 L-13 -4Z" fill="${INK}"/>
    <path d="M0 -14 V-36 M13 -4 L34 -11 M8 12 L21 29 M-8 12 L-21 29 M-13 -4 L-34 -11" stroke="${INK}" stroke-width="3"/>`,
  blast: (c) => svg`
    <path d="M0 -44 L10 -16 L38 -26 L20 -2 L44 14 L14 14 L16 42 L0 20 L-16 42 L-14 14 L-44 14 L-20 -2 L-38 -26 L-10 -16Z" fill="${c}"/>
    <circle r="12" fill="#ffd23f"/>`,
  drone: (c) => svg`
    <path d="M-40 -6 L40 -6 L8 4 L-8 4Z" fill="${INK}"/>
    <path d="M-6 -6 L0 -28 L6 -6Z M-4 4 L0 26 L4 4Z" fill="${c}"/>
    <path d="M-44 -6 L-56 -20 M44 -6 L56 -20" stroke="${INK}" stroke-width="4"/>`,
  storm: (c) => svg`
    <path d="M-30 6 A30 22 0 1 1 30 -14 A20 18 0 0 1 28 18 L-28 18 A16 14 0 0 1 -30 6Z" fill="#9aa4b2"/>
    <path d="M-4 18 L-14 38 L0 34 L-6 50" stroke="${c}" stroke-width="6" fill="none"/>
    <path d="M14 22 l-6 12 M-26 22 l-6 12" stroke="#2a7bd6" stroke-width="4"/>`,
  flood: (c) => svg`
    <rect x="-24" y="-22" width="40" height="30" fill="#f4f4f4" stroke="${INK}" stroke-width="3"/>
    <path d="M-30 -20 L-4 -42 L22 -20Z" fill="${c}"/>
    <path d="M-48 10 q12 -8 24 0 t24 0 t24 0 t24 0 V40 H-48Z" fill="#2a7bd6"/>`,
  barrel: (c) => svg`
    <rect x="-24" y="-38" width="48" height="76" rx="8" fill="${c}"/>
    <path d="M-24 -14 H24 M-24 14 H24" stroke="${INK}" stroke-width="4"/>
    <path d="M0 -8 C8 2 8 8 0 10 C-8 8 -8 2 0 -8Z" fill="${INK}"/>`,
  hands: (c) => svg`
    <path d="M-48 -4 L-24 -16 L0 -6 L24 -16 L48 -4 L48 18 L24 24 L-24 24 L-48 18Z" fill="${c}"/>
    <path d="M-20 4 L-4 18 M-10 -2 L6 12 M0 -6 L16 8" stroke="${INK}" stroke-width="4"/>`,
  sign: (c) => svg`
    <rect x="-36" y="-40" width="72" height="40" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <rect x="-4" y="0" width="8" height="44" fill="${INK}"/>
    <path d="M-24 -26 h48 M-24 -14 h32" stroke="#fff" stroke-width="5"/>`,
  health: (c) => svg`
    <rect x="-38" y="-38" width="76" height="76" rx="16" fill="${c}"/>
    <path d="M-10 -26 h20 v16 h16 v20 h-16 v16 h-20 v-16 h-16 v-20 h16Z" fill="#fff"/>`,
  chip: (c) => svg`
    <rect x="-28" y="-28" width="56" height="56" rx="6" fill="${INK}"/>
    <rect x="-14" y="-14" width="28" height="28" fill="${c}"/>
    ${[-18, -6, 6, 18].map((p) => svg`<path d="M${p} -28 v-12 M${p} 28 v12 M-28 ${p} h-12 M28 ${p} h12" stroke="${INK}" stroke-width="4"/>`)}`,
  leaf: (c) => svg`
    <path d="M-36 36 C-40 -20 0 -44 40 -40 C40 0 16 40 -36 36Z" fill="${c}"/>
    <path d="M-36 36 L24 -24" stroke="#0d3b1e" stroke-width="4"/>`,
  volcano: (c) => svg`
    <path d="M-48 38 L-14 -16 L14 -16 L48 38Z" fill="#6b4a3a"/>
    <path d="M-14 -16 L-6 -4 L2 -12 L8 -2 L14 -16Z" fill="${c}"/>
    <circle cx="-6" cy="-32" r="10" fill="#9aa4b2"/><circle cx="8" cy="-40" r="13" fill="#9aa4b2"/>`,
  train: (c) => svg`
    <rect x="-30" y="-36" width="60" height="62" rx="10" fill="${c}"/>
    <rect x="-22" y="-26" width="44" height="22" fill="#cfe6ff"/>
    <circle cx="-16" cy="14" r="5" fill="#fff"/><circle cx="16" cy="14" r="5" fill="#fff"/>
    <path d="M-22 26 L-32 42 M22 26 L32 42" stroke="${INK}" stroke-width="4"/>`,
  trophy: (c) => svg`
    <path d="M-24 -38 H24 V-8 A24 24 0 0 1 -24 -8Z" fill="${c}"/>
    <path d="M-24 -30 H-38 C-38 -10 -30 -6 -22 -4 M24 -30 H38 C38 -10 30 -6 22 -4" stroke="${c}" stroke-width="5" fill="none"/>
    <rect x="-5" y="14" width="10" height="16" fill="${c}"/><rect x="-20" y="30" width="40" height="10" fill="${INK}"/>`,
  siren: (c) => svg`
    <path d="M-24 24 V-4 A24 24 0 0 1 24 -4 V24Z" fill="${c}"/>
    <rect x="-32" y="24" width="64" height="12" fill="${INK}"/>
    <path d="M-40 -30 L-30 -20 M40 -30 L30 -20 M0 -46 V-34" stroke="${c}" stroke-width="5"/>`,
  dome: (c) => svg`
    <path d="M-30 -4 A30 30 0 0 1 30 -4Z" fill="${c}"/>
    <rect x="-2" y="-46" width="4" height="14" fill="${INK}"/>
    <rect x="-40" y="-4" width="80" height="8" fill="${INK}"/>
    ${[-30, -14, 2, 18].map((x) => svg`<rect x="${x}" y="6" width="10" height="26" fill="${INK}"/>`)}
    <rect x="-44" y="32" width="88" height="8" fill="${c}"/>`,
  coin: (c) => svg`
    <ellipse cx="0" cy="18" rx="34" ry="12" fill="${INK}"/>
    <ellipse cx="0" cy="6" rx="34" ry="12" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="0" cy="-8" rx="34" ry="12" fill="${c}" stroke="${INK}" stroke-width="3"/>
    <ellipse cx="0" cy="-22" rx="34" ry="12" fill="${c}" stroke="${INK}" stroke-width="3"/>`,
  film: (c) => svg`
    <rect x="-40" y="-26" width="80" height="52" fill="${INK}"/>
    <rect x="-28" y="-16" width="56" height="32" fill="${c}"/>
    ${[-34, -18, -2, 14, 30].map((x) => svg`<rect x="${x}" y="-23" width="6" height="5" fill="#fff"/><rect x="${x}" y="18" width="6" height="5" fill="#fff"/>`)}`,
  tower: (c) => svg`
    <path d="M-30 40 L0 -44 L30 40" stroke="${INK}" stroke-width="5" fill="none"/>
    <path d="M-20 12 H20 M-12 -14 H12" stroke="${INK}" stroke-width="4"/>
    <circle cx="0" cy="-44" r="7" fill="${c}"/>
    <path d="M-18 -54 A24 24 0 0 1 18 -54" stroke="${c}" stroke-width="4" fill="none"/>`,
  wheat: (c) => svg`
    <path d="M0 44 V-40" stroke="${INK}" stroke-width="4"/>
    ${[-32, -18, -4, 10].map((y) => svg`<ellipse cx="-9" cy="${y}" rx="9" ry="5" fill="${c}" transform="rotate(-30 -9 ${y})"/><ellipse cx="9" cy="${y}" rx="9" ry="5" fill="${c}" transform="rotate(30 9 ${y})"/>`)}`,
  flag: (c) => svg`
    <rect x="-34" y="-44" width="5" height="88" fill="${INK}"/>
    <path d="M-29 -42 C-10 -50 6 -32 36 -40 L36 0 C6 8 -10 -10 -29 -2Z" fill="${c}"/>`,
  satellite: (c) => svg`
    <rect x="-10" y="-10" width="20" height="20" fill="${INK}" transform="rotate(45)"/>
    <rect x="-46" y="-10" width="28" height="20" fill="${c}" transform="rotate(45)"/>
    <rect x="18" y="-10" width="28" height="20" fill="${c}" transform="rotate(45)"/>
    <path d="M14 14 L30 30" stroke="${INK}" stroke-width="4"/>`,
  people: (c) => svg`
    ${[-28, 0, 28].map((x, i) => svg`<circle cx="${x}" cy="${-14 + (i === 1 ? -6 : 0)}" r="11" fill="${c}"/><path d="M${x - 16} ${36} V${10 + (i === 1 ? -6 : 0)} A16 14 0 0 1 ${x + 16} ${10 + (i === 1 ? -6 : 0)} V36Z" fill="${c}"/>`)}`,
};

export const KINDS = Object.keys(M);

export function mark(kind, x, y, size, color) {
  const fn = M[kind] ?? M.flag;
  return svg`<g transform="translate(${x} ${y}) scale(${size / 100})">${fn(color)}</g>`;
}

// A small drawn scene for a lead: sky band, ground line, and the mark large in the middle.
export function scene(kind, x, y, w, h, sky, color) {
  const ground = y + h * 0.82;
  return join([
    svg`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${sky}"/>`,
    svg`<circle cx="${x + w * 0.82}" cy="${y + h * 0.22}" r="${h * 0.12}" fill="#ffffff" opacity="0.35"/>`,
    svg`<rect x="${x}" y="${ground}" width="${w}" height="${y + h - ground}" fill="#000" opacity="0.12"/>`,
    mark(kind, x + w / 2, y + h * 0.48, Math.min(w, h) * 0.72, color),
  ]);
}
