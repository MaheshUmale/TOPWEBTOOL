const fs = require('fs');
const html = fs.readFileSync('PUBLIC/car-lease-estimator/index.html', 'utf8');
const sidebarIdx = html.indexOf('<div class="lg:col-span-1');
const siloStart = html.substring(0, sidebarIdx).lastIndexOf('<!-- Semantic SEO Related Tool Matrix Silo -->');
const outsideContent = html.substring(siloStart, sidebarIdx);

console.log('Last 200 chars of outsideContent:');
console.log(outsideContent.substring(outsideContent.length - 200).replace(/\n/g, '\\n'));

// Try matching with different patterns
const patterns = [
  /<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*/,
  /<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?<\/div>/,
  /<!-- Semantic SEO Related Tool Matrix Silo -->[\s\S]*?<\/div>[\s\S]*?<\/div>/,
];

for (const p of patterns) {
  const m = outsideContent.match(p);
  console.log('Pattern:', p.source, '->', m ? 'MATCH (' + m[0].length + ')' : 'NO');
}
