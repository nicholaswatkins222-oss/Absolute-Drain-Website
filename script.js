/* ============================================================
   ABSOLUTE DRAIN SERVICE LLC — SCRIPT.JS
   ============================================================ */

/* ---- Config ---- */
const N8N_WEBHOOK_URL = 'https://nicholaswatkins.app.n8n.cloud/webhook/4274c139-e3ab-4814-babc-6476b84d46c6';

/* ---- Navbar: shrink on scroll ---- */
(function () {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  function tick() {
    if (window.scrollY > 40) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

/* ---- Mobile Menu ---- */
(function () {
  const burger     = document.querySelector('.navbar__hamburger');
  const menu       = document.querySelector('.mobile-menu');
  const closeBtn   = document.querySelector('.mobile-menu__close');
  if (!burger || !menu) return;

  function open() {
    menu.classList.add('open');
    burger.classList.add('active');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded', 'true');
  }
  function close() {
    menu.classList.remove('open');
    burger.classList.remove('active');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  if (closeBtn) closeBtn.addEventListener('click', close);

  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) { close(); burger.focus(); }
  });
})();

/* ---- Active nav link ---- */
(function () {
  const path  = window.location.pathname.replace(/\/$/, '') || '/';
  const file  = path.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.navbar__nav a, .mobile-menu nav a');

  links.forEach(a => {
    const href     = (a.getAttribute('href') || '').split('#')[0];
    const hFile    = href.split('/').pop() || 'index.html';
    const isHome   = ['', '/', 'index.html', './'].includes(href);
    const onHome   = ['', 'index.html'].includes(file);
    if (isHome ? onHome : hFile && hFile !== 'index.html' && file === hFile) {
      a.classList.add('active');
    }
  });
})();

/* ---- Smooth scroll for anchor links ---- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH  = document.querySelector('.navbar')?.offsetHeight || 72;
      const emH   = document.querySelector('.emergency-banner')?.offsetHeight || 44;
      const top   = target.getBoundingClientRect().top + window.scrollY - navH - emH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ---- Contact form ---- */
(function () {
  const form = document.querySelector('#contact-form');
  if (!form) return;

  const statusEl = document.createElement('p');
  statusEl.style.cssText = 'margin-top:1rem;font-weight:600;display:none;';
  form.appendChild(statusEl);

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
    btn.disabled  = true;
    statusEl.style.display = 'none';

    const data = {
      name:    form.querySelector('[name="full-name"]').value,
      phone:   form.querySelector('[name="phone"]').value,
      email:   form.querySelector('[name="email"]').value,
      address: form.querySelector('[name="address"]').value,
      service: form.querySelector('[name="service"]').value,
      urgency: form.querySelector('[name="urgency"]').value,
      message: form.querySelector('[name="message"]').value,
    };

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`Server responded with ${res.status}`);

      btn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
      btn.style.background = '#16a34a';
      statusEl.style.color   = '#16a34a';
      statusEl.textContent   = 'Thanks! We\'ll be in touch shortly.';
      statusEl.style.display = 'block';
      form.reset();

      setTimeout(() => {
        btn.innerHTML        = orig;
        btn.disabled         = false;
        btn.style.background = '';
        statusEl.style.display = 'none';
      }, 4000);

    } catch (err) {
      btn.innerHTML        = orig;
      btn.disabled         = false;
      statusEl.style.color   = '#dc2626';
      statusEl.textContent   = 'Something went wrong. Please call us at (775) 322-2727 or try again.';
      statusEl.style.display = 'block';
    }
  });
})();

/* ---- Entrance animations ---- */
(function () {
  if (!('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll(
    '.service-card, .why-card, .testimonial-card, .team-card, .blog-card, .cert-card, .value-card, .stat'
  );

  els.forEach((el, i) => {
    el.style.opacity   = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = `opacity .5s ease ${(i % 4) * 0.08}s, transform .5s cubic-bezier(.34,1.56,.64,1) ${(i % 4) * 0.08}s`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ---- Phone click logging (analytics hook) ---- */
document.querySelectorAll('a[href^="tel:"]').forEach(a => {
  a.addEventListener('click', () => {
    console.log('[ADS] Phone tap:', a.textContent.trim());
  });
});
