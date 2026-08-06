const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const fixes = [
  { bad: '\u00f0\u0178\u008f\u00a1', good: '🏡' },
  { bad: '\u00f0\u009f\u0097', good: '🚗' },
  { bad: '\u00f0\u009f\u008c\u0088', good: '📈' },
  { bad: '\u00f0\u009f\u00aa\u0099', good: '🪙' },
  { bad: '\u00f0\u009f\u0092\u0084', good: '💼' },
  { bad: '\u00f0\u009f\u008c\u008a', good: '📊' },
  { bad: '\u00f0\u009f\u0092\u0083', good: '💳' },
  { bad: '\u00f0\u009f\u0096\u0097', good: '🔗' },
  { bad: '\u00f0\u009f\u0092\u00b0', good: '💰' },
  { bad: '\u00f0\u009f\u008c\u00a2', good: '📢' },
  { bad: '\u00f0\u009f\u0093\u00b1', good: '📱' },
  { bad: '\u00f0\u009f\u0096\u00bc\u00ef\u00b8\u008f', good: '🖼️' },
  { bad: '\u00f0\u009f\u00a4\u0096', good: '🤖' },
  { bad: '\u00f0\u009f\u008e\u00a8', good: '🎨' },
  { bad: '\u00f0\u009f\u00a7\u00a0', good: '🧠' },
  { bad: '\u00f0\u009f\u0099\u0089\u00ef\u00b8\u008f', good: '⚙️' },
  { bad: '\u00f0\u009f\u0094\u0091', good: '🔑' },
  { bad: '\u00f0\u009f\u008c\u009d', good: '📝' },
  { bad: '\u00f0\u009f\u0094\u00a3', good: '🔣' },
  { bad: '\u00f0\u009f\u0094\u00a2', good: '🔢' },
  { bad: '\u00f0\u009f\u0098\u00b8\u00ef\u00b8\u008f', good: '☸️' },
  { bad: '\u00f0\u009f\u0094\u00a1', good: '🔡' },
  { bad: '\u00f0\u009f\u008f\u0083', good: '🏃' },
  { bad: '\u00f0\u009f\u00a4\u00b0', good: '🤰' },
  { bad: '\u00f0\u009f\u008e\u00b2', good: '🎲' },
  { bad: '\u00f0\u009f\u0094\u008a', good: '🔊' },
  { bad: '\u00f0\u009f\u008f\u00b1\u00ef\u00b8\u008f', good: '⏱️' },
  { bad: '\u00f0\u009f\u00a5\u0097', good: '🥗' },
  { bad: '\u00f0\u009f\u008c\u00a1\u00ef\u00b8\u008f', good: '🌡️' },
  { bad: '\u00f0\u009f\u008d\u0085', good: '🍅' },
  { bad: '\u00f0\u009f\u009b\u00b0', good: '🎰' },
  { bad: '\u00e2\u009c\u008d\u00ef\u00b8\u008f', good: '✍️' },
];

let fixed = 0;
for (const fix of fixes) {
  if (html.includes(fix.bad)) {
    const count = html.split(fix.bad).length - 1;
    html = html.split(fix.bad).join(fix.good);
    fixed += count;
    console.log(`Fixed ${count}x: ${fix.bad.length > 10 ? '(multi-char)' : fix.bad} -> ${fix.good}`);
  }
}

fs.writeFileSync('index.html', html);
console.log(`\nTotal fixed: ${fixed} icons`);
