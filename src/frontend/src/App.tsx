import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { CursorReactiveLayer } from './app/effects/CursorReactiveLayer';
import { useEffect } from 'react';
import { perfTiming } from './utils/perfTimings';
import { startupDiagnostics } from './utils/startupDiagnostics';
import { useQueryClient } from '@tanstack/react-query';
import { getCachedProfile } from './features/auth/profileCache';
import { queryKeys } from './api/queries';
import { getCookiePreferences } from './store/persistence/cookies';
import { AuthProvider } from './features/auth/plugin/AuthProvider';

// Bootstrap timing
perfTiming.start('app-bootstrap');
perfTiming.start('first-appshell-render');

export default function App() {
  const queryClient = useQueryClient();

  useEffect(() => {
    perfTiming.end('app-bootstrap');
    perfTiming.log('App mounted');
    startupDiagnostics.record('App mount', 'success');

    // Hydrate cookie preferences
    const cookiePrefs = getCookiePreferences();
    if (cookiePrefs.campus_slug) {
      perfTiming.log('Loaded campus preference: ' + cookiePrefs.campus_slug);
    }

    // Apply theme preference
    const root = document.documentElement;
    if (cookiePrefs.prefers_dark_mode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Hydrate profile cache on startup
    const cachedProfile = getCachedProfile();
    if (cachedProfile) {
      perfTiming.log('Hydrating cached profile');
      queryClient.setQueryData(queryKeys.profile.current(), cachedProfile);
      startupDiagnostics.record('Profile cache hydration', 'success');
    } else {
      startupDiagnostics.record('Profile cache hydration', 'success', 'no cached data');
    }

    // Report diagnostics after a short delay to capture all startup events
    setTimeout(() => {
      startupDiagnostics.report();
    }, 100);
  }, [queryClient]);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        <CursorReactiveLayer />
        <RouterProvider router={router} />
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}
