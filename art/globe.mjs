// globe.mjs — a coarse plate carrée world map with numbered pins.
import { svg, join, raw, FONT } from './ink.mjs';

// Hand-placed outlines, [lon, lat] pairs, deliberately rough: the map is for locating, not for surveying.
const LAND = [
  // North America
  [[-166, 68], [-156, 71], [-128, 70], [-110, 73], [-95, 72], [-82, 70], [-64, 62], [-56, 52], [-66, 45], [-70, 42],
   [-76, 36], [-81, 31], [-80, 26], [-82, 29], [-90, 30], [-97, 27], [-98, 21], [-94, 18], [-88, 21], [-87, 16],
   [-83, 10], [-78, 8], [-80, 7], [-86, 12], [-92, 14], [-105, 20], [-112, 30], [-117, 32], [-124, 40], [-124, 48],
   [-133, 56], [-146, 60], [-158, 57], [-164, 60]],
  // Greenland
  [[-52, 60], [-42, 60], [-20, 70], [-18, 80], [-40, 83], [-62, 80], [-68, 76], [-56, 70]],
  // South America
  [[-78, 8], [-72, 12], [-62, 10], [-52, 5], [-44, -2], [-35, -6], [-38, -14], [-41, -22], [-48, -26], [-54, -34],
   [-58, -39], [-64, -42], [-66, -48], [-68, -54], [-74, -52], [-74, -42], [-72, -30], [-70, -18], [-76, -12],
   [-81, -5], [-80, 1]],
  // Europe and Asia
  [[-10, 36], [-9, 43], [-2, 44], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [12, 66], [22, 70], [32, 70],
   [42, 67], [60, 70], [70, 73], [80, 73], [100, 77], [112, 74], [130, 72], [150, 71], [170, 70], [180, 66],
   [178, 62], [163, 60], [156, 51], [142, 59], [136, 54], [141, 48], [132, 43], [129, 35], [122, 40], [118, 38],
   [122, 31], [118, 24], [110, 21], [108, 16], [109, 11], [104, 9], [100, 13], [99, 8], [103, 1], [98, 8],
   [94, 16], [92, 22], [86, 21], [80, 15], [77, 8], [73, 17], [70, 22], [62, 25], [56, 26], [57, 22], [52, 17],
   [44, 12], [40, 20], [35, 28], [34, 31], [36, 36], [27, 37], [26, 40], [23, 36], [20, 40], [16, 38], [12, 44],
   [8, 44], [3, 43], [-2, 37]],
  // Africa
  [[-17, 21], [-16, 13], [-12, 8], [-8, 4], [0, 5], [8, 4], [10, 2], [9, -2], [12, -6], [13, -12], [12, -18], [15, -27],
   [18, -34], [26, -34], [33, -27], [35, -22], [40, -16], [40, -10], [39, -4], [42, 0], [51, 11], [44, 12],
   [38, 18], [33, 28], [32, 31], [20, 32], [11, 33], [10, 37], [0, 36], [-6, 36], [-10, 30], [-14, 27]],
  // Madagascar
  [[44, -16], [50, -14], [48, -25], [44, -24]],
  // Arabia is part of Eurasia above; Great Britain and Ireland
  [[-6, 50], [2, 51], [0, 54], [-2, 58], [-6, 58], [-5, 54]], [[-10, 52], [-6, 52], [-6, 55], [-10, 54]],
  // Japan
  [[130, 31], [136, 34], [140, 35], [142, 40], [140, 42], [145, 44], [141, 46], [139, 40], [135, 36], [130, 34]],
  // Indonesia / New Guinea strips
  [[95, 5], [106, -6], [104, -5], [98, 0]], [[105, -7], [115, -8], [114, -9], [106, -8]],
  [[109, 2], [118, 6], [119, 1], [116, -4], [110, -3]], [[131, -1], [142, -3], [150, -10], [141, -9], [134, -4]],
  [[120, 1], [125, 1], [122, -5], [120, -4]],
  // Philippines, Taiwan, Sri Lanka
  [[120, 18], [122, 18], [126, 7], [122, 7], [120, 14]], [[120, 22], [122, 25], [121, 22]], [[80, 9], [82, 7], [80, 6]],
  // Australia, New Zealand
  [[114, -22], [122, -18], [130, -12], [136, -12], [137, -16], [142, -11], [146, -19], [153, -27], [150, -37],
   [146, -39], [138, -35], [132, -31], [124, -34], [115, -34]],
  [[172, -34], [178, -38], [175, -42], [172, -41]], [[172, -41], [174, -42], [170, -46], [167, -46]],
  // Iceland
  [[-24, 64], [-14, 64], [-14, 66], [-22, 66]],
];

export function makeMap(x, y, w, h, { lonMin = -170, lonMax = 180, latMin = -50, latMax = 78 } = {}) {
  const px = (lon) => x + ((lon - lonMin) / (lonMax - lonMin)) * w;
  const py = (lat) => y + ((latMax - lat) / (latMax - latMin)) * h;
  const land = LAND.map((poly) => {
    const d = poly.map(([lo, la], i) => `${i ? 'L' : 'M'}${px(lo).toFixed(1)} ${py(la).toFixed(1)}`).join(' ') + 'Z';
    return svg`<path d="${d}" fill="#d9d2bf" stroke="#b9ae92" stroke-width="0.7"/>`;
  });
  const grid = [];
  for (let lo = -150; lo <= 180; lo += 30) grid.push(svg`<path d="M${px(lo)} ${y} V${y + h}" stroke="#c7dbe6" stroke-width="0.6"/>`);
  for (let la = -30; la <= 60; la += 30) grid.push(svg`<path d="M${x} ${py(la)} H${x + w}" stroke="#c7dbe6" stroke-width="${la === 0 ? 1 : 0.6}"/>`);

  return {
    px, py,
    base: join([
      svg`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#eaf3f8"/>`,
      grid, land,
      svg`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#1b1b1f" stroke-width="1"/>`,
    ]),
    // pins: [{n, lon, lat, color}] — later pins that would overlap an earlier one are nudged sideways.
    pins(list) {
      const placed = [];
      const out = [];
      for (const p of list) {
        let cx = px(p.lon), cy = py(p.lat);
        for (let tries = 0; tries < 8; tries++) {
          const hit = placed.find((q) => Math.hypot(q[0] - cx, q[1] - cy) < 12.5);
          if (!hit) break;
          cx += cx >= hit[0] ? 7 : -7;
          cy += cy >= hit[1] ? 5 : -5;
        }
        cx = Math.min(x + w - 8, Math.max(x + 8, cx));
        cy = Math.min(y + h - 24, Math.max(y + 22, cy));
        placed.push([cx, cy]);
        out.push(svg`<circle cx="${cx}" cy="${cy}" r="6.6" fill="${p.color}" stroke="#fff" stroke-width="1.3"/>`);
        out.push(svg`<text x="${cx}" y="${cy + 3.2}" font-family="${raw(FONT.cond)}" font-size="${p.n > 9 ? 8 : 9}" font-weight="700" fill="#fff" text-anchor="middle">${p.n}</text>`);
      }
      return join(out);
    },
  };
}
