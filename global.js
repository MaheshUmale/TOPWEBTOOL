/**
 * TopWebTool Global Core Engine
 * Manages uniform themes, headers, footers, and the 21-tool vertical scroller sidebar.
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

// Initialize theme as early as possible to prevent flashing
(function initTheme() {
  const storedTheme = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (storedTheme === 'dark' || (!storedTheme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
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
});

/**
 * Render standard navigation header
 */
function renderHeader() {
  const headerContainer = document.getElementById('global-header') || document.querySelector('header');
  if (!headerContainer) return;

  headerContainer.className = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200";

  headerContainer.innerHTML = `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center space-x-2 group">
        <img src="/logo.svg" alt="TopWebTool Logo" class="w-8 h-8 text-brand-600 transition-transform group-hover:scale-105" />
        <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-brand-700 to-brand-500 bg-clip-text text-transparent">TopWebTool</span>
      </a>

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
        <span class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest hidden sm:inline-block">100% Free & No Sign-up</span>
      </div>
    </div>
  `;
}

/**
 * Render standard navigation footer
 */
function renderFooter() {
  const footerContainer = document.getElementById('global-footer') || document.querySelector('footer');
  if (!footerContainer) return;

  footerContainer.className = "bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-8 py-4 transition-colors duration-200";

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
 * Shows all 21 tools in a beautiful container with an instant search.
 */
function renderSidebarScroller() {
  const sidebarContainer = document.getElementById('trending-sidebar');
  if (!sidebarContainer) return;

  sidebarContainer.className = "bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col max-h-[500px] md:max-h-[600px] transition-colors duration-200";

  // Build items HTML
  const currentPath = window.location.pathname.replace(/\/$/, '');

  sidebarContainer.innerHTML = `
    <h3 class="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
      <svg class="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
      </svg>
      <span>Trending Utilities (${UTILITIES_REGISTRY.length})</span>
    </h3>

    <!-- Instant Search within Sidebar Scroller -->
    <div class="mb-3 relative">
      <input type="text" id="sidebar-search" placeholder="Quick filter tools..." class="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none" />
      <span class="absolute left-2.5 top-2 text-slate-400">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </span>
    </div>

    <!-- Scrollable container -->
    <div id="sidebar-items-scroller" class="flex-grow overflow-y-auto space-y-2 pr-1 custom-vscroll-bar">
      ${UTILITIES_REGISTRY.map(tool => {
        const isActive = currentPath === tool.path;
        return `
          <a href="${tool.path}" data-name="${tool.name.toLowerCase()}" data-category="${tool.category.toLowerCase()}" class="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors border ${isActive ? 'border-brand-500 bg-brand-50/50 dark:bg-brand-900/20' : 'border-transparent hover:border-slate-100 dark:hover:border-slate-800'}">
            <div class="flex items-center space-x-2.5 min-w-0">
              <span class="text-lg shrink-0">${tool.icon}</span>
              <div class="flex flex-col min-w-0">
                <span class="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors truncate">${tool.name}</span>
                <span class="text-[9px] text-slate-400 dark:text-slate-500 truncate">${tool.category}</span>
              </div>
            </div>
            <svg class="w-3 h-3 text-slate-300 group-hover:text-brand-600 dark:group-hover:text-brand-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
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
