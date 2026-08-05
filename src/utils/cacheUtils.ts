export function clearBrowserCacheOnLoad() {
  if (typeof window === 'undefined') return;

  try {
    if ('caches' in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      }).catch((err) => {
        console.warn('Erro ao limpar CacheStorage:', err);
      });
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch((err) => {
        console.warn('Erro ao desregistrar ServiceWorker:', err);
      });
    }

    sessionStorage.clear();
  } catch (error) {
    console.error('Erro ao executar limpeza de cache:', error);
  }
}

export function forceClearCacheAndReload() {
  if (typeof window === 'undefined') return;

  clearBrowserCacheOnLoad();

  const currentUrl = new URL(window.location.href);
  currentUrl.searchParams.set('_nocache', Date.now().toString());
  window.location.href = currentUrl.toString();
}
