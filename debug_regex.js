const fs = require('fs');
const html = fs.readFileSync('PUBLIC/car-lease-estimator/index.html', 'utf8');
const sidebarIdx = html.indexOf('<div class="lg:col-span-1');
const beforeSidebar = html.substring(0, sidebarIdx);
const siloStart = beforeSidebar.lastIndexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
const outsideContent = html.substring(siloStart, sidebarIdx);

console.log('siloStart:', siloStart);
console.log('sidebarIdx:', sidebarIdx);
console.log('outsideContent length:', outsideContent.length);
console.log('outsideContent first 200 chars:', outsideContent.substring(0, 200).replace(/\n/g, '\\n'));

const extractedSilo = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?(?=<div class="lg:col-span-1)/);
console.log('extractedSilo:', extractedSilo ? 'YES (' + extractedSilo[0].length + ')' : 'NO');

// Try simpler regex
const extractedSilo2 = outsideContent.match(/<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?<div class="lg:col-span-1/);
console.log('extractedSilo2 (simple):', extractedSilo2 ? 'YES' : 'NO');
