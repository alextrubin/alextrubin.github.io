document.addEventListener('DOMContentLoaded', function() {
  // --- Лайтбокс ---
  const lightbox = document.getElementById('lightbox');
  if (!lightbox) return; // если на странице нет лайтбокса, выходим

  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.close-lightbox');
  const prevBtn = document.querySelector('.lightbox-prev');
  const nextBtn = document.querySelector('.lightbox-next');

  let currentIndex = 0;
  let items = [];

  function openLightbox(index) {
    if (!items.length) return;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function updateLightbox() {
    const item = items[currentIndex];
    lightboxImg.src = item.image;
    lightboxImg.alt = item.caption || '';
    lightboxCaption.textContent = item.caption || '';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    if (items.length === 0) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateLightbox();
  }

  function showNext() {
    if (items.length === 0) return;
    currentIndex = (currentIndex + 1) % items.length;
    updateLightbox();
  }

  // Собираем триггеры по независимым группам: фотографии и дипломы не смешиваются.
  const groups = new Map();
  const triggers = document.querySelectorAll('.lightbox-trigger');

  triggers.forEach(function(trigger) {
    const group = trigger.getAttribute('data-lightbox-group') || 'photos';
    if (!groups.has(group)) groups.set(group, []);
    const groupItems = groups.get(group);
    const index = groupItems.length;

    groupItems.push({
      image: trigger.getAttribute('data-image'),
      caption: trigger.getAttribute('data-caption') || ''
    });

    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      items = groupItems;
      openLightbox(index);
    });
  });


  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
    if (e.key === 'ArrowLeft' && lightbox.classList.contains('active')) {
      showPrev();
    }
    if (e.key === 'ArrowRight' && lightbox.classList.contains('active')) {
      showNext();
    }
  });
});



document.addEventListener('DOMContentLoaded', function() {
  // ... существующий код лайтбокса ...

  // ===== Переключение систематики на странице птиц =====
  const toggleBtn = document.getElementById('toggle-taxonomy');
  const container = document.getElementById('birdsContainer');
  if (toggleBtn && container) {
    toggleBtn.addEventListener('click', function() {
      container.classList.toggle('hide-taxonomy');
      if (container.classList.contains('hide-taxonomy')) {
        toggleBtn.textContent = 'Показать систематику';
      } else {
        toggleBtn.textContent = 'Скрыть систематику';
      }
    });
  }
});
