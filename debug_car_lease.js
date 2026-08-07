const fs = require('fs');
const html = fs.readFileSync('PUBLIC/car-lease-estimator/index.html', 'utf8');
const mainOpen = html.indexOf('<div class="lg:col-span-3');
const mainClose = html.lastIndexOf('lg:col-span-3');
const sidebarOpen = html.indexOf('<div class="lg:col-span-1', mainClose);

console.log('mainOpen:', mainOpen);
console.log('mainClose:', mainClose);
console.log('sidebarOpen:', sidebarOpen);

if (mainClose > 0 && sidebarOpen > 0) {
  const between = html.substring(mainClose, sidebarOpen);
  console.log('Has articles outside:', between.includes('<!-- Informative Articles'));
  console.log('Has seo outside:', between.includes('<!-- Semantic SEO'));
  console.log('Has silo outside:', between.includes('<!-- Semantic SEO Related Tool Matrix Silo'));
}
