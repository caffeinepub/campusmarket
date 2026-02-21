// Hook for 2s timeout on profile loading with fallback actions
import { useEffect, useState } from 'react';

interface ProfileTimeoutState {
  hasTimedOut: boolean;
  showFallback: boolean;
}

export function useProfileStartupTimeout(isLoading: boolean, isFetched: boolean) {
  const [state, setState] = useState<ProfileTimeoutState>({
    hasTimedOut: false,
    showFallback: false,
  });

  useEffect(() => {
    if (!isLoading || isFetched) {
      // Reset if loading completes
      setState({ hasTimedOut: false, showFallback: false });
      return;
    }

    const timer = setTimeout(() => {
      setState({ hasTimedOut: true, showFallback: true });
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoading, isFetched]);

  const retry = () => {
    setState({ hasTimedOut: false, showFallback: false });
  };

  const continueAsGuest = () => {
    setState({ hasTimedOut: true, showFallback: false });
  };

  return {
    hasTimedOut: state.hasTimedOut,
    showFallback: state.showFallback,
    retry,
    continueAsGuest,
  };
}
