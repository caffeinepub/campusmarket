import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ChatThread } from '../../../backend';
import { cn } from '@/lib/utils';

interface ThreadListItemProps {
  thread: ChatThread;
  onClick: () => void;
}

export function ThreadListItem({ thread, onClick }: ThreadListItemProps) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const unreadCount = 0; // TODO: Implement unread logic

  return (
    <Card 
      className="interactive-press interactive-glow cursor-pointer transition-all hover:shadow-md" 
      onClick={onClick}
    >
      <CardContent className="flex items-center gap-3 p-4">
        <Avatar>
          <AvatarFallback className="bg-primary text-primary-foreground">
            {thread.seller.toString().slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Listing #{thread.listing_id.slice(0, 8)}</h3>
            {lastMessage && <span className="text-xs text-muted-foreground">{getTimeAgo(Number(lastMessage.timestamp) / 1_000_000)}</span>}
          </div>
          {lastMessage && <p className="line-clamp-1 text-sm text-muted-foreground">{lastMessage.content}</p>}
        </div>
        {unreadCount > 0 && (
          <Badge variant="default" className="h-5 min-w-5 rounded-full px-1.5 text-xs animate-pulse-glow">
            {unreadCount}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  return `${days}d`;
}
