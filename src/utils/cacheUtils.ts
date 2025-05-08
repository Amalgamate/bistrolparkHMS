export const APP_VERSION = '1.0.1';
export const CACHE_NAME = `bristol-park-hospital-${APP_VERSION}`;

const AUTH_ITEMS = ['auth_token', 'user_data'];

export const clearAllCaches = async (): Promise<void> => {
  if (typeof window === 'undefined') return;

  if ('caches' in window) {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared successfully');
    } catch (error) {
      console.error('Error clearing caches:', error);
    }
  }

  clearViteModuleCache();
};

export const clearLocalStorage = (preserveAuth: boolean = true): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  if (preserveAuth) {
    const savedItems: Record<string, string> = {};
    AUTH_ITEMS.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        savedItems[key] = value;
      }
    });

    localStorage.clear();

    Object.entries(savedItems).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });
  } else {
    localStorage.clear();
  }

  localStorage.setItem('app_version', APP_VERSION);
};

export const checkAndUpdateVersion = (): boolean => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return false;

  const storedVersion = localStorage.getItem('app_version');

  if (storedVersion !== APP_VERSION) {
    localStorage.setItem('app_version', APP_VERSION);
    return true;
  }

  return false;
};

export const forceReload = (): void => {
  if (typeof window === 'undefined') return;

  window.location.reload();
};

export const clearViteModuleCache = (): void => {
  if (typeof window === 'undefined') return;

  try {
    const viteProps = Object.keys(window).filter(key =>
      key.startsWith('__vite') ||
      key.includes('hmr') ||
      key.includes('hot')
    );

    viteProps.forEach(prop => {
      try {
        // @ts-ignore - Dynamic property access
        delete window[prop];
      } catch (e) {
        console.warn(`Could not clear Vite property: ${prop}`, e);
      }
    });
  } catch (error) {
    console.error('Error clearing Vite module cache:', error);
  }
};

export const addVersionToImports = (): void => {
  if (typeof document === 'undefined') return;

  try {
    const scripts = document.querySelectorAll('script[type="module"]');

    scripts.forEach(script => {
      const src = script.getAttribute('src');
      if (src && !src.includes('?v=')) {
        script.setAttribute('src', `${src}?v=${APP_VERSION}`);
      }
    });

    const links = document.querySelectorAll('link[rel="stylesheet"]');

    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.includes('?v=')) {
        link.setAttribute('href', `${href}?v=${APP_VERSION}`);
      }
    });
  } catch (error) {
    console.error('Error adding version to imports:', error);
  }
};

export const initCacheBusting = (): void => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  window.addEventListener('DOMContentLoaded', () => {
    addVersionToImports();
  });

  const storedVersion = localStorage.getItem('vite_cache_version');
  if (storedVersion !== APP_VERSION) {
    clearViteModuleCache();
    localStorage.setItem('vite_cache_version', APP_VERSION);
  }
};

export const refreshCache = async (preserveAuth: boolean = true, reload: boolean = true): Promise<void> => {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  try {
    localStorage.setItem('app_version', APP_VERSION);
    localStorage.setItem('cache_version', APP_VERSION);
    localStorage.setItem('dashboard_version', APP_VERSION);
    localStorage.setItem('module_grid_version', APP_VERSION);
    localStorage.setItem('vite_cache_version', APP_VERSION);

    await clearAllCaches();
    clearLocalStorage(preserveAuth);

    if (reload) {
      const timestamp = new Date().getTime();
      const currentUrl = window.location.href;
      const url = new URL(currentUrl);

      url.searchParams.delete('cache_bust');
      url.searchParams.set('cache_bust', timestamp.toString());

      window.location.replace(url.toString());
    }
  } catch (error) {
    console.error('Error refreshing cache:', error);
    if (reload) {
      window.location.reload();
    }
  }
};
