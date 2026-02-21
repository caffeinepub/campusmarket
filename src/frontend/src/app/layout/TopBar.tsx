import { ReactNode } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Search, Bell, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ROUTES } from '../routes';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQueryClient } from '@tanstack/react-query';
import { clearCachedProfile } from '../../features/auth/profileCache';
import { disableDevGuestMode } from '../../features/auth/devGuestMode';
import { useAuth } from '../../features/auth/plugin/useAuth';
import { clearAuthSession } from '../../features/auth/plugin/authStorage';
import { ThemeToggle } from '../../features/theme/ThemeToggle';

interface TopBarProps {
  title?: string;
  showBack?: boolean;
  onBackClick?: () => void;
  showSearch?: boolean;
  actions?: ReactNode;
}

export function TopBar({ title = 'CampusMarket', showBack, onBackClick, showSearch, actions }: TopBarProps) {
  const navigate = useNavigate();
  const { session, signOut } = useAuth();
  const queryClient = useQueryClient();

  const isAuthenticated = session.type === 'authenticated' || session.type === 'dev-bypass';

  const handleLogout = async () => {
    await signOut();
    queryClient.clear();
    clearCachedProfile();
    disableDevGuestMode();
    clearAuthSession();
    navigate({ to: ROUTES.login });
  };

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      window.history.back();
    }
  };

  const getUserInitials = () => {
    if (session.type === 'dev-bypass' && session.email) {
      return session.email.slice(0, 2).toUpperCase();
    }
    if (session.userId) {
      return session.userId.slice(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/90 shadow-xs">
      <div className="flex h-16 items-center justify-between px-4 container mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBackClick}
              className="motion-safe:transition-all hover:bg-muted/50"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: ROUTES.search })}
              className="motion-safe:transition-all hover:bg-muted/50"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {actions}

          {isAuthenticated && (
            <>
              <ThemeToggle />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate({ to: ROUTES.notifications })}
                className="motion-safe:transition-all hover:bg-muted/50"
              >
                <Bell className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full motion-safe:transition-all hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => navigate({ to: ROUTES.profile })}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: ROUTES.myListings })}>
                    My Listings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: ROUTES.saved })}>
                    Saved Items
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: ROUTES.recentlyViewed })}>
                    Recently Viewed
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {import.meta.env.DEV && (
                    <>
                      <DropdownMenuItem onClick={() => navigate({ to: ROUTES.devQa })}>
                        <Bug className="mr-2 h-4 w-4" />
                        Dev QA
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
