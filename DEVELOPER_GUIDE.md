# TopWebTool Developer Guide

## 1. Project Overview

TopWebTool is a 100% static, client-side web utility directory deployed to Cloudflare Pages.
- **85 tools** across multiple categories
- **Zero backend** — all logic runs in the browser
- **Single source of truth**: `global.js` defines `UTILITIES_REGISTRY`
- **SEO files**: `sitemap.xml`, `llms.txt`, `llms-full.txt` must be manually updated

---

## 2. Quick Start: Adding a New Tool

### Step 1: Create Tool Directory Structure

```powershell
New-Item -ItemType Directory -Path "D:\TOPWEBTOOL\<tool-slug>\<tool-slug>-best-practices","D:\TOPWEBTOOL\<tool-slug>\<tool-slug>-common-errors","D:\TOPWEBTOOL\<tool-slug>\<tool-slug>-future-trends","D:\TOPWEBTOOL\<tool-slug>\<tool-slug>-guide","D:\TOPWEBTOOL\<tool-slug>\<tool-slug>-optimization-tips" -Force
```

### Step 2: Create Main Tool Page (`<tool-slug>/index.html`)

Copy an existing tool page (e.g., `base64-encoder-decoder/index.html`) and modify:

**Required elements:**
- One `<h1>` with tool name
- `<title>` + OG/Twitter meta
- `<link rel="canonical" href="https://topwebtool.com/<tool-slug>/" />`
- JSON-LD: `WebApplication` + `BreadcrumbList`
- `datePublished: "2026-08-06"` in Article JSON-LD
- Correct script paths for depth: `../global.js`, `../twt-shell.js`, `../js/context-engine.js`
- AdSense script loader

**Tool logic:**
- Place in `<script>` tag at bottom of `<body>`
- Use `oninput` for instant updates
- Keep all logic client-side only

### Step 3: Create 5 Article Pages

Each article needs:
- `<link rel="canonical" href="https://topwebtool.com/<tool-slug>/<article-slug>/" />`
- JSON-LD: `Article` + `BreadcrumbList`
- `datePublished: "2026-08-06"`
- Script paths: `../../global.js`, `../../twt-shell.js`, `../../js/context-engine.js`
- One `<h1>`

**Standard article slugs:**
- `<tool-slug>-best-practices`
- `<tool-slug>-common-errors`
- `<tool-slug>-future-trends`
- `<tool-slug>-guide`
- `<tool-slug>-optimization-tips`

### Step 4: Register in `global.js`

Add entry to `UTILITIES_REGISTRY` array (before the closing `];`):

```javascript
{
  path: '/<tool-slug>/',
  name: 'Tool Display Name',
  category: 'Category Name',
  desc: 'Short description for search and SEO.',
  icon: '🎯'
}
```

**Valid categories:**
- `Finance & Real Estate`
- `Digital Marketing`
- `AI Prompt Engineering`
- `Developer Utilities`
- `Everyday & Niche Utilities`
- `Health & Lifestyle`
- `AI & Automation`
- `Industrial & Engineering`
- `B2B Business`
- `Trading & Crypto`

### Step 5: Update SEO Files

#### `sitemap.xml`
Add URLs for:
- Tool page: `<url><loc>https://topwebtool.com/<tool-slug>/</loc></url>`
- Each article: `<url><loc>https://topwebtool.com/<tool-slug>/<article-slug>/</loc></url>`

#### `llms.txt`
Add bullet entry:
```markdown
- [Tool Name](https://topwebtool.com/<tool-slug>/) — Description
```

#### `llms-full.txt`
Add tool section with heading, description, and content summary.

### Step 6: Validate

```powershell
npx htmlhint                           # Expect: "Scanned X files, no errors found"
node verify-heads.js                   # Expect: "issues: 0"
node validate-jsonld.js                # Expect: "INVALID blocks: 0"
python build-deploy.py                 # Validates sitemap, llms, robots, headers
```

---

## 3. Registry Reference (`global.js`)

### Structure
```javascript
const UTILITIES_REGISTRY = [
  {
    path: '/tool-slug/',          // URL path, trailing slash required
    name: 'Tool Name',            // Display name
    category: 'Category',         // Must match valid category list
    desc: 'Description...',       // Short description for SEO/search
    icon: '🎯'                    // Single emoji icon
  }
];
```

### Consumers
| File | Usage |
|------|-------|
| `index.html` | Renders homepage category grid |
| `twt-shell.js` | Builds sidebar navigation |
| `js/context-engine.js` | Builds right-rail related tools |
| `global.js` | Footer tool count, sidebar title |

**No other file hardcodes tool names or paths.**

---

## 4. Article Page Conventions

### Naming
- **Folder**: `<tool-slug>/<article-slug>/`
- **File**: `index.html`
- **Canonical**: `https://topwebtool.com/<tool-slug>/<article-slug>/`

### Required JSON-LD
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "name": "Article Title",
  "url": "https://topwebtool.com/<tool-slug>/<article-slug>/",
  "datePublished": "2026-08-06",
  "description": "Article description"
}
```

### BreadcrumbList
Always include 3-level breadcrumb for articles:
1. Home (`https://topwebtool.com/`)
2. Tool (`https://topwebtool.com/<tool-slug>/`)
3. Article (`https://topwebtool.com/<tool-slug>/<article-slug>/`)

---

## 5. CSS/JS Architecture

### Load Order (Every Page)
```html
<script>/* early theme blocker */</script>
<link rel="stylesheet" href="./styles.css">          <!-- Tailwind output -->
<link rel="stylesheet" href="./global.css">
<link rel="stylesheet" href="./topwebtool-core.css">
<script src="../js/global.js"></script>               <!-- UTILITIES_REGISTRY -->
<script src="../js/twt-shell.js"></script>             <!-- Shell renderer -->
<script src="../js/context-engine.js" defer></script>  <!-- Context rail -->
```

**Note**: Paths vary by depth (`./js/`, `../js/`, `../../js/`).

### Key Files
| File | Purpose |
|------|---------|
| `global.css` | Theme variables, layout, emotional design animations |
| `topwebtool-core.css` | Shell layout, rail modules, responsive breakpoints |
| `src.css` | Tailwind source with brand color theme |
| `twt-shell.js` | Header/footer/sidebar injection |
| `js/context-engine.js` | Right-rail context modules |

### Emotional Design Classes (Optional)
Add these to tool pages for engagement:
- `.twt-skeleton` — Shimmer loading placeholder
- `twt-card-animate` — Staggered card entrance (auto-applied on homepage)
- Call `window.fireConfetti()` — Celebration burst on results

---

## 6. Testing Checklist

### Automated
```powershell
npx htmlhint                    # All HTML files valid
node verify-heads.js            # Head/meta integrity
node validate-jsonld.js         # JSON-LD valid
python build-deploy.py          # Cross-reference validation
```

### Manual Browser Tests
1. **Homepage**: Tool appears in correct category, searchable
2. **Tool page**: Category dropdown updates units, conversion calculates
3. **Mobile**: Layout stacks, drawer opens, search works
4. **Theme toggle**: Light/dark切换 without flash
5. **Console**: No errors in browser dev tools

### Playwright Quick Test
```javascript
await page.goto('http://localhost:3000/<tool-slug>/');
await page.locator('#from-value').fill('100');
await page.locator('#unit-category').selectOption('weight');
const result = await page.locator('#result').textContent();
console.log(result); // Should show converted value
```

---

## 7. SEO Requirements

### Every Tool Page Must Have
- [ ] One `<h1>` with tool name
- [ ] `<title>` + OG/Twitter meta
- [ ] `<link rel="canonical">`
- [ ] JSON-LD: `WebApplication` + `BreadcrumbList`
- [ ] AdSense script loader
- [ ] `datePublished: "2026-08-06"`

### Every Article Page Must Have
- [ ] One `<h1>` with article title
- [ ] `<title>` + OG/Twitter meta
- [ ] `<link rel="canonical">`
- [ ] JSON-LD: `Article` + `BreadcrumbList`
- [ ] `datePublished: "2026-08-06"`

---

## 8. Common Pitfalls

1. **Forgetting to update `sitemap.xml`** — Build script will fail
2. **Wrong script paths** — Articles need `../../js/`, tool pages need `../js/`
3. **Missing JSON-LD** — AI crawlers and SEO tools rely on it
4. **Multiple `<h1>` tags** — Only one per page
5. **Hardcoding tool counts** — Use `UTILITIES_REGISTRY.length` dynamically
6. **Adding `_redirects` file** — Causes redirect loops with Cloudflare native handling
7. **Forgetting `.git add -f` for PNGs** — `.gitignore` contains `*.png`

---

## 9. Emotional Design Patterns

When adding new tools, consider these engagement patterns:

### Tier 1 (Easy)
- Add `twt-skeleton` class to result containers
- Call `window.fireConfetti()` on successful calculation
- Use micro-copy in buttons: "Copy ✓", "Calculating..."

### Tier 2 (Medium)
- Add hover animations to interactive elements
- Include first-visit coach marks for complex tools
- Add sound toggle for click feedback

### Tier 3 (Advanced)
- Track tool completion in `localStorage`
- Add result storytelling narratives
- Implement session streak counter

---

## 10. Deployment

### Build ZIP
```powershell
python build-deploy.py
```

### What Gets Excluded
`.git`, `.kilo`, `.opencode`, `.vscode`, `node_modules`, `dist`, `.agent-zero`, `.playwright-mcp`, `.well-known`, `.test`, `*.ps1`, `*.py`, `*.zip`, `AGENTS.md`, `README.md`

### Cloudflare Pages
- Root directory is publish directory
- No build command needed (static site)
- `_headers` file controls response headers
- `worker.js` handles AI crawler markdown responses

---

## 11. Useful Commands

```powershell
# Local server
python -m http.server 3000

# Validation
npx htmlhint
node verify-heads.js
node validate-jsonld.js
python build-deploy.py

# Git
git status --short
git diff -- global.js index.html
```

---

## 12. Getting Help

- **Project docs**: `PROJECT_STRUCTURE.md`, `TODO.md`, `EMOTIONAL_DESIGN.md`
- **Build script**: `build-deploy.py` — validates all cross-references
- **Agent memory**: Check `.kilo/` for project decisions and constraints
