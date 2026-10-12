# K D Engineering Solutions (KDES)

> **Official Web Platform & Scientific Instrumentation Portal**  
> ISO 9001:2015 Certified &bull; CGWA & CPCB Compliant Environmental & Laboratory Monitoring Instruments

---

## 📖 Overview

This repository contains the complete source code, assets, product catalogues, and email dispatch infrastructure for the **K D Engineering Solutions (KDES)** corporate website ([kdes.in](https://kdes.in)).

The platform features a modern, responsive design system with dark/light mode toggles, 25 comprehensive product specifications across 8 scientific categories, interactive quotation requests, and an RFC-compliant mail forwarding system.

---

## ✨ Key Features

- **Modern Glassmorphic UI & Design System**:
  - Curated Forest Green & Neon Lime palette (`--ae-forest`, `--ae-lime`).
  - Seamless Dark, Light, and System theme support with persistent storage (`localStorage`) via [`theme-toggle.js`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/js/theme-toggle.js).
  - Floating Action Dock with Theme Toggle positioned directly above the WhatsApp Floating Button (hover reveal).
- **Two-Level Nested Product Navigation**:
  - Primary category dropdowns expand to reveal 2nd-level submenus linking directly to individual instrument models.
- **25 Comprehensive Instrument Catalogues**:
  - Detailed parameter tables, operational ranges, compliance standards, and application notes.
  - Dedicated specifications inquiry forms on every detail page.
- **Unified Quotation & Inquiry Forwarding**:
  - All inquiries from the three forms are mapped to forward to **`shiven.k@aol.in`**:
    1. **"Send Message Now"** on [`kdes.in/contact.html`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/contact.html)
    2. **"Submit Request"** on [`kdes.in/index.html#quote`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/index.html#quote)
    3. **"Submit Specification & Request Quote"** across all 25 [`product-details*.html`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/) pages
- **Robust Email Dispatcher ([`kdes.in/sendmail.php`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/sendmail.php))**:
  - RFC-compliant `multipart/alternative` MIME emails (clean plain-text + styled HTML table).
  - Anti-spam envelope sender fallbacks (`-f` flag) for AOL/Yahoo/Gmail deliverability.
  - Automatic JSON persistence logging to `inquiries_backup.json`.
- **Client-Side Form Handling ([`kdes.in/js/form-handler.js`](file:///d:/Projects/Repos/Websites/KDES/KDES/kdes.in/js/form-handler.js))**:
  - Asynchronous AJAX submission with loading indicators.
  - Animated modal popup displaying mapped recipient verification.
  - Automatic one-click `mailto:shiven.k@aol.in` fallback if the server is offline or unreachable.

---

## 📂 Project Structure

```text
KDES/
├── index.html                   # Root entry redirect to kdes.in/index.html
├── package.json                 # Project scripts, dependencies & test configuration
├── README.md                    # Project documentation
├── .gitignore                   # Ignore dist/, backup logs, and build artifacts
├── kdes.in/                     # Production website source directory
│   ├── index.html               # Homepage with hero slider, featured instruments & quote form
│   ├── about.html               # Corporate profile, certifications & background
│   ├── contact.html             # Contact details, registered addresses & inquiry form
│   ├── catalogue.html           # Full equipment catalogue directory
│   ├── product-cat*.html        # Category landing pages
│   ├── product-subcat*.html     # Subcategory instrument listing pages
│   ├── product-details*.html    # 25 individual instrument specification pages
│   ├── sendmail.php             # PHP inquiry processor & email dispatcher
│   ├── css/
│   │   ├── modern-revamp.css    # Primary design tokens, light/dark themes & responsive layouts
│   │   └── style.css            # Base styles & icons
│   └── js/
│       ├── form-handler.js      # AJAX form submission, modals & mailto fallbacks
│       ├── theme-toggle.js      # Light / Dark / System theme switcher
│       └── scroll-animate.js    # Scroll reveal animations
├── scripts/
│   ├── serve.js                 # Local Node.js development server with sendmail mock API
│   ├── build.js                 # Static distribution bundler (outputs to dist/)
│   ├── lint.js                  # Automated DOCTYPE and required files linter
│   ├── revamp_all_products.js   # Product pages batch updater
│   └── update_static_nav_footer.js # Global nav & footer synchronizer
└── test/
    └── site.test.js             # Automated test suite (13 comprehensive assertions)
```

---

## 🛠️ Technology Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design Tokens), Vanilla JavaScript (ES6+)
- **Backend / Mail Handler**: PHP 7.4+ / 8.x (`mail()` function with multipart MIME headers)
- **Local Dev Server**: Node.js (`http`, `fs`, `path`, `querystring`)
- **Testing**: Node.js Native Test Runner (`node --test`)
- **Icons & Typography**: Font Awesome 5 & 6, Google Fonts (*Outfit*, *Plus Jakarta Sans*, *Inter*)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [PHP](https://www.php.net/) (optional for local PHP CLI; Node.js dev server includes a built-in mock mailer)

### Installation

Clone the repository and inspect the dependencies:

```bash
git clone https://github.com/gautam303in/KDES.git
cd KDES
```

### Running Locally

Start the local development server:

```bash
npm run dev
```

The server will boot at:
👉 **`http://localhost:3000/`** (or `http://localhost:3000/kdes.in/`)

The local server automatically handles static file routing and simulates `POST /sendmail.php` submissions, printing formatted lead details directly to your terminal and persisting records to `kdes.in/inquiries_backup.json`.

---

## 🧪 Testing & Validation

### Run Automated Tests

Execute the 13 automated tests covering navigation, all 25 products, theme configuration, and email routing:

```bash
npm test
```

### Run Linter

Verify project file structure and HTML standards:

```bash
npm run lint
```

### Build Production Bundle

To build a clean production release into the `dist/` directory:

```bash
npm run build
```

---

## 📧 Email Configuration & Deployment

### Destination Recipient
All inquiry forms dynamically forward to:
- **`shiven.k@aol.in`**

### Live Server Deployment (Apache / Nginx / cPanel)
1. Deploy the contents of `kdes.in/` (or the output of `npm run build`) to your public web root (`public_html` or `/var/www/html`).
2. Ensure the PHP environment has `mail()` enabled and a local MTA (`sendmail`, `postfix`, or `msmtp`) configured.
3. If hosting rejects mail sent via the PHP internal `mail()` function, configure your server's `php.ini` with standard sendmail parameters:
   ```ini
   sendmail_path = "/usr/sbin/sendmail -t -i"
   ```
4. Inquiries will automatically be backed up to `inquiries_backup.json` on the server for auditing.

---

## 🔬 Product Directory & Categories

The website catalogs 25 precision models across 8 core categories:

1. **Lab Instruments**: Conductivity Meter, Curculating Water Bath, Digital DO Meter
2. **Hydrological Products (CGWA Compliant)**: RTU Unit For Water Flow Meter, Ground Water Level Recorder, Electromagnetic Water Flowmeter
3. **Air Quality Products (CPCB Compliant)**: Handy Sampler GTI-221, High Volume Sampler GTI-251, Respirable Dust Sampler APM 151 BL, Stack Sampler GTI-121
4. **Water Testing Instruments**: Biological Safety Cabinet, COD Digestion Apparatus, Colony Counter Digital
5. **Environmental Instruments**: All Glass Distillation Unit (Quartz Tube, Vertical Type), Autoclave Vertical, B.O.D. Incubators
6. **Spare & Consumables**: Ice Flaking Machine, Laboratory Stirrer, Laminar Air Flow Cabinet (Vertical)
7. **Calibration Services**: Heating Mantle, Hot Plate Rectangular, Hot Plate Round
8. **Servicing & Maintenance**: Magnetic Stirrers, Muffle Furnace, Oil Bath High Temperature

---

## 🏢 Company & Contact Information

- **Company**: K D Engineering Solutions (KDES)
- **Registered Address**: A-158, Street no.8, Meet Nagar, Delhi: 110094
- **Office Address**: 185/30-B, Krishna Gali No.-6, Adarsh Mohalla, Maujpur, Delhi 110053
- **General Inquiries**: [kdes2017@gmail.com](mailto:kdes2017@gmail.com)
- **Enquiry Routing**: [shiven.k@aol.in](mailto:shiven.k@aol.in)
- **Phone**: [+91-9555498906](tel:+919555498906) &bull; **WhatsApp Desk**: [+91 95820 43336](https://wa.me/919582043336)

---

## 📄 License & Attribution

&copy; 2026 - Copyright & Maintained by **JSAlphaSoft Pvt Ltd**. All rights reserved.
