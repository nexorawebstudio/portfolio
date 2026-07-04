// ============================================
// AR. DWIVEDI — PORTFOLIO SHARED SCRIPT
// ============================================

/* ---------- Theme toggle ---------- */
(function themeInit(){
  const saved = localStorage.getItem('theme');
  const initial = saved || 'dark';
  document.documentElement.setAttribute('data-theme', initial);
})();

function setupThemeToggle(){
  const toggle = document.querySelector('.theme-toggle');
  if(!toggle) return;
  const sync = () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    toggle.querySelector('.knob').textContent = isLight ? '☀' : '✦';
    toggle.setAttribute('aria-checked', String(isLight));
  };
  sync();
  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    sync();
  });
}

/* ---------- Mobile nav ---------- */
function setupMobileNav(){
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if(!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.textContent = links.classList.contains('open') ? '✕' : '☰';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    btn.textContent = '☰';
  }));
}

/* ---------- Active nav link ---------- */
function markActiveLink(){
  const page = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === page || (page === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });
}

/* ---------- Starfield canvas (signature element) ---------- */
function setupStarfield(){
  const canvas = document.getElementById('stars');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let w, h;

  function resize(){
    w = canvas.width = canvas.offsetWidth;
    h = canvas.height = canvas.offsetHeight;
    const count = Math.floor((w * h) / 9000);
    stars = Array.from({length: count}, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.4 + 0.3,
      s: Math.random() * 0.5 + 0.15,
      a: Math.random() * Math.PI * 2
    }));
  }

  function draw(){
    ctx.clearRect(0, 0, w, h);
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    ctx.fillStyle = isLight ? 'rgba(124,58,237,0.5)' : '#ffffff';
    stars.forEach(star => {
      star.a += 0.02 * star.s;
      const twinkle = (Math.sin(star.a) + 1) / 2;
      ctx.globalAlpha = 0.25 + twinkle * 0.75;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    if(!reduced) requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
}

/* ---------- Skill bar reveal ---------- */
function setupSkillBars(){
  const bars = document.querySelectorAll('.bar-fill');
  if(!bars.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const target = entry.target.dataset.value || '0';
        entry.target.style.width = target + '%';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  bars.forEach(bar => io.observe(bar));
}

/* ---------- Certificate filter ---------- */
function setupCertFilter(){
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('[data-cat]');
  if(!filterBtns.length) return;
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ---------- Contact form (mailto) ---------- */
function setupContactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('#name').value;
    const email = form.querySelector('#email').value;
    const message = form.querySelector('#message').value;
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:dwivediiaradhya@gmail.com?subject=${subject}&body=${body}`;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  setupMobileNav();
  markActiveLink();
  setupStarfield();
  setupSkillBars();
  setupCertFilter();
  setupContactForm();
});
