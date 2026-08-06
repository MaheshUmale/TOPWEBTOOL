# TopWebTool — Backlog Feasibility Report (HTML/JS/CSS Only)

**Date:** 2026-08-06
**Scope:** Every "Planned" item in `FEATURE_TO_DO_LIST.md` (Phases 1–16 + Architecture templates)
**Question answered:** Which future tools can be shipped with **pure client-side HTML + Vanilla JS + CSS only** — zero backend, zero paid API, zero server, matching the existing static-Cloudflare-Pages architecture.

---

## Classification Legend

| Mark | Meaning |
|------|---------|
| 🟢 **PURE** | Fully implementable with HTML/JS/CSS. Math, formulas, timers, canvas/SVG, localStorage. No external data at all. |
| 🟢 **PURE+DATA** | Same as PURE, but needs a **static reference dataset bundled in the page** (lookup tables, formulas coefficients, standard rate sheets). Data is embedded at build time — still no backend/API. |
| 🟡 **LIMITED** | The **core tool works fully client-side**, but any *live/real-time* variant (real prices, real scores, live interest rates) would require an external/paid API. Ship the input-your-own-data version client-side. |
| 🔴 **API/BACKEND** | Genuinely requires a backend or paid API even for the base feature (e.g., scanning external hosts, live market feeds). |
| ⚠️ **YMYL** | Technically PURE, but a "Your Money or Your Life" niche (legal/medical/financial). Must ship with strong disclaimers and "educational estimator" framing. |

---

## Phase 1 — Core Utility Tools

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 9 | HTML Entities Escaper | 🟢 PURE | `encodeURIComponent`-style maps + regex. Trivial. |

---

## Phase 3 — Finance & Business Calculators

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 29 | Markup vs. Margin Tool | 🟢 PURE | Simple arithmetic. |
| 30 | Unit Economics Break-Even Solver | 🟢 PURE | Fixed/var cost crossover math. |

---

## Phase 4 — Real Estate & Moving Utilities

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 31 | Rent vs. Buy Optimization Matrix | 🟢 PURE | 30-yr net-worth projection from user assumptions. |
| 32 | Home Affordability & DTI Solver | 🟢 PURE | 28/36 rule math. |
| 33 | Property Tax Escalation Projector | 🟢 PURE | Compound-growth table. |
| 34 | Moving Cost & Volume Cubing Engine | 🟢 PURE+DATA | Furniture dimensions table embedded. |
| 35 | Home Equity & HELOC Estimator | 🟢 PURE | LTV limits 80–85%. |
| 36 | Landlord Rental Cash Flow Matrix | 🟢 PURE | NOI / Cap Rate math. |
| 37 | Bi-Weekly Mortgage Paydown Accelerator | 🟢 PURE | Amortization math (reuse mortgage engine). |
| 38 | Refinance Break-Even Tracker | 🟢 PURE | Closing costs vs monthly savings. |
| 39 | Down Payment Savings Timeline Engine | 🟢 PURE | Compound HYSA milestone dates (user rate). |
| 40 | Property Rental Yield & ROI Calculator | 🟢 PURE | Cash-on-Cash, IRR math. |

---

## Phase 5 — Personal Finance & Credit

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 41 | Credit Score Simulator & Action Matrix | 🟡 LIMITED ⚠️ | Weighted model runs client-side, but FICO® is proprietary — ship as "educational simulator", not a real score. Live bureau scores need a paid API. |
| 42 | Student Loan IDR Engine | 🟢 PURE+DATA | Federal Poverty Guidelines are static tables → embed. |
| 43 | Debt Consolidation Loan Evaluator | 🟢 PURE | Weighted-average rate math. |
| 44 | Emergency Fund Runway Generator | 🟢 PURE | Monthly-burn math. |
| 45 | Net Worth Real-Time Ledger | 🟢 PURE | localStorage persistence. |
| 46 | HYSA vs. Traditional Bank Tracker | 🟢 PURE | Compounding comparison. |
| 48 | Early Retirement FIRE Calculator | 🟢 PURE | 4% safe-withdrawal rule. |
| 49 | Child College Fund Tuition Modeler | 🟢 PURE | FV with education-inflation assumption. |
| 50 | Subscription Leak Audit | 🟢 PURE | localStorage + cumulative math. |

---

