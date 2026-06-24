'use strict';

/* ── Hero wave ribbon ───────────────────────────────────────── */
(function initHeroWave() {
  const svg = document.getElementById('heroWave');
  if (!svg) return;

  const COUNT  = 28;
  const SPREAD = 220;

  for (let i = 0; i < COUNT; i++) {
    const t   = i / (COUNT - 1);           // 0 → 1
    const off = (t - 0.5) * SPREAD;        // -110 → +110

    // Colour: teal(0,212,170) → purple(129,140,248)
    const r = Math.round(0   + 129 * t);
    const g = Math.round(212 -  72 * t);
    const b = Math.round(170 +  78 * t);

    // Opacity: full in centre, fades at edges
    const opacity = (0.15 + 0.75 * (1 - Math.pow((t - 0.5) * 2, 2))).toFixed(2);

    // Quadratic arc: enters right-top, bows left through centre, exits right-bottom
    const x1 = 700, y1 = 80  + off;
    const cx = 180, cy = 300 + off * 0.4;   // control point
    const x2 = 700, y2 = 520 + off;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`);
    path.setAttribute('stroke', `rgb(${r},${g},${b})`);
    path.setAttribute('stroke-width', '1.6');
    path.setAttribute('fill', 'none');
    path.setAttribute('opacity', opacity);
    svg.appendChild(path);
  }
})();

/* ── Nav: scroll state + active link ───────────────────────── */
(function initNav() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = [];

  links.forEach(l => {
    const el = document.getElementById(l.getAttribute('href').slice(1));
    if (el) sections.push({ el, link: l });
  });

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      navbar.classList.toggle('scrolled', window.scrollY > 30);
      const mid = window.scrollY + window.innerHeight * 0.4;
      let active = null;
      sections.forEach(({ el }) => { if (el.offsetTop <= mid) active = el.id; });
      links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${active}`));
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ── Mobile nav ─────────────────────────────────────────────── */
(function initMobileNav() {
  const burger   = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');
  if (!burger || !navLinks) return;

  const close = () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => {
    if (!burger.contains(e.target) && !navLinks.contains(e.target)) close();
  });
})();

/* ── Smooth scroll ──────────────────────────────────────────── */
(function initScroll() {
  const navH = 64;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.getElementById(a.getAttribute('href').slice(1));
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - navH, behavior: 'smooth' });
    });
  });
})();

/* ── Fade-in on scroll ──────────────────────────────────────── */
(function initFade() {
  const obs = new IntersectionObserver(
    entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
})();

/* ── Stagger project cards ──────────────────────────────────── */
document.querySelectorAll('.projects-grid .pcard').forEach((el, i) => {
  el.style.transitionDelay = `${i * 75}ms`;
});

/* ── Animated counter (About section) ──────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.count-num');
  if (!counters.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const step   = 16;
      const inc    = target / (dur / step);
      let cur = 0;

      const tick = () => {
        cur = Math.min(cur + inc, target);
        el.textContent = Math.floor(cur);
        if (cur < target) setTimeout(tick, step);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => obs.observe(el));
})();
