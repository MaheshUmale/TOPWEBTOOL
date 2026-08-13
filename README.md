# TopWebTool

A 100% static, client-side web tool directory deployed to Cloudflare Pages. Contains 85 free online utilities across Finance, Marketing, AI, and Developer categories. All logic runs in the browser; no backend, no database.

## Tech Stack

- HTML/CSS/JS (no build framework)
- Tailwind CSS v4 (`npm run build` compiles `src.css` → `styles.css`)
- Cloudflare Pages for hosting

## Directory Layout

- `index.html` — homepage with 84-tool directory, search, category grid
- `<tool-name>/index.html` — individual tool pages
- `<tool-name>/<slug>/index.html` — SEO article pages per tool
- `global.js` — shared JS: theme loader, header, footer, sidebar, ads
- `styles.css` / `src.css` — Tailwind CSS
- `worker.js` — Cloudflare Pages Function for AI crawler markdown responses
- `_headers` — response headers (CSP, cache, `Vary: Accept`, `Link:`)
- `llms.txt` / `llms-full.txt` — AI-friendly tool indexes
- `robots.txt` / `sitemap.xml` — standard site metadata

## Build

```bash
npm install
npm run build
```

## Deploy

Create a clean ZIP for Cloudflare Pages:

```powershell
powershell -ExecutionPolicy Bypass -File .\build-deploy.ps1
```

Or manually stage then zip, excluding `.git/`, `node_modules/`, `.kilo/`, `.opencode/`, `.vscode/`, and dev-only files.

## Verification

```bash
npx htmlhint  # expect "Scanned 507 files, no errors found"
node verify-heads.js  # expect "issues: 0"
node validate-jsonld.js  # expect "INVALID blocks: 0"
```

## Production Notes

- AdSense account: `ca-pub-3901061173891576`
- One ad per page top; consistent "Advertisement" labels
- Dark mode via `localStorage` + early blocking script
- No `_redirects` file — Cloudflare Pages native routing handles `/dir/` → `/dir/index.html`
