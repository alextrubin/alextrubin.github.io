<script>
  (function() {
    // --- Переключатель темы (уже был) ---
    const toggleBtn = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
      body.classList.add('dark-theme');
      toggleBtn.textContent = '☀️';
    }
    toggleBtn.addEventListener('click', function() {
      body.classList.toggle('dark-theme');
      const isDark = body.classList.contains('dark-theme');
      toggleBtn.textContent = isDark ? '☀️' : '🌙';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // --- Лайтбокс с навигацией ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.close-lightbox');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentIndex = 0;
    let items = [];

    // Функция для открытия лайтбокса по клику на фото
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

    // Собираем все триггеры на странице (элементы с классом lightbox-trigger)
    const triggers = document.querySelectorAll('.lightbox-trigger');
    triggers.forEach((trigger, idx) => {
      // Запоминаем данные
      const imgSrc = trigger.getAttribute('data-image');
      const caption = trigger.getAttribute('data-caption') || '';
      items.push({ image: imgSrc, caption: caption });

      trigger.addEventListener('click', function(e) {
        e.preventDefault();
        // Находим индекс этого элемента в массиве items
        const index = Array.from(triggers).indexOf(this);
        if (index !== -1) {
          openLightbox(index);
        }
      });
    });

    // Обработчики для кнопок
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);

    // Закрытие по клику на фон (но не на картинку)
    lightbox.addEventListener('click', function(e) {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Закрытие по клавише ESC
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

  })();
</script>
