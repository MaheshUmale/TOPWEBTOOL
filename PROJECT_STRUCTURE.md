# TopWebTool — Project Structure & Dependency Map

## 1. Overview

TopWebTool is a 100% static, client-side web utility directory deployed to Cloudflare Pages.
- **85 tools** across 10 categories
- **517 HTML pages** (1 homepage, 1 404, 4 legal, 85 tool pages, 425 article pages, 1 `twt-shell.html`)
- Zero backend; all logic runs in the browser
- Build step: `npm run build` compiles Tailwind CSS, minifies JS, validates cross-references, and produces `deployment.zip`

---

## 2. Directory Layout

```
D:\TOPWEBTOOL\
├── index.html                          # Homepage (85-tool directory)
├── 404.html                            # Not-found page
├── about/, contact/,
│   privacy/, terms/                      # Legal/info core pages (directory-style index.html)
├── twt-shell.html                      # Shell template (depth 0)
│
├── <tool-slug>/                        # 85 tool directories
│   ├── index.html                      # Tool main page
│   ├── <article-slug-1>/index.html     # Article page (depth 2)
│   ├── <article-slug-2>/index.html
│   ├── <article-slug-3>/index.html
│   ├── <article-slug-4>/index.html
│   └── <article-slug-5>/index.html     # 5 articles per tool (425 total)
│
├── js/
│   └── context-engine.js               # Privacy-first context engine
│
├── global.js                           # ★ UTILITIES_REGISTRY (single source of truth)
├── twt-shell.js                        # Shared shell: header, footer, sidebar, rail
├── worker.js                           # Cloudflare Pages Function (AI crawler markdown)
├── styles.css / site.min.css / src.css
│
├── sitemap.xml                         # 515 canonical URLs
├── llms.txt                            # AI-crawler index (85 tools)
├── llms-full.txt                       # AI-crawler full-content index (85 tools)
├── robots.txt                          # Crawler rules + sitemap pointer
├── _headers                            # Cloudflare response headers
├── .well-known/
│   └── api-catalog                     # Machine-readable AI resource catalog
│
├── build-deploy.py                     # Validation + ZIP creation
├── build-deploy.ps1                    # PowerShell wrapper
├── package.json                        # Tailwind build script
│
├── favicon.svg, favicon.ico, favicon-*.png
├── logo.svg, og-image.png, og-image.svg
├── site.webmanifest
└── ads.txt                             # AdSense verification
```

---

## 3. The Single Source of Truth: `global.js`

### `UTILITIES_REGISTRY` (line 6–595)

This is the **only** place that defines every tool. Adding or removing a tool **must** start here.

```javascript
const UTILITIES_REGISTRY = [
  {
    path: '/mortgage-calculator/',       // URL slug (trailing slash)
    name: 'Mortgage Calculator',         // Display name
    category: 'Finance & Real Estate',   // One of 5 categories
    desc: 'Compute monthly...',          // Short description
    icon: '🏡'                           // Emoji icon
  },
  // ... 83 more entries
];
```

**Categories used:**
- `Finance & Trading`
- `Business & Marketing`
- `AI Tools`
- `Dev & Tech Tools`
- `Everyday & Health`

### Consumers of `UTILITIES_REGISTRY`

| File | How it uses the registry |
|------|--------------------------|
| `index.html` | Renders the 85-tool category grid + search |
| `twt-shell.js` | Builds the trending sidebar (`<aside id="right-rail">`) |
| `js/context-engine.js` | Resolves related tools via category (+5) and keyword (+2) overlap |
| `global.js` itself | Counts tools for footer ("85 free...") |

**No other file hardcodes tool names or paths.** The registry is loaded before `twt-shell.js` and `context-engine.js` on every page.

---

## 4. Per-Tool Artifact Mapping

Each tool owns this structure:

```
<tool-slug>/
├── index.html                          # Tool page (depth 1)
│   ├── canonical: https://topwebtool.com/<tool-slug>/
│   ├── title: "<Name> | TopWebTool"
│   ├── JSON-LD: WebApplication + BreadcrumbList
│   ├── loads: global.js, twt-shell.js, context-engine.js (../js/)
│   └── one <h1>
│
└── <article-slug>/                     # 5 article subdirectories
    └── index.html                      # Article page (depth 2)
        ├── canonical: https://topwebtool.com/<tool-slug>/<article-slug>/
        ├── title: "<Article Title> | TopWebTool"
        ├── JSON-LD: Article + BreadcrumbList
        ├── loads: global.js, twt-shell.js, context-engine.js (../../js/)
        └── one <h1>
```

