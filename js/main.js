// Tribloom Farms — site interactions

// Progressive enhancement: only hide-then-reveal content once JS is confirmed running.
document.documentElement.classList.add('js');

// Header shrink + colour swap on scroll
const header = document.getElementById('siteHeader');
const onScroll = () => {
  if (window.scrollY > 60) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Scroll-spy: highlight every nav link (desktop split lists + mobile panel)
// pointing at the section currently in view.
const navAnchors = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
const spySections = Array.from(new Set(navAnchors.map(a => a.getAttribute('href'))))
  .map(href => document.querySelector(href))
  .filter(Boolean);
if (spySections.length) {
  const setActive = (id) => {
    navAnchors.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  };
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
  spySections.forEach(s => spyObserver.observe(s));
}

// Scroll reveal (with stagger handled in CSS via nth-child delays)
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
revealEls.forEach(el => io.observe(el));

// Animated count-up stats
const counters = document.querySelectorAll('[data-count]');
const animateCount = (el) => {
  const target = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1100;
  const start = performance.now();
  const step = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
};
const counterIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      counterIO.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
counters.forEach(c => counterIO.observe(c));

// Subtle 3D tilt on rose variety cards
const tiltCards = document.querySelectorAll('.variety-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    card.style.setProperty('--rx', (px * 8).toFixed(2) + 'deg');
    card.style.setProperty('--ry', (py * -8).toFixed(2) + 'deg');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
  });
});

// Gallery lightbox with prev/next navigation
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCount = document.getElementById('lightboxCount');
const galleryImgs = Array.from(document.querySelectorAll('#galleryGrid img'));
let currentIndex = 0;

const openLightboxAt = (index) => {
  currentIndex = (index + galleryImgs.length) % galleryImgs.length;
  const img = galleryImgs[currentIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightboxCount.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
  lightbox.classList.add('open');
};
galleryImgs.forEach((img, index) => {
  img.addEventListener('click', () => openLightboxAt(index));
});
const closeLightbox = () => lightbox.classList.remove('open');
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); openLightboxAt(currentIndex - 1); });
lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); openLightboxAt(currentIndex + 1); });
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') openLightboxAt(currentIndex - 1);
  if (e.key === 'ArrowRight') openLightboxAt(currentIndex + 1);
});

// Printing / PDF export: reveal everything regardless of scroll position
window.addEventListener('beforeprint', () => {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
});

// Contact form (static site — no backend, show a friendly confirmation)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = "Thank you — please also feel free to call us directly at +91 91488 69977.";
    formNote.style.color = '#9be0b3';
    contactForm.reset();
  });
}
