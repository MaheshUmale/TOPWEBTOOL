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
  console.log('\n--- Processing:', filePath);
  
  const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
  console.log('mainOpenIdx:', mainOpenIdx);
  if (mainOpenIdx === -1) return false;
  
  const mainCloseIdx = findMatchingDivClose(html, mainOpenIdx);
  console.log('mainCloseIdx:', mainCloseIdx);
  if (mainCloseIdx === -1) {
    console.log('SKIP: no main close');
    return false;
  }
  
  const sidebarOpenIdx = html.indexOf('<div class="lg:col-span-1', mainCloseIdx);
  console.log('sidebarOpenIdx:', sidebarOpenIdx);
  if (sidebarOpenIdx === -1) return false;
  
  const between = html.substring(mainCloseIdx, sidebarOpenIdx);
  const articleStart = between.indexOf('<!-- Informative Articles & Guides Section -->');
  const seoStart = between.indexOf('<!-- Semantic SEO Instructional Hub -->');
  const siloStart = between.indexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  console.log('articleStart in between:', articleStart);
  console.log('seoStart in between:', seoStart);
  console.log('siloStart in between:', siloStart);
  
  if (articleStart === -1 && seoStart === -1 && siloStart === -1) {
    console.log('No sections outside main column');
    return false;
  }
  
  const mainContent = html.substring(mainOpenIdx, mainCloseIdx);
  console.log('hasArticlesInside:', mainContent.includes('<!-- Informative Articles & Guides Section -->'));
  console.log('hasSeoInside:', mainContent.includes('<!-- Semantic SEO Instructional Hub -->'));
  console.log('hasSiloInside:', mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->'));
  
  const firstSectionAbsStart = Math.min(
    articleStart === -1 ? Infinity : mainCloseIdx + articleStart,
    seoStart === -1 ? Infinity : mainCloseIdx + seoStart,
    siloStart === -1 ? Infinity : mainCloseIdx + siloStart
  );
  
  const outsideContent = html.substring(firstSectionAbsStart, sidebarOpenIdx);
  const extractedArticles = outsideContent.match(/<!-- Informative Articles & Guides Section -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSeo = outsideContent.match(/<!-- Semantic SEO Instructional Hub -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
  
  console.log('extractedArticles:', extractedArticles ? 'YES (' + extractedArticles[0].length + ' chars)' : 'NO');
  console.log('extractedSeo:', extractedSeo ? 'YES (' + extractedSeo[0].length + ' chars)' : 'NO');
  console.log('extractedSilo:', extractedSilo ? 'YES (' + extractedSilo[0].length + ' chars)' : 'NO');
  
  // Remove outside sections
  html = html.substring(0, firstSectionAbsStart) + html.substring(sidebarOpenIdx);
  
  const hasArticlesInside = mainContent.includes('<!-- Informative Articles & Guides Section -->');
  const hasSeoInside = mainContent.includes('<!-- Semantic SEO Instructional Hub -->');
  const hasSiloInside = mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  let insertion = '';
  if (extractedArticles && !hasArticlesInside) insertion += extractedArticles[0] + '\n';
  if (extractedSeo && !hasSeoInside) insertion += extractedSeo[0] + '\n';
  if (extractedSilo && !hasSiloInside) insertion += extractedSilo[0] + '\n';
  
  console.log('insertion length:', insertion.length);
  
  if (insertion) {
    const newMainCloseIdx = findMatchingDivClose(html, mainOpenIdx);
    console.log('newMainCloseIdx:', newMainCloseIdx);
    if (newMainCloseIdx !== -1) {
      html = html.substring(0, newMainCloseIdx) + insertion + html.substring(newMainCloseIdx);
      fs.writeFileSync(filePath, html);
      console.log('FIXED');
      return true;
    } else {
      console.log('SKIP: could not find new main close');
      return false;
    }
  } else if (hasArticlesInside && hasSeoInside && hasSiloInside) {
    fs.writeFileSync(filePath, html);
    console.log('FIXED (removed duplicates)');
    return true;
  }
  
  console.log('SKIP: no action taken');
  return false;
}

fixPage('PUBLIC/car-lease-estimator/index.html');