### Naming conventions
- **Folder slug**: kebab-case, matches the `path` in `UTILITIES_REGISTRY` (without leading/trailing slash)
- **Article slugs**: 5 per tool, typically:
  - `<tool-slug>-best-practices`
  - `<tool-slug>-common-errors`
  - `<tool-slug>-future-trends`
  - `<tool-slug>-guide`
  - `<tool-slug>-optimization-tips`
- **Exceptions**: Some tools have custom article slugs (e.g., `mortgage-calculator/how-to-calculate-mortgage`, `crypto-position-size/crypto-portfolio-allocation-strategies`). Article names do **not** need to match the registry pattern.

---

## 5. SEO / AI-Crawler Files & Their Dependencies

### `sitemap.xml`
- **511 URLs**: 1 homepage + 85 tool pages + 425 article pages + 4 legal pages
- **Excluded**: `404.html` (noindex via `_headers`)
- **Generated**: Manually maintained or generated by external script (not in repo)
- **Validated by**: `build-deploy.py` (invoked via `npm run build`) — scans every `<tool-slug>/` directory and every article subdirectory to ensure every `index.html` has a matching `<url><loc>` entry

### `llms.txt`
- **85 bullet entries**, one per tool
- Format: `- [Tool Name](https://topwebtool.com/<tool-slug>/) — Description`
- **Validated by**: `build-deploy.py` (invoked via `npm run build`) — ensures every `UTILITIES_REGISTRY` slug appears

### `llms-full.txt`
- **85 tool sections** with full content (heading, description, sections, guide text)
- **Validated by**: `build-deploy.py` (invoked via `npm run build`) — ensures every `UTILITIES_REGISTRY` slug appears

### `robots.txt`
- Allows all major AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
- Explicitly allows `/llms.txt` and `/llms-full.txt`
- Points to `Sitemap: https://topwebtool.com/sitemap.xml`
- **Not tool-specific** — no changes needed when adding/removing tools

### `_headers`
- Cloudflare Pages response headers (CSP, cache, security)
- Contains `Link: </llms.txt>; rel="llms.txt"` and `Link: </.well-known/api-catalog>; rel="api-catalog"`
- `Vary: Accept` for AI crawler content negotiation
- **Not tool-specific** — no changes needed when adding/removing tools

### `.well-known/api-catalog`
- Static JSON catalog of machine-readable AI resources
- **Not tool-specific** — no changes needed when adding/removing tools

---

## 6. JavaScript & CSS Architecture

### Load order (every page)
```html
<script>/* early theme blocker */</script>
<link rel="stylesheet" href="./styles.css">          <!-- Tailwind output -->
<link rel="stylesheet" href="./site.min.css">         <!-- Custom CSS bundle -->
<script src="../js/global.js"></script>               <!-- UTILITIES_REGISTRY -->
<script src="../js/twt-shell.js"></script>             <!-- Shell renderer -->
<script src="../js/context-engine.js" defer></script>  <!-- Context rail -->
```

**Note**: Paths vary by depth (`./js/`, `../js/`, `../../js/`).

### `global.js`
- Defines `UTILITIES_REGISTRY`
- Theme initialization
- Header/footer/sidebar rendering
- Ad placement (`pushUnit` for AdSense)

### `twt-shell.js`
- Consumes `UTILITIES_REGISTRY` to build:
  - Desktop dropdown nav (categories → tools)
  - Mobile drawer
  - Trending sidebar (`<aside id="right-rail">`)
- Strips old static link rendering; rail is now dynamic

### `js/context-engine.js`
- Consumes `UTILITIES_REGISTRY`
- Builds 3 rail modules: Quick Actions, Recently Used, Related Tools
- Uses `localStorage` / `sessionStorage` (wrapped in `try/catch` for Safari private mode)
- Zero external network calls

### CSS
| File | Purpose |
|------|---------|
| `src.css` | Tailwind source |
| `styles.css` | Compiled Tailwind output (`npm run build`) |
| `site.min.css` | Custom CSS bundle (layout, theme variables, shell layout, rail modules, responsive breakpoints) |

---

## 7. Build & Validation

Run `npm run build` to compile CSS, minify JS, validate cross-references, and create `deployment.zip`.

The build runs these validations **before** creating `deployment.zip`:

1. **`llms.txt`** — all 85 tool slugs + 4 legal pages present
2. **`llms-full.txt`** — all 85 tool slugs present
3. **`sitemap.xml`** — all tool pages + all article pages (discovered by scanning `<tool-slug>/*/` directories) present
4. **`robots.txt`** — sitemap and llms references present
5. **`_headers`** — `llms.txt` Link, `api-catalog` Link, `Vary: Accept` present
6. **`worker.js`** — basic pattern check (`addEventListener('fetch'`, `text/markdown`)
7. **JSON-LD** — spot-checks 5 sample pages for valid JSON
8. **Malformed HTML** — scans all `.html` files for orphaned tags

