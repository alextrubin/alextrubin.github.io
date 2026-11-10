/* ============================================================
   ПОРТФОЛИО — поведение сайта
   ────────────────────────────────────────────────────────────
   КАРТА ФАЙЛА
   [1] Тема (светлая / тёмная) — иконка, meta theme-color
   [2] Галерея «рядами» — укладка кадров без обрезки
   [3] Активный пункт меню — подсветка текущей секции
   ============================================================ */


/* ────────────────────────────────────────────────────────────
   [1] ТЕМА
   Начальная тема уже выставлена инлайн-скриптом в <body>.
   Здесь только: синхронизируем иконку, обрабатываем клик,
   обновляем meta theme-color (цвет адресной строки в мобильных
   браузерах) и сохраняем выбор в localStorage.
   ──────────────────────────────────────────────────────────── */
(function(){
  var btn  = document.getElementById('theme-toggle');
  var body = document.body;

  // Тёмный фон и светлый — должны совпадать с --bg в CSS
  var COLORS = { light: '#faf8f4', dark: '#0f0e0c' };

  function apply(theme){
    var isDark = theme === 'dark';
    body.classList.toggle('dark-theme', isDark);

    if (btn){
      btn.textContent = isDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label',
        isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    // meta[name="theme-color"] — красит адресную строку на мобильных
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta){
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = isDark ? COLORS.dark : COLORS.light;
  }

  // Синхронизация с тем, что выставил инлайн-скрипт
  apply(body.classList.contains('dark-theme') ? 'dark' : 'light');

  if (btn){
    btn.addEventListener('click', function(){
      var next = body.classList.contains('dark-theme') ? 'light' : 'dark';
      apply(next);
      try { localStorage.theme = next; } catch(e){ /* приватный режим */ }
    });
  }
})();


/* ────────────────────────────────────────────────────────────
   [2] ГАЛЕРЕЯ «РЯДАМИ»
   ────────────────────────────────────────────────────────────
   Логика:
   • Телефон (< 560px) — один кадр в ряд, во всю ширину.
     Крупно, «журнально», никаких обрезков-миниатюр.
   • Планшет (560–900px) — примерно 2 кадра в ряд.
   • Десктоп (≥ 900px) — 2–3 кадра в ряд, но не выше 420px.
   • Кадры НЕ обрезаются: пропорции сохраняются,
     ряды выравниваются по общей высоте.
   • Последний неполный ряд не растягивается на всю ширину —
     остаётся «по целевому размеру», смотрится аккуратно.
   ──────────────────────────────────────────────────────────── */
(function(){
  var GAP = 6; // ДОЛЖЕН совпадать с --gallery-gap в CSS

  function layout(g){
    var W = g.clientWidth;
    if (!W) return;

    /* ── Мобильный: одна колонка ───────────────────────────── */
    if (W < 560){
      [].forEach.call(g.children, function(a){
        a.style.width  = '100%';
        a.style.height = 'auto';
        var img = a.querySelector('img');
        if (img){
          // Возвращаем натуральную высоту кадра.
          // CSS-правило .g img { height:100% } здесь не работает,
          // т.к. у родителя высота auto — задаём явно.
          img.style.height    = 'auto';
          // Совсем длинные «портреты» не должны занимать
          // 2–3 экрана подряд — ограничиваем.
          img.style.maxHeight = '88vh';
        }
      });
      return;
    }

    /* ── Планшет / десктоп: ряды ───────────────────────────── */
    // Целевая высота ряда
    var T = (W < 900)
      ? W / 1.9                       // ~2 кадра в ряд
      : Math.min(420, W / 2.6);       // 2–3 кадра, но не выше 420

    // Снимаем возможные inline-стили от мобильного режима
    // (после ресайза с телефона на десктоп)
    [].forEach.call(g.children, function(a){
      var img = a.querySelector('img');
      if (img){
        img.style.height    = '';
        img.style.maxHeight = '';
      }
    });

    var row = [], sum = 0;

    function flush(isLast){
      var gaps = GAP * (row.length - 1);
      // Если это последний ряд и он «не дотягивает» до ширины
      // при целевой высоте — оставляем целевую (не растягиваем).
      // Иначе — растягиваем по ширине контейнера.
      var h = (isLast && sum * T + gaps < W)
        ? T
        : (W - gaps) / sum;

      row.forEach(function(a){
        a.style.width  = Math.floor(a.r * h) + 'px';
        a.style.height = Math.round(h) + 'px';
      });
      row = []; sum = 0;
    }

    [].forEach.call(g.children, function(a){
      row.push(a);
      sum += a.r;
      if (sum * T + GAP * (row.length - 1) >= W) flush(false);
    });
    if (row.length) flush(true);
  }

  document.querySelectorAll('.g').forEach(function(g){
    var imgs = [].slice.call(g.querySelectorAll('img'));

    // Ждём, пока браузер узнает натуральные размеры всех кадров.
    // decode() может не поддерживаться — тогда просто резолвимся.
    var ready = Promise.all(imgs.map(function(i){
      return i.decode
        ? i.decode().catch(function(){})
        : Promise.resolve();
    }));

    ready.then(function(){
      imgs.forEach(function(i){
        // Соотношение сторон кадра — основа укладки
        i.parentNode.r = (i.naturalWidth / i.naturalHeight) || 1.5;
      });

      layout(g);
      g.classList.add('ready'); // проявляем галерею (opacity 0 → 1)

      // Пересчёт при изменении ширины контейнера (с дебаунсом,
      // чтобы не дёргать layout на каждый пиксель ресайза)
      var lastW = g.clientWidth, timer;
      addEventListener('resize', function(){
        clearTimeout(timer);
        timer = setTimeout(function(){
          if (g.clientWidth !== lastW){
            lastW = g.clientWidth;
            layout(g);
          }
        }, 120);
      });
    });
  });
})();


/* ────────────────────────────────────────────────────────────
   [3] АКТИВНЫЙ ПУНКТ МЕНЮ
   ────────────────────────────────────────────────────────────
   • Собираем ссылки меню по их #hash.
   • Через IntersectionObserver узнаём, какая секция сейчас
     «в фокусе» (примерно середина экрана), и подсвечиваем её.
   • На мобильных меню скроллится горизонтально —
     подкручиваем активный пункт в видимую зону.
   ──────────────────────────────────────────────────────────── */
(function(){
  // id секции → элемент <a> в меню
  var links = {};
  document.querySelectorAll('.nav-menu a[href^="#"]').forEach(function(a){
    links[a.hash.slice(1)] = a;
  });
  if (!Object.keys(links).length) return;

  var nav = document.querySelector('.nav-menu');

  // Прокрутка горизонтального меню к активному пункту (только
  // если меню действительно скроллится — на десктопе это no-op).
  function reveal(link){
    if (!nav || !link) return;
    if (nav.scrollWidth <= nav.clientWidth) return;
    var target = link.offsetLeft - nav.clientWidth / 2 + link.clientWidth / 2;
    nav.scrollTo({ left: target, behavior: 'smooth' });
  }

  // Без IntersectionObserver — молча живём без подсветки
  if (!('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;

      // Снимаем active со всех, ставим только на текущую
      for (var k in links) links[k].classList.remove('active');

      var link = links[e.target.id];
      if (link){
        link.classList.add('active');
        reveal(link);
      }
    });
  }, {
    // rootMargin сужает «окно срабатывания» — секция считается
    // активной, когда проходит примерно через середину экрана.
    rootMargin: '-30% 0px -60% 0px'
  });

  // Наблюдаем именно те элементы, что есть в меню —
  // это устойчивее, чем гадать про .sec / .about / .contacts.
  for (var id in links){
    var el = document.getElementById(id);
    if (el) io.observe(el);
  }
})();



