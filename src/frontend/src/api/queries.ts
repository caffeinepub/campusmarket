export const queryKeys = {
  profile: {
    current: () => ['currentUserProfile'] as const,
    byPrincipal: (principal: string) => ['userProfile', principal] as const,
  },
  listings: {
    all: () => ['listings'] as const,
    byId: (id: string) => ['listing', id] as const,
    bySeller: (seller: string) => ['listingsBySeller', seller] as const,
    saved: () => ['savedListings'] as const,
    search: (term: string) => ['searchListings', term] as const,
  },
  chat: {
    threads: () => ['chatThreads'] as const,
    thread: (id: string) => ['chatThread', id] as const,
  },
  notifications: {
    all: () => ['notifications'] as const,
  },
  insights: {
    analytics: (timeRange: string) => ['insights', 'analytics', timeRange] as const,
  },
  reviews: {
    seller: (listingId: string) => ['sellerReviews', listingId] as const,
    product: (listingId: string) => ['productReviews', listingId] as const,
  },
} as const;
