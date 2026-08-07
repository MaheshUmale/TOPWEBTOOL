const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find grid and analyze structure
const gridIdx=c.indexOf('grid grid-cols-1 lg:grid-cols-4');
console.log('Grid at:', gridIdx);
console.log('Around grid:');
console.log(c.substring(gridIdx-20, gridIdx+200).replace(/\n/g,'\\n'));

// Find lg:col-span occurrences
const spans=[...c.matchAll(/lg:col-span-\d/g)];
console.log('\nAll lg:col-span occurrences:');
for(const s of spans) console.log('  '+s[0]+' at index '+s.index);

// Find sidebar divs
console.log('\ntrending-sidebar:', c.includes('id="trending-sidebar"'));
console.log('ad-slot-square:', c.includes('id="ad-slot-square"'));
console.log('ad-slot-vertical:', c.includes('id="ad-slot-vertical"'));

// Check if sidebar is inside main column
const mainOpen=c.indexOf('lg:col-span-3');
const mainClose=c.indexOf('</div>', mainOpen+50);
console.log('\nMain col open:', mainOpen);
console.log('First </div> after main open:', mainClose);

// What's between main open and first close?
console.log('\nBetween main open and first close:');
console.log(c.substring(mainOpen, mainClose).replace(/\n/g,'\\n'));