## Phase 6 — Trading, Crypto & Advanced Investing

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 51 | DCA Backtest Visual Modeler | 🟡 LIMITED | Backtest works on **user-pasted price series** or embedded sample data. Live price history needs an API (free/paid). |
| 52 | Crypto Position Size & Risk Mgmt | 🟢 PURE | 1–2% account risk math. |
| 53 | Covered Call Yield Tracker | 🟡 LIMITED | Yield math client-side; **live option premiums** need API. Input-your-own premium works. |
| 54 | Covered Put / Wheel Strategy Modeler | 🟢 PURE | Multi-stage math model. |
| 55 | Option Profit/Loss Risk Matrix | 🟢 PURE | Multi-leg grid; embed Black-Scholes for EV. |
| 56 | Stock Split & Cost Basis Grid | 🟢 PURE | Ratio math. |
| 57 | Crypto Impermanent Loss Estimator | 🟢 PURE | `xy=k` formula. |
| 58 | Crypto Mining Profitability Solver | 🟡 LIMITED | Hashrate/difficulty/power inputs = PURE; live difficulty & BTC price need API. |
| 59 | Stock Intrinsic Value (Margin of Safety) | 🟢 PURE | Graham formula / DCF from user inputs. |

---

## Phase 7 — B2B Business, Logistics & Taxes

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 61 | LLC Structure Tax Savings Comparison | 🟡 LIMITED ⚠️ | Runs on **embedded static federal brackets**; state rules change — bundle a dated table, label "estimator". |
| 62 | Employee vs. Independent Contractor Cost | 🟢 PURE+DATA | W2 vs 1099 with embedded payroll tax rates. |
| 63 | SaaS LTV:CAC Matrix | 🟢 PURE | ARPU/churn/marketing formulas. |
| 64 | Inventory EOQ Optimizer | 🟢 PURE | √(2DS/H) formula. |
| 65 | Small Business DSO Tracker | 🟢 PURE | AR ÷ credit sales × days. |
| 66 | Corporate Cash Burn Runway Planner | 🟢 PURE | localStorage + monthly burn. |
| 67 | Freight Dimensional Weight Grid | 🟢 PURE | LWH÷139 / ÷166 density factors. |
| 68 | Retainer Project Profitability Analyzer | 🟢 PURE | Revenue allocation math. |
| 69 | Equipment Depreciation Schedule | 🟢 PURE | Straight-line & DDB toggles. |
| 70 | Merchant Account Fee Matrix | 🟢 PURE+DATA | Interchange-plus vs flat-rate with embedded typical rate cards. |

---

## Phase 8 — Health, Longevity & Lifestyle

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 71 | Macro Nutrient Planner | 🟢 PURE | TDEE + macro math. |
| 72 | Intermittent Fasting Timeline | 🟢 PURE | Countdown timers (16:8, 20:4, OMAD). |
| 73 | Hydration & Electrolyte Engine | 🟢 PURE | Body-weight/temp formulas. |
| 74 | Body Fat % Navy Circumference | 🟢 PURE | Neck/waist/hip formulas. |
| 75 | Target Heart Rate Zone Optimizer | 🟢 PURE | Karvonen formula. |
| 76 | Sleep Cycle REM Alarm Matrix | 🟢 PURE | 90-min cycle math + `setTimeout`/notifications. |
| 77 | Glycemic Load & Insulin Modeler | 🟢 PURE+DATA | GI lookup table embedded. |
| 78 | Vitamin Deficiency Audit | 🟡 LIMITED ⚠️ | Checklist runs client-side but is **medical** — educational framing, disclaimer. |
| 79 | Alcohol BAC Tracker | 🟢 PURE ⚠️ | Widmark formula; regulatory disclaimer. |
| 80 | Ergonomic Workspace Layout Guide | 🟢 PURE | Height-based spatial math. |

---

## Phase 9 — Everyday Lifestyle

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 82 | BMR & TDEE Calorie Calculator | 🟢 PURE | Mifflin-St Jeor formulas. |
| 83 | Pregnancy Due Date Predictor | 🟢 PURE | Date math (LMP/Naegele). |
| 84 | Age Calculator (Y/M/D) | 🟢 PURE | Date math, ms precision. |
| 85 | Chronometer Split Lap Timer | 🟢 PURE | `performance.now()` — reuse fortune-wheel patterns. |
| 86 | Pomodoro Productivity Matrix | 🟢 PURE | Work/rest session tracker. |
| 87 | Binary ↔ Decimal Converter | 🟢 PURE | Native `BigInt`/`parseInt`. |
| 88 | Random Number & Group Picker | 🟢 PURE | `Math.random()` + seeded PRNG option. |
| 89 | HEX ↔ RGBA Color Tool | 🟢 PURE | Channel math. |
| 90 | Sound Frequency Generator | 🟢 PURE | `AudioContext` oscillator. |

