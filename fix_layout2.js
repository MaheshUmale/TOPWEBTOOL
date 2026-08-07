const fs = require('fs');
const path = require('path');

function fixPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  // Find sidebar opening
  const sidebarOpenIdx = html.indexOf('<div class="lg:col-span-1');
  if (sidebarOpenIdx === -1) {
    console.log(`  SKIP: no sidebar in ${path.basename(filePath)}`);
    return false;
  }
  
  // Look backwards from sidebar for the first section block
  const beforeSidebar = html.substring(0, sidebarOpenIdx);
  const articleStart = beforeSidebar.lastIndexOf('<!-- Informative Articles & Guides Section -->');
  const seoStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Instructional Hub -->');
  const siloStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  const firstSectionStart = Math.max(
    articleStart === -1 ? -1 : articleStart,
    seoStart === -1 ? -1 : seoStart,
    siloStart === -1 ? -1 : siloStart
  );
  
  if (firstSectionStart === -1) {
    // No sections before sidebar - they might be inside main column or missing entirely
    // Check if main column has them
    const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
    if (mainOpenIdx === -1) return false;
    const mainContent = html.substring(mainOpenIdx, html.indexOf('</div>', mainOpenIdx + 100));
    // This is getting complicated. Let's just return false for now.
    return false;
  }
  
  // Find the closing </div> just before the first section
  const divBeforeSection = beforeSidebar.lastIndexOf('</div>', firstSectionStart);
  if (divBeforeSection === -1) {
    console.log(`  SKIP: no div before section in ${path.basename(filePath)}`);
    return false;
  }
  
  // Check if the main column already has these sections
  const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
  const mainContent = html.substring(mainOpenIdx, divBeforeSection);
  const hasArticlesInside = mainContent.includes('<!-- Informative Articles & Guides Section -->');
  const hasSeoInside = mainContent.includes('<!-- Semantic SEO Instructional Hub -->');
  const hasSiloInside = mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  // Extract the outside sections
  const outsideContent = html.substring(firstSectionStart, sidebarOpenIdx);
  const extractedArticles = outsideContent.match(/<!-- Informative Articles & Guides Section -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSeo = outsideContent.match(/<!-- Semantic SEO Instructional Hub -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
  
  // Remove outside sections
  html = html.substring(0, firstSectionStart) + html.substring(sidebarOpenIdx);
  
  // Build insertion
  let insertion = '';
  if (extractedArticles && !hasArticlesInside) insertion += extractedArticles[0] + '\n';
  if (extractedSeo && !hasSeoInside) insertion += extractedSeo[0] + '\n';
  if (extractedSilo && !hasSiloInside) insertion += extractedSilo[0] + '\n';
  
  if (insertion) {
    // Find new main close after removal
    const newMainOpenIdx = html.indexOf('<div class="lg:col-span-3');
    const newMainCloseIdx = html.indexOf('</div>', newMainOpenIdx + 100);
    
    // Find the actual closing div by counting
    let depth = 0;
    let inTag = false;
    let tagStart = -1;
    let actualClose = -1;
    
    for (let i = newMainOpenIdx; i < html.length; i++) {
      if (html[i] === '<') { tagStart = i; inTag = true; }
      else if (html[i] === '>' && inTag) {
        const tag = html.substring(tagStart, i + 1);
        inTag = false;
        if (tag.startsWith('<div') && (tag.length === 4 || tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n' || tag[4] === '\t' || tag[4] === '/')) {
          if (!tag.startsWith('</div')) depth++;
        } else if (tag === '</div>') {
          depth--;
          if (depth === 0) {
            actualClose = i;
            break;
          }
        }
      }
    }
    
    if (actualClose !== -1) {
      html = html.substring(0, actualClose) + insertion + html.substring(actualClose);
      fs.writeFileSync(filePath, html);
      return true;
    }
  } else {
    // Just removed duplicates
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
