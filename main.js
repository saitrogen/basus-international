'use strict';

const burger = document.getElementById('burger');
const mobileNav = document.getElementById('nav-mobile');
const desktop = window.matchMedia('(min-width: 1101px)');
burger.hidden = false;

function setMenu(open, restoreFocus = false) {
  mobileNav.hidden = !open;
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  if (restoreFocus) burger.focus();
}

burger.addEventListener('click', () => setMenu(mobileNav.hidden));
document.getElementById('nav').addEventListener('click', event => {
  if (event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !mobileNav.hidden) setMenu(false, true);
});
document.addEventListener('click', event => {
  if (!document.getElementById('nav').contains(event.target)) setMenu(false);
});
document.getElementById('nav').addEventListener('focusout', event => {
  if (!event.currentTarget.contains(event.relatedTarget)) setMenu(false);
});
desktop.addEventListener('change', () => setMenu(false));

// Native fragment links preserve browser history and reduced-motion preferences.
if ('IntersectionObserver' in window) {
  const navLinks = document.querySelectorAll('.nav-links a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => {
        if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-100px 0px -55% 0px', threshold: 0 });
  document.querySelectorAll('main > section[id]').forEach(section => observer.observe(section));
}

const form = document.getElementById('contactForm');
const product = document.getElementById('product');
const draft = document.getElementById('email-draft');
const draftText = document.getElementById('draft-text');
const draftStatus = document.getElementById('draft-status');
const openEmail = document.getElementById('open-email');
const recipient = 'info@basusinternational.com';

// Trim before native validation so a whitespace-only requirement cannot pass.
['name', 'email', 'message'].forEach(id => {
  const input = document.getElementById(id);
  input.addEventListener('input', () => {
    input.setCustomValidity(input.value.trim() ? '' : 'Please complete this field.');
  });
});

document.querySelectorAll('[data-product]').forEach(link => {
  link.addEventListener('click', () => {
    product.value = link.dataset.product;
    draft.hidden = true;
  });
});
form.addEventListener('input', event => {
  // A changed requirement must not leave an outdated email link available.
  if (event.target !== draftText) draft.hidden = true;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const fields = new FormData(form);
  const name = fields.get('name').trim();
  const company = fields.get('company').trim();
  const subject = `Supply Requirement — ${fields.get('product') || 'Custom Electrical Components'} — ${company || name}`;
  const body = `Name: ${name}\nCompany: ${company || 'Not specified'}\nWork email: ${fields.get('email').trim()}\nProduct: ${fields.get('product') || 'To discuss'}\n\nRequirement details:\n${fields.get('message').trim()}\n\nDrawings and specifications can be attached to this email before sending.`;
  draftText.value = `To: ${recipient}\nSubject: ${subject}\n\n${body}`;
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // shortcut: email apps have different URL limits; long drafts must use copy and webmail.
  openEmail.hidden = mailto.length > 1800;
  if (openEmail.hidden) openEmail.removeAttribute('href');
  else openEmail.href = mailto;
  draftStatus.textContent = openEmail.hidden
    ? 'This draft is too long for a reliable email link. Copy it into your email service and attach your drawings.'
    : 'Opening your email app does not send the enquiry. Review and send it there.';
  draft.hidden = false;
  document.getElementById('draft-heading').focus();
});
document.getElementById('copy-enquiry').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(draftText.value);
    draftStatus.textContent = 'Draft copied. Paste it into your email service, attach your drawings and send it to BASUS.';
  } catch {
    draftText.focus();
    draftText.select();
    draftStatus.textContent = 'Copy is unavailable. The draft is selected; use your device’s Copy command.';
  }
});
document.getElementById('form-submit').disabled = false;
document.getElementById('year').textContent = new Date().getFullYear();
