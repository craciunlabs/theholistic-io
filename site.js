// Shared behaviour for every page: theme toggle + hide-header-on-scroll.
// Page-specific logic (film facade, forms) stays inline on each page.
(function () {
  const t = document.querySelector('[data-theme-toggle]');
  const r = document.documentElement;
  let stored = null;
  try { stored = localStorage.getItem('theme'); } catch (e) {}
  let d = stored || r.getAttribute('data-theme') || (matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
  r.setAttribute('data-theme', d);

  function updateIcon() {
    if (!t) return;
    t.setAttribute('aria-label', 'Switch to ' + (d === 'dark' ? 'light' : 'dark') + ' mode');
    t.innerHTML = d === 'dark'
      ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }

  updateIcon();
  t && t.addEventListener('click', () => {
    d = d === 'dark' ? 'light' : 'dark';
    r.setAttribute('data-theme', d);
    try { localStorage.setItem('theme', d); } catch (e) {}
    updateIcon();
  });

  let lastScroll = 0;
  const header = document.getElementById('site-header');
  header && window.addEventListener('scroll', () => {
    const current = window.scrollY;
    if (current > lastScroll && current > 80) header.classList.add('site-header--hidden');
    else header.classList.remove('site-header--hidden');
    lastScroll = current;
  }, { passive: true });

  // Hero scroll hint (index only — no-op elsewhere).
  const hint = document.querySelector('.hero-scroll-hint');
  if (hint) {
    window.addEventListener('scroll', () => {
      hint.style.opacity = window.scrollY > 60 ? '0' : '1';
    }, { passive: true });
  }
})();
