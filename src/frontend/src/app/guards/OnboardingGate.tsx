import { ReactNode, useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../features/auth/hooks/useCurrentUserProfile';
import { ROUTES } from '../routes';
import { useProfileStartupTimeout } from '../startup/useProfileStartupTimeout';
import { ProfileTimeoutFallback } from '../startup/ProfileTimeoutFallback';
import { enableDevGuestMode, isDevGuestModeEnabled } from '../../features/auth/devGuestMode';
import { useAuth } from '../../features/auth/plugin/useAuth';

interface OnboardingGateProps {
  children: ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { session } = useAuth();
  const { data: userProfile, isLoading, isFetched, refetch } = useGetCallerUserProfile();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isOnboardingPath = currentPath === ROUTES.onboarding;
  const isInDevGuestMode = isDevGuestModeEnabled();
  const isDevBypass = session.type === 'dev-bypass';

  const { showFallback, retry, continueAsGuest } = useProfileStartupTimeout(isLoading, isFetched);

  useEffect(() => {
    // Skip profile checks in dev-bypass mode
    if (isDevBypass || isInDevGuestMode) return;
    
    if (isLoading || !isFetched) return;

    // If profile doesn't exist or onboarding not complete, redirect to onboarding
    if (!userProfile || !userProfile.onboarding_complete) {
      if (!isOnboardingPath) {
        navigate({ to: ROUTES.onboarding });
      }
    } else if (isOnboardingPath) {
      // If onboarding complete but on onboarding page, redirect to home
      navigate({ to: ROUTES.home });
    }
  }, [userProfile, isLoading, isFetched, isOnboardingPath, navigate, isDevBypass, isInDevGuestMode]);

  const handleRetry = () => {
    retry();
    refetch();
  };

  const handleContinueAsGuest = () => {
    enableDevGuestMode();
    continueAsGuest();
  };

  // Show timeout fallback if profile fetch exceeds 2s (but not in dev-bypass mode)
  if (showFallback && !isInDevGuestMode && !isDevBypass) {
    return <ProfileTimeoutFallback onRetry={handleRetry} onContinueAsGuest={handleContinueAsGuest} />;
  }

  // Non-blocking: render children immediately, profile resolution happens in background
  return <>{children}</>;
}
