export const queryKeys = {
  listings: {
    all: ['listings'] as const,
    list: () => [...queryKeys.listings.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.listings.all, 'detail', id] as const,
    search: (term: string) => [...queryKeys.listings.all, 'search', term] as const,
    saved: () => [...queryKeys.listings.all, 'saved'] as const,
    bySeller: (seller: string) => [...queryKeys.listings.all, 'bySeller', seller] as const,
  },
  profile: {
    all: ['profile'] as const,
    current: () => [...queryKeys.profile.all, 'current'] as const,
    byId: (id: string) => [...queryKeys.profile.all, 'byId', id] as const,
  },
  chat: {
    all: ['chat'] as const,
    threads: () => [...queryKeys.chat.all, 'threads'] as const,
    thread: (id: string) => [...queryKeys.chat.all, 'thread', id] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: () => [...queryKeys.notifications.all, 'list'] as const,
  },
  insights: {
    all: ['insights'] as const,
    analytics: (timeRange: string) => [...queryKeys.insights.all, 'analytics', timeRange] as const,
  },
} as const;
