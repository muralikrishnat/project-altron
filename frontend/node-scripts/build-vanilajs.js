const fs = require('fs-extra');
const concat = require('concat');
const path = require('path');

let folderToBuild = path.join(__dirname, '..', 'vanilajs-strategy');
(async function build() {
  const files = [
    folderToBuild + '/js/comps/items-cart.js',
    folderToBuild + '/js/comps/inventory-items.js',
    folderToBuild + '/js/comps/inventory-detail.js',
    folderToBuild + '/js/pubsub.service.js',
    folderToBuild + '/js/store.service.js',
    folderToBuild + '/js/dynamic-strategy.js'
  ];

  await fs.ensureDir('vanilajs-build/js');
  await concat(files, 'vanilajs-build/js/vanilajs-bundle.js');
  console.log("JS Build is generated");

  const cssFiles = [
    folderToBuild + '/css/all.css',
    folderToBuild + '/css/vendor/tailwind.min.css',
    folderToBuild + '/css/dynamic-strategy.css'
  ];
  await fs.ensureDir('vanilajs-build/css');
  await concat(files, 'vanilajs-build/css/vanilajs-bundle.css');
  console.log("CSS Build is generated");
})();
