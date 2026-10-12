const fs = require('fs');
const path = require('path');

const kdesDir = path.join(__dirname, '..', 'kdes.in');

// Mapping of pro_id from original URLs to the scraped HTML files
const proIdToDetailFile = {
  "119": "product-detailsea94.html",
  "120": "product-detailsbe7e.html",
  "121": "product-details2626.html",
  "122": "product-details47bd.html",
  "123": "product-details5a9a.html",
  "124": "product-detailsb3a9.html",
  "125": "product-details3e33.html",
  "126": "product-details5c30.html",
  "127": "product-details1fc4.html",
  "128": "product-details8d8a.html",
  "129": "product-detailsb6b8.html",
  "130": "product-details99c7.html",
  "131": "product-details08ce.html",
  "132": "product-detailsc587.html",
  "133": "product-details7e56.html",
  "134": "product-details6590.html",
  "135": "product-detailsf939.html",
  "136": "product-details02c7.html",
  "137": "product-detailse473.html",
  "138": "product-details52fd.html",
  "139": "product-detailsddfa.html",
  "140": "product-details6365.html",
  "141": "product-detailsd6c5.html",
  "142": "product-detailsbb3c.html",
  "143": "product-details4414.html"
};

// Subcategory metadata
const subcatMetadata = {
  'product-subcate473.html': {
    name: 'Spare & Consumables To Laboratories',
    category: 'Lab Instruments',
    proId: '137',
    description: 'High-precision laboratory consumables, laminar flow cabinets, and processing equipment designed for rigorous scientific environments.'
  },
  'product-subcat52fd.html': {
    name: 'Environmental Instruments',
    category: 'Lab Instruments',
    proId: '138',
    description: 'Advanced autoclaves, BOD incubators, and all-glass quartz distillation units built for high-throughput testing and incubation.'
  },
  'product-subcatddfa.html': {
    name: 'Lab Instruments',
    category: 'Lab Instruments',
    proId: '139',
    description: 'Precision analytical instruments including digital conductivity meters, circulating water baths, and digital DO meters.'
  },
  'product-subcat6365.html': {
    name: 'Calibration Services For Instruments',
    category: 'Lab Instruments',
    proId: '140',
    description: 'Precision heating mantles, hot plates, and laboratory thermal instruments with precision calibration support.'
  },
  'product-subcatd6c5.html': {
    name: 'Hydrological Products',
    category: 'Hydrological Products',
    proId: '141',
    description: 'Piezometer ground water level recorders, RTU telemetry units, and electromagnetic flow meters compliant with CGWA standards.'
  },
  'product-subcatbb3c.html': {
    name: 'Air Quality Products',
    category: 'Air Quality Products',
    proId: '142',
    description: 'Respirable dust samplers, high volume air samplers, handy gas samplers, and stack monitoring systems engineered for CPCB/SPCB compliance.'
  },
  'product-subcat4414.html': {
    name: 'Water Testing Instruments',
    category: 'Water Testing Instruments',
    proId: '143',
    description: 'Biological safety cabinets, COD digestion units, and digital colony counters tailored for environmental and wastewater testing.'
  },
  'product-subcat2209.html': {
    name: 'Servicing And Maintenance Of Equipment',
    category: 'Servicing & Maintenance',
    proId: '144',
    description: 'Magnetic stirrers, high temperature oil baths, muffle furnaces, and preventive maintenance solutions.'
  }
};

// Render Product Dropdown with 25 Models and Optgroups
function renderProductSelect(selectedProductTitle = '', selectId = 'spec_product', selectName = 'product') {
  const categories = [
    {
      group: 'Lab Instruments',
      items: [
        'Conductivity Meter',
        'Curculating Water Bath',
        'Digital Do Meter'
      ]
    },
    {
      group: 'Hydrological Products (CGWA Compliant)',
      items: [
        'Rtu Unit For Water Flow Meter',
        'Ground Water Level Recorder',
        'Electromagnetic Water Flowermeter'
      ]
    },
    {
      group: 'Air Quality Products (CPCB Compliant)',
      items: [
        'Handy Sampler Gti - 221',
        'High Volume Sampler Gti 251',
        'Respirable Dust Sampler Apm 151 Bl',
        'Stack Sampler Gti 121'
      ]
    },
    {
      group: 'Water Testing Instruments',
      items: [
        'Biological Sefty Cabinet',
        'Cod Digestion Apparatus',
        'Colony Counter Digital'
      ]
    },
    {
      group: 'Environmental Instruments',
      items: [
        'All Glass Distillation Unit, With Quartz Heater Tube, Vertical Type',
        'Autoclave Vertical',
        'B.o.d. Incubators'
      ]
    },
    {
      group: 'Spare & Consumables',
      items: [
        'Ice Flaking Machine',
        'Laboratory Stirrer',
        'Laminar Air Flow Cabinet (vertical)'
      ]
    },
    {
      group: 'Calibration Services',
      items: [
        'Heating Mantle',
        'Hot Plate Rectangular',
        'Hot Plate Round'
      ]
    },
    {
      group: 'Servicing & Maintenance',
      items: [
        'Magnetic Stirriers',
        'Muffle Furnace',
        'Oil Bath High Temperature'
      ]
    },
    {
      group: 'Turnkey & Custom Solutions',
      items: [
        'Turnkey Laboratory Setup (Multiple Instruments)',
        'Annual Maintenance Contract (AMC) & Calibration',
        'Custom Instrumentation Specification'
      ]
    }
  ];

  const norm = selectedProductTitle ? selectedProductTitle.trim().toLowerCase() : '';
  let out = `                        <select id="${selectId}" name="${selectName}" class="ae-form-select" required>\n`;
  out += `                            <option value="" disabled${!norm ? ' selected' : ''}>-- Select Equipment or Model --</option>\n`;

  for (const cat of categories) {
    out += `                            <optgroup label="${cat.group}">\n`;
    for (const item of cat.items) {
      const isSel = norm && (
        item.toLowerCase() === norm ||
        item.toLowerCase().includes(norm) ||
        norm.includes(item.toLowerCase())
      );
      out += `                                <option value="${item}"${isSel ? ' selected' : ''}>${item}</option>\n`;
    }
    out += `                            </optgroup>\n`;
  }
  out += `                        </select>`;
  return out;
}

