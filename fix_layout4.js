const fs = require('fs');
const path = require('path');

function fixPage(filePath) {
  let html = fs.readFileSync(filePath, 'utf8');
  
  const sidebarIdx = html.indexOf('<div class="lg:col-span-1');
  if (sidebarIdx === -1) return false;
  
  // Find sections before sidebar
  const beforeSidebar = html.substring(0, sidebarIdx);
  const articleStart = beforeSidebar.lastIndexOf('<!-- Informative Articles & Guides Section -->');
  const seoStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Instructional Hub -->');
  const siloStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  const firstSectionStart = Math.max(
    articleStart === -1 ? -1 : articleStart,
    seoStart === -1 ? -1 : seoStart,
    siloStart === -1 ? -1 : siloStart
  );
  
  if (firstSectionStart === -1) return false;
  
  // Find the closing </div> just before the duplicate sections
  const divBeforeSections = beforeSidebar.lastIndexOf('</div>', firstSectionStart);
  if (divBeforeSections === -1) return false;
  
  // Check if main column already has these sections
  const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
  const mainContent = html.substring(mainOpenIdx, divBeforeSections);
  const hasArticles = mainContent.includes('<!-- Informative Articles & Guides Section -->');
  const hasSeo = mainContent.includes('<!-- Semantic SEO Instructional Hub -->');
  const hasSilo = mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  // Extract outside sections
  const outsideContent = html.substring(firstSectionStart, sidebarIdx);
  const extractedArticles = outsideContent.match(/<!-- Informative Articles & Guides Section -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSeo = outsideContent.match(/<!-- Semantic SEO Instructional Hub -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
  
  if (hasArticles && hasSeo && hasSilo) {
    // Main column has all sections - just remove outside duplicates
    // Remove from firstSectionStart to sidebarIdx
    html = html.substring(0, firstSectionStart) + html.substring(sidebarIdx);
    
    // Insert </div> before sidebar to close main column
    const newSidebarIdx = html.indexOf('<div class="lg:col-span-1');
    html = html.substring(0, newSidebarIdx) + '</div>' + html.substring(newSidebarIdx);
    
    fs.writeFileSync(filePath, html);
    return true;
  } else {
    // Main column is missing sections - move them from outside to inside
    // First, remove outside sections
    html = html.substring(0, firstSectionStart) + html.substring(sidebarIdx);
    
    // Build insertion content
    let insertion = '';
    if (extractedArticles && !hasArticles) insertion += extractedArticles[0] + '\n';
    if (extractedSeo && !hasSeo) insertion += extractedSeo[0] + '\n';
    if (extractedSilo && !hasSilo) insertion += extractedSilo[0] + '\n';
    
    if (insertion) {
      // Find main column close in modified HTML
      const newMainOpen = html.indexOf('<div class="lg:col-span-3');
      let depth = 0;
      let inTag = false;
      let tagStart = -1;
      let actualClose = -1;
      
      for (let i = newMainOpen; i < html.length; i++) {
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
        // Insert sections before main column close
        html = html.substring(0, actualClose) + insertion + html.substring(actualClose);
        
        // Now close main column before sidebar
        const newSidebarIdx = html.indexOf('<div class="lg:col-span-1');
        html = html.substring(0, newSidebarIdx) + '</div>' + html.substring(newSidebarIdx);
        
        fs.writeFileSync(filePath, html);
        return true;
      }
    }
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
