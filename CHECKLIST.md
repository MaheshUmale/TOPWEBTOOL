# SEO & AdSense Optimization Checklist
Generated from: FINDINGS.txt, GUIDE.txt, PageSpeed audit findings
Scope: All HTML pages under D:\TOPWEBTOOL

## 1. Meta & Semantic SEO
- [ ] Unique `<title>` per page (60 chars max, keyword + brand)
- [ ] Unique `<meta name="description">` per page (150–160 chars)
- [ ] `<link rel="canonical">` present and correct
- [ ] Single `<h1>` per page
- [ ] Logical heading hierarchy `h1` → `h2` → `h3` without skipping levels
- [ ] Semantic HTML5 elements used (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- [ ] No duplicate `<title>` or `<meta description>` across pages

## 2. Structured Data
- [ ] JSON-LD present on tool pages (`WebApplication` or `SoftwareApplication`)
- [ ] JSON-LD present on article pages (`Article` or `TechArticle`)
- [ ] FAQ schema on pages with FAQ sections (`FAQPage`)
- [ ] Structured data validates in Rich Results Test

## 3. Accessibility (a11y)
- [ ] All buttons have accessible names (`aria-label` or visible text)
- [ ] All form controls have associated `<label for="...">`
- [ ] Images have descriptive `alt` text
- [ ] No accessibility tree violations (missing roles, invalid nesting)
- [ ] Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [ ] Focus indicators visible on interactive elements
- [ ] No `div`-based buttons without proper ARIA roles

## 4. Performance & Core Web Vitals
- [ ] Render-blocking CSS minimized (inline critical CSS, defer non-critical)
- [ ] Render-blocking JS deferred or async (`defer`/`async` or moved to end of `<body>`)
- [ ] Google Fonts optimized:
  - [ ] `preconnect` hint added for `fonts.googleapis.com` and `fonts.gstatic.com`
  - [ ] `display=swap` present
  - [ ] Font file size reviewed; subset if possible
- [ ] Critical request chain length minimized
- [ ] No forced reflows (avoid reading layout properties after DOM mutations without batching)
- [ ] CLS contributors identified and fixed (reserve dimensions for images/embeds, avoid dynamic inserts above fold)
- [ ] LCP target < 2.5s; INP target < 200ms; CLS target < 0.1
- [ ] Images use modern formats (WebP/AVIF) with `<picture>` fallbacks
- [ ] Images include `width` and `height` attributes

## 5. Content Enrichment (AdSense Thin-Content Mitigation)
- [ ] Editorial intro section above the tool (150–200 words)
- [ ] How-to / step-by-step guide section (3–5 steps)
- [ ] Deep-dive content section (formulas, definitions, technical explanation)
- [ ] FAQ section with 3–5 high-value questions
- [ ] Page text-to-code ratio ≥ 40% indexable text
- [ ] Pre-loaded sample data / default values in inputs
- [ ] No empty ad slot placeholders in DOM

## 6. Trust & Compliance (AdSense Approval)
- [ ] Privacy Policy page exists and is linked in footer
- [ ] Terms of Service page exists and is linked in footer
- [ ] Cookie Disclosure / Consent mechanism present
- [ ] Disclaimer page exists (especially for YMYL tools)
- [ ] About Us / Mission page exists
- [ ] Contact / “Request a Tool” functional page exists
- [ ] Legal pages explicitly mention data safety for user inputs

## 7. Navigation & Internal Linking
- [ ] Consistent global navigation across all pages
- [ ] Breadcrumbs on tool and article pages
- [ ] Related articles / tools section at bottom of pages
- [ ] No orphan pages (every page reachable from homepage or hub)
- [ ] Hub structure: Finance & Tax, AI & Prompting, Marketing & SEO, Dev & Quick Utils

## 8. URL & Indexation Hygiene
- [ ] Clean, keyword-rich URLs (no query strings for tool pages)
- [ ] `sitemap.xml` includes all tool and article URLs
- [ ] `robots.txt` allows crawling of tools and articles
- [ ] Noindex applied to dynamic outputs / user-generated content containers
- [ ] No broken internal links (404s)

## 9. AdSense Placement & Policy
- [ ] Ads placed near tool content, not overlapping action buttons
- [ ] No ads on onboarding/empty state before user interaction
- [ ] Competing monetization scripts removed (pop-unders, native ad blocks)
- [ ] No sticky/floating promotional bars that violate UX policies
- [ ] Ad labels (“Sponsored”, “Advertisement”) visible where required

## 10. Mobile & Cross-Device
- [ ] Viewport meta tag present
- [ ] Touch targets ≥ 48×48px
- [ ] Horizontal scroll absent on mobile viewports
- [ ] Font sizes readable on mobile (base ≥ 16px)
- [ ] Forms usable on mobile (inputs, selects, buttons)

## 11. JavaScript Architecture
- [ ] Tool scripts wrapped in IIFE or ES modules (no global namespace pollution)
- [ ] Event handlers use `addEventListener` where possible; inline `onclick` minimized
- [ ] Heavy scripts deferred until after user interaction where appropriate
- [ ] No console errors in production builds

## 12. Image & Media
- [ ] All images have `alt` attributes
- [ ] Decorative images have empty `alt=""`
- [ ] SVGs used for icons with `aria-hidden="true"` or accessible names
- [ ] Lazy loading used for below-the-fold images (`loading="lazy"`)
