# Visual system — locked (Ivan, 2026-10-28)

One look for the website system cards, the pages around them, and social posts. Source: Ivan, Claude Code chat, 2026-10-28: "we need to lock in this style, the colors, the effects, this type of marketing to keep it consistent." New work starts from these rules and the templates in this folder; changing a rule needs Ivan's approval.

## Reference
Calm, Apple-like minimalism with real product detail (the mercury.com feel): one idea per frame, one accent color, generous space, motion that explains the work.

## Color
| Token | Value | Use |
|---|---|---|
| `--bg` | `#F6F7F9` | Canvas |
| `--ink` / `--ink2` / `--ink3` | `#1D1D1F` / `#5B5B60` / `#9A9AA0` | Title / body / labels |
| `--ac` | `#004288` | The only accent: eyebrows, highlights, checks, progress |
| `--acT` | `#E7EEF7` | Accent tint: pills, highlight panels |
| `--sun` | `#F7A81B` | Reserved for the sun and Sadie; never a second brand color |
| Status | warn `#B3261E`/`#FCE8E6`, gate `#9A6200`/`#FFF1D6` | Only for real status meaning |
| Dark panel | `#0E1E38` | One dark object per frame at most (e.g. departures board) |

## Type
Inter (JetBrains Mono for code, times and IDs). Note: the marketing quality standard lists Inter as a common "template" tell; it stays because Ivan approved this look, and identity comes from the metaphors, not the font.
- Eyebrow: uppercase, 0.14em tracking, accent color.
- Title: bold, -0.035em, at most two lines.
- Subtitle: one or two plain sentences, `--ink2`.
- Smallest text: 13px on a 1600px artboard card (about 7–8px on screen) is the floor; aim for 15–16px.

## Layout
- **Website card:** 1600x800 (2:1, the card frame). Header top-left at 96px; tool logos bottom-left; one visual metaphor on the right.
- **Social post:** 1080x1350 (4:5, LinkedIn and Instagram feed). Eyebrow, title, subtitle at top (88px margins); one visual; one takeaway line; name and ivanadiaz.com at the bottom.
- Cards: white, 20–28px radius, soft shadow, no borders inside borders.
- Tool logos: logo-only square tiles (68px card / no labels), grouped as Powered by / Intelligence / Built with. Brand logos from the Iconify `logos` set.

## Metaphors
Each system or lesson gets its own picture; never reuse a layout for two subjects. In use: 24-hour clock (Daily Follow Up), household constellation (Database 2.0), receipt and stamp (Audit), tree rings (Dream), departures board (Registry), signal filter (Intelligence Core), prompted vs coded (lesson), rule diff with drift review (lesson).

## Honesty
No fake client names, photos or live-looking metrics. Gray bars stand in for client data. Samples are labelled as examples. Only name tools and schedules the job instructions confirm.

## Motion
- Card and post animations: 7–11 seconds, explain the flow in order, end on a complete final frame (the final frame is the poster/still).
- Website: each item fades in and rises 32px over 0.9s the first time it appears (items arriving together follow one another, 140ms apart); a card's video starts after it settles, plays once per visit and stays on its final frame. Reduced motion: stills only.
- Easing: ease-out (cubic-bezier(.22,.61,.36,1)); small pops for checks and chips.

## Production
HTML source in this folder → `node make.js <page> <out> <seconds> [width height]` → PNG (2x) + MP4 (30fps, H.264 CRF 17). Website posters as WebP quality 90. Social exports at 2x (2160x2700).
