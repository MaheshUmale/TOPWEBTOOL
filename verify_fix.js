const fs=require('fs');
const c=fs.readFileSync('./cpm-calculator/index.html','utf-8');
const match=c.match(/href="[^"]*global\.css"/);
console.log('global.css link:', match?match[0]:'NOT FOUND');
