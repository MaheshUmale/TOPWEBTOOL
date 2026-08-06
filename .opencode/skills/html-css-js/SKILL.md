---
name: html-css-js
description: Use when writing or editing HTML, CSS, or vanilla JavaScript in the TopWebTool repo — building tool pages, article pages, styling, or interactive scripts. Enforces the site's static-page conventions (Template A/B), Tailwind-style utility classes, dark mode, CLS-safe ad slots, SEO meta/JSON-LD, WebMCP forms, and inline vanilla JS patterns.
---

# TopWebTool HTML / CSS / JS Conventions

Static, client-side utility pages for topwebtool.com (Cloudflare Pages + AdSense). No frameworks, no CDN JS deps, no backend.

## HTML — page skeleton

Every tool folder `D:\TOPWEBTOOL\<slug>\` contains exactly 6 files:
`index.html` (Template A, the interactive tool) + 5 articles: `<slug>-guide.html`, `-best-practices.html`, `-common-errors.html`, `-optimization-tips.html`, `-future-trends.html`.

`<head>` order (copy verbatim from `base64-encoder-decoder/index.html`):
1. Early blocking theme-loader script (localStorage `theme` → `.dark`/`.light` class on `<html>`).
2. Inter font preconnects + stylesheet links.
3. `<meta charset>`, `<meta name="google-adsense-account" content="ca-pub-3901061173891576">`, `<meta name="viewport">`.
4. Unique `<title>` (≤60 chars, keyword-rich, ends `| TopWebTool`), unique `<meta name="description">` (150–160 chars), `<link rel="canonical" href="https://topwebtool.com/<slug>/">`.
5. CLS-reservation `<style>` block (copy verbatim).
6. JSON-LD: `WebApplication` on index, `Article` on articles (swap name/headline/url/description).
7. `<link rel="stylesheet" href="../styles.css">` then `../global.css` (articles may use `media="print" onload="this.media='all'"`).

Body structure (index): `<header id="global-header">` → `<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow">` → `#ad-slot-a` leaderboard (keep `data-ad-slot="2894630336"`) → `<div class="grid grid-cols-1 lg:grid-cols-4 gap-4">` → main column `lg:col-span-3 space-y-8` → sidebar `lg:col-span-1 space-y-6` with `#trending-sidebar`, `#ad-slot-square` (`6707430996`), `#ad-slot-vertical` (`1581548667`) → close grid/main → `<footer id="global-footer">` → `<script src="../global.js" defer>` → inline tool script.

Main column order: title card with exactly one `<h1>` → tool UI card(s) → `<section id="seo-instructional-hub">` (formulas, step-by-step `<ol>`, edge-case `<ul>`) → related-tools silo grid → 5 article cards linking to the article files.

## CSS — classes and styling

- Use ONLY Tailwind-style utility classes already present in `base64-encoder-decoder/index.html`, `styles.css`, and `global.css`. Do not invent classes that don't exist.
- Every color/background must have `dark:` variants (e.g. `bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100`).
- Cards: `bg-white rounded-2xl border border-slate-200 shadow-sm p-6` (+ `dark:bg-slate-900 dark:border-slate-800`).
- Buttons: `px-5 py-2.5 bg-brand-600 text-white hover:bg-brand-700 transition-colors font-bold text-sm rounded-lg shadow-sm`.
- Output/code: `bg-slate-950 text-emerald-400 p-4 rounded-xl font-mono text-xs overflow-x-auto break-all shadow-inner`.
- No horizontal scroll; touch targets ≥48px; no extra ad divs beyond the three reserved slots.

## JavaScript — patterns

- Vanilla ES6, inline `<script>` at the bottom of the page. Wire to `input`/`change`/`submit` events; live-update output.
- Real, domain-accurate formulas; guard NaN / divide-by-zero with friendly inline error messages; pre-fill sample/default values so the page works on load.
- Copy button flips label to "Copied!" for 2s via `navigator.clipboard.writeText`.
- `form` element carries `tool-name="<slug>"` and `tool-description` attributes (WebMCP convention).
- No `// TODO`, no placeholders, no `...` in shipped code.

## Articles (Template B)

Structure: back-link `<a href="./">← Back to {Tool Name}` → `<h1>` → published meta → 7–10 original paragraphs (800–1000 words), domain-specific and accurate, no lorem, no leakage from other tools' articles → CTA row back to the tool. Sidebar contains only `#trending-sidebar`.

Titles: `Ultimate Guide to {Name} | TopWebTool`, `Best Practices for {Name} | TopWebTool`, `Common Errors in {Name} | TopWebTool`, `Top Optimization Tips for {Name} | TopWebTool`, `Future Trends in {Name} | TopWebTool`. Canonicals: `https://topwebtool.com/<slug>/<slug>-<suffix>.html`.

## Rules / do NOT

- Do not modify `global.js`, root `index.html`, `sitemap.xml`, or `PUBLIC/` during build tasks (integration is a separate step).
- Do not run git commands, install packages, or start a dev server.
- YMYL tools (BAC, legal, insurance, some health) get an amber disclaimer banner in the tool card and every article.
- PURE+DATA tools embed realistic static lookup tables as JS objects/arrays in the page.

## Self-verify

- 6 files per slug; all `<title>`s unique; exactly one `<h1>` per page.
- Required IDs present: `global-header`, `global-footer`, `ad-slot-a`, `ad-slot-square`, `ad-slot-vertical`, `trending-sidebar`; canonical + JSON-LD present; copy button present.
- JS computes correctly with sample defaults (no NaN). Sibling links point to real existing slugs.
