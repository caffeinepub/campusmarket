import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, DollarSign, AlertCircle } from 'lucide-react';
import type { Notification } from '../../../backend';
import { cn } from '@/lib/utils';

interface NotificationRowProps {
  notification: Notification;
  onClick: () => void;
}

export function NotificationRow({ notification, onClick }: NotificationRowProps) {
  const { icon, title, description } = getNotificationContent(notification);
  const Icon = icon;

  return (
    <Card
      className={cn(
        'interactive-press interactive-glow cursor-pointer transition-all hover:shadow-md',
        !notification.is_read && 'border-primary/50 bg-primary/5'
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-start gap-3 p-4">
        <div className={cn(
          'rounded-full p-2 transition-all',
          !notification.is_read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
        )}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{title}</h3>
            {!notification.is_read && <Badge variant="default" className="h-2 w-2 rounded-full p-0 animate-pulse-glow" />}
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
          <span className="text-xs text-muted-foreground">{getTimeAgo(Number(notification.timestamp) / 1_000_000)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function getNotificationContent(notification: Notification): { icon: any; title: string; description: string } {
  switch (notification.notif_type.__kind__) {
    case 'new_message':
      return {
        icon: MessageCircle,
        title: 'New message',
        description: 'You have a new message about your listing',
      };
    case 'listing_sold':
      return {
        icon: DollarSign,
        title: 'Listing sold',
        description: 'Your listing has been marked as sold',
      };
    case 'price_change':
      return {
        icon: AlertCircle,
        title: 'Price changed',
        description: 'The price of a saved listing has changed',
      };
    case 'systemNotification':
      return {
        icon: Bell,
        title: 'System notification',
        description: 'You have a new system notification',
      };
    default:
      return {
        icon: Bell,
        title: 'Notification',
        description: 'You have a new notification',
      };
  }
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
