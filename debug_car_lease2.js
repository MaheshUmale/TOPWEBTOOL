const fs = require('fs');
const html = fs.readFileSync('PUBLIC/car-lease-estimator/index.html', 'utf8');
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
    
    if (tag.startsWith('<div') && (tag.length === 4 || tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n' || tag[4] === '\t' || tag[4] === '/')) {
      if (!tag.startsWith('</div')) {
        depth++;
        if (i < 5000) console.log('  OPEN div at', i, 'depth', depth, 'tag:', tag.substring(0, 60));
      }
    } else if (tag === '</div>') {
      depth--;
      if (i < 5000) console.log('  CLOSE div at', i, 'depth', depth);
      if (depth === 0) {
        console.log('MATCH at', i);
        break;
      }
    }
  }
}
