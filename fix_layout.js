const fs = require('fs');
const path = require('path');

function findMatchingDivClose(html, startIdx) {
  let depth = 0;
  let inTag = false;
  let tagStart = -1;
  
  for (let i = startIdx; i < html.length; i++) {
    const char = html[i];
    
    if (char === '<') {
      tagStart = i;
      inTag = true;
    } else if (char === '>' && inTag) {
      const tag = html.substring(tagStart, i + 1);
      inTag = false;
      
      if (tag.startsWith('<div') && (tag.length === 4 || tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n' || tag[4] === '\t' || tag[4] === '/')) {
        // Check it's not a closing div
        if (!tag.startsWith('</div')) {
          depth++;
        }
      } else if (tag === '</div>') {
        depth--;
        if (depth === 0) {
          return i;
        }
      }
    }
  }
  return -1;
}

function fixPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Find main column boundaries
  const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
  if (mainOpenIdx === -1) {
    return false;
  }
  
  const mainCloseIdx = findMatchingDivClose(html, mainOpenIdx);
  if (mainCloseIdx === -1) {
    console.log(`  SKIP: could not find main column close in ${filePath}`);
    return false;
  }
  
  // Find sidebar open after main close
  const sidebarOpenIdx = html.indexOf('<div class="lg:col-span-1', mainCloseIdx);
  if (sidebarOpenIdx === -1) {
    return false;
  }
  
  // Check what's between main close and sidebar open
  const between = html.substring(mainCloseIdx, sidebarOpenIdx);
  
  const articleStart = between.indexOf('<!-- Informative Articles & Guides Section -->');
  const seoStart = between.indexOf('<!-- Semantic SEO Instructional Hub -->');
  const siloStart = between.indexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  if (articleStart === -1 && seoStart === -1 && siloStart === -1) {
    // No sections outside main column - page is structurally correct
    return false;
  }
  
  // Find the start of the first section outside
  const firstSectionAbsStart = Math.min(
    articleStart === -1 ? Infinity : mainCloseIdx + articleStart,
    seoStart === -1 ? Infinity : mainCloseIdx + seoStart,
    siloStart === -1 ? Infinity : mainCloseIdx + siloStart
  );
  
  // Extract all outside content from firstSectionAbsStart to sidebarOpenIdx
  const outsideContent = html.substring(firstSectionAbsStart, sidebarOpenIdx);
  
  // Check if main column already has these sections
  const mainContent = html.substring(mainOpenIdx, mainCloseIdx);
  const hasArticlesInside = mainContent.includes('<!-- Informative Articles & Guides Section -->');
  const hasSeoInside = mainContent.includes('<!-- Semantic SEO Instructional Hub -->');
  const hasSiloInside = mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  // Extract sections from outside content
  const extractedArticles = outsideContent.match(/<!-- Informative Articles & Guides Section -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSeo = outsideContent.match(/<!-- Semantic SEO Instructional Hub -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
  
  // Remove outside sections
  html = html.substring(0, firstSectionAbsStart) + html.substring(sidebarOpenIdx);
  
  // Build insertion content for missing sections
  let insertion = '';
  if (extractedArticles && !hasArticlesInside) insertion += extractedArticles[0] + '\n';
  if (extractedSeo && !hasSeoInside) insertion += extractedSeo[0] + '\n';
  if (extractedSilo && !hasSiloInside) insertion += extractedSilo[0] + '\n';
  
  if (insertion) {
    // Find the new main column close (it shifted after removal)
    const newMainCloseIdx = findMatchingDivClose(html, mainOpenIdx);
    if (newMainCloseIdx !== -1) {
      html = html.substring(0, newMainCloseIdx) + insertion + html.substring(newMainCloseIdx);
      fs.writeFileSync(filePath, html);
      return true;
    }
  } else if (hasArticlesInside && hasSeoInside && hasSiloInside) {
    // Just removed duplicate outside content
    fs.writeFileSync(filePath, html);
    return true;
  }
  
  return false;
}

const dir = process.argv[2] || 'PUBLIC';
const tools = fs.readdirSync(dir).filter(d => {
  try {
    const stat = fs.statSync(path.join(dir, d));
    return stat.isDirectory() && fs.existsSync(path.join(dir, d, 'index.html'));
  } catch (e) {
    return false;
  }
});

let fixed = 0;
let skipped = 0;

for (const tool of tools) {
  const f = path.join(dir, tool, 'index.html');
  try {
    if (fixPage(f)) {
      fixed++;
      console.log(`FIXED: ${tool}`);
    } else {
      skipped++;
    }
  } catch (e) {
    console.log(`ERROR: ${tool}: ${e.message}`);
    skipped++;
  }
}

console.log(`\nFixed: ${fixed}, Skipped: ${skipped}`);
