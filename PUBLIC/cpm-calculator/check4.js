const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the exact area with the stray div
const area=c.substring(18000, 20200).replace(/\n/g,'\\n');
console.log('Area around sidebar (18000-20200):');
console.log(area);

// Find all occurrences of "Column 4 Sidebar"
const sidebarMatches=[...c.matchAll(/Column 4 Sidebar/g)];
console.log('\nColumn 4 Sidebar occurrences:', sidebarMatches.length);
for(const m of sidebarMatches) console.log('  at index '+m.index);
