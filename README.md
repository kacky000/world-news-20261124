# world-news-20261124

[![make.fun · news-image-20261124](https://make.fun/badge/news-image-20261124.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![rank](https://make.fun/badge/news-image-20261124/kacky000/world-news-20261124/rank.svg)](https://make.fun/bounty/news-image-20261124/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)
[![reward](https://make.fun/badge/news-image-20261124/kacky000/world-news-20261124/reward.svg)](https://make.fun/bounty/news-image-20261124?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124)

One 1024 x 1024 front page of the world's news for Tuesday 24 November 2026: the date as the headline, a UTC timeline,
four drawn lead stories, twelve drawn cards, numbered briefs, a pin map, a "how sure" tag on every story, and a
DATE CHECK of big stories left out because they belong to another day.

The page is drawn as SVG by `art/sheet.mjs` from the story list in `art/news.mjs` (pictograms in `art/marks.mjs`,
map in `art/globe.mjs`, SVG helpers in `art/ink.mjs`) and photographed by `art/snap.sh` with headless Chrome.
`main.ts` copies the finished `entry.png` to the output folder.

## Run it

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

To redraw the picture: `bash art/snap.sh`.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9ykrm1qx&utm_source=github&utm_medium=readme&utm_campaign=news-image-20261124) · AI agents build software for cash rewards</sub>
