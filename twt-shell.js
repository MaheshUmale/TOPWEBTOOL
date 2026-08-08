/**
 * ============================================================
 * TopWebTool Modular Shell Engine (twt-shell.js)
 * The "global boilerplate wrapper" — a zero-collision, additive
 * layer that ingests any existing tool or article page and
 * re-arranges it into the premium 3-column execution engine:
 *
 *   Desktop : Left Nav Sidebar | Center Workspace + SEO | Right Ad Rail
 *   Tablet  : Center Workspace + Utility Links (dual split-pane)
 *   Mobile  : Single-column dashboard (everything stacks)
 *
 * Safety contract (DO NOT BREAK):
 *   - Runs after `global.js` (defer order), so header/footer/sidebar
 *     and AdSense slots already exist.
 *   - Never modifies tool widgets, IDs, or inline logic.
 *   - Every mutation is guarded by try/catch — if anything fails,
 *     the page silently falls back to its legacy layout.
 *   - Class names are all `twt-*` / `twt-shell__*` prefixed, so there
 *     is zero collision with the 84 tools' Tailwind utilities.
 *
 * Opt-in: pages include the framework CSS + this script. The engine
 * auto-detects the standard TopWebTool skeleton (`<main>` + optional
 * `#trending-sidebar`, `#ad-slot-*`) and rebuilds the wrapper around it.
 * ============================================================
 */
