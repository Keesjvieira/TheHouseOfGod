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

  initCardStacks();
});

/* Deck peek: enough offset to show garments on cards behind white artboards */
const STACK_LAYOUT = [
  { x: 0, y: 0, rot: -0.8, scale: 1, opacity: 1 },
  { x: -18, y: 12, rot: -5.5, scale: 0.96, opacity: 1 },
  { x: 20, y: 22, rot: 4.8, scale: 0.925, opacity: 1 },
  { x: -8, y: 34, rot: -3.2, scale: 0.89, opacity: 0.98 },
];

function isStackViewport() {
  return window.matchMedia('(max-width: 900px)').matches;
}

function applyStackOrder(stack, order) {
  order.forEach((card, index) => {
    const layout = STACK_LAYOUT[Math.min(index, STACK_LAYOUT.length - 1)];
    card.dataset.stack = String(index);
    card.style.setProperty('--stack-i', String(index));
    card.style.setProperty('--stack-x', `${layout.x}px`);
    card.style.setProperty('--stack-y', `${layout.y}px`);
    card.style.setProperty('--stack-rot', `${layout.rot}deg`);
    card.style.setProperty('--stack-scale', String(layout.scale));
    card.style.setProperty('--stack-opacity', String(layout.opacity));
  });
}

function cycleCardStack(stack) {
  if (stack.dataset.busy === '1') return;
  const order = stack._stackOrder;
  if (!order || order.length < 2) return;

  const front = order[0];
  stack.dataset.busy = '1';
  front.classList.add('is-exiting');

  window.setTimeout(() => {
    front.classList.remove('is-exiting');
    order.push(order.shift());
    applyStackOrder(stack, order);
    stack.dataset.busy = '0';
  }, 420);
}

function initCardStacks() {
  document.querySelectorAll('.gallery-row-3').forEach((stack) => {
    const cards = Array.from(stack.querySelectorAll(':scope > .media-card')).filter(
      (card) => card.querySelector('img, video')
    );
    if (cards.length < 2) return;

    // Hide empty placeholder-only siblings so they don't sit under the deck
    Array.from(stack.querySelectorAll(':scope > .media-card'))
      .filter((card) => !card.querySelector('img, video'))
      .forEach((card) => {
        card.style.display = 'none';
      });

    stack._stackOrder = cards.slice();
    stack.classList.add('is-stacked');
    applyStackOrder(stack, stack._stackOrder);
    // Ensure wipe covers don't leave the deck looking blank
    cards.forEach((card) => card.classList.add('revealed'));

    stack.addEventListener(
      'click',
      (event) => {
        if (!isStackViewport()) return;
        const card = event.target.closest('.media-card');
        if (!card || !stack.contains(card)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        cycleCardStack(stack);
      },
      true
    );
  });
}

window.addEventListener('resize', () => {
  document.querySelectorAll('.gallery-row-3.is-stacked').forEach((stack) => {
    if (stack._stackOrder) applyStackOrder(stack, stack._stackOrder);
  });
});