// Common Header Topbar
function renderTopbar() {
  return `    <!-- Top Contact Bar -->
    <div class="header-topbar">
        <div class="w topbar-inner">
            <div class="topbar-badge">
                <span class="pulse-indicator"></span>
                ISO 9001:2015 Certified Manufacturing Facility
            </div>
            <div class="topbar-info">
                <div class="topbar-info-item">
                    <i class="far fa-clock"></i>
                    <span>Mon - Sat: 9:30 - 18:30</span>
                </div>
                <div class="topbar-info-item">
                    <i class="far fa-envelope"></i>
                    <a href="mailto:kdes2017@gmail.com">kdes2017@gmail.com</a>
                </div>
                <div class="topbar-info-item">
                    <i class="fas fa-phone-alt"></i>
                    <a href="tel:+919555498906">+91 95554 98906</a>
                </div>
            </div>
        </div>
    </div>`;
}

// Common Main Sticky Header
function renderHeader(activePage = 'products') {
  const isHomeActive = activePage === 'home' ? 'active' : '';
  const isProductsActive = activePage === 'products' ? 'active' : '';
  const isCatalogueActive = activePage === 'catalogue' ? 'active' : '';
  const isContactActive = activePage === 'contact' ? 'active' : '';
  const isAboutActive = activePage === 'about' ? 'active' : '';

  return `    <!-- Main Sticky Header -->
    <header class="site-header">
        <div class="w">
            <a class="site-logo" href="index.html">
                <img src="header-image/1615271827_1615197139_mainlogo.png" alt="KD Engineering Solutions logo">
                <span class="logo-brand-text">K D Engineering Solutions</span>
            </a>
            
            <nav class="main-nav" aria-label="Main Navigation">
                <div class="nav-item-dropdown">
                    <a href="index.html" class="${isHomeActive}">Home <i class="fas fa-chevron-down" style="font-size:10px;margin-left:4px"></i></a>
                    <div class="nav-dropdown-menu">
                        <a href="index.html">Overview <i class="fas fa-chevron-right" style="font-size:11px"></i></a>
                        <a href="about.html" class="${isAboutActive}">About Us <i class="fas fa-chevron-right" style="font-size:11px"></i></a>
                    </div>
                </div>
                <div class="nav-item-dropdown">
                    <a href="product-subcata625.html" class="${isProductsActive}">Products <i class="fas fa-chevron-down" style="font-size:10px;margin-left:4px"></i></a>
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
                </div>
                <a href="index.html#services">Services</a>
                <a href="catalogue.html" class="${isCatalogueActive}">Catalogue</a>
                <a href="contact.html" class="${isContactActive}">Contact</a>
            </nav>

            <a class="aeline-btn-lime" href="contact.html?action=quote">
                <span>Get a Quote</span>
                <i class="fas fa-arrow-right" style="font-size:12px"></i>
            </a>
        </div>
    </header>`;
}

