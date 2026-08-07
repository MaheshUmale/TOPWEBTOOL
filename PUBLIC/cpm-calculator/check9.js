const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Search for literal \n in the HTML
const matches=[...c.matchAll(/\\n/g)];
console.log('Literal \\n occurrences:', matches.length);

if(matches.length>0){
  console.log('First few occurrences:');
  for(let i=0; i<Math.min(5, matches.length); i++){
    const m=matches[i];
    const start=Math.max(0, m.index-30);
    const end=Math.min(c.length, m.index+50);
    console.log('At', m.index, ':', c.substring(start, end).replace(/\n/g,'\\n'));
  }
}

// Also check for other escaped characters
const backslashMatches=[...c.matchAll(/\\[nrt]/g)];
console.log('\nOther escaped chars:', backslashMatches.length);
