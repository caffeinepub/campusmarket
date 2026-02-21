import type { UserProfile } from '../../backend';
import { Principal } from '@dfinity/principal';

/**
 * Returns a default profile for dev-bypass/dev-guest mode.
 * This is only used in development and does not affect production behavior.
 */
export function getDevModeDefaultProfile(): UserProfile {
  // Only return default profile in dev mode
  if (import.meta.env.MODE !== 'development') {
    throw new Error('Dev mode default profile is only available in development');
  }

  return {
    principal: Principal.anonymous(),
    department: 'Computer Science',
    hostel: 'Dev Hostel',
    campus: 'Dev Campus',
    onboarding_complete: true,
  };
}

export function isDevModeProfileEnabled(): boolean {
  return import.meta.env.MODE === 'development';
}
