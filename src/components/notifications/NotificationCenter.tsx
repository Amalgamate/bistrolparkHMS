import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2, AlertTriangle } from 'lucide-react';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = '' }) => {
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useRealTimeNotification();
  
  const [isOpen, setIsOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close the notification center when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get priority color
  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'emergency':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  // Get notification icon
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'EMERGENCY_PATIENT':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={notificationRef}>
      {/* Notification Bell */}
      <button
        className="p-1.5 text-gray-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800] relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-[1000] border border-gray-200 overflow-hidden max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
              <p className="text-xs text-gray-500 mt-1">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` 
                  : 'No new notifications'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={markAllAsRead}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Mark all as read"
              >
                <CheckCheck className="h-4 w-4" />
              </button>
              <button
                onClick={clearNotifications}
                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                title="Clear all notifications"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notification List */}
          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p>No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.details.patientName ? (
                              <>
                                {notification.details.patientName}
                                {notification.details.tokenNumber && (
                                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${getPriorityColor(notification.details.priority)}`}>
                                    Token #{notification.details.tokenNumber}
                                  </span>
                                )}
                              </>
                            ) : (
                              'System Notification'
                            )}
                          </p>
                          <div className="flex items-center">
                            <span className="text-xs text-gray-500 mr-2">
                              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                            </span>
                            {!notification.read ? (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                title="Mark as read"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        {notification.details.destination && (
                          <p className="text-xs text-gray-500 mt-1">
                            Location: {notification.details.destination}
                          </p>
                        )}
                        {notification.details.doctorName && (
                          <p className="text-xs text-gray-500 mt-1">
                            Doctor: {notification.details.doctorName}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 text-xs text-center text-gray-500">
            Click on a notification to mark it as read
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
