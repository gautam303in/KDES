const fs = require('fs');
const path = require('path');

const kdesDir = path.join(__dirname, '..', 'kdes.in');
const targetFiles = [
  'index.html',
  'about.html',
  'catalogue.html',
  'contact.html',
  'exhibition.html',
  'videos.html'
];

const newNavDropdown = `                <div class="nav-item-dropdown">
                    <a href="product-subcata625.html">Products <i class="fas fa-chevron-down" style="font-size:10px;margin-left:4px"></i></a>
                    <div class="nav-dropdown-menu">
                        <a href="product-subcata625.html" style="font-weight:700;color:var(--ae-forest);border-bottom:1px solid rgba(15,36,26,0.08);padding-bottom:10px;margin-bottom:6px"><i class="fas fa-th-large" style="margin-right:6px"></i> All Products (Master Directory) <i class="fas fa-chevron-right" style="font-size:11px"></i></a>
                        
                        <!-- 1. Lab Instruments -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcatddfa.html?pro_id=139" class="nav-subdropdown-trigger">
                                <span>Lab Instruments</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-details3e33.html?pro_id=125"><span>Conductivity Meter</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details5c30.html?pro_id=126"><span>Curculating Water Bath</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details1fc4.html?pro_id=127"><span>Digital Do Meter</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcatddfa.html?pro_id=139" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 2. Hydrological Products -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcatd6c5.html?pro_id=141" class="nav-subdropdown-trigger">
                                <span>Hydrological Products</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-detailsd6c5.html?pro_id=141"><span>Rtu Unit For Water Flow Meter</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsbb3c.html?pro_id=142"><span>Ground Water Level Recorder</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details4414.html?pro_id=143"><span>Electromagnetic Water Flowermeter</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcatd6c5.html?pro_id=141" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 3. Air Quality Equipment -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcatbb3c.html?pro_id=142" class="nav-subdropdown-trigger">
                                <span>Air Quality Equipment</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-detailse473.html?pro_id=137"><span>Handy Sampler Gti - 221</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details52fd.html?pro_id=138"><span>High Volume Sampler Gti 251</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsddfa.html?pro_id=139"><span>Respirable Dust Sampler Apm 151 Bl</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details6365.html?pro_id=140"><span>Stack Sampler Gti 121</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcatbb3c.html?pro_id=142" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 4. Water Testing Instruments -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcat4414.html?pro_id=143" class="nav-subdropdown-trigger">
                                <span>Water Testing Instruments</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-details08ce.html?pro_id=131"><span>Biological Sefty Cabinet</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsc587.html?pro_id=132"><span>Cod Digestion Apparatus</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details7e56.html?pro_id=133"><span>Colony Counter Digital</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcat4414.html?pro_id=143" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 5. Environmental Instruments -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcat52fd.html?pro_id=138" class="nav-subdropdown-trigger">
                                <span>Environmental Instruments</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-details47bd.html?pro_id=122"><span>All Glass Distillation Unit</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details5a9a.html?pro_id=123"><span>Autoclave Vertical</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsb3a9.html?pro_id=124"><span>B.o.d. Incubators</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcat52fd.html?pro_id=138" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 6. Spare & Consumables -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcate473.html?pro_id=137" class="nav-subdropdown-trigger">
                                <span>Spare &amp; Consumables</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-detailsea94.html?pro_id=119"><span>Ice Flaking Machine</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsbe7e.html?pro_id=120"><span>Laboratory Stirrer</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details2626.html?pro_id=121"><span>Laminar Air Flow Cabinet</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcate473.html?pro_id=137" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 7. Calibration Services -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcat6365.html?pro_id=140" class="nav-subdropdown-trigger">
                                <span>Calibration Services</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-details8d8a.html?pro_id=128"><span>Heating Mantle</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsb6b8.html?pro_id=129"><span>Hot Plate Rectangular</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details99c7.html?pro_id=130"><span>Hot Plate Round</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcat6365.html?pro_id=140" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>

                        <!-- 8. Servicing & Maintenance -->
                        <div class="nav-subdropdown-item">
                            <a href="product-subcat2209.html?pro_id=144" class="nav-subdropdown-trigger">
                                <span>Servicing &amp; Maintenance</span>
                                <i class="fas fa-chevron-right sub-chevron"></i>
                            </a>
                            <div class="nav-subdropdown-menu">
                                <a href="product-details6590.html?pro_id=134"><span>Magnetic Stirriers</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-detailsf939.html?pro_id=135"><span>Muffle Furnace</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <a href="product-details02c7.html?pro_id=136"><span>Oil Bath High Temperature</span><i class="fas fa-chevron-right sub-arrow"></i></a>
                                <div class="nav-subdropdown-divider"></div>
                                <a href="product-subcat2209.html?pro_id=144" class="nav-subdropdown-viewall"><span>Explore All Models &rarr;</span></a>
                            </div>
                        </div>
                    </div>
                </div>`;

