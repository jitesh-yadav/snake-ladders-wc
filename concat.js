const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './dist/pi-wc/runtime.js',
    './dist/pi-wc/polyfills.js',
    './dist/pi-wc/main.js'
  ];

  await fs.ensureDir('publish');
  await concat(files, 'publish/pi-wc.js');
})();