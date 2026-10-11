const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'kdes.in', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// Remove old #ckk ul li style and script prepender
content = content.replace(/<style type="text\/css">\s*#ckk ul li i[\s\S]*?<\/script>/, '');

// Clean up duplicate empty lines
content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Cleaned up script and styles.');
