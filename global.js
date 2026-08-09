/**
 * TopWebTool Global Core Engine
 * Manages uniform themes, headers, footers, and the 23-tool vertical scroller sidebar.
 */

const UTILITIES_REGISTRY = [
  {
    path: '/mortgage-calculator/',
    name: 'Mortgage Calculator',
    category: 'Finance & Real Estate',
    desc: 'Compute monthly house payments, taxes, and PMI with dynamic amortization schedule breakdowns.',
    icon: '🏡'
  },
  {
    path: '/car-lease-estimator/',
    name: 'Car Lease Estimator',
    category: 'Finance & Real Estate',
    desc: 'Calculate monthly auto lease payments based on MSRP, residual value, money factor, and down payment.',
    icon: '🚗'
  },
  {
    path: '/inflation-calculator/',
    name: 'Inflation Calculator',
    category: 'Finance & Real Estate',
    desc: 'Track and compare historical buying power changes using US CPI & Eurostat inflation metrics.',
    icon: '📈'
  },
  {
    path: '/crypto-tax-estimator/',
    name: 'Crypto Tax Estimator',
    category: 'Finance & Real Estate',
    desc: 'Estimate short-term and long-term capital gains tax brackets for crypto sales instantly.',
    icon: '🪙'
  },
  {
    path: '/hourly-to-salary-converter/',
    name: 'Hourly to Salary Converter',
    category: 'Finance & Real Estate',
    desc: 'Convert hourly wages to annual gross and net income based on standard US/EU tax baselines.',
    icon: '💼'
  },
  {
    path: '/dividend-reinvestment-calculator/',
    name: 'Dividend Reinvestment (DRIP)',
    category: 'Finance & Real Estate',
    desc: 'Project compounding stock growth assuming recurring dividend reinvestment schedules.',
    icon: '📊'
  },
  {
    path: '/ltv-cac-calculator/',
    name: 'LTV CAC Calculator',
    category: 'Finance & Real Estate',
    desc: 'Calculate Customer Lifetime Value, Acquisition Cost, and LTV:CAC ratio for SaaS startups.',
    icon: '📊'
  },
  {
    path: '/dso-tracker/',
    name: 'DSO Tracker',
    category: 'Finance & Real Estate',
    desc: 'Calculate Days Sales Outstanding and track accounts receivable efficiency for small business cash flow.',
    icon: '📅'
  },
  {
    path: '/credit-card-payoff-planner/',
    name: 'Credit Card Payoff Planner',
    category: 'Finance & Real Estate',
    desc: 'Compare Snowball and Avalanche debt payoff tracks to clear outstanding credit card balances.',
    icon: '💳'
  },
  {
    path: '/utm-generator/',
    name: 'UTM Campaign Link Builder',
    category: 'Digital Marketing',
    desc: 'Generate error-free UTM tracking URLs with dynamic copy-to-clipboard functionality.',
    icon: '🔗'
  },
  {
    path: '/roi-calculator/',
    name: 'ROI & ROAS Calculator',
    category: 'Digital Marketing',
    desc: 'Calculate campaign Return on Investment and Return on Ad Spend dynamically.',
    icon: '💰'
  },
  {
    path: '/cpm-calculator/',
    name: 'CPM Campaign Ad Calculator',
    category: 'Digital Marketing',
    desc: 'Compute campaign cost, target CPM, or required impressions instantly.',
    icon: '📢'
  },
  {
    path: '/headline-analyzer/',
    name: 'Copy Headline Analyzer',
    category: 'Digital Marketing',
    desc: 'Score headlines based on emotional word weight, readability, and character length.',
    icon: '✍️'
  },
  {
    path: '/qr-code-generator/',
    name: 'Secure QR Code Generator',
    category: 'Digital Marketing',
    desc: 'Generate downloadable customized high-quality client-side QR codes instantly.',
    icon: '📱'
  },
  {
    path: '/social-media-image-resizer/',
    name: 'Social Image Resizer',
    category: 'Digital Marketing',
    desc: 'Crop and scale assets client-side for Instagram, LinkedIn, YouTube, and X.',
    icon: '🖼️'
  },
  {
    path: '/chatgpt-prompt-optimizer/',
    name: 'ChatGPT Prompt Optimizer',
    category: 'AI Prompt Engineering',
    desc: 'Inject personas, variables, and formatting constraints into basic raw prompt strings.',
    icon: '🤖'
  },
  {
    path: '/midjourney-command-builder/',
    name: 'Midjourney Prompt Builder',
    category: 'AI Prompt Engineering',
    desc: 'Select parameters, version toggles, and aspect ratios to construct precise Midjourney commands.',
    icon: '🎨'
  },
  {
    path: '/ai-text-humanizer-helper/',
    name: 'AI Text Humanizer Helper',
    category: 'AI Prompt Engineering',
    desc: 'Detect robotic structures and optimize copy flow to humanize AI-generated text output.',
    icon: '🧠'
  },
  {
    path: '/json-formatter-validator/',
    name: 'JSON Formatter & Validator',
    category: 'Developer Utilities',
    desc: 'Beautify, compress, validate, and parse raw JSON strings securely offline.',
    icon: '⚙️'
  },
  {
    path: '/password-generator/',
    name: 'Secure Password Generator',
    category: 'Developer Utilities',
    desc: 'Create highly secure, randomized passwords locally with robust length and character toggles.',
    icon: '🔑'
  },
  {
    path: '/lorem-ipsum-generator/',
    name: 'Lorem Ipsum Generator',
    category: 'Developer Utilities',
    desc: 'Generate customizable design placeholder paragraphs, words, or lists instantly.',
    icon: '📝'
  },
  {
    path: '/base64-encoder-decoder/',
    name: 'Base64 Encoder & Decoder',
    category: 'Developer Utilities',
    desc: 'Convert strings and image assets to base64 format and vice-versa fully locally.',
    icon: '🔣'
  },
  {
    path: '/word-character-counter/',
    name: 'Word & Character Counter',
    category: 'Developer Utilities',
    desc: 'Analyze content length, reading time, speaking duration, and sentence statistics.',
    icon: '🔢'
  },
  {
    path: '/fortune-wheel/',
    name: 'Fortune Wheel',
    category: 'Everyday & Niche Utilities',
    desc: 'Interactive customized canvas fortune-wheel spinner to make fast decisions.',
    icon: '☸️'
  },
  {
    path: '/word-unscrambler/',
    name: 'Word Unscrambler Solver',
    category: 'Everyday & Niche Utilities',
    desc: 'Instantly turn scrambled letters into valid words with wildcard search options.',
    icon: '🔡'
  },
  {
    path: '/acoustic-room-analyzer/',
    name: 'Acoustic Room Mode & Standing Wave Calculator',
    category: 'Industrial & Engineering',
    desc: 'Compute axial, tangential, and oblique room modes from the resonance formula, flag problematic low frequencies, and check Bolt-area room ratios.',
    icon: '⚙️'
  },
  {
    path: '/age-calculator/',
    name: 'Age Calculator (Years, Months, Days)',
    category: 'Health & Lifestyle',
    desc: 'Compute an exact age in years, months, and days between any two dates with total days, next birthday countdown, and the weekday you were born, leap-year safe.',
    icon: '🏃'
  },
  {
    path: '/agent-cron-scheduler/',
    name: 'Free Cron-Job & Automation Scheduler Builder',
    category: 'AI & Automation',
    desc: 'Build a valid 5-field crontab expression from visual presets and custom fields, preview the next 5 run times, and copy it instantly. 100% Free, No Email.',
    icon: '🤖'
  },
  {
    path: '/agent-eval-engine/',
    name: 'AI Eval Matrix Engine - Compare AI Outputs',
    category: 'AI & Automation',
    desc: 'Score AI outputs against a gold reference: Levenshtein distance, similarity percent, BLEU-1/2 precision, keyword overlap and character counts. 100% client-side.',
    icon: '🤖'
  },
  {
    path: '/agent-hitl-planner/',
    name: 'Human-in-the-Loop HITL Planner for AI Agents',
    category: 'AI & Automation',
    desc: 'Design human-in-the-loop approval gates: pick agent steps, set approve/reject/edit types, timeouts and fallbacks, and export an interception plan with a flowchart.',
    icon: '🤖'
  },
  {
    path: '/agent-memory-matrix/',
    name: 'LLM Context Window Token Budget Planner',
    category: 'AI & Automation',
    desc: 'Plan your LLM context-window budget: system prompt, conversation turns, memory/RAG content, and reserved output tokens. Utilization, remaining budget, warnings.',
    icon: '🤖'
  },
  {
    path: '/agent-prompt-builder/',
    name: 'System Prompt & Tool-Calling Builder',
    category: 'AI & Automation',
    desc: 'Compose production-ready agent system prompts with persona, goal, context, constraints and output format, and emit function-calling JSON tool schemas.',
    icon: '🤖'
  },
  {
    path: '/agent-state-router/',
    name: 'Agent State-Machine Router Evaluator',
    category: 'AI & Automation',
    desc: 'Model agent states and transitions, then auto-detect unreachable states, duplicate routes, infinite loops, and dead-ends. Exports DOT-style graphs. Free.',
    icon: '🤖'
  },
  {
    path: '/ai-system-topology/',
    name: 'Multi-Agent System Topology Harness',
    category: 'AI & Automation',
    desc: 'Design multi-agent AI systems visually: add agent nodes with role, model and temperature, connect sequential, parallel and conditional edges, and export topology text plus Python skeletons.',
    icon: '🤖'
  },
  {
    path: '/autogen-yaml-designer/',
    name: 'CrewAI / AutoGen YAML Designer',
    category: 'AI & Automation',
    desc: 'Design agents, goals, tools, and tasks in a visual builder and generate valid, properly indented CrewAI, AutoGen, or custom YAML config. Copy or download.',
    icon: '🤖'
  },
  {
    path: '/battery-busbar-calculator/',
    name: 'Battery Pack Busbar & Heat-Dissipation Modeler',
    category: 'Industrial & Engineering',
    desc: 'Size EV battery pack busbars: current per cell group, required copper or nickel cross-section from current density, voltage drop, and temperature rise.',
    icon: '⚙️'
  },
  {
    path: '/binary-decimal-converter/',
    name: 'Free Binary to Decimal Converter',
    category: 'Developer Utilities',
    desc: 'Convert binary, octal, decimal, and hex numbers in real time with exact BigInt math. Live cross-base results with step-by-step details. Free, 100% client-side.',
    icon: '💻'
  },
  {
    path: '/biweekly-mortgage-calculator/',
    name: 'Biweekly Mortgage Calculator - Payoff Accelerator',
    category: 'Finance & Real Estate',
    desc: 'Compare monthly vs biweekly mortgage payments. See how making 13 payments per year can shave years off your loan and save thousands in interest.',
    icon: '💰'
  },
  {
    path: '/bmr-tdee-calculator/',
    name: 'BMR & TDEE Calorie Calculator',
    category: 'Health & Lifestyle',
    desc: 'Calculate Basal Metabolic Rate and Total Daily Energy Expenditure with the Mifflin-St Jeor equation, plus cutting and bulking calorie targets. Free, offline, client-side.',
    icon: '🏃'
  },
  {
    path: '/cash-burn-runway/',
    name: 'Cash Burn Runway Calculator - Startup Run Rate Planner',
    category: 'B2B Business',
    desc: 'Calculate how long your startup can operate before running out of cash. Track monthly burn rate, run rate, and runway with our free planner.',
    icon: '📊'
  },
  {
    path: '/cnc-feeds-speeds/',
    name: 'CNC Feeds & Speeds Calculator: RPM & Chip Load',
    category: 'Industrial & Engineering',
    desc: 'Calculate CNC spindle RPM, feed rate, and material removal rate from surface speed and embedded chip-load tables for aluminum, titanium, steel, and more.',
    icon: '⚙️'
  },
  {
    path: '/composite-laminate-calculator/',
    name: 'Composite Laminate Calculator: Layup, Weight & More',
    category: 'Industrial & Engineering',
    desc: 'Calculate laminate thickness, areal weight, fiber volume fraction, and structural cost for carbon, glass, and kevlar composite layups.',
    icon: '⚙️'
  },
  {
    path: '/connector-pinout-mapper/',
    name: 'Mil-Spec Connector Pinout Mapper',
    category: 'Industrial & Engineering',
    desc: 'Map Mil-Spec D38999 connector pinouts: pick shell size and insert arrangement, assign signal names to pins, and export a wire list as CSV.',
    icon: '⚙️'
  },
  {
    path: '/crypto-position-size/',
    name: 'Crypto Position Size & Risk Management',
    category: 'Trading & Crypto',
    desc: 'Crypto position sizing and risk calculator using the 1-2% account rule with entry, stop-loss, take-profit and leverage inputs. 100% free, client-side.',
    icon: '📈'
  },
  {
    path: '/depreciation-schedule/',
    name: 'Depreciation Schedule Calculator - Straight-Line & DDB',
    category: 'B2B Business',
    desc: 'Generate business equipment depreciation schedules. Compare straight-line vs double-declining balance methods with full annual tables.',
    icon: '📊'
  },
  {
    path: '/down-payment-savings/',
    name: 'Home Down Payment Savings Calculator',
    category: 'Finance & Real Estate',
    desc: 'Calculate how long it will take to save for a home down payment. Plan your savings timeline with HYSA yield projections.',
    icon: '💰'
  },
  {
    path: '/enclosure-thermal-solver/',
    name: 'Industrial Enclosure Thermal Solver',
    category: 'Industrial & Engineering',
    desc: 'Compute internal temperature rise of sealed or vented electrical enclosures from heat dissipation, surface area, material, and required fan CFM.',
    icon: '⚙️'
  },
  {
    path: '/eoq-calculator/',
    name: 'EOQ Calculator - Economic Order Quantity Optimizer',
    category: 'B2B Business',
    desc: 'Calculate optimal Economic Order Quantity (EOQ) to minimize inventory costs. Free inventory optimization tool for supply chain management.',
    icon: '📊'
  },
  {
    path: '/freight-dimensional-weight/',
    name: 'Dimensional Weight Calculator - Freight Shipping Cost Tool',
    category: 'B2B Business',
    desc: 'Calculate freight dimensional weight for UPS, FedEx, DHL, USPS, and general carriers. Optimize shipping costs with accurate billable weight calculations.',
    icon: '📊'
  },
  {
    path: '/gear-tooth-generator/',
    name: 'Gear Tooth Generator: Involute Calculator',
    category: 'Industrial & Engineering',
    desc: 'Generate involute gear tooth geometry - pitch, addendum, dedendum, outside and base circles - from module or diametral pitch with live drawing.',
    icon: '⚙️'
  },
  {
    path: '/harness-diameter-modeler/',
    name: 'Wiring Harness Bundle Diameter Modeler',
    category: 'Industrial & Engineering',
    desc: 'Model aerospace wiring harness bundle diameter and weight from AWG inputs. Packing density 1.2-1.25x, live canvas cross-section, per-meter conductor mass.',
    icon: '⚙️'
  },
  {
    path: '/heloc-estimator/',
    name: 'HELOC Calculator - Home Equity Line of Credit Estimator',
    category: 'Finance & Real Estate',
    desc: 'Calculate your HELOC borrowing limit and monthly payments. Estimate home equity line of credit amounts based on LTV and current mortgage balance.',
    icon: '💰'
  },
  {
    path: '/hex-rgba-converter/',
    name: 'HEX to RGBA Color Converter',
    category: 'Developer Utilities',
    desc: 'Parse HEX, RGB, RGBA, HSL, or named colors and convert to HEX, RGBA, and HSL instantly. Live swatch preview and WCAG contrast ratios. Free.',
    icon: '💻'
  },
  {
    path: '/home-affordability-calculator/',
    name: 'Home Affordability Calculator - How Much House Can You Afford?',
    category: 'Finance & Real Estate',
    desc: 'Calculate how much house you can afford based on income, debts, and DTI ratio. Free home affordability calculator with 28/36 rule analysis.',
    icon: '💰'
  },
  {
    path: '/hydraulic-pressure-drop/',
    name: 'Hydraulic Pressure Drop & Flow Calculator',
    category: 'Industrial & Engineering',
    desc: 'Model pressure loss through pipe with Reynolds number, Darcy-Weisbach friction factor, and fluid presets for water, oil, and glycol.',
    icon: '⚙️'
  },
  {
    path: '/injection-molding-estimator/',
    name: 'Injection Molding Cycle Time & Clamp Force',
    category: 'Industrial & Engineering',
    desc: 'Estimate injection molding clamp tonnage from projected area and cavity pressure, estimate cycle time from wall thickness, and part weight for nine common resins.',
    icon: '⚙️'
  },
  {
    path: '/lap-timer/',
    name: 'Chronometer Split Lap Timer',
    category: 'Health & Lifestyle',
    desc: 'A precision stopwatch and split lap timer using high-resolution timing, with best, worst, and average laps plus one-click CSV export. Works fully offline.',
    icon: '⏱️'
  },
  {
    path: '/macro-diet-planner/',
    name: 'Macro Nutrient Flexible Diet Planner',
    category: 'Health & Lifestyle',
    desc: 'Calculate TDEE with the Mifflin-St Jeor equation and split daily calories into flexible protein, fat, and carb targets with a meal-split table. Free, client-side.',
    icon: '🥗'
  },
  {
    path: '/markup-margin-tool/',
    name: 'Markup vs. Margin Tool & Calculator',
    category: 'Finance & Real Estate',
    desc: 'Convert markup and margin percentages instantly. Enter your product cost plus markup, margin, or sale price to see all four pricing metrics and profit.',
    icon: '💰'
  },
  {
    path: '/merchant-account-fee-matrix/',
    name: 'Merchant Account Fee Calculator - Interchange Plus vs Flat Rate',
    category: 'B2B Business',
    desc: 'Compare credit card processing fees between flat rate and interchange-plus pricing. Calculate monthly costs, annual savings, and effective rates for small business merchant accounts.',
    icon: '📊'
  },
  {
    path: '/moving-cost-calculator/',
    name: 'Moving Cost Calculator - Estimate Your Moving Expenses',
    category: 'Finance & Real Estate',
    desc: 'Calculate moving costs with our inventory volume and distance estimator. Plan your relocation budget with accurate moving expense estimates.',
    icon: '💰'
  },
  {
    path: '/openapi-tool-converter/',
    name: 'OpenAPI to Agent Tool Definition Converter',
    category: 'AI & Automation',
    desc: 'Convert OpenAPI 3.x JSON specs into OpenAI function definitions and Anthropic tool arrays. Handles GET/POST, path/query params, JSON body schemas. Free.',
    icon: '🤖'
  },
  {
    path: '/pcb-impedance-calculator/',
    name: 'PCB Microstrip Impedance Modeler',
    category: 'Industrial & Engineering',
    desc: 'Model FR4 PCB microstrip impedance: compute characteristic impedance, propagation delay, and capacitance per length from trace width and stackup geometry.',
    icon: '⚙️'
  },
  {
    path: '/playwright-script-generator/',
    name: 'Playwright & Puppeteer Script Generator',
    category: 'AI & Automation',
    desc: 'Visually build browser-automation flows (goto, click, type, assert, screenshot) and generate runnable Playwright or Puppeteer scripts in JS or Python. Free.',
    icon: '🤖'
  },
  {
    path: '/pomodoro-timer/',
    name: 'Free Online Pomodoro Timer with Daily Session History',
    category: 'Health & Lifestyle',
    desc: 'Free Pomodoro Timer: configurable focus and break intervals, auto-advancing sessions, and a local daily history tracker. No sign-up required.',
    icon: '🍅'
  },
  {
    path: '/pregnancy-due-date/',
    name: 'Pregnancy Due Date Predictor',
    category: 'Health & Lifestyle',
    desc: 'Predict your estimated due date with Naegele\'s rule from your last menstrual period or conception date, with gestational age, trimester, and milestone tracking.',
    icon: '🤰'
  },
  {
    path: '/prompt-chain-debugger/',
    name: 'Prompt Chain Debugger & Variable Injector',
    category: 'AI & Automation',
    desc: 'Debug multi-step prompt chains: inject {{variables}}, see interpolated output per step, spot unresolved placeholders, and map step-to-variable dependencies.',
    icon: '🤖'
  },
  {
    path: '/prompt-injection-guardrail/',
    name: 'Prompt Injection Guardrail Matrix',
    category: 'AI & Automation',
    desc: 'Scan prompts for injection patterns: instruction override, jailbreak, system-prompt leak, delimiter breaking and data exfiltration, with a 0-100 risk score.',
    icon: '🤖'
  },
  {
    path: '/property-tax-projector/',
    name: 'Property Tax Escalation Projector',
    category: 'Finance & Real Estate',
    desc: 'Project property tax increases over 20 years with compound growth. Estimate future tax bills and budget for homeownership costs.',
    icon: '💰'
  },
  {
    path: '/pump-selection-tdh/',
    name: 'Pump Selection & TDH Calculator',
    category: 'Industrial & Engineering',
    desc: 'Calculate total dynamic head and pump horsepower from static, friction, pressure, and velocity head with embedded fitting K-factor data.',
    icon: '⚙️'
  },
  {
    path: '/pydantic-schema-generator/',
    name: 'JSON-Schema Generator (Pydantic)',
    category: 'AI & Automation',
    desc: 'Build fields visually and generate both the Pydantic v2 model class and the equivalent JSON Schema draft-07 side by side, then validate sample JSON. Free.',
    icon: '🤖'
  },
  {
    path: '/rag-chunking-simulator/',
    name: 'RAG Vector Chunking Simulator',
    category: 'AI & Automation',
    desc: 'Simulate RAG text chunking: fixed-size, overlapping sliding window, or semantic paragraph chunking with char counts, total chunks and token estimates.',
    icon: '🤖'
  },
  {
    path: '/random-picker/',
    name: 'Free Random Number & Group Picker',
    category: 'Health & Lifestyle',
    desc: 'Generate random numbers with optional no-repeat and seeded PRNG, or split a name list into random balanced teams. Instant, client-side, free.',
    icon: '🎲'
  },
  {
    path: '/refinance-break-even/',
    name: 'Mortgage Refinance Break-Even Calculator',
    category: 'Finance & Real Estate',
    desc: 'Calculate your mortgage refinance break-even point. Compare closing costs vs monthly savings to determine if refinancing is worth it.',
    icon: '💰'
  },
  {
    path: '/rent-vs-buy-calculator/',
    name: 'Rent vs Buy Calculator 30-Year Comparison',
    category: 'Finance & Real Estate',
    desc: 'Compare renting vs buying a home over 30 years. Project net worth for both paths with appreciation, investment returns, and crossover analysis.',
    icon: '💰'
  },
  {
    path: '/rental-cash-flow-calculator/',
    name: 'Rental Property Cash Flow Calculator',
    category: 'Finance & Real Estate',
    desc: 'Calculate rental property cash flow, NOI, cap rate, and cash-on-cash return. Free landlord investment analysis tool.',
    icon: '💰'
  },
  {
    path: '/rental-yield-calculator/',
    name: 'Rental Yield & ROI Calculator',
    category: 'Finance & Real Estate',
    desc: 'Calculate rental yield, net yield, cash-on-cash return, and IRR for investment properties. Free real estate ROI analysis tool.',
    icon: '💰'
  },
  {
    path: '/retainer-profitability/',
    name: 'Retainer Profitability Calculator - Project Margin Analyzer',
    category: 'B2B Business',
    desc: 'Analyze retainer project profitability. Calculate gross profit margins, break-even hours, effective cost per hour, and annual returns for agency retainers.',
    icon: '📊'
  },
  {
    path: '/rigging-tension-solver/',
    name: 'Rigging & Bridle Sling Tension Calculator',
    category: 'Industrial & Engineering',
    desc: 'Solve per-leg tension in bridle slings from load weight, leg count, and sling angle, with angle derating and capacity checks.',
    icon: '⚙️'
  },
  {
    path: '/sheet-metal-unfolder/',
    name: 'Sheet Metal Bend Allowance Calculator',
    category: 'Industrial & Engineering',
    desc: 'Unfold sheet metal flat-pattern lengths from K-factor and bend allowance formulas. Supports multi-bend parts with per-bend breakdowns.',
    icon: '⚙️'
  },
  {
    path: '/sound-frequency-generator/',
    name: 'Sound Frequency Generator & Tone Tester',
    category: 'Health & Lifestyle',
    desc: 'Generate sine, square, sawtooth, or triangle tones from 20-20,000 Hz with volume control and tuning presets. Start on click, safe defaults.',
    icon: '🔊'
  },
  {
    path: '/student-loan-idr/',
    name: 'Student Loan IDR Engine & Payment Calculator',
    category: 'Finance & Real Estate',
    desc: 'Estimate SAVE, IBR, and PAYE income-driven repayment plan payments using federal poverty guidelines. See 20/25-year forgiveness and total cost.',
    icon: '💰'
  },
  {
    path: '/thermocouple-calculator/',
    name: 'Thermocouple Calculator: mV to °C & °C to mV',
    category: 'Industrial & Engineering',
    desc: 'Convert thermocouple millivolts to temperature and back for types J, K, and T using embedded NIST ITS-90 coefficients, plus Pt100 RTD.',
    icon: '🌡️'
  },
  {
    path: '/w2-vs-1099-comparator/',
    name: 'W2 vs 1099 Calculator - Compare Employee vs Contractor Pay',
    category: 'B2B Business',
    desc: 'Compare W2 employee take-home pay versus 1099 independent contractor earnings. Calculate taxes, benefits, and hourly rates side by side.',
    icon: '📊'
  }
];

