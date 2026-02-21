import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { queryKeys } from './queries';
import type { UserProfile } from '../backend';
import { perfTiming } from '../utils/perfTimings';
import { startupDiagnostics } from '../utils/startupDiagnostics';
import { setCachedProfile } from '../features/auth/profileCache';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.profile.current(),
    queryFn: async () => {
      perfTiming.start('profile-fetch');
      if (!actor) throw new Error('Actor not available');

      try {
        const profile = await actor.getCallerUserProfile();
        perfTiming.end('profile-fetch');
        startupDiagnostics.record('profile-fetch', 'success');

        const stubProfile: UserProfile = {
          principal: ('' as any),
          campus: 'Main Campus',
          department: 'General',
          hostel: 'Default Hostel',
          onboarding_complete: true,
          verified_student: false,
          star_rating: 0,
          reliability_score: 0,
          transaction_count: BigInt(0),
        };

        const finalProfile = profile || stubProfile;
        setCachedProfile(finalProfile);
        return finalProfile;
      } catch (error) {
        perfTiming.end('profile-fetch');
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        startupDiagnostics.record('profile-fetch', 'error', errorMessage);
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(queryKeys.profile.current(), profile);
      setCachedProfile(profile);
    },
  });
}