const newFooterCategories = `                <!-- Col 3: Categories / Services -->
                <div class="footer-col">
                    <h4>Categories</h4>
                    <ul class="footer-links-list">
                        <li><a href="product-subcata625.html"><strong>All Products (25 Items)</strong></a></li>
                        <li><a href="product-subcatddfa.html?pro_id=139">Lab Instruments</a></li>
                        <li><a href="product-subcatd6c5.html?pro_id=141">Hydrological Telemetry</a></li>
                        <li><a href="product-subcatbb3c.html?pro_id=142">Air Quality Sampling</a></li>
                        <li><a href="product-subcat4414.html?pro_id=143">Water Testing Systems</a></li>
                        <li><a href="product-subcat52fd.html?pro_id=138">Environmental Instruments</a></li>
                        <li><a href="product-subcate473.html?pro_id=137">Lab Spares &amp; Consumables</a></li>
                        <li><a href="product-subcat6365.html?pro_id=140">Calibration Services</a></li>
                        <li><a href="product-subcat2209.html?pro_id=144">Servicing &amp; Maintenance</a></li>
                    </ul>
                </div>`;

const newFloatingDock = `    <!-- Floating Action Dock: Theme Mode Toggle & WhatsApp CTA -->
    <div class="kdes-floating-dock" id="kdesFloatingDock" aria-label="Quick Actions">
        <!-- Theme Mode Toggle Button (Above WhatsApp) -->
        <div class="theme-toggle-wrapper">
            <button class="theme-toggle-btn" id="themeToggleBtn" type="button" aria-label="Switch Color Theme" title="Theme (Light, Dark, System)" aria-haspopup="true" aria-expanded="false">
                <i class="fas fa-sun theme-icon theme-icon-light" aria-hidden="true"></i>
                <i class="fas fa-moon theme-icon theme-icon-dark" aria-hidden="true"></i>
                <i class="fas fa-desktop theme-icon theme-icon-system" aria-hidden="true"></i>
                <span class="floating-tooltip">Theme Mode</span>
            </button>
            <div class="theme-menu" id="themeMenu" role="menu" aria-label="Theme Selection">
                <button type="button" class="theme-option" data-mode="light" data-theme-val="light" role="menuitem">
                    <i class="fas fa-sun"></i>
                    <span>Light</span>
                    <i class="fas fa-check theme-check"></i>
                </button>
                <button type="button" class="theme-option" data-mode="dark" data-theme-val="dark" role="menuitem">
                    <i class="fas fa-moon"></i>
                    <span>Dark</span>
                    <i class="fas fa-check theme-check"></i>
                </button>
                <button type="button" class="theme-option" data-mode="system" data-theme-val="system" role="menuitem">
                    <i class="fas fa-desktop"></i>
                    <span>System</span>
                    <i class="fas fa-check theme-check"></i>
                </button>
            </div>
        </div>

        <!-- Floating WhatsApp Button (Hidden label by default, revealed on hover) -->
        <a href="https://wa.me/919582043336" target="_blank" rel="noopener noreferrer" class="whatsapp-floating" aria-label="Chat on WhatsApp">
            <i class="fab fa-whatsapp whatsapp-icon" aria-hidden="true"></i>
            <span class="whatsapp-label">Chat on WhatsApp</span>
        </a>
    </div>
    <script src="js/theme-toggle.js"></script>`;

targetFiles.forEach(file => {
  const filePath = path.join(kdesDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping missing ${file}`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // Replace nav dropdown if needed
  const navDropdownRegex = /<div class="nav-item-dropdown">\s*<a href="(?:product-subcata625\.html|index\.html#products|#products)"[^>]*>Products[\s\S]*?<\/div>\s*<\/div>/;
  if (navDropdownRegex.test(html)) {
    html = html.replace(navDropdownRegex, newNavDropdown);
    console.log(`[NAV UPDATED] in ${file}`);
  }

  // Replace footer categories if needed
  const footerCatRegex = /<!-- Col 3: Categories \/ Services -->[\s\S]*?<div class="footer-col">[\s\S]*?<h4>Categories<\/h4>[\s\S]*?<\/ul>\s*<\/div>/;
  if (footerCatRegex.test(html)) {
    html = html.replace(footerCatRegex, newFooterCategories);
    console.log(`[FOOTER UPDATED] in ${file}`);
  }

  // Replace old Floating WhatsApp CTA or existing floating dock
  const floatingDockRegex = /<!-- Floating Action Dock[\s\S]*?<\/div>\s*<script src="js\/theme-toggle\.js"><\/script>/;
  const oldWhatsappRegex = /<!-- Floating WhatsApp CTA -->[\s\S]*?<a href="https:\/\/wa\.me\/919582043336"[\s\S]*?<\/a>/;

  if (floatingDockRegex.test(html)) {
    html = html.replace(floatingDockRegex, newFloatingDock);
    console.log(`[FLOATING DOCK REFRESHED] in ${file}`);
  } else if (oldWhatsappRegex.test(html)) {
    html = html.replace(oldWhatsappRegex, newFloatingDock);
    console.log(`[FLOATING DOCK INSTALLED] in ${file}`);
  } else if (!html.includes('class="kdes-floating-dock"')) {
    if (html.includes('</body>')) {
      html = html.replace('</body>', `${newFloatingDock}\n</body>`);
      console.log(`[FLOATING DOCK INSERTED BEFORE BODY] in ${file}`);
    }
  }

  // Ensure theme-toggle.js script is included if missing
  if (!html.includes('src="js/theme-toggle.js"')) {
    html = html.replace('</body>', '    <script src="js/theme-toggle.js"></script>\n</body>');
  }

  fs.writeFileSync(filePath, html, 'utf8');
});

console.log('All target static pages processed.');