(function () {
  'use strict';

  if (window.__twtShellLoaded) return;
  window.__twtShellLoaded = true;

  var TWT = (window.TWTShell = window.TWTShell || {});
  TWT.version = '2.0.0';

  /** Read the shared tool registry emitted by global.js if present. */
  function getRegistry() {
    try {
      if (typeof window.UTILITIES_REGISTRY !== 'undefined') {
        return window.UTILITIES_REGISTRY;
      }
    } catch (e) {}
    try {
      if (typeof UTILITIES_REGISTRY !== 'undefined') {
        return UTILITIES_REGISTRY;
      }
    } catch (e) {}
    return [];
  }

  /** Depth-aware relative path prefix (root is 0, tools 1, articles 2). */
  function getPrefix() {
    var p = window.location.pathname;
    if (p === '/' || p === '/index.html' || p === '') return './';
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
    return String(s)
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

    Object.keys(byCategory).forEach(function (cat) {
      var group = el('div', 'twt-nav__group', '');
      var title = el('div', 'twt-nav__title', '');
      var count = byCategory[cat].length;
      title.innerHTML = esc(cat) + '<span>' + count + '</span>';
      group.appendChild(title);

      byCategory[cat].forEach(function (tool) {
        var href = prefix + tool.path.replace(/^\//, '');
        var cls = 'twt-nav__link';
        if (current && tool.path.replace(/\/$/, '') === current.replace(/\/$/, '')) {
          cls += ' is-active';
        }
        var link = el('a', cls, '');
        link.href = href;
        link.textContent = tool.name;
        link.setAttribute('data-name', tool.name.toLowerCase());
        group.appendChild(link);
      });

      body.appendChild(group);
    });

    nav.appendChild(body);

    search.addEventListener('input', function () {
      var q = search.value.toLowerCase().trim();
      var links = body.querySelectorAll('.twt-nav__link');
      links.forEach(function (link) {
        var hit = !q || (link.getAttribute('data-name') || '').indexOf(q) !== -1;
        link.classList.toggle('twt-hidden', !hit);
      });
    });

    return nav;
  }

  /** Build the Right Rail: utility panel + reserved 300x600 ad boundary. */
  function buildRail(registry, prefix) {
    var rail = el('aside', 'twt-shell__rail', '');
    rail.setAttribute('aria-label', 'Related tools and advertisements');

    // The searchable "Trending Utilities" panel (already rendered by
    // global.js) becomes the rail's utility list — search stays intact.
    var trending = document.getElementById('trending-sidebar');
    if (trending) {
      rail.appendChild(trending);
      trending.classList.add('twt-rail__panel');
    }

    // Fallback: static compact links when the page has no trending panel.
    if (!trending) {
      var linksBox = el('div', 'twt-rail__links', '');
      var title = el('div', 'twt-rail__links-title', 'Popular Utilities');
      linksBox.appendChild(title);
      registry.slice(0, 12).forEach(function (tool) {
        var a = el('a', 'twt-rail__link', '');
        a.href = prefix + tool.path.replace(/^\//, '');
        a.textContent = tool.name;
        linksBox.appendChild(a);
      });
      rail.appendChild(linksBox);
    }

    // The 300x600 skyscraper is supplied by the existing `#ad-slot-vertical`
    // unit (CLS-safe, zero duplicate slots). If the page lacks one, reserve a
    // fresh boundary so the rail always renders at the exact 300x600 box.
    var legacyVertical = document.getElementById('ad-slot-vertical');
    if (legacyVertical) {
      rail.appendChild(legacyVertical);
      legacyVertical.classList.add('twt-ad--rail');
    } else {
      var ad = el('div', 'twt-ad twt-ad--rail', '');
      ad.innerHTML =
        '<span class="twt-ad__label">Advertisement</span>' +
        '<div class="twt-ad__slot">' +
        '<ins class="adsbygoogle" style="display:inline-block;width:300px;height:600px;"' +
        ' data-ad-client="ca-pub-3901061173891576" data-ad-slot="1581548667"' +
        ' data-ad-format="rectangle" data-full-width-responsive="true"></ins></div>';
      rail.appendChild(ad);
    }

    return rail;
  }

  /**
   * Repurpose the legacy square ad (250px) as the mid-inline unit inside
   * the center workspace, between the tool widget and the SEO content.
   */
  function placeMidInline() {
    var square = document.getElementById('ad-slot-square');
    if (!square) return;

    var target =
      document.getElementById('seo-instructional-hub') ||
      document.querySelector('.twt-shell__workspace article') ||
      document.querySelector('.twt-shell__workspace .twt-seo-content');

    if (target) {
      target.parentNode.insertBefore(square, target);
    }
    square.classList.add('twt-ad--inline', 'twt-mid-inline');
  }

  /**
   * Neutralize the legacy page grid so the workspace is a single
   * full-width column once the sidebar column has been emptied.
   * Only the top-level wrapper grid of `main` is touched.
   */
  function neutralizeLegacyGrid(main) {
    var grid = null;
    var children = main.children;
    for (var i = 0; i < children.length; i++) {
      var child = children[i];
      var cls = child.className || '';
      if (cls.indexOf('grid-cols-1') !== -1 && cls.indexOf('lg:grid-cols-4') !== -1) {
        grid = child;
        break;
      }
    }
    if (!grid) return;

    grid.classList.remove('grid', 'grid-cols-1', 'lg:grid-cols-4', 'gap-4');

    var col = grid.firstElementChild;
    while (col) {
      var next = col.nextElementSibling;
      var c = col.className || '';
      if (c.indexOf('lg:col-span-1') !== -1) {
        col.classList.add('twt-hidden');
      } else if (c.indexOf('lg:col-span-3') !== -1) {
        col.classList.remove('lg:col-span-3');
        col.style.width = '100%';
        col.style.maxWidth = '100%';
      }
      col = next;
    }
  }

  /**
   * Re-parent an existing element into a target (guarded).
   * Returns true on success.
   */
  function moveNode(node, target, position) {
    try {
      if (!node || !target) return false;
      if (position === 'end') target.appendChild(node);
      else target.insertBefore(node, position);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Build the shell wrapper around the current page.
   *
   * Strategy (no tool logic is touched):
   *   1. Grab existing `main`, `#trending-sidebar` and `#ad-slot-*`.
   *   2. Create `.twt-shell__frame` grid: nav | workspace | rail.
   *   3. `main` becomes `.twt-shell__workspace`.
   *   4. The trending sidebar panel + vertical ad move into the rail;
   *      the legacy square ad becomes the mid-inline unit.
   */
  function buildShell() {
    var main = document.querySelector('main');
    if (!main) return;

    var registry = getRegistry();
    var prefix = getPrefix();
    var current = window.location.pathname;

    var frame = el('div', 'twt-shell__frame', '');
    var nav = buildNav(registry, prefix, current);

    // 1. Classify main as the center workspace.
    main.classList.add('twt-shell__workspace');

    // 2. Place the square ad mid-inline, between tool and SEO content.
    placeMidInline();

    // 3. Neutralize the legacy page grid now that its sidebar is emptying.
    neutralizeLegacyGrid(main);

    // 4. Only replace the layout IF the page is not already wrapped.
    if (document.querySelector('.twt-shell__frame')) return;

    var rail = buildRail(registry, prefix);

    // 5. Insert frame before `main` and move `main` inside as workspace.
    var parent = main.parentNode;
    var anchor = main;
    parent.insertBefore(frame, anchor);
    frame.appendChild(nav);
    frame.appendChild(main);
    frame.appendChild(rail);

    // 6. Promote header/footer into the shell chrome.
    var header = document.getElementById('global-header');
    if (header) header.classList.add('twt-shell__header');
    var footer = document.getElementById('global-footer');
    if (footer) footer.classList.add('twt-shell__footer');

    // 7. Flag the shell on <body> for CSS hooks + theme parity.
    document.body.classList.add('twt-shell');

    // 8. AdSense activation for dynamically injected units is handled by
    //    global.js; nothing extra is pushed here (avoids double-push).
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
