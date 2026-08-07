const fs = require('fs');
const html = fs.readFileSync('PUBLIC/inflation-calculator/index.html', 'utf8');

// Count divs between main open and line 171 (actual main close)
const mainOpenIdx = html.indexOf('<div class="lg:col-span-3');
let depth = 0;
let inTag = false;
let tagStart = -1;
let inScript = false;
let inStyle = false;
let inComment = false;

for (let i = mainOpenIdx; i < html.length; i++) {
  const char = html[i];
  
  // Track script/style tags
  if (char === '<' && html.substring(i, i + 7) === '<script') inScript = true;
  if (char === '<' && html.substring(i, i + 9) === '</script>') inScript = false;
  if (char === '<' && html.substring(i, i + 6) === '<style') inStyle = true;
  if (char === '<' && html.substring(i, i + 8) === '</style>') inStyle = false;
  
  if (inScript || inStyle) continue;
  
  if (char === '<') {
    tagStart = i;
    inTag = true;
  } else if (char === '>' && inTag) {
    const tag = html.substring(tagStart, i + 1);
    inTag = false;
    
    if (tag.startsWith('<div') && (tag.length === 4 || tag[4] === ' ' || tag[4] === '>' || tag[4] === '\n' || tag[4] === '\t' || tag[4] === '/')) {
      if (!tag.startsWith('</div')) {
        depth++;
        if (i < 22000) console.log('OPEN at', i, 'depth', depth, 'tag:', tag.substring(0, 50));
      }
    } else if (tag === '</div>') {
      depth--;
      if (i < 22000) console.log('CLOSE at', i, 'depth', depth);
      if (depth === 0) {
        console.log('MATCH at', i);
        break;
      }
    }
  }
}

console.log('Final depth at end:', depth);
