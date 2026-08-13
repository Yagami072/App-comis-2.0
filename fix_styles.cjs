const fs = require('fs');
const files = [
  'src/components/Summary.tsx',
  'src/components/EditSales.tsx',
  'src/components/CatalogManager.tsx'
];
const replacements = [
  { search: /#1d1d1f/g, replace: '#f4f4f5' },
  { search: /#86868b/g, replace: '#71717a' },
  { search: /#d2d2d7/g, replace: '#3f3f46' },
  { search: /bg-\[#f5f5f7\]/g, replace: 'bg-zinc-900/40' },
  { search: /bg-\[#e3e3e8\]\/50/g, replace: 'bg-zinc-900/60' },
  { search: /bg-white/g, replace: 'bg-[#0a0a0a]' },
  { search: /bg-\[#0071e3\]/g, replace: 'bg-zinc-100' },
  { search: /text-white/g, replace: 'text-black' },
  { search: /hover:bg-\[#0077ed\]/g, replace: 'hover:bg-zinc-300' },
  { search: /font-semibold/g, replace: 'font-serif tracking-wide' },
  { search: /#0071e3/g, replace: '#fafafa' },
  { search: /text-\[#fafafa\]/g, replace: 'text-zinc-100' }
];
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  for (const { search, replace } of replacements) {
    content = content.replace(search, replace);
  }
  fs.writeFileSync(file, content);
}
console.log('Done!');
