/**
 * TopWebTool Global Core Engine
 * Manages uniform themes, headers, footers, and the 23-tool vertical scroller sidebar.
 */

const UTILITIES_REGISTRY = [
  {
    path: '/mortgage-calculator',
    name: 'Mortgage Calculator',
    category: 'Finance & Real Estate',
    desc: 'Compute monthly house payments, taxes, and PMI with dynamic amortization schedule breakdowns.',
    icon: '🏡'
  },
  {
    path: '/car-lease-estimator',
    name: 'Car Lease Estimator',
    category: 'Finance & Real Estate',
    desc: 'Calculate monthly auto lease payments based on MSRP, residual value, money factor, and down payment.',
    icon: '🚗'
  },
  {
    path: '/inflation-calculator',
    name: 'Inflation Calculator',
    category: 'Finance & Real Estate',
    desc: 'Track and compare historical buying power changes using US CPI & Eurostat inflation metrics.',
    icon: '📈'
  },
  {
    path: '/crypto-tax-estimator',
    name: 'Crypto Tax Estimator',
    category: 'Finance & Real Estate',
    desc: 'Estimate short-term and long-term capital gains tax brackets for crypto sales instantly.',
    icon: '🪙'
  },
  {
    path: '/hourly-to-salary-converter',
    name: 'Hourly to Salary Converter',
    category: 'Finance & Real Estate',
    desc: 'Convert hourly wages to annual gross and net income based on standard US/EU tax baselines.',
    icon: '💼'
  },
  {
    path: '/dividend-reinvestment-calculator',
    name: 'Dividend Reinvestment (DRIP)',
    category: 'Finance & Real Estate',
    desc: 'Project compounding stock growth assuming recurring dividend reinvestment schedules.',
    icon: '📊'
  },
  {
    path: '/credit-card-payoff-planner',
    name: 'Credit Card Payoff Planner',
    category: 'Finance & Real Estate',
    desc: 'Compare Snowball and Avalanche debt payoff tracks to clear outstanding credit card balances.',
    icon: '💳'
  },
  {
    path: '/utm-generator',
    name: 'UTM Campaign Link Builder',
    category: 'Digital Marketing',
    desc: 'Generate error-free UTM tracking URLs with dynamic copy-to-clipboard functionality.',
    icon: '🔗'
  },
  {
    path: '/roi-calculator',
    name: 'ROI & ROAS Calculator',
    category: 'Digital Marketing',
    desc: 'Calculate campaign Return on Investment and Return on Ad Spend dynamically.',
    icon: '💰'
  },
  {
    path: '/cpm-calculator',
    name: 'CPM Campaign Ad Calculator',
    category: 'Digital Marketing',
    desc: 'Compute campaign cost, target CPM, or required impressions instantly.',
    icon: '📢'
  },
  {
    path: '/headline-analyzer',
    name: 'Copy Headline Analyzer',
    category: 'Digital Marketing',
    desc: 'Score headlines based on emotional word weight, readability, and character length.',
    icon: '✍️'
  },
  {
    path: '/qr-code-generator',
    name: 'Secure QR Code Generator',
    category: 'Digital Marketing',
    desc: 'Generate downloadable customized high-quality client-side QR codes instantly.',
    icon: '📱'
  },
  {
    path: '/social-media-image-resizer',
    name: 'Social Image Resizer',
    category: 'Digital Marketing',
    desc: 'Crop and scale assets client-side for Instagram, LinkedIn, YouTube, and X.',
    icon: '🖼️'
  },
  {
    path: '/chatgpt-prompt-optimizer',
    name: 'ChatGPT Prompt Optimizer',
    category: 'AI Prompt Engineering',
    desc: 'Inject personas, variables, and formatting constraints into basic raw prompt strings.',
    icon: '🤖'
  },
  {
    path: '/midjourney-command-builder',
    name: 'Midjourney Prompt Builder',
    category: 'AI Prompt Engineering',
    desc: 'Select parameters, version toggles, and aspect ratios to construct precise Midjourney commands.',
    icon: '🎨'
  },
  {
    path: '/ai-text-humanizer-helper',
    name: 'AI Text Humanizer Helper',
    category: 'AI Prompt Engineering',
    desc: 'Detect robotic structures and optimize copy flow to humanize AI-generated text output.',
    icon: '🧠'
  },
  {
    path: '/json-formatter-validator',
    name: 'JSON Formatter & Validator',
    category: 'Developer Utilities',
    desc: 'Beautify, compress, validate, and parse raw JSON strings securely offline.',
    icon: '⚙️'
  },
  {
    path: '/password-generator',
    name: 'Secure Password Generator',
    category: 'Developer Utilities',
    desc: 'Create highly secure, randomized passwords locally with robust length and character toggles.',
    icon: '🔑'
  },
  {
    path: '/lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'Developer Utilities',
    desc: 'Generate customizable design placeholder paragraphs, words, or lists instantly.',
    icon: '📝'
  },
  {
    path: '/base64-encoder-decoder',
    name: 'Base64 Encoder & Decoder',
    category: 'Developer Utilities',
    desc: 'Convert strings and image assets to base64 format and vice-versa fully locally.',
    icon: '🔣'
  },
  {
    path: '/word-character-counter',
    name: 'Word & Character Counter',
    category: 'Developer Utilities',
    desc: 'Analyze content length, reading time, speaking duration, and sentence statistics.',
    icon: '🔢'
  },
  {
    path: '/fortune-wheel',
    name: 'Fortune Wheel',
    category: 'Everyday & Niche Utilities',
    desc: 'Interactive customized canvas fortune-wheel spinner to make fast decisions.',
    icon: '☸️'
  },
  {
    path: '/word-unscrambler',
    name: 'Word Unscrambler Solver',
    category: 'Everyday & Niche Utilities',
    desc: 'Instantly turn scrambled letters into valid words with wildcard search options.',
    icon: '🔡'
  }
];

