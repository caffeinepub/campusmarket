import { useGetChatThreads } from '../api/chat';
import { ThreadListItem } from '../features/chat/components/ThreadListItem';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ChatsInboxPage() {
  const { data: threads, isLoading, isError, error } = useGetChatThreads();
  const navigate = useNavigate();

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load chats', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    }
  }, [isError, error]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="mb-4 text-2xl font-bold">Chats</h2>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : threads && threads.length > 0 ? (
        <div className="space-y-3">
          {threads.map((thread, index) => (
            <div
              key={thread.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
            >
              <ThreadListItem thread={thread} onClick={() => navigate({ to: ROUTES.chatThread(thread.id) })} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold">No chats yet</p>
            <p className="text-sm text-muted-foreground">Start a conversation about a listing</p>
          </div>
        </div>
      )}
    </div>
  );
}
