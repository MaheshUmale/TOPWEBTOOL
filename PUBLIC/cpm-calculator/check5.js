const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the exact area
const start=19800;
const end=20200;
console.log('HTML from index', start, 'to', end, ':');
console.log(c.substring(start, end));
