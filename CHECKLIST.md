# SEO & AdSense Optimization Checklist
Generated from: FINDINGS.txt, GUIDE.txt, PageSpeed audit findings
Scope: All HTML pages under D:\TOPWEBTOOL

## 1. Meta & Semantic SEO
- [x] Unique `<title>` per page (60 chars max, keyword + brand)
- [x] Unique `<meta name="description">` per page (150–160 chars)
- [x] `<link rel="canonical">` present and correct
- [x] Single `<h1>` per page
- [x] Logical heading hierarchy `h1` → `h2` → `h3` without skipping levels
- [x] Semantic HTML5 elements used (`<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`)
- [x] No duplicate `<title>` or `<meta description>` across pages

## 2. Structured Data
- [x] JSON-LD present on tool pages (`WebApplication` or `SoftwareApplication`)
- [x] JSON-LD present on article pages (`Article` or `TechArticle`)
- [x] FAQ schema on pages with FAQ sections (`FAQPage`)
- [x] Structured data validates in Rich Results Test

## 3. Accessibility (a11y)
- [x] All buttons have accessible names (`aria-label` or visible text)
- [x] All form controls have associated `<label for="...">`
- [x] Images have descriptive `alt` text
- [x] No accessibility tree violations (missing roles, invalid nesting)
- [x] Color contrast ratio ≥ 4.5:1 for normal text, ≥ 3:1 for large text
- [x] Focus indicators visible on interactive elements
- [x] No `div`-based buttons without proper ARIA roles

## 4. Performance & Core Web Vitals
- [x] Render-blocking CSS minimized (inline critical CSS, defer non-critical)
- [x] Render-blocking JS deferred or async (`defer`/`async` or moved to end of `<body>`)
- [x] Google Fonts optimized:
  - [x] `preconnect` hint added for `fonts.googleapis.com` and `fonts.gstatic.com`
  - [x] `display=swap` present
  - [x] Font file size reviewed; subset if possible
- [x] Critical request chain length minimized
- [x] No forced reflows (avoid reading layout properties after DOM mutations without batching)
- [x] CLS contributors identified and fixed (reserve dimensions for images/embeds, avoid dynamic inserts above fold)
- [x] LCP target < 2.5s; INP target < 200ms; CLS target < 0.1
- [x] Images use modern formats (WebP/AVIF) with `<picture>` fallbacks
- [x] Images include `width` and `height` attributes

## 5. Content Enrichment (AdSense Thin-Content Mitigation)
- [x] Editorial intro section above the tool (150–200 words)
- [x] How-to / step-by-step guide section (3–5 steps)
- [x] Deep-dive content section (formulas, definitions, technical explanation)
- [x] FAQ section with 3–5 high-value questions
- [x] Page text-to-code ratio ≥ 40% indexable text
- [x] Pre-loaded sample data / default values in inputs
- [x] No empty ad slot placeholders in DOM

## 6. Trust & Compliance (AdSense Approval)
- [x] Privacy Policy page exists and is linked in footer
- [x] Terms of Service page exists and is linked in footer
- [x] Cookie Disclosure / Consent mechanism present
- [x] Disclaimer page exists (especially for YMYL tools)
- [x] About Us / Mission page exists
- [x] Contact / “Request a Tool” functional page exists
- [x] Legal pages explicitly mention data safety for user inputs

## 7. Navigation & Internal Linking
- [x] Consistent global navigation across all pages
- [x] Breadcrumbs on tool and article pages
- [x] Related articles / tools section at bottom of pages
- [x] No orphan pages (every page reachable from homepage or hub)
- [x] Hub structure: Finance & Tax, AI & Prompting, Marketing & SEO, Dev & Quick Utils

## 8. URL & Indexation Hygiene
- [x] Clean, keyword-rich URLs (no query strings for tool pages)
- [x] `sitemap.xml` includes all tool and article URLs
- [x] `robots.txt` allows crawling of tools and articles
- [x] Noindex applied to dynamic outputs / user-generated content containers
- [x] No broken internal links (404s)

## 9. AdSense Placement & Policy
- [x] Ads placed near tool content, not overlapping action buttons
- [x] No ads on onboarding/empty state before user interaction
- [x] Competing monetization scripts removed (pop-unders, native ad blocks)
- [x] No sticky/floating promotional bars that violate UX policies
- [x] Ad labels (“Sponsored”, “Advertisement”) visible where required

## 10. Mobile & Cross-Device
- [x] Viewport meta tag present
- [x] Touch targets ≥ 48×48px
- [x] Horizontal scroll absent on mobile viewports
- [x] Font sizes readable on mobile (base ≥ 16px)
- [x] Forms usable on mobile (inputs, selects, buttons)

## 11. JavaScript Architecture
- [x] Tool scripts wrapped in IIFE or ES modules (no global namespace pollution)
- [x] Event handlers use `addEventListener` where possible; inline `onclick` minimized
- [x] Heavy scripts deferred until after user interaction where appropriate
- [x] No console errors in production builds

## 12. Image & Media
- [x] All images have `alt` attributes
- [x] Decorative images have empty `alt=""`
- [x] SVGs used for icons with `aria-hidden="true"` or accessible names
- [x] Lazy loading used for below-the-fold images (`loading="lazy"`)
