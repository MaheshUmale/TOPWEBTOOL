const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const matches = [...html.matchAll(/<span class="text-2xl" aria-hidden="true">([^<]{1,10})<\/span>/g)];

// Get unique corrupted icons (not standard emoji ranges)
const seen = new Set();
for (const m of matches) {
  const s = m[1];
  if (s.length === 4 && s.charCodeAt(0) === 0x00f0) {
    const key = [...s].map(c => c.codePointAt(0).toString(16).padStart(4, '0')).join(' ');
    if (!seen.has(key)) {
      seen.add(key);
      console.log('String:', s);
      console.log('Codepoints:', key);
      console.log('---');
    }
  }
}
