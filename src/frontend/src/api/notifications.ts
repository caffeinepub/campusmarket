import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { Notification } from '../backend';

export function useGetNotifications() {
  const { actor, isFetching: actorFetching } = useActorClient();

  return useQuery<Notification[]>({
    queryKey: queryKeys.notifications.list(),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getNotifications();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useMarkNotificationAsRead() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.markNotificationAsRead(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list() });
    },
  });
}
