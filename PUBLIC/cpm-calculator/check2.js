const fs=require('fs');
const c=fs.readFileSync('./index.html','utf-8');

// Find the grid container
const gridIdx=c.indexOf('grid grid-cols-1 lg:grid-cols-4');
console.log('Grid starts at:', gridIdx);

// Find all div opens and closes after grid
let searchFrom=gridIdx;
let divOpens=0;
let divCloses=0;
let positions=[];
let safety=0;

while(safety<300){
  const nextOpen=c.indexOf('<div', searchFrom);
  const nextClose=c.indexOf('</div>', searchFrom);
  
  if(nextClose===-1) break;
  
  if(nextOpen!==-1 && nextOpen < nextClose){
    divOpens++;
    const context=c.substring(nextOpen, nextOpen+80).replace(/\n/g,'\\n');
    positions.push({type:'open', idx:nextOpen, balance:divOpens-divCloses, context});
    searchFrom=nextOpen+4;
  } else {
    divCloses++;
    const context=c.substring(nextClose, nextClose+80).replace(/\n/g,'\\n');
    positions.push({type:'close', idx:nextClose, balance:divOpens-divCloses, context});
    searchFrom=nextClose+6;
  }
  safety++;
}

// Show positions where balance goes to 0 (grid closes)
console.log('\nPositions where grid balance returns to 0 (grid closes):');
for(const p of positions){
  if(p.balance===0 && p.type==='close'){
    console.log('Balance 0 close at '+p.idx+': '+p.context);
  }
}

// Show last 30 positions
console.log('\nLast 30 div operations:');
positions.slice(-30).forEach(p=>{
  console.log(p.type+' (balance='+p.balance+'): '+p.context);
});

// Find lg:col-span-1 position relative to grid
const span1Idx=c.indexOf('lg:col-span-1', gridIdx);
console.log('\nlg:col-span-1 at index:', span1Idx);
console.log('Distance from grid:', span1Idx-gridIdx);