// Initialize theme as early as possible to prevent flashing (Default strictly to Light Mode)
(function initTheme() {
  const isDark = localStorage.getItem('theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDark);
  document.documentElement.classList.toggle('light', !isDark);
})();

// Inject Google AdSense Script dynamically site-wide
(function injectAdSense() {
  const script = document.createElement('script');
  script.async = true;
  script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3901061173891576";
  script.crossOrigin = "anonymous";
  document.head.appendChild(script);
})();

document.addEventListener('DOMContentLoaded', () => {
  // Inject Header
  renderHeader();
  setupDesktopDropdowns();

  // Inject Footer
  renderFooter();

  // Inject Sidebar Scroller (vscroll)
  renderSidebarScroller();

  // Setup theme toggle buttons
  setupThemeToggler();

  // Hard-cap ad container sizes so the AdSense SDK cannot inflate them and
  // cause CLS. The SDK rewrites inline styles with `height/max-height:auto/none
  // !important`, which beats stylesheet rules, so a MutationObserver re-asserts
  // the caps (inline !important) after every SDK style write.
  (function enforceAdSizeCaps() {
    const caps = {
      'ad-slot-a': ['max-height:138px', 'overflow:hidden'],
      'ad-slot-square': ['max-height:250px', 'overflow:hidden'],
      'ad-slot-vertical': ['max-height:600px', 'overflow:hidden']
    };
    const apply = () => {
      for (const [id, decls] of Object.entries(caps)) {
        const el = document.getElementById(id);
        if (!el) continue;
        for (const d of decls) {
          const i = d.indexOf(':');
          const prop = d.slice(0, i);
          const val = d.slice(i + 1);
          if (getComputedStyle(el)[prop] !== val) {
            el.style.setProperty(prop, val, 'important');
          }
        }
      }
    };
    const observer = new MutationObserver(apply);
    observer.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
    apply();
  })();

  // Lazy-load below-fold ad units via IntersectionObserver.
  // The top banner (ad-slot-a) is pushed immediately; square/vertical units
  // wait until they approach the viewport to reduce main-thread contention.
  (function lazyLoadBelowFoldAds() {
    const PUSH_DELAY_MS = 150;
    const ROOT_MARGIN = '400px';
    const pushed = new Set();
    
    function pushUnit(ins) {
      if (pushed.has(ins)) return;

      if (ins.querySelector('iframe') || ins.hasAttribute('data-adsbygoogle-status') || ins.hasAttribute('data-google-query-id')) {
        pushed.add(ins);
        return;
      }

      pushed.add(ins);
      
      setTimeout(() => {
        try {
          window.adsbygoogle = window.adsbygoogle || [];
          
          const rawUnfilledAds = Array.from(document.querySelectorAll('ins.adsbygoogle'))
                                      .filter(el => !el.querySelector('iframe') && !el.hasAttribute('data-google-query-id'));

          if (rawUnfilledAds.length === 0) return;

          const validAds = rawUnfilledAds.filter(el => {
            const r = el.getBoundingClientRect();
            return r.width > 0;
          });

          if (validAds.length > 0) {
            window.adsbygoogle.push({});
          }
        } catch (e) {
          console.debug('AdSense placement deferred:', e.message);
        }
      }, PUSH_DELAY_MS);
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          pushUnit(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: ROOT_MARGIN });

    // We must wait for the DOM to be fully ready before counting tags, 
    // especially critical on instant reloads.
    function init() {
      document.querySelectorAll('ins.adsbygoogle').forEach((ins) => {
        const slotId = ins.closest('[id]')?.id || '';
        if (slotId === 'ad-slot-a') {
          pushUnit(ins);
          return;
        }
        observer.observe(ins);
      });
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
    } else {
      init();
    }
  })();


  // Inject Dynamic AdSense Placements (AD A)
  renderAdPlacements();

  // Re-apply size caps after dynamic ad insertion in case new containers were added
  setTimeout(() => {
    const caps = {
      'ad-slot-a': ['max-height:138px', 'overflow:hidden'],
      'ad-slot-square': ['max-height:250px', 'overflow:hidden'],
      'ad-slot-vertical': ['max-height:600px', 'overflow:hidden']
    };
    for (const [id, decls] of Object.entries(caps)) {
      const el = document.getElementById(id);
      if (!el) continue;
      for (const d of decls) {
        const i = d.indexOf(':');
        const prop = d.slice(0, i);
        const val = d.slice(i + 1);
        if (getComputedStyle(el)[prop] !== val) {
          el.style.setProperty(prop, val, 'important');
        }
      }
    }
  }, 500);
});

// Mobile Drawer Controls
window.openMobileDrawer = function() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!drawer || !overlay) return;
  
  drawer.classList.remove('translate-x-full');
  overlay.classList.remove('hidden');
  requestAnimationFrame(() => {
    overlay.classList.remove('opacity-0');
    overlay.classList.add('opacity-100');
  });
  
  document.body.style.overflow = 'hidden';
};

