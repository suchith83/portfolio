/**
 * suchith.space — interactive behaviors
 * Scroll reveals, cursor glow, scroll progress, theme toggle, nav
 */
(function () {
  'use strict';

  // ===== Theme =====
  const html = document.documentElement;

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) {
      html.setAttribute('data-theme', saved);
    } else {
      html.setAttribute('data-theme', 'dark');
    }
  }

  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);

    // Rotate the toggle button
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.style.transform = 'rotate(180deg)';
      setTimeout(() => { btn.style.transform = ''; }, 400);
    }
  }

  // ===== Mobile Nav =====
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function toggleMobileMenu() {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  // ===== Smooth Scroll =====
  function handleNavClick(e) {
    const href = this.getAttribute('href');
    if (!href.startsWith('#')) return; // Let normal links work
    e.preventDefault();

    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  }

  // ===== Active Nav Link =====
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  // ===== Scroll Progress Bar =====
  const progressBar = document.querySelector('.scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) {
      progressBar.style.width = progress + '%';
    }
  }

  // ===== Scroll Reveal (IntersectionObserver) =====
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-heading, .reveal-prose, .reveal-block, .reveal-card');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.15
    });

    revealElements.forEach((el, index) => {
      // Add stagger delay for cards
      if (el.classList.contains('reveal-card')) {
        const cardIndex = Array.from(document.querySelectorAll('.reveal-card')).indexOf(el);
        el.style.transitionDelay = `${cardIndex * 60}ms`;
      }

      // Stagger featured project blocks
      if (el.classList.contains('reveal-block') && el.classList.contains('project-featured')) {
        const blockIndex = Array.from(document.querySelectorAll('.project-featured')).indexOf(el);
        el.style.transitionDelay = `${blockIndex * 100}ms`;
      }

      observer.observe(el);
    });
  }

  // ===== Hero Subtitle Clip-Path Reveal =====
  function initHeroAnimation() {
    const subtitleText = document.querySelector('.hero-subtitle-text');
    const cursor = document.querySelector('.hero-cursor');

    if (subtitleText && cursor) {
      // Start cursor blinking after subtitle animation starts
      setTimeout(() => {
        cursor.classList.add('visible');
      }, 500);

      // Reveal the subtitle text
      setTimeout(() => {
        subtitleText.classList.add('revealed');
      }, 600);

      // Hide cursor after reveal completes
      setTimeout(() => {
        cursor.classList.add('hidden');
        cursor.classList.remove('visible');
      }, 2200);
    }
  }

  // ===== Event Listeners =====
  function initEvents() {
    // Theme toggle
    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    // Mobile menu
    if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);

    // Nav links smooth scroll
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    // Logo click
    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Scroll events (throttled)
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          updateScrollProgress();
          ticking = false;
        });
        ticking = true;
      }
    });

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileMenu();
    });

    // Close mobile menu on outside click
    document.addEventListener('click', (e) => {
      if (navMenu && navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Escape closes mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
  }

  // ===== Init =====
  function init() {
    initTheme();
    initEvents();
    initScrollReveal();
    initHeroAnimation();

    // Initial scroll progress
    updateScrollProgress();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
