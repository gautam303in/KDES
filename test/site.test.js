const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

test('root index.html should exist', () => {
  const filePath = path.join(rootDir, 'index.html');
  assert.strictEqual(fs.existsSync(filePath), true, 'index.html must exist');
});

test('kdes.in directory and main entry point should exist', () => {
  const mainDir = path.join(rootDir, 'kdes.in');
  const indexPath = path.join(mainDir, 'index.html');
  assert.strictEqual(fs.existsSync(mainDir), true, 'kdes.in directory must exist');
  assert.strictEqual(fs.existsSync(indexPath), true, 'kdes.in/index.html must exist');
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.strictEqual(content.includes('aeline-hero') || content.includes('hero-carousel-container'), true, 'index.html must contain hero section');
  assert.strictEqual(content.includes('1615457139_slide.jpg'), true, 'index.html must contain slide 1 image');
  assert.strictEqual(content.includes('1615289436_1614918171_one.png'), true, 'index.html must contain slide 2 image');
  assert.strictEqual(content.includes('1615272036_1614918224_two.png'), true, 'index.html must contain slide 3 image');
});

test('contact.html should exist and contain Registered and Office addresses', () => {
  const contactPath = path.join(rootDir, 'kdes.in', 'contact.html');
  assert.strictEqual(fs.existsSync(contactPath), true, 'contact.html must exist');
  const content = fs.readFileSync(contactPath, 'utf8');
  assert.strictEqual(content.includes('Meet Nagar'), true, 'contact.html must contain Meet Nagar registered address');
  assert.strictEqual(content.includes('Maujpur'), true, 'contact.html must contain Maujpur office address');
  assert.strictEqual(content.includes('9555498906'), true, 'contact.html must contain phone number');
  assert.strictEqual(content.includes('kdes2017@gmail.com'), true, 'contact.html must contain email address');
  assert.strictEqual(content.includes('maps.google.com/maps?q=K+D+Engineering+Solutions'), true, 'contact.html map iframe must pin K D Engineering Solutions');
  assert.strictEqual(content.includes('Krishna+Gali+number+6'), true, 'contact.html map iframe must pin Krishna Gali number 6');
});

test('critical asset directories should exist', () => {
  const cssDir = path.join(rootDir, 'kdes.in', 'css');
  const jsDir = path.join(rootDir, 'kdes.in', 'js');
  assert.strictEqual(fs.existsSync(cssDir), true, 'css folder must exist');
  assert.strictEqual(fs.existsSync(jsDir), true, 'js folder must exist');
});

test('navigation should have About as a submenu under Home', () => {
  const pages = ['index.html', 'contact.html', 'about.html', 'catalogue.html'];
  for (const page of pages) {
    const pagePath = path.join(rootDir, 'kdes.in', page);
    assert.strictEqual(fs.existsSync(pagePath), true, `${page} must exist`);
    const content = fs.readFileSync(pagePath, 'utf8');
    assert.strictEqual(content.includes('nav-item-dropdown'), true, `${page} must contain dropdowns in nav`);
    assert.strictEqual(content.includes('about.html') && content.includes('About Us'), true, `${page} must contain About Us inside submenu`);
  }
});

test('all product subcategory and detail pages should use modern design system without leaked db string', () => {
  const kdesDir = path.join(rootDir, 'kdes.in');
  const allFiles = fs.readdirSync(kdesDir).filter(f => f.startsWith('product-') && f.endsWith('.html'));
  assert.ok(allFiles.length >= 30, 'should have all product subcat and detail pages');

  for (const f of allFiles) {
    const content = fs.readFileSync(path.join(kdesDir, f), 'utf8');
    assert.strictEqual(content.includes('Database connected successfully'), false, `${f} must not contain leaked db string`);
    assert.strictEqual(content.includes('css/modern-revamp.css'), true, `${f} must use modern-revamp.css`);
    assert.strictEqual(content.includes('site-header'), true, `${f} must have site-header`);
    assert.strictEqual(content.includes('site-footer'), true, `${f} must have site-footer`);
    assert.strictEqual(content.includes('page-banner'), true, `${f} must have modern page-banner`);
    assert.strictEqual(content.includes('product-image/'), true, `${f} must have product images`);

    // Verify all referenced images exist on disk
    const imgMatches = content.matchAll(/src=["'](product-image\/[^"']+)["']/g);
    for (const m of imgMatches) {
      const imgPath = path.join(kdesDir, m[1]);
      assert.strictEqual(fs.existsSync(imgPath), true, `${f} references ${m[1]} which must exist on disk`);
    }
  }
});

