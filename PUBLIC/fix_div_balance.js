const fs=require('fs');
const dirs=fs.readdirSync('.').filter(f=>fs.statSync(f).isDirectory()&&!f.startsWith('.')&&f!=='node_modules');

let fixedOpen=0, fixedClose=0;

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
  
  if(balance===1){
    // Missing closing </div> - add before </main>
    const mainIdx=c.lastIndexOf('</main>');
    if(mainIdx>0){
      const newC=c.substring(0, mainIdx)+'</div>'+c.substring(mainIdx);
      fs.writeFileSync(f, newC);
      fixedOpen++;
      console.log(dir+': added missing </div> before </main>');
    }
  } else if(balance===-1){
    // Extra closing </div> - remove the last one before </main>
    const mainIdx=c.lastIndexOf('</main>');
    if(mainIdx>0){
      // Find the last </div> before </main>
      const lastDiv=c.lastIndexOf('</div>', mainIdx);
      if(lastDiv>0){
        const newC=c.substring(0, lastDiv)+c.substring(lastDiv+6);
        fs.writeFileSync(f, newC);
        fixedClose++;
        console.log(dir+': removed extra </div> before </main>');
      }
    }
  }
}

console.log('\nFixed '+fixedOpen+' files with missing </div>');
console.log('Fixed '+fixedClose+' files with extra </div>');
