# Peregrin3 public surface (`/peregrin3`)

Static presentation folder for the **Peregrine** client-facing brand, served from the existing `ideeazz1/ivanAdiaz` GitHub Pages site.

> **Reset status (2026-08-15):** this folder is a presentation surface, not a separate brain or current offer authority. The database-first pages are historical solution hypotheses and must remain `noindex`/clearly labeled until refreshed from `peregrine-os/` evidence-led canon.

## Hosting source of truth

| Item | Value |
|------|--------|
| Canonical files | `ideeazz1/ivanAdiaz` → `peregrin3/` |
| Live URL | https://ivanadiaz.com/peregrin3/ |
| Pages host | Same GitHub Pages site as `ivanadiaz.com` (this repo only) |
| Domain forward | `peregrin3.com` and `www.peregrin3.com` permanently forward through **GoDaddy** to https://ivanadiaz.com/peregrin3/ |

**Do not:**

- create or use a sibling `ideeazz1/peregrin3` repository;
- add `peregrin3.com` as a GitHub Pages custom domain;
- deploy this folder on Vercel;
- invent a second Cursor / agent workspace for brand HTML.

Canon / OS work stays in `peregrine-os/`. Edit public HTML here in `ivanAdiaz` only; merge to `main` publishes via the existing Pages site.

## Contents

| Path | Role |
|------|------|
| `/peregrin3/` | Historical database-first brand home pending evidence-led rewrite (`noindex`) |
| `/peregrin3/process/` | Historical fixed-method page pending rewrite (`noindex`) |
| `/peregrin3/pulse/` | Historical platform hypothesis, not current roadmap (`noindex`) |

There is **no** `peregrin3/CNAME`. Root `CNAME` remains `ivanadiaz.com` for this repo’s Pages site.

## Relationship

| Surface | Where it lives | How it reaches users |
|---------|----------------|----------------------|
| `ivanadiaz.com` | `ideeazz1/ivanAdiaz` GitHub Pages | Direct |
| `ivanadiaz.com/peregrin3/` | `peregrin3/` in the same repo | Direct Pages path |
| `peregrin3.com` / `www.peregrin3.com` | GoDaddy permanent forward | → https://ivanadiaz.com/peregrin3/ |

## Archive / noindex

Keep `robots` / `googlebot` `noindex, nofollow` and the on-page archive banner until evidence-led rewrite lands. Do not treat these pages as the current offer.
