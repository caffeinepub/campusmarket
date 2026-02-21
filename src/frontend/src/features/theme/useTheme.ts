import { useEffect, useState } from 'react';
import { getCookiePreferences, setCookiePreference } from '../../store/persistence/cookies';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const prefs = getCookiePreferences();
    return prefs.prefers_dark_mode ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setCookiePreference('prefers_dark_mode', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
