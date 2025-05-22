import React, { useState, useRef, useEffect } from 'react';
import {
  Bell, Menu, MessageSquare, LogOut, User, Settings,
  Calendar, FileText, Users, HelpCircle, ChevronDown, Building,
  RefreshCw
} from 'lucide-react';
import IntelligentBranchSwitcher from '../auth/IntelligentBranchSwitcher';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearch } from '../search/GlobalSearch';
import { useNavigate } from 'react-router-dom';
import LoginAs from '../auth/LoginAs';
import { refreshCache } from '../../utils/cacheUtils';
import ModuleQuickActionsButton from './ModuleQuickActionsButton';

interface HeaderProps {
  onMenuButtonClick: () => void;
  onMessageButtonClick: () => void;
  sidebarOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onMenuButtonClick, onMessageButtonClick, sidebarOpen = true }) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
      <div className="flex items-center">
        <button
          type="button"
          className={`p-2 rounded-md focus:outline-none hover:bg-gray-100 transition-all duration-150 ${
            !sidebarOpen
              ? 'bg-[#2B3990] text-white hover:bg-[#1E2A6B]'
              : 'text-[#2B3990]'
          }`}
          onClick={onMenuButtonClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="ml-2 md:ml-0">
          <IntelligentBranchSwitcher />
        </div>
      </div>

      <div className="flex items-center flex-1 gap-x-4 justify-end">
        <div className="relative max-w-md w-full hidden md:block">
          <GlobalSearch
            onSelect={(result) => {
              if (result.action) {
                result.action();
              } else if (result.path) {
                navigate(result.path);
              }
            }}
          />
        </div>

        <button
          type="button"
          className="p-1 text-gray-500 rounded-md hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
          onClick={onMessageButtonClick}
        >
          <MessageSquare className="w-5 h-5" />
        </button>

        {/* Notification Button */}
        <button
          type="button"
          className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800] relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Refresh Cache Button */}
        <button
          type="button"
          className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800] relative"
          onClick={() => {
            if (confirm('This will refresh the application cache and reload the page. Continue?')) {
              refreshCache(true, true);
            }
          }}
          title="Refresh Application Cache"
        >
          <RefreshCw className="w-5 h-5" />
        </button>

        {/* Login As Button - Only visible for admins */}
        <LoginAs />

        {/* Module-specific Quick Action Button */}
        <ModuleQuickActionsButton />

        <div className="flex items-center">
          <div className="relative flex-shrink-0 ml-4" ref={menuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-[#F5B800] rounded-md p-1 hover:bg-gray-50 transition-colors"
            >
              <div className="mr-3 text-right hidden sm:block">
                <div className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</div>
                <div className="flex items-center">
                  <span className="inline-block w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                  <span className="text-xs text-gray-500">Online</span>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#F5B800]">
                <img
                  src="/user-avatar.svg"
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || 'Admin User'}&background=F5B800&color=000`;
                  }}
                />
              </div>
              <ChevronDown className="w-4 h-4 ml-1 text-gray-500 hidden sm:block" />
            </button>

            {userMenuOpen && (
              <>
                {/* Overlay to capture clicks outside the menu */}
                <div
                  className="fixed inset-0 z-[998]"
                  onClick={() => setUserMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-[1000] border border-gray-200 overflow-hidden">
                  {/* User Profile Header */}
                  <div className="px-5 py-4 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F5B800] mr-3">
                        <img
                          src="/user-avatar.svg"
                          alt="User Avatar"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${user?.name || 'Admin User'}&background=F5B800&color=000`;
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'admin@bristolparkhospital.com'}</p>
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                            {user?.role || 'Admin'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center justify-between bg-white rounded-md p-2 border border-gray-100">
                      <div className="flex items-center">
                        <Building className="w-4 h-4 text-[#2B3990] mr-2" />
                        <span className="text-sm font-bold text-[#2B3990]">{user?.branch || 'FEDHA'}</span>
                      </div>
                      <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">Active</span>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    >
                      <User className="h-4 w-4 mr-2 text-gray-500" />
                      My Profile
                    </a>
                    <a href="#" className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <span>My Profile</span>
                    </a>
                    <a href="#" className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center mr-3">
                        <Settings className="w-4 h-4 text-purple-600" />
                      </div>
                      <span>Account Settings</span>
                    </a>
                    <a href="#" className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center mr-3">
                        <HelpCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <span>Help & Support</span>
                    </a>
                    <div className="border-t border-gray-100 my-1"></div>
                    <button
                      onClick={logout}
                      className="flex items-center w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center mr-3">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

