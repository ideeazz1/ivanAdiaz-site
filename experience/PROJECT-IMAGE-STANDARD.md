# Experience Project Artwork — Locked Visual Standard

**Owner decision: 2026-10-24.** Applies to the six image-only project cards on `/experience/`. This file is the single source of truth for future image additions and corrections. Check it before changing project artwork or card styling.

## Acceptance standard

- All project cards occupy the same content width and the same **display aspect ratio** at each breakpoint, with identical outer radius, border, shadow and spacing. The page CSS controls the cards; source image borders, framing and padded canvases must not create a second inset card.
- Within each project artwork, the **visible header** follows one consistent standard: title in the top-left, same visual title height/weight, left inset, top inset, two-line title allowance, subtitle treatment and alignment. Judge the **visible pixels**, not simply the source image dimensions or HTML width/height attributes.
- Important content (title, subtitles, controls and toolmarks) must be fully visible and legible on narrow mobile screens; no title cut under the sticky top navigation. Use matched safe zones within the asset.
- The approved sequence is Database 2.0, Audit & Security, Dream, Registry / Console, Mortgage Intelligence Core, Daily Follow Up / EOD. Preserve existing order, artwork and labels unless the owner explicitly approves another change.
- Source files currently mix 4:3 and 16:9 compositions. **Do not blindly force 16:9 or `object-fit: cover` on all images.** Use the site's current full-card presentation as the baseline, normalize artboard/inset only where needed and avoid cropping. If uniform artboard requires substantive regeneration of existing approved art, stop and present a single scoped owner choice instead.
- Future source artworks should share a template artboard and reserved title/safe area. A single reusable HTML/CSS header is an optional future migration **only after all embedded titles can be removed without losing approved content**; do not layer a duplicate header over existing text or trigger a six-image redesign under a one-image fix.
- Compare new images with Database 2.0, Dream and all remaining cards on desktop and 390px mobile. Count an image as accepted only when the visible title scale, card fill, bounds, whitespace, order and image loading match. Render screenshots, check for clipping/distortion and inspect the published site. A PR or successful build alone is not visual acceptance.

## Approved normalization assignment — six-card collection (2026-10-24)

**Objective:** A recruiter sees six visually cohesive, professionally finished project illustrations. This supersedes the narrower single-card correction below; do not interpret earlier “leave the other five alone” as blocking the approved consistency fixes. Preserve each project's approved *visual story and contents*, not its inconsistent padding or typography.

### Source-of-truth and scope

- Work only on `/experience/` and the six existing `experience/projects/` assets, plus the minimal CSS/HTML required for faithful sizing. No new redesign, navigation, site header, hero, tool ticker, animation, page copy, or new system.
- Project sequence: (1) Database 2.0, (2) Audit & Security, (3) Dream, (4) Registry / Console, (5) Mortgage Intelligence Core, (6) Daily Follow Up / EOD.
- Inspect **all six actual source image pixel dimensions, transparency/embedded frames, visible title bounding boxes and the CSS rendered width/height** before deciding changes. Distinguish container problems from image-internal whitespace. Do not assume that setting `width`/`height` HTML attributes makes visible content uniform.
- Use **Registry / Console and Daily Follow Up / EOD** as initial visual references for balanced title scale. Preserve deliberate line wrapping (e.g. Mortgage Intelligence Core, Daily Follow Up / EOD). Derive the shared title visual scale, left/top alignment, subtitle spacing and safe zones from rendered measurements; do not hardcode speculative pixel values.
- Database 2.0 and Dream: reduce oversized *visible title* scale to the chosen reference; maintain clarity of other artwork.
- Audit & Security: remove its extra nested-looking white frame/inset and normalize its undersized title/header and content scale **without** cropping the airport control tower, status illustration or tools.
- Registry / Console and Mortgage Intelligence Core: correct only header offsets/scale if confirmed by comparison.
- Daily Follow Up / EOD: baseline reference; adjust only if necessary for uniformity.
- Source aspect ratios currently vary; a consistent outer website card appearance is required, but **no stretching, destructive `object-fit: cover` cropping, excessive padding, or blanket source-ratio conversion**. Prefer minimal asset-level correction when internal typography is baked into raster. If edit would materially alter approved illustration, report the precise tradeoff before substituting or regenerating.
- Important content, including title and tool strip, must be fully visible; avoid drawing a second inner rounded card inside the outer website card. Treat illustration dashboard status/counts as artistic examples, not live operational claims.

### Verification and closure

