/**
 * K D Engineering Solutions - Theme Mode Controller
 * Supports Light, Dark, and System modes with localStorage persistence
 * and OS preference change listener.
 */
(function() {
  'use strict';

  var THEME_STORAGE_KEY = 'kdes-theme-mode';

  function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function getSavedMode() {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY) || 'system';
    } catch (e) {
      return 'system';
    }
  }

  function setSavedMode(mode) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      // localStorage may be restricted in some environments
    }
  }

  function applyTheme(mode, persist) {
    if (persist !== false) {
      setSavedMode(mode);
    }

    var effectiveTheme = mode;
    if (mode === 'system') {
      effectiveTheme = getSystemTheme();
    }

    // Apply attribute to document root
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', effectiveTheme);
      document.documentElement.setAttribute('data-theme-mode', mode);
    }

    // Update active class in menu
    var options = document.querySelectorAll('.theme-option');
    options.forEach(function(opt) {
      var val = opt.getAttribute('data-mode') || opt.getAttribute('data-theme-val');
      if (val === mode) {
        opt.classList.add('active');
        opt.setAttribute('aria-selected', 'true');
      } else {
        opt.classList.remove('active');
        opt.setAttribute('aria-selected', 'false');
      }
    });

    // Update toggle button icon and title
    var btn = document.getElementById('themeToggleBtn');
    if (btn) {
      btn.setAttribute('data-current-mode', mode);
      var label = mode.charAt(0).toUpperCase() + mode.slice(1);
      btn.setAttribute('title', 'Current Theme: ' + label + ' (Click to change)');
      var tooltip = btn.querySelector('.floating-tooltip');
      if (tooltip) {
        tooltip.textContent = 'Theme: ' + label;
      }
    }
  }

  // Early apply to prevent flash
  var currentMode = getSavedMode();
  applyTheme(currentMode, false);

  // Initialize interactive controls on DOMContentLoaded
  function initThemeControls() {
    var toggleBtn = document.getElementById('themeToggleBtn');
    var menu = document.getElementById('themeMenu');
    var wrapper = document.querySelector('.theme-toggle-wrapper');

    if (!toggleBtn || !menu) return;

    // Apply current state to UI elements
    applyTheme(getSavedMode(), false);

    // Toggle menu on button click
    toggleBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    function openMenu() {
      menu.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      menu.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    // Option clicks
    var options = document.querySelectorAll('.theme-option');
    options.forEach(function(opt) {
      opt.addEventListener('click', function(e) {
        e.stopPropagation();
        var selectedMode = opt.getAttribute('data-mode') || opt.getAttribute('data-theme-val');
        if (selectedMode) {
          applyTheme(selectedMode, true);
        }
        closeMenu();
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function(e) {
      if (wrapper && !wrapper.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        closeMenu();
        toggleBtn.focus();
      }
    });

    // Listen for OS scheme changes
    if (window.matchMedia) {
      var colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
      var handler = function() {
        if (getSavedMode() === 'system') {
          applyTheme('system', false);
        }
      };
      if (colorSchemeQuery.addEventListener) {
        colorSchemeQuery.addEventListener('change', handler);
      } else if (colorSchemeQuery.addListener) {
        colorSchemeQuery.addListener(handler);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeControls);
  } else {
    initThemeControls();
  }
})();