**ZIP exclusions**: `.git`, `.kilo`, `.opencode`, `.vscode`, `node_modules`, `dist`, `.agent-zero`, `.playwright-mcp`, `.well-known`, `.test`, `*.ps1`, `*.py`, `*.zip`, `AGENTS.md`, `README.md`, etc.

---

## 8. Static Assets

| Asset | Purpose | Notes |
|-------|---------|-------|
| `favicon.svg` / `favicon.ico` / `favicon-16x16.png` / `favicon-32x32.png` | Browser tab icons | `.gitignore` contains `*.png`; new PNGs need `git add -f` |
| `apple-touch-icon.png` | iOS home screen icon | |
| `logo.svg` | Brand logo | |
| `og-image.png` / `og-image.svg` | Open Graph / Twitter Card image | |
| `android-chrome-192x192.png` / `android-chrome-512x512.png` | PWA icons | |
| `site.webmanifest` | PWA manifest | |
| `ads.txt` | AdSense verification | |

---

## 9. Add / Remove a Tool — Complete Checklist

When adding a new tool, update **all** of these. When removing, reverse the steps.

### Required (will break if skipped)

- [ ] **`global.js`** — Add/remove entry in `UTILITIES_REGISTRY` (path, name, category, desc, icon)
- [ ] **`<tool-slug>/index.html`** — Create/delete the tool page
  - Must have: one `<h1>`, `<title>` + OG/Twitter meta, canonical URL, JSON-LD (`WebApplication` + `BreadcrumbList`), `datePublished: "2026-08-06"`, correct script paths for depth
- [ ] **`sitemap.xml`** — Add/remove tool page URL + all article URLs
- [ ] **`llms.txt`** — Add/remove bullet entry: `- [Name](https://topwebtool.com/<tool-slug>/) — Description`
- [ ] **`llms-full.txt`** — Add/remove full tool section with URL, heading, description, sections, and guide text

### Required for each article page (if applicable)

- [ ] **`<tool-slug>/<article-slug>/index.html`** — Create/delete article page
  - Must have: one `<h1>`, `<title>` + OG/Twitter meta, canonical URL, JSON-LD (`Article` + `BreadcrumbList`), correct script paths for depth
- [ ] **`sitemap.xml`** — Add/remove article URL

### Not required (generic / auto-discovered)

- [ ] `twt-shell.js` — Uses `UTILITIES_REGISTRY` dynamically; no change needed
- [ ] `js/context-engine.js` — Uses `UTILITIES_REGISTRY` dynamically; no change needed
- [ ] `index.html` — Uses `UTILITIES_REGISTRY` dynamically; no change needed
- [ ] `worker.js` — Generic HTML→Markdown converter; no tool-specific code
- [ ] `_headers` — Static; no tool-specific rules
- [ ] `robots.txt` — Static crawl rules; no tool-specific entries
- [ ] `.well-known/api-catalog` — Static catalog; no tool-specific entries
- [ ] `build-deploy.py` — Auto-discovers tools by scanning directories (invoked via `npm run build`)

### Verification after changes

```powershell
npm run build                     # Full build: CSS + JS minify + validate + ZIP
npx htmlhint                     # Expect: "Scanned 517 files, no errors found"
node verify-heads.js             # Expect: "issues: 0" (if script exists)
node validate-jsonld.js          # Expect: "INVALID blocks: 0" (if script exists)
```

---

## 10. Critical Rules & Gotchas

1. **`UTILITIES_REGISTRY` is the single source of truth** for all 85 tools. No per-page hardcoding of tool lists exists.
2. **`sitemap.xml` and `llms*.txt` are static files** — they are not auto-generated by the build. They must be manually kept in sync.
3. **`build-deploy.py` (invoked via `npm run build`) validates cross-references** but does not generate missing entries. It will **fail** if you add a tool folder without updating `sitemap.xml` / `llms.txt` / `llms-full.txt`.
4. **Article count is flexible** — most tools have 5 articles, but some have custom counts. The build script auto-discovers them by scanning subdirectories.
5. **`.gitignore` contains `*.png`** — new PNG assets require `git add -f` to be committed.
6. **No `_redirects` file** — Cloudflare Pages natively handles `/dir/` → `/dir/index.html`. Adding a rewrite rule causes redirect loops.
7. **JSON-LD is mandatory** — every tool page needs `WebApplication` + `BreadcrumbList`; every article needs `Article` + `BreadcrumbList`. Use `datePublished: "2026-08-06"`.
8. **One `<h1>` per page** — enforced by convention and `htmlhint` checks.
9. **Safari private mode** — all `localStorage` / `sessionStorage` access must be wrapped in `try/catch` (context-engine.js follows this).
10. **AdSense** — keep the `<script async src="...adsbygoogle.js">` loader; remove only manual ad placement divs if needed.