// Common EcoBuild Footer
function renderFooter() {
  return `    <!-- Site Footer (EcoBuild Inspired Deep Forest Dark Multi-Column) -->
    <footer class="site-footer" id="contact">
        <div class="w">
            <div class="footer-main">
                <!-- Col 1: Brand & Mission -->
                <div class="footer-col footer-col-brand">
                    <a href="index.html" class="footer-brand">
                        <img src="header-image/1615271827_1615197139_mainlogo.png" alt="K D Engineering Solutions" class="footer-brand-logo-img">
                        <div class="footer-brand-info">
                            <span class="footer-brand-name">K D Engineering Solutions</span>
                            <span class="footer-brand-tagline">Building a Greener Tomorrow</span>
                        </div>
                    </a>
                    <p class="footer-brand-bio">
                        Sustainable environmental monitoring, hydrological DWLR telemetry systems, and precision scientific laboratory instruments engineered for CGWA compliance and lasting impact.
                    </p>
                    <div class="footer-socials">
                        <a href="https://www.linkedin.com/in/kapil-dev-sharma-ba7791209/" target="_blank" rel="noopener noreferrer" class="social-circle-btn" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="https://twitter.com/KapilDe32091332" target="_blank" rel="noopener noreferrer" class="social-circle-btn" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                        <a href="https://www.facebook.com/K-D-Engineering-Solutions-107106984797903" target="_blank" rel="noopener noreferrer" class="social-circle-btn" aria-label="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://wa.me/919582043336" target="_blank" rel="noopener noreferrer" class="social-circle-btn" aria-label="WhatsApp"><i class="fab fa-whatsapp"></i></a>
                    </div>
                </div>

                <!-- Col 2: Quick Links -->
                <div class="footer-col">
                    <h4>Quick Links</h4>
                    <ul class="footer-links-list">
                        <li><a href="index.html">Home Overview</a></li>
                        <li><a href="about.html">About Us</a></li>
                        <li><a href="catalogue.html">Product Catalogue</a></li>
                        <li><a href="exhibition.html">Exhibitions &amp; Demos</a></li>
                        <li><a href="videos.html">Video Gallery</a></li>
                        <li><a href="contact.html">Contact Us</a></li>
                    </ul>
                </div>

                <!-- Col 3: Categories / Services -->
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
                </div>

                <!-- Col 4: Resources & Compliance -->
                <div class="footer-col">
                    <h4>Resources</h4>
                    <ul class="footer-links-list">
                        <li><a href="catalogue.html">Download Catalogue (PDF)</a></li>
                        <li><a href="about.html">CGWA Telemetry Guidelines</a></li>
                        <li><a href="about.html">Quality &amp; Calibration Standards</a></li>
                        <li><a href="about.html">ISO 9001:2015 Standards</a></li>
                        <li><a href="catalogue.html">Technical Datasheets</a></li>
                        <li><a href="index.html#quote">Request Formal Quote</a></li>
                    </ul>
                </div>

                <!-- Col 5: Get In Touch -->
                <div class="footer-col footer-col-contact">
                    <h4>Get In Touch</h4>
                    <div class="footer-contact-item">
                        <i class="fas fa-map-marker-alt footer-contact-icon"></i>
                        <div class="footer-contact-text">
                            <strong>Office:</strong> 185/30-B, Krishna Gali No.-6, Adarsh Mohalla, Maujpur, Delhi 110053<br>
                            <strong>Regd:</strong> A-158, Street no.8, Meet Nagar, Delhi: 110094
                        </div>
                    </div>
                    <div class="footer-contact-item">
                        <i class="fas fa-phone-alt footer-contact-icon"></i>
                        <div class="footer-contact-text">
                            <a href="tel:+919555498906">+91 95554 98906</a><br>
                            <a href="tel:+919582043336">+91 95820 43336</a>
                        </div>
                    </div>
                    <div class="footer-contact-item">
                        <i class="fas fa-envelope footer-contact-icon"></i>
                        <div class="footer-contact-text">
                            <a href="mailto:kdes2017@gmail.com">kdes2017@gmail.com</a>
                        </div>
                    </div>
                    <div class="footer-contact-item">
                        <i class="fas fa-clock footer-contact-icon"></i>
                        <div class="footer-contact-text">
                            Mon - Sat: 9:30 AM – 6:30 PM<br>
                            <span style="opacity:0.7">Sunday: Closed</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer Bottom -->
            <div class="footer-bottom">
                <div class="footer-bottom-copy">
                    &copy; 2026-Copyright & Maintained by JSAlphaSoft Pvt Ltd. All rights reserved.
                </div>
                <div class="footer-bottom-links">
                    <a href="about.html">Privacy Policy</a>
                    <span class="footer-sep">&bull;</span>
                    <a href="about.html">Terms of Service</a>
                    <span class="footer-sep">&bull;</span>
                    <span>ISO 9001:2015 &amp; CGWA Compliant</span>
                </div>
            </div>
        </div>
    </footer>

    <!-- Floating Action Dock: Theme Mode Toggle & WhatsApp CTA -->
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
    <script src="js/theme-toggle.js"></script>
    <script src="js/scroll-animate.js" defer></script>`;
}

// -----------------------------------------------------------------------------
// STEP 1: Process and Revamp all Subcategory Files from Pristine rawDir
// -----------------------------------------------------------------------------
console.log('Revamping subcategory pages from pristine source...');

const productToSubcatMap = {};
const allMasterProducts = [];

