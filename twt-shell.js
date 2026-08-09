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
        link.setAttribute('data-category', (tool.category || '').toLowerCase());
        group.appendChild(link);
      });

      body.appendChild(group);
    });

    // Accordion groups: all collapsed by default; one category opens at a
    // time. Keeps the nav a compact stack of titles instead of a 5000px
    // scroll area. (The active tool's group is not auto-opened — the rail's
    // contextual "Related Utilities" already surfaces same-category tools.)
    var groups = body.querySelectorAll('.twt-nav__group');

    body.addEventListener('click', function (e) {
      var title = e.target.closest ? e.target.closest('.twt-nav__title') : null;
      if (!title || !title.parentNode) return;
      var isOpen = title.parentNode.classList.contains('is-open');
      groups.forEach(function (group) {
        group.classList.toggle('is-open', false);
      });
      title.parentNode.classList.toggle('is-open', !isOpen);
    });

    nav.appendChild(body);

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

    // Retire the full-registry "Trending Utilities" clone — it duplicates the
    // left nav (same 84 tools, same search box) on every page. Hidden in
    // place; the rail shows a compact contextual panel instead. Uses
    // style.display because global.js's renderSidebarScroller overwrites the
    // element's className after this runs.
    var trending = document.getElementById('trending-sidebar');
    if (trending) trending.style.display = 'none';

    var linksBox = el('div', 'twt-rail__links', '');

    // Pick tools from the current tool's category; articles inherit the
    // category of their parent tool. Falls back to a generic list.
    var current = window.location.pathname.replace(/\/+$/, '');
    var self = null;
    var cat = null;
    registry.forEach(function (tool) {
      var tp = '/' + tool.path.replace(/^\/|\/$/g, '');
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

    var article = document.querySelector('.twt-shell__workspace article');

    if (article) {
      // Article pages: drop the square mid-content (after the second
      // paragraph) so the top of the page keeps just the single leaderboard.
      var paras = article.querySelectorAll('p');
      if (paras.length >= 2) {
        var ref = paras[1];
        ref.parentNode.insertBefore(square, ref.nextSibling);
      } else {
        article.appendChild(square);
      }
      square.classList.add('twt-ad--inline', 'twt-mid-inline');
      return;
    }

    var target =
      document.getElementById('seo-instructional-hub') ||
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

    // 1b. Apply long-form typography to SEO article bodies.
    var prose = main.querySelector('article');
    if (prose) prose.classList.add('twt-prose');

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
