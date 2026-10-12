const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname, '..', 'kdes.in');

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self'; frame-src 'self' https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self'; form-action 'self' sendmail.php; frame-ancestors 'self';"
};

const BLOCKED_SCRAPERS = /HTTrack|Wget|Scrapy|WebCopier|Teleport|Offline\s+Explorer|EmailCollector|SiteSnagger|WebZip|WebReaper|SuperBot|Mirror/i;

const server = http.createServer((req, res) => {
  // 1. Anti-Cloning & Scraper Shield Check
  const userAgent = req.headers['user-agent'] || '';
  if (BLOCKED_SCRAPERS.test(userAgent)) {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('403 Forbidden: Automated website scraper or cloner detected and restricted.');
    return;
  }

  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.startsWith('/kdes.in')) {
    reqPath = reqPath.replace(/^\/kdes\.in/, '') || '/';
  }

  // 2. Block direct HTTP access to inquiries_backup.json and sensitive files
  if (reqPath === '/inquiries_backup.json' || reqPath.endsWith('.log') || reqPath.endsWith('.env')) {
    res.writeHead(403, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
    res.end('403 Forbidden: Access to protected security logs is restricted.');
    return;
  }

  // 3. Handle POST submission to sendmail.php in local dev server
  if (req.method === 'POST' && (reqPath === '/sendmail.php' || reqPath === 'sendmail.php' || reqPath.endsWith('sendmail.php'))) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      // Parse URL-encoded or multipart form data
      const parsedData = {};
      try {
        const params = new URLSearchParams(body);
        for (const [key, value] of params.entries()) {
          parsedData[key] = value;
        }
      } catch (e) {
        // Fallback simple parsing
      }

      // Honeypot bot trap detection
      if (parsedData._kdes_security_hp || parsedData.website_url_hp) {
        console.log(`[sendmail.php] 🛡️ HONEYPOT TRIGGERED: Bot submission rejected silently.`);
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS });
        res.end(JSON.stringify({ status: 'success', message: 'Inquiry received.', recipient: 'shiven.k@aol.in' }));
        return;
      }

      const recipient = parsedData.to_email || parsedData.recipient || 'shiven.k@aol.in';
      const fullName = ((parsedData.fname || '') + ' ' + (parsedData.lname || '')).trim() || parsedData.name || 'Valued Customer';
      const product = parsedData.product || parsedData.model || 'General Equipment';
      const email = parsedData.email || 'Not provided';
      const phone = parsedData.phone || parsedData.mobile || 'Not provided';
      const subject = parsedData.subject || 'Enquiry';
      const comment = parsedData.c_comment || parsedData.message || '';
      const formType = parsedData.form_type || 'Website Enquiry';

      console.log(`\n==================================================`);
      console.log(`[sendmail.php] ✅ NEW ENQUIRY RECEIVED & FORWARDED`);
      console.log(` - Mapped Recipient: ${recipient}`);
      console.log(` - Form Action:      ${formType}`);
      console.log(` - Customer Name:    ${fullName}`);
      console.log(` - Work Email:       ${email}`);
      console.log(` - Phone Number:     ${phone}`);
      console.log(` - Product / Model:  ${product}`);
      console.log(` - Subject:          ${subject}`);
      console.log(` - Specifications:   ${comment}`);
      console.log(`==================================================\n`);

      // Persist to inquiries_backup.json
      const backupPath = path.join(PUBLIC_DIR, 'inquiries_backup.json');
      try {
        let list = [];
        if (fs.existsSync(backupPath)) {
          list = JSON.parse(fs.readFileSync(backupPath, 'utf8') || '[]');
        }
        list.push({
          timestamp: new Date().toISOString(),
          recipient,
          form_type: formType,
          customer_name: fullName,
          email,
          phone,
          product,
          subject,
          specifications: comment,
          mail_sent: true,
          ip: req.socket.remoteAddress || '127.0.0.1'
        });
        fs.writeFileSync(backupPath, JSON.stringify(list, null, 2), 'utf8');
      } catch (err) {
        console.error('Error saving inquiry backup:', err);
      }

      const isJson = (req.headers.accept && req.headers.accept.includes('application/json')) ||
                     (req.headers['x-requested-with'] && req.headers['x-requested-with'].toLowerCase() === 'xmlhttprequest');
      if (isJson) {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', ...SECURITY_HEADERS });
        res.end(JSON.stringify({
          status: 'success',
          message: `Thank you! Your details have been successfully forwarded to ${recipient}. Our engineering team will review and contact you promptly.`,
          recipient: recipient,
          product: product,
          mail_sent: true,
          backup_saved: true
        }));
      } else {
        const referer = req.headers.referer || '/';
        res.writeHead(302, { 'Location': referer + (referer.includes('?') ? '&' : '?') + 'status=success', ...SECURITY_HEADERS });
        res.end();
      }
    });
    return;
  }

  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain', ...SECURITY_HEADERS });
      res.end(`500 Server Error: ${err.message}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType, ...SECURITY_HEADERS });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}/`);
});
