/* Match2Vote install helper.
 * Plain DOM on purpose: it does not touch App.js, it renders above the
 * react-native-web root, and it is a no-op inside the native app builds.
 *
 * Android: shows a small "Get the app" button. Tapping it opens a choice:
 * download Match2Vote from Google Play, or stay on the web (remembered).
 * Desktop Chrome/Edge: waits for beforeinstallprompt and shows a small
 * "Install Match2Vote" button that calls prompt().
 * iOS Safari: no install API exists, so show a one-time dismissable banner
 * explaining Share > Add to Home Screen. Never shown when already running
 * from the home screen.
 * Nothing here leaves the device. The only thing stored is a "dismissed" flag.
 */
(function () {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  var ACCENT = '#63305A';
  var DISMISS_KEY = 'm2v_install_banner_dismissed';
  var IOS_DELAY_MS = 20000; // let a first-time visitor get through onboarding first

  var standalone =
    (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) ||
    window.navigator.standalone === true;

  // 1. Service worker (required for the Android install prompt).
  if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(function () {});
    });
  }

  if (standalone) return;

  function dismissed() {
    try { return window.localStorage.getItem(DISMISS_KEY) === '1'; } catch (e) { return false; }
  }
  function remember() {
    try { window.localStorage.setItem(DISMISS_KEY, '1'); } catch (e) {}
  }

  function baseStyle(el) {
    el.style.position = 'fixed';
    el.style.left = '50%';
    el.style.transform = 'translateX(-50%)';
    el.style.bottom = 'calc(88px + env(safe-area-inset-bottom, 0px))';
    el.style.zIndex = '2147483000';
    el.style.maxWidth = 'min(92vw, 420px)';
    el.style.boxSizing = 'border-box';
    el.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    el.style.boxShadow = '0 8px 24px rgba(38, 32, 25, 0.28)';
    el.style.borderRadius = '16px';
  }

  var ua = window.navigator.userAgent || '';
  var isAndroid = /Android/i.test(ua);
  var PLAY_URL = 'https://play.google.com/store/apps/details?id=org.match2vote.app';

  function pill(label, ariaLabel) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', ariaLabel);
    btn.textContent = label;
    baseStyle(btn);
    btn.style.background = ACCENT;
    btn.style.color = '#FFFFFF';
    btn.style.border = '0';
    btn.style.padding = '14px 22px';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = '700';
    btn.style.cursor = 'pointer';
    btn.style.borderRadius = '999px';
    return btn;
  }

  function closeX(onClick) {
    var close = document.createElement('span');
    close.textContent = '\u00d7';
    close.setAttribute('role', 'button');
    close.setAttribute('aria-label', 'Dismiss');
    close.style.marginLeft = '14px';
    close.style.opacity = '0.75';
    close.style.fontSize = '20px';
    close.style.lineHeight = '1';
    close.addEventListener('click', function (ev) {
      ev.stopPropagation();
      onClick();
    });
    return close;
  }

  // 2a. Android: "Get the app" button. Tapping it asks the visitor whether to
  // download Match2Vote from Google Play or keep using the web version.
  // "Stay on the web" is remembered so the question is asked only once.
  var appBtn = null;

  function showAndroidChoice() {
    if (document.getElementById('m2v-android-choice')) return;

    var overlay = document.createElement('div');
    overlay.id = 'm2v-android-choice';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '2147483001';
    overlay.style.background = 'rgba(38, 32, 25, 0.45)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '24px';
    overlay.style.boxSizing = 'border-box';

    var sheet = document.createElement('div');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-labelledby', 'm2v-android-choice-title');
    sheet.style.background = '#FFFFFF';
    sheet.style.color = '#262019';
    sheet.style.border = '1px solid #EAE4DB';
    sheet.style.boxShadow = '0 8px 24px rgba(38, 32, 25, 0.28)';
    sheet.style.width = 'min(94vw, 520px)';
    sheet.style.boxSizing = 'border-box';
    sheet.style.padding = '40px 24px 32px';
    sheet.style.borderRadius = '24px';
    sheet.style.textAlign = 'center';
    sheet.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
    sheet.style.fontSize = '20px';
    sheet.style.lineHeight = '1.4';

    var title = document.createElement('div');
    title.id = 'm2v-android-choice-title';
    title.textContent = 'Match2Vote is on Google Play';
    title.style.fontWeight = '700';
    title.style.fontSize = '30px';
    title.style.lineHeight = '1.2';
    title.style.color = ACCENT;
    title.style.marginBottom = '14px';

    var body = document.createElement('div');
    body.textContent = 'The Android app is free and works the same as this site. Download it, or keep going here.';
    body.style.marginBottom = '32px';
    body.style.lineHeight = '1.45';

    function actionButton(label, primary) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.display = 'block';
      b.style.width = '100%';
      b.style.boxSizing = 'border-box';
      b.style.padding = '22px 20px';
      b.style.fontSize = '21px';
      b.style.fontWeight = '700';
      b.style.borderRadius = '999px';
      b.style.cursor = 'pointer';
      b.style.fontFamily = 'inherit';
      if (primary) {
        b.style.background = ACCENT;
        b.style.color = '#FFFFFF';
        b.style.border = '0';
        b.style.marginBottom = '16px';
      } else {
        b.style.background = 'transparent';
        b.style.color = ACCENT;
        b.style.border = '2px solid ' + ACCENT;
      }
      return b;
    }

    function close() {
      overlay.remove();
      document.removeEventListener('keydown', onKey);
    }
    function onKey(ev) {
      if (ev.key === 'Escape') close();
    }

    var download = actionButton('Download on Google Play', true);
    download.addEventListener('click', function () {
      close();
      window.location.href = PLAY_URL;
    });

    var stay = actionButton('Stay on the web', false);
    stay.addEventListener('click', function () {
      remember();
      close();
      if (appBtn) { appBtn.remove(); appBtn = null; }
    });

    overlay.addEventListener('click', function (ev) {
      if (ev.target === overlay) close();
    });
    document.addEventListener('keydown', onKey);

    sheet.appendChild(title);
    sheet.appendChild(body);
    sheet.appendChild(download);
    sheet.appendChild(stay);
    overlay.appendChild(sheet);
    document.body.appendChild(overlay);
    download.focus();
  }

  if (isAndroid && !dismissed()) {
    var mountAndroid = function () {
      if (appBtn || dismissed()) return;
      appBtn = pill('Get the app', 'Get the Match2Vote Android app');
      appBtn.appendChild(closeX(function () {
        remember();
        if (appBtn) { appBtn.remove(); appBtn = null; }
      }));
      appBtn.addEventListener('click', showAndroidChoice);
      document.body.appendChild(appBtn);
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', mountAndroid);
    } else {
      mountAndroid();
    }
  }

  // 2b. Other browsers with an install API (desktop Chrome, Edge): real PWA
  // install prompt, unchanged. Android is handled above and skips this.
  var deferredPrompt = null;
  var installBtn = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    if (isAndroid) return;
    deferredPrompt = e;
    if (dismissed() || installBtn) return;

    installBtn = pill('Install Match2Vote', 'Install Match2Vote on this device');
    installBtn.appendChild(closeX(function () {
      remember();
      installBtn.remove();
      installBtn = null;
    }));

    installBtn.addEventListener('click', function () {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(function () {
        deferredPrompt = null;
        if (installBtn) { installBtn.remove(); installBtn = null; }
      }).catch(function () {});
    });

    document.body.appendChild(installBtn);
  });

  window.addEventListener('appinstalled', function () {
    remember();
    if (installBtn) { installBtn.remove(); installBtn = null; }
  });

  // 3. iOS Safari: instructions banner, once.
  var isIOS = /iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|Instagram|FBAN|FBAV|Line\//.test(ua);

  if (isIOS && isSafari && !dismissed()) {
    window.setTimeout(function () {
      if (dismissed() || document.getElementById('m2v-ios-install')) return;

      var box = document.createElement('div');
      box.id = 'm2v-ios-install';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-label', 'Add Match2Vote to your home screen');
      baseStyle(box);
      box.style.background = '#FFFFFF';
      box.style.color = '#262019';
      box.style.border = '1px solid #EAE4DB';
      box.style.padding = '14px 44px 14px 16px';
      box.style.fontSize = '15px';
      box.style.lineHeight = '1.4';

      var title = document.createElement('div');
      title.textContent = 'Add Match2Vote to your home screen';
      title.style.fontWeight = '700';
      title.style.color = ACCENT;
      title.style.marginBottom = '4px';

      var body = document.createElement('div');
      body.textContent = 'Tap the Share button in Safari, then choose "Add to Home Screen". It opens like an app, no download needed.';

      var x = document.createElement('button');
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss');
      x.textContent = '\u00d7';
      x.style.position = 'absolute';
      x.style.top = '6px';
      x.style.right = '8px';
      x.style.border = '0';
      x.style.background = 'transparent';
      x.style.fontSize = '24px';
      x.style.lineHeight = '1';
      x.style.color = '#7A7167';
      x.style.cursor = 'pointer';
      x.style.padding = '6px';
      x.addEventListener('click', function () {
        remember();
        box.remove();
      });

      box.appendChild(title);
      box.appendChild(body);
      box.appendChild(x);
      document.body.appendChild(box);
    }, IOS_DELAY_MS);
  }
})();
