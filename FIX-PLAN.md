# SEO & AdSense Fix Plan
Date: 2026-08-03
Scope: All 139 HTML pages under D:\TOPWEBTOOL
Source findings: FINDINGS.txt, GUIDE.txt, issues-register.csv

## Fix Priority & Strategy

### Priority 1: Performance (139 pages)
**Issue**: Render-blocking stylesheets and scripts in `<head>` without `preconnect` for Google Fonts.
**Fix**:
- Add `<link rel="preconnect" href="https://fonts.googleapis.com">` and `<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>` before the Google Fonts stylesheet link.
- Add `rel="preload"` or `media="print" onload="this.media='all'"` for non-critical CSS where possible.
- Move non-critical JS to end of `<body>` or add `defer`/`async`.
**Automation**: PowerShell script to inject preconnect hints and adjust script tags.

### Priority 2: Semantic HTML (139 pages)
**Issue**: Missing semantic `<nav>` element on all pages.
**Fix**:
- Wrap the global header/navigation area in `<nav aria-label="Main navigation">` or ensure existing header contains a `<nav>`.
- Ensure all pages use `<header>`, `<main>`, `<section>`, `<footer>`.
**Automation**: PowerShell script to inject `<nav>` wrapper if missing.

### Priority 3: Structured Data (116 pages)
**Issue**: Missing JSON-LD structured data on article and tool pages.
**Fix**:
- Tool `index.html` pages: Add `WebApplication` or `SoftwareApplication` JSON-LD.
- Article pages: Add `Article` or `TechArticle` JSON-LD with `headline`, `description`, `url`, `datePublished`.
- Pages with FAQs: Add `FAQPage` schema.
**Automation**: PowerShell script to inject appropriate JSON-LD based on page type (tool vs article).

### Priority 4: Accessibility (21 issues)
**Issue**: Buttons without accessible names; form inputs without labels.
**Fix**:
- Add `aria-label` to icon-only buttons (e.g., toggle switches).
- Ensure all `<input>` elements have a corresponding `<label for="...">`.
- Fix color contrast issues on mobile where reported.
**Automation**: PowerShell script to add `aria-label` to known button IDs; manual review for form labels.

### Priority 5: AdSense Policy (20 issues)
**Issue**: Empty ad placeholder comments (`<!-- AD A REMOVED -->`) present in DOM.
**Fix**:
- Remove all empty ad placeholder comments from all pages.
- Ensure no empty `<div>` containers exist where ads were removed.
**Automation**: PowerShell script to strip placeholder comments and empty ad divs.

## Execution Steps

1. **Create shared fix snippets** (preconnect, JSON-LD templates, nav wrapper)
2. **Run bulk fix scripts** for Performance, Semantic HTML, Structured Data, AdSense
3. **Manual review** for Accessibility issues that require context-aware fixes
4. **Re-run audit** to verify 0 issues
5. **Update DOX docs** (AGENTS.md, checklist) with verification results

## Risk Mitigation
- Backup all HTML files before bulk edits
- Validate HTML syntax after edits
- Test at least one page per tool category after fixes
- Keep changes minimal and targeted to avoid breaking existing functionality
