import React, { useState } from 'react';
import {
  Palette, Type, Layers, Square,
  AlertCircle, Bell, Check, X,
  Info, FileText, User, Users,
  Calendar, Clock, Search, Filter,
  ChevronDown, ChevronRight, Menu,
  Settings, Edit, Trash2, Eye,
  Loader, AlertTriangle, CheckCircle2,
  XCircle, Smile, Frown, Meh,
  Heart, ThumbsUp, Star, Phone,
  Mail, MapPin, Shield
} from 'lucide-react';
import { getPastelColors } from '../utils/colorUtils';
import { useToast } from '../context/ToastContext';
import PermissionDebug from '../components/debug/PermissionDebug';

const DesignSystem = () => {
  // Get our predefined pastel colors
  const pastelColors = getPastelColors();

  // Toast notifications
  const { showToast } = useToast();

  // State for progress bars
  const [progress, setProgress] = useState(65);

  // Function to show toast notifications
  const handleShowToast = (type) => {
    showToast(
      type,
      `This is a ${type} toast notification`,
      type === 'info' ? 'This provides additional information' : undefined
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#2B3990] mb-4">Bristol Park Hospital Design System</h1>
      <p className="text-gray-600 mb-8">This comprehensive guide documents all UI components, colors, typography, and design patterns used throughout the Bristol Park Hospital system.</p>

      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8 overflow-x-auto">
        <div className="flex flex-wrap gap-3">
          <a href="#colors" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Palette className="w-4 h-4 mr-2" />
            Colors
          </a>
          <a href="#typography" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Type className="w-4 h-4 mr-2" />
            Typography
          </a>
          <a href="#avatars" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <User className="w-4 h-4 mr-2" />
            Avatars
          </a>
          <a href="#buttons" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Square className="w-4 h-4 mr-2" />
            Buttons
          </a>
          <a href="#icons" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Square className="w-4 h-4 mr-2" />
            Icons
          </a>
          <a href="#progress" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Loader className="w-4 h-4 mr-2" />
            Progress
          </a>
          <a href="#toasts" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Toasts
          </a>
          <a href="#patterns" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Layers className="w-4 h-4 mr-2" />
            Patterns
          </a>
          <a href="#emojis" className="px-3 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
            <Smile className="w-4 h-4 mr-2" />
            Emojis
          </a>
          <a href="#permissions" className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            Permission Debug
          </a>
        </div>
      </div>

      <div className="space-y-12">

        {/* Permission Debug Section */}
        <section id="permissions" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Permission Debug</h2>
          <p className="text-gray-600 mb-6">
            Debug tool to verify current user permissions and role-based access control.
          </p>
          <PermissionDebug />
        </section>

        {/* Typography Section */}
        <section id="typography" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Typography</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Headings</h3>
              <div className="space-y-4 border-l-4 border-[#A5C4D4] pl-4">
                <div>
                  <h1 className="text-4xl font-bold text-[#2B3990]">Heading 1</h1>
                  <p className="text-sm text-gray-500 mt-1">text-4xl font-bold text-[#2B3990]</p>
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-[#2B3990]">Heading 2</h2>
                  <p className="text-sm text-gray-500 mt-1">text-3xl font-semibold text-[#2B3990]</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium text-[#2B3990]">Heading 3</h3>
                  <p className="text-sm text-gray-500 mt-1">text-2xl font-medium text-[#2B3990]</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Colors Section */}
        <section id="colors" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Colors</h2>

          <div className="space-y-8">
            {/* Brand Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Brand Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-24 bg-[#2B3990] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Primary Blue</p>
                      <p className="text-sm text-gray-500">#2B3990</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Used for primary buttons, links, and main branding elements</p>
                </div>

                <div className="space-y-2">
                  <div className="h-24 bg-[#A61F1F] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Secondary Red</p>
                      <p className="text-sm text-gray-500">#A61F1F</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Used for important actions, warnings, and secondary branding</p>
                </div>

                <div className="space-y-2">
                  <div className="h-24 bg-[#F5B800] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Accent Yellow</p>
                      <p className="text-sm text-gray-500">#F5B800</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Used for highlights, accents, and user avatars</p>
                </div>
              </div>
            </div>

            {/* Pastel Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Pastel Colors for Patient Avatars</h3>
              <p className="text-sm text-gray-600 mb-4">
                These pastel colors are used for patient avatars in the patient register.
                Each patient gets a unique color based on their name.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pastelColors.map((color, index) => (
                  <div key={index} className="space-y-2">
                    <div
                      className="h-16 rounded-md shadow-sm flex items-center justify-center"
                      style={{ backgroundColor: color }}
                    >
                      <div className="font-bold text-lg">AB</div>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">{color}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* UI Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">UI Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-[#4CAF50] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Success</p>
                      <p className="text-xs text-gray-500">#4CAF50</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-[#F44336] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Error</p>
                      <p className="text-xs text-gray-500">#F44336</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-[#FF9800] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Warning</p>
                      <p className="text-xs text-gray-500">#FF9800</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-[#2196F3] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Info</p>
                      <p className="text-xs text-gray-500">#2196F3</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Colors */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Background Colors</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="h-16 bg-[#E6F3F7] rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Background</p>
                      <p className="text-xs text-gray-500">#E6F3F7</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Main application background</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-white border border-gray-200 rounded-md shadow-sm flex items-end">
                    <div className="bg-gray-100 bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">White</p>
                      <p className="text-xs text-gray-500">#FFFFFF</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Card backgrounds, modals</p>
                </div>
                <div className="space-y-2">
                  <div className="h-16 bg-gray-50 rounded-md shadow-sm flex items-end">
                    <div className="bg-white bg-opacity-90 w-full py-1 px-2 rounded-b-md">
                      <p className="font-medium">Light Gray</p>
                      <p className="text-xs text-gray-500">#F9FAFB</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">Table alternating rows, hover states</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Avatars Section */}
        <section id="avatars" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Avatars</h2>

          <div className="space-y-8">
            {/* User Avatars */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">User Avatars</h3>
              <p className="text-sm text-gray-600 mb-4">
                User avatars are circular with the Bristol Park yellow background. They display the user's initials or a placeholder image.
              </p>
              <div className="flex flex-wrap gap-6 items-end">
                <div className="space-y-2 text-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#F5B800] bg-[#F5B800] flex items-center justify-center mx-auto">
                    <span className="font-bold text-black">SA</span>
                  </div>
                  <p className="text-xs text-gray-500">Small</p>
                </div>

                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F5B800] bg-[#F5B800] flex items-center justify-center mx-auto">
                    <span className="font-bold text-black">SA</span>
                  </div>
                  <p className="text-xs text-gray-500">Medium</p>
                </div>

                <div className="space-y-2 text-center">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F5B800] bg-[#F5B800] flex items-center justify-center mx-auto">
                    <span className="font-bold text-black">SA</span>
                  </div>
                  <p className="text-xs text-gray-500">Large</p>
                </div>

                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#F5B800] flex items-center justify-center mx-auto">
                    <img
                      src="/user-avatar.svg"
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-500">With Image</p>
                </div>
              </div>
            </div>

            {/* Patient Avatars */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Patient Avatars</h3>
              <p className="text-sm text-gray-600 mb-4">
                Patient avatars are circular with pastel background colors generated from the patient's name. They display the patient's initials.
              </p>
              <div className="flex flex-wrap gap-6 items-end">
                {pastelColors.slice(0, 5).map((color, index) => (
                  <div key={index} className="space-y-2 text-center">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
                      style={{ backgroundColor: color }}
                    >
                      <span className="font-bold">{String.fromCharCode(65 + index)}{String.fromCharCode(66 + index)}</span>
                    </div>
                    <p className="text-xs text-gray-500">Patient {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Buttons Section */}
        <section id="buttons" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Buttons</h2>

          <div className="space-y-8">
            {/* Button Variants */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Button Variants</h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#2B3990] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Primary Button
                </button>
                <button className="bg-[#A61F1F] text-white px-4 py-2 rounded-md hover:bg-[#8f1a1a] transition-colors">
                  Secondary Button
                </button>
                <button className="bg-[#F5B800] text-black px-4 py-2 rounded-md hover:bg-[#e5ad00] transition-colors">
                  Accent Button
                </button>
                <button className="bg-white border border-[#2B3990] text-[#2B3990] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors">
                  Outline Button
                </button>
              </div>
            </div>

            {/* Button Sizes */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Button Sizes</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="bg-[#2B3990] text-white px-2 py-1 text-xs rounded-md hover:bg-blue-700 transition-colors">
                  Small
                </button>
                <button className="bg-[#2B3990] text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Medium
                </button>
                <button className="bg-[#2B3990] text-white px-6 py-3 text-lg rounded-md hover:bg-blue-700 transition-colors">
                  Large
                </button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Icon Buttons</h3>
              <div className="flex flex-wrap gap-4">
                <button className="bg-[#2B3990] text-white p-2 rounded-md hover:bg-blue-700 transition-colors">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="bg-[#A61F1F] text-white p-2 rounded-md hover:bg-[#8f1a1a] transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
                <button className="bg-[#4CAF50] text-white p-2 rounded-md hover:bg-green-600 transition-colors">
                  <Check className="w-5 h-5" />
                </button>
                <button className="bg-white border border-[#2B3990] text-[#2B3990] p-2 rounded-md hover:bg-gray-50 transition-colors">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Icons Section */}
        <section id="icons" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Icons</h2>

          <div className="space-y-8">
            <p className="text-sm text-gray-600 mb-4">
              Bristol Park Hospital uses Lucide React icons throughout the application for a consistent look and feel.
              Icons are typically used in buttons, navigation, and to provide visual cues.
            </p>

            {/* Navigation Icons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Navigation Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Menu className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Menu</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <ChevronDown className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">ChevronDown</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <ChevronRight className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">ChevronRight</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Search className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Search</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Settings className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Settings</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Bell className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Bell</span>
                </div>
              </div>
            </div>

            {/* Action Icons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Action Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Edit className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Edit</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Trash2 className="w-6 h-6 text-[#A61F1F] mb-2" />
                  <span className="text-xs text-gray-500">Trash</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Eye className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">View</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Check className="w-6 h-6 text-[#4CAF50] mb-2" />
                  <span className="text-xs text-gray-500">Check</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <X className="w-6 h-6 text-[#A61F1F] mb-2" />
                  <span className="text-xs text-gray-500">Close</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Filter className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Filter</span>
                </div>
              </div>
            </div>

            {/* Content Icons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Content Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <User className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">User</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Users className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Users</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Calendar className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Calendar</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Clock className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Clock</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <FileText className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Document</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Info className="w-6 h-6 text-[#2B3990] mb-2" />
                  <span className="text-xs text-gray-500">Info</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Toast Notifications Section */}
        <section id="toasts" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Toast Notifications</h2>

          <div className="space-y-8">
            <p className="text-sm text-gray-600 mb-4">
              Toast notifications provide feedback to users about actions they've taken or system events.
              Click the buttons below to see each type of toast notification.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                className="px-4 py-2 bg-[#2196F3] text-white rounded-md hover:bg-blue-600 transition-colors flex items-center"
                onClick={() => handleShowToast('info')}
              >
                <Info className="w-4 h-4 mr-2" />
                Info Toast
              </button>

              <button
                className="px-4 py-2 bg-[#4CAF50] text-white rounded-md hover:bg-green-600 transition-colors flex items-center"
                onClick={() => handleShowToast('success')}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Success Toast
              </button>

              <button
                className="px-4 py-2 bg-[#FF9800] text-white rounded-md hover:bg-orange-600 transition-colors flex items-center"
                onClick={() => handleShowToast('warning')}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Warning Toast
              </button>

              <button
                className="px-4 py-2 bg-[#F44336] text-white rounded-md hover:bg-red-600 transition-colors flex items-center"
                onClick={() => handleShowToast('error')}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Error Toast
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="border rounded-md p-4 bg-blue-50 border-blue-200 flex items-start">
                <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">Info Toast</h4>
                  <p className="text-sm text-blue-600 mt-1">Used to provide information to the user.</p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-green-50 border-green-200 flex items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-green-800">Success Toast</h4>
                  <p className="text-sm text-green-600 mt-1">Used to indicate a successful action.</p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-yellow-50 border-yellow-200 flex items-start">
                <AlertTriangle className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-yellow-800">Warning Toast</h4>
                  <p className="text-sm text-yellow-600 mt-1">Used to warn the user about potential issues.</p>
                </div>
              </div>

              <div className="border rounded-md p-4 bg-red-50 border-red-200 flex items-start">
                <XCircle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-red-800">Error Toast</h4>
                  <p className="text-sm text-red-600 mt-1">Used to indicate an error or failed action.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Progress Bars Section */}
        <section id="progress" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Progress Indicators</h2>

          <div className="space-y-8">
            <p className="text-sm text-gray-600 mb-4">
              Progress indicators show the completion status of an operation or task.
            </p>

            {/* Linear Progress Bars */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Linear Progress Bars</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Primary Progress ({progress}%)</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="px-2 py-1 bg-gray-200 rounded text-xs"
                        onClick={() => setProgress(Math.max(0, progress - 10))}
                      >
                        -10%
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-200 rounded text-xs"
                        onClick={() => setProgress(Math.min(100, progress + 10))}
                      >
                        +10%
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-[#2B3990] h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Success Progress (75%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#4CAF50] h-2.5 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Warning Progress (45%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#FF9800] h-2.5 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Error Progress (25%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#F44336] h-2.5 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Progress */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Circular Progress & Loaders</h3>

              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        className="text-gray-200 stroke-current"
                        strokeWidth="10"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                      ></circle>
                      <circle
                        className="text-[#2B3990] stroke-current"
                        strokeWidth="10"
                        strokeLinecap="round"
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * progress) / 100}
                        transform="rotate(-90 50 50)"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Circular Progress</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2B3990]"></div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Spinner</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <Loader className="w-10 h-10 text-[#2B3990] animate-spin" />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Loader Icon</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-2 h-8 bg-[#2B3990] rounded-full animate-bounce"></div>
                      <div className="w-2 h-8 bg-[#2B3990] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-8 bg-[#2B3990] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 mt-2">Bounce Loader</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Patterns Section */}
        <section id="patterns" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">UI Patterns</h2>

          <div className="space-y-8">
            <p className="text-sm text-gray-600 mb-4">
              Common UI patterns used throughout the Bristol Park Hospital system.
            </p>

            {/* Cards Pattern */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Card Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Basic Card */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 border-b bg-gray-50">
                    <h4 className="font-medium">Basic Card</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600">This is a basic card with a header and content area.</p>
                  </div>
                </div>

                {/* Patient Card */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: pastelColors[0] }}
                      >
                        <span className="font-bold">JD</span>
                      </div>
                      <div>
                        <div className="font-semibold">John Doe</div>
                        <div className="text-xs text-gray-500">Male, 32 years</div>
                      </div>
                    </div>
                    <span className="badge bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      <span>+254 712 345 678</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>Last Visit: 15 Jun 2023</span>
                    </div>
                  </div>
                  <div className="p-3 border-t bg-gray-50 flex justify-end gap-2">
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Dashboard Card */}
                <div className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Patients Overview</h4>
                      <div className="text-xs text-gray-500">Today</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-[#2B3990]">128</div>
                      <div className="text-green-500 flex items-center text-sm">
                        <span>+12%</span>
                        <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">Compared to 114 yesterday</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Patterns */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Form Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Login Form */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Login Form</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your password"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-[#2B3990] focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-700">Remember me</label>
                      </div>
                      <a href="#" className="text-sm text-[#2B3990] hover:underline">Forgot password?</a>
                    </div>
                    <button className="w-full bg-[#2B3990] text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                      Sign In
                    </button>
                  </div>
                </div>

                {/* Search and Filter */}
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-4">Search and Filter</h4>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Search patients..."
                        />
                      </div>
                      <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors flex items-center">
                        <Filter className="w-5 h-5 mr-1" />
                        Filter
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Status: Active
                        <button className="ml-1 text-blue-500 hover:text-blue-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Branch: Fedha
                        <button className="ml-1 text-purple-500 hover:text-purple-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Date: Today
                        <button className="ml-1 text-green-500 hover:text-green-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Patterns */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Navigation Patterns</h3>
              <div className="space-y-6">
                {/* Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="-mb-px flex space-x-8">
                    <a href="#" className="border-[#2B3990] text-[#2B3990] whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Overview
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Patients
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Appointments
                    </a>
                    <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
                      Reports
                    </a>
                  </nav>
                </div>

                {/* Breadcrumbs */}
                <div>
                  <nav className="flex" aria-label="Breadcrumb">
                    <ol className="inline-flex items-center space-x-1 md:space-x-3">
                      <li className="inline-flex items-center">
                        <a href="#" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-[#2B3990]">
                          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                          </svg>
                          Dashboard
                        </a>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <a href="#" className="ml-1 text-sm font-medium text-gray-700 hover:text-[#2B3990] md:ml-2">Patients</a>
                        </div>
                      </li>
                      <li aria-current="page">
                        <div className="flex items-center">
                          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span className="ml-1 text-sm font-medium text-[#2B3990] md:ml-2">John Doe</span>
                        </div>
                      </li>
                    </ol>
                  </nav>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Previous
                    </a>
                    <a href="#" className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Next
                    </a>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Previous</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          1
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-[#2B3990] text-sm font-medium text-white">
                          2
                        </a>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          3
                        </a>
                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                          ...
                        </span>
                        <a href="#" className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                          10
                        </a>
                        <a href="#" className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                          <span className="sr-only">Next</span>
                          <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </a>
                      </nav>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Emojis & Smileys Section */}
        <section id="emojis" className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-2xl font-semibold text-[#2B3990] mb-6">Emojis & Reactions</h2>

          <div className="space-y-8">
            <p className="text-sm text-gray-600 mb-4">
              Emojis and reaction icons can be used to express emotions or provide feedback in a visual way.
            </p>

            {/* Emoji Icons */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Emotion Icons</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Smile className="w-10 h-10 text-green-500 mb-2" />
                  <span className="text-xs text-gray-500">Happy</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Meh className="w-10 h-10 text-yellow-500 mb-2" />
                  <span className="text-xs text-gray-500">Neutral</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Frown className="w-10 h-10 text-red-500 mb-2" />
                  <span className="text-xs text-gray-500">Sad</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Heart className="w-10 h-10 text-pink-500 mb-2" />
                  <span className="text-xs text-gray-500">Love</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <ThumbsUp className="w-10 h-10 text-blue-500 mb-2" />
                  <span className="text-xs text-gray-500">Like</span>
                </div>
                <div className="flex flex-col items-center p-3 border rounded-md">
                  <Star className="w-10 h-10 text-yellow-400 mb-2" />
                  <span className="text-xs text-gray-500">Favorite</span>
                </div>
              </div>
            </div>

            {/* Feedback Reactions */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Feedback Reactions</h3>
              <div className="p-4 border rounded-md bg-gray-50">
                <p className="text-sm text-gray-700 mb-4">How would you rate your experience?</p>
                <div className="flex justify-center gap-6">
                  <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Frown className="w-8 h-8 text-red-500 mb-1" />
                    <span className="text-xs text-gray-500">Poor</span>
                  </button>
                  <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Meh className="w-8 h-8 text-yellow-500 mb-1" />
                    <span className="text-xs text-gray-500">Average</span>
                  </button>
                  <button className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-md transition-colors">
                    <Smile className="w-8 h-8 text-green-500 mb-1" />
                    <span className="text-xs text-gray-500">Good</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Star Ratings */}
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Star Ratings</h3>
              <div className="flex gap-1">
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <Star className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm text-gray-500 mt-2">4.0 out of 5 stars</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DesignSystem;
