import React from 'react';
import { Notification } from '@/types';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

interface NotificationBannerProps {
  notifications: Notification[];
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ notifications }) => {
  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };
  
  const getColors = (type: Notification['type']) => {
    switch (type) {
        case 'success': return 'bg-green-500 text-white';
        case 'error': return 'bg-red-500 text-white';
        case 'info': return 'bg-blue-500 text-white';
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-center gap-4 p-4 rounded-lg shadow-lg animate-fade-in-up ${getColors(notification.type)}`}
        >
          {getIcon(notification.type)}
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default NotificationBanner;
