import re

with open('global.js', 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

# Remove old toggleCategoryDropdown and click-outside handler (lines 674-723)
old_dropdown_code = '''// Unified interactive Dropdown Toggle for Single Component DOM Navigation
window.toggleCategoryDropdown = function(btn) {
  const dropdown = btn.nextElementSibling;
  const isExpanded = btn.getAttribute('aria-expanded') === 'true';
  
  // Scroll the button into view on mobile before toggling
  if (window.innerWidth < 768) {
    btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
  
  // Close all other dropdowns
  document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
    if (menu !== dropdown) {
      menu.classList.add('hidden');
      menu.classList.remove('block');
      const otherBtn = menu.previousElementSibling;
      if (otherBtn) {
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.classList.remove('bg-slate-200', 'dark:bg-slate-700');
      }
    }
  });

  if (isExpanded) {
    dropdown.classList.add('hidden');
    dropdown.classList.remove('block');
    btn.setAttribute('aria-expanded', 'false');
    btn.classList.remove('bg-slate-200', 'dark:bg-slate-700');
  } else {
    dropdown.classList.remove('hidden');
    dropdown.classList.add('block');
    btn.setAttribute('aria-expanded', 'true');
    btn.classList.add('bg-slate-200', 'dark:bg-slate-700');
  }
};

// Close unified dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown-group')) {
    document.querySelectorAll('.nav-dropdown-menu').forEach(menu => {
      menu.classList.add('hidden');
      menu.classList.remove('block');
      const btn = menu.previousElementSibling;
      if (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('bg-slate-200', 'dark:bg-slate-700');
      }
    });
  }
});'''

new_dropdown_code = '''// Mobile Drawer Controls
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

// Mobile Accordion Toggle
window.toggleMobileCategory = function(btn) {
  const group = btn.closest('.mobile-category-group');
  const submenu = group.querySelector('.mobile-submenu');
  const chevron = btn.querySelector('.mobile-chevron');
  const isExpanded = !submenu.classList.contains('hidden');
  
  if (isExpanded) {
    submenu.classList.add('hidden');
    chevron.classList.remove('rotate-180');
  } else {
    submenu.classList.remove('hidden');
    chevron.classList.add('rotate-180');
  }
};

// Mobile Search Filter
window.filterMobileNav = function(query) {
  const q = query.toLowerCase().trim();
  const groups = document.querySelectorAll('.mobile-category-group');
  
  groups.forEach(group => {
    const links = group.querySelectorAll('.mobile-nav-link');
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
      } else {
        const submenu = group.querySelector('.mobile-submenu');
        const chevron = group.querySelector('.mobile-chevron');
        submenu.classList.add('hidden');
        chevron.classList.remove('rotate-180');
      }
    } else {
      group.classList.add('hidden');
    }
  });
};'''

content = content.replace(old_dropdown_code, new_dropdown_code)

# Now replace renderHeader function
old_render_header = '''/**
 * Render standard navigation header with dynamic categories dropdown menu
 */
function renderHeader() {
  const headerContainer = document.getElementById('global-header') || document.querySelector('header');
  if (!headerContainer) return;

  headerContainer.className = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm";

  // Determine relative paths dynamic prefix
  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';
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
    <nav aria-label="Main Navigation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="${prefix}" class="flex items-center space-x-2 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1" aria-label="TopWebTool Homepage">
          <svg class="w-8 h-8 transition-transform group-hover:scale-105 shrink-0" role="img" aria-label="TopWebTool Brand Logo" width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#brandGrad)"/><path d="M30 40 L50 20 L70 40 L70 75 L30 75 Z" fill="#ffffff"/><path d="M50 20 L50 75" stroke="#e2e8f0" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#f59e0b"/></svg>
          <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-sky-300 bg-clip-text text-slate-900 dark:text-slate-100" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">TopWebTool</span>
        </a>

        <!-- Single Component Responsive DOM Navigation Bar (Zero Duplication between mobile/desktop) -->
        <div class="flex items-center gap-1.5 justify-start md:justify-end w-full md:w-auto overflow-x-auto pb-1">
          ${categoryNames.map((cat, idx) => {
            const shortName = cat.split('&')[0].trim();
            const tools = categories[cat];
            return `
              <div class="relative nav-dropdown-group">
                <button onclick="toggleCategoryDropdown(this)" class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none" aria-haspopup="true" aria-expanded="false" aria-controls="dropdown-menu-${idx}">
                  <span>${shortName}</span>
                  <svg class="w-3.5 h-3.5 opacity-60 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                <div id="dropdown-menu-${idx}" class="nav-dropdown-menu absolute left-0 md:left-auto md:right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg hidden z-[9999] p-2 space-y-1 max-h-[70vh] overflow-y-auto">
                  ${tools.map(tool => `
                    <a href="${prefix}${tool.path.replace(/^\\//, '')}" class="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-colors">
                      <span class="text-sm shrink-0" aria-hidden="true">${tool.icon}</span>
                      <span class="truncate">${tool.name}</span>
                    </a>
                  `).join('')}
                </div>
              </div>
            `;
          }).join('')}

          <div class="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" aria-hidden="true"></div>

          <!-- Theme Toggle & Status Info -->
          <div class="flex items-center space-x-2">
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
            <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden lg:inline-block">100% Free & No Sign-up</span>
          </div>
        </div>
      </div>
    </nav>
  `;
}'''

new_render_header = '''/**
 * Render standard navigation header with desktop hover dropdowns and mobile right-side drawer
 */
function renderHeader() {
  const headerContainer = document.getElementById('global-header') || document.querySelector('header');
  if (!headerContainer) return;

  headerContainer.className = "bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm";

  // Determine relative paths dynamic prefix
  const p = window.location.pathname;
  const isHomepage = p === '/' || p === '/index.html' || p === '';
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
    <nav aria-label="Main Navigation" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-4 md:h-16 flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="${prefix}" class="flex items-center space-x-2 group focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none rounded-lg p-1" aria-label="TopWebTool Homepage">
          <svg class="w-8 h-8 transition-transform group-hover:scale-105 shrink-0" role="img" aria-label="TopWebTool Brand Logo" width="32" height="32" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><linearGradient id="brandGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#0369a1"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><circle cx="50" cy="50" r="46" fill="url(#brandGrad)"/><path d="M30 40 L50 20 L70 40 L70 75 L30 75 Z" fill="#ffffff"/><path d="M50 20 L50 75" stroke="#e2e8f0" stroke-width="2"/><circle cx="50" cy="50" r="10" fill="#f59e0b"/></svg>
          <span class="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-sky-300 bg-clip-text text-slate-900 dark:text-slate-100" style="-webkit-background-clip: text; -webkit-text-fill-color: transparent;">TopWebTool</span>
        </a>

        <div class="flex items-center gap-2">
          <!-- Desktop Navigation (hidden on mobile) -->
          <div class="hidden md:flex items-center gap-1.5">
            ${categoryNames.map((cat, idx) => {
              const shortName = cat.split('&')[0].trim();
              const tools = categories[cat];
              return `
                <div class="relative group nav-dropdown-group">
                  <button class="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none">
                    <span>${shortName}</span>
                    <svg class="w-3.5 h-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </button>
                  <div class="absolute left-0 md:left-auto md:right-0 mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg hidden group-hover:block z-[9999] p-2 space-y-1 max-h-[70vh] overflow-y-auto">
                    ${tools.map(tool => `
                      <a href="${prefix}${tool.path.replace(/^\\//, '')}" class="flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none transition-colors">
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
                <a href="./#category-title-${slug}" class="flex-1 px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                  ${cat}
                </a>
                <button onclick="toggleMobileCategory(this)" class="p-3 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Toggle ${cat}">
                  <svg class="w-4 h-4 transition-transform duration-200 mobile-chevron" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
              <div class="mobile-submenu hidden">
                ${tools.map(tool => `
                  <a href="${prefix}${tool.path.replace(/^\\//, '')}" class="mobile-nav-link flex items-center space-x-2.5 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
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
}'''

content = content.replace(old_render_header, new_render_header)

with open('global.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated global.js')

# Verify the replacements
with open('global.js', 'r', encoding='utf-8', errors='ignore') as f:
    new_content = f.read()

print('Contains openMobileDrawer:', 'openMobileDrawer' in new_content)
print('Contains closeMobileDrawer:', 'closeMobileDrawer' in new_content)
print('Contains toggleMobileCategory:', 'toggleMobileCategory' in new_content)
print('Contains filterMobileNav:', 'filterMobileNav' in new_content)
print('Contains translate-x-full:', 'translate-x-full' in new_content)
print('Contains mobile-nav-drawer:', 'mobile-nav-drawer' in new_content)
print('Contains group-hover:block:', 'group-hover:block' in new_content)
print('Contains mobile-category-group:', 'mobile-category-group' in new_content)