---

## Phase 10 — Industrial & Engineering (High CPC)

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 91 | Wiring Harness Bundle Diameter & Weight | 🟢 PURE+DATA | Packing-density geometry + wire gauge table. |
| 92 | Mil-Spec Connector Pinout Constructor | 🟢 PURE+DATA | D38999 pin tables embedded. |
| 93 | Battery Pack Busbar & Heat-Dissipation | 🟢 PURE | Electrical + thermal formulas. |
| 94 | Panel Enclosure Thermal Solver | 🟢 PURE | Convection + fan CFM formulas. |
| 95 | PCB Microstrip Impedance Modeler | 🟢 PURE | Standard microstrip formulas (FR4). |
| 96 | CNC Feeds, Speeds & MRR Matrix | 🟢 PURE+DATA | Chip-load tables embedded. |
| 97 | Sheet Metal Bend Allowance Unfolder | 🟢 PURE | K-factor formula + canvas. |
| 98 | Acoustic Room Mode Analyzer | 🟢 PURE | Room-mode resonance equations. |
| 99 | Hydraulic Pressure Drop Modeler | 🟢 PURE | Reynolds + turbulent-flow formulas. |
| 100 | Rigging & Bridle Sling Tension Solver | 🟢 PURE | Vector trigonometry. |
| 101 | Injection Molding Cycle & Clamp Force | 🟢 PURE | Projected-area tonnage math. |
| 102 | Carbon Fiber Laminate Stack | 🟢 PURE+DATA | Ply property tables. |
| 103 | Spur Gear Geometry Mesh Generator | 🟢 PURE | Involute math + canvas. |
| 104 | Pump Selection & TDH Spreadsheet | 🟢 PURE | Friction-loss + TDH formulas. |
| 105 | Thermocouple / RTD Voltage Converter | 🟢 PURE+DATA | NIST polynomial coefficients embedded. |

**Phase 10 is 100% client-side.** Highest-value niche for CPC.

---

## Phase 11 — Agentic AI Harness & Orchestration

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 106 | Multi-Agent Topology & Workflow Harness | 🟢 PURE | SVG node-graph + drag-drop + text export. |
| 107 | LLM Token & API Cost Estimator | 🟡 LIMITED | Runs on **embedded pricing table** (updateable). Live pricing needs API. |
| 108 | RAG Vector Chunking Simulator | 🟢 PURE | Fixed/overlapping/semantic chunking algorithms. |
| 109 | Prompt Chain Debugger & Variable Injector | 🟢 PURE | Deterministic state manager. |
| 110 | System Prompt & Tool-Calling Builder | 🟢 PURE | XML/Markdown block generator. |
| 111 | Prompt Injection Guardrail Matrix | 🟢 PURE | Regex/validation blocks. |
| 112 | Cron-Job Scheduler | 🟢 PURE | Crontab expression generator. |
| 113 | Playwright/Puppeteer Script Generator | 🟢 PURE | Generates `.js`/`.py` text from form inputs. |
| 114 | CrewAI / AutoGen YAML Designer | 🟢 PURE | YAML string generation. |
| 115 | Agent State-Machine Router Evaluator | 🟢 PURE | Branch/loop detection logic. |
| 116 | JSON-Schema (Pydantic) Generator | 🟢 PURE | Schema ↔ Pydantic code generation. |
| 117 | Eval Matrix Engine for AI Outputs | 🟢 PURE | Levenshtein, BLEU, keyword scoring in JS. |
| 118 | OpenAPI → Tool Definition Converter | 🟢 PURE | Parses OpenAPI JSON, emits function arrays. |
| 119 | Long-Term Memory Token Matrix | 🟢 PURE | Context-window math. |
| 120 | HITL Interception Point Planner | 🟢 PURE | Flowchart/conditional blocks. |

**Phase 11 is also 100% client-side** and uniquely positioned to ride the AI-tool SEO wave.

---

