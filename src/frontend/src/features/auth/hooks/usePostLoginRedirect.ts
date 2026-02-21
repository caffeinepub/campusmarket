import { useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../../api/profile';
import { useAuth } from '../plugin/useAuth';
import { ROUTES } from '../../../app/routes';
import type { UserProfile } from '../../../backend';

export function usePostLoginRedirect() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: userProfile, isLoading } = useGetCallerUserProfile();

  const handlePostLogin = () => {
    if (isLoading) return;

    if (session?.type === 'dev-bypass') {
      navigate({ to: ROUTES.home });
      return;
    }

    const profile = userProfile as UserProfile | null;
    const shouldOnboard = !profile || !profile.onboarding_complete;

    if (shouldOnboard) {
      navigate({ to: ROUTES.onboarding });
    } else {
      navigate({ to: ROUTES.home });
    }
  };

  return { handlePostLogin, isLoading };
}
