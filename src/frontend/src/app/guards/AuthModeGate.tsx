import { ReactNode, useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { ROUTES } from '../routes';
import { perfTiming } from '../../utils/perfTimings';
import { startupDiagnostics } from '../../utils/startupDiagnostics';
import { useAuth } from '../../features/auth/plugin/useAuth';

interface AuthModeGateProps {
  children: ReactNode;
}

export function AuthModeGate({ children }: AuthModeGateProps) {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const publicPaths = [ROUTES.splash, ROUTES.login];
  const isPublicPath = publicPaths.some(path => path === currentPath);

  const isAuthenticated = session.type === 'authenticated' || session.type === 'dev-bypass';

  // Timing instrumentation
  useEffect(() => {
    if (isLoading) {
      perfTiming.start('auth-initialization');
      startupDiagnostics.record('Auth initialization', 'pending');
    } else {
      perfTiming.end('auth-initialization');
      const status = isAuthenticated ? session.type : 'guest';
      perfTiming.log(`Auth resolved: ${status}`);
      startupDiagnostics.record('Auth resolution', 'success', status);
    }
  }, [isLoading, isAuthenticated, session.type]);

  useEffect(() => {
    if (isLoading) return;

    // If authenticated and on login page, redirect will be handled by LoginPage's usePostLoginRedirect
    // If not authenticated and trying to access protected route, redirect to login
    if (!isAuthenticated && !isPublicPath) {
      navigate({ to: ROUTES.login });
    }
  }, [isAuthenticated, isLoading, isPublicPath, navigate, currentPath]);

  // Non-blocking: render children immediately, auth resolution happens in background
  return <>{children}</>;
}
