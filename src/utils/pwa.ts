// PWA Service Worker Registration and Management

interface ServiceWorkerConfig {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

class PWAManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = config;
    this.init();
  }

  private async init() {
    if ('serviceWorker' in navigator) {
      try {
        await this.registerServiceWorker();
        this.setupNetworkListeners();
        this.setupUpdateListeners();
      } catch (error) {
        console.error('PWA initialization failed:', error);
      }
    }
  }

  private async registerServiceWorker() {
    try {
      console.log('Registering service worker...');

      this.registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/'
      });

      console.log('Service worker registered successfully:', this.registration);

      // Check for updates immediately
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Check for updates every 60 seconds
      setInterval(() => {
        this.registration?.update();
      }, 60000);

      if (this.config.onSuccess) {
        this.config.onSuccess(this.registration);
      }

    } catch (error) {
      console.error('Service worker registration failed:', error);
      throw error;
    }
  }

  private handleUpdateFound() {
    if (!this.registration) return;

    const newWorker = this.registration.installing;
    if (!newWorker) return;

    console.log('New service worker found, installing...');

    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // New update available
          console.log('New content available, please refresh.');
          if (this.config.onUpdate) {
            this.config.onUpdate(this.registration!);
          } else {
            this.showUpdateNotification();
          }
        } else {
          // Content is cached for offline use
          console.log('Content is cached for offline use.');
        }
      }
    });
  }

  private showUpdateNotification() {
    if (confirm('A new version of Bristol Park HMS is available. Refresh to update?')) {
      window.location.reload();
    }
  }

  private setupNetworkListeners() {
    window.addEventListener('online', () => {
      console.log('App is online');
      this.handleOnline();
    });

    window.addEventListener('offline', () => {
      console.log('App is offline');
      this.handleOffline();
    });

    // Initial status check
    if (!navigator.onLine) {
      this.handleOffline();
    }
  }

  private setupUpdateListeners() {
    // Listen for messages from service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
        this.handleUpdateFound();
      }
    });
  }

  private handleOnline() {
    // Remove offline indicators
    document.body.classList.remove('app-offline');

    // Trigger background sync if available
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        return registration.sync.register('background-sync');
      });
    }

    if (this.config.onOnline) {
      this.config.onOnline();
    }
  }

  private handleOffline() {
    // Add offline indicators
    document.body.classList.add('app-offline');

    if (this.config.onOffline) {
      this.config.onOffline();
    }
  }

  // Public methods
  public async skipWaiting() {
    if (this.registration && this.registration.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  public async checkForUpdates() {
    if (this.registration) {
      await this.registration.update();
    }
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public async getVersion(): Promise<string> {
    return new Promise((resolve) => {
      if (!navigator.serviceWorker.controller) {
        resolve('No service worker');
        return;
      }

      const messageChannel = new MessageChannel();
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.version || 'Unknown');
      };

      navigator.serviceWorker.controller.postMessage(
        { type: 'GET_VERSION' },
        [messageChannel.port2]
      );
    });
  }

  public async clearCache() {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    }
  }

  public async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    let totalSize = 0;
    const cacheNames = await caches.keys();

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const requests = await cache.keys();

      for (const request of requests) {
        const response = await cache.match(request);
        if (response) {
          const blob = await response.blob();
          totalSize += blob.size;
        }
      }
    }

    return totalSize;
  }
}

// Utility functions
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isPWAInstalled = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as any).standalone === true;
};

export const canInstallPWA = (): boolean => {
  return 'serviceWorker' in navigator &&
         'PushManager' in window &&
         'Notification' in window;
};

// Default PWA manager instance
export const pwaManager = new PWAManager({
  onSuccess: (registration) => {
    console.log('Bristol Park HMS PWA ready');
  },
  onUpdate: (registration) => {
    console.log('Bristol Park HMS update available');
  },
  onOffline: () => {
    console.log('Bristol Park HMS is now offline');
  },
  onOnline: () => {
    console.log('Bristol Park HMS is back online');
  }
});

export default PWAManager;
