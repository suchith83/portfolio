(function () {
  'use strict';

  const html = document.documentElement;

  function initTheme() {
    const saved = localStorage.getItem('theme');
    html.setAttribute('data-theme', saved || 'light');
  }

  function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function closeMobileMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
  }

  function handleNavClick(e) {
    const href = this.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    e.preventDefault();
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    }
    closeMobileMenu();
  }

  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    let current = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
        current = section.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  function initClickableCards() {
    document.querySelectorAll('.project-card--hover').forEach(card => {
      const titleLink = card.querySelector('.project-title-link');
      if (!titleLink) return;

      card.style.cursor = 'pointer';
      card.addEventListener('click', e => {
        // Let inner <a> tags (PR pills, title link itself) handle their own clicks
        if (e.target.closest('a')) return;
        window.open(titleLink.href, '_blank', 'noopener');
      });
    });
  }

  function init() {
    initTheme();

    initClickableCards();

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    if (navToggle) {
      navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
      });
    }

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', handleNavClick);
    });

    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.addEventListener('click', e => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateActiveNav();
          ticking = false;
        });
        ticking = true;
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileMenu();
    });

    document.addEventListener('click', e => {
      if (navMenu && navMenu.classList.contains('active') &&
          !navMenu.contains(e.target) &&
          !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
