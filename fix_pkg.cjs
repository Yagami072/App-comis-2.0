const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.scripts.build = "vite build";
pkg.scripts.start = "node server.ts";
pkg.scripts.clean = "rm -rf dist";
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
console.log('done');
