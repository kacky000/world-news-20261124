// Writes the day's front page to /output/entry.png (or $MAKEFUN_OUTPUT_DIR/entry.png when run locally).
// The picture itself is drawn ahead of time by art/sheet.mjs and photographed by art/snap.sh; the grader has
// no network and no browser, so the program only has to put those bytes in place.
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const source = new URL('./entry.png', import.meta.url);
const size = statSync(source).size;
if (size > 1048576) throw new Error(`entry.png is ${size} bytes, over the 1 MiB limit`);
mkdirSync(outDir, { recursive: true });
copyFileSync(source, join(outDir, 'entry.png'));