window.closeMobileDrawer = function() {
  const drawer = document.getElementById('mobile-nav-drawer');
  const overlay = document.getElementById('mobile-nav-overlay');
  if (!drawer || !overlay) return;
  
  drawer.classList.add('translate-x-full');
  overlay.classList.remove('opacity-100');
  overlay.classList.add('opacity-0');
  
  setTimeout(() => {
    overlay.classList.add('hidden');
  }, 300);
  
  document.body.style.overflow = '';
};

// Mobile Accordion Toggle (arrow button only; category link navigates to landing page)
window.toggleMobileCategory = function(btn) {
  const group = btn.closest('.mobile-category-group');
  const submenu = group.querySelector('.mobile-submenu');
  const chevron = btn.querySelector('.mobile-chevron');
  const isExpanded = !submenu.classList.contains('hidden');
  
  if (isExpanded) {
    submenu.classList.add('hidden');
    chevron.classList.remove('rotate-180');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    submenu.classList.remove('hidden');
    chevron.classList.add('rotate-180');
    btn.setAttribute('aria-expanded', 'true');
  }
};

// Mobile Search Filter with live highlighting and empty-state hiding
window.filterMobileNav = function(query) {
  const q = query.toLowerCase().trim();
  const groups = document.querySelectorAll('.mobile-category-group');
  const searchInput = document.getElementById('mobile-nav-search');
  
  groups.forEach(group => {
    const links = group.querySelectorAll('.mobile-nav-link');
    const categoryLink = group.querySelector('.mobile-category-link');
    let hasMatch = false;
    
    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      if (text.includes(q)) {
        link.classList.remove('hidden');
        hasMatch = true;
      } else {
        link.classList.add('hidden');
      }
    });
    
    if (hasMatch) {
      group.classList.remove('hidden');
      if (q) {
        const submenu = group.querySelector('.mobile-submenu');
        const chevron = group.querySelector('.mobile-chevron');
        submenu.classList.remove('hidden');
        chevron.classList.add('rotate-180');
        if (categoryLink) categoryLink.classList.add('hidden');
      } else {
        const submenu = group.querySelector('.mobile-submenu');
        const chevron = group.querySelector('.mobile-chevron');
        submenu.classList.add('hidden');
        chevron.classList.remove('rotate-180');
        if (categoryLink) categoryLink.classList.remove('hidden');
      }
    } else {
      group.classList.add('hidden');
    }
  });
};

