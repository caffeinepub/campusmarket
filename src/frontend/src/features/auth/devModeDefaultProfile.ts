import { Principal } from '@dfinity/principal';
import type { UserProfile } from '../../backend';

export function getDevModeDefaultProfile(): UserProfile {
  if (import.meta.env.PROD) {
    throw new Error('Dev mode default profile should not be used in production');
  }

  return {
    principal: Principal.fromText('2vxsx-fae'),
    department: 'Computer Science',
    hostel: 'North Hall',
    campus: 'Main Campus',
    onboarding_complete: true,
    verified_student: true,
    star_rating: 5.0,
    reliability_score: 4.8,
    transaction_count: BigInt(10),
  };
}
