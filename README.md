# GameBox — сайт с играми

Статический сайт-каталог: карточки игр, кнопки «Играть / APK / iPhone», инструкции по установке,
скриншоты и FAQ. Никакого бэкенда — можно открыть файлом или залить на любой хостинг.

## Структура

```
site/
├─ index.html                  # лендинг-каталог
├─ assets/
│  ├─ styles.css
│  ├─ app.js                   # список игр GAMES + вкладки + лайтбокс
│  ├─ screens/                 # скриншоты (webp + png-фолбэк)
│  └─ icons/                   # favicon и apple-touch-icon сайта
├─ game/                       # веб-версия игры (PWA)
│  ├─ index.html               # копия escape-teacher.html
│  ├─ manifest.webmanifest
│  ├─ sw.js                    # офлайн-кеш
│  └─ icons/                   # 192 / 512 / maskable / apple-touch
└─ downloads/
   ├─ escape-teacher.apk       # Android
   └─ escape-teacher.html      # версия для офлайна на компьютере
```

## Как добавить новую игру

1. Положи её файлы в `site/game/<id>/` (и, если нужно, сборку в `site/downloads/`).
2. Добавь объект в массив `GAMES` в `site/assets/app.js`:

```js
{
  id: 'my-game',
  title: 'Моя игра',
  genre: 'Жанр · поджанр',
  desc: 'Пара предложений о чём игра.',
  cover: 'assets/screens/my-game.png',
  coverWebp: 'assets/screens/my-game.webp',
  tags: ['Аркада', 'Офлайн'],
  version: '1.0',
  size: '300 КБ',
  play: 'game/my-game/',
  android: 'downloads/my-game.apk',
  ios: 'game/my-game/',
  isNew: true
}
```

3. Добавь скриншоты в `site/assets/screens/` и (по желанию) карточку в ленту скриншотов.

Вёрстка перестроится сама: карточки рендерятся из массива, «Скоро новая игра» всегда последняя.

## iOS

На iPhone игра ставится как веб-приложение: Safari → «Поделиться» → «На экран «Домой»».
Для этого у страницы игры есть `manifest.webmanifest`, `apple-touch-icon`, метатеги
`apple-mobile-web-app-*` и сервис-воркер для офлайна.

Файл `.ipa` без Mac и сертификата Apple собрать нельзя, поэтому это честный и рабочий путь.
Если позже понадобится нативное приложение в App Store — игру оборачивают в Capacitor:

```bash
npm i -D @capacitor/cli && npm i @capacitor/core @capacitor/ios
npx cap init "Убеги от учителя" ru.escape.teacher --web-dir=game
npx cap add ios
npx cap sync ios
npx cap open ios      # дальше Xcode: подпись, архив, TestFlight
```

## Хостинг

Любой статический хостинг, например:

- **GitHub Pages** — залей папку `site/` в репозиторий, включи Pages.
- **Netlify / Cloudflare Pages / Vercel** — drag & drop папки `site/`.
- **Локально** — `python -m http.server 8080` в папке `site/` (сервис-воркер работает
  только по http/https, файлом через `file://` — без офлайн-кеша).

После правок игры не забудь обновить копию: `copy escape-teacher.html site\game\index.html`
и при необходимости пересобрать APK (`android\build-apk.ps1`) и положить его в `site/downloads/`.
