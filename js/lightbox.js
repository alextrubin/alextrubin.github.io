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
    lightboxCaption.hidden = !item.caption;
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


  // Свайпы на телефонах и горизонтальные жесты трекпада.
  let touchStartX = 0;
  let touchStartY = 0;
  let wheelDistance = 0;
  let wheelResetTimer = null;
  let wheelLocked = false;

  lightbox.addEventListener('touchstart', function(e) {
    if (!lightbox.classList.contains('active') || !e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  lightbox.addEventListener('touchend', function(e) {
    if (!lightbox.classList.contains('active') || !e.changedTouches.length) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;

    // Реагируем только на уверенный горизонтальный свайп.
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.25) {
      if (dx < 0) showNext();
      else showPrev();
    }
  }, { passive: true });

  // На MacBook и других ноутбуках трекпад обычно отправляет deltaX.
  lightbox.addEventListener('wheel', function(e) {
    if (!lightbox.classList.contains('active') || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    if (wheelLocked) return;

    wheelDistance += e.deltaX;
    clearTimeout(wheelResetTimer);
    wheelResetTimer = setTimeout(function() { wheelDistance = 0; }, 180);

    if (Math.abs(wheelDistance) >= 55) {
      if (wheelDistance > 0) showNext();
      else showPrev();
      wheelDistance = 0;
      wheelLocked = true;
      setTimeout(function() { wheelLocked = false; }, 420);
    }
  }, { passive: false });

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
