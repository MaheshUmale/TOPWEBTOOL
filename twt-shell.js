/**
 * ============================================================
 * TopWebTool Modular Shell Engine (twt-shell.js) - FIXED & UPDATED
 * The "global boilerplate wrapper" — a zero-collision, additive
 * layer that ingests any existing tool or article page and
 * re-arranges it into the premium 3-column execution engine:
 *
 *   Desktop : Left Nav Sidebar | Center Workspace + SEO | Right Ad Rail
 *   Tablet  : Center Workspace + Utility Links (dual split-pane)
 *   Mobile  : Single-column dashboard (everything stacks)
 * ============================================================
 */
(function () {
  'use strict';

  if (window.__twtShellLoaded) return;
  window.__twtShellLoaded = true;

  var TWT = (window.TWTShell = window.TWTShell || {});
  TWT.version = '2.1.0';

  /** Read the shared tool registry emitted by global.js if present. */
  function getRegistry() {
    try {
      if (typeof window.UTILITIES_REGISTRY !== 'undefined' && Array.isArray(window.UTILITIES_REGISTRY)) {
        return window.UTILITIES_REGISTRY;
      }
    } catch (e) {}
    try {
      if (typeof UTILITIES_REGISTRY !== 'undefined' && Array.isArray(UTILITIES_REGISTRY)) {
        return UTILITIES_REGISTRY;
      }
    } catch (e) {}
    return [];
  }

  /**
   * Depth-aware relative path prefix.
   * FIX: Strips filename (e.g. index.html) before calculating directory depth
   * so links don't overshoot root with extra `../`.
   */
  function getPrefix() {
    var p = window.location.pathname.replace(/\/[^\/]*\.[^\/]*$/, ''); // Strip filename
    if (p === '' || p === '/') return './';
    var depth = p.split('/').filter(Boolean).length;
    return '../'.repeat(depth);
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html) node.innerHTML = html;
    return node;
  }

  /** Escape user/tool-provided strings when writing HTML. */
  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /** Build the Left Navigation Sidebar (desktop-only via CSS). */
  function buildNav(registry, prefix, current) {
    var nav = el('nav', 'twt-shell__nav', '');
    nav.setAttribute('aria-label', 'All tools navigation');

    var search = el('input', 'twt-nav__search', '');
    search.type = 'search';
    search.id = 'twt-sidebar-filter';       // <-- ADD THIS LINE
    search.name = 'filter_q';                // <-- ADD THIS LINE
    search.placeholder = 'Filter tools...';
    search.setAttribute('aria-label', 'Filter tools');
    

    var body = el('div', 'twt-nav', '');
    body.appendChild(search);

    var byCategory = {};
    registry.forEach(function (tool) {
      var cat = tool.category || 'Tools';
      if (!byCategory[cat]) byCategory[cat] = [];
      byCategory[cat].push(tool);
    });

    // Clean current path for exact matching
    var cleanCurrent = current.replace(/\/(index\.html)?$/, '').replace(/\/$/, '');

    Object.keys(byCategory).forEach(function (cat) {
      var group = el('div', 'twt-nav__group', '');
      var title = el('div', 'twt-nav__title', '');
      var count = byCategory[cat].length;
      title.innerHTML = esc(cat) + '<span>' + count + '</span>';
      group.appendChild(title);

      var containsActive = false;

      byCategory[cat].forEach(function (tool) {
        var href = prefix + tool.path.replace(/^\//, '');
        var cleanToolPath = '/' + tool.path.replace(/^\/|\/$/g, '').replace(/\/index\.html$/, '');
        var cls = 'twt-nav__link';

        if (cleanCurrent && cleanToolPath === cleanCurrent) {
          cls += ' is-active';
          containsActive = true;
        }

        var link = el('a', cls, '');
        link.href = href;
        link.textContent = tool.name;
        link.setAttribute('data-name', (tool.name || '').toLowerCase());
        link.setAttribute('data-category', (tool.category || '').toLowerCase());
        group.appendChild(link);
      });

      // Auto-open group if active tool is inside it
      if (containsActive) {
        group.classList.add('is-open');
      }

      body.appendChild(group);
    });

    /**
     * FIX: Accordion event handler properly queries dynamic groups
     * and toggles open state cleanly.
     */
    body.addEventListener('click', function (e) {
      var title = e.target.closest ? e.target.closest('.twt-nav__title') : null;
      if (!title || !title.parentNode) return;

      var targetGroup = title.parentNode;
      var wasOpen = targetGroup.classList.contains('is-open');

      var allGroups = body.querySelectorAll('.twt-nav__group');
      allGroups.forEach(function (g) {
        g.classList.remove('is-open');
      });

      if (!wasOpen) {
        targetGroup.classList.add('is-open');
      }
    });

    nav.appendChild(body);

    // Search Filter
    search.addEventListener('input', function () {
      var q = search.value.toLowerCase().trim();
      body.classList.toggle('is-searching', q !== '');
      body.querySelectorAll('.twt-nav__group').forEach(function (group) {
        var visible = 0;
        group.querySelectorAll('.twt-nav__link').forEach(function (link) {
          var hit =
            !q ||
            (link.getAttribute('data-name') || '').indexOf(q) !== -1 ||
            (link.getAttribute('data-category') || '').indexOf(q) !== -1;
          link.classList.toggle('twt-hidden', !hit);
          if (hit) visible++;
        });
        group.classList.toggle('twt-hidden', q !== '' && visible === 0);
      });
    });

    return nav;
  }

  /** Build the Right Rail: contextual utility links + reserved 300x600 ad. */
  function buildRail(registry, prefix) {
    var rail = el('aside', 'twt-shell__rail', '');
    rail.setAttribute('aria-label', 'Related tools and advertisements');

    var trending = document.getElementById('trending-sidebar');
    if (trending) trending.style.display = 'none';

    var linksBox = el('div', 'twt-rail__links', '');

    var current = window.location.pathname.replace(/\/(index\.html)?$/, '').replace(/\/+$/, '');
    var self = null;
    var cat = null;

    registry.forEach(function (tool) {
      var tp = '/' + tool.path.replace(/^\/|\/$/g, '').replace(/\/index\.html$/, '');
      if (tp === current) {
        self = tool;
        cat = tool.category;
      } else if (!cat && current.indexOf(tp + '/') === 0) {
        cat = tool.category;
      }
    });

    var picks = cat
      ? registry.filter(function (t) { return t !== self && t.category === cat; })
      : registry.slice(0, 12);
    if (picks.length === 0) picks = registry.slice(0, 12);

    var title = el('div', 'twt-rail__links-title', cat ? 'Related Utilities' : 'Popular Utilities');
    linksBox.appendChild(title);

    picks.slice(0, 12).forEach(function (tool) {
      var a = el('a', 'twt-rail__link', '');
      a.href = prefix + tool.path.replace(/^\//, '');
      a.textContent = tool.name;
      linksBox.appendChild(a);
    });
    rail.appendChild(linksBox);

    return rail;
  }

  /**
   * Neutralize legacy layout grids.
   * FIX: Flexible detection for various grid patterns (Tailwind lg:grid-cols-*, etc.)
   */
  function neutralizeLegacyGrid(main) {
    var gridCandidates = main.querySelectorAll('div[class*="grid"]');
    gridCandidates.forEach(function (child) {
      var cls = child.className || '';
      if (cls.indexOf('lg:grid-cols-') !== -1 || cls.indexOf('md:grid-cols-') !== -1) {
        child.classList.remove('grid', 'grid-cols-1', 'lg:grid-cols-4', 'lg:grid-cols-3', 'gap-4', 'gap-6');

        var col = child.firstElementChild;
        while (col) {
          var next = col.nextElementSibling;
          var c = col.className || '';
          if (c.indexOf('lg:col-span-1') !== -1 || c.indexOf('sidebar') !== -1) {
            col.classList.add('twt-hidden');
          } else if (c.indexOf('lg:col-span-3') !== -1 || c.indexOf('lg:col-span-2') !== -1) {
            col.className = col.className.replace(/lg:col-span-\d+/g, '');
            col.style.width = '100%';
            col.style.maxWidth = '100%';
          }
          col = next;
        }
      }
    });
  }

  /**
   * Main shell initialization process.
   */
  function buildShell() {
    var main = document.querySelector('main');
    if (!main) return;

    if (document.querySelector('.twt-shell__frame')) return;

    var registry = getRegistry();
    var prefix = getPrefix();
    var current = window.location.pathname;

    var frame = el('div', 'twt-shell__frame', '');
    var nav = buildNav(registry, prefix, current);

    // 1. Classify main as workspace
    main.classList.add('twt-shell__workspace');

    // 2. Add prose typography to articles
    var prose = main.querySelector('article');
    if (prose) prose.classList.add('twt-prose');

    // 3. Neutralize legacy grids
    neutralizeLegacyGrid(main);

    // 5. Build right rail
    var rail = buildRail(registry, prefix);

    // 6. Wrap content inside shell frame
    var parent = main.parentNode;
    var anchor = main;
    parent.insertBefore(frame, anchor);
    frame.appendChild(nav);
    frame.appendChild(main);
    frame.appendChild(rail);

    // 7. Standardize Chrome header/footer
    var header = document.getElementById('global-header');
    if (header) header.classList.add('twt-shell__header');
    var footer = document.getElementById('global-footer');
    if (footer) footer.classList.add('twt-shell__footer');

    // 8. Add class flag to body
    document.body.classList.add('twt-shell');
  }

  function init() {
    try {
      buildShell();
    } catch (err) {
      if (window.console && console.warn) {
        console.warn('[TWT Shell] graceful fallback:', err);
      }
    }
  }

  // Handle execution timing safely
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();