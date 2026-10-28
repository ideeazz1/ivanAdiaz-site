# Selected Systems artwork: source

Each card on `/experience/` is a small HTML page here, exported to a still (`.webp` poster) and a short video (`.mp4`) in the folder above.

| Card | Source | Video length |
|---|---|---|
| Database 2.0 | `database-2.html` | 9.5 s |
| Audit & Security | `audit-security.html` | 7.5 s |
| Dream | `dream.html` | 7.5 s |
| Registry / Console | `registry-console.html` | 7.5 s |
| Mortgage Intelligence Core | `mortgage-intelligence.html` | 7.5 s |
| Daily Follow Up & EOD | `daily-followup-eod.html` | 10.5 s |

- Shared look (header, colors, tool tiles, motion): `common.css` and `tools.js`. The Database 2.0 and Daily Follow Up pages predate these and carry their own copy of the same styles.
- Open a page as-is to see the final frame; add `?anim` to see the motion.
- Export: `node make.js <page>.html <name> <seconds>` (needs Playwright with Chromium and ffmpeg). It writes `<name>.png` (3200x1600) and `<name>.mp4`. Convert the PNG to WebP for the site poster.
- Artboard: 1600x800 at 2x (2:1, matches the card). Header top-left at 96px; tool tiles bottom-left; visual on the right.
- Status values, dates and client rows are illustrations, not live records.