// Initialize theme as early as possible to prevent flashing (Default strictly to Light Mode)
(function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
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

  // Inject Footer
  renderFooter();

  // Inject Sidebar Scroller (vscroll)
  renderSidebarScroller();

  // Setup theme toggle buttons
  setupThemeToggler();

  // Inject Dynamic AdSense Placements (AD A, AD B, AD C)
  renderAdPlacements();
});

// Mobile navigation category toggle helper
window.toggleMobileNavCategory = function(categoryName, btn) {
  const panel = document.getElementById('mobile-submenu-panel');
  const itemsContainer = document.getElementById('mobile-submenu-items');
  if (!panel || !itemsContainer) return;

  const isAlreadyActive = btn.classList.contains('bg-blue-600') || btn.classList.contains('dark:bg-blue-600');

  // Reset all mobile category buttons style
  document.querySelectorAll('.mobile-cat-btn').forEach(b => {
    b.className = "mobile-cat-btn flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors shrink-0";
  });

  if (isAlreadyActive) {
    panel.classList.add('hidden');
  } else {
    // Activate clicked button
    btn.className = "mobile-cat-btn flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-blue-600 dark:bg-blue-600 text-white transition-colors shrink-0";

    // Filter registry for tools in this category
    const tools = UTILITIES_REGISTRY.filter(t => t.category === categoryName);

    // Determine relative paths prefix
    const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';
    const prefix = isHomepage ? './' : '../';

    itemsContainer.innerHTML = tools.map(tool => `
      <a href="${prefix}${tool.path.replace(/^\//, '')}" class="flex items-center space-x-2 px-2.5 py-2 text-xs font-bold rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors">
        <span class="text-sm shrink-0">${tool.icon}</span>
        <span class="truncate">${tool.name}</span>
      </a>
    `).join('');

    panel.classList.remove('hidden');
  }
};

// Close mobile submenu when clicking outside the entire header main navigation
document.addEventListener('click', (e) => {
  if (!e.target.closest('#global-header') && !e.target.closest('header')) {
    const panel = document.getElementById('mobile-submenu-panel');
    if (panel) {
      panel.classList.add('hidden');
    }
    document.querySelectorAll('.mobile-cat-btn').forEach(b => {
      b.className = "mobile-cat-btn flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors shrink-0";
    });
  }
});

/**
 * Render standard navigation header with dynamic categories dropdown menu
 */
