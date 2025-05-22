import React, { useState, useEffect, useRef } from 'react';
import { UnifiedSidebar } from './UnifiedSidebar';
import { Header } from './Header';
import { MessageCenter } from './MessageCenter';
import { Pin, PinOff } from 'lucide-react';
import { ModuleQuickActionsProvider } from '../../context/ModuleQuickActionsContext';
import moduleQuickActions from '../../config/moduleQuickActions';

interface LayoutProps {
  children: React.ReactNode;
}

export const UnifiedLayout: React.FC<LayoutProps> = ({ children }) => {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(true); // Default to pinned
  const [isHovering, setIsHovering] = useState(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    // If toggling open, also pin it
    if (!sidebarOpen) {
      setIsPinned(true);
    }
  };

  // Toggle pin function
  const togglePin = () => {
    setIsPinned(!isPinned);
    // If unpinning, keep sidebar open if hovering
    if (isPinned && !isHovering) {
      setSidebarOpen(false);
    }
  };

  // Handle mouse enter/leave for auto-hide
  const handleMouseEnter = () => {
    setIsHovering(true);
    if (!isPinned) {
      setSidebarOpen(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    if (!isPinned) {
      setSidebarOpen(false);
    }
  };

  // Handle clicks on main content to auto-hide sidebar when not pinned
  useEffect(() => {
    const handleMainContentClick = () => {
      if (!isPinned && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    const mainContent = mainContentRef.current;
    if (mainContent) {
      mainContent.addEventListener('click', handleMainContentClick);
    }

    return () => {
      if (mainContent) {
        mainContent.removeEventListener('click', handleMainContentClick);
      }
    };
  }, [isPinned, sidebarOpen]);

  return (
    <ModuleQuickActionsProvider modules={moduleQuickActions}>
      <div className="flex h-screen bg-gray-50 relative">
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <UnifiedSidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            className="transition-all duration-300 ease-in-out z-10"
          />

          {/* Pin button */}
          {sidebarOpen && (
            <button
              onClick={togglePin}
              className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 z-20"
              title={isPinned ? "Unpin sidebar" : "Pin sidebar"}
            >
              {isPinned ? (
                <Pin className="w-4 h-4" />
              ) : (
                <PinOff className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        <div className="flex flex-col flex-1 w-0 overflow-hidden relative" ref={mainContentRef}>
          <Header
            onMenuButtonClick={toggleSidebar}
            onMessageButtonClick={() => setMessageCenterOpen(true)}
            sidebarOpen={sidebarOpen}
          />
          <main className="relative flex-1 overflow-y-auto focus:outline-none p-4 md:p-6">
            {children}
          </main>
        </div>

        {/* Message center is rendered at the end to ensure it's on top in the DOM order */}
        <MessageCenter
          isOpen={messageCenterOpen}
          onClose={() => setMessageCenterOpen(false)}
        />
      </div>
    </ModuleQuickActionsProvider>
  );
};
