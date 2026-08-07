const fs = require('fs');
const html = fs.readFileSync('PUBLIC/car-lease-estimator/index.html', 'utf8');
const matches = [];
let idx = 0;
while ((idx = html.indexOf('lg:col-span-3', idx)) !== -1) {
  matches.push(idx);
  idx++;
}
console.log('All lg:col-span-3 occurrences:', matches.length);
matches.forEach((pos, i) => {
  console.log(`  ${i}: ${pos} - context: ${html.substring(pos, pos + 80).replace(/\n/g, '\\n')}`);
});