/**
 * Render standard navigation header with desktop hover dropdowns and mobile right-side drawer
 */
function renderHeader() {
  const headerContainer = document.getElementById('global-header') || document.querySelector('header');
  if (!headerContainer) return;

  headerContainer.className = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm";

  // Determine relative paths dynamic prefix (depth-aware: articles sit one
  // level deeper than tool pages, so '../' alone would create broken links).
  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';
  const prefix = isHomepage ? './' : '../'.repeat(p.split('/').filter(Boolean).length);

  // Group utilities by category
  const categories = {};
  UTILITIES_REGISTRY.forEach(tool => {
    if (!categories[tool.category]) {
      categories[tool.category] = [];
    }
    categories[tool.category].push(tool);
  });

  const categoryNames = Object.keys(categories);

  headerContainer.innerHTML = `
    <nav aria-label="Main Navigation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="${prefix}" class="flex items-center space-x-2 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1" aria-label="TopWebTool Homepage">
          <svg class="w-8 h-8 transition-transform group-hover:scale-105 shrink-0" role="img" aria-label="TopWebTool Brand Logo" width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#brandGrad)"/><path d="M32 32h36v9h-12v31h-12V41H32z" fill="#ffffff"/><circle cx="70" cy="25" r="5.5" fill="#fbbf24"/></svg>
          <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-sky-300 bg-clip-text text-slate-900 dark:text-slate-100" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">TopWebTool</span>
        </a>

        <div class="flex items-center gap-2">
          <!-- Desktop Navigation (hidden on mobile) -->
          <div class="hidden md:flex items-center gap-1.5 flex-wrap justify-end">
            ${categoryNames.map((cat, idx) => {
              const shortName = cat.split('&')[0].trim();
              const tools = categories[cat];
              return `
                <div class="relative group nav-dropdown-group">
                  <button class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none">
                    <span>${shortName}</span>
                    <svg class="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div class="absolute left-0 md:left-auto md:right-0 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg dropdown-menu hidden z-[9999] p-2 space-y-1 max-h-[70vh] overflow-y-auto">
                    ${tools.map(tool => `
                      <a href="${prefix}${tool.path.replace(/^\//, '')}" class="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-colors">
                        <span class="text-sm shrink-0" aria-hidden="true">${tool.icon}</span>
                        <span class="truncate">${tool.name}</span>
                      </a>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Theme Toggle -->
          <button id="theme-toggle-btn" class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" aria-label="Toggle Light/Dark Theme">
            <!-- Moon Icon -->
            <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <!-- Sun Icon -->
            <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.05-1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm2.12-10.607a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </button>

          <!-- Mobile Hamburger (hidden on desktop) -->
          <button id="mobile-menu-btn" onclick="openMobileDrawer()" class="md:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" aria-label="Open Menu">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Drawer Overlay -->
    <div id="mobile-nav-overlay" class="fixed inset-0 bg-black/50 z-[9998] hidden opacity-0 transition-opacity duration-300" onclick="closeMobileDrawer()"></div>

    <!-- Mobile Right-Side Drawer -->
    <div id="mobile-nav-drawer" class="fixed right-0 top-0 h-full w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-[9999] transform translate-x-full transition-transform duration-300 flex flex-col">
      <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span class="font-extrabold text-lg text-slate-900 dark:text-slate-100">Menu</span>
        <button onclick="closeMobileDrawer()" class="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" aria-label="Close Menu">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="p-4 border-b border-slate-200 dark:border-slate-800">
        <input type="search" id="mobile-nav-search" placeholder="Search through all 83 pages..." oninput="filterMobileNav(this.value)" class="w-full px-3 py-2.5 text-sm border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
      </div>
      <div id="mobile-nav-categories" class="flex-1 overflow-y-auto">
        ${categoryNames.map(cat => {
          const tools = categories[cat];
          const slug = cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
          return `
            <div class="mobile-category-group border-b border-slate-100 dark:border-slate-800" data-category="${cat}">
              <div class="flex items-center">
                <a href="${prefix}#category-title-${slug}" class="mobile-category-link flex-1 px-4 py-3.5 min-h-[48px] flex items-center text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors truncate">
                  ${cat}
                </a>
                <button onclick="toggleMobileCategory(this)" class="p-3.5 min-h-[48px] flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle ${cat}" aria-expanded="false">
                  <svg class="w-4 h-4 transition-transform duration-200 mobile-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              <div class="mobile-submenu hidden">
                ${tools.map(tool => `
                  <a href="${prefix}${tool.path.replace(/^\//, '')}" class="mobile-nav-link flex items-center space-x-2.5 px-4 py-3.5 min-h-[48px] text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate">
                    <span class="text-sm shrink-0" aria-hidden="true">${tool.icon}</span>
                    <span class="truncate">${tool.name}</span>
                  </a>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

/**
 * Setup desktop dropdown hover with JS to prevent flicker when moving
 * between category button and dropdown menu.
 */
function setupDesktopDropdowns() {
  const groups = document.querySelectorAll('.nav-dropdown-group');
  groups.forEach(group => {
    const menu = group.querySelector('.dropdown-menu');
    if (!menu) return;

    group.addEventListener('mouseenter', () => {
      menu.classList.remove('hidden');
    });

    group.addEventListener('mouseleave', () => {
      menu.classList.add('hidden');
    });
  });
}

/**
 * Render standard navigation footer
*/
function renderFooter() {
  const footerContainer = document.getElementById('global-footer') || document.querySelector('footer');
  if (!footerContainer) return;

  footerContainer.className = "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-8";

  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';
  const prefix = isHomepage ? './' : '../'.repeat(p.split('/').filter(Boolean).length);

  const categories = {};
  UTILITIES_REGISTRY.forEach(tool => {
    if (!categories[tool.category]) categories[tool.category] = [];
    categories[tool.category].push(tool);
  });
  const categoryEntries = Object.entries(categories);

  // First 4 tools of each category keep the footer compact.
  const year = new Date().getFullYear();

  footerContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="twt-footer-main">
        <div class="twt-footer-brand">
          <a href="${prefix}" class="flex items-center space-x-2 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1 w-max" aria-label="TopWebTool Homepage">
            <svg class="w-8 h-8 shrink-0" role="img" aria-label="TopWebTool Brand Logo" width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="brandGradFooter" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#4f46e5"/><stop offset="100%" stop-color="#0ea5e9"/></linearGradient></defs><rect x="4" y="4" width="92" height="92" rx="22" fill="url(#brandGradFooter)"/><path d="M32 32h36v9h-12v31h-12V41H32z" fill="#ffffff"/><circle cx="70" cy="25" r="5.5" fill="#fbbf24"/></svg>
            <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-sky-300 bg-clip-text text-slate-900 dark:text-slate-100" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">TopWebTool</span>
          </a>
          <p class="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            ${UTILITIES_REGISTRY.length} free, premium, 100% client-side web utilities. No sign-up, no data leaving your browser, ever.
          </p>
          <a href="${prefix}" class="twt-footer-all text-indigo-600 dark:text-sky-400 hover:underline">Browse all ${UTILITIES_REGISTRY.length} tools &rarr;</a>
        </div>

        <nav class="twt-footer-cats" aria-label="Footer category links">
          ${categoryEntries.map(([cat, tools]) => `
            <details class="twt-footer-acc">
              <summary class="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">${cat}</summary>
              <ul>
                ${tools.slice(0, 3).map(tool => `
                  <li>
                    <a href="${prefix}${tool.path.replace(/^\//, '')}" class="text-sm text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">
                      ${tool.name}
                    </a>
                  </li>
                `).join('')}
              </ul>
            </details>
          `).join('')}
        </nav>
      </div>

      <div class="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 twt-footer-bottom">
        <p class="text-xs text-slate-400 dark:text-slate-500">
          &copy; ${year} TopWebTool. All rights reserved.
        </p>
        <div class="flex items-center space-x-5">
          <a href="${prefix}llms.txt" class="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">AI Index (llms.txt)</a>
          <a href="${prefix}robots.txt" class="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">robots.txt</a>
          <a href="${prefix}sitemap.xml" class="text-xs text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-sky-400 transition-colors">Sitemap</a>
        </div>
      </div>
    </div>
  `;
}

/**
 * Render the side vertically scrollable search/trending utilities sidebar (vscroll)
 * Shows all 23 tools in a beautiful 2-column wide layout for fast access.
 */
function renderSidebarScroller() {
  const sidebarContainer = document.getElementById('trending-sidebar');
  if (!sidebarContainer) return;

  // Add broad padding and explicit classes to support a wide, highly legible layout
  sidebarContainer.className = "bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col max-h-[700px] w-full";

  // Determine prefix for relative navigation (depth-aware)
  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';
  const prefix = isHomepage ? './' : '../'.repeat(p.split('/').filter(Boolean).length);

  // Build items HTML
  const currentPath = window.location.pathname.replace(/\/$/, '');

  sidebarContainer.innerHTML = `
    <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
      <svg class="w-5 h-5 text-indigo-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      <span>Trending Utilities (${UTILITIES_REGISTRY.length})</span>
    </h3>

    <!-- Instant Search within Sidebar Scroller -->
    <div class="mb-3 relative">
      <input type="search" id="sidebar-search" placeholder="Quick filter tools..." class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
      <span class="absolute left-2.5 top-2 text-slate-400">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </span>
    </div>

    <!-- Scrollable 2-Column Wide container -->
    <div id="sidebar-items-scroller" class="flex-grow overflow-y-auto pr-1 custom-vscroll-bar grid grid-cols-2 gap-1.5">
      ${UTILITIES_REGISTRY.map(tool => {
        const isActive = currentPath === tool.path.replace(/\/$/, '');
        return `
          <a href="${prefix}${tool.path.replace(/^\//, '')}" data-name="${tool.name.toLowerCase()}" data-category="${tool.category.toLowerCase()}" class="group flex items-center p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors border ${isActive ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20' : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200'} focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none" title="${tool.name} - ${tool.desc}">
            <div class="flex items-center space-x-1.5 min-w-0">
              <span class="text-base shrink-0" aria-hidden="true">${tool.icon}</span>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-sky-400 transition-colors truncate">${tool.name}</span>
                <span class="text-[8px] text-slate-400 dark:text-slate-500 truncate">${tool.category}</span>
              </div>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;

  // Filter functionality
  const searchInput = document.getElementById('sidebar-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const links = sidebarContainer.querySelectorAll('#sidebar-items-scroller > a');
      links.forEach(link => {
        const name = link.getAttribute('data-name');
        const cat = link.getAttribute('data-category');
        if (name.includes(q) || cat.includes(q)) {
          link.classList.remove('hidden');
        } else {
          link.classList.add('hidden');
        }
      });
    });
  }
}

/**
 * Setup Light/Dark Mode Toggle logic
 */
function setupThemeToggler() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const darkIcon = document.getElementById('theme-toggle-dark-icon');
  const lightIcon = document.getElementById('theme-toggle-light-icon');

  // Set initial icon visibility based on the current mode
  function updateIcons() {
    if (document.documentElement.classList.contains('dark')) {
      darkIcon.classList.add('hidden');
      lightIcon.classList.remove('hidden');
    } else {
      darkIcon.classList.remove('hidden');
      lightIcon.classList.add('hidden');
    }
  }

  updateIcons();

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', !isDark);
    document.documentElement.classList.toggle('light', isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
    updateIcons();

    // Fire a custom event to notify target sheets (like dark charts if they are present)
    window.dispatchEvent(new CustomEvent('themechanged'));
  });
}

