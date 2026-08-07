const fs=require('fs');
const dirs=fs.readdirSync('.').filter(f=>fs.statSync(f).isDirectory()&&!f.startsWith('.')&&f!=='node_modules');

const issues=[];
for(const dir of dirs){
  const f='./'+dir+'/index.html';
  if(!fs.existsSync(f)) continue;
  const c=fs.readFileSync(f,'utf-8');
  
  let balance=0;
  for(let i=0; i<c.length; i++){
    if(c.substring(i, i+4)==='<div'){
      balance++;
      i+=3;
    } else if(c.substring(i, i+6)==='</div>'){
      balance--;
      i+=5;
    }
  }
  
  if(balance!==0){
    issues.push({dir, balance});
  }
}

console.log('PUBLIC files with unclosed divs:', issues.length);
issues.forEach(i=>console.log('  '+i.dir+': balance='+i.balance));
if(issues.length===0) console.log('All PUBLIC files have balanced divs!');
