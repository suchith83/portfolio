(function () {
  'use strict';

  const html = document.documentElement;
  const THEME_KEY = 'theme';

  function getPreferredTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'
      );
    }
  }

  function initTheme() {
    applyTheme(getPreferredTheme());
  }

  function toggleTheme() {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');

  function setMenuOpen(open) {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navMenu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  function closeMobileMenu() {
    setMenuOpen(false);
  }

  function handleNavClick(e) {
    const href = this.getAttribute('href');
    if (!href) return;

    // Same-page hash links: smooth scroll without fighting native behavior too hard
    if (href.startsWith('#')) {
      e.preventDefault();
      if (href === '#') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      }
    }

    closeMobileMenu();
  }

  const sections = document.querySelectorAll('main .section[id], header.hero[id]');
  const navLinks = document.querySelectorAll('.nav-link[href*="#"]');

  function updateActiveNav() {
    const scrollY = window.scrollY + 120;
    let current = '';

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollY >= top && scrollY < bottom) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href') || '';
      const hash = href.includes('#') ? href.slice(href.indexOf('#') + 1) : '';
      const isActive = hash && hash === current;
      link.classList.toggle('active', Boolean(isActive));
    });
  }

  function initClickableCards() {
    document.querySelectorAll('.project-card--hover').forEach((card) => {
      if (card.classList.contains('project-card--private')) return;
      const titleLink = card.querySelector('.project-title-link');
      if (!titleLink) return;

      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        window.open(titleLink.href, '_blank', 'noopener');
      });

      card.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (e.target !== card) return;
        e.preventDefault();
        window.open(titleLink.href, '_blank', 'noopener');
      });

      if (!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
      if (!card.hasAttribute('role')) card.setAttribute('role', 'link');
    });
  }

  function initReveals() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    items.forEach((el) => observer.observe(el));
  }

  function init() {
    initTheme();
    initClickableCards();
    initReveals();

    const themeBtn = document.querySelector('.theme-toggle');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    if (navToggle && navMenu) {
      navToggle.setAttribute('aria-controls', 'primary-nav');
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.id = navMenu.id || 'primary-nav';

      navToggle.addEventListener('click', () => {
        const open = navToggle.getAttribute('aria-expanded') !== 'true';
        setMenuOpen(open);
      });
    }

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', handleNavClick);
    });

    const logo = document.querySelector('.nav-logo');
    if (logo) {
      logo.addEventListener('click', (e) => {
        const href = logo.getAttribute('href') || '';
        if (href === '#' || href === '' || href.endsWith('index.html') || href === '/') {
          // On home, scroll to top; on other pages let navigation happen
          if (document.body.contains(document.querySelector('.hero')) && !href.includes('index') && href !== '/') {
            // already on index with href="#"
          }
          if (href === '#' || href === '') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeMobileMenu();
          }
        }
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

    document.addEventListener('click', (e) => {
      if (
        navMenu &&
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });

    updateActiveNav();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
