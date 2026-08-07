const fs=require('fs');
const publicC=fs.readFileSync('./index.html','utf-8');
const rootC=fs.readFileSync('../cpm-calculator/index.html','utf-8');

console.log('PUBLIC file size:', publicC.length);
console.log('Root file size:', rootC.length);
console.log('Files are identical:', publicC===rootC);

if(publicC!==rootC){
  // Find first difference
  let i=0;
  while(i<publicC.length && i<rootC.length && publicC[i]===rootC[i]) i++;
  console.log('\nFirst difference at index:', i);
  console.log('PUBLIC context:', publicC.substring(Math.max(0,i-50), i+50).replace(/\n/g,'\\n'));
  console.log('Root context:', rootC.substring(Math.max(0,i-50), i+50).replace(/\n/g,'\\n'));
}
