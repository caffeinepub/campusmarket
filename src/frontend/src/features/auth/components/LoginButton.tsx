import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { clearCachedProfile } from '../profileCache';
import { disableDevGuestMode } from '../devGuestMode';
import { clearRecentSearches } from '../../../store/persistence/recentSearches';
import { clearRecentlyViewed } from '../../../store/persistence/recentlyViewed';
import { clearHomeFilters } from '../../../store/persistence/homeFilters';
import { clearSellDraft } from '../../../store/persistence/sellDraft';
import { clearLastVisitedTab } from '../../../store/persistence/lastVisitedTab';
import { useAuth } from '../plugin/useAuth';
import { clearAuthSession } from '../plugin/authStorage';

export function LoginButton() {
  const { session, signOut, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated = session.type === 'authenticated' || session.type === 'dev-bypass';
  const disabled = isLoading;
  const text = isLoading ? 'Logging out...' : isAuthenticated ? 'Logout' : 'Login';

  const handleLogout = async () => {
    await signOut();
    queryClient.clear();
    // Clear all persisted state
    clearCachedProfile();
    disableDevGuestMode();
    clearRecentSearches();
    clearRecentlyViewed();
    clearHomeFilters();
    clearSellDraft();
    clearLastVisitedTab();
    clearAuthSession();
  };

  return (
    <Button onClick={handleLogout} disabled={disabled} className="w-full" size="lg">
      {text}
    </Button>
  );
}
