const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Let's trace the exact structure from the grid to the end
const gridIdx=c.indexOf('grid grid-cols-1 lg:grid-cols-4');
console.log('Grid starts at:', gridIdx);

// Find the end of the main tag
const mainEnd=c.indexOf('</main>');
console.log('</main> at:', mainEnd);

// Show everything from grid to end of main
console.log('\nFrom grid to </main>:');
console.log(c.substring(gridIdx, mainEnd+7).replace(/\n/g,'\\n'));