/* ────────────────────────────────────────────────────────────
   [4] ЛЕНТА ДИПЛОМОВ — автоматическое движение и инерционный свайп
   ──────────────────────────────────────────────────────────── */
(function(){
  var marquee = document.querySelector('.awards-marquee');
  var track = marquee && marquee.querySelector('.awards-track');
  if (!marquee || !track) return;

  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  var baseSpeed = -track.scrollWidth / 2 / 48; // исходный ход влево, 48 секунд на цикл
  var position = 0;
  var extraSpeed = 0;
  var period = 0;
  var lastFrame = 0;
  var raf = 0;
  var paused = false;
  var dragging = false;
  var moved = false;
  var pointerId = null;
  var startX = 0;
  var startY = 0;
  var lastX = 0;
  var lastTime = 0;
  var dragVelocity = 0;
  var suppressClick = false;
  var decay = 3.2; // скорость затухания дополнительной инерции

  function measure(){
    period = track.scrollWidth / 2;
    if (period > 0) baseSpeed = -period / 48;
    normalize();
    render();
  }

  function normalize(){
    if (!period) return;
    position = ((position % period) + period) % period;
    position = position === 0 ? 0 : position - period;
  }

  function render(){
    track.style.transform = 'translate3d(' + position + 'px, 0, 0)';
  }

  function stop(){
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    lastFrame = 0;
  }

  function frame(now){
    raf = 0;
    if (paused || document.hidden || !period) return;
    if (lastFrame){
      var dt = Math.min((now - lastFrame) / 1000, 0.05);
      position += (baseSpeed + extraSpeed) * dt;
      extraSpeed *= Math.exp(-decay * dt);
      if (Math.abs(extraSpeed) < 0.15) extraSpeed = 0;
      normalize();
      render();
    }
    lastFrame = now;
    raf = requestAnimationFrame(frame);
  }

  function play(){
    if (paused || document.hidden || dragging || raf) return;
    lastFrame = 0;
    raf = requestAnimationFrame(frame);
  }

  function setPaused(value){
    paused = value;
    if (paused) stop();
    else play();
  }

  // На компьютере сохраняем прежнее поведение: наведение мыши
  // или клавиатурный фокус внутри ленты останавливает движение.
  marquee.addEventListener('mouseenter', function(){ setPaused(true); });
  marquee.addEventListener('mouseleave', function(){ setPaused(false); });
  marquee.addEventListener('focusin', function(){ setPaused(true); });
  marquee.addEventListener('focusout', function(e){
    if (!marquee.contains(e.relatedTarget)) setPaused(false);
  });

  // Свайп только пальцем/пером: обычное управление мышью и hover
  // остаются такими же, как раньше.
  marquee.addEventListener('pointerdown', function(e){
    if (e.pointerType === 'mouse' || paused || !period) return;
    dragging = true;
    moved = false;
    pointerId = e.pointerId;
    startX = lastX = e.clientX;
    startY = e.clientY;
    lastTime = performance.now();
    dragVelocity = 0;
    stop();
  });

  marquee.addEventListener('pointermove', function(e){
    if (!dragging || e.pointerId !== pointerId) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - startY;

    if (!moved){
      var totalX = e.clientX - startX;
      if (Math.abs(totalX) < 5 || Math.abs(totalX) < Math.abs(dy)) return;
      moved = true;
      try { marquee.setPointerCapture(pointerId); } catch(err) {}
    }

    if (moved){
      var now = performance.now();
      var dt = Math.max((now - lastTime) / 1000, 0.001);
      position += dx;
      dragVelocity = dx / dt;
      lastX = e.clientX;
      lastTime = now;
      normalize();
      render();
      if (e.cancelable) e.preventDefault();
    }
  }, {passive:false});

  function finishDrag(e){
    if (!dragging || (e && e.pointerId !== pointerId)) return;
    var wasMoved = moved;
    dragging = false;
    pointerId = null;
    if (wasMoved){
      // Ограничиваем импульс, чтобы даже очень быстрый свайп
      // оставался управляемым и не уносил ленту надолго.
      extraSpeed = Math.max(-1800, Math.min(1800, dragVelocity));
      suppressClick = true;
      setTimeout(function(){ suppressClick = false; }, 350);
    }
    play();
  }

  marquee.addEventListener('pointerup', finishDrag);
  marquee.addEventListener('pointercancel', finishDrag);
  marquee.addEventListener('lostpointercapture', finishDrag);
  marquee.addEventListener('click', function(e){
    if (!suppressClick) return;
    e.preventDefault();
    e.stopPropagation();
    suppressClick = false;
  }, true);

  document.addEventListener('visibilitychange', function(){
    if (document.hidden) stop();
    else play();
  });

  if ('ResizeObserver' in window){
    new ResizeObserver(measure).observe(track);
  } else {
    window.addEventListener('resize', measure);
  }

  measure();
  play();
})();
