const { exec } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const files = [
  { src: 'global.js', dest: 'global.js' },
  { src: 'twt-shell.js', dest: 'twt-shell.js' },
  { src: 'worker.js', dest: 'worker.js' },
  { src: 'js/context-engine.js', dest: 'js/context-engine.js' },
];

const TERSER = path.join(ROOT, 'node_modules', '.bin', 'terser');

function minify(file) {
  return new Promise((resolve, reject) => {
    const cmd = `"${TERSER}" "${path.join(ROOT, file.src)}" -o "${path.join(ROOT, file.dest)}" --compress --mangle`;
    exec(cmd, { windowsHide: true }, (err, stdout, stderr) => {
      if (err) {
        console.error(`FAIL ${file.src}: ${stderr || err.message}`);
        return reject(err);
      }
      console.log(`OK ${file.src}`);
      resolve();
    });
  });
}

Promise.all(files.map(minify))
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
