/**
 * Fix tool page layout:
 * 1) Remove duplicate Informative Articles between main-col close and sidebar
 * 2) Ensure articles/SEO/silo live inside lg:col-span-3
 * 3) Convert articles grids from awkward 2-col to single-column stack
 * 4) Widen main shell via class swap (global.css handles width)
 */
const fs = require('fs');
const path = require('path');

const TOOLS = [
  'crypto-tax-estimator',
  'mortgage-calculator',
  'dso-tracker',
  'agent-hitl-planner'
];

function fixHtml(html) {
  let changed = false;

  // 1) Articles grid: 2-col -> single column stack (class-based for CSS control)
  const artGridOld = 'grid grid-cols-1 md:grid-cols-2 gap-4';
  const artGridNew = 'articles-guides-grid';
  if (html.includes(artGridOld)) {
    // Only replace within Informative Articles sections by doing global replace
    // of the specific pattern that appears in article blocks
    html = html.split(artGridOld).join(artGridNew);
    changed = true;
  }

  // 2) Widen main container class for CSS hook
  if (html.includes('main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow"')) {
    html = html.replace(
      'main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow"',
      'main class="tool-page-main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-grow"'
    );
    changed = true;
  }

  // 3) Remove orphan duplicate articles between premature content and sidebar
  // Pattern: after <!-- Informative Articles End --> (or main-ish close), a second
  // <!-- Informative Articles & Guides Section --> appears before lg:col-span-1
  const sidebarMarker = '<div class="lg:col-span-1';
  const sideIdx = html.indexOf(sidebarMarker);
  if (sideIdx === -1) return { html, changed };

  const beforeSide = html.slice(0, sideIdx);
  const articleStarts = [];
  let searchFrom = 0;
  const artStartMark = '<!-- Informative Articles & Guides Section -->';
  while (true) {
    const i = beforeSide.indexOf(artStartMark, searchFrom);
    if (i === -1) break;
    articleStarts.push(i);
    searchFrom = i + 1;
  }

  if (articleStarts.length >= 2) {
    // Keep the first articles block; remove the last one before sidebar
    const dupStart = articleStarts[articleStarts.length - 1];
    const endMark = '<!-- Informative Articles End -->';
    const dupEndRel = beforeSide.indexOf(endMark, dupStart);
    if (dupEndRel !== -1) {
      const dupEnd = dupEndRel + endMark.length;
      // Also eat following whitespace
      let cutEnd = dupEnd;
      while (cutEnd < sideIdx && /\s/.test(html[cutEnd])) cutEnd++;
      html = html.slice(0, dupStart) + html.slice(cutEnd);
      changed = true;
    }
  }

  // Recompute after possible deletion
  const sideIdx2 = html.indexOf(sidebarMarker);
  const mainOpen = html.indexOf('<div class="lg:col-span-3');
  if (mainOpen === -1 || sideIdx2 === -1) return { html, changed };

  // Find if articles/SEO sit outside main column (between a close of main and sidebar)
  // Strategy: locate first articles OR seo OR silo that appears after the LAST
  // balanced close of the main column that happens before sidebar — if any
  // content of those types is between mainOpen's matching close and sidebar,
  // move it inside.

  // Find matching close for main column using depth counting from mainOpen
  function findMatchingClose(src, openIdx) {
    let depth = 0;
    let i = openIdx;
    let inTag = false;
    let tagStart = -1;
    while (i < src.length) {
      const ch = src[i];
      if (ch === '<') {
        tagStart = i;
        inTag = true;
      } else if (ch === '>' && inTag) {
        const tag = src.slice(tagStart, i + 1);
        inTag = false;
        if (/^<div[\s>]/i.test(tag) && !/^<\//.test(tag) && !/\/>$/.test(tag)) {
          depth++;
        } else if (tag === '</div>' || /^<\/div\s*>/i.test(tag)) {
          depth--;
          if (depth === 0) return i; // index of '>'
        }
      }
      i++;
    }
    return -1;
  }

  const mainCloseGt = findMatchingClose(html, mainOpen);
  if (mainCloseGt === -1) return { html, changed };
  const mainCloseStart = html.lastIndexOf('</div>', mainCloseGt);
  // Content between main close and sidebar
  const between = html.slice(mainCloseGt + 1, sideIdx2);

  const hasOrphanArticles = between.includes(artStartMark) ||
    between.includes('<!-- Semantic SEO Instructional Hub') ||
    between.includes('<!-- TARGET INJECTION POINT') ||
    between.includes('id="seo-instructional-hub"') ||
    between.includes('<!-- Semantic SEO Related Tool Matrix Silo');

  if (hasOrphanArticles) {
    // Extract movable blocks from between
    let extract = between;
    // Don't pull unrelated whitespace-only or comments about Column 4
    extract = extract.replace(/<!--\s*Column 4[^>]*-->/gi, '');
    extract = extract.trim();
    if (extract) {
      // Remove from between; insert before main close
      html = html.slice(0, mainCloseStart) + '\n' + extract + '\n' + html.slice(mainCloseStart, mainCloseGt + 1) + '\n' + html.slice(sideIdx2);
      // Clean double inserts of empty between - sideIdx may have shifted; strip leftover orphan between new main close and sidebar
      const sideIdx3 = html.indexOf(sidebarMarker);
      const mainOpen2 = html.indexOf('<div class="lg:col-span-3');
      const mainCloseGt2 = findMatchingClose(html, mainOpen2);
      if (mainCloseGt2 !== -1 && sideIdx3 > mainCloseGt2) {
        const between2 = html.slice(mainCloseGt2 + 1, sideIdx3);
        // If between still has article-like content (failed clean), leave it;
        // otherwise strip comment/whitespace junk
        if (!between2.includes(artStartMark) && !between2.includes('seo-instructional-hub') && !between2.includes('Related Tool Matrix')) {
          const cleaned = between2.replace(/<!--[\s\S]*?-->/g, '').trim();
          if (!cleaned) {
            html = html.slice(0, mainCloseGt2 + 1) + '\n\n      ' + html.slice(sideIdx3);
          }
        }
      }
      changed = true;
    }
  }

  // Ensure only one articles block remains inside main (dedupe if move created dup)
  const sideIdx4 = html.indexOf(sidebarMarker);
  const mainOpen3 = html.indexOf('<div class="lg:col-span-3');
  const mainCloseGt3 = findMatchingClose(html, mainOpen3);
  if (mainOpen3 !== -1 && mainCloseGt3 !== -1) {
    const mainChunk = html.slice(mainOpen3, mainCloseGt3 + 1);
    const starts = [];
    let sf = 0;
    while (true) {
      const i = mainChunk.indexOf(artStartMark, sf);
      if (i === -1) break;
      starts.push(mainOpen3 + i);
      sf = i + 1;
    }
    if (starts.length > 1) {
      // Remove second and later articles blocks inside main
      for (let k = starts.length - 1; k >= 1; k--) {
        const s = starts[k];
        const endMark = '<!-- Informative Articles End -->';
        let e = html.indexOf(endMark, s);
        // Some pages lack End marker on first block — find next section or close
        if (e === -1) {
          const next = html.indexOf('<!-- Semantic SEO', s + 1);
          const next2 = html.indexOf('<!-- TARGET INJECTION', s + 1);
          e = Math.min(next === -1 ? Infinity : next, next2 === -1 ? Infinity : next2);
          if (!isFinite(e)) continue;
          html = html.slice(0, s) + html.slice(e);
        } else {
          e = e + endMark.length;
          html = html.slice(0, s) + html.slice(e);
        }
        changed = true;
      }
    }
  }

  return { html, changed };
}

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('SKIP missing', filePath);
    return false;
  }
  const original = fs.readFileSync(filePath, 'utf8');
  const { html, changed } = fixHtml(original);
  if (changed && html !== original) {
    fs.writeFileSync(filePath, html);
    console.log('FIXED', filePath);
    return true;
  }
  console.log('OK/noop', filePath);
  return false;
}

let n = 0;
for (const tool of TOOLS) {
  for (const base of ['.', 'PUBLIC']) {
    if (processFile(path.join(base, tool, 'index.html'))) n++;
  }
}
console.log('Updated', n, 'files');
