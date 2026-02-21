// Stub/placeholder Supabase auth provider for development

import type { AuthProvider, AuthSession } from '../authTypes';
import { saveAuthSession, loadAuthSession, clearAuthSession } from '../authStorage';

const DEV_BYPASS_EMAIL = 'as8838@srmist.edu.in';

export class StubSupabaseAuthProvider implements AuthProvider {
  private session: AuthSession;

  constructor() {
    // Try to restore session from storage
    const stored = loadAuthSession();
    if (stored) {
      this.session = {
        type: stored.type,
        email: stored.email,
        userId: stored.userId,
        metadata: stored.metadata,
      };
    } else {
      this.session = { type: 'guest' };
    }
  }

  getSession(): AuthSession {
    return this.session;
  }

  async signIn(email: string): Promise<void> {
    // Check for dev-bypass email
    if (email === DEV_BYPASS_EMAIL) {
      this.session = {
        type: 'dev-bypass',
        email,
        userId: 'dev-bypass-user',
        metadata: { 
          devMode: true,
          canCreateListings: true,
          canSaveListings: true,
        },
      };
      
      saveAuthSession({
        ...this.session,
        timestamp: Date.now(),
      });
      
      return;
    }

    // For any other email, show placeholder message
    throw new Error(
      'This is a placeholder auth provider. Real Supabase authentication is not yet configured. Only the dev-bypass email is supported.'
    );
  }

  async signOut(): Promise<void> {
    this.session = { type: 'guest' };
    clearAuthSession();
  }

  getProviderInfo() {
    return {
      name: 'Stub Supabase Provider',
      isPlaceholder: true,
      description: 'Placeholder provider ready for Supabase integration. Currently supports dev-bypass only.',
    };
  }
}
