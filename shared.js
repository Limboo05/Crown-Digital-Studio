/* ============================================================
   CROWN DIGITAL SOLUTIONS — SHARED JS v5
   Dropdown nav · Logo switching · Mobile accordion dropdown
============================================================ */

/* ── THEME (runs immediately, before DOM) ── */
(function(){
  try {
    const saved = localStorage.getItem('cs-theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  } catch(e) {}
})();

/* ── LOADER ── */
function dismissLoader() {
  const loader = document.getElementById('cs-loader');
  if (!loader) return;
  if (loader.dataset.dismissed) return;
  loader.dataset.dismissed = 'true';
  loader.classList.add('ld-out');
  setTimeout(() => {
    loader.style.display = 'none';
    try { loader.remove(); } catch(e){}
  }, 850);
}

(function() {
  const DISMISS_AFTER = 2500;
  setTimeout(dismissLoader, DISMISS_AFTER);

  /* ── HARD FAILSAFE: always dismiss on window load (catches local file:// issues) ── */
  window.addEventListener('load', function() {
    setTimeout(dismissLoader, 400);
  });
  /* ── NUCLEAR FALLBACK: 4s no matter what ── */
  setTimeout(dismissLoader, 4000);

  function runCounter() {
    const pEl = document.getElementById('ld-pct');
    if (!pEl) return;
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.floor(Math.random() * 7 + 3));
      try { pEl.textContent = p + '%'; } catch(e) {}
      if (p >= 100) clearInterval(iv);
    }, 60);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCounter);
  } else {
    runCounter();
  }
})();

/* ── MAIN INIT ── */
function csInit() {

/* ── CURSOR ── */
const cur = document.getElementById('cs-cursor');
const ring = document.getElementById('cs-ring');
if (cur && ring) {
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px'; cur.style.top = my + 'px';
    setTimeout(() => {
      try { ring.style.left = mx + 'px'; ring.style.top = my + 'px'; } catch(e){}
    }, 80);
  });
  document.querySelectorAll('a,button,.service-card,.course-card,.spc,.sv-item,.team-card,.val-card,.gp-cell,[data-hover],.nav-dropdown a,.flip-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('c-hover'));
  });
}

/* ── NAV SCROLL ── */
const nav = document.getElementById('cs-nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links > li > a, .mob-nav > a').forEach(a => {
  const href = a.getAttribute('href') || '';
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

/* ── HAMBURGER ── */
const ham = document.getElementById('cs-ham');
const mobNav = document.getElementById('cs-mob-nav');
if (ham && mobNav) {
  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    mobNav.classList.toggle('open');
    document.body.style.overflow = mobNav.classList.contains('open') ? 'hidden' : '';
  });
  mobNav.querySelectorAll('a:not(.mob-dd-items a)').forEach(a => a.addEventListener('click', () => {
    ham.classList.remove('open');
    mobNav.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

/* ── MOBILE DROPDOWN ACCORDIONS ── */
document.querySelectorAll('.mob-dd-toggle').forEach(toggle => {
  toggle.addEventListener('click', () => {
    const items = toggle.nextElementSibling;
    if (!items) return;
    toggle.classList.toggle('open');
    items.classList.toggle('open');
  });
});

/* ── THEME TOGGLE ── */
document.querySelectorAll('.theme-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') || 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('cs-theme', next); } catch(e) {}
  });
});

/* ── SCROLL REVEAL ── */
if ('IntersectionObserver' in window) {
  const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        revObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
}

/* ── MARQUEE BUILD ── */
document.querySelectorAll('.cs-marquee-inner').forEach(inner => {
  const items = ['3D Animation', 'Motion Graphics', 'Character Rigging', 'Visual Storytelling', 'Video Editing', 'Brand Films', 'Autodesk Maya', 'Crown Studios'];
  [...items, ...items].forEach(t => {
    const d = document.createElement('div');
    d.className = 'cs-marquee-item';
    d.innerHTML = `${t}<span class="mdot"></span>`;
    inner.appendChild(d);
  });
});

/* ── COUNTER ── */
if ('IntersectionObserver' in window) {
  const cntObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target, target = +el.dataset.target, suf = el.dataset.suf || '';
        let v = 0;
        const step = Math.ceil(target / 50);
        const iv = setInterval(() => {
          v = Math.min(v + step, target);
          el.textContent = v + suf;
          if (v >= target) clearInterval(iv);
        }, 28);
        cntObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => cntObs.observe(el));
}

/* ── 3D TILT CARDS ── */
document.querySelectorAll('[data-tilt]').forEach(card => {
  const glow = card.querySelector('.c-glow');
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const cx = r.width / 2, cy = r.height / 2;
    const rx = (y - cy) / cy * -8, ry = (x - cx) / cx * 8;
    card.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
    if (glow) {
      glow.style.left = x + 'px';
      glow.style.top = y + 'px';
      glow.style.opacity = '1';
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateZ(0)';
    if (glow) glow.style.opacity = '0';
  });
});

/* ── AUTOPLAY VIDEOS (fix for background videos) ── */
document.querySelectorAll('video[autoplay]').forEach(v => {
  v.muted = true;
  v.setAttribute('playsinline', '');
  const tryPlay = () => v.play().catch(() => {});
  if (v.readyState >= 3) {
    tryPlay();
  } else {
    v.addEventListener('canplay', tryPlay, { once: true });
    v.load();
  }
});

} /* end csInit */

/* ── BOOT ── */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', csInit);
} else {
  csInit();
}