## Phase 12 — Legal (Premium CPC)

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 121 | PI Settlement Visual Modeler | 🟢 PURE+DATA ⚠️ | Damages math + body-map canvas, jurisdiction multipliers embedded. Strong YMYL disclaimer. |
| 122 | Class-Action Eligibility Checker | 🟢 PURE+DATA ⚠️ | Mass-tort criteria matching on embedded rules. |
| 123 | Medical Malpractice Damages Matrix | 🟢 PURE+DATA ⚠️ | LEC math client-side; state cap tables embedded. YMYL. |
| 124 | Workers' Comp Disability Rating | 🟢 PURE+DATA ⚠️ | AMA Guides tables embedded. YMYL. |
| 125 | Commercial Truck Liability Scorecard | 🟢 PURE ⚠️ | Weighted boolean logic. |
| 126 | Lemon Law Compensation Grid | 🟢 PURE+DATA ⚠️ | Statutory limits per state embedded. |
| 127 | NDA / Non-Compete Risk Scorecard | 🟢 PURE+DATA ⚠️ | Restrictive-covenant rule dictionary. |
| 128 | IP Patent Maintenance Fee Matrix | 🟢 PURE+DATA | USPTO fee schedule embedded (static). |
| 129 | Tenant Deposit Withholding Engine | 🟢 PURE+DATA ⚠️ | State treble-damage multipliers embedded. |
| 130 | Product Liability Exposure Calculator | 🟢 PURE ⚠️ | Decision-tree routing. |

All feasible client-side; every page must carry a clear **"educational estimate, not legal advice"** disclaimer.

---

## Phase 13 — Insurtech, Cyber Security & Compliance

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 131 | Ransomware Business Interruption Planner | 🟢 PURE ⚠️ | Operational-runway math. |
| 132 | Flood Damage Remediation Cost Modeler | 🟢 PURE+DATA | Dry-out cost rates embedded. |
| 133 | Cyber Liability Coverage Sizing | 🟢 PURE+DATA | PII-volume rate bands embedded. |
| 134 | SOC2 Readiness Milestone Matrix | 🟢 PURE | Security-principles checklist + localStorage. |
| 135 | Key-Person Valuation Projector | 🟢 PURE | Revenue attribution + replacement cost. |
| 136 | GL Premium Audit Variable Adjuster | 🟢 PURE+DATA | Payroll/gross-sales rate tables embedded. |
| 137 | D&O Litigation Shield Valuation | 🟢 PURE ⚠️ | Exposure scoring matrix. |
| 138 | Commercial Fleet Risk Assessor | 🟢 PURE | Telematics event scores (user-entered). |
| 139 | HIPAA Breach Penalties Tiered Matrix | 🟢 PURE+DATA | Federal tier tables embedded (static). |
| 140 | Product Recall Logistics Cost Calculator | 🟢 PURE | Freight/distribution math. |

---

## Phase 14 — Industrial Automation, Clean Energy & Mechanical

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 141 | Automated Warehouse AGV Fleet Optimizer | 🟢 PURE | Throughput simulation math. |
| 142 | Solar Micro-Grid Power Curve Modeler | 🟢 PURE+DATA | Panel angles + insolation tables. |
| 143 | Pneumatic CFM & Pressure Drop Matrix | 🟢 PURE | Friction/compressor-sizing formulas. |
| 144 | EV Delivery Fleet Charging Planner | 🟢 PURE | Battery/range math. |
| 145 | Robotics MTBF Predictor | 🟢 PURE | Weibull distribution math. |
| 146 | Three-Phase Power Factor Capacitor Sizing | 🟢 PURE | kVAR balancing math. |
| 147 | Conveyor Throughput Volumetric Engine | 🟢 PURE | Mass-transfer geometry. |
| 148 | CNC Plasma Cutting Gas Optimization | 🟢 PURE+DATA | Material-thickness consumption tables. |
| 149 | Boiler Steam Condensate Recovery Solver | 🟢 PURE | Flash-steam heat math. |
| 150 | Dust Collection Duct Velocity Mesh | 🟢 PURE | Airflow/explosion-hazard calc. |

---

## Phase 15 — B2B DevOps, Cloud & Vector Data

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 151 | AWS/Azure Egress Cost Modeler | 🟡 LIMITED | Runs on **embedded pricing tables** (dated); live prices need API. |
| 152 | K8s Pod Resource & Autoscale Modeler | 🟢 PURE | Node-scaling simulation. |
| 153 | Vector DB HNSW Memory Sizer | 🟢 PURE | Dimensionality math. |
| 154 | Sharding Distribution Topology Simulator | 🟢 PURE | Consistent-hashing rings (canvas). |
| 155 | CI/CD Parallelization Optimizer | 🟢 PURE | Build-DAG math. |
| 156 | API Rate Limiting Token Bucket Visualizer | 🟢 PURE | Canvas bucket states. |
| 157 | GraphQL Complexity Auditor | 🟢 PURE | Query-depth/loop analysis (client-side parse). |
| 158 | Serverless Cold Start Optimizer | 🟡 LIMITED | Runs on embedded AWS parameter tables. |
| 159 | SSL/TLS Certificate Expiry Fleet Monitor | 🔴 **API/BACKEND** | Must scan external hosts — blocked by CORS; requires a serverless function/proxy. **Do not build client-side.** |
| 160 | Kafka Partition Rebalance Simulator | 🟢 PURE | Reassignment simulation. |

