// localStorage helpers for auth plugin session persistence

const AUTH_SESSION_KEY = 'auth_plugin_session_v1';

export interface StoredAuthSession {
  type: 'authenticated' | 'dev-bypass' | 'guest';
  email?: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: number;
}

export function saveAuthSession(session: StoredAuthSession): void {
  try {
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save auth session:', e);
  }
}

export function loadAuthSession(): StoredAuthSession | null {
  try {
    const stored = localStorage.getItem(AUTH_SESSION_KEY);
    if (!stored) return null;
    
    const session = JSON.parse(stored) as StoredAuthSession;
    
    // Validate session structure
    if (!session.type || !session.timestamp) return null;
    
    // Optional: Add expiry check here if needed
    // const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
    // if (Date.now() - session.timestamp > MAX_AGE) return null;
    
    return session;
  } catch (e) {
    console.error('Failed to load auth session:', e);
    return null;
  }
}

export function clearAuthSession(): void {
  try {
    localStorage.removeItem(AUTH_SESSION_KEY);
  } catch (e) {
    console.error('Failed to clear auth session:', e);
  }
}
