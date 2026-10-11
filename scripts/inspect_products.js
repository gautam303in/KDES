const fs = require('fs');
const path = require('path');

const kdesDir = path.join(__dirname, 'orig_raw');
const detailFiles = fs.readdirSync(kdesDir).filter(f => f.startsWith('product-details') && f.endsWith('.html'));
const subcatFiles = fs.readdirSync(kdesDir).filter(f => f.startsWith('product-subcat') && f.endsWith('.html'));

console.log(`Detail files count: ${detailFiles.length}`);
console.log(`Subcat files count: ${subcatFiles.length}`);

for (const f of detailFiles) {
  const content = fs.readFileSync(path.join(kdesDir, f), 'utf8');
  const titleMatch = content.match(/<div class=["']product-details-title["']>\s*<h1>(.*?)<\/h1>/s);
  const title = titleMatch ? titleMatch[1].trim() : 'NO_TITLE';
  const catMatch = content.match(/<span>Category:\s*<\/span>\s*<a>(.*?)<\/a>/s);
  const cat = catMatch ? catMatch[1].trim() : 'NO_CAT';
  const imgMatches = [...new Set([...content.matchAll(/product-image\/[a-zA-Z0-9_\.]+/g)].map(m => m[0]))];
  const hasDesc = content.includes('id="home1"');
  const hasSpec = content.includes('id="menu1"');
  const hasTable = content.includes('<table');
  console.log(`${f} -> [${cat}] "${title}" (imgs: ${imgMatches.length}, table: ${hasTable}, desc: ${hasDesc}, spec: ${hasSpec})`);
}

console.log('\n--- SUBCAT FILES ---');
for (const f of subcatFiles) {
  const content = fs.readFileSync(path.join(kdesDir, f), 'utf8');
  const proTitles = [...content.matchAll(/<h4 class=["']pro-title["']>\s*<a[^>]*>([\s\S]*?)<\/a>/g)].map(m => m[1].trim());
  const catMatch = content.match(/<span class=["']pro-cat["']>\s*<a[^>]*>([\s\S]*?)<\/a>/);
  const cat = catMatch ? catMatch[1].trim() : 'UNKNOWN';
  console.log(`${f} [${cat}]: ${proTitles.join(' | ')}`);
}
