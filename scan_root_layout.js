const fs = require('fs');
const path = require('path');

const dir = '.';
const tools = fs.readdirSync(dir).filter(d => {
  const stat = fs.statSync(path.join(dir, d));
  return stat.isDirectory() && fs.existsSync(path.join(dir, d, 'index.html')) && d !== 'PUBLIC' && d !== '.kilo' && d !== '.agent_state' && d !== 'node_modules' && !d.startsWith('.');
});
let issues = [];

for (const tool of tools) {
  const f = path.join(dir, tool, 'index.html');
  const html = fs.readFileSync(f, 'utf8');
  const articles = html.match(/<!-- Informative Articles/g);
  const seo = html.match(/<!-- Semantic SEO Instructional Hub/g);
  const silo = html.match(/<!-- Semantic SEO Related Tool Matrix Silo/g);
  if (!articles || !seo || !silo) continue;
  
  const firstArticleIdx = html.indexOf('<!-- Informative Articles');
  const lastColSpan3Close = html.lastIndexOf('lg:col-span-3');
  const firstColSpan1Open = html.indexOf('<div class="lg:col-span-1');
  
  if (firstArticleIdx > lastColSpan3Close && firstArticleIdx < firstColSpan1Open) {
    issues.push(tool);
  }
}

console.log('Root pages with articles/silo outside main column:', issues.length);
console.log(issues.join('\n'));
