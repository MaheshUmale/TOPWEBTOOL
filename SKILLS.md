# Skills — base64-encoder-decoder

> Reusable prompt templates, agent instructions, and skill definitions extracted from `scratchpad.md`.
> Parent: D:\TOPWEBTOOL\AGENTS.md (Root DOX Rail)

---

## Purpose

This file captures all reusable skill definitions, prompt templates, and agent instructions that can be passed to AI coding agents to generate TopWebTool utility pages. Each skill is a self-contained instruction set that produces production-ready, AdSense-optimized, client-side HTML/CSS/JS tools.

---

## Skill 1: Master Agentic Developer Prompt (4-Layer Funnel)

**Use when:** Generating a complete tool page with anti-thin-content content silo.

**Invocation:**
```
Act as an Elite Full-Stack Systems Architect and Senior SEO Content Strategist.
Your task is to systematically design and generate a new deployment-ready page
for our utility website network without breaking existing structural styling,
DOM layout, or color palette tokens.
```

### Rules

1. **Architectural & Layout Integration:**
   - Preserve core design tokens (CSS custom properties). Do not write duplicate global class names.
   - Scope all custom elements under `.workspace-[tool-slug]`.
   - Embed AdSense placeholder frames: top leaderboard (728x90) and sticky vertical sidebar (300x600).
   - High-density spreadsheet output grids with `Copy to Clipboard` and `Download CSV` handlers.

2. **4-Layer Anti-Thin-Content Structure:**
   - **Layer 1:** Interactive Engine UI — numerical inputs, step-sliders, variable selects, matrix tracking display table.
   - **Layer 2:** Detailed Mathematical Field Guide Manual — 600+ words. H2: `How It Works: The Mechanical Logic & Core Calculations`. Explicit documentation of mathematical principles, algebraic constants, operational loops. Real-world industrial baseline standards.
   - **Layer 3:** Cross-Linked Internal Directory Silo — styled grid mapping links to three supporting articles in the same subdirectory.
   - **Layer 4:** Data Privacy Safeguards & Client State Persistence — compliance disclaimer confirming local processing. Vanilla JS `localStorage` caching of user input preferences.

3. **Multi-Page Article Content Specification:**
   - `case-study.html` — 400+ words, enterprise business scenario, internal link back to `./index.html`.
   - `technical-math.html` — 400+ words, algorithmic engine deep dive.
   - `operations-guide.html` — 400+ words, practical optimization playbook.

4. **Execution Process:**
   - Output 3 files: `index.html`, `articles-data.txt`, `app.js`.
   - No truncation, no placeholder comments like `// code logic goes here`.
   - Every line of working logic, markup, and copy must be complete.

---

## Skill 2: AI Coding Agent Prompt Template (Tool Generation)

**Use when:** Instructing a coding agent to build a specific tool from the feature list.

**Invocation:**
```
Act as an expert Frontend Developer. Build the [INSERT TOOL NAME] using the
specified implementation brief.
```

### Architectural Requirements

1. **Pure Frontend:** HTML5, modern vanilla CSS, modular asynchronous JavaScript. No external frameworks or node server layers.
2. **Layout for Maximum AdSense:** Multi-column dashboard layout with:
   - 728x90 ad banner below the title header
   - 300x600 skyscraper ad alongside the main calculations grid
   - Large rectangle ad block underneath the primary interactive elements
3. **Interactive Sliders & Inputs:** High-density interactive elements (range sliders, numerical fields, tabbed sub-menus) requiring multiple clicks and inputs.
4. **Large Spreadsheet/Grid Outputs:** Structured inside a large, high-density, scrollable spreadsheet-style table. Include `Copy Data to Clipboard` and `Download CSV Report` buttons.
5. **File Compilation:** Output 3 interconnected files: `index.html`, `styles.css`, `app.js`. Complete, fully executable code blocks. No shortcuts, truncation, or empty placeholders.

---

## Skill 3: AdSense Layout Blueprint (3-Column Dashboard)

**Use when:** Setting up the visual layout structure for any new tool page.

### Layout Specification

```
┌────────────────────────────────────────────────────────┐
│               [ HEADER: TopWebTool ]                   │
├────────────────────────────────────────────────────────┤
│           AD PLACEMENT A: LEADERBOARD BANNER          │
├───────────────────────────┬────────────────────────────┤
│                           │                            │
│   [ CALCULATOR INPUTS ]   │   AD PLACEMENT B: BOX      │
│   - Field 1               │                            │
│   - Field 2               │ ┌────────────────────────┐ │
│                           │ │ RELATED TOOLS SIDEBAR  │ │
│   [ DYNAMIC OUTPUTS ]     │ │ - /roi-calculator      │ │
│   - Result 1              │ │ - /cpm-calculator      │ │
│   - [ COPY BUTTON ]       │ └────────────────────────┘ │
│                           │                            │
└───────────────────────────┴────────────────────────────┘
│       AD PLACEMENT C: STICKY BOTTOM VIEWPORT ANCHOR     │
└────────────────────────────────────────────────────────┘
```

### CSS Placeholder Classes

- `.adsense-top-leaderboard` — `min-h-[90px] max-w-[728px]`, light grey border/background, label "AD PLACEMENT - TOP LEADERBOARD"
- `.adsense-side-skyscraper` — `min-h-[600px] max-w-[300px]`, sticky positioning, label "AD PLACEMENT - HIGH RES VIEWABILITY BOX"
- `.adsense-sticky-footer` — `fixed bottom-0 left-0 w-full z-50`, label "AD PLACEMENT - STICKY FOOTER ANCHOR"

---

## Skill 4: Anti-Thin Content Strategy (4-Layer Funnel)

