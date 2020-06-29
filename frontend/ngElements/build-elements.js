const fs = require('fs-extra');
const concat = require('concat');

(async function build() {
  const files = [
    './build/runtime-es2015.js',
    './build/polyfills-es2015.js',
    './build/main-es2015.js'
  ];

  await fs.ensureDir('elements');
  await concat(files, 'elements/ng-web-elements.js');
})();