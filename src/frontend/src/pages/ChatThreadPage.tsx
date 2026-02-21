import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetChatThread, useAddMessage } from '../api/chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Send } from 'lucide-react';
import { ROUTES } from '../app/routes';
import { Skeleton } from '@/components/ui/skeleton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { Message } from '../backend';
import { cn } from '@/lib/utils';

export default function ChatThreadPage() {
  const { threadId } = useParams({ strict: false });
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: thread, isLoading, isError, error } = useGetChatThread(threadId || '');
  const addMessage = useAddMessage();
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isError && error) {
      toast.error('Failed to load chat', {
        description: error instanceof Error ? error.message : 'This chat may not exist',
      });
    }
  }, [isError, error]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageText.trim() || !identity || !threadId) return;

    setIsSending(true);

    try {
      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sender: identity.getPrincipal(),
        content: messageText.trim(),
        timestamp: BigInt(Date.now() * 1_000_000),
        read_by_buyer: false,
        read_by_seller: false,
      };

      await addMessage.mutateAsync({ threadId, message: newMessage });
      setMessageText('');
      toast.success('Message sent');
    } catch (error: any) {
      console.error('Failed to send message:', error);
      
      if (error?.message?.includes('Unauthorized') || error?.message?.includes('not authenticated')) {
        toast.error('Not authorized to send messages', {
          description: 'Please log in again',
        });
        navigate({ to: ROUTES.login });
      } else {
        toast.error('Failed to send message', {
          description: error?.message || 'Please try again',
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <ChatThreadSkeleton />;
  }

  if (isError || !thread) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Chat not found</h2>
          <p className="mt-2 text-muted-foreground">This chat may have been removed or doesn't exist.</p>
          <Button onClick={() => navigate({ to: ROUTES.chats })} className="interactive-press mt-4">
            Back to Chats
          </Button>
        </div>
      </div>
    );
  }

  const currentUserPrincipal = identity?.getPrincipal().toString();

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: ROUTES.chats })} className="interactive-press">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h2 className="font-semibold">Chat</h2>
          <p className="text-xs text-muted-foreground">Listing #{thread.listing_id.slice(0, 8)}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {thread.messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          thread.messages.map((message, index) => {
            const isCurrentUser = message.sender.toString() === currentUserPrincipal;
            const timestamp = Number(message.timestamp) / 1_000_000;

            return (
              <div
                key={message.id}
                className={cn(
                  'animate-in fade-in slide-in-from-bottom-2 flex',
                  isCurrentUser ? 'justify-end' : 'justify-start'
                )}
                style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'backwards' }}
              >
                <div
                  className={cn(
                    'interactive-press max-w-[75%] rounded-2xl px-4 py-2 transition-all',
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  )}
                >
                  <p className="break-words">{message.content}</p>
                  <p className={cn('mt-1 text-xs', isCurrentUser ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {getTimeAgo(timestamp)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-card/90">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 transition-all focus:shadow-glow"
          />
          <Button type="submit" size="icon" disabled={isSending || !messageText.trim()} className="interactive-press">
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}

function ChatThreadSkeleton() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3">
        <Skeleton className="h-10 w-10 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <div className="flex-1 p-4 space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className={cn('flex', i % 2 === 0 ? 'justify-start' : 'justify-end')}>
            <Skeleton className="h-16 w-3/4 rounded-2xl" />
          </div>
        ))}
      </div>
      <div className="border-t border-border p-4">
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
