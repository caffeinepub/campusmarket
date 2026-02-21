import { useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../plugin/useAuth';
import { useGetCallerUserProfile } from '../../../api/profile';
import { ROUTES } from '../../../app/routes';

export function usePostLoginRedirect() {
  const { session } = useAuth();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const hasRedirectedRef = useRef(false);

  const isAuthenticated = session.type === 'authenticated' || session.type === 'dev-bypass';

  useEffect(() => {
    // Only redirect once per auth resolution
    if (hasRedirectedRef.current) return;
    
    // Wait for auth to resolve
    if (!isAuthenticated) return;

    // In dev-bypass mode, skip profile check and go straight to home
    if (session.type === 'dev-bypass') {
      hasRedirectedRef.current = true;
      navigate({ to: ROUTES.home });
      return;
    }

    // For authenticated users, wait for profile
    if (profileLoading || !isFetched) return;

    // Determine redirect target
    const shouldOnboard = !userProfile || !userProfile.onboarding_complete;
    const targetRoute = shouldOnboard ? ROUTES.onboarding : ROUTES.home;

    hasRedirectedRef.current = true;
    navigate({ to: targetRoute });
  }, [session, isAuthenticated, userProfile, profileLoading, isFetched, navigate]);

  return {
    isRedirecting: isAuthenticated && !hasRedirectedRef.current,
  };
}