1. Capture comparable before/after screenshots of **the same six-card page** at desktop (~1440px) and mobile (390px; also inspect 320px if practical). Compare title appearance, horizontal left edge, top inset, two-line spacing, outer card fill, whitespace and visibility—not only file metadata.
2. All six images load, preserve approved order, have consistent outer displayed width/height rules, and look like one series; no broken paths, duplicated titles, overlaps, clipped text, squeezed imagery or mobile overflow.
3. Use a focused PR and existing build/check process; check changed asset files and exact rendered outputs. Merge/deploy via normal approvals only after checks. Independently review the deployed `https://ivanadiaz.com/experience/` at desktop/mobile, not just branch preview.
4. Deliver concise evidence: changed file list, actual asset dimensions, matched presentation measurements, before/after screenshots, PR/merge/deployment state and direct live URL. **Ivan's browser visual approval is final acceptance.** Until that approval, status is `IMPLEMENTED — OWNER VISUAL REVIEW PENDING`, not finished.
5. If unable to correct a raster's embedded title without degrading the artwork, state exactly which asset and what was attempted; show one bounded proposed alternative. Do not silently replace approved art or ask Ivan to recapture all requirements.

**Accountability:** The requesting assistant owns completeness of this specification and accepts responsibility for omissions; Codex executes the smallest necessary changes and reports discrepancies rather than inventing scope. This is one controlled normalization task, not six projects.

## Restoration and replacement strategy — owner instruction 2026-10-24

The bulk raster edits in PR #54 and follow-up PR #55 were rejected after mobile visual review due to apparent washed-out/degraded title text. On owner request, `main` was restored to commit `0cf4b6c` (before both image edits), while the previous tip is preserved on backup branch `backup/image-retouch-pr54-pr55-20261024`. Do not reuse the failed images as final sources; this strategy supersedes the prior instruction to batch-normalize all six images now.

**New process: one image prototype, then scale cautiously.** Keep the restored published cards unchanged while designing an isolated replacement. Use clean, sharp typography built from a single approved header template rather than raster repainting/warping an existing embedded title. Establish title style, line wrapping, top and left safe zones, subtitle style, and a shared deliverable artboard by comparing actual approved source illustrations. Original scene/content must remain intact. Favor remastering from suitable clean source or image-by-image recreation when title separation would damage existing pixels; never assume a destructive pixel retouch is safe. Avoid fabricated status metrics and preserve the individual visual metaphor.

**Initial prototype:** choose one problematic asset (Audit & Security is suitable), prepare a before/after pair off-site without touching current production, visually inspect at desktop and mobile, and seek owner's image approval. Only then apply the approved typography/artboard template separately to other cards, checking each against its original and the prior approved prototype. No bulk automatic resizing, edge smearing, inpainting or CSS-only optical fixes; don't force a single aspect ratio without evaluating content loss. Roll out only approved replacements with a reversible PR and deployed mobile verification.

**Current acceptance boundary:** restoration to previous site source is verified in GitHub; live CDN/browser propagation and owner's subsequent review are separate milestones. No new image artwork is approved under this strategy yet.

## Motion replacement — owner direction 2026-10-28

Supersedes the 2026-10-24 "no animation" scope and the one-image-at-a-time rollout for this set. Source: Ivan, Claude Code chat session, 2026-10-28: "I like your style. and I like the video." · "Come back with simple video for the end of day using what we currently have." · "Great can you finish all of them?" · on site behavior: "the scroll can trigger the automation to run, and if one is running, then the other wouldn't".

- All six cards are rebuilt from one HTML template at 1600x800 (2:1, the card's own ratio, so no letterbox or crop). Header, title scale, tool tiles and colors are identical across cards; each card keeps its own metaphor. Source and export steps: `experience/projects/motion/source/README.md`.
- Each card is a muted, inline video with its final frame as the poster (`experience/projects/motion/*.mp4` and `*.webp`). `experience/project-motion.js` plays a card once when it is at least 60% visible, plays only the most visible card, pauses the rest, and replays after the card leaves and returns. Reduced motion, no JavaScript or a failed load show the poster only.
- The previous images stay in `experience/projects/` for rollback: revert the `experience/index.html` card markup and the `project-motion.js` script tag.
- Known gap: at 390px the titles are legible but card-level body text is small, as it was in the previous images. A phone-specific layout would be a separate owner decision.
- Status until Ivan reviews the deployed page in his browser: IMPLEMENTED — OWNER VISUAL REVIEW PENDING.
