import { useQuery } from '@tanstack/react-query';
import { useActorClient } from './actorClient';

export function useIsAIAssistEnabled() {
  const { actor, isFetching: actorFetching } = useActorClient();

  return useQuery<boolean>({
    queryKey: ['aiAssist', 'enabled'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isAIAssistEnabled();
      } catch (error) {
        console.error('Failed to check AI assist status:', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: 1,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}
