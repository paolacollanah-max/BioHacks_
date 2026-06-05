/* BIOHACKS — Theme JS */

document.addEventListener('DOMContentLoaded', () => {

  // ── Header scroll effect ──
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ── Hero video: seamless loop with invisible breath-of-light fade ──
  const heroVideo = document.getElementById('hero-video');
  if (heroVideo) {
    const FADE_START_BEFORE_END = 1.5;
    heroVideo.addEventListener('timeupdate', () => {
      if (!heroVideo.duration || isNaN(heroVideo.duration)) return;
      const timeLeft = heroVideo.duration - heroVideo.currentTime;
      if (timeLeft <= FADE_START_BEFORE_END) {
        const progress = 1 - (timeLeft / FADE_START_BEFORE_END);
        heroVideo.style.opacity = 1 - (Math.sin(progress * Math.PI) * 0.15); // never below 0.85
      } else {
        heroVideo.style.opacity = 1;
      }
    });
    heroVideo.addEventListener('ended', () => { heroVideo.currentTime = 0; heroVideo.play(); });

    // Autoplay guard / fallback to first-frame still
    const tryPlay = () => {
      const p = heroVideo.play();
      if (p && typeof p.catch === 'function') p.catch(() => document.body.classList.add('use-fallback'));
    };
    tryPlay();
    setTimeout(() => { if (heroVideo.readyState < 2 && heroVideo.paused) tryPlay(); }, 1200);
    heroVideo.addEventListener('error', () => document.body.classList.add('use-fallback'));
  }

  // ── Scroll indicator fades after leaving the hero ──
  const indicator = document.querySelector('.scroll-indicator');
  if (indicator) {
    window.addEventListener('scroll', () => {
      indicator.classList.toggle('hidden', window.scrollY > window.innerHeight * 0.4);
    }, { passive: true });
  }

  // ── Butterfly parallax on scroll ──
  const butterfly = document.querySelector('.butterfly-wrap');
  if (butterfly) {
    let lastY = 0;
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero')?.offsetHeight || window.innerHeight;
      const progress = Math.min(scrollY / heroHeight, 1);

      // Move butterfly up and slightly right as user scrolls
      const moveY = progress * -180;
      const moveX = progress * 60;
      const scale = 1 - progress * 0.3;
      const opacity = 1 - progress * 1.2;

      butterfly.style.transform = `translate(calc(-50% + ${moveX}px), calc(-55% + ${moveY}px)) scale(${scale})`;
      butterfly.style.opacity = Math.max(0, opacity);
      lastY = scrollY;
    }, { passive: true });
  }

  // ── Reveal on scroll ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── Add to cart feedback ──
  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', function () {
      const original = this.textContent;
      this.textContent = '✓ Añadido';
      this.style.background = '#5a9a50';
      setTimeout(() => {
        this.textContent = original;
        this.style.background = '';
      }, 1800);
    });
  });

});
