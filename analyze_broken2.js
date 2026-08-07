const fs = require('fs');
const tools = [
  'agent-eval-engine', 'agent-hitl-planner', 'inflation-calculator', 'mortgage-calculator'
];

for (const t of tools) {
  const html = fs.readFileSync('PUBLIC/' + t + '/index.html', 'utf8');
  const mainOpen = html.indexOf('<div class="lg:col-span-3');
  // Find the last </div> before the sidebar
  const sidebarIdx = html.indexOf('lg:col-span-1', mainOpen);
  const beforeSidebar = html.substring(0, sidebarIdx);
  const lastDivBeforeSidebar = beforeSidebar.lastIndexOf('</div>');
  const mainContent = html.substring(mainOpen, lastDivBeforeSidebar);
  
  console.log(`\n${t}:`);
  console.log('  hasArticlesInside:', mainContent.includes('<!-- Informative Articles & Guides Section -->'));
  console.log('  hasSeoInside:', mainContent.includes('<!-- Semantic SEO Instructional Hub -->'));
  console.log('  hasSiloInside:', mainContent.includes('<!-- Semantic SEO Related Tool Matrix Silo -->'));
  console.log('  mainClosePos:', lastDivBeforeSidebar);
}
