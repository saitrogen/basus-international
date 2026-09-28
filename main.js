// ============================================================
// BASUS International v2.0 — main.js
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll ──────────────────────────────────────────
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // ── Active nav link via IntersectionObserver ───────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const navObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, { threshold: 0.3, rootMargin: '-72px 0px 0px 0px' });

  sections.forEach(s => navObs.observe(s));

  // ── Mobile menu ────────────────────────────────────────────
  const burger = document.getElementById('burger');
  const mobileNav = document.getElementById('nav-mobile');

  const toggleMenu = (open) => {
    burger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  burger.addEventListener('click', () => toggleMenu(!burger.classList.contains('open')));
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggleMenu(false); });

  // ── Scroll reveal ──────────────────────────────────────────
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── Smooth scroll ──────────────────────────────────────────
  const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
    });
  });

  // ── Contact form → mailto ──────────────────────────────────
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name    = document.getElementById('name').value.trim();
      const company = document.getElementById('company').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      const subject = encodeURIComponent(`Sourcing Enquiry — ${company || name}`);
      const body    = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:contact@basusin.com?subject=${subject}&body=${body}`;
    });
  }

  // ── Footer year ────────────────────────────────────────────
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

});
