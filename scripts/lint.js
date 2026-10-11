const fs = require('fs');
const path = require('path');

console.log('Running linter on project files...');

const requiredFiles = [
  'index.html',
  'kdes.in/index.html',
  'kdes.in/about.html',
  'kdes.in/catalogue.html',
  'kdes.in/contact.html'
];

let errors = 0;
let checked = 0;

for (const relPath of requiredFiles) {
  const fullPath = path.join(__dirname, '..', relPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`[FAIL] Missing expected file: ${relPath}`);
    errors++;
  } else {
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (!content.includes('<!DOCTYPE html>') && !content.includes('<!doctype html>')) {
        console.warn(`[WARN] ${relPath}: Missing standard <!DOCTYPE html> declaration.`);
      }
      checked++;
      console.log(`[PASS] ${relPath}`);
    } catch (err) {
      console.error(`[FAIL] Could not read ${relPath}: ${err.message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\nLinting finished with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log(`\nLint passed successfully (${checked} files verified).`);
  process.exit(0);
}
