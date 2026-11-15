# ivanAdiaz-site

Curated public website for [ivanadiaz.com](https://ivanadiaz.com).

- **Fresh Git history** (not a mirror of `ivanAdiaz`)
- **Phase B preview** — do **not** add `CNAME` / custom domain until Phase F
- Source allowlist: `ideeazz1/ivanAdiaz` @ `e9f3049c87c032d815bd61ca02208b1f550ec9e0` per `docs/architecture/MIGRATION-MANIFEST.md`

Standing Decision OS / runtime remains in `ideeazz1/ivanAdiaz` until later phases.

## Experience content maintenance

The Systems & Work page's **Recent Activity** block refreshes itself daily via `.github/workflows/refresh-activity.yml`, which runs `scripts/refresh-activity.mjs`:

- **Heatmap:** fetches the last 90 days (ending today, America/Chicago) from the GitHub GraphQL contribution calendar, rewrites the inline SVG and date range in `experience/index.html` between the `<!-- activity:*:start/end -->` markers, and writes `experience/github-contributions-90d.json`. Shades are quartiles within the window. Only per-day counts are published; no repository names or private content.
- **Receipts:** the first two entries in `experience/receipts.json` (newest first) are rendered as the delivery examples. Pushing a change to that file triggers a refresh.

Set the `ACTIVITY_TOKEN` repository secret (classic PAT for `ideeazz1` with `read:user`) so private contribution counts are included; without it the workflow falls back to the workflow token (public contributions only).

Add a receipt only after the outcome is verified, preserving the distinction between requirements Ivan defined, collaborator or agent implementation, checks run, deployment status and owner-accepted outcomes. Do not infer results from merged code.

Run locally: `GITHUB_TOKEN=... node scripts/refresh-activity.mjs`, or `node scripts/refresh-activity.mjs --fixture experience/github-contributions-90d.json` to re-render offline.

Periodically, open the supporting architecture links and confirm they still resolve. Employment history and credentials need review when a fact changes or an expiry approaches, not as weekly rewrites.
