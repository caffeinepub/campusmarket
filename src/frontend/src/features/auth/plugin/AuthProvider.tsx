// React context provider for auth plugin abstraction

import { createContext, ReactNode, useState, useEffect } from 'react';
import type { AuthContextValue } from './authTypes';
import { StubSupabaseAuthProvider } from './providers/stubSupabaseAuthProvider';

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Default to stub provider
  const [provider] = useState(() => new StubSupabaseAuthProvider());
  const [session, setSession] = useState(() => provider.getSession());
  const [isLoading, setIsLoading] = useState(false);

  // Sync session state when provider changes
  useEffect(() => {
    setSession(provider.getSession());
  }, [provider]);

  const signIn = async (email: string) => {
    setIsLoading(true);
    try {
      await provider.signIn(email);
      setSession(provider.getSession());
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await provider.signOut();
      setSession(provider.getSession());
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextValue = {
    session,
    signIn,
    signOut,
    providerInfo: provider.getProviderInfo(),
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext };
