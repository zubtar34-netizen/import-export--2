/* ═══════════════════════════════════════════════════════════
   Global Trade Hub – script2.js
   Template 2: Editorial / Architectural Light Theme
════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. AOS
───────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 650,
    easing: 'ease-out-quart',
    once: true,
    offset: 60,
  });
});

/* ─────────────────────────────────────────
   2. Loader
───────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('out');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  }, 1900);
});

/* ─────────────────────────────────────────
   3. Custom Cursor
───────────────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth cursor ring follows with lag
const animCursor = () => {
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + 'px';
  cursor.style.top  = curY + 'px';
  requestAnimationFrame(animCursor);
};
animCursor();

// Grow cursor on interactive elements
document.querySelectorAll('a, button, input, textarea, select, .ind-item, .why-row, .srv-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '52px';
    cursor.style.height = '52px';
    cursor.style.background = 'rgba(232,75,26,0.08)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '32px';
    cursor.style.height = '32px';
    cursor.style.background = '';
  });
});

/* ─────────────────────────────────────────
   4. Navbar Scroll
───────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const updateNav = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', updateNav, { passive: true });
updateNav();

/* ─────────────────────────────────────────
   5. Hamburger
───────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
});

document.querySelectorAll('.mob-link, .mobile-menu-panel .btn-ember').forEach(el => {
  el.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ─────────────────────────────────────────
   6. Smooth Scroll
───────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─────────────────────────────────────────
   7. Animated Counters
───────────────────────────────────────── */
const fmtNum = (val, target) => {
  if (target >= 10000) return Math.round(val / 1000) + 'K+';
  if (target > 100) return Math.round(val) + '+';
  return Math.round(val);
};

const animCounter = (el, target, duration = 1800) => {
  const start = performance.now();
  const tick = now => {
    const p = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - p, 4); // ease-out-quart
    el.textContent = fmtNum(ease * target, target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = fmtNum(target, target);
  };
  requestAnimationFrame(tick);
};

const counterEls = document.querySelectorAll('.counter-num[data-target]');
if (counterEls.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting && !en.target.dataset.done) {
        en.target.dataset.done = '1';
        animCounter(en.target, parseInt(en.target.dataset.target, 10));
      }
    });
  }, { threshold: 0.5 });
  counterEls.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────
   8. Testimonial Slider
───────────────────────────────────────── */
(() => {
  const track  = document.getElementById('testiTrack');
  const prev   = document.getElementById('tPrev');
  const next   = document.getElementById('tNext');
  const dotsW  = document.getElementById('tDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testi-card');
  let cur = 0, auto;

  const perView = () => window.innerWidth >= 768 ? 2 : 1;
  const total   = () => Math.ceil(cards.length / perView());

  const buildDots = () => {
    dotsW.innerHTML = '';
    for (let i = 0; i < total(); i++) {
      const d = document.createElement('div');
      d.className = 'testi-dot' + (i === cur ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsW.appendChild(d);
    }
  };

  const updateDots = () => {
    dotsW.querySelectorAll('.testi-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
  };

  const goTo = i => {
    cur = ((i % total()) + total()) % total();
    const w = cards[0].offsetWidth + 24;
    track.style.transform = `translateX(-${cur * perView() * w}px)`;
    updateDots();
  };

  prev?.addEventListener('click', () => { goTo(cur - 1); resetAuto(); });
  next?.addEventListener('click', () => { goTo(cur + 1); resetAuto(); });

  const startAuto = () => { auto = setInterval(() => goTo(cur + 1), 5500); };
  const resetAuto = () => { clearInterval(auto); startAuto(); };

  // Swipe
  let sx = 0;
  track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend',   e => {
    const dx = sx - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 45) dx > 0 ? goTo(cur + 1) : goTo(cur - 1);
  });

  let rt;
  window.addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { buildDots(); goTo(0); }, 200);
  });

  buildDots();
  startAuto();
})();

/* ─────────────────────────────────────────
   9. Contact Form
───────────────────────────────────────── */
const form       = document.getElementById('contactForm');
const btnTxt     = document.getElementById('formBtnText');
const successMsg = document.getElementById('formSuccess');

form?.addEventListener('submit', async e => {
  e.preventDefault();

  const fields = {
    name:    form.querySelector('[name="name"]'),
    email:   form.querySelector('[name="email"]'),
    message: form.querySelector('[name="message"]'),
  };

  let ok = true;
  Object.values(fields).forEach(f => {
    if (!f.value.trim()) {
      f.style.borderBottomColor = 'rgba(232,75,26,0.8)';
      ok = false;
    } else {
      f.style.borderBottomColor = '';
    }
  });
  if (!ok) return;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
    fields.email.style.borderBottomColor = 'rgba(232,75,26,0.8)';
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  btnTxt.textContent = 'SENDING…';
  btn.disabled = true;

  await new Promise(r => setTimeout(r, 1600));

  btnTxt.textContent = 'SENT ✓';
  successMsg.classList.remove('hidden');
  form.reset();

  setTimeout(() => {
    btnTxt.textContent = 'SEND MESSAGE →';
    btn.disabled = false;
    successMsg.classList.add('hidden');
  }, 5000);
});

/* ─────────────────────────────────────────
   10. Back to Top
───────────────────────────────────────── */
const btt = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  btt?.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
btt?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ─────────────────────────────────────────
   11. Parallax hero image (subtle)
───────────────────────────────────────── */
const heroImg = document.querySelector('.hero-img-panel img');
if (heroImg) {
  window.addEventListener('scroll', () => {
    if (window.scrollY < window.innerHeight * 1.2) {
      heroImg.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }
  }, { passive: true });
}

/* ─────────────────────────────────────────
   12. Active nav link on scroll
───────────────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      navLinks.forEach(l => {
        const active = l.getAttribute('href') === `#${en.target.id}`;
        l.style.color = active ? 'var(--ember)' : '';
      });
    }
  });
}, { threshold: 0.45 }).observe && sections.forEach(s => {
  new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        navLinks.forEach(l => {
          l.style.color = l.getAttribute('href') === `#${en.target.id}` ? 'var(--ember)' : '';
        });
      }
    });
  }, { threshold: 0.45 }).observe(s);
});

console.log('%cGlobal Trade Hub 🔶 Template 2 — Editorial Edition', 'color:#E84B1A;font-size:13px;font-weight:bold;');
