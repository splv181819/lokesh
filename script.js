/* ═══════════════════════════════════════════
   V.L. SATYANATH — FULL STACK PORTFOLIO JS
   Features: Particle canvas, typewriter, 3D tilt,
   scroll reveal, counter, terminal animation,
   custom cursor, loader, glitch trigger, nav
   ═══════════════════════════════════════════ */

'use strict';

// ─── LOADER ───────────────────────────────────────────────────────────────────
(function runLoader() {
  const loader = document.getElementById('loader');
  const bar    = document.querySelector('.loader-bar');
  const pct    = document.getElementById('loader-pct');
  let p = 0;
  const interval = setInterval(() => {
    p += Math.random() * 18;
    if (p >= 100) { p = 100; clearInterval(interval); setTimeout(finishLoader, 350); }
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p);
  }, 80);
  function finishLoader() {
    loader.classList.add('done');
    initAll();
  }
})();

function initAll() {
  initCursor();
  initCanvas();
  initTypewriter();
  initTerminal();
  initNavScroll();
  initHamburger();
  initReveal();
  initSkillBars();
  initCounters();
  initTilt();
  initActiveNav();
}

// ─── CUSTOM CURSOR (disabled) ─────────────────────────────────────────────────
function initCursor() {
  // Custom cursor removed — using default browser pointer
}