test('master product directory should catalog all 25 instruments', () => {
  const masterPath = path.join(rootDir, 'kdes.in', 'product-subcata625.html');
  assert.strictEqual(fs.existsSync(masterPath), true, 'product-subcata625.html must exist');
  const content = fs.readFileSync(masterPath, 'utf8');
  assert.strictEqual(content.includes('25 Complete Instruments Catalogued'), true, 'Must display 25 instruments count');
  assert.strictEqual(content.includes('cat-filter-btn'), true, 'Must contain category filter tabs');

  const cardMatches = content.match(/class=["']aeline-prod-card/g);
  assert.strictEqual(cardMatches && cardMatches.length >= 25, true, 'Must contain at least 25 product cards');
});

test('homepage should contain all 8 subcategories and featured instruments showcase', () => {
  const indexPath = path.join(rootDir, 'kdes.in', 'index.html');
  const content = fs.readFileSync(indexPath, 'utf8');
  assert.strictEqual(content.includes('id="featured-products"'), true, 'index.html must have featured-products section');
  assert.strictEqual(content.includes('product-subcata625.html'), true, 'index.html must link to master directory');
  assert.strictEqual(content.includes('product-subcat52fd.html?pro_id=138'), true, 'index.html must link to Environmental Instruments');
  assert.strictEqual(content.includes('product-subcate473.html?pro_id=137'), true, 'index.html must link to Spares & Consumables');
  assert.strictEqual(content.includes('product-subcat6365.html?pro_id=140'), true, 'index.html must link to Calibration Services');
});

test('floating dock should be present with mode toggle (light, dark, system) above WhatsApp floating button', () => {
  const pagesToTest = ['index.html', 'about.html', 'contact.html', 'catalogue.html', 'product-subcata625.html'];
  const themeJsPath = path.join(rootDir, 'kdes.in', 'js', 'theme-toggle.js');
  assert.strictEqual(fs.existsSync(themeJsPath), true, 'theme-toggle.js script must exist');
  
  const themeJsContent = fs.readFileSync(themeJsPath, 'utf8');
  assert.strictEqual(themeJsContent.includes("'light'"), true, 'theme-toggle.js must support light mode');
  assert.strictEqual(themeJsContent.includes("'dark'"), true, 'theme-toggle.js must support dark mode');
  assert.strictEqual(themeJsContent.includes("'system'"), true, 'theme-toggle.js must support system mode');

  const cssPath = path.join(rootDir, 'kdes.in', 'css', 'modern-revamp.css');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  assert.strictEqual(cssContent.includes('.kdes-floating-dock'), true, 'CSS must style floating dock');
  assert.strictEqual(cssContent.includes('.whatsapp-floating'), true, 'CSS must style whatsapp floating button');
  assert.strictEqual(cssContent.includes('.theme-toggle-btn'), true, 'CSS must style theme toggle button');
  assert.strictEqual(cssContent.includes('[data-theme="dark"]'), true, 'CSS must provide dark mode styles');

  for (const page of pagesToTest) {
    const pagePath = path.join(rootDir, 'kdes.in', page);
    const content = fs.readFileSync(pagePath, 'utf8');
    assert.strictEqual(content.includes('kdes-floating-dock'), true, `${page} must contain .kdes-floating-dock`);
    assert.strictEqual(content.includes('id="themeToggleBtn"'), true, `${page} must contain #themeToggleBtn`);
    assert.strictEqual(content.includes('id="themeMenu"'), true, `${page} must contain #themeMenu`);
    assert.strictEqual(content.includes('data-mode="light"'), true, `${page} must have light mode button option`);
    assert.strictEqual(content.includes('data-mode="dark"'), true, `${page} must have dark mode button option`);
    assert.strictEqual(content.includes('data-mode="system"'), true, `${page} must have system mode button option`);
    assert.strictEqual(content.includes('whatsapp-floating'), true, `${page} must contain .whatsapp-floating`);
    assert.strictEqual(content.includes('whatsapp-label'), true, `${page} must contain .whatsapp-label`);
    assert.strictEqual(content.includes('Chat on WhatsApp'), true, `${page} must contain Chat on WhatsApp text`);
    assert.strictEqual(content.includes('js/theme-toggle.js'), true, `${page} must include theme-toggle.js`);
    
    // Verify theme toggle button is declared before (above in DOM flow) WhatsApp button inside the dock
    const themeIdx = content.indexOf('theme-toggle-wrapper');
    const waIdx = content.indexOf('whatsapp-floating');
    assert.strictEqual(themeIdx !== -1 && waIdx !== -1 && themeIdx < waIdx, true, `${page} theme toggle must be above WhatsApp button`);
  }
});

test('dark mode color scheme in modern-revamp.css should be fully configured', () => {
  const cssPath = path.join(rootDir, 'kdes.in', 'css', 'modern-revamp.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Verify dark tokens
  assert.strictEqual(css.includes('[data-theme="dark"]'), true, 'Must have [data-theme="dark"] selector');
  assert.strictEqual(css.includes('--ae-bg: #08130d;'), true, 'Must have dark background token');
  assert.strictEqual(css.includes('--ae-text-heading: #f8fafc;'), true, 'Must have crisp white heading token');
  assert.strictEqual(css.includes('--ae-text-body: #cbd5e1;'), true, 'Must have comfortable slate-sage body token');
  assert.strictEqual(css.includes('--ae-text-muted: #8fa699;'), true, 'Must have gentle muted sage token');
  assert.strictEqual(css.includes('--ae-lime: #4ade80;'), true, 'Must have luminous lime accent token');

  // Verify dark hero scrim override (preventing white flash)
  assert.strictEqual(css.includes('[data-theme="dark"] .hero-slide::before'), true, 'Must override hero slide scrim in dark mode');

  // Verify dark header, cards, spec tables, inputs, and category filter pills
  assert.strictEqual(css.includes('[data-theme="dark"] .site-header'), true, 'Must style site-header in dark mode');
  assert.strictEqual(css.includes('[data-theme="dark"] .aeline-prod-card'), true, 'Must style product cards in dark mode');
  assert.strictEqual(css.includes('[data-theme="dark"] .prod-tab-panel table'), true, 'Must style spec tables in dark mode');
  assert.strictEqual(css.includes('[data-theme="dark"] input'), true, 'Must style input fields in dark mode');
  assert.strictEqual(css.includes('[data-theme="dark"] .cat-filter-btn'), true, 'Must style category filter buttons in dark mode');
});

test('2nd level sub-menu for respective models should exist under 1st product submenu', () => {
  const pages = ['index.html', 'about.html', 'catalogue.html', 'contact.html', 'product-subcata625.html'];
  const cssPath = path.join(rootDir, 'kdes.in', 'css', 'modern-revamp.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  // Verify CSS styles for nested flyout submenus
  assert.strictEqual(css.includes('.nav-subdropdown-item'), true, 'CSS must style .nav-subdropdown-item');
  assert.strictEqual(css.includes('.nav-subdropdown-menu'), true, 'CSS must style .nav-subdropdown-menu');
  assert.strictEqual(css.includes('.nav-subdropdown-trigger'), true, 'CSS must style .nav-subdropdown-trigger');

  for (const page of pages) {
    const pagePath = path.join(rootDir, 'kdes.in', page);
    const content = fs.readFileSync(pagePath, 'utf8');

    // Verify sub-dropdown wrappers exist in nav
    assert.strictEqual(content.includes('nav-subdropdown-item'), true, `${page} must contain .nav-subdropdown-item`);
    assert.strictEqual(content.includes('nav-subdropdown-menu'), true, `${page} must contain .nav-subdropdown-menu`);
    assert.strictEqual(content.includes('nav-subdropdown-trigger'), true, `${page} must contain .nav-subdropdown-trigger`);

    // Verify models from different categories appear in 2nd level menus
    assert.strictEqual(content.includes('Conductivity Meter'), true, `${page} must contain Conductivity Meter in Lab Instruments submenu`);
    assert.strictEqual(content.includes('product-details3e33.html?pro_id=125'), true, `${page} must link to Conductivity Meter`);

    assert.strictEqual(content.includes('Rtu Unit For Water Flow Meter'), true, `${page} must contain RTU Unit in Hydrological submenu`);
    assert.strictEqual(content.includes('product-detailsd6c5.html?pro_id=141'), true, `${page} must link to RTU Unit`);

    assert.strictEqual(content.includes('Handy Sampler Gti - 221'), true, `${page} must contain Handy Sampler in Air Quality submenu`);
    assert.strictEqual(content.includes('product-detailse473.html?pro_id=137'), true, `${page} must link to Handy Sampler`);

    assert.strictEqual(content.includes('Biological Sefty Cabinet'), true, `${page} must contain Biological Safety Cabinet in Water Testing submenu`);
    assert.strictEqual(content.includes('product-details08ce.html?pro_id=131'), true, `${page} must link to Biological Safety Cabinet`);

    assert.strictEqual(content.includes('Autoclave Vertical'), true, `${page} must contain Autoclave Vertical in Environmental submenu`);
    assert.strictEqual(content.includes('product-details5a9a.html?pro_id=123'), true, `${page} must link to Autoclave Vertical`);

    assert.strictEqual(content.includes('Laminar Air Flow Cabinet'), true, `${page} must contain Laminar Air Flow Cabinet in Spares submenu`);
    assert.strictEqual(content.includes('product-details2626.html?pro_id=121'), true, `${page} must link to Laminar Cabinet`);

    assert.strictEqual(content.includes('Heating Mantle'), true, `${page} must contain Heating Mantle in Calibration submenu`);
    assert.strictEqual(content.includes('product-details8d8a.html?pro_id=128'), true, `${page} must link to Heating Mantle`);

    assert.strictEqual(content.includes('Muffle Furnace'), true, `${page} must contain Muffle Furnace in Servicing submenu`);
    assert.strictEqual(content.includes('product-detailsf939.html?pro_id=135'), true, `${page} must link to Muffle Furnace`);
  }
});

test('product dropdown with all 25 models should exist across contact us form, request a quote, and submit for specification', () => {
  const all25Products = [
    'Conductivity Meter',
    'Curculating Water Bath',
    'Digital Do Meter',
    'Rtu Unit For Water Flow Meter',
    'Ground Water Level Recorder',
    'Electromagnetic Water Flowermeter',
    'Handy Sampler Gti - 221',
    'High Volume Sampler Gti 251',
    'Respirable Dust Sampler Apm 151 Bl',
    'Stack Sampler Gti 121',
    'Biological Sefty Cabinet',
    'Cod Digestion Apparatus',
    'Colony Counter Digital',
    'All Glass Distillation Unit, With Quartz Heater Tube, Vertical Type',
    'Autoclave Vertical',
    'B.o.d. Incubators',
    'Ice Flaking Machine',
    'Laboratory Stirrer',
    'Laminar Air Flow Cabinet (vertical)',
    'Heating Mantle',
    'Hot Plate Rectangular',
    'Hot Plate Round',
    'Magnetic Stirriers',
    'Muffle Furnace',
    'Oil Bath High Temperature'
  ];

  // 1. Contact Us form on contact.html
  const contactPath = path.join(rootDir, 'kdes.in', 'contact.html');
  const contactHtml = fs.readFileSync(contactPath, 'utf8');
  assert.strictEqual(contactHtml.includes('id="c_product"'), true, 'contact.html must have #c_product select');
  assert.strictEqual(contactHtml.includes('name="product"'), true, 'contact.html must have name="product"');
  for (const prod of all25Products) {
    assert.strictEqual(contactHtml.includes(`value="${prod}"`), true, `contact.html must include option for ${prod}`);
  }

  // 2. Request a Quote on index.html (#quote)
  const indexPath = path.join(rootDir, 'kdes.in', 'index.html');
  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  assert.strictEqual(indexHtml.includes('id="quote_product"'), true, 'index.html must have #quote_product select');
  assert.strictEqual(indexHtml.includes('name="product"'), true, 'index.html must have name="product"');
  for (const prod of all25Products) {
    assert.strictEqual(indexHtml.includes(`value="${prod}"`), true, `index.html must include option for ${prod}`);
  }

  // 3. Submit for Specification across all 25 product detail pages
  const kdesDir = path.join(rootDir, 'kdes.in');
  const detailFiles = fs.readdirSync(kdesDir).filter(f => f.startsWith('product-details') && f.endsWith('.html'));
  assert.strictEqual(detailFiles.length, 25, 'Must have exactly 25 product detail pages');

  for (const f of detailFiles) {
    const detailHtml = fs.readFileSync(path.join(kdesDir, f), 'utf8');
    assert.strictEqual(detailHtml.includes('id="submit-specification"'), true, `${f} must contain #submit-specification section`);
    assert.strictEqual(detailHtml.includes('id="spec_product"'), true, `${f} must contain #spec_product select`);
    assert.strictEqual(detailHtml.includes('name="product"'), true, `${f} must contain name="product"`);
    assert.strictEqual(detailHtml.includes('selected>'), true, `${f} must have pre-selected product option`);

    // Verify all 25 products exist in the dropdown
    for (const prod of all25Products) {
      assert.strictEqual(detailHtml.includes(`value="${prod}"`), true, `${f} dropdown must contain ${prod}`);
    }
  }

  // 4. CSS styling in modern-revamp.css
  const cssPath = path.join(rootDir, 'kdes.in', 'css', 'modern-revamp.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  assert.strictEqual(css.includes('.quote-form-card select'), true, 'CSS must style .quote-form-card select');
  assert.strictEqual(css.includes('[data-theme="dark"] .quote-form-card select'), true, 'CSS must style select in dark mode');
  assert.strictEqual(css.includes('[data-theme="dark"] .quote-form-card select optgroup'), true, 'CSS must style optgroup in dark mode');
});

test('email handler sendmail.php and all three submission forms should forward details to kdes2017@gmail.com', () => {
  const kdesDir = path.join(rootDir, 'kdes.in');

  // 1. sendmail.php must exist and be configured for kdes2017@gmail.com
  const phpPath = path.join(kdesDir, 'sendmail.php');
  assert.strictEqual(fs.existsSync(phpPath), true, 'kdes.in/sendmail.php must exist');
  const phpContent = fs.readFileSync(phpPath, 'utf8');
  assert.strictEqual(phpContent.includes('kdes2017@gmail.com'), true, 'sendmail.php recipient must be kdes2017@gmail.com');
  assert.strictEqual(phpContent.includes('fname'), true, 'sendmail.php must handle fname');
  assert.strictEqual(phpContent.includes('lname'), true, 'sendmail.php must handle lname');
  assert.strictEqual(phpContent.includes('email'), true, 'sendmail.php must handle email');
  assert.strictEqual(phpContent.includes('phone'), true, 'sendmail.php must handle phone');
  assert.strictEqual(phpContent.includes('product'), true, 'sendmail.php must handle product');
  assert.strictEqual(phpContent.includes('subject'), true, 'sendmail.php must handle subject');
  assert.strictEqual(phpContent.includes('c_comment'), true, 'sendmail.php must handle c_comment');
  assert.strictEqual(phpContent.includes('mail('), true, 'sendmail.php must call mail()');

  // 2. Client-side form-handler.js
  const handlerJsPath = path.join(kdesDir, 'js', 'form-handler.js');
  assert.strictEqual(fs.existsSync(handlerJsPath), true, 'js/form-handler.js must exist');
  const handlerContent = fs.readFileSync(handlerJsPath, 'utf8');
  assert.strictEqual(handlerContent.includes('kdes2017@gmail.com'), true, 'form-handler.js must target kdes2017@gmail.com');

  // 3. Form 1: "Send Message Now" on contact.html
  const contactPath = path.join(kdesDir, 'contact.html');
  const contactContent = fs.readFileSync(contactPath, 'utf8');
  assert.strictEqual(contactContent.includes('Send Message Now'), true, 'contact.html must have "Send Message Now" button');
  assert.strictEqual(contactContent.includes('action="sendmail.php"'), true, 'contact.html must post to sendmail.php');
  assert.strictEqual(contactContent.includes('name="to_email" value="kdes2017@gmail.com"'), true, 'contact.html must include to_email hidden input');
  assert.strictEqual(contactContent.includes('name="fname"'), true, 'contact.html must include fname');
  assert.strictEqual(contactContent.includes('name="lname"'), true, 'contact.html must include lname');
  assert.strictEqual(contactContent.includes('name="email"'), true, 'contact.html must include email');
  assert.strictEqual(contactContent.includes('name="phone"'), true, 'contact.html must include phone');
  assert.strictEqual(contactContent.includes('name="product"'), true, 'contact.html must include product');
  assert.strictEqual(contactContent.includes('name="subject"'), true, 'contact.html must include subject');
  assert.strictEqual(contactContent.includes('name="c_comment"'), true, 'contact.html must include c_comment');
  assert.strictEqual(contactContent.includes('js/form-handler.js'), true, 'contact.html must load form-handler.js');

  // 4. Form 2: "Submit Request" on index.html
  const indexPath = path.join(kdesDir, 'index.html');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  assert.strictEqual(indexContent.includes('Submit Request'), true, 'index.html must have "Submit Request" button');
  assert.strictEqual(indexContent.includes('action="sendmail.php"'), true, 'index.html must post to sendmail.php');
  assert.strictEqual(indexContent.includes('name="to_email" value="kdes2017@gmail.com"'), true, 'index.html must include to_email hidden input');
  assert.strictEqual(indexContent.includes('name="fname"'), true, 'index.html must include fname');
  assert.strictEqual(indexContent.includes('name="lname"'), true, 'index.html must include lname');
  assert.strictEqual(indexContent.includes('name="email"'), true, 'index.html must include email');
  assert.strictEqual(indexContent.includes('name="phone"'), true, 'index.html must include phone');
  assert.strictEqual(indexContent.includes('name="product"'), true, 'index.html must include product');
  assert.strictEqual(indexContent.includes('name="subject"'), true, 'index.html must include subject');
  assert.strictEqual(indexContent.includes('name="c_comment"'), true, 'index.html must include c_comment');
  assert.strictEqual(indexContent.includes('js/form-handler.js'), true, 'index.html must load form-handler.js');

  // 5. Form 3: "Submit Specification & Request Quote" across all 25 detail pages
  const detailFiles = fs.readdirSync(kdesDir).filter(f => f.startsWith('product-details') && f.endsWith('.html'));
  assert.strictEqual(detailFiles.length, 25, 'Must have 25 detail pages');
  for (const f of detailFiles) {
    const detailContent = fs.readFileSync(path.join(kdesDir, f), 'utf8');
    assert.strictEqual(
      detailContent.includes('Submit Specification & Request Quote') || detailContent.includes('Submit Specification &amp; Request Quote'),
      true,
      `${f} must have "Submit Specification & Request Quote" button`
    );
    assert.strictEqual(detailContent.includes('action="sendmail.php"'), true, `${f} must post to sendmail.php`);
    assert.strictEqual(detailContent.includes('name="to_email" value="kdes2017@gmail.com"'), true, `${f} must include to_email hidden input`);
    assert.strictEqual(detailContent.includes('name="fname"'), true, `${f} must include fname`);
    assert.strictEqual(detailContent.includes('name="lname"'), true, `${f} must include lname`);
    assert.strictEqual(detailContent.includes('name="email"'), true, `${f} must include email`);
    assert.strictEqual(detailContent.includes('name="phone"'), true, `${f} must include phone`);
    assert.strictEqual(detailContent.includes('name="product"'), true, `${f} must include product`);
    assert.strictEqual(detailContent.includes('name="subject"'), true, `${f} must include subject`);
    assert.strictEqual(detailContent.includes('name="c_comment"'), true, `${f} must include c_comment`);
    assert.strictEqual(detailContent.includes('js/form-handler.js'), true, `${f} must load form-handler.js`);
  }
});