/**
 * Render Google AdSense placements (Unit A, Unit B, Unit C) dynamically on pages.
 * Fully optimized for Light/Dark mode color contrast and frictionless UX.
 * All ad containers include explicit min-height and 25px safety margins to prevent CLS
 * and accidental misclicks on interactive controls.
 */
function renderAdPlacements() {
  const main = document.querySelector('main');
  if (!main) return;

  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';

  // Do not place ads on the noindex 404 page (AdSense policy)
  if (p === '/404.html' || p === '/404/') return;

  // ===== UNIT A: TOP HEADER BANNER (injected only when the page lacks one) =====
  let adA = document.getElementById('ad-slot-a');
  if (!adA) {
    adA = document.createElement('div');
    adA.id = 'ad-slot-a';
    adA.className = "ads-banner-top";
    adA.innerHTML = `
      <span class="ads-label">Advertisement</span>
      <div class="w-full flex justify-center" style="height:90px; max-height:90px; overflow:hidden;">
        <ins class="adsbygoogle"
             style="display:inline-block; width:100%; height:90px; max-height:90px;"
             data-ad-client="ca-pub-3901061173891576"
             data-ad-slot="2894630336"
             data-ad-format="horizontal"
             data-full-width-responsive="false"></ins>
      </div>
    `;

    if (isHomepage) {
      const hero = main.querySelector('.text-center.mb-8');
      if (hero) {
        hero.parentNode.insertBefore(adA, hero.nextSibling);
      } else {
        main.insertBefore(adA, main.firstChild);
      }
    } else {
      const firstChild = main.firstChild;
      if (firstChild) {
        main.insertBefore(adA, firstChild.nextSibling);
      } else {
        main.appendChild(adA);
      }
    }
  }

  try {
    // Activate every ad unit present on the page (tool/SEO pages ship inline
    // ins.adsbygoogle blocks that never received a push before).
    const units = document.querySelectorAll('ins.adsbygoogle');
    if (units.length) {
      (window.adsbygoogle = window.adsbygoogle || []);
      units.forEach(() => window.adsbygoogle.push({}));
    }
  } catch (e) {
    console.error("AdSense push error:", e);
  }
}

