// HMR Helper for Bristol Park Hospital Development
// This provides better feedback during development

interface HMRStatus {
  isConnected: boolean;
  lastUpdate: Date | null;
  updateCount: number;
}

class HMRHelper {
  private status: HMRStatus = {
    isConnected: false,
    lastUpdate: null,
    updateCount: 0
  };

  private listeners: Array<(status: HMRStatus) => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    if (import.meta.hot) {
      // HMR is available
      this.status.isConnected = true;
      
      // Listen for HMR updates
      import.meta.hot.on('vite:beforeUpdate', () => {
        this.status.lastUpdate = new Date();
        this.status.updateCount++;
        this.notifyListeners();
        console.log('🔥 HMR: Updating modules...');
      });

      import.meta.hot.on('vite:afterUpdate', () => {
        console.log('✅ HMR: Update complete!');
        this.notifyListeners();
      });

      import.meta.hot.on('vite:error', (error) => {
        console.error('❌ HMR Error:', error);
        this.notifyListeners();
      });

      // Accept all updates for this module
      import.meta.hot.accept();
      
      console.log('🚀 Bristol Park Hospital - HMR Active');
      console.log('💡 Tips:');
      console.log('   • Save any file to see instant updates');
      console.log('   • CSS changes update without page reload');
      console.log('   • React components preserve state when possible');
      console.log('   • Use Ctrl+Shift+R for hard refresh if needed');
    } else {
      console.log('📦 Production build - HMR not available');
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.status));
  }

  public onStatusChange(callback: (status: HMRStatus) => void) {
    this.listeners.push(callback);
    // Immediately call with current status
    callback(this.status);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  public getStatus(): HMRStatus {
    return { ...this.status };
  }

  public isHMRAvailable(): boolean {
    return !!import.meta.hot;
  }

  // Force refresh the page (useful for debugging)
  public forceRefresh() {
    if (this.isHMRAvailable()) {
      console.log('🔄 Force refreshing page...');
      window.location.reload();
    }
  }

  // Clear console (useful during development)
  public clearConsole() {
    if (this.isHMRAvailable()) {
      console.clear();
      console.log('🧹 Console cleared - Bristol Park Hospital HMR');
    }
  }
}

// Create singleton instance
export const hmrHelper = new HMRHelper();

// Development utilities available in browser console
if (typeof window !== 'undefined' && import.meta.hot) {
  // Make HMR helper available globally for debugging
  (window as any).hmr = {
    status: () => hmrHelper.getStatus(),
    refresh: () => hmrHelper.forceRefresh(),
    clear: () => hmrHelper.clearConsole(),
    help: () => {
      console.log('🏥 Bristol Park Hospital - HMR Commands:');
      console.log('   hmr.status() - Show HMR status');
      console.log('   hmr.refresh() - Force page refresh');
      console.log('   hmr.clear() - Clear console');
      console.log('   hmr.help() - Show this help');
    }
  };
  
  console.log('🔧 HMR commands available: hmr.help()');
}

export default hmrHelper;
