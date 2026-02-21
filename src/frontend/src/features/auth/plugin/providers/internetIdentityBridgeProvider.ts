// Bridge provider that wraps Internet Identity into the new auth abstraction

import type { AuthProvider, AuthSession } from '../authTypes';

export class InternetIdentityBridgeProvider implements AuthProvider {
  private identity: any;
  private loginFn: () => Promise<void>;
  private logoutFn: () => Promise<void>;

  constructor(identity: any, loginFn: () => Promise<void>, logoutFn: () => Promise<void>) {
    this.identity = identity;
    this.loginFn = loginFn;
    this.logoutFn = logoutFn;
  }

  getSession(): AuthSession {
    if (this.identity) {
      return {
        type: 'authenticated',
        userId: this.identity.getPrincipal().toString(),
        metadata: { provider: 'internet-identity' },
      };
    }
    return { type: 'guest' };
  }

  async signIn(email: string): Promise<void> {
    // Internet Identity doesn't use email, so we ignore it and trigger II login
    await this.loginFn();
  }

  async signOut(): Promise<void> {
    await this.logoutFn();
  }

  getProviderInfo() {
    return {
      name: 'Internet Identity Bridge',
      isPlaceholder: false,
      description: 'Bridges existing Internet Identity authentication into the new auth system.',
    };
  }
}