function renderHeader() {
  const headerContainer = document.getElementById('global-header') || document.querySelector('header');
  if (!headerContainer) return;

  headerContainer.className = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm";

  // Determine relative paths dynamic prefix
  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';
  const prefix = isHomepage ? './' : '../';

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
    <nav aria-label="Main navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-16 flex items-center justify-between">
        <a href="${prefix}" class="flex items-center space-x-2 group">
          <img src="${prefix}logo.svg" alt="TopWebTool Logo" class="w-8 h-8 text-brand-600 transition-transform group-hover:scale-105" width="32" height="32" />
          <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-700 to-sky-500 dark:from-blue-400 dark:to-sky-300 bg-clip-text text-slate-900 dark:text-slate-100" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">TopWebTool</span>
        </a>

        <!-- Desktop Grouped Dropdown Navigation -->
        <nav class="hidden lg:flex items-center space-x-2">
          ${categoryNames.map(cat => {
            const shortName = cat.split('&')[0].trim();
            const tools = categories[cat];
            return `
              <div class="relative group">
                <button class="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-sky-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <span>${shortName}</span>
                  <svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div class="absolute left-0 mt-1 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 p-2 space-y-1">
                  ${tools.map(tool => `
                    <a href="${prefix}${tool.path.replace(/^\//, '')}" class="flex items-center space-x-2.5 px-3 py-2 text-xs font-bold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-sky-400 transition-colors">
                      <span class="text-base shrink-0">${tool.icon}</span>
                      <span class="truncate">${tool.name}</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}
        </nav>

        <div class="flex items-center space-x-4">
          <!-- Unified Theme Toggle Button -->
          <button id="theme-toggle-btn" class="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all" title="Toggle Light/Dark Theme">
            <!-- Moon Icon -->
            <svg id="theme-toggle-dark-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
            </svg>
            <!-- Sun Icon -->
            <svg id="theme-toggle-light-icon" class="hidden w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-5.05-1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zm2.12-10.607a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM4 11a1 1 0 100-2H3a1 1 0 100 2h1z" fill-rule="evenodd" clip-rule="evenodd"></path>
            </svg>
          </button>
          <span class="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-widest hidden sm:inline-block">100% Free & No Sign-up</span>
        </div>
      </div>

      <!-- Mobile Horizontally Scrollable Categories Menu -->
      <div class="lg:hidden flex items-center space-x-2 overflow-x-auto pb-2.5 pt-0.5 border-t border-slate-100 dark:border-slate-800/80 scrollbar-none px-4">
        ${categoryNames.map(cat => {
          const shortName = cat.split('&')[0].trim();
          return `
            <button onclick="toggleMobileNavCategory('${cat}', this)" class="mobile-cat-btn flex items-center space-x-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 transition-colors shrink-0">
              <span>${shortName}</span>
              <svg class="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Mobile Submenu Panel (Non-clipping, full width drop-down container) -->
      <div id="mobile-submenu-panel" class="lg:hidden hidden border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 px-4 py-3 shadow-inner">
        <div id="mobile-submenu-items" class="grid grid-cols-2 gap-2"></div>
      </div>
    </div>
    </nav>
  `;
}

/**
 * Render standard navigation footer
*/
function renderFooter() {
  const footerContainer = document.getElementById('global-footer') || document.querySelector('footer');
  if (!footerContainer) return;

  footerContainer.className = "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-8 py-4";

  footerContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-slate-400 text-sm">
      <div class="flex items-center space-x-2">
        <span class="font-extrabold text-slate-700 dark:text-slate-300">TopWebTool</span>
        <span>&copy; 2025. All rights reserved.</span>
      </div>
      <div class="mt-4 md:mt-0 flex space-x-6 items-center">
        <span class="text-xs text-slate-400 dark:text-slate-500">Premium High-CPM Single-Page Utilities Directory</span>
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

  // Determine prefix for relative navigation
  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';
  const prefix = isHomepage ? './' : '../';

  // Build items HTML
  const currentPath = window.location.pathname.replace(/\/$/, '');

  sidebarContainer.innerHTML = `
    <h3 class="text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
      <svg class="w-5 h-5 text-blue-600 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      <span>Trending Utilities (${UTILITIES_REGISTRY.length})</span>
    </h3>

    <!-- Instant Search within Sidebar Scroller -->
    <div class="mb-3 relative">
      <input type="search" id="sidebar-search" placeholder="Quick filter tools..." class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
      <span class="absolute left-2.5 top-2 text-slate-400">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </span>
    </div>

    <!-- Scrollable 2-Column Wide container -->
    <div id="sidebar-items-scroller" class="flex-grow overflow-y-auto pr-1 custom-vscroll-bar grid grid-cols-2 gap-1.5">
      ${UTILITIES_REGISTRY.map(tool => {
        const isActive = currentPath === tool.path || currentPath + '/index.html' === tool.path;
        return `
          <a href="${prefix}${tool.path.replace(/^\//, '')}" data-name="${tool.name.toLowerCase()}" data-category="${tool.category.toLowerCase()}" class="group flex items-center p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors border ${isActive ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-slate-100 dark:border-slate-800/80 hover:border-slate-200'}" title="${tool.name} - ${tool.desc}">
            <div class="flex items-center space-x-1.5 min-w-0">
              <span class="text-base shrink-0">${tool.icon}</span>
              <div class="flex flex-col min-w-0">
                <span class="text-[10px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors truncate">${tool.name}</span>
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
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    updateIcons();

    // Fire a custom event to notify target sheets (like dark charts if they are present)
    window.dispatchEvent(new CustomEvent('themechanged'));
  });
}

/**
 * Render Google AdSense placements (AD A, AD B, AD C) dynamically on pages.
 * Fully optimized for Light/Dark mode color contrast and frictionless UX.
 */
function renderAdPlacements() {
  const main = document.querySelector('main');
  if (!main) return;

  const isHomepage = window.location.pathname === '/' || window.location.pathname.endsWith('/index.html') || window.location.pathname === '';

  // 1. AD A: TOP LEADERBOARD BANNER (Horizontal Ads) - Height Restricted for Frictionless UX
  const adA = document.createElement('div');
  adA.className = "w-full mx-auto mb-6 p-3 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center select-none overflow-hidden min-h-[90px]";
  adA.style.maxWidth = "728px";
  adA.style.maxHeight = "135px";

  adA.innerHTML = `
    <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">Advertisement</span>
    <div class="w-full flex justify-center" style="height:90px; max-height:90px; overflow:hidden;">
      <!-- HzAds -->
      <ins class="adsbygoogle"
           style="display:inline-block; width:100%; height:90px; max-height:90px;"
           data-ad-client="ca-pub-3901061173891576"
           data-ad-slot="2894630336"
           data-ad-format="horizontal"
           data-full-width-responsive="false"></ins>
    </div>
  `;

  if (isHomepage) {
    // On homepage, insert after the hero/search section
    const hero = main.querySelector('.text-center.mb-8');
    if (hero) {
      hero.parentNode.insertBefore(adA, hero.nextSibling);
    } else {
      main.insertBefore(adA, main.firstChild);
    }
  } else {
    // On tool pages, insert as the very first child of main
    main.insertBefore(adA, main.firstChild);
  }

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error("AdSense push error (AD A):", e);
  }

  // 2. AD B: SIDEBAR AD PLACEMENTS
  const sidebar = document.getElementById('trending-sidebar');
  if (sidebar) {
    // A. SQUARE AD (SquareAds)
    const squareAd = document.createElement('div');
    squareAd.className = "w-full p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center mt-4 select-none min-h-[250px] overflow-hidden";
    squareAd.style.minHeight = "250px";
    squareAd.innerHTML = `
      <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Sponsored</span>
      <div class="w-full flex justify-center min-h-[250px]">
        <!-- SquareAds -->
        <ins class="adsbygoogle"
             style="display:block; width:100%; min-height:250px;"
             data-ad-client="ca-pub-3901061173891576"
             data-ad-slot="6707430996"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;
    sidebar.parentNode.insertBefore(squareAd, sidebar.nextSibling);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error (AD B Square):", e);
    }

    // B. VERTICAL AD (verticalAds) - Display on desktop only to avoid mobile clutter (UX-first!)
    const verticalAd = document.createElement('div');
    verticalAd.className = "w-full p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center mt-4 hidden lg:flex select-none min-h-[600px] overflow-hidden";
    verticalAd.style.minHeight = "600px";
    verticalAd.innerHTML = `
      <span class="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2">Advertisement</span>
      <div class="w-full flex justify-center min-h-[600px]">
        <!-- verticalAds -->
        <ins class="adsbygoogle"
             style="display:block; width:100%; min-height:600px;"
             data-ad-client="ca-pub-3901061173891576"
             data-ad-slot="1581548667"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `;
    squareAd.parentNode.insertBefore(verticalAd, squareAd.nextSibling);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense push error (AD B Vertical):", e);
    }
  }

  // 3. AD C: STICKY BOTTOM VIEWPORT ANCHOR (Horizontal Ads) - Height Restricted for Frictionless UX
  const stickyFooter = document.createElement('div');
  stickyFooter.id = "sticky-footer-ad";
  stickyFooter.className = "fixed bottom-0 left-0 w-full z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200/80 dark:border-slate-800 shadow-lg flex flex-col items-center justify-center py-2 select-none overflow-hidden min-h-[50px]";
  stickyFooter.style.maxHeight = "95px";

  stickyFooter.innerHTML = `
    <!-- Close Button -->
    <button onclick="closeStickyFooter()" class="absolute -top-3.5 right-4 w-7 h-7 bg-white dark:bg-slate-800 border border-slate-200/85 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full shadow-md flex items-center justify-center text-slate-500 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors cursor-pointer" title="Dismiss advertisement">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <span class="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sponsored Link</span>
    <div class="w-full max-w-[320px] sm:max-w-[728px] px-4 flex justify-center" style="height:50px; max-height:50px; overflow:hidden;">
      <!-- HzAds in Sticky Footer -->
      <ins class="adsbygoogle"
           style="display:inline-block; width:100%; height:50px; max-height:50px;"
           data-ad-client="ca-pub-3901061173891576"
           data-ad-slot="2894630336"
           data-ad-format="horizontal"
           data-full-width-responsive="false"></ins>
    </div>
  `;

  document.body.appendChild(stickyFooter);

  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch (e) {
    console.error("AdSense push error (AD C):", e);
  }
}

// Global dismiss action for the sticky footer
window.closeStickyFooter = function() {
  const el = document.getElementById('sticky-footer-ad');
  if (el) {
    el.style.display = 'none';
  }
};
