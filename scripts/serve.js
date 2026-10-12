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

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);

  // Handle POST submission to sendmail.php in local dev server
  if (req.method === 'POST' && (reqPath === '/sendmail.php' || reqPath === 'sendmail.php')) {
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
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
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
        res.writeHead(302, { 'Location': referer + (referer.includes('?') ? '&' : '?') + 'status=success' });
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
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`500 Server Error: ${err.message}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Development server running at http://localhost:${PORT}/`);
});
