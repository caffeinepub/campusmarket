// Centralized, versioned storage keys for all persistence layers
export const STORAGE_KEYS = {
  // Auth & Profile
  AUTH_SESSION: 'caffeine:auth:session:v1',
  PROFILE_CACHE: 'caffeine:profile:cache:v1',
  DEV_GUEST_MODE: 'caffeine:dev:guest:v1',
  
  // Cookies (simulated via localStorage)
  CAMPUS_SLUG: 'caffeine:cookie:campus_slug:v1',
  COOKIE_PREFERENCES: 'caffeine:cookie:preferences:v1',
  PREFERS_DARK_MODE: 'caffeine:cookie:prefers_dark_mode:v1',
  UI_MOTION_LEVEL: 'caffeine:cookie:ui_motion_level:v1',
  
  // Discovery & Browsing
  RECENTLY_VIEWED: 'caffeine:discovery:viewed:v1',
  RECENT_SEARCHES: 'caffeine:search:recent:v1',
  
  // User Actions
  SAVED_LISTINGS_AUTH_OFF: 'caffeine:listings:saved:v1',
  CART: 'caffeine:cart:v1',
  
  // UI State
  HOME_FILTERS: 'caffeine:home:filters:v1',
  LAST_VISITED_TAB: 'caffeine:nav:lastTab:v1',
  
  // Drafts
  SELL_DRAFT: 'caffeine:sell:draft:v1',
} as const;
