(function() {
  // Получаем текущий язык из параметра URL или из localStorage
  const params = new URLSearchParams(window.location.search);
  let lang = params.get('lang') || localStorage.getItem('preferred_lang') || 'ru';

  // Устанавливаем язык для страницы (меняем атрибут lang у html)
  document.documentElement.lang = lang;

  // Активируем соответствующую кнопку
  const buttons = document.querySelectorAll('.lang-btn');
  buttons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.lang === lang) {
      btn.classList.add('active');
    }
  });

  // При клике на кнопку перезагружаем страницу с параметром lang
  buttons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      const newLang = this.dataset.lang;
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('lang', newLang);
      localStorage.setItem('preferred_lang', newLang);
      window.location.href = currentUrl.href;
    });
  });
})();