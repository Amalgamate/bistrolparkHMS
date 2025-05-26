import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor, Zap } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check if running as PWA
      if (window.navigator.standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    // Check if iOS
    const checkIfIOS = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOS(isIOSDevice);
    };

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after a delay if not dismissed before
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    checkIfInstalled();
    checkIfIOS();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    } catch (error) {
      console.error('Error during installation:', error);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
    
    // Show again after 7 days
    setTimeout(() => {
      localStorage.removeItem('pwa-install-dismissed');
    }, 7 * 24 * 60 * 60 * 1000);
  };

  // Don't show if already installed
  if (isInstalled) return null;

  // Don't show if no prompt available and not iOS
  if (!deferredPrompt && !isIOS) return null;

  // Don't show if user dismissed
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <Download className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Install Bristol Park HMS</h3>
                <p className="text-sm opacity-90">Get the app experience</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-white hover:bg-white/20 p-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center space-x-2 text-sm">
              <Zap className="h-4 w-4" />
              <span>Faster access and better performance</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Smartphone className="h-4 w-4" />
              <span>Works offline for critical functions</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Monitor className="h-4 w-4" />
              <span>Native app experience on desktop</span>
            </div>
          </div>

          {isIOS ? (
            <div className="space-y-3">
              <p className="text-sm opacity-90">
                To install on iOS:
              </p>
              <ol className="text-xs space-y-1 opacity-90">
                <li>1. Tap the Share button in Safari</li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
                <li>3. Tap "Add" to install the app</li>
              </ol>
              <Button
                onClick={handleDismiss}
                className="w-full bg-white text-blue-600 hover:bg-gray-100"
              >
                Got it!
              </Button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <Button
                onClick={handleInstallClick}
                className="flex-1 bg-white text-blue-600 hover:bg-gray-100 font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                Install App
              </Button>
              <Button
                onClick={handleDismiss}
                variant="ghost"
                className="text-white hover:bg-white/20"
              >
                Later
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PWAInstallPrompt;