// Dynamic WebMCP Agent-Ready Layer for all 23 Utilities
document.addEventListener("DOMContentLoaded", () => {
  if (window.navigator?.modelContext?.registerTool) {
    const mainForm = document.querySelector("form");
    if (!mainForm) return;

    const toolName = mainForm.getAttribute("id") || window.location.pathname.split('/').filter(Boolean).pop() || "webUtility";
    const inputs = mainForm.querySelectorAll("input, select, textarea");
    
    const properties = {};
    const requiredFields = [];

    inputs.forEach(input => {
      if (input.id && input.type !== "submit" && input.type !== "button") {
        const labelText = document.querySelector('label[for="' + input.id + '"]')?.innerText || input.name || input.id;
        properties[input.id] = {
          type: input.type === "number" ? "number" : "string",
          description: input.getAttribute("urm-description") || 'Input field for ' + labelText
        };
        if (input.hasAttribute("required")) {
          requiredFields.push(input.id);
        }
      }
    });

    window.navigator.modelContext.registerTool({
      name: 'execute_' + toolName.replace(/[^a-zA-Z0-9]/g, '_'),
      description: 'Programmatically executes the client-side ' + toolName + ' utility on TopWebTool using structured parameters.',
      parameters: {
        type: "object",
        properties: properties,
        required: requiredFields
      },
      execute: async (args) => {
        try {
          Object.keys(args).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
              el.value = args[key];
              el.dispatchEvent(new Event('input', { bubbles: true }));
              el.dispatchEvent(new Event('change', { bubbles: true }));
            }
          });

          const calcBtn = mainForm.querySelector('button[type="submit"]') || document.getElementById("calculate-btn") || mainForm.querySelector('.btn-primary');
          if (calcBtn) {
            calcBtn.click();
          }

          await new Promise(resolve => setTimeout(resolve, 80));

          const outputElements = document.querySelectorAll('[id*="output"], [id*="result"], [class*="result-box"]');
          const resultsPayload = {};
          outputElements.forEach(el => {
            if (el.id) resultsPayload[el.id] = el.innerText || el.value;
          });

          return { status: "success", data: resultsPayload };
        } catch (err) {
          return { status: "error", message: err.toString() };
        }
      }
    });
    console.log('WebMCP tool dynamically bound for utility: ' + toolName);
  }
});
