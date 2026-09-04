const assetBase = '../seventhrelic';

function resolveAssetPath(image) {
  return `${assetBase}/${image}`;
}

function getImages() {
  const images = window.__SEVENTHRELIC__?.images;
  return Array.isArray(images) ? images : [];
}

function openLightbox(image, title) {
  const lightbox = document.querySelector('#lightbox');
  const preview = document.querySelector('#lightbox-image');
  const download = document.querySelector('#lightbox-download');

  if (!lightbox || !preview || !download) return;

  preview.src = image;
  preview.alt = title;
  download.href = image;
  download.setAttribute('download', decodeURIComponent(image.split('/').pop() || 'post'));
  lightbox.hidden = false;
  document.body.classList.add('no-scroll');
}

function closeLightbox() {
  const lightbox = document.querySelector('#lightbox');
  const preview = document.querySelector('#lightbox-image');

  if (!lightbox || !preview) return;

  lightbox.hidden = true;
  preview.src = '';
  preview.alt = '';
  document.body.classList.remove('no-scroll');
}

function renderPosts() {
  const grid = document.querySelector('#post-grid');
  if (!grid) return;

  const images = getImages().slice().reverse();

  grid.innerHTML = images
    .map((image, index) => {
      const src = encodeURI(resolveAssetPath(image));
      const rawName = decodeURIComponent(image.split('/').pop()?.replace(/\.[^.]+$/, '') || `post-${index + 1}`);
      const title = rawName
        .replace(/[-_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^./, (char) => char.toUpperCase()) || `Post ${String(index + 1).padStart(2, '0')}`;

      return `
        <button class="post-card" type="button" data-src="${src}" data-title="${title}">
          <img src="${src}" alt="${rawName}" loading="lazy" decoding="async" />
        </button>
      `;
    })
    .join('');

  grid.querySelectorAll('.post-card').forEach((card) => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const alt = img ? img.alt : card.dataset.title;
      openLightbox(card.dataset.src, alt);
    });
  });
}

document.addEventListener('click', (event) => {
  const lightbox = document.querySelector('#lightbox');
  if (!lightbox || lightbox.hidden) return;

  if (event.target instanceof HTMLElement) {
    if (event.target.matches('.lightbox-backdrop, .lightbox-close')) {
      closeLightbox();
    }
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});

renderPosts();

(function attachBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
      btn.removeAttribute('hidden');
    } else {
      btn.classList.remove('visible');
      btn.setAttribute('hidden', '');
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

(function attachHeaderHideOnScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 0) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
