/**
 * K D Engineering Solutions (kdes.in)
 * Client-Side Cyber Security & Anti-Cloning Guard
 * Features:
 * - Anti-Clickjacking & Frame-Busting Guard
 * - External Link Referrer Sanitization (rel="noopener noreferrer")
 * - Dynamic Anti-Spam Honeypot Field Injection
 * - Asset Drag & Scraping Deterrent
 * - Tamper-Evident Integrity Signature
 */

(function () {
    'use strict';

    // 1. Anti-Clickjacking / Frame-Busting Protection
    // Prevents displaying the site inside unauthorized third-party iframes / phishing wrappers
    try {
        if (window.top !== window.self) {
            var isAuthorizedHost = false;
            try {
                var topHost = window.top.location.hostname;
                if (topHost === window.location.hostname || topHost === 'localhost' || topHost === '127.0.0.1') {
                    isAuthorizedHost = true;
                }
            } catch (err) {
                // Cross-origin restriction triggered: iframe is strictly on an untrusted external origin
                isAuthorizedHost = false;
            }

            if (!isAuthorizedHost) {
                window.top.location = window.self.location.href;
            }
        }
    } catch (e) {
        // Fallback frame breakout
        if (window.top && window.top.location) {
            window.top.location = window.location.href;
        }
    }

    // 2. Tamper-Evident Brand Integrity Seal
    try {
        if (!window.__KDES_SECURITY__) {
            Object.defineProperty(window, '__KDES_SECURITY__', {
                value: Object.freeze({
                    organization: 'K D Engineering Solutions',
                    authorizedDomain: 'kdes.in',
                    copyright: '2026 - Maintained by JSAlphaSoft Pvt Ltd',
                    status: 'Protected - Anti-Cloning Guard Active',
                    version: '2.4.0-hardened'
                }),
                writable: false,
                configurable: false,
                enumerable: true
            });
        }
    } catch (e) {
        // Ignore if already sealed
    }

    // 3. DOM Security Initializer
    function initializeSecurityGuard() {
        // A. Sanitize all outgoing links to prevent tab-nabbing / reverse window manipulation
        var externalLinks = document.querySelectorAll('a[href^="http://"], a[href^="https://"]');
        for (var i = 0; i < externalLinks.length; i++) {
            var link = externalLinks[i];
            var href = link.getAttribute('href') || '';
            var isInternal = href.indexOf(window.location.hostname) !== -1 || href.indexOf('localhost') !== -1;
            if (!isInternal) {
                var rel = link.getAttribute('rel') || '';
                var relParts = rel.split(' ').filter(Boolean);
                if (relParts.indexOf('noopener') === -1) relParts.push('noopener');
                if (relParts.indexOf('noreferrer') === -1) relParts.push('noreferrer');
                link.setAttribute('rel', relParts.join(' '));
            }
        }

        // B. Inject Anti-Bot Honeypot Field into all forms
        var forms = document.querySelectorAll('form[action*="sendmail.php"], .quote-form-card, form');
        for (var f = 0; f < forms.length; f++) {
            var form = forms[f];
            if (!form.querySelector('input[name="_kdes_security_hp"]')) {
                var hpWrapper = document.createElement('div');
                hpWrapper.setAttribute('aria-hidden', 'true');
                hpWrapper.style.cssText = 'display:none!important;position:absolute!important;left:-9999px!important;opacity:0!important;pointer-events:none!important;';
                
                var hpInput = document.createElement('input');
                hpInput.type = 'text';
                hpInput.name = '_kdes_security_hp';
                hpInput.tabIndex = -1;
                hpInput.setAttribute('autocomplete', 'off');
                hpInput.value = '';
                
                hpWrapper.appendChild(hpInput);
                form.appendChild(hpWrapper);
            }
        }

        // C. Deter automated image dragging & asset ripping
        var images = document.querySelectorAll('.service-card img, .hero-slide img, .product-detail-visual img, img');
        for (var imgIdx = 0; imgIdx < images.length; imgIdx++) {
            images[imgIdx].setAttribute('draggable', 'false');
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSecurityGuard);
    } else {
        initializeSecurityGuard();
    }
})();
