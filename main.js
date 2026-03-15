
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
    'image/slide/1.jpg',
    'image/slide/2.jpg',
    'image/slide/3.jpg',
    'image/slide/4.jpg',
    'image/slide/5.jpg',
    'image/slide/6.jpg',
    'image/slide/7.jpg',
    'image/slide/8.jpg',
  ];

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
      }, 5000);
    }
  }

  if (heroSlides.length > 0) {
    const tourImages = document.querySelectorAll('.tour-img');
    tourImages.forEach((img, index) => {
      const imagePath = heroSlides[index];
      if (imagePath) {
        img.src = imagePath;
      } else {
        const card = img.closest('.tour-card');
        if (card) card.style.display = 'none';
      }
    });

    const galleryImages = document.querySelectorAll('.gallery-item img');
    galleryImages.forEach((img, index) => {
      const imagePath = heroSlides[index];
      if (imagePath) {
        img.src = imagePath;
      } else {
        const item = img.closest('.gallery-item');
        if (item) item.style.display = 'none';
      }
    });
  }

  const items = document.querySelectorAll('.gallery-item img');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Ảnh xem lớn';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  items.forEach((img) => {
    img.addEventListener('click', () => openLightbox(img.src, img.alt));
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
})();
