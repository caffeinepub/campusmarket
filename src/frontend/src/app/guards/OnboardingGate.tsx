import { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../api/profile';
import { useAuth } from '../../features/auth/plugin/useAuth';
import { ROUTES } from '../routes';
import type { UserProfile } from '../../backend';

interface OnboardingGateProps {
  children: ReactNode;
}

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { session } = useAuth();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  if (session?.type === 'dev-bypass') {
    return <>{children}</>;
  }

  if (isLoading || !isFetched) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const profile = userProfile as UserProfile | null;
  if (!profile || !profile.onboarding_complete) {
    return <Navigate to={ROUTES.onboarding} />;
  }

  return <>{children}</>;
}
