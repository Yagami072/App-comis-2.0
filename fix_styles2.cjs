const fs = require('fs');
const files = [
  'src/components/Summary.tsx',
  'src/components/EditSales.tsx',
  'src/components/CatalogManager.tsx'
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/\\\[\\#0a0a0a\\\]/g, '[#0a0a0a]');
  content = content.replace(/border-\[#3f3f46\]\/30/g, 'border-white/10');
  content = content.replace(/border-\[#3f3f46\]\/40/g, 'border-white/10');
  content = content.replace(/hover:bg-zinc-900\/40\/50/g, 'hover:bg-white/5');
  fs.writeFileSync(file, content);
}
console.log('Fix 2 Done!');
