const fs = require('fs');
const path = require('path');

const kdesDir = path.resolve(__dirname, '..', 'kdes.in');
const htmlFiles = fs.readdirSync(kdesDir).filter(f => f.endsWith('.html'));

console.log(`Auditing and applying cybersecurity hardening across ${htmlFiles.length} HTML files...`);

const securityMetas = `    <meta http-equiv="X-Content-Type-Options" content="nosniff">
    <meta http-equiv="X-Frame-Options" content="SAMEORIGIN">
    <meta name="referrer" content="strict-origin-when-cross-origin">`;

const honeypotField = `                        <div style="display:none!important;position:absolute!important;left:-9999px!important" aria-hidden="true">
                            <input type="text" name="_kdes_security_hp" tabindex="-1" autocomplete="off" value="">
                        </div>`;

let updatedCount = 0;

for (const file of htmlFiles) {
  const filePath = path.join(kdesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Inject security meta tags if not already present
  if (!content.includes('http-equiv="X-Frame-Options"')) {
    if (content.includes('<meta name="viewport"')) {
      content = content.replace(/(<meta name="viewport"[^>]*>)/i, `$1\n${securityMetas}`);
      changed = true;
    } else if (content.includes('</head>')) {
      content = content.replace('</head>', `${securityMetas}\n</head>`);
      changed = true;
    }
  }

  // 2. Inject honeypot into forms if form exists and honeypot not present
  if (content.includes('action="sendmail.php"') && !content.includes('name="_kdes_security_hp"')) {
    content = content.replace(/(<input type="hidden" name="form_type"[^>]*>)/i, `$1\n${honeypotField}`);
    changed = true;
  }

  // 3. Inject kdes-security.js before </body> if not present
  if (!content.includes('js/kdes-security.js')) {
    if (content.includes('</body>')) {
      content = content.replace('</body>', '    <script src="js/kdes-security.js"></script>\n</body>');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    updatedCount++;
  }
}

console.log(`[OK] Hardening applied to ${updatedCount} files.`);
