/* =========================================================
   GameBox — логика страницы: карточки игр, вкладки, лайтбокс.
   Чтобы добавить игру — допиши объект в массив GAMES.
   ========================================================= */

const GAMES = [
  {
    id: 'escape-teacher',
    title: 'Убеги от учителя',
    genre: 'Аркада · раннер',
    desc: 'Убегай от учителей, собирай монеты, прокачивай скорость и оружие в магазине и дерись с боссами — от Литературщицы до Директора.',
    cover: 'assets/screens/gameplay.png',
    coverWebp: 'assets/screens/gameplay.webp',
    tags: ['Аркада', 'Боссы', 'Магазин', 'Офлайн'],
    version: '1.0',
    size: '128 КБ',
    play: 'game/',
    android: 'downloads/escape-teacher.apk',
    ios: 'game/',
    isNew: true
  }
];

const GRID = document.getElementById('gamesGrid');

function cardHTML(g) {
  return `
    <article class="game-card">
      <div class="game-cover">
        ${g.isNew ? '<span class="game-tag new">NEW</span>' : ''}
        <picture>
          ${g.coverWebp ? `<source srcset="${g.coverWebp}" type="image/webp">` : ''}
          <img src="${g.cover}" alt="${g.title}" loading="lazy">
        </picture>
      </div>
      <div class="game-body">
        <div class="game-title">
          <h3>${g.title}</h3>
          <span>${g.genre}</span>
        </div>
        <p class="game-desc">${g.desc}</p>
        <div class="tags">${g.tags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div class="meta">
          <span>версия <b>${g.version}</b></span>
          <span><b>${g.size}</b></span>
          <span>Android · iOS · PC</span>
        </div>
        <div class="card-actions">
          <a class="btn primary small" href="${g.play}"><span class="ico">▶</span> Играть</a>
          <a class="btn android small" href="${g.android}" download><span class="ico">🤖</span> APK</a>
          <button class="btn ios small" data-ios="1"><span class="ico">📱</span> iPhone</button>
        </div>
      </div>
    </article>`;
}

function soonHTML() {
  return `
    <article class="game-card soon">
      <div class="plus">+</div>
      <h3>Скоро новая игра</h3>
      <p>Каталог пополняется. Заглядывай позже — или напиши, какую игру хочешь увидеть следующей.</p>
    </article>`;
}

if (GRID) GRID.innerHTML = GAMES.map(cardHTML).join('') + soonHTML();

/* ---------------- вкладки установки ---------------- */
const tabs = Array.from(document.querySelectorAll('.tab'));
const panels = Array.from(document.querySelectorAll('.panel'));

function activateTab(name) {
  tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  panels.forEach(p => p.classList.toggle('active', p.dataset.panel === name));
}

tabs.forEach(t => {
  t.addEventListener('click', () => activateTab(t.dataset.tab));
});

/* ---------------- toast ---------------- */
const toastEl = document.getElementById('toast');
let toastTimer = null;

function toast(text, ms) {
  if (!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), ms || 4200);
}

/* ---------------- кнопка iPhone на карточке ---------------- */
document.addEventListener('click', e => {
  const iosBtn = e.target.closest('[data-ios]');
  if (iosBtn) {
    e.preventDefault();
    activateTab('ios');
    const target = document.getElementById('install');
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    toast('На iPhone: открой игру в Safari → «Поделиться» → «На экран «Домой»»', 6000);
    return;
  }

  const shot = e.target.closest('.shot');
  if (shot) {
    openLightbox(shot.dataset.full);
  }
});

/* ---------------- лайтбокс ---------------- */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

function openLightbox(src) {
  if (!lightbox || !lightboxImg || !src) return;
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  if (!lightbox) return;
  lightbox.classList.remove('open');
  lightboxImg.removeAttribute('src');
  document.body.style.overflow = '';
}

if (lightbox) {
  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ---------------- подсказка владельцам iPhone ---------------- */
(function iosHint() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  const standalone = window.navigator.standalone === true ||
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

  if (!isIOS || !isSafari || standalone) return;
  if (sessionStorage.getItem('ios-hint-seen')) return;

  setTimeout(() => {
    toast('Поставить игру на iPhone: «Поделиться» → «На экран «Домой»»', 6500);
    try { sessionStorage.setItem('ios-hint-seen', '1'); } catch (err) {}
  }, 2600);
})();
