export const ROUTES = {
  splash: '/',
  login: '/login',
  onboarding: '/onboarding',
  home: '/home',
  search: '/search',
  sell: '/sell',
  listing: (id: string) => `/listing/${id}`,
  listingEdit: (id: string) => `/listing/${id}/edit`,
  chats: '/chats',
  chatThread: (id: string) => `/chat/${id}`,
  saved: '/saved',
  cart: '/cart',
  checkout: '/checkout',
  checkoutConfirmation: '/checkout/confirmation',
  myListings: '/my-listings',
  notifications: '/notifications',
  profile: '/profile',
  insights: '/insights',
  devQa: '/dev/qa',
} as const;

export function getListingIdFromPath(path: string): string | null {
  const match = path.match(/\/listing\/([^/]+)/);
  return match ? match[1] : null;
}

export function getThreadIdFromPath(path: string): string | null {
  const match = path.match(/\/chat\/([^/]+)/);
  return match ? match[1] : null;
}
