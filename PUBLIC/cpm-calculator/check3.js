const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the area around lg:col-span-1
const span1Idx=c.indexOf('lg:col-span-1');
console.log('lg:col-span-1 at:', span1Idx);
console.log('\nContext before lg:col-span-1 (200 chars):');
console.log(c.substring(span1Idx-200, span1Idx).replace(/\n/g,'\\n'));
console.log('\nContext at lg:col-span-1 (200 chars):');
console.log(c.substring(span1Idx, span1Idx+200).replace(/\n/g,'\\n'));

// Find the pattern that shows the issue
const pattern=c.substring(span1Idx-300, span1Idx+100).replace(/\n/g,'\\n');
console.log('\nFull area around sidebar (300 before, 100 after):');
console.log(pattern);
