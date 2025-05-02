import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MessageCenter } from './MessageCenter';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Set sidebarOpen to true by default so it's always visible
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [messageCenterOpen, setMessageCenterOpen] = useState(false);

  // Toggle sidebar function
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50 relative">
      <Sidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        className="transition-all duration-300 ease-in-out z-10"
      />

      <div className="flex flex-col flex-1 w-0 overflow-hidden relative">
        <Header
          onMenuButtonClick={toggleSidebar}
          onMessageButtonClick={() => setMessageCenterOpen(true)}
        />
        <main className="relative flex-1 overflow-y-auto focus:outline-none bg-white p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Message center is rendered at the end to ensure it's on top in the DOM order */}
      <MessageCenter
        isOpen={messageCenterOpen}
        onClose={() => setMessageCenterOpen(false)}
      />
    </div>
  );
};