/* ════════════════════════════════════════════════════════════
   C DESIGN — MOTOR DE EFECTE (design «neon slides»)
   1. Injectează fundalul animat (SVG, în culorile temei)
   2. Pe desktop, transformă secțiunile paginii în slide-uri care
      intră alternativ din stânga / din dreapta
   3. Aplică automat caseta neon pe conținutul fiecărui slide
   Pe mobil și la prefers-reduced-motion, pagina rămâne cu scroll
   normal și animațiile existente.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function init() {
    var body = document.body;
    if (!body || !body.hasAttribute('data-fx')) return;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ── 1. FUNDAL ANIMAT ─────────────────────────────────── */
    var bg = document.createElement('div');
    bg.className = 'fx-bg';
    bg.setAttribute('aria-hidden', 'true');
    bg.innerHTML =
      '<svg viewBox="0 0 1772 886" preserveAspectRatio="xMidYMid slice">'
      + '<defs><pattern id="fxdots" width="26" height="26" patternUnits="userSpaceOnUse">'
      + '<circle cx="4" cy="4" r="2.4" fill="currentColor" opacity=".4"/></pattern></defs>'
      + '<g class="fx-lines"><line x1="0" y1="700" x2="1772" y2="690"/><line x1="0" y1="760" x2="1772" y2="755"/>'
      + '<line x1="0" y1="820" x2="1772" y2="818"/><line x1="0" y1="640" x2="1772" y2="628"/></g>'
      + '<g class="fx-dotswave" style="color:var(--teal,#00c8b4)" opacity=".4">'
      + '<path d="M-200,480 C160,360 420,640 760,560 C1100,480 1240,760 1600,660 C1820,600 2000,500 2100,480 L2100,886 L-200,886 Z" fill="url(#fxdots)" opacity=".5"/>'
      + '<path d="M-150,560 C200,460 480,700 820,620 C1160,540 1330,820 1700,700 L2150,640 L2150,886 L-150,886 Z" fill="url(#fxdots)" opacity=".35"/></g>'
      + '<g class="fx-lines" opacity=".8"><polyline points="700,150 620,600 1020,610 1110,200 700,150" fill="none"/>'
      + '<line x1="1110" y1="200" x2="1370" y2="0"/><line x1="1020" y1="610" x2="1420" y2="480"/>'
      + '<line x1="1110" y1="200" x2="1420" y2="480"/><line x1="620" y1="600" x2="380" y2="886"/></g>'
      + '<g><polygon class="fx-tri fx-tri-slow" points="300,180 250,330 440,320"/>'
      + '<polygon class="fx-tri fx-tri-med" points="340,30 270,180 430,170"/>'
      + '<polygon class="fx-tri fx-tri-slow" points="120,440 110,520 260,500"/>'
      + '<polygon class="fx-tri fx-tri-med" points="1440,90 1530,260 1640,170"/>'
      + '<polygon class="fx-tri fx-tri-slow" points="1400,600 1430,760 1560,680"/>'
      + '<polygon class="fx-tri fx-tri-med" points="1540,400 1590,470 1650,420"/>'
      + '<polygon class="fx-tri fx-tri-slow" points="120,690 230,680 180,760"/>'
      + '<polygon class="fx-tri fx-tri-med" points="430,600 415,680 510,660"/>'
      + '<polygon class="fx-tri fx-tri-slow" points="540,700 460,886 640,860"/>'
      + '<polygon class="fx-tri fx-tri-med" points="1190,690 1240,780 1300,710"/>'
      + '<polygon class="fx-tri fx-tri-slow" points="1200,90 1230,140 1180,140"/>'
      + '<polygon class="fx-tri fx-tri-med" points="1690,540 1772,640 1772,500"/></g>'
      + '<rect class="fx-diamond" x="1050" y="20" width="34" height="34" transform="rotate(45 1067 37)"/>'
      + '<rect class="fx-diamond" x="1395" y="455" width="28" height="28" transform="rotate(45 1409 469)" style="animation-delay:-8s"/>'
      + '<path class="fx-plus" d="M485,232 h14 v-14 h14 v14 h14 v14 h-14 v14 h-14 v-14 h-14 z" transform="rotate(18 506 246)"/>'
      + '<path class="fx-plus" d="M645,755 h13 v-13 h13 v13 h13 v13 h-13 v13 h-13 v-13 h-13 z" transform="rotate(12 664 768)" style="animation-delay:-1.6s"/>'
      + '<circle class="fx-glow" cx="745" cy="205" r="5"/><circle class="fx-glow" cx="900" cy="135" r="4" style="animation-delay:-1s"/>'
      + '<circle class="fx-glow" cx="585" cy="565" r="4.5" style="animation-delay:-2.2s"/><circle class="fx-glow" cx="1005" cy="645" r="5" style="animation-delay:-.6s"/>'
      + '<circle class="fx-glow" cx="755" cy="825" r="4" style="animation-delay:-1.8s"/><circle class="fx-glow" cx="1530" cy="745" r="4.5" style="animation-delay:-2.8s"/>'
      + '</svg>';
    body.prepend(bg);

    var main = document.querySelector('main');
    if (!main) return;

    /* ── 2. MOTOR SLIDE ───────────────────────────────────── */
    var SLIDE_MS = 1400, COOLDOWN_MS = 300;
    var panels = [], active = 0, animating = false;

    var dotsBox = document.createElement('div');
    dotsBox.className = 'fx-dots';
    dotsBox.setAttribute('aria-label', 'Navigare secțiuni');
    body.appendChild(dotsBox);

    /* indiciu de scroll pe primul slide — dispare la prima interacțiune */
    var hint = document.createElement('div');
    hint.className = 'fx-scrollhint';
    hint.setAttribute('aria-hidden', 'true');
    hint.innerHTML = '<span class="fx-sh-mouse"><span></span></span>'
      + '<span class="fx-sh-chevs"><i></i><i></i></span>'
      + '<span class="fx-sh-label">scroll</span>';
    body.appendChild(hint);
    var hintDismissed = false, hintTimer = null;
    function showHint() {
      if (hintDismissed) return;
      clearTimeout(hintTimer);
      hintTimer = setTimeout(function () {
        if (!hintDismissed && body.classList.contains('fx-slide')) hint.classList.add('show');
      }, 1500);
    }
    function dismissHint() {
      if (hintDismissed) return;
      hintDismissed = true;
      clearTimeout(hintTimer);
      hint.classList.remove('show');
    }
    ['wheel', 'touchstart', 'keydown'].forEach(function (e) {
      window.addEventListener(e, dismissHint, { passive: true, once: false });
    });

    function slideOn() {
      // activ pe toate dispozitivele; doar prefers-reduced-motion îl oprește
      return !reduced && window.innerHeight >= 420;
    }
    function side(i) { return i % 2 === 0 ? 'left' : 'right'; }

    function collectPanels() {
      var kids = Array.prototype.slice.call(main.children).filter(function (el) {
        // toate elementele vizibile devin slide-uri — fără filtru de înălțime
        // (unele secțiuni, ex. carousel-ul, au înălțimea calculată târziu de
        // propriul JS și ar rămâne altfel plutind peste slide-ul activ)
        return getComputedStyle(el).display !== 'none';
      });
      // respectă ordinea vizuală setată de layout-ul din admin (flex order)
      kids.sort(function (a, b) {
        return (parseInt(getComputedStyle(a).order, 10) || 0) - (parseInt(getComputedStyle(b).order, 10) || 0);
      });
      // footer-ul NU mai e slide — devine bară fixă jos (vezi effects.css)
      return kids;
    }

    function buildDots() {
      dotsBox.innerHTML = '';
      panels.forEach(function (p, i) {
        var b = document.createElement('button');
        b.setAttribute('aria-label', 'Secțiunea ' + (i + 1));
        b.addEventListener('click', function () { goTo(i); });
        dotsBox.appendChild(b);
      });
      updateDots();
    }
    function updateDots() {
      Array.prototype.forEach.call(dotsBox.children, function (d, i) {
        d.classList.toggle('on', i === active);
      });
    }

    function teardown() {
      body.classList.remove('fx-slide');
      panels.forEach(function (p) {
        p.classList.remove('fx-panel', 'fx-off-left', 'fx-off-right', 'fx-active', 'fx-notrans');
        var c = p.querySelector('.fx-neon');
        if (c) c.classList.remove('fx-neon');
      });
    }

    function setup() {
      teardown();
      panels = collectPanels();
      if (active >= panels.length) active = 0;
      buildDots();
      if (!slideOn() || panels.length < 2) return;
      body.classList.add('fx-slide');
      window.scrollTo(0, 0);
      panels.forEach(function (p, i) {
        p.classList.add('fx-panel', 'fx-notrans');
        if (i === active) p.classList.add('fx-active');
        else p.classList.add(side(i) === 'left' ? 'fx-off-left' : 'fx-off-right');
        // fără casetă neon pe bannerele vizuale: hero-ul cu fotografie de
        // fundal sau secțiunile marcate explicit cu data-fx-noneon
        var skipNeon = p.hasAttribute('data-fx-noneon')
          || p.getAttribute('data-section') === 'hero'
          || p.querySelector('.hero-bg-photo');
        if (!skipNeon) {
          var c = p.querySelector(':scope > .container, :scope > .wide, :scope > * > .container');
          if (c) c.classList.add('fx-neon');
        }
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          panels.forEach(function (p) { p.classList.remove('fx-notrans'); });
        });
      });
      if (active === 0) showHint();
    }

    function goTo(j) {
      if (!body.classList.contains('fx-slide')) return;
      if (animating || j === active || j < 0 || j >= panels.length) return;
      animating = true;
      var cur = panels[active], nxt = panels[j], prevIdx = active;
      active = j;
      var exitClass = side(j) === 'left' ? 'fx-off-right' : 'fx-off-left';
      dismissHint();
      cur.classList.remove('fx-active');
      cur.classList.add(exitClass);
      nxt.classList.remove('fx-off-left', 'fx-off-right');
      nxt.classList.add('fx-active');
      updateDots();
      setTimeout(function () {
        cur.classList.add('fx-notrans');
        cur.classList.remove('fx-off-left', 'fx-off-right');
        cur.classList.add(side(prevIdx) === 'left' ? 'fx-off-left' : 'fx-off-right');
        void cur.offsetWidth;
        cur.classList.remove('fx-notrans');
        animating = false;
      }, SLIDE_MS + COOLDOWN_MS);
    }

    /* input: rotiță — întâi derulează caseta internă, apoi schimbă slide-ul */
    window.addEventListener('wheel', function (e) {
      if (!body.classList.contains('fx-slide')) return;
      var boxEl = panels[active] && panels[active].querySelector('.fx-neon');
      if (boxEl && boxEl.scrollHeight > boxEl.clientHeight + 4) {
        var down = e.deltaY > 0;
        var atTop = boxEl.scrollTop <= 0;
        var atBottom = boxEl.scrollTop + boxEl.clientHeight >= boxEl.scrollHeight - 4;
        if ((down && !atBottom) || (!down && !atTop)) return;
      }
      e.preventDefault();
      if (animating || Math.abs(e.deltaY) < 8) return;
      goTo(active + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    window.addEventListener('keydown', function (e) {
      if (!body.classList.contains('fx-slide')) return;
      if (e.target.closest('input,textarea,select')) return;
      if (['ArrowDown', 'PageDown', ' ', 'ArrowRight'].indexOf(e.key) > -1) { e.preventDefault(); goTo(active + 1); }
      else if (['ArrowUp', 'PageUp', 'ArrowLeft'].indexOf(e.key) > -1) { e.preventDefault(); goTo(active - 1); }
    });

    /* input: touch — swipe vertical schimbă slide-ul; caseta internă
       derulează nativ și are prioritate până ajunge la capăt */
    var tY = null, tX = null;
    window.addEventListener('touchstart', function (e) {
      if (!body.classList.contains('fx-slide')) return;
      tY = e.touches[0].clientY;
      tX = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener('touchend', function (e) {
      if (!body.classList.contains('fx-slide') || tY === null) return;
      var endY = e.changedTouches[0].clientY, endX = e.changedTouches[0].clientX;
      var dy = tY - endY, dx = tX - endX;
      tY = null; tX = null;
      if (e.target.closest('.mobile-menu, nav, .fx-dots')) return;
      if (animating || Math.abs(dy) < 55 || Math.abs(dy) < Math.abs(dx) * 1.2) return;
      var down = dy > 0;
      var boxEl = panels[active] && panels[active].querySelector('.fx-neon');
      if (boxEl && boxEl.scrollHeight > boxEl.clientHeight + 4) {
        var atTop = boxEl.scrollTop <= 0;
        var atBottom = boxEl.scrollTop + boxEl.clientHeight >= boxEl.scrollHeight - 4;
        if ((down && !atBottom) || (!down && !atTop)) return;
      }
      goTo(active + (down ? 1 : -1));
    }, { passive: true });

    /* link-urile cu ancoră sar la slide-ul care conține ținta */
    function panelIndexFor(id) {
      for (var i = 0; i < panels.length; i++) {
        if (panels[i].id === id || panels[i].querySelector('#' + (window.CSS && CSS.escape ? CSS.escape(id) : id))) return i;
      }
      return -1;
    }
    document.addEventListener('click', function (e) {
      if (!body.classList.contains('fx-slide')) return;
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href').slice(1);
      if (!id) return;
      var idx = panelIndexFor(id);
      if (idx > -1) { e.preventDefault(); goTo(idx); }
    });

    /* secțiuni injectate dinamic (blocuri custom, portofoliu) → re-scan */
    var moT;
    new MutationObserver(function () {
      clearTimeout(moT);
      moT = setTimeout(setup, 350);
    }).observe(main, { childList: true });

    var rsT;
    window.addEventListener('resize', function () {
      clearTimeout(rsT);
      rsT = setTimeout(setup, 250);
    });

    /* prima inițializare IMEDIAT (înainte de primul paint, când e posibil)
       — altfel rearanjarea în panouri la +400ms după load era numărată
       de Lighthouse drept Cumulative Layout Shift */
    setup();
    /* re-scan după load, când layout-ul din admin și blocurile custom
       au fost aplicate (MutationObserver acoperă și injectările târzii) */
    if (document.readyState === 'complete') setTimeout(setup, 400);
    else window.addEventListener('load', function () { setTimeout(setup, 400); });

    /* ancoră în URL la sosire (ex. /#portofoliu) */
    window.addEventListener('load', function () {
      setTimeout(function () {
        if (!location.hash || !body.classList.contains('fx-slide')) return;
        var idx = panelIndexFor(location.hash.slice(1));
        if (idx > -1) goTo(idx);
      }, 900);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
