(function () {
  'use strict';

  if (window.__twtContextLoaded) return;
  window.__twtContextLoaded = true;

  var STORAGE_KEYS = {
    favorites: 'user_favorites',
    history: 'tool_history',
    collapsed: 'rail_collapsed',
    lastOutput: 'last_output'
  };

  function esc(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

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

  function getPrefix() {
    var p = window.location.pathname.replace(/\/[^\/]*\.[^\/]*$/, '');
    if (p === '' || p === '/') return './';
    var depth = p.split('/').filter(Boolean).length;
    return '../'.repeat(depth);
  }

  function cleanPath(path) {
    return '/' + path.replace(/^\/|\/$/g, '').replace(/\/index\.html$/, '');
  }

  var STOP = new Set([
    'and','with','the','for','tool','calculator','to','of','in','on','a','an','is','it',
    'or','by','from','your','you','free','no','sign','up','required','use','our','all',
    'this','that','with','have','has','had','can','will','just','about'
  ]);

  function extractKeywords(tool) {
    var text = [tool.name, tool.category, tool.desc].join(' ').toLowerCase();
    return new Set(
      text.replace(/[^\w\s]/g, '').split(/\s+/).filter(function(w) { return w && !STOP.has(w); })
    );
  }

  function getActiveTool(registry) {
    var current = window.location.pathname.replace(/\/index\.html$/, '').replace(/\/+$/, '');
    var matched = null;
    for (var i = 0; i < registry.length; i++) {
      var tool = registry[i];
      var tp = cleanPath(tool.path);
      if (current === tp) {
        return tool;
      }
      if (!matched && current.indexOf(tp + '/') === 0) {
        matched = tool;
      }
    }
    return matched;
  }

  function resolveRelated(registry, active) {
    if (!active) return registry.slice(0, 3);
    var activeKws = extractKeywords(active);
    var scored = [];
    for (var i = 0; i < registry.length; i++) {
      var tool = registry[i];
      if (tool === active || tool.path === active.path) continue;
      var score = 0;
      if (tool.category === active.category) score += 5;
      var kws = extractKeywords(tool);
      activeKws.forEach(function(kw) {
        if (kws.has(kw)) score += 2;
      });
      scored.push({ tool: tool, score: score });
    }
    scored.sort(function(a, b) { return b.score - a.score; });
    return scored.slice(0, 3).map(function(s) { return s.tool; });
  }

  function safeGetStorage(key, parse) {
    try {
      var raw = localStorage.getItem(key);
      return parse ? JSON.parse(raw) : raw;
    } catch (e) {
      return parse ? [] : null;
    }
  }

  function safeSetStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function updateToolHistory(registry) {
    var active = getActiveTool(registry);
    if (!active) return;
    var history = safeGetStorage(STORAGE_KEYS.history, true) || [];
    var path = cleanPath(active.path);
    var idx = history.indexOf(path);
    if (idx !== -1) history.splice(idx, 1);
    history.unshift(path);
    if (history.length > 4) history = history.slice(0, 4);
    safeSetStorage(STORAGE_KEYS.history, history);
  }

  function isFavorited(path) {
    var favs = safeGetStorage(STORAGE_KEYS.favorites, true) || [];
    return favs.indexOf(path) !== -1;
  }

  function toggleFavorite(path) {
    var favs = safeGetStorage(STORAGE_KEYS.favorites, true) || [];
    var idx = favs.indexOf(path);
    if (idx === -1) favs.push(path);
    else favs.splice(idx, 1);
    safeSetStorage(STORAGE_KEYS.favorites, favs);
    return idx === -1;
  }

  function getHistoryItems(registry) {
    var history = safeGetStorage(STORAGE_KEYS.history, true) || [];
    var map = {};
    registry.forEach(function(t) { map[cleanPath(t.path)] = t; });
    return history.filter(function(p) { return map[p]; }).map(function(p) { return map[p]; });
  }

  function getLastOutput() {
    try {
      return sessionStorage.getItem(STORAGE_KEYS.lastOutput);
    } catch (e) {
      return null;
    }
  }

  function clearLastOutput() {
    try {
      sessionStorage.removeItem(STORAGE_KEYS.lastOutput);
    } catch (e) {}
  }

  function buildQuickActions(rail, registry, active) {
    var prefix = getPrefix();
    var mod = document.createElement('div');
    mod.className = 'twt-rail-module';

    var title = document.createElement('div');
    title.className = 'twt-rail-module__title';
    title.textContent = 'Quick Actions';
    mod.appendChild(title);

    var wrap = document.createElement('div');
    wrap.className = 'twt-rail-quick';

    if (active) {
      var path = cleanPath(active.path);
      var favBtn = document.createElement('button');
      favBtn.className = 'twt-rail-quick__btn';
      favBtn.innerHTML = '<span class="twt-rail-quick__icon">' + (isFavorited(path) ? '★' : '☆') + '</span> ' + (isFavorited(path) ? 'Pinned' : 'Pin Tool');
      favBtn.addEventListener('click', function() {
        var added = toggleFavorite(path);
        favBtn.innerHTML = '<span class="twt-rail-quick__icon">' + (added ? '★' : '☆') + '</span> ' + (added ? 'Pinned' : 'Pin Tool');
        favBtn.classList.toggle('is-active', added);
      });
      wrap.appendChild(favBtn);
    }

    var lastOutput = getLastOutput();
    if (lastOutput) {
      var copyBtn = document.createElement('button');
      copyBtn.className = 'twt-rail-copy';
      copyBtn.textContent = 'Copy Last Result';
      copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(lastOutput).then(function() {
          copyBtn.textContent = 'Copied!';
          clearLastOutput();
          setTimeout(function() { copyBtn.remove(); }, 1200);
        }).catch(function() {
          copyBtn.textContent = 'Copy failed';
        });
      });
      wrap.appendChild(copyBtn);
    }

    mod.appendChild(wrap);
    rail.appendChild(mod);
  }

  function buildHistory(rail, registry) {
    var prefix = getPrefix();
    var items = getHistoryItems(registry);
    if (items.length === 0) return;

    var mod = document.createElement('div');
    mod.className = 'twt-rail-module';

    var title = document.createElement('div');
    title.className = 'twt-rail-module__title';
    title.textContent = 'Recently Used';
    mod.appendChild(title);

    var list = document.createElement('ul');
    list.className = 'twt-rail-history';
    items.forEach(function(tool) {
      var li = document.createElement('li');
      li.className = 'twt-rail-history__item';
      var a = document.createElement('a');
      a.href = prefix + tool.path.replace(/^\//, '');
      a.textContent = tool.name;
      li.appendChild(a);
      list.appendChild(li);
    });
    mod.appendChild(list);
    rail.appendChild(mod);
  }

  function buildRelated(rail, registry, active) {
    var prefix = getPrefix();
    var related = resolveRelated(registry, active);
    if (related.length === 0) return;

    var mod = document.createElement('div');
    mod.className = 'twt-rail-module';

    var title = document.createElement('div');
    title.className = 'twt-rail-module__title';
    title.textContent = 'Related Tools';
    mod.appendChild(title);

    var list = document.createElement('div');
    list.className = 'twt-rail-related';
    related.forEach(function(tool) {
      var a = document.createElement('a');
      a.className = 'twt-rail-related__item';
      a.href = prefix + tool.path.replace(/^\//, '');
      a.innerHTML = '<span class="twt-rail-related__icon">' + esc(tool.icon) + '</span>' +
        '<span class="twt-rail-related__name">' + esc(tool.name) + '</span>' +
        '<span class="twt-rail-related__cat">' + esc(tool.category) + '</span>';
      list.appendChild(a);
    });
    mod.appendChild(list);
    rail.appendChild(mod);
  }

  function buildToggle(rail) {
    var btn = document.createElement('button');
    btn.className = 'twt-rail-toggle';
    btn.setAttribute('aria-label', 'Toggle right rail');
    btn.textContent = '>';
    btn.addEventListener('click', function() {
      var collapsed = document.documentElement.classList.toggle('twt-shell--rail-collapsed');
      try {
        localStorage.setItem(STORAGE_KEYS.collapsed, collapsed ? 'true' : 'false');
      } catch (e) {}
      btn.textContent = collapsed ? '<' : '>';
    });
    rail.insertBefore(btn, rail.firstChild);
  }

  function applyCollapsedState() {
    try {
      if (localStorage.getItem(STORAGE_KEYS.collapsed) === 'true') {
        document.documentElement.classList.add('twt-shell--rail-collapsed');
      }
    } catch (e) {}
  }

  function init() {
    var rail = document.getElementById('right-rail');
    if (!rail) return;

    applyCollapsedState();
    var registry = getRegistry();
    var active = getActiveTool(registry);
    updateToolHistory(registry);
    buildToggle(rail);
    buildQuickActions(rail, registry, active);
    buildHistory(rail, registry);
    buildRelated(rail, registry, active);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
