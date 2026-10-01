let activeCard = null;

const getEl = (id) => document.getElementById(id);

// Mobile detection and optimization
const isMobile = () => window.innerWidth <= 768;
const isSmallMobile = () => window.innerWidth <= 480;

// Disable input zoom on focus for iOS
document.addEventListener('touchstart', function() {}, false);

// Optimize animations for mobile
if (isMobile()) {
  document.documentElement.style.scrollBehavior = 'auto';
  
  // Disable fixed backgrounds on mobile for performance
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      .hero-image-foreground {
        background-attachment: scroll !important;
      }
    }
  `;
  document.head.appendChild(style);
}

// Page navigation by scrolling
function showPage(name) {
  document.querySelectorAll('.nav-link').forEach((link) => link.classList.remove('active-link'));
  getEl('nav-' + name).classList.add('active-link');

  const section = getEl('page-' + name);
  if (!section) return;

  section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(initWipes, 100);
}

// Season tabs
function showSeason(name) {
  document.querySelectorAll('.season-tab').forEach((tab) => tab.classList.remove('active'));
  document.querySelectorAll('.season-panel').forEach((panel) => panel.classList.remove('active'));

  document.querySelector(`[onclick="showSeason('${name}')"]`).classList.add('active');
  getEl('season-' + name).classList.add('active');

  setTimeout(initWipes, 50);
}

// Wipe reveal animation with mobile optimization
const wipeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = isMobile() ? 50 : 80;
        setTimeout(() => entry.target.classList.add('revealed'), delay);
      }
    });
  },
  { threshold: isMobile() ? 0.15 : 0.12 }
);

function initWipes() {
  document.querySelectorAll('.media-card:not(.revealed)').forEach((card) => wipeObserver.observe(card));
}

initWipes();

// Lightbox
function openLightbox(card) {
  const image = card.querySelector('img');
  const video = card.querySelector('video');
  const lightbox = getEl('lightbox');
  const content = getEl('lightbox-content');

  content.innerHTML = '';

  if (image) {
    const el = document.createElement('img');
    el.src = image.src;
    el.alt = image.alt;
    content.appendChild(el);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  } else if (video) {
    const el = document.createElement('video');
    el.src = video.src;
    el.controls = true;
    el.autoplay = true;
    el.playsInline = true;
    content.appendChild(el);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  getEl('lightbox').classList.remove('open');
  getEl('lightbox-content').innerHTML = '';
  document.body.style.overflow = '';
}

// Modal
function openModal(card) {
  activeCard = card;
  getEl('media-url').value = '';
  getEl('media-alt').value = '';
  getEl('modal').classList.add('open');
  document.body.style.overflow = 'hidden';

  setTimeout(() => getEl('media-url').focus(), 100);
}

function closeModal() {
  getEl('modal').classList.remove('open');
  activeCard = null;
  document.body.style.overflow = '';
}

function applyMedia() {
  if (!activeCard) return;

  const url = getEl('media-url').value.trim();
  const alt = getEl('media-alt').value.trim() || 'Fashion piece';

  if (!url) return;

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(url);

  activeCard.querySelector('.placeholder')?.remove();
  activeCard.querySelector('.add-btn')?.remove();
  activeCard.querySelectorAll('img,video').forEach((element) => element.remove());

  if (isVideo) {
    const video = document.createElement('video');
    video.src = url;
    video.loop = true;
    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
    activeCard.appendChild(video);
  } else {
    const image = document.createElement('img');
    image.src = url;
    image.alt = alt;
    activeCard.appendChild(image);
  }

  closeModal();
}

getEl('modal').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) closeModal();
});

// Close modals and lightbox with Escape key
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    closeLightbox();
    closeModal();
  }
});

// Handle window resize for responsive behavior
window.addEventListener('resize', () => {
  if (window.innerWidth > 768) {
    document.body.style.overflow = '';
  }
});

function submitContact() {
  const name  = document.getElementById('cf-name').value.trim();
  const email = document.getElementById('cf-email').value.trim();
  const msg = document.getElementById('cf-message').value.trim();

  if (!name || !email || !msg) {
  alert('Please fill in your name, email, and message.');
  return;
}

  const btn = document.querySelector('.contact-submit');
  btn.textContent = 'Sending…';
  btn.style.opacity = '0.6';
  btn.disabled = true;

  emailjs.send('service_brzdfxr', 'template_ityk0dw', {
    name: name,
    email: email,
    message: msg
  }).then(() => {
    document.getElementById('cf-confirm').style.display = 'block';
    btn.style.display = 'none';
  }).catch((err) => {
    alert('Something went wrong. Please try again.');
    console.error(err);
    btn.textContent = 'Contact';
    btn.style.opacity = '1';
    btn.disabled = false;
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('scrollToGalleryBtn');
  const gallery = document.getElementById('gallery-grid');

  if (button && gallery) {
    button.addEventListener('click', (event) => {
      // 1. Stop the default HTML anchor jump if you are using an <a> tag
      event.preventDefault(); 
      
      // 2. Trigger the smooth animation
      gallery.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    });
  }

  const heroCard = document.querySelector('.hero-cta-card');
  const heroTilt = heroCard?.querySelector('.hero-cta-tilt');
  const canTilt =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroCard && heroTilt && canTilt) {
    heroCard.addEventListener('pointermove', (event) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      heroTilt.style.setProperty('--tilt-y', `${(x * 10).toFixed(2)}deg`);
      heroTilt.style.setProperty('--tilt-x', `${(-y * 8).toFixed(2)}deg`);
    });
    heroCard.addEventListener('pointerleave', () => {
      heroTilt.style.setProperty('--tilt-x', '0deg');
      heroTilt.style.setProperty('--tilt-y', '0deg');
    });
  }

  const contactBtn = document.getElementById('scrollToContactBtn');
  const contact = document.getElementById('contact');
  if (contactBtn && contact) {
    contactBtn.addEventListener('click', (event) => {
      event.preventDefault();
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  document.querySelectorAll('.masonry-carousel').forEach(initCarousel);
  document.querySelectorAll('.paper-deck').forEach(initPaperDeck);
});

function initPaperDeck(deck) {
  const stack = deck.querySelector('.paper-deck-stack');
  const cards = [...stack.children];
  const total = cards.length;
  if (total < 2) return;

  const counter = deck.querySelector('.paper-deck-count');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const interval = Number(deck.dataset.interval) || 3600;
  const firstDelay = interval + (Number(deck.dataset.delay) || 0);
  const flyMs = reduceMotion ? 20 : 600;
  const pad = (n) => String(n).padStart(2, '0');

  let order = cards.map((_, i) => i);
  let busy = false;
  let timer = null;
  let firstCycle = true;
  const pauses = new Set(reduceMotion ? ['reduced-motion'] : []);

  const top = () => cards[order[0]];

  const render = () => {
    order.forEach((cardIndex, pos) => {
      const card = cards[cardIndex];
      card.style.setProperty('--pos', pos);
      card.classList.toggle('is-top', pos === 0);
      card.setAttribute('aria-hidden', String(pos !== 0));
    });
    if (counter) counter.textContent = `${pad(order[0] + 1)} / ${pad(total)}`;
  };

  const schedule = () => {
    clearTimeout(timer);
    const playing = pauses.size === 0;
    const wait = firstCycle ? firstDelay : interval;
    deck.style.setProperty('--interval', `${wait}ms`);
    deck.classList.remove('is-playing');
    if (!playing) return;
    void deck.offsetWidth;
    deck.classList.add('is-playing');
    timer = setTimeout(() => advance(-1), wait);
  };

  const resetDrag = (card) => {
    card.style.setProperty('--drag-x', '0px');
    card.style.setProperty('--drag-rot', '0deg');
  };

  function advance(dir) {
    if (busy) return;
    busy = true;
    firstCycle = false;
    const leaving = top();
    leaving.style.setProperty('--dir', dir);
    leaving.classList.add('is-leaving');
    order = [...order.slice(1), order[0]];
    render();
    setTimeout(() => {
      leaving.classList.remove('is-leaving');
      resetDrag(leaving);
      busy = false;
    }, flyMs);
    schedule();
  }

  let startX = 0;
  let dragX = 0;
  let dragging = false;

  stack.addEventListener('pointerdown', (event) => {
    if (busy || event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    dragX = 0;
    stack.setPointerCapture(event.pointerId);
    deck.classList.add('is-dragging');
    pauses.add('drag');
    schedule();
  });

  stack.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    dragX = event.clientX - startX;
    top().style.setProperty('--drag-x', `${dragX}px`);
    top().style.setProperty('--drag-rot', `${dragX * 0.05}deg`);
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    deck.classList.remove('is-dragging');
    pauses.delete('drag');
    if (Math.abs(dragX) > stack.offsetWidth * 0.2) {
      advance(Math.sign(dragX));
    } else {
      resetDrag(top());
      schedule();
    }
  };

  stack.addEventListener('pointerup', endDrag);
  stack.addEventListener('pointercancel', endDrag);

  deck.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'mouse') return;
    pauses.add('hover');
    schedule();
  });
  deck.addEventListener('pointerleave', () => {
    if (pauses.delete('hover')) schedule();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauses.add('hidden');
    else pauses.delete('hidden');
    schedule();
  });

  pauses.add('offscreen');
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) pauses.delete('offscreen');
    else pauses.add('offscreen');
    schedule();
  }, { threshold: 0.35 }).observe(deck);

  render();
}

function initCarousel(root) {
  const track = root.querySelector('.carousel-track');
  const slides = [...track.children];
  const count = slides.length;
  if (!count) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const delay = Number(root.dataset.autoplay) || 3500;
  root.style.setProperty('--autoplay-ms', `${delay}ms`);

  // Full copies on both sides let the track loop: once a clone settles in the middle, we jump to its original.
  const makeClone = (slide) => {
    const clone = slide.cloneNode(true);
    clone.classList.add('is-clone');
    clone.setAttribute('aria-hidden', 'true');
    return clone;
  };
  track.prepend(...slides.map(makeClone));
  track.append(...slides.map(makeClone));
  const all = [...track.children];

  const dotsWrap = root.querySelector('.carousel-dots');
  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(count + i));
    dotsWrap?.appendChild(dot);
    return dot;
  });

  let current = -1;
  let timer = null;
  const pauses = new Set(reduceMotion ? ['reduced-motion'] : []);

  const offsetFor = (slide) =>
    slide.offsetLeft - track.offsetLeft + slide.offsetWidth / 2 - track.clientWidth / 2;

  const nearestIndex = () => {
    const center = track.scrollLeft + track.clientWidth / 2 + track.offsetLeft;
    let best = 0;
    let bestDist = Infinity;
    all.forEach((slide, i) => {
      const dist = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    return best;
  };

  const schedule = () => {
    clearTimeout(timer);
    const playing = pauses.size === 0;
    root.classList.toggle('is-playing', playing);
    if (playing) timer = setTimeout(() => goTo(current + 1), delay);
  };

  const markActive = (index) => {
    all.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => {
      const on = i === index % count;
      dot.classList.toggle('is-active', on);
      dot.setAttribute('aria-selected', String(on));
    });
  };

  const setActive = (index) => {
    if (index === current) return;
    current = index;
    markActive(index);
    schedule();
  };

  const jumpTo = (index) => {
    root.classList.add('is-jumping');
    track.style.scrollBehavior = 'auto';
    track.scrollLeft = offsetFor(all[index]);
    current = index;
    markActive(index);
    void track.offsetWidth;
    track.style.scrollBehavior = '';
    root.classList.remove('is-jumping');
  };

  function goTo(index) {
    track.scrollTo({ left: offsetFor(all[index]), behavior: reduceMotion ? 'auto' : 'smooth' });
    setActive(index);
  }

  let settleTimer = null;
  track.addEventListener(
    'scroll',
    () => {
      if (root.classList.contains('is-jumping')) return;
      setActive(nearestIndex());
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => {
        const index = nearestIndex();
        if (index < count) jumpTo(index + count);
        else if (index >= count * 2) jumpTo(index - count);
      }, 140);
    },
    { passive: true }
  );

  root.querySelector('.carousel-arrow--prev')?.addEventListener('click', () => goTo(current - 1));
  root.querySelector('.carousel-arrow--next')?.addEventListener('click', () => goTo(current + 1));

  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      goTo(current + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goTo(current - 1);
    }
  });

  const pause = (reason) => {
    pauses.add(reason);
    schedule();
  };
  const resume = (reason) => {
    if (pauses.delete(reason)) schedule();
  };

  root.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') pause('hover');
  });
  root.addEventListener('pointerleave', () => resume('hover'));
  root.addEventListener('focusin', () => pause('focus'));
  root.addEventListener('focusout', (event) => {
    if (!root.contains(event.relatedTarget)) resume('focus');
  });
  track.addEventListener('touchstart', () => pause('touch'), { passive: true });
  track.addEventListener('touchend', () => setTimeout(() => resume('touch'), delay), { passive: true });

  document.addEventListener('visibilitychange', () =>
    document.hidden ? pause('hidden') : resume('hidden')
  );

  pauses.add('offscreen');
  new IntersectionObserver(([entry]) =>
    entry.isIntersecting ? resume('offscreen') : pause('offscreen')
  , { threshold: 0.3 }).observe(root);

  window.addEventListener('resize', () => jumpTo(current));

  jumpTo(count);
  schedule();
}
