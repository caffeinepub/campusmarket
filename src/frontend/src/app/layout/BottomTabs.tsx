import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Home, Search, PlusCircle, MessageSquare, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '../routes';
import { getLastVisitedTab, setLastVisitedTab } from '../../store/persistence/lastVisitedTab';
import { useEffect } from 'react';
import { useCart } from '../../features/cart/hooks/useCart';
import { Badge } from '@/components/ui/badge';

const tabs = [
  { id: 'home', label: 'Home', icon: Home, path: ROUTES.home },
  { id: 'search', label: 'Search', icon: Search, path: ROUTES.search },
  { id: 'sell', label: 'Sell', icon: PlusCircle, path: ROUTES.sell },
  { id: 'cart', label: 'Cart', icon: ShoppingCart, path: ROUTES.cart },
  { id: 'chats', label: 'Chats', icon: MessageSquare, path: ROUTES.chats },
] as const;

export function BottomTabs() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const { cartCount } = useCart();

  const activeTab = tabs.find(tab => currentPath === tab.path)?.id || getLastVisitedTab();

  useEffect(() => {
    const currentTab = tabs.find(tab => currentPath === tab.path);
    if (currentTab) {
      setLastVisitedTab(currentTab.id);
    }
  }, [currentPath]);

  const handleTabClick = (path: string) => {
    navigate({ to: path });
  };

  const handleKeyDown = (e: React.KeyboardEvent, path: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleTabClick(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-[0_-2px_12px_-2px_rgba(0,0,0,0.08)]">
      <div className="container mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            const showBadge = tab.id === 'cart' && cartCount > 0;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.path)}
                onKeyDown={(e) => handleKeyDown(e, tab.path)}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl motion-safe:transition-all relative',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/30'
                )}
                aria-label={tab.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <div className="relative">
                  <Icon className={cn('h-5 w-5', isActive && 'fill-primary/15')} />
                  {showBadge && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-2xs font-bold"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </div>
                <span className={cn('text-2xs font-medium', isActive && 'font-semibold')}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
