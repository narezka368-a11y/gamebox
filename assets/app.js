/* =========================================================
   GameBox — логика страницы: карточки игр, вкладки, лайтбокс.
   Чтобы добавить игру — допиши объект в массив GAMES.
   ========================================================= */

const GAMES = [
  {
    id: 'escape-teacher',
    title: 'Убеги от учителя',
    genre: 'Аркада · 3D',
    desc: 'Объёмная графика: убегай от учителей, собирай монеты, прокачивай скорость и оружие и дерись с боссами — от Литературщицы до Директора.',
    cover: 'assets/screens/gameplay.png',
    coverWebp: 'assets/screens/gameplay.webp',
    tags: ['Аркада', '3D', 'Боссы', 'Магазин', 'Офлайн'],
    version: '1.0',
    size: '129 КБ',
    play: 'game/',
    android: 'downloads/escape-teacher.apk',
    ios: 'game/',
    versions: [
      { label: 'Сверху · 3D', play: 'game/', apk: 'downloads/escape-teacher.apk' },
      { label: '1-е лицо · 3D', play: 'game/fps/', apk: 'downloads/escape-fps.apk' },
      { label: 'Классика · 2D', play: 'game/classic/', apk: 'downloads/escape-teacher-2d.apk' }
    ],
    isNew: false
  },
  {
    id: 'learn-and-play',
    title: 'Учись и играй',
    genre: 'Обучение · викторины',
    desc: 'Школьные предметы в игровой форме: конспекты, викторины, кроссворды и задания по истории, литературе и математике. Роли: ученик, староста, учитель, создатель.',
    cover: 'assets/screens/learn-play.png',
    coverWebp: 'assets/screens/learn-play.webp',
    tags: ['Обучение', 'Викторины', 'Роли', 'Офлайн'],
    version: '1.0',
    size: '345 КБ',
    play: 'game/learn-and-play/',
    android: 'downloads/learn-and-play.apk',
    ios: 'game/learn-and-play/',
    isNew: true
  }
];

const GRID = document.getElementById('gamesGrid');

function cardHTML(g) {
  const vs = g.versions || null;
  let idx = 0;
  if (vs) {
    try {
      const saved = parseInt(localStorage.getItem('gb:ver:' + g.id), 10);
      if (!isNaN(saved) && saved >= 0 && saved < vs.length) idx = saved;
    } catch (e) {}
  }
  const active = vs ? vs[idx] : { play: g.play, apk: g.android };

  const switcher = vs ? `
        <div class="ver-switch" role="tablist" aria-label="Версия игры">
          ${vs.map((v, i) => `<button class="ver${i === idx ? ' on' : ''}" data-ver="${i}" role="tab" aria-selected="${i === idx}">${v.label}</button>`).join('')}
        </div>` : '';

  return `
    <article class="game-card" data-id="${g.id}">
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
        </div>${switcher}
        <div class="card-actions">
          <a class="btn primary small" data-play href="${active.play}"><span class="ico">▶</span> Играть</a>
          ${active.apk ? `<a class="btn android small" data-apk href="${active.apk}" download><span class="ico">🤖</span> APK</a>` : '<a class="btn android small ghost hidden" data-apk href="#" aria-hidden="true"></a>'}
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

/* ---------------- кнопки в карточке ---------------- */
document.addEventListener('click', e => {
  const verBtn = e.target.closest('.ver');
  if (verBtn) {
    e.preventDefault();
    const card = verBtn.closest('.game-card');
    const game = GAMES.find(g => g.id === card.dataset.id);
    const idx = parseInt(verBtn.dataset.ver, 10);
    const v = game && game.versions ? game.versions[idx] : null;
    if (v) {
      card.querySelectorAll('.ver').forEach(b => {
        const on = b === verBtn;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', String(on));
      });
      const play = card.querySelector('[data-play]');
      const apk = card.querySelector('[data-apk]');
      if (play) play.href = v.play;
      if (apk) {
        if (v.apk) {
          apk.href = v.apk;
          apk.classList.remove('hidden');
          apk.innerHTML = '<span class="ico">🤖</span> APK';
        } else {
          apk.classList.add('hidden');
        }
      }
      try { localStorage.setItem('gb:ver:' + card.dataset.id, String(idx)); } catch (err) {}
      toast('Версия: ' + v.label, 2200);
    }
    return;
  }

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
