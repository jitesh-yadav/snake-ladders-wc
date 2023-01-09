const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/snake-ladders-wc/runtime.js',
    './dist/snake-ladders-wc/polyfills.js',
    './dist/snake-ladders-wc/main.js'
  ];

  await fs.ensureDir('publish');
  await concat(files, 'publish/snake-ladders-wc.js');
})();