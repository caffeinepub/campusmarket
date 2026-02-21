import { useQuery } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { InsightsAnalytics } from '../backend';

export function useGetInsightsAnalytics(timeRange: string) {
  const { actor, isFetching: actorFetching } = useActorClient();

  return useQuery<InsightsAnalytics>({
    queryKey: queryKeys.insights.analytics(timeRange),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Backend returns stubbed analytics
      return actor.getInsightsAnalytics();
    },
    enabled: !!actor && !actorFetching,
    retry: 2,
  });
}
