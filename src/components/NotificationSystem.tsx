import React, { useEffect, useState } from 'react';
import { X, AlertTriangle, Info, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Notification } from '@/types/transport';
import { mockNotifications } from '@/data/mockData';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Simulate real-time notifications
    const unreadNotifications = mockNotifications.filter(n => !n.read);
    setNotifications(unreadNotifications);

    // Show notifications one by one with delay
    unreadNotifications.forEach((notification, index) => {
      setTimeout(() => {
        setVisibleNotifications(prev => [...prev, notification]);
        
        // Auto-dismiss after 5 seconds for non-error notifications
        if (notification.type !== 'error') {
          setTimeout(() => {
            dismissNotification(notification.id);
          }, 5000);
        }
      }, index * 2000);
    });
  }, []);

  const dismissNotification = (id: string) => {
    setVisibleNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getNotificationStyles = (type: Notification['type']) => {
    switch (type) {
      case 'warning':
        return 'border-warning bg-warning/95 backdrop-blur-sm';
      case 'error':
        return 'border-destructive bg-destructive/95 backdrop-blur-sm';
      case 'success':
        return 'border-success bg-success/95 backdrop-blur-sm';
      default:
        return 'border-primary bg-primary/95 backdrop-blur-sm';
    }
  };

  if (visibleNotifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {visibleNotifications.map((notification) => (
        <Card
          key={notification.id}
          className={`shadow-xl border-l-4 animate-in slide-in-from-right duration-300 ${getNotificationStyles(notification.type)} bg-card/95 backdrop-blur-sm`}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-foreground">
                  {notification.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                onClick={() => dismissNotification(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationSystem;