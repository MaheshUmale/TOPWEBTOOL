const fs = require('fs');
const html = fs.readFileSync('PUBLIC/crypto-tax-estimator/index.html', 'utf8');
const idx = html.indexOf('<div class="lg:col-span-3');
console.log('Found main open at:', idx);
let depth = 0;
let inTag = false;
let tagStart = -1;

for (let i = idx; i < html.length; i++) {
  const char = html[i];
  
  if (char === '<') {
    tagStart = i;
    inTag = true;
  } else if (char === '>' && inTag) {
    const tag = html.substring(tagStart, i + 1);
    inTag = false;
    
    if (tag.startsWith('<div') && (tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n')) {
      depth++;
      if (i < 200) console.log('  OPEN div at', i, 'depth', depth, 'tag:', tag.substring(0, 50));
    } else if (tag === '</div>') {
      depth--;
      if (i < 300) console.log('  CLOSE div at', i, 'depth', depth);
      if (depth === 0) {
        console.log('MATCH at', i);
        break;
      }
    }
  }
}
