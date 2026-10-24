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

## Current Audit & Security defect

The approved airport-control-tower image occupies card #2 but appears smaller than adjacent images due to extra framing/inset, with a visibly smaller title. Correct only this artboard/header-size mismatch using the approved image, preserve the composition, then verify against the standard above. Do not change the Registry / Console image. No made-up live status metrics.
