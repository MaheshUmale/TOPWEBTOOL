const fs = require('fs');
const path = require('path');

const dir = 'PUBLIC';
const tools = fs.readdirSync(dir).filter(d => fs.statSync(path.join(dir, d)).isDirectory());
let duplicates = [];

for (const tool of tools) {
  const f = path.join(dir, tool, 'index.html');
  if (!fs.existsSync(f)) continue;
  const html = fs.readFileSync(f, 'utf8');
  const count = (html.match(/<!-- Informative Articles/g) || []).length;
  if (count > 1) {
    duplicates.push(`${tool} (${count})`);
  }
}

console.log('Pages with duplicate Informative Articles:', duplicates.length);
console.log(duplicates.join('\n'));
