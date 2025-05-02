import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, Plus, User, Settings, LogOut,
  Calendar, FileText, Users, MessageSquare, HelpCircle,
  ChevronDown, Menu, Building, MapPin
} from 'lucide-react';
import { useAuth, Branch } from '../../context/AuthContext';
import { GlobalSearch } from '../search/GlobalSearch';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';

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
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close the menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setQuickActionOpen(false);
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
          className="p-2 text-[#0100F6] rounded-md focus:outline-none hover:bg-gray-100 transition-all duration-150"
          onClick={onMenuButtonClick}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex flex-col ml-2 md:ml-0">
          <h1 className="text-xl font-semibold text-[#0100F6]">Bristol Hospital</h1>
          <div className="flex items-center text-xs text-gray-500">
            <Building className="w-3 h-3 mr-1" />
            <span>{user?.branch || 'Fedha'} Branch</span>
          </div>
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

        {/* Notification Button */}
        <button
          type="button"
          className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800] relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Quick Action Button */}
        <div className="relative" ref={quickActionRef}>
          <button
            type="button"
            className="p-1.5 text-white bg-[#F5B800] rounded-md hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
            onClick={() => setQuickActionOpen(!quickActionOpen)}
          >
            <Plus className="w-5 h-5" />
          </button>

          {quickActionOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-[1000] border border-gray-200 overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-800">Quick Actions</h3>
                <p className="text-xs text-gray-500 mt-1">Frequently used actions</p>
              </div>
              <div className="py-2">
                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center mr-3">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span>New Patient</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span>New Appointment</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center mr-3">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <span>Create Invoice</span>
                </a>
                <a href="#" className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 rounded-md bg-yellow-50 flex items-center justify-center mr-3">
                    <MessageSquare className="w-4 h-4 text-yellow-600" />
                  </div>
                  <span>Send Message</span>
                </a>
              </div>
            </div>
          )}
        </div>

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
            <div className="w-10 h-10 rounded-lg bg-[#F5B800] flex items-center justify-center text-black font-bold">
              {user?.name?.charAt(0) || 'A'}
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
                    <div className="w-12 h-12 rounded-lg bg-[#F5B800] flex items-center justify-center text-black font-bold text-lg mr-3">
                      {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin User'}</p>
                      <p className="text-xs text-gray-500">{user?.email || 'admin@bristolhospital.com'}</p>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                          {user?.role || 'Admin'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between bg-white rounded-md p-2 border border-gray-100">
                    <div className="flex items-center">
                      <Building className="w-4 h-4 text-[#0100F6] mr-2" />
                      <span className="text-sm font-medium">{user?.branch || 'Fedha'} Branch</span>
                    </div>
                    <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-800 rounded-full">Active</span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
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
    </header>
  );
};
