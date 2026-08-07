const fs=require('fs');
const path=require('path');

// Find ALL article HTML files in root AND PUBLIC
const rootDirs = fs.readdirSync('.').filter(f => fs.statSync(f).isDirectory() && !f.startsWith('.') && f !== 'node_modules');
const allFiles = [];

for (const dir of rootDirs) {
  const dirPath = './' + dir;
  const htmlFiles = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('.html'))
    .map(f => path.join(dirPath, f));
  allFiles.push(...htmlFiles);
}

let fixed = 0;
for (const file of allFiles) {
  let c = fs.readFileSync(file, 'utf-8');
  let changed = false;

  // Fix 1: Triple </div> before </article>
  const triplePattern = /<\/div>\s*<\/div>\s*<\/div>\s*<\/article>/;
  if (triplePattern.test(c)) {
    c = c.replace(triplePattern, '</div>\n    </article>');
    changed = true;
  }

  // Fix 2: Double </div> before </article>
  const doublePattern = /<\/div>\s*<\/div>\s*<\/article>/;
  if (doublePattern.test(c)) {
    c = c.replace(doublePattern, '</div>\n    </article>');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, c);
    fixed++;
  }
}

console.log('Fixed ' + fixed + ' article files');

// Fix specific index.html files with form issues
const indexFixes = [
  {
    file: 'PUBLIC/ai-text-humanizer-helper/index.html',
    search: '</script> <link rel="stylesheet" href="../styles.css"> <link rel="stylesheet" href="../global.css"> </head> <body',
    replace: '</script>\n  <link rel="stylesheet" href="../styles.css">\n  <link rel="stylesheet" href="../global.css">\n</head>\n<body'
  },
  {
    file: 'PUBLIC/base64-encoder-decoder/index.html',
    search: '</script> <link rel="stylesheet" href="../styles.css"> <link rel="stylesheet" href="../global.css"> </head> <body',
    replace: '</script>\n  <link rel="stylesheet" href="../styles.css">\n  <link rel="stylesheet" href="../global.css">\n</head>\n<body'
  }
];

let indexFixed = 0;
for (const fix of indexFixes) {
  if (fs.existsSync(fix.file)) {
    let c = fs.readFileSync(fix.file, 'utf-8');
    if (c.includes(fix.search)) {
      c = c.replace(fix.search, fix.replace);
      fs.writeFileSync(fix.file, c);
      indexFixed++;
      console.log('Fixed index: ' + fix.file);
    }
  }
}

console.log('Fixed ' + indexFixed + ' index files');
