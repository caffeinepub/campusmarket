import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../routes';

interface DevOnlyRouteGateProps {
  children: ReactNode;
}

/**
 * Route guard that only allows access in development builds.
 * In production, redirects to home page.
 */
export function DevOnlyRouteGate({ children }: DevOnlyRouteGateProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // In production builds, redirect to home
    if (!import.meta.env.DEV) {
      navigate({ to: ROUTES.home, replace: true });
    }
  }, [navigate]);

  // Only render children in DEV mode
  if (!import.meta.env.DEV) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-muted-foreground">Page Not Available</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This page is only available in development mode.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
