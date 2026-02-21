import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { getLastVisitedTab } from '../store/persistence/lastVisitedTab';
import { useAuth } from '../features/auth/plugin/useAuth';

export default function SplashPage() {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  const isAuthenticated = session.type === 'authenticated' || session.type === 'dev-bypass';

  useEffect(() => {
    if (isLoading) return;

    const timer = setTimeout(() => {
      if (isAuthenticated) {
        const lastTab = getLastVisitedTab();
        navigate({ to: lastTab || ROUTES.home });
      } else {
        navigate({ to: ROUTES.login });
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <div className="text-center">
        <h1 className="mb-2 text-5xl font-bold tracking-tight">CampusMarket</h1>
        <p className="mb-8 text-lg text-muted-foreground">Buy & Sell inside your campus</p>
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
      </div>
    </div>
  );
}
