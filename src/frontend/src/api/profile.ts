import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActorClient } from './actorClient';
import { queryKeys } from './queries';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';
import { perfTiming } from '../utils/perfTimings';
import { startupDiagnostics } from '../utils/startupDiagnostics';
import { setCachedProfile } from '../features/auth/profileCache';
import { useAuth } from '../features/auth/plugin/useAuth';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActorClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  const query = useQuery<UserProfile | null>({
    queryKey: queryKeys.profile.current(),
    queryFn: async () => {
      perfTiming.start('profile-fetch');
      
      // In dev-bypass mode, return a stub profile
      if (isDevBypass) {
        perfTiming.end('profile-fetch');
        const stubProfile: UserProfile = {
          principal: { toText: () => 'dev-bypass-principal' } as any,
          campus: 'Dev Campus',
          department: 'Dev Department',
          hostel: 'Dev Hostel',
          onboarding_complete: true,
        };
        return stubProfile;
      }

      if (!actor) {
        perfTiming.end('profile-fetch');
        throw new Error('Actor not available');
      }

      try {
        const profile = await actor.getCallerUserProfile();
        perfTiming.end('profile-fetch');
        perfTiming.log('profile-fetch');

        if (profile) {
          setCachedProfile(profile);
          startupDiagnostics.record('profile-fetch', 'success');
        } else {
          startupDiagnostics.record('profile-fetch', 'success', 'no-profile');
        }

        return profile;
      } catch (error) {
        perfTiming.end('profile-fetch');
        startupDiagnostics.record('profile-fetch', 'error', error instanceof Error ? error.message : String(error));
        throw error;
      }
    },
    enabled: isDevBypass || (!!actor && !actorFetching),
    retry: (failureCount, error) => {
      if (failureCount >= 2) return false;
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('Unauthorized')) return false;
      return true;
    },
    retryDelay: 500,
  });

  return {
    ...query,
    isLoading: (actorFetching && !isDevBypass) || query.isLoading,
    isFetched: isDevBypass || (!!actor && query.isFetched),
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActorClient();
  const queryClient = useQueryClient();
  const { session } = useAuth();

  const isDevBypass = session.type === 'dev-bypass';

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (isDevBypass) {
        // In dev-bypass, just cache locally
        setCachedProfile(profile);
        return;
      }
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(queryKeys.profile.current(), profile);
      setCachedProfile(profile);
      toast.success('Profile saved successfully');
    },
    onError: (error) => {
      console.error('Failed to save profile:', error);
      toast.error('Failed to save profile');
    },
    retry: 2,
  });
}