Only **1 item (159)** in the entire backlog is genuinely blocked without a backend.

---

## Phase 16 — Corporate Health Systems & Medical Logistics

| # | Tool | Verdict | Notes |
|---|------|---------|-------|
| 161 | ER Triage Throughput Flow Modeler | 🟢 PURE | Queueing-theory math. |
| 162 | Lab Diagnostic Reagent Consumables Matrix | 🟢 PURE | Shelf-life math. |
| 163 | DICOM Storage Network Sizing | 🟢 PURE | Slice-count size math. |
| 164 | Insurance Claim Clean-Rate Predictor | 🟢 PURE+DATA ⚠️ | Coding-validation rule tables. |
| 165 | Industrial Hearing Dosimeter | 🟢 PURE+DATA | OSHA TWA tables embedded. |
| 166 | Cold-Chain Thermal Excursion Predictor | 🟢 PURE | Thermal-resistance math. |
| 167 | PT ROM Milestone Tracker | 🟢 PURE ⚠️ | Joint-degree tracker (localStorage). |
| 168 | Dental Operatory Utilization Grid | 🟢 PURE | Treatment-duration math. |
| 169 | Anesthesia Gas Consumption Engine | 🟢 PURE | Carrier-flow math. |
| 170 | Medical Equipment Lease vs Buy | 🟢 PURE | Straight-line/DDB schedules. |

---

## Architecture & Prompt Templates

| # | Resource | Verdict | Notes |
|---|----------|---------|-------|
| A1 | Master Agentic Developer Prompt | 🟢 PURE | Static documentation/HTML. |
| A2 | AdSense Layout Blueprint | 🟢 PURE | Static template doc. |
| A3 | Anti-Thin Content Strategy | 🟢 PURE | Static strategy doc. |
| A4 | Local Statutory Variable Strategy | 🟢 PURE+DATA | Jurisdiction tables. |
| A5 | High-CPC State Data Matrix | 🟢 PURE+DATA | Static data asset. |
| A6 | Analytics Dashboard Blueprint | 🟢 PURE | Slate-theme static page. |

---

## Summary

| Verdict | Count | Share |
|---------|-------|-------|
| 🟢 PURE (incl. PURE+DATA) | **130** | **~93%** |
| 🟡 LIMITED (core client-side, live variant needs API) | **9** | **~6%** |
| 🔴 API/BACKEND REQUIRED | **1** (#159 SSL/TLS monitor) | **<1%** |

**Every planned tool except #159 can ship on the existing static HTML/JS/CSS architecture** with zero backend and zero paid API. "LIMITED" tools ship fully functional with user-supplied inputs and embedded static reference tables; only their *live-data* add-ons would need an API.

LIMITED items (#9 total): 41, 51, 53, 58, 61, 78, 107, 151, 158.

---

## Recommended Build Order (highest CPC × purest client-side fit)

1. **Phase 10 — Industrial/Engineering** (#91–#105): 100% PURE, engineering-niche CPC, low competition, formula-driven (easy to build, high perceived value).
2. **Phase 11 — AI Agent tools** (#106–#120): 100% PURE, rides the AI-tool SEO surge, code-generation tools are exactly what static JS excels at.
3. **Phase 9 — Lifestyle quick wins** (#82–#90): trivial to build, fill the "Everyday Tools" hub, fast to index.
4. **Phase 4 — Real Estate** (#31–#40): high-value finance CPC, reuses the existing mortgage amortization engine already in the codebase.
5. **Phase 3 — Finance** (#29–#30): two quick high-CPC finance additions.
6. **Skip / park:** #159 (needs backend), and any YMYL tool shipped only with the disclaimer banner.

> **Note:** "LIMITED" tools should be scoped to their client-side core first (input-your-own data + embedded tables) so they launch with zero dependencies; live-data variants can be added later behind a free public API if the CORS-free proxy is ever justified.
