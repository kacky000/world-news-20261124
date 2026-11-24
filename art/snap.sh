#!/usr/bin/env bash
# snap.sh — build the page and photograph it with headless Chrome into entry.png (1024 x 1024).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(dirname "$here")"
node "$here/sheet.mjs"
chrome="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
profile="$(mktemp -d)"
page="file:///$(cygpath -m "$here/front-page.html" 2>/dev/null || echo "$here/front-page.html")"
out="$(cygpath -w "$root/entry.png" 2>/dev/null || echo "$root/entry.png")"
"$chrome" --headless=new --disable-gpu --hide-scrollbars --user-data-dir="$(cygpath -w "$profile" 2>/dev/null || echo "$profile")" \
  --force-device-scale-factor=1 --window-size=1024,1024 --virtual-time-budget=2000 \
  --screenshot="$out" "$page" 2>/dev/null || true
rm -rf "$profile"
ls -l "$root/entry.png"
