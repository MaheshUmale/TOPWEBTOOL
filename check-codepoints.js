const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const m = html.match(/<span class="text-2xl" aria-hidden="true">([^<]{1,10})<\/span>/g);
if (m && m[0]) {
  const s = m[0].match(/<span class="text-2xl" aria-hidden="true">([^<]+)<\/span>/);
  if (s) {
    console.log('String:', s[1]);
    console.log('Length:', s[1].length);
    console.log('Codepoints:', [...s[1]].map(c => 'U+' + c.codePointAt(0).toString(16).padStart(4, '0')).join(' '));
  }
}