for (const [filename, meta] of Object.entries(subcatMetadata)) {
  const rawFilePath = path.join(rawDir, filename);
  if (!fs.existsSync(rawFilePath)) {
    console.warn(`Warning: raw file missing: ${rawFilePath}`);
    continue;
  }

  const content = fs.readFileSync(rawFilePath, 'utf8');

  // Extract products from raw HTML
  const productBlocks = content.split(/<div class=["']product mb-40["']>/).slice(1);
  const products = [];

  for (const block of productBlocks) {
    const imgM = block.match(/<img src=["'](product-image\/[^"']+)["']/);
    const linkM = block.match(/<a href=["'](product-details[^"']+)["']/);
    const catM = block.match(/<span class=["']pro-cat["']>\s*<a[^>]*>([\s\S]*?)<\/a>/);
    const titleM = block.match(/<h4 class=["']pro-title["']>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);

    if (imgM && linkM && titleM) {
      // Map original product-details.php?pro_id=XXX to the mirrored file product-detailsXXXX.html
      let originalLink = linkM[1].trim();
      let resolvedLink = originalLink;
      const proIdMatch = originalLink.match(/pro_id=(\d+)/);
      if (proIdMatch && proIdToDetailFile[proIdMatch[1]]) {
        resolvedLink = `${proIdToDetailFile[proIdMatch[1]]}?pro_id=${proIdMatch[1]}`;
      }

      let imgSrc = imgM[1].trim();
      const pngCandidate = imgSrc.replace(/\.jpg$/i, '.png');
      if (fs.existsSync(path.join(kdesDir, pngCandidate))) {
        imgSrc = pngCandidate;
      }

      const prod = {
        img: imgSrc,
        link: resolvedLink,
        cat: catM ? catM[1].trim() : meta.category,
        title: titleM[1].trim(),
        subcatName: meta.name
      };
      products.push(prod);
      allMasterProducts.push(prod);

      // Record in map for detail page breadcrumbs
      const baseDetailFile = resolvedLink.split('?')[0];
      productToSubcatMap[baseDetailFile] = {
        subcatFile: filename,
        subcatLink: `${filename}?pro_id=${meta.proId}`,
        subcatName: meta.name,
        category: meta.category
      };
    }
  }

  // Generate modern subcat HTML with full product cards and images
  const productsHtml = products.map(p => `
                <div class="aeline-prod-card card-animate">
                    <div class="aeline-prod-thumb">
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="aeline-prod-body">
                        <span class="aeline-prod-cat">${p.cat}</span>
                        <h3 class="aeline-prod-title">
                            <a href="${p.link}">${p.title}</a>
                        </h3>
                        <p class="aeline-prod-desc-snippet">
                            Precision manufactured by KDES with high accuracy calibration, industrial endurance, and warranty assurance.
                        </p>
                        <div class="aeline-prod-footer">
                            <a href="${p.link}" class="aeline-prod-btn">
                                <span>View Specifications</span>
                                <i class="fas fa-arrow-right" style="font-size:12px"></i>
                            </a>
                        </div>
                    </div>
                </div>`).join('\n');

  const pageHtml = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${meta.name} - K D Engineering Solutions</title>
    <meta name="description" content="${meta.description} High precision instruments from K D Engineering Solutions, Delhi.">
    <meta name="keywords" content="${meta.name}, Lab Instruments Delhi, Environmental Equipment, Scientific Instruments India">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="header-image/1615271827_1615197139_mainlogo.png">
    
    <!-- Google Fonts & FontAwesome -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    
    <!-- Aeline Design System CSS -->
    <link rel="stylesheet" href="css/modern-revamp.css">
</head>

<body>
${renderTopbar()}

${renderHeader('products')}

    <!-- Breadcrumb Banner -->
    <section class="page-banner">
        <div class="w">
            <span class="aeline-pill-tag">
                <i class="fas fa-microscope"></i> Precision Instrumentation
            </span>
            <h1>${meta.name}</h1>
            <p>${meta.description}</p>
            
            <div class="banner-breadcrumbs">
                <a href="index.html">Home</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <a href="index.html#products">Products</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <span class="current">${meta.name}</span>
            </div>
        </div>
    </section>

    <!-- Product Catalog Section -->
    <section class="product-catalog-section">
        <div class="w">
            <div class="catalog-header-bar">
                <span class="catalog-count-pill">
                    <i class="fas fa-check-double"></i> ${products.length} Certified Models Available
                </span>
                <div>
                    <a href="catalogue.html" class="aeline-btn-forest" style="padding:8px 18px;font-size:13px">
                        <i class="fas fa-file-pdf"></i> Download PDF Catalogue
                    </a>
                </div>
            </div>

            <!-- Products Grid -->
            <div class="aeline-product-grid">
${productsHtml}
            </div>

            <!-- Callout CTA Card -->
            <div class="card-animate" style="margin-top:70px;background:var(--ae-bg-diagonal);border:1px solid var(--ae-border);border-radius:var(--ae-radius-lg);padding:44px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:24px;box-shadow:var(--ae-shadow-md)">
                <div style="max-width:680px">
                    <span class="aeline-pill-tag">
                        <i class="fas fa-sliders-h"></i> Custom Engineering
                    </span>
                    <h2 style="font-size:26px;margin:12px 0 8px">Need Custom Environmental or Lab Specifications?</h2>
                    <p style="color:var(--ae-text-body);font-size:15px">
                        We manufacture custom instrumentation tailored to state pollution control norms, CGWA groundwater compliance, and research specifications.
                    </p>
                </div>
                <div>
                    <a href="contact.html" class="aeline-btn-lime">
                        <span>Consult Our Engineers</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>

        </div>
    </section>

${renderFooter()}
</body>
</html>`;

  const destPath = path.join(kdesDir, filename);
  fs.writeFileSync(destPath, pageHtml, 'utf8');
  console.log(`[REVAMPED] ${filename} (${products.length} products with images)`);
}

// -----------------------------------------------------------------------------
// STEP 2: Master Directory Page (product-subcata625.html)
// -----------------------------------------------------------------------------
const a625Path = path.join(kdesDir, 'product-subcata625.html');
const a625ProductsHtml = allMasterProducts.map(p => `
                <div class="aeline-prod-card card-animate" data-cat="${p.cat}">
                    <div class="aeline-prod-thumb">
                        <img src="${p.img}" alt="${p.title}" loading="lazy">
                    </div>
                    <div class="aeline-prod-body">
                        <span class="aeline-prod-cat">${p.cat}</span>
                        <h3 class="aeline-prod-title">
                            <a href="${p.link}">${p.title}</a>
                        </h3>
                        <p class="aeline-prod-desc-snippet">
                            Part of our ${p.subcatName} portfolio engineered for high accuracy and compliance.
                        </p>
                        <div class="aeline-prod-footer">
                            <a href="${p.link}" class="aeline-prod-btn">
                                <span>View Specifications</span>
                                <i class="fas fa-arrow-right" style="font-size:12px"></i>
                            </a>
                        </div>
                    </div>
                </div>`).join('\n');

const a625Html = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>Complete Instrumentation Directory - K D Engineering Solutions</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="header-image/1615271827_1615197139_mainlogo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    <link rel="stylesheet" href="css/modern-revamp.css">
</head>
<body>
${renderTopbar()}
${renderHeader('products')}
    <section class="page-banner">
        <div class="w">
            <span class="aeline-pill-tag"><i class="fas fa-boxes"></i> Complete Range</span>
            <h1>All Certified Products &amp; Instruments</h1>
            <p>Browse our complete catalog of 25 certified laboratory, hydrological, and environmental instruments with direct technical datasheets.</p>
            <div class="banner-breadcrumbs">
                <a href="index.html">Home</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <span class="current">Product Directory</span>
            </div>
        </div>
    </section>
    <section class="product-catalog-section">
        <div class="w">
            <div class="catalog-header-bar">
                <span class="catalog-count-pill">
                    <i class="fas fa-check-double"></i> ${allMasterProducts.length} Complete Instruments Catalogued
                </span>
                <div>
                    <a href="catalogue.html" class="aeline-btn-forest" style="padding:8px 18px;font-size:13px">
                        <i class="fas fa-file-pdf"></i> Download PDF Catalogue
                    </a>
                </div>
            </div>

            <!-- Quick Category Filter Chips -->
            <div style="margin-bottom:28px;display:flex;gap:10px;flex-wrap:wrap;align-items:center">
                <button class="cat-filter-btn active" onclick="filterCatalog('all', this)" style="background:var(--ae-forest);color:#fff;border:1px solid var(--ae-forest);padding:8px 18px;border-radius:var(--ae-radius-pill);font-size:13px;font-weight:700;cursor:pointer;transition:all 0.2s">All Instruments (${allMasterProducts.length})</button>
                <button class="cat-filter-btn" onclick="filterCatalog('Lab Instruments', this)" style="background:var(--ae-bg-diagonal);color:var(--ae-forest);border:1px solid var(--ae-border);padding:8px 18px;border-radius:var(--ae-radius-pill);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s">Lab Instruments</button>
                <button class="cat-filter-btn" onclick="filterCatalog('Hydrological Products', this)" style="background:var(--ae-bg-diagonal);color:var(--ae-forest);border:1px solid var(--ae-border);padding:8px 18px;border-radius:var(--ae-radius-pill);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s">Hydrological Products</button>
                <button class="cat-filter-btn" onclick="filterCatalog('Air Quality Products', this)" style="background:var(--ae-bg-diagonal);color:var(--ae-forest);border:1px solid var(--ae-border);padding:8px 18px;border-radius:var(--ae-radius-pill);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s">Air Quality Products</button>
                <button class="cat-filter-btn" onclick="filterCatalog('Water Testing Instruments', this)" style="background:var(--ae-bg-diagonal);color:var(--ae-forest);border:1px solid var(--ae-border);padding:8px 18px;border-radius:var(--ae-radius-pill);font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s">Water Testing Instruments</button>
            </div>

            <div class="aeline-product-grid">
${a625ProductsHtml}
            </div>
        </div>
    </section>

    <script>
        function filterCatalog(cat, btn) {
            document.querySelectorAll('.cat-filter-btn').forEach(function(b) {
                b.style.background = 'var(--ae-bg-diagonal)';
                b.style.color = 'var(--ae-forest)';
                b.style.borderColor = 'var(--ae-border)';
                b.classList.remove('active');
            });
            btn.style.background = 'var(--ae-forest)';
            btn.style.color = '#ffffff';
            btn.style.borderColor = 'var(--ae-forest)';
            btn.classList.add('active');

            var cards = document.querySelectorAll('.aeline-product-grid .aeline-prod-card');
            cards.forEach(function(card) {
                if (cat === 'all' || card.getAttribute('data-cat') === cat) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    </script>

${renderFooter()}
</body>
</html>`;
fs.writeFileSync(a625Path, a625Html, 'utf8');
console.log(`[REVAMPED] product-subcata625.html (${allMasterProducts.length} master products with images)`);

// -----------------------------------------------------------------------------
// STEP 3: Process and Revamp all 25 Product Details Pages from Pristine rawDir
// -----------------------------------------------------------------------------
console.log('\nRevamping product detail pages from pristine source...');

const detailFiles = fs.readdirSync(rawDir).filter(f => f.startsWith('product-details') && f.endsWith('.html'));

for (const f of detailFiles) {
  const rawFilePath = path.join(rawDir, f);
  const content = fs.readFileSync(rawFilePath, 'utf8');

  // Title
  const titleMatch = content.match(/<div class=["']product-details-title["']>\s*<h1>(.*?)<\/h1>/s);
  const title = titleMatch ? titleMatch[1].trim() : 'Laboratory Equipment';

  // Category
  const catMatch = content.match(/<span>Category:\s*<\/span>\s*<a>(.*?)<\/a>/s);
  const category = catMatch ? catMatch[1].trim() : 'Precision Instruments';

  // Image - exact image from pristine file
  const imgMatch = content.match(/<div class=["']product-large-img["']>\s*<img src=["'](.*?)["']/s) ||
                   content.match(/src=["'](product-image\/[^"']+)["']/);
  let img = imgMatch ? imgMatch[1].trim() : 'product-image/28569.jpg';
  const pngCandidate = img.replace(/\.jpg$/i, '.png');
  if (fs.existsSync(path.join(kdesDir, pngCandidate))) {
    img = pngCandidate;
  }

  // Description (#home1)
  const descMatch = content.match(/<div id=["']home1["'][^>]*>([\s\S]*?)<\/div>\s*<div id=["']menu1["']/);
  let desc = descMatch ? descMatch[1].trim() : '';
  desc = desc.replace(/^<br\s*\/?>/i, '').trim();
  if (desc) {
    desc = desc.replace(/NABL\s+traceable/gi, 'precision traceable')
               .replace(/traceable to NABL accredited/gi, 'traceable to accredited')
               .replace(/NABL accredited/gi, 'certified')
               .replace(/\bNABL\b/gi, 'Standard');
  }

  // Specification (#menu1)
  const specMatch = content.match(/<div id=["']menu1["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/);
  let spec = specMatch ? specMatch[1].trim() : '';
  spec = spec.replace(/^<br\s*\/?>/i, '').trim();
  if (spec) {
    spec = spec.replace(/NABL\s+traceable/gi, 'precision traceable')
               .replace(/traceable to NABL accredited/gi, 'traceable to accredited')
               .replace(/NABL accredited/gi, 'certified')
               .replace(/\bNABL\b/gi, 'Standard');
  }

  // Parent subcategory lookup
  const parentInfo = productToSubcatMap[f] || {
    subcatLink: 'index.html#products',
    subcatName: 'Products Catalog'
  };

  const detailHtml = `<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <title>${title} - K D Engineering Solutions</title>
    <meta name="description" content="${title} manufactured by K D Engineering Solutions, Delhi. High accuracy, precision calibration and reliable technical support.">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="shortcut icon" type="image/x-icon" href="header-image/1615271827_1615197139_mainlogo.png">
    
    <!-- Google Fonts & FontAwesome -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="fontawesome/css/all.min.css">
    
    <!-- Aeline Design System CSS -->
    <link rel="stylesheet" href="css/modern-revamp.css">
</head>

<body>
${renderTopbar()}

${renderHeader('products')}

    <!-- Breadcrumb Banner -->
    <section class="page-banner">
        <div class="w">
            <span class="aeline-pill-tag">
                <i class="fas fa-flask"></i> Technical Specifications
            </span>
            <h1>${title}</h1>
            <p>${category} • Engineered for high precision and repeatable measurement accuracy.</p>
            
            <div class="banner-breadcrumbs">
                <a href="index.html">Home</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <a href="index.html#products">Products</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <a href="${parentInfo.subcatLink}">${parentInfo.subcatName}</a>
                <span class="sep"><i class="fas fa-chevron-right"></i></span>
                <span class="current">${title}</span>
            </div>
        </div>
    </section>

    <!-- Main Product Details Section -->
    <section class="prod-details-section">
        <div class="w">
            
            <div class="prod-details-grid">
                
                <!-- Left: Media & Gallery Card -->
                <div class="prod-gallery-card">
                    <div class="prod-main-img-wrap" onclick="toggleZoom(true)" title="Click to enlarge image">
                        <img id="mainProductImg" src="${img}" alt="${title}">
                    </div>
                    <div class="prod-zoom-hint" onclick="toggleZoom(true)">
                        <i class="fas fa-search-plus"></i> Click image to view full resolution
                    </div>

                    <div class="prod-guarantee-row">
                        <span><i class="fas fa-shield-alt"></i> 1 Year Warranty</span>
                        <span><i class="fas fa-certificate"></i> Precision Calibration</span>
                        <span><i class="fas fa-truck"></i> Pan-India Dispatch</span>
                    </div>
                </div>

                <!-- Right: Product Information & Action Box -->
                <div class="prod-info-card">
                    
                    <div class="prod-badge-stack">
                        <span class="prod-meta-tag"><i class="fas fa-tag"></i> ${category}</span>
                        <span class="prod-meta-tag stock"><i class="fas fa-check-circle"></i> In Stock &amp; Ready to Ship</span>
                    </div>

                    <h1 class="prod-title-h1">${title}</h1>

                    <!-- Key Technical Attributes Grid -->
                    <div class="prod-attribute-box">
                        <div class="prod-attr-item">
                            <span class="prod-attr-label">Category</span>
                            <span class="prod-attr-val">${category}</span>
                        </div>
                        <div class="prod-attr-item">
                            <span class="prod-attr-label">Availability</span>
                            <span class="prod-attr-val" style="color:#15803d">In Stock</span>
                        </div>
                        <div class="prod-attr-item">
                            <span class="prod-attr-label">Compliance</span>
                            <span class="prod-attr-val">ISO 9001:2015</span>
                        </div>
                        <div class="prod-attr-item">
                            <span class="prod-attr-label">Calibration</span>
                            <span class="prod-attr-val">Factory Calibrated</span>
                        </div>
                    </div>

                    <p style="color:var(--ae-text-body);font-size:15px;line-height:1.75">
                        K D Engineering Solutions manufactures and supplies this equipment with strict quality inspection protocols, comprehensive calibration certification, and responsive after-sales support.
                    </p>

                    <!-- CTAs -->
                    <div class="prod-action-stack">
                        <a href="#submit-specification" class="aeline-btn-lime">
                            <span>Submit for Specification</span>
                            <i class="fas fa-file-invoice" style="font-size:12px"></i>
                        </a>
                        <a href="https://wa.me/919582043336?text=${encodeURIComponent('Hi, I would like to inquire about: ' + title)}" target="_blank" class="aeline-btn-forest">
                            <span>Instant WhatsApp Desk</span>
                            <i class="fab fa-whatsapp" style="font-size:14px"></i>
                        </a>
                    </div>

                    <div style="margin-top:20px;font-size:13px;color:var(--ae-text-muted)">
                        <i class="fas fa-headset" style="margin-right:6px;color:var(--ae-forest)"></i>
                        Direct Technical Support Hotline: <strong>+91 95554 98906</strong>
                    </div>

                </div>

            </div>

            <!-- Tabbed Specifications & Documentation Section -->
            <div class="prod-specs-container">
                <div class="prod-tab-nav" role="tablist">
                    <button class="prod-tab-btn active" id="tabBtnDesc" onclick="switchTab('desc')">
                        <i class="fas fa-align-left"></i> Product Overview &amp; Description
                    </button>
                    ${spec ? `
                    <button class="prod-tab-btn" id="tabBtnSpec" onclick="switchTab('spec')">
                        <i class="fas fa-cogs"></i> Technical Specifications
                    </button>` : ''}
                    <button class="prod-tab-btn" id="tabBtnSupport" onclick="switchTab('support')">
                        <i class="fas fa-award"></i> Compliance &amp; Standards
                    </button>
                </div>

                <!-- Tab 1: Description -->
                <div class="prod-tab-content active" id="tabContentDesc">
                    ${desc ? `<div class="raw-content-wrap">${desc}</div>` : `
                    <p style="color:var(--ae-text-body);font-size:15px;line-height:1.8">
                        The <strong>${title}</strong> is an engineered laboratory and environmental solution manufactured to meet rigorous quality standards. Built with durable industrial components, it offers dependable repeatability, low maintenance requirements, and full traceable calibration certificates upon delivery.
                    </p>
                    <p style="color:var(--ae-text-body);font-size:15px;line-height:1.8;margin-top:14px">
                        For custom chamber dimensions, modified voltage inputs, or special integration with your existing telemetry setup, please contact our engineering consultation desk.
                    </p>`}
                </div>

                <!-- Tab 2: Specifications -->
                ${spec ? `
                <div class="prod-tab-content" id="tabContentSpec">
                    <div class="raw-content-wrap">${spec}</div>
                </div>` : ''}

                <!-- Tab 3: Compliance & Support -->
                <div class="prod-tab-content" id="tabContentSupport">
                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px">
                        <div class="card-animate" style="background:var(--ae-bg-diagonal);border:1px solid var(--ae-border);padding:24px;border-radius:var(--ae-radius-md)">
                            <h4 style="color:var(--ae-forest);margin-bottom:8px"><i class="fas fa-certificate"></i> Precision Calibration</h4>
                            <p style="font-size:14px;color:var(--ae-text-body);line-height:1.6">Every instrument passes strict calibration against master gauges traceable to National Physical Laboratory (NPL) standards.</p>
                        </div>
                        <div class="card-animate" style="background:var(--ae-bg-diagonal);border:1px solid var(--ae-border);padding:24px;border-radius:var(--ae-radius-md)">
                            <h4 style="color:var(--ae-forest);margin-bottom:8px"><i class="fas fa-shield-alt"></i> CGWA &amp; CPCB Compliance</h4>
                            <p style="font-size:14px;color:var(--ae-text-body);line-height:1.6">Environmental monitoring units are engineered in conformity with current Central Ground Water Authority and CPCB notifications.</p>
                        </div>
                        <div class="card-animate" style="background:var(--ae-bg-diagonal);border:1px solid var(--ae-border);padding:24px;border-radius:var(--ae-radius-md)">
                            <h4 style="color:var(--ae-forest);margin-bottom:8px"><i class="fas fa-tools"></i> AMC &amp; Maintenance</h4>
                            <p style="font-size:14px;color:var(--ae-text-body);line-height:1.6">Comprehensive annual maintenance contracts (AMC) and prompt spare component replacement available across India.</p>
                        </div>
                    </div>
                </div>

            </div>

            <!-- Submit for Specification & Request Quote Section -->
            <div id="submit-specification" style="margin-top:50px;padding-top:40px;border-top:1px solid var(--ae-border)">
                <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(320px,1fr));gap:40px;align-items:start">
                    <div>
                        <span class="aeline-pill-tag"><i class="fas fa-file-invoice"></i> SUBMIT FOR SPECIFICATION</span>
                        <h2 style="font-size:28px;margin:12px 0 10px;color:var(--ae-text-heading)">Request Custom Specification &amp; Quote</h2>
                        <p style="color:var(--ae-text-body);font-size:15.5px;line-height:1.75;margin-bottom:20px">
                            Need tailored dimensions, specific measurement ranges, NPL traceable calibration certification, or an official institutional quotation for <strong>${title}</strong>? Submit your requirements directly to our engineering desk.
                        </p>
                        
                        <div style="display:grid;gap:14px;margin-top:24px">
                            <div class="service-card" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
                                <div class="service-icon-box" style="margin-bottom:0;width:42px;height:42px;font-size:18px"><i class="fas fa-certificate"></i></div>
                                <div>
                                    <strong style="color:var(--ae-text-heading);display:block;font-size:15px">Certified Calibration</strong>
                                    <span style="font-size:13px;color:var(--ae-text-muted)">Traceable test report and warranty documentation included</span>
                                </div>
                            </div>
                            <div class="service-card" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
                                <div class="service-icon-box" style="margin-bottom:0;width:42px;height:42px;font-size:18px"><i class="fas fa-phone-alt"></i></div>
                                <div>
                                    <strong style="color:var(--ae-text-heading);display:block;font-size:15px">Technical Helpline</strong>
                                    <a href="tel:+919555498906" style="color:var(--ae-forest);font-weight:700">+91 95554 98906</a>
                                </div>
                            </div>
                            <div class="service-card" style="padding:16px 20px;display:flex;align-items:center;gap:14px">
                                <div class="service-icon-box" style="margin-bottom:0;width:42px;height:42px;font-size:18px;background:#dcfce7;color:#16a34a"><i class="fab fa-whatsapp"></i></div>
                                <div>
                                    <strong style="color:var(--ae-text-heading);display:block;font-size:15px">Instant WhatsApp Desk</strong>
                                    <a href="https://wa.me/919582043336" target="_blank" style="color:#16a34a;font-weight:700">+91 95820 43336</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <form action="sendmail.php" method="POST" class="quote-form-card">
                            <input type="hidden" name="to_email" value="shiven.k@aol.in">
                            <input type="hidden" name="form_type" value="Product Specification Form (Submit Specification &amp; Request Quote)">
                            <h3 style="font-size:22px;margin-bottom:6px">Submit Specification For ${title}</h3>
                            <p style="font-size:14px;color:var(--ae-text-muted);margin-bottom:12px">Our engineering team reviews your parameters and delivers an itemized quotation.</p>

                            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
                                <div>
                                    <label for="spec_fname">First Name</label>
                                    <input id="spec_fname" name="fname" type="text" placeholder="First name" required>
                                </div>
                                <div>
                                    <label for="spec_lname">Last Name</label>
                                    <input id="spec_lname" name="lname" type="text" placeholder="Last name" required>
                                </div>
                            </div>

                            <div>
                                <label for="spec_email">Work Email</label>
                                <input id="spec_email" name="email" type="email" placeholder="name@company.com" required>
                            </div>

                            <div>
                                <label for="spec_phone">Phone Number</label>
                                <input id="spec_phone" name="phone" type="tel" placeholder="+91..." required>
                            </div>

                            <div>
                                <label for="spec_product">Selected Product / Model</label>
                                ${renderProductSelect(title, 'spec_product', 'product')}
                            </div>

                            <div>
                                <label for="spec_subject">Subject / Application Scope</label>
                                <input id="spec_subject" name="subject" type="text" value="Specification Request - ${title}" required>
                            </div>

                            <div>
                                <label for="spec_comment">Technical Specifications &amp; Parameters</label>
                                <textarea id="spec_comment" name="c_comment" rows="4" placeholder="Detail required range, chamber dimensions, accuracy limits, quantity, or site conditions..." required></textarea>
                            </div>

                            <button type="submit" name="E_submit" class="aeline-btn-lime" style="width:100%;padding:14px">
                                <span>Submit Specification &amp; Request Quote</span>
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    </section>

    <!-- Image Zoom Modal -->
    <div id="imgZoomModal" class="prod-zoom-modal" onclick="toggleZoom(false)">
        <div class="prod-zoom-modal-content" onclick="event.stopPropagation()">
            <span class="prod-zoom-close" onclick="toggleZoom(false)">&times;</span>
            <img src="${img}" alt="${title}">
            <div style="margin-top:16px;text-align:center;color:#ffffff;font-weight:600">${title}</div>
        </div>
    </div>

    <script>
        function toggleZoom(show) {
            var modal = document.getElementById('imgZoomModal');
            if (modal) {
                modal.classList.toggle('active', show);
            }
        }
        function switchTab(tabId) {
            document.querySelectorAll('.prod-tab-btn').forEach(function(b) { b.classList.remove('active'); });
            document.querySelectorAll('.prod-tab-content').forEach(function(c) { c.classList.remove('active'); });

            if (tabId === 'desc') {
                var btn = document.getElementById('tabBtnDesc');
                var content = document.getElementById('tabContentDesc');
                if (btn) btn.classList.add('active');
                if (content) content.classList.add('active');
            } else if (tabId === 'spec') {
                var btn = document.getElementById('tabBtnSpec');
                var content = document.getElementById('tabContentSpec');
                if (btn) btn.classList.add('active');
                if (content) content.classList.add('active');
            } else if (tabId === 'support') {
                var btn = document.getElementById('tabBtnSupport');
                var content = document.getElementById('tabContentSupport');
                if (btn) btn.classList.add('active');
                if (content) content.classList.add('active');
            }
        }
    </script>
    <script src="js/form-handler.js"></script>

${renderFooter()}
</body>
</html>`;

  const destPath = path.join(kdesDir, f);
  fs.writeFileSync(destPath, detailHtml, 'utf8');
  console.log(`[REVAMPED] ${f} ("${title}" with image ${img})`);
}

console.log('\nAll 9 subcategory and 25 detail pages successfully regenerated with full images and data!');
