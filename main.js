
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function copyPhone() {
  const phone = document.getElementById("phone").innerText;
  navigator.clipboard.writeText(phone);
  showToast("Đã copy: " + phone);
}

(function () {
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  const navEntry = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
  const isReload = (navEntry && navEntry.type === 'reload') ||
    (performance.navigation && performance.navigation.type === 1);

  if (isReload) {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }

    window.addEventListener('load', () => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }

  const heroSlides = [
    'image/slide/IMG_3518.webp',
    'image/slide/IMG_1143.webp',
    'image/slide/IMG_5847.webp',
    'image/slide/IMG_5033.webp',
    'image/slide/IMG_5332.jpg',
    'image/slide/IMG_6082.jpg',
    'image/slide/IMG_5592.webp',
    'image/slide/IMG_6245.webp',
    'image/slide/IMG_5515.webp',
    'image/slide/IMG_6961.webp',
    'image/slide/IMG_1149.webp',
    'image/slide/IMG_7022.jpg',
  ]

  const imageGallry = [
    'image/gallery/IMG_5216.webp',
    'image/gallery/IMG_1145.webp',
    'image/gallery/IMG_1146.webp',
    'image/gallery/IMG_1147.webp',
    'image/gallery/IMG_1148.webp',
    'image/gallery/IMG_6754.webp',
    'image/gallery/IMG_4539.webp',
    'image/gallery/IMG_6842.webp',
    'image/gallery/IMG_4708.webp',
    'image/gallery/IMG_6013.webp',
  ];

  function shuffleArray(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    return shuffled;
  }

  const MAX_GALLERY_ITEMS = 16;
  const HERO_SLIDE_INTERVAL_MS = 3000;
  const heroSlidesForGallery = heroSlides.slice(1);
  const gallerySources = shuffleArray([...heroSlidesForGallery, ...imageGallry]).slice(0, MAX_GALLERY_ITEMS);
  const GALLERY_PREVIEW_LIMIT = 8;
  const GALLERY_BATCH_SIZE = 8;
  const slideA = document.getElementById('heroSlideA');
  const slideB = document.getElementById('heroSlideB');

  if (slideA && slideB && heroSlides.length > 0) {
    slideA.style.backgroundImage = `url('${heroSlides[0]}')`;
    slideB.style.backgroundImage = `url('${heroSlides[1] || heroSlides[0]}')`;

    let currentIndex = heroSlides.length > 1 ? 1 : 0;
    let activeSlide = slideA;
    let inactiveSlide = slideB;

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && heroSlides.length > 1) {
      setInterval(() => {
        inactiveSlide.style.backgroundImage = `url('${heroSlides[currentIndex]}')`;
        inactiveSlide.classList.add('active');
        activeSlide.classList.remove('active');

        const temp = activeSlide;
        activeSlide = inactiveSlide;
        inactiveSlide = temp;

        currentIndex = (currentIndex + 1) % heroSlides.length;
      }, HERO_SLIDE_INTERVAL_MS);
    }
  }

  const tourImages = document.querySelectorAll('.tour-img');
  tourImages.forEach((img, index) => {
    const currentSrc = img.getAttribute('src');
    if (currentSrc && currentSrc.trim() !== '') return;

    const fallbackImagePath = heroSlides[index];
    if (fallbackImagePath) {
      img.src = fallbackImagePath;
    }
  });

  const galleryGrid = document.querySelector('.gallery-grid');
  const gallerySection = document.getElementById('gallery');
  const galleryMore = document.getElementById('galleryMore');
  const galleryMoreBtn = document.getElementById('galleryMoreBtn');
  const defaultAltText = 'Hình ảnh trải nghiệm tour';
  const initialGalleryCount = Math.min(GALLERY_PREVIEW_LIMIT, gallerySources.length);
  let renderedGalleryCount = 0;
  let galleryItems = [];
  const preloadedGallerySources = new Set();

  function createGalleryItem(imagePath, index) {
    const figure = document.createElement('figure');
    figure.className = 'gallery-item';

    const image = document.createElement('img');
    const shouldPrioritize = index < 2;
    image.src = imagePath;
    image.alt = `${defaultAltText} ${index + 1}`;
    image.loading = shouldPrioritize ? 'eager' : 'lazy';
    image.fetchPriority = shouldPrioritize ? 'high' : 'low';
    image.decoding = 'async';

    figure.appendChild(image);
    return figure;
  }

  function preloadGalleryBatch(startIndex) {
    const preloadStart = Math.max(startIndex, 0);
    const preloadEnd = Math.min(preloadStart + GALLERY_BATCH_SIZE, gallerySources.length);

    for (let index = preloadStart; index < preloadEnd; index += 1) {
      const imagePath = gallerySources[index];
      if (preloadedGallerySources.has(imagePath)) continue;

      const preloadImage = new Image();
      preloadImage.decoding = 'async';
      preloadImage.src = imagePath;
      preloadedGallerySources.add(imagePath);
    }
  }

  function syncGalleryItems() {
    galleryItems = Array.from(galleryGrid.querySelectorAll('.gallery-item img'));
  }

  function updateGalleryToggle() {
    if (!galleryMore || !galleryMoreBtn) return;

    const hiddenCount = gallerySources.length - renderedGalleryCount;
    if (gallerySources.length <= GALLERY_PREVIEW_LIMIT) {
      galleryMore.hidden = true;
      return;
    }

    galleryMore.hidden = false;
    galleryMoreBtn.textContent = hiddenCount > 0
      ? `Xem thêm ${Math.min(GALLERY_BATCH_SIZE, hiddenCount)} ảnh`
      : 'Thu gọn';
    galleryMoreBtn.setAttribute('aria-expanded', String(renderedGalleryCount > initialGalleryCount));
  }

  function renderInitialGallery() {
    if (!galleryGrid || !gallerySources.length) return;

    const fragment = document.createDocumentFragment();
    gallerySources.slice(0, initialGalleryCount).forEach((imagePath, index) => {
      fragment.appendChild(createGalleryItem(imagePath, index));
    });

    galleryGrid.replaceChildren(fragment);
    renderedGalleryCount = initialGalleryCount;
    syncGalleryItems();
    updateGalleryToggle();
    preloadGalleryBatch(renderedGalleryCount);
  }

  function loadMoreGallery() {
    if (!galleryGrid || renderedGalleryCount >= gallerySources.length) return;

    const nextGalleryCount = Math.min(renderedGalleryCount + GALLERY_BATCH_SIZE, gallerySources.length);
    const fragment = document.createDocumentFragment();
    gallerySources.slice(renderedGalleryCount, nextGalleryCount).forEach((imagePath, offset) => {
      fragment.appendChild(createGalleryItem(imagePath, renderedGalleryCount + offset));
    });

    galleryGrid.appendChild(fragment);
    renderedGalleryCount = nextGalleryCount;
    syncGalleryItems();
    updateGalleryToggle();
    preloadGalleryBatch(renderedGalleryCount);
  }

  function collapseGallery() {
    if (!galleryGrid || renderedGalleryCount <= initialGalleryCount) return;

    while (galleryGrid.children.length > initialGalleryCount) {
      galleryGrid.lastElementChild.remove();
    }

    renderedGalleryCount = initialGalleryCount;
    syncGalleryItems();
    updateGalleryToggle();
  }

  renderInitialGallery();
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  let currentImageIndex = 0;

  function setLightboxImage(index) {
    if (!galleryItems.length) return;
    currentImageIndex = (index + galleryItems.length) % galleryItems.length;
    const currentItem = galleryItems[currentImageIndex];
    lightboxImg.src = currentItem.src;
    lightboxImg.alt = currentItem.alt || 'Ảnh xem lớn';
  }

  function openLightbox(index) {
    setLightboxImage(index);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function changeLightboxImage(step) {
    if (!lightbox.classList.contains('open') || !galleryItems.length) return;
    setLightboxImage(currentImageIndex + step);
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  if (galleryGrid) {
    galleryGrid.addEventListener('click', (event) => {
      const clickedImage = event.target.closest('.gallery-item img');
      if (!clickedImage) return;

      const imageIndex = galleryItems.indexOf(clickedImage);
      if (imageIndex !== -1) {
        openLightbox(imageIndex);
      }
    });
  }

  if (galleryMoreBtn) {
    galleryMoreBtn.addEventListener('click', () => {
      if (renderedGalleryCount < gallerySources.length) {
        loadMoreGallery();
        return;
      }

      collapseGallery();

      if (gallerySection) {
        requestAnimationFrame(() => {
          gallerySection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    });
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxPrev.addEventListener('click', () => changeLightboxImage(-1));
  lightboxNext.addEventListener('click', () => changeLightboxImage(1));
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();