**Use when:** Ensuring any generated tool page passes AdSense manual review.

### The 4 Layers

1. **Dynamic Header & Universal Global Navigation Bar**
2. **Layer 1: Dynamic Interactive Tool UI Panel** — Range sliders, select fields, pure JavaScript simulation workspace. AdSense code slots (Leaderboard & Skyscraper).
3. **Layer 2: Comprehensive Technical Manual (On-Page Documentation)** — 600+ words explaining core business logic, formulas, target variables. Clear visual definitions of input fields and industry benchmark metrics.
4. **Layer 3: Cross-Linked Semantic Core Article Network** — Grid cards detailing 3 distinct deep dives:
   - Article A: Industry Use Case / Real-World Context Scenario
   - Article B: Mathematical Breakdown & Algorithmic Mechanics
   - Article C: Advanced Troubleshooting / Diagnostic Strategy Guide
5. **Dynamic Footer, Data Privacy Safeguards, & Local Storage Persistence Controls**

### Key Rule

Every utility page must function as a comprehensive Topic Cluster Hub — integrate the live calculator with an on-page structural breakdown, supplemented by a network of contextual articles linking to it.

---

## Skill 5: Local Statutory Variable Strategy (Geo-Targeted AdSense)

**Use when:** Building tools that target high-CPC local legal/insurance keywords.

### Strategy

1. **Interactive HTML Interface Layer:** Embed a jurisdiction selector dropdown in the tool's input panel.
2. **JavaScript Structural Handler:** When the user changes the dropdown:
   - Update DOM text (headings, sidebar content) with local legal terms
   - Pass localized multipliers into the calculation engine
   - Update the URL query parameter (`?region=nyc`)
3. **URL Parameter Trick:** On page load, check `window.location.search`. If `?region=nyc` is found, auto-flip the dropdown and update the DOM with high-CPC keyword headings.
4. **Article Silo:** Create dedicated routing entry doors:
   - `/tool-slug/index.html` — Main universal hub
   - `/tool-slug/nyc-commercial-claims.html` — Dedicated NYC guide
   - `/tool-slug/los-angeles-claims.html` — Dedicated LA guide

### High-CPC State Data Matrix

| State | Fault Rule | Multiplier | Key Statutory Variables | Target Ad Auction |
|-------|-----------|------------|------------------------|-------------------|
| New York | Pure Comparative | 3.5x–5.0x | $50K PIP, Serious Injury threshold (NYS ISC §5102) | Insurance Lawyer in NYC |
| California | Pure Comparative | 2.5x–4.0x | 15/30/5 minimums, Prop 213 exclusion | LA Truck Injury Law |
| Florida | Modified Comparative | 2.0x–3.5x | $10K PIP, permanent injury threshold | Miami Injury Law Firm |
| Texas | Modified Comparative | 2.2x–3.8x | 30/60/25 minimums, 51% Bar Rule | Houston Commercial Truck Lawyer |
| Illinois | Modified Comparative | 2.8x–4.2x | 25/50/20 minimums, no statutory cap | Chicago Injury Lawyer |

---

## Skill 6: Enterprise Analytics Dashboard HTML/JS Blueprint

**Use when:** A coding agent needs a starting template for a high-CPC tool page.

### Structure

- **Color Palette:** Slate base (`#0f172a`), surface (`#1e293b`), indigo accent (`#6366f1`), emerald success (`#10b981`), text main (`#f8fafc`), text muted (`#94a3b8`).
- **Layout:** CSS Grid, 3-column (`360px 1fr 300px`), gap `20px`, max-width `1600px`.
- **Ad Placeholders:** Top leaderboard (728x90), side skyscraper (300x600 sticky), both with dashed border styling.
- **Input Controls:** Number fields, range sliders, select dropdowns. All styled with dark theme.
- **Output:** Scrollable spreadsheet table with `thead`/`tbody`, export to CSV button.
- **JS Engine:** Deterministic calculation loop. Event listener on run button. `DOMContentLoaded` auto-executes.

---

## Skill 7: Agentic AI Harness Builder Prompt

**Use when:** Building multi-agent AI workflow visualization tools.

### Layout Specification

- **Left Sidebar:** Input panel — Agent Name, Role, Backstory, tool dropdown, "Add Agent to Workspace" button.
- **Center Panel:** Massive interactive SVG workspace with draggable node cards and bezier curve connection wires (`<path d="M... C...">`).
- **Bottom Panel:** High-density text terminal that auto-compiles system configuration live.
- **Ad Slots:** 728x90 beneath header, 300x600 alongside SVG workspace, large rectangular frame beneath code output.

### JS Logic

- Vanilla JS drag-and-drop inside SVG. Update `transform` attributes smoothly.
- Dynamic SVG bezier curves between node output hooks and input hooks.
- Python code compiler: tracks all active nodes and connections, generates copy-pasteable CrewAI/AutoGen compatible script.
- Export: `Copy Code to Clipboard` button, `Download main.py` via HTML5 blob generation.
- Persistence: `localStorage` for workspace layouts.

---

## Skill 8: High-Yield Niche Tool Brief Format

**Use when:** Documenting a new tool idea for the feature list.

### Template

```markdown
### [Tool Name]

* **Category:** [Niche Category]
* **Target Advertisers:** [Advertiser types bidding on this niche]
* **CPC Tier:** [High / Premium / Ultra-High]
* **Implementation Strategy:** [1-3 sentence description of the client-side JS approach]
* **Key Formulas/Algorithms:** [Specific math or logic the JS must implement]
* **AdSense Layout:** [Which ad placement slots to use]
* **Content Layers:** [Which of the 4 anti-thin-content layers apply]
* **Estimated Development Effort:** [Small / Medium / Large]
```