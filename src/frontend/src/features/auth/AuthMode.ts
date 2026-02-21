// AUTH_OFF mode configuration
// When true, uses dev identity and localStorage for certain features
// When false, requires Internet Identity authentication

export const AUTH_MODE = {
  isAuthOff: false, // Set to true for dev mode
} as const;

export function isAuthOffMode(): boolean {
  return AUTH_MODE.isAuthOff;
}
