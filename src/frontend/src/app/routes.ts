export const ROUTES = {
  splash: '/',
  login: '/login',
  onboarding: '/onboarding',
  home: '/home',
  search: '/search',
  sell: '/sell',
  listing: (id: string) => `/listing/${id}`,
  chats: '/chats',
  chatThread: (id: string) => `/chat/${id}`,
  saved: '/saved',
  cart: '/cart',
  checkout: '/checkout',
  checkoutConfirmation: '/checkout/confirmation',
  myListings: '/my-listings',
  editListing: (id: string) => `/listing/${id}/edit`,
  notifications: '/notifications',
  profile: '/profile',
  insights: '/insights',
  devQa: '/dev-qa',
  compare: '/compare',
  recentlyViewed: '/recently-viewed',
} as const;

export function parseListingId(path: string): string | null {
  const match = path.match(/\/listing\/([^/]+)/);
  return match ? match[1] : null;
}

export function parseChatThreadId(path: string): string | null {
  const match = path.match(/\/chat\/([^/]+)/);
  return match ? match[1] : null;
}
