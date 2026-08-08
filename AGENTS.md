# AGENTS.md — TopWebTool Repository Guide

This file gives AI coding agents (opencode, Claude Code, Cursor, etc.) everything needed to work in this repo correctly the first time.

## Project Overview

TopWebTool is a **100% static, client-side web tool directory** deployed to Cloudflare Pages. It contains **84 tools** across Finance, Marketing, AI, and Developer categories. All tool logic runs in the browser; there is no backend, no database, no build step beyond CSS.

- Production site: `https://topwebtool.com/`
- Deploy target: Cloudflare Pages (repo root is the publish directory)

## Repository Layout

- `index.html` — homepage (84-tool directory with search + category grid)
- `404.html` — not-found page
- `<tool-name>/index.html` — one directory per tool (84 total), e.g. `age-calculator/`
- `<tool-name>/<slug>/index.html` — SEO article pages per tool (one directory per article), e.g. `age-calculator/age-calculator-guide/index.html`
- `global.js` — shared JS: theme loader, header, footer, sidebar, ad placement (header logo mark is inline at ~line 794)
- `styles.css` / `global.css` / `src.css` — styling (Tailwind CSS v4)
- `worker.js` — Cloudflare Pages **Function** (`/functions` compatible single-file worker) that serves real markdown to AI crawlers when `Accept: text/markdown`
- `_headers` — response headers (CSP, cache, security, `Vary: Accept`, `Link:` to `.well-known/api-catalog` and `llms.txt`)
- **No `_redirects` file exists by design.** Cloudflare Pages natively serves `/dir/` → `/dir/index.html`, redirects `.html` → extensionless, and adds trailing slashes to directories. Do NOT reintroduce `_redirects` — a `/tool/` → `/tool/index.html` rewrite (or any `.html` → clean 301 combined with a rewrite) LOOPs with the native redirect (`ERR_TOO_MANY_REDIRECTS`).
- `sitemap.xml` — 505 canonical URLs
- `robots.txt` — allows all bots including AI crawlers; lists `sitemap.xml`
- `llms.txt` — llms.txt-standard index of all 84 tools (AI-friendly)
- `llms-full.txt` — full-content markdown index for AI crawlers
- `.well-known/api-catalog` — catalog of machine-readable AI resources
- `favicon.svg`, `logo.svg`, `og-image.png` (+ PNG favicon sizes), `site.webmanifest` — brand assets
- `package.json` — `npm run build` regenerates `styles.css` from `src.css` via Tailwind CLI; `playwright` is a dev dependency

## Brand System

- Logo/tile: indigo→sky gradient (`#4f46e5 → #0ea5e9`), white "T", amber spark (`#fbbf24`)
- `site.webmanifest`: description "84 free premium web utilities", `background_color: #ffffff`, `theme_color: #4f46e5`
- Theme: dark (`#0f172a`) / light (`#ffffff`) via `localStorage` + early blocking script in `<head>`

## Conventions (MUST follow for new/edited pages)

- Every page needs exactly **one** `<h1>`.
- `<title>` and OG/Twitter meta should follow `<Name> | TopWebTool`.
- Every page needs: `meta description`, `canonical` (`https://topwebtool.com/<tool>/`), OG tags, Twitter cards, PNG + SVG favicon links, `theme-color`, manifest link.
- JSON-LD: each tool page carries a `WebApplication` block **and** a `BreadcrumbList` block. Articles carry `Article` + `BreadcrumbList`. `datePublished` convention: `"2026-08-06"`.
- AdSense account: `ca-pub-3901061173891576`. Ad slots: `#ad-slot-a` (leaderboard, CLS-safe with fixed min-height), inline sidebar slots.
- Do NOT add comments to code unless asked. Match existing code style exactly.

## Critical Environment Gotchas

- **Shell is PowerShell 7** on Windows. `node -e` with inline JS gets mangled — **always write a temp script file** under `C:\Users\Mahesh\AppData\Local\Temp\opencode\` and run it with `node <file>`.
- **`.gitignore` contains `*.png`** — new PNG assets require `git add -f` or they won't be committed/deployed.
- **Playwright cannot use the `ms-playwright` cache** (broken/empty). Launch with `executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'` and `headless: false`. A `npm install` may prune Playwright from the temp dir — reinstall it into the temp working dir before using it.
- Working tree must stay clean unless a change is in progress. Commit only when the user explicitly asks.

## Verification Commands

Run these before finishing any batch of edits (Node scripts live in the temp dir):

- HTML validity: `npx htmlhint` — expect "Scanned 507 files, no errors found"
- Head/meta integrity: `node verify-heads.js` — expect "issues: 0"
- JSON-LD validity: `node validate-jsonld.js` — expect "INVALID blocks: 0"
- AI-friendliness: llms files must list exactly **84** tools.

## AI-Friendliness (site-level, do not regress)

- `llms.txt` / `llms-full.txt` must stay in sync with the 84 tools (regenerate via temp script from `index.html` pages).
- `worker.js` returns clean markdown for `Accept: text/markdown` on `.html` pages (strips header/footer/nav/ads/forms, converts headings/lists/tables, decodes HTML entities).
- `robots.txt` explicitly allows all major AI crawlers; `.well-known/api-catalog` + `Link:` header expose machine-readable resources.
