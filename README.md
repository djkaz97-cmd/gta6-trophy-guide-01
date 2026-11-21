# GTA VI — Trophy Guide & Tracker

Offline PlayStation 5 trophy guide and tracker for the 55 trophies of Grand Theft Auto VI, built for the make.fun bounty `gta6-trophy-guide-01`.

## What it is

`app/` is a static, single-page web app (HTML + CSS + vanilla JavaScript, no build step) that opens at `app/index.html` in desktop Chrome and works fully offline with zero network requests.

- Checklist of all 55 trophies with official names, descriptions and grades, plus a guide written in my own words for each one
- Roadmap to platinum with a suggested earning order, grouped by phase, built from the official descriptions
- Missable trophies flagged throughout
- Filters by kind: story, missable, collectibles, activities, online
- Spoiler setting that hides story-trophy names and descriptions until earned
- Per-trophy sources cited beside each guide (official text shown verbatim as PlayStation publishes it)
- Progress saved in browser localStorage, exportable to and importable from a JSON file

## Badges

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/djkaz97-cmd/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/djkaz97-cmd/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

## Running locally

Serve `app/` with any static file server and open `app/index.html` (no build step, no network):

```sh
python -m http.server 8080   # run from the app/ folder, then open http://localhost:8080
```

## Building the entry dossier

```sh
mkdir -p out
MAKEFUN_OUTPUT_DIR=out node main.ts
```

Writes `out/app/`, `out/screenshots/` and `out/dossier.json`.

## Notes

- No Rockstar logo, official artwork, box art, or game screenshots are used — an original look only.
- Every trophy has a non-blank guide written in my own words; official names/descriptions/grades are quoted verbatim and attributed.
- Guide text is original and not copied from other trophy guides.

License: MIT ([LICENSE](LICENSE)).
