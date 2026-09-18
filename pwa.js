/* Match2Vote install helper.
 * Plain DOM on purpose: it does not touch App.js, it renders above the
 * react-native-web root, and it is a no-op inside the native app builds.
 *
 * Android (Chrome, Edge, Samsung Internet): waits for beforeinstallprompt and
 * shows a small "Install Match2Vote" button that calls prompt().
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

  // 2. Android: real install prompt.
  var deferredPrompt = null;
  var installBtn = null;

  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferredPrompt = e;
    if (dismissed() || installBtn) return;

    installBtn = document.createElement('button');
    installBtn.type = 'button';
    installBtn.setAttribute('aria-label', 'Install Match2Vote on this device');
    installBtn.textContent = 'Install Match2Vote';
    baseStyle(installBtn);
    installBtn.style.background = ACCENT;
    installBtn.style.color = '#FFFFFF';
    installBtn.style.border = '0';
    installBtn.style.padding = '14px 22px';
    installBtn.style.fontSize = '16px';
    installBtn.style.fontWeight = '700';
    installBtn.style.cursor = 'pointer';
    installBtn.style.borderRadius = '999px';

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
      remember();
      installBtn.remove();
      installBtn = null;
    });
    installBtn.appendChild(close);

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
  var ua = window.navigator.userAgent || '';
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
