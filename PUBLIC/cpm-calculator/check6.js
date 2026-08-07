const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the exact sequence around the sidebar
const seq=c.substring(19700, 20050);
console.log('Sequence from 19700 to 20050:');
console.log(seq);

// Count </div> between "Informative Articles End" and "lg:col-span-1"
const articlesEnd=c.indexOf('Informative Articles End');
const span1=c.indexOf('lg:col-span-1', articlesEnd);
const between=c.substring(articlesEnd, span1);

const closes=(between.match(/<\/div>/g)||[]).length;
console.log('\n</div> count between articles end and sidebar:', closes);
console.log('Content between:');
console.log(between.replace(/\n/g,'\\n'));