// ─── PARTICLE / CODE RAIN CANVAS ──────────────────────────────────────────────
function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], cols, drops = [];

  // Resize
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    cols  = Math.floor(W / 22);
    drops = new Array(cols).fill(0).map(() => Math.random() * -100);
    buildParticles();
  }

  // Floating geometric particles
  function buildParticles() {
    particles = [];
    const count = Math.min(80, Math.floor((W * H) / 14000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.5 + 0.4,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }
  }

  const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ</>{}[]';

  function draw() {
    // Fade trail
    ctx.fillStyle = 'rgba(5,5,16,0.05)';
    ctx.fillRect(0, 0, W, H);

    // Matrix rain — very faint
    ctx.font = '13px "Space Mono", monospace';
    for (let i = 0; i < cols; i++) {
      const char = CHARS[Math.floor(Math.random() * CHARS.length)];
      const x = i * 22;
      const y = drops[i] * 22;
      const alpha = Math.random() * 0.12 + 0.03;
      ctx.fillStyle = `rgba(0,255,200,${alpha})`;
      ctx.fillText(char, x, y);
      if (y > H && Math.random() > 0.975) drops[i] = 0;
      drops[i] += 0.5;
    }

    // Floating dots + connections
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,255,200,${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          const a = (1 - dist / 120) * 0.08;
          ctx.strokeStyle = `rgba(0,255,200,${a})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ─── TYPEWRITER ───────────────────────────────────────────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const phrases = [
    'Full Stack Developer',
    'Data Science Enthusiast',
    'ML Engineer',
    'Problem Solver',
    'CS Undergrad @ LPU',
  ];
  let pi = 0, ci = 0, deleting = false;
  const speed = { type: 70, delete: 35, pause: 1800, pauseEmpty: 500 };

  function type() {
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; setTimeout(type, speed.pause); return; }
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, speed.pauseEmpty);
        return;
      }
    }
    setTimeout(type, deleting ? speed.delete : speed.type);
  }
  type();
}

// ─── TERMINAL ANIMATION ───────────────────────────────────────────────────────
function initTerminal() {
  const sequences = [
    { id: 'tOut1', text: 'V.L.Satyanath — Full Stack Developer', delay: 600 },
    { id: 'tLine2', text: '$ cat skills.txt', prompt: true, delay: 1200 },
    { id: 'tOut2', text: 'Python, Java, C++, React, SQL, NumPy...', delay: 1800 },
    { id: 'tLine3', text: '$ ls projects/', prompt: true, delay: 2600 },
    { id: 'tOut3', text: 'spam_detector/  adidas_analysis/  ...', delay: 3200 },
    { id: 'tLine4', text: '$ echo $STATUS', prompt: true, delay: 4000 },
    { id: 'tOut4', text: '✓ Available for opportunities', delay: 4700 },
  ];

  sequences.forEach(({ id, text, prompt, delay }) => {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      if (prompt) {
        el.innerHTML = `<span class="t-prompt">$</span> <span class="t-cmd">${text.replace('$ ', '')}</span>`;
      } else {
        typeInto(el, text);
      }
    }, delay);
  });
}

function typeInto(el, text, speed = 25) {
  let i = 0;
  const interval = setInterval(() => {
    el.textContent += text[i++];
    if (i === text.length) clearInterval(interval);
  }, speed);
}

// ─── NAV SCROLL EFFECT ────────────────────────────────────────────────────────
function initNavScroll() {
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
  });

  menu.querySelectorAll('.mob-link').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  const io  = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('visible'), Number(delay) + idx * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
}

// ─── SKILL BARS ───────────────────────────────────────────────────────────────
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const io    = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.dataset.w;
        entry.target.style.width = w + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => io.observe(f));
}

// ─── COUNTERS ─────────────────────────────────────────────────────────────────
function initCounters() {
  const nums = document.querySelectorAll('.hstat-n');
  const io   = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600; // total ms
      const fps    = 60;
      const frames = Math.round(dur / (1000 / fps));
      let frame    = 0;
      const tick   = setInterval(() => {
        frame++;
        // ease-out curve
        const progress = 1 - Math.pow(1 - frame / frames, 3);
        el.textContent  = Math.round(progress * target);
        if (frame >= frames) { el.textContent = target; clearInterval(tick); }
      }, 1000 / fps);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => io.observe(n));
}

// ─── 3D TILT ──────────────────────────────────────────────────────────────────
function initTilt() {
  // Only apply tilt to stack cards, NOT project flip cards (they have their own flip transform)
  const cards = document.querySelectorAll('.stack-card[data-tilt]');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -6;
      const tiltY = dx *  6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.4s ease';
      card.style.transform  = '';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
}

// ─── ACTIVE NAV ───────────────────────────────────────────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.style.color = '');
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.style.color = 'var(--cyan)';
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));
}

// ─── FORM SUBMIT ──────────────────────────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn  = e.target.querySelector('.form-btn');
  const span = btn.querySelector('span');
  btn.disabled = true;
  span.textContent = 'Sending...';
  setTimeout(() => {
    span.textContent = '✓ Message Sent!';
    btn.style.background = '#00ffc8';
    btn.style.color = '#050510';
    setTimeout(() => {
      span.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
      e.target.reset();
    }, 3000);
  }, 1200);
}

// ─── GLITCH ON CLICK ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const glitch = document.querySelector('.glitch');
  if (glitch) {
    glitch.addEventListener('click', () => {
      glitch.classList.remove('glitch-active');
      void glitch.offsetWidth; // force reflow to restart animation
      glitch.classList.add('glitch-active');
      setTimeout(() => glitch.classList.remove('glitch-active'), 600);
    });
  }
});

// ─── SMOOTH SCROLL ────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── PARALLAX HERO ────────────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const y = window.scrollY;
  hero.style.backgroundPositionY = y * 0.3 + 'px';
  const tc = document.getElementById('terminalCard');
  if (tc && y < window.innerHeight) {
    tc.style.transform = `translateY(${y * 0.08}px)`;
  }
}, { passive: true });

// ─── BADGE MOUSE PARALLAX ─────────────────────────────────────────────────────
document.addEventListener('mousemove', e => {
  const badges = document.querySelectorAll('.float-badge');
  const cx = window.innerWidth  / 2;
  const cy = window.innerHeight / 2;
  const dx = (e.clientX - cx) / cx;
  const dy = (e.clientY - cy) / cy;
  badges.forEach((b, i) => {
    const factor = (i + 1) * 6;
    b.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
  });
});

// ─── PROJECT CARD ANIMATIONS ──────────────────────────────────────────────────

// 1. Staggered entrance via IntersectionObserver
(function initProjectCards() {
  const cards = document.querySelectorAll('.project-flip');
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const idx = [...cards].indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('in-view'), idx * 130);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => io.observe(card));
})();

// 2. 3D mouse tilt on front face only (disabled while flipped)
(function initCardTilt() {
  document.querySelectorAll('.project-flip').forEach(card => {
    card.addEventListener('mousemove', e => {
      const inner = card.querySelector('.flip-inner');
      // Skip tilt if card is in flipped state
      const flipped = getComputedStyle(inner).transform.includes('-1');
      if (flipped) return;
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) / (rect.width  / 2);
      const dy = (e.clientY - (rect.top  + rect.height / 2)) / (rect.height / 2);
      card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${dy * -4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

// 3. Spotlight glow follows mouse on front face
(function initCardSpotlight() {
  document.querySelectorAll('.flip-front').forEach(face => {
    face.addEventListener('mousemove', e => {
      const rect = face.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      face.style.background = `
        radial-gradient(circle 180px at ${x}% ${y}%, rgba(0,255,200,0.07), transparent 65%),
        var(--surface)
      `;
    });
    face.addEventListener('mouseleave', () => {
      face.style.background = '';
    });
  });
})();