/**
 * ZenPhysic — main.js
 * Scroll animations · Nav state · Mobile menu · Waitlist form
 */

'use strict';

/* ── Scroll Reveal ──────────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(el => observer.observe(el));
})();


/* ── Nav scroll state ───────────────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ── Mobile hamburger menu ──────────────────────────────────────── */
(function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.nav__mobile-link, .nav__mobile .btn');

  if (!hamburger || !mobileMenu) return;

  function toggle(open) {
    hamburger.classList.toggle('is-open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    mobileMenu.classList.toggle('is-open', open);
    mobileMenu.setAttribute('aria-hidden', String(!open));
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    toggle(!isOpen);
  });

  // Close menu when any link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();


/* ── Smooth scroll for anchor links ────────────────────────────── */
(function initSmoothScroll() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;

    e.preventDefault();

    const navHeight = document.getElementById('nav')?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;

    window.scrollTo({ top, behavior: 'smooth' });
  });
})();


/* ── Waitlist form ──────────────────────────────────────────────── */
(function initWaitlistForm() {
  const form       = document.getElementById('waitlistForm');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const successEl  = document.getElementById('formSuccess');
  const errorEl    = document.getElementById('formError');
  const errorMsg   = document.getElementById('formErrorMsg');

  if (!form) return;

  function setLoading(loading) {
    submitBtn.disabled = loading;
    btnText.hidden   = loading;
    btnLoading.hidden = !loading;
  }

  function showSuccess() {
    form.querySelectorAll('input, button').forEach(el => el.disabled = true);
    successEl.hidden = false;
    errorEl.hidden   = true;
    // Smoothly scroll to success message
    successEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function showError(msg) {
    errorEl.hidden  = false;
    errorMsg.textContent = msg || 'Something went wrong. Please try again.';
    setLoading(false);
  }

  function validate() {
    let valid = true;

    const firstName = form.elements['firstName'];
    const email     = form.elements['email'];

    // Reset previous invalid state
    [firstName, email].forEach(el => el.classList.remove('is-invalid'));

    if (!firstName.value.trim()) {
      firstName.classList.add('is-invalid');
      firstName.focus();
      valid = false;
    }

    if (!email.value.trim() || !email.value.includes('@') || !email.value.includes('.')) {
      email.classList.add('is-invalid');
      if (valid) email.focus(); // only focus if first field was valid
      valid = false;
    }

    return valid;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.hidden = true;

    if (!validate()) return;

    setLoading(true);

    const data = {
      firstName: form.elements['firstName'].value.trim(),
      email:     form.elements['email'].value.trim(),
      goal:      form.elements['goal']?.value ?? '',
      timestamp: new Date().toISOString(),
      source:    window.location.hostname,
    };

    try {
      /**
       * ── Production integration ──────────────────────────────────
       * Replace the simulated fetch below with your actual endpoint.
       *
       * Options:
       *  A) Formspree:   https://formspree.io/f/{your-id}
       *  B) Outseta:     POST to your Outseta list API
       *  C) Netlify Forms: add data-netlify="true" to <form>
       *  D) Custom API:  POST to your backend
       *
       * Example (Formspree):
       *   const res = await fetch('https://formspree.io/f/YOUR_ID', {
       *     method: 'POST',
       *     headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
       *     body: JSON.stringify(data),
       *   });
       *   if (!res.ok) throw new Error('Network response was not ok');
       * ────────────────────────────────────────────────────────────
       */

      // Simulated network delay for demo (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Log submission for GitHub Pages demo
      console.log('Waitlist submission:', data);

      showSuccess();

    } catch (err) {
      console.error('Form submission error:', err);
      showError('We couldn\'t add you to the list right now. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  });

  // Clear invalid state on input
  form.addEventListener('input', (e) => {
    e.target.classList.remove('is-invalid');
    errorEl.hidden = true;
  });
})();


/* ── FAQ keyboard accessibility ─────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq__question').forEach(summary => {
    summary.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.key === ' ') e.preventDefault();
        summary.click();
      }
    });
  });
})();


/* ── Active nav link highlight on scroll ────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { rootMargin: '-40% 0px -50% 0px' }
  );

  sections.forEach(section => observer.observe(section));
})();
