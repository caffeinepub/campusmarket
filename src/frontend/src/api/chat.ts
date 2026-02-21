import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { ChatThread, Message } from '../backend';
import { useAuth } from '../features/auth/plugin/useAuth';
import { toast } from 'sonner';

export function useGetChatThreads() {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  return useQuery<ChatThread[]>({
    queryKey: queryKeys.chat.threads(),
    queryFn: async () => {
      if (isDevBypass) {
        // Return empty array in dev-bypass mode
        return [];
      }
      if (!actor) throw new Error('Actor not available');
      return actor.getChatThreads();
    },
    enabled: !isDevBypass && !!actor && !actorFetching,
  });
}

export function useGetChatThread(threadId: string) {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  return useQuery<ChatThread | null>({
    queryKey: queryKeys.chat.thread(threadId),
    queryFn: async () => {
      if (isDevBypass) {
        return null;
      }
      if (!actor) throw new Error('Actor not available');
      return actor.getChatThread(threadId);
    },
    enabled: !isDevBypass && !!actor && !actorFetching && !!threadId,
  });
}

export function useCreateChatThread() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (thread: ChatThread) => {
      if (isDevBypass) {
        throw new Error('Chat is disabled in dev-bypass mode');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.createChatThread(thread);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.threads() });
    },
    onError: (error: any) => {
      if (error.message.includes('dev-bypass')) {
        toast.info('Chat is disabled in dev-bypass mode', {
          description: 'Sign in with a real account to start conversations',
        });
      }
    },
  });
}

export function useAddMessage() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async ({ threadId, message }: { threadId: string; message: Message }) => {
      if (isDevBypass) {
        throw new Error('Chat is disabled in dev-bypass mode');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.addMessage(threadId, message);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.thread(variables.threadId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.chat.threads() });
    },
    onError: (error: any) => {
      if (error.message.includes('dev-bypass')) {
        toast.info('Chat is disabled in dev-bypass mode', {
          description: 'Sign in with a real account to send messages',
        });
      }
    },
  });
}

// Helper to find existing thread for a listing
export function findThreadForListing(threads: ChatThread[] | undefined, listingId: string, userPrincipal: string): ChatThread | undefined {
  if (!threads) return undefined;
  return threads.find(
    (t) =>
      t.listing_id === listingId &&
      (t.buyer.toString() === userPrincipal || t.seller.toString() === userPrincipal)
  );
}
