# ivanAdiaz-site

Curated public website for [ivanadiaz.com](https://ivanadiaz.com).

- **Fresh Git history** (not a mirror of `ivanAdiaz`)
- **Phase B preview** — do **not** add `CNAME` / custom domain until Phase F
- Source allowlist: `ideeazz1/ivanAdiaz` @ `e9f3049c87c032d815bd61ca02208b1f550ec9e0` per `docs/architecture/MIGRATION-MANIFEST.md`

Standing Decision OS / runtime remains in `ideeazz1/ivanAdiaz` until later phases.

## Experience content maintenance

The Systems & Work page's GitHub activity and delivery examples are static content. `experience/github-contributions-90d.json` stores the authenticated 90-day snapshot; the visible heatmap is an inline SVG in `experience/index.html` and does not load that JSON at runtime. When refreshing activity, update the JSON, SVG counts, reporting dates and retrieval timestamp together. This repository has no scheduled content-refresh workflow.

The Smart Sync receipt readback and household document checklist summaries are also static HTML. Update them only when recent evidence has been verified, preserving the distinction between requirements Ivan defined, collaborator or agent implementation, checks run, deployment status and owner-accepted outcomes.

A lightweight weekly manual review is sufficient:

- Check whether the 90-day reporting window and displayed dates still represent the intended recent period. If refreshing the graph, retrieve authenticated GitHub data and keep the JSON snapshot and SVG synchronized; do not expose repository names or private content.
- Review recent delivery examples for newer verified evidence. Replace stale examples only when the new facts and verification level are documented; do not infer results from merged code.
- Open the supporting architecture links and confirm they still resolve and explain the linked work.
- Check public links and dates for staleness. Employment history and credentials need review when a fact changes or an expiry approaches, not as weekly rewrites.

No recurring job or new automation is required for this review.
