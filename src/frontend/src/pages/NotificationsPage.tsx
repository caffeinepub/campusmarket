import { useGetNotifications, useMarkNotificationAsRead } from '../api/notifications';
import { NotificationRow } from '../features/notifications/components/NotificationRow';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';
import { useEffect } from 'react';
import type { Notification } from '../backend';

export default function NotificationsPage() {
  const { data: notifications, isLoading, isError, error } = useGetNotifications();
  const markAsRead = useMarkNotificationAsRead();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load notifications', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    }
  }, [isError, error]);

  const handleNotificationClick = async (notification: Notification) => {
    try {
      // Mark as read
      if (!notification.is_read) {
        await markAsRead.mutateAsync(notification.id);
      }

      // Navigate based on notification type
      switch (notification.notif_type.__kind__) {
        case 'new_message':
          if (notification.notif_type.new_message.listing_id) {
            // Try to navigate to chat, fallback to chats list
            navigate({ to: ROUTES.chats });
          }
          break;
        case 'listing_sold':
        case 'price_change':
          if (notification.notif_type[notification.notif_type.__kind__].listing_id) {
            const listingId = notification.notif_type[notification.notif_type.__kind__].listing_id;
            navigate({ to: ROUTES.listing(listingId) });
          }
          break;
        case 'systemNotification':
          toast.info('System notification', {
            description: 'No specific action available',
          });
          break;
        default:
          toast.info('Notification opened', {
            description: 'No specific action available for this notification type',
          });
      }
    } catch (error: any) {
      console.error('Failed to handle notification:', error);
      toast.error('Failed to process notification', {
        description: error?.message || 'Please try again',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">Notifications</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <div
              key={notification.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
              <NotificationRow notification={notification} onClick={() => handleNotificationClick(notification)} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">No notifications</p>
            <p className="text-sm text-muted-foreground">You're all caught up!</p>
          </div>
        </div>
      )}
    </div>
  );
}
