document.addEventListener('DOMContentLoaded', function() {
  const triggers = document.querySelectorAll('.lightbox-trigger');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.querySelector('.close-lightbox');

  // Открытие
  triggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const imageUrl = this.getAttribute('data-image');
      const caption = this.getAttribute('data-caption');
      lightboxImg.src = imageUrl;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden'; // запрещаем скролл
    });
  });

  // Закрытие по крестику
  closeBtn.addEventListener('click', function() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  });

  // Закрытие по клику на фон (на сам лайтбокс, но не на картинку)
  lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  // Закрытие по клавише Escape
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
});
