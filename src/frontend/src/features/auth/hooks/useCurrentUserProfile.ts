import { useGetCallerUserProfile as useGetCallerUserProfileAPI } from '../../../api/profile';

export function useGetCallerUserProfile() {
  return useGetCallerUserProfileAPI();
}
