# TopWebTool — TODO & Future Enhancements

## Current Status
- 85 tools, 517 HTML pages, all validated
- `UTILITIES_REGISTRY` in `global.js` is the single runtime source of truth
- `build-deploy.py` validates cross-references but does not generate SEO files
- Privacy-first context engine (`js/context-engine.js`) deployed
- Unit converter tool added with 6 categories and 5 article pages
- Premium design features implemented: hero section, card hover effects, focus glows, smooth scroll

---

## FUTURE ENHANCEMENTS

### 1. Extract `tools-registry.json` (Single Source of Truth)
**Goal:** Eliminate drift between runtime registry and SEO index files.

**Tasks:**
- [ ] Read `UTILITIES_REGISTRY` from `global.js` (lines 6–595)
- [ ] Write `tools-registry.json` with array of `{path, name, category, desc, icon}` for 85 tools
- [ ] Update `global.js` to load registry from JSON (fallback to inline array if missing)
- [ ] Verify `UTILITIES_REGISTRY` is still globally available with same shape

**Validation:**
- `npx htmlhint` → no errors
- Browser console: `UTILITIES_REGISTRY.length === 85`
- `twt-shell.js` and `context-engine.js` consume registry unchanged
- Build validation: 85 tool directories, 517 total HTML files, 515 sitemap URLs

---

### 2. Write `scripts/generate-seo.js`
**Goal:** Auto-generate `sitemap.xml`, `llms.txt`, `llms-full.txt` from registry + filesystem scan.

**Input:** `tools-registry.json` + scan of `<tool-slug>/` directories  
**Output:** Overwrites the three SEO files

**Logic:**
- Scan root for directories matching registry slugs
- For each slug, add `https://topwebtool.com/<slug>/` to sitemap
- For each subdirectory with `index.html`, add `https://topwebtool.com/<slug>/<subdir>/` to sitemap
- Write `llms.txt` bullets: `- [Name](URL) — Description`
- Write `llms-full.txt` sections with registry data

**Validation hooks:**
- Fail if any registry slug has no matching directory (expect 85 tools)
- Fail if any tool directory has no registry entry (expect 85 tools)
- Warn if article count differs from expected

**Run once:**
```powershell
node scripts/generate-seo.js
```

---

### 3. Write `scripts/scaffold-tool.js`
**Goal:** Create new tool + article page shells with correct paths/meta/JSON-LD pre-filled.

**Input:** `node scripts/scaffold-tool.js --slug <slug> --name "Tool Name" --category "Category" --desc "Description"`  
**Output:** Creates directory structure + HTML files

**Creates:**
- `<slug>/index.html` — tool page shell with:
  - Correct `<title>`, meta description, canonical URL, OG/Twitter tags (from registry)
  - Depth-correct script/style paths (`../js/global.js`, etc.)
  - JSON-LD (`WebApplication` + `BreadcrumbList`) pre-filled
  - One `<h1>` with tool name
  - Shell layout (header, footer, sidebar, right-rail placeholders)
  - **Empty content area** for actual tool UI/logic
- `<slug>/<slug>-best-practices/index.html` — article shell with correct paths/meta/JSON-LD (`Article` + `BreadcrumbList`)
- `<slug>/<slug>-common-errors/index.html`
- `<slug>/<slug>-future-trends/index.html`
- `<slug>/<slug>-guide/index.html`
- `<slug>/<slug>-optimization-tips/index.html`
- Appends entry to `tools-registry.json`

**What you do after scaffolding:**
1. Open `<slug>/index.html` and build the tool UI inside the pre-structured shell
2. Write article body copy in the 5 article pages
3. Add any tool-specific CSS/JS if needed

**What you don't touch:**
- Relative paths (already correct)
- Meta tags/JSON-LD (already filled)
- Sitemap/llms (auto-generated on next build)

---

### 4. Update `build-deploy.py`
**Goal:** Wire generators into build pipeline so SEO files are always fresh.

**Changes:**
- [ ] Add `--generate` flag (default: `true`)
- [ ] Step 1: Run `scripts/generate-seo.js` before validation
- [ ] Step 2: Run existing validations (now comparing freshly generated files)
- [ ] Step 3: Build ZIP

**Updated flow:**
```powershell
python build-deploy.py --generate   # Generates SEO files + validates + builds ZIP
python build-deploy.py --skip-generate  # Validates only (for CI checks)
```

---

### 5. Update `build-deploy.ps1`
**Goal:** Mirror new `--generate` flag behavior in PowerShell wrapper.

**Changes:**
- [ ] Pass `--generate` flag to `python build-deploy.py`
- [ ] Update help text to reflect new behavior

---

### 6. Regenerate Baseline SEO Files
**Goal:** Establish auto-generated baseline for future comparisons.

**Steps:**
1. Create `tools-registry.json` from current `global.js` data
2. Update `global.js` to read from JSON (with inline fallback)
3. Run `node scripts/generate-seo.js` to regenerate:
   - `sitemap.xml`
   - `llms.txt`
   - `llms-full.txt`
4. Commit all generated files as first "auto-generated" baseline
5. Run `python build-deploy.py` to verify validations pass

---

## Constraints
- Keep existing HTML structure; do not migrate to SSG framework
- `worker.js`, `_headers`, `robots.txt` remain static (no tool-specific changes needed)
- `.gitignore` PNG rule unchanged
- Cloudflare Pages native redirect behavior unchanged (no `_redirects`)

## Validation Commands
```powershell
npm run build                           # Full build: CSS + JS minify + validate + ZIP
npx htmlhint                            # Expect: "Scanned 517 files, no errors found"
node verify-heads.js                    # Expect: "issues: 0"
node validate-jsonld.js                 # Expect: "INVALID blocks: 0"
```

## Rollout Order
1. Task 1: Extract `tools-registry.json` + update `global.js`
2. Task 2: Write `scripts/generate-seo.js` + run once
3. Task 3: Write `scripts/scaffold-tool.js`
4. Task 4: Update `build-deploy.py`
5. Task 5: Update `build-deploy.ps1`
6. Task 6: Regenerate baseline SEO files + commit

---

## Notes
- Existing 517 HTML pages are **never modified** by generators
- `global.js` change is backward compatible (falls back to inline array if JSON missing)
- Scaffold creates **structural shells only** — you still write tool logic and article content manually
- The generators only replace the *plumbing* (sitemap, llms, scaffolding), not page content
