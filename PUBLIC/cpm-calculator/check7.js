const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the exact sidebar opening
const sidebarPattern=/<!-- Column 4 Sidebar[^>]*-->\s*<div class="lg:col-span-1 space-y-6"/;
const match=c.match(sidebarPattern);
console.log('Pattern match:', match?match[0]:'NOT FOUND');

// Find all occurrences of "lg:col-span-1 space-y-6"
const occurrences=[...c.matchAll(/lg:col-span-1 space-y-6/g)];
console.log('\nAll occurrences of lg:col-span-1 space-y-6:');
for(const o of occurrences){
  const start=Math.max(0, o.index-50);
  const end=Math.min(c.length, o.index+100);
  console.log('At', o.index, ':', c.substring(start, end).replace(/\n/g,'\\n'));
}

// Check for the broken pattern
const brokenPattern=/lg:col-span-1 space-y-6">/;
const brokenMatch=c.match(brokenPattern);
console.log('\nBroken pattern (missing <div class="):', brokenMatch?'FOUND at '+brokenMatch.index:'NOT FOUND');
