const fs = require('fs');
const tools = ['car-lease-estimator', 'inflation-calculator', 'mortgage-calculator', 'agent-eval-engine'];

for (const t of tools) {
  const html = fs.readFileSync('PUBLIC/' + t + '/index.html', 'utf8');
  const sidebarIdx = html.indexOf('<div class="lg:col-span-1');
  console.log(`\n=== ${t} ===`);
  console.log('sidebarIdx:', sidebarIdx);
  
  if (sidebarIdx === -1) {
    console.log('NO SIDEBAR');
    continue;
  }
  
  const beforeSidebar = html.substring(0, sidebarIdx);
  const articleStart = beforeSidebar.lastIndexOf('<!-- Informative Articles & Guides Section -->');
  const seoStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Instructional Hub -->');
  const siloStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
  
  console.log('articleStart:', articleStart);
  console.log('seoStart:', seoStart);
  console.log('siloStart:', siloStart);
  
  const firstSectionStart = Math.max(
    articleStart === -1 ? -1 : articleStart,
    seoStart === -1 ? -1 : seoStart,
    siloStart === -1 ? -1 : siloStart
  );
  console.log('firstSectionStart:', firstSectionStart);
  
  if (firstSectionStart === -1) {
    console.log('NO SECTIONS BEFORE SIDEBAR');
    continue;
  }
  
  const divBeforeSections = beforeSidebar.lastIndexOf('</div>', firstSectionStart);
  console.log('divBeforeSections:', divBeforeSections);
  
  const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
  const mainContent = html.substring(mainOpenIdx, divBeforeSections);
  console.log('hasArticles:', mainContent.includes('<!-- Informative Articles & Guides Section -->'));
  console.log('hasSeo:', mainContent.includes('<!-- Semantic SEO Instructional Hub -->'));
  console.log('hasSilo:', mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->'));
  
  const outsideContent = html.substring(firstSectionStart, sidebarIdx);
  const extractedArticles = outsideContent.match(/<!-- Informative Articles & Guides Section -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSeo = outsideContent.match(/<!-- Semantic SEO Instructional Hub -->[\s\S]*?<!-- Informative Articles End -->/);
  const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
  
  console.log('extractedArticles:', extractedArticles ? 'YES' : 'NO');
  console.log('extractedSeo:', extractedSeo ? 'YES' : 'NO');
  console.log('extractedSilo:', extractedSilo ? 'YES' : 'NO');
}
