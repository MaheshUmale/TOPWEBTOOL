const fs = require('fs');

function findMatchingDivClose(html, startIdx) {
  let depth = 0;
  let inTag = false;
  let tagStart = -1;
  
  for (let i = startIdx; i < html.length; i++) {
    const char = html[i];
    if (char === '<') { tagStart = i; inTag = true; }
    else if (char === '>' && inTag) {
      const tag = html.substring(tagStart, i + 1);
      inTag = false;
      if (tag.startsWith('<div') && (tag.length === 4 || tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n' || tag[4] === '\t' || tag[4] === '/')) {
        if (!tag.startsWith('</div')) depth++;
      } else if (tag === '</div>') {
        depth--;
        if (depth === 0) return i;
      }
    }
  }
  return -1;
}

const html = fs.readFileSync('PUBLIC/inflation-calculator/index.html', 'utf8');
const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
const mainCloseIdx = findMatchingDivClose(html, mainOpenIdx);
const sidebarOpenIdx = html.indexOf('<div class="lg:col-span-1', mainCloseIdx);

console.log('mainOpenIdx:', mainOpenIdx);
console.log('mainCloseIdx:', mainCloseIdx);
console.log('sidebarOpenIdx:', sidebarOpenIdx);

const between = html.substring(mainCloseIdx, sidebarOpenIdx);
console.log('Between length:', between.length);
console.log('Has articles:', between.includes('<!-- Informative Articles'));
console.log('Has seo:', between.includes('<!-- Semantic SEO Instructional Hub'));
console.log('Has silo:', between.includes('<!-- Semantic SEO Related Tool Matrix Silo'));

const mainContent = html.substring(mainOpenIdx, mainCloseIdx);
console.log('Main has articles:', mainContent.includes('<!-- Informative Articles'));
console.log('Main has seo:', mainContent.includes('<!-- Semantic SEO Instructional Hub'));
console.log('Main has silo:', mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo'));
