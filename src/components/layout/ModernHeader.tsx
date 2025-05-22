import React, { useState, useRef, useEffect } from 'react';
import {
  User, Settings, LogOut,
  Calendar, FileText, Users, MessageSquare, HelpCircle,
  ChevronDown, Menu, Building, MapPin, RefreshCw,
  LucideIcon
} from 'lucide-react';
import IntelligentBranchSwitcher from '../auth/IntelligentBranchSwitcher';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearch } from '../search/GlobalSearch';
import { useNavigate } from 'react-router-dom';
import { refreshCache } from '../../utils/cacheUtils';
import NotificationCenter from '../notifications/NotificationCenter';
import ModuleQuickActionsButton from './ModuleQuickActionsButton';
import '../../styles/theme.css';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

interface ModernHeaderProps {
  onMenuButtonClick: () => void;
  onMessageButtonClick: () => void;
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({
  onMenuButtonClick,
  onMessageButtonClick
}) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close the user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
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
          className="p-2 rounded-md focus:outline-none hover:bg-gray-100 transition-all duration-150"
          onClick={onMenuButtonClick}
        >
          <ColoredIcon icon={Menu} color="blue" size="sm" variant="text" />
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

        {/* Notification Center */}
        <NotificationCenter />

        {/* Refresh Cache Button */}
        <button
          type="button"
          className="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800] relative"
          onClick={() => {
            if (confirm('This will refresh the application cache and reload the page. Continue?')) {
              refreshCache(true, true);
            }
          }}
          title="Refresh Application Cache"
        >
          <ColoredIcon icon={RefreshCw} color="green" size="sm" variant="text" />
        </button>



        {/* Module-specific Quick Action Button */}
        <ModuleQuickActionsButton />

        {/* User Profile */}
        <div className="relative flex-shrink-0 ml-4" ref={userMenuRef}>
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
                      <ColoredIcon icon={Building} color="blue" size="xs" variant="text" className="mr-2" />
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
                    <ColoredIcon icon={User} color="blue" size="xs" variant="text" className="mr-2" />
                    My Profile
                  </a>
                  <a href="#" className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <div className="mr-3">
                      <ColoredIcon icon={Settings} color="purple" size="sm" variant="outline" />
                    </div>
                    <span>Account Settings</span>
                  </a>
                  <a href="#" className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    <div className="mr-3">
                      <ColoredIcon icon={HelpCircle} color="green" size="sm" variant="outline" />
                    </div>
                    <span>Help & Support</span>
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={logout}
                    className="flex items-center w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <div className="mr-3">
                      <ColoredIcon icon={LogOut} color="red" size="sm" variant="outline" />
                    </div>
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};


