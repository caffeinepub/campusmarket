// Development-only mock mode toggle with hardened production enforcement
const MOCK_MODE_KEY = 'dev_mock_mode';

// Clear any persisted mock mode flags in production builds
if (!import.meta.env.DEV) {
  try {
    localStorage.removeItem(MOCK_MODE_KEY);
  } catch (e) {
    // Silently fail if localStorage is unavailable
  }
}

export function useMockMode() {
  // Check if mock mode is enabled via environment or localStorage
  // Strictly DEV-only - localStorage toggle does not work in production
  const isMockMode = import.meta.env.DEV && (
    import.meta.env.VITE_MOCK_MODE === 'true' ||
    localStorage.getItem(MOCK_MODE_KEY) === 'true'
  );

  const enableMockMode = () => {
    // Strictly no-op in production
    if (!import.meta.env.DEV) return;
    
    try {
      localStorage.setItem(MOCK_MODE_KEY, 'true');
      window.location.reload();
    } catch (e) {
      console.error('Failed to enable mock mode:', e);
    }
  };

  const disableMockMode = () => {
    // Strictly no-op in production
    if (!import.meta.env.DEV) return;
    
    try {
      localStorage.removeItem(MOCK_MODE_KEY);
      window.location.reload();
    } catch (e) {
      console.error('Failed to disable mock mode:', e);
    }
  };

  return {
    isMockMode,
    enableMockMode,
    disableMockMode,
    isDev: import.meta.env.DEV,
  };
}
