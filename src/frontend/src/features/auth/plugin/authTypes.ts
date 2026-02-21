// Auth plugin types for swappable authentication providers

export interface AuthSession {
  type: 'authenticated' | 'dev-bypass' | 'guest';
  email?: string;
  userId?: string;
  metadata?: Record<string, any>;
}

export interface AuthProvider {
  // Current session state
  getSession(): AuthSession;
  
  // Sign in with email
  signIn(email: string): Promise<void>;
  
  // Sign out
  signOut(): Promise<void>;
  
  // Provider metadata
  getProviderInfo(): {
    name: string;
    isPlaceholder: boolean;
    description: string;
  };
}

export interface AuthContextValue {
  session: AuthSession;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  providerInfo: {
    name: string;
    isPlaceholder: boolean;
    description: string;
  };
  isLoading: boolean;
}
