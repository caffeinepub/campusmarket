# Frontend Structure Documentation

## Overview
This is a React + TypeScript frontend for a campus marketplace application, built with Vite and deployed on the Internet Computer.

## Architecture

### Auth Plugin System
The application uses a pluggable authentication system that supports multiple providers:
- **Stub Supabase Provider**: Placeholder for email-based auth (dev-bypass mode for `as8838@srmist.edu.in`)
- **Internet Identity Bridge**: Wraps existing IC authentication for backward compatibility

#### Dev-Bypass Mode
Dev-bypass mode allows development and testing without full authentication:
- Enabled automatically for the email `as8838@srmist.edu.in`
- Uses mock data for listings and saved items
- Disables chat, save, and report actions with user-friendly messages
- Persists session across page refreshes

### State Management
- **React Query**: Server state and caching
- **Local Storage**: Persistence for cart, saved items (auth-off), recent searches, recently viewed, filters, drafts
- **Session Storage**: Autosuggest cache
- **Zustand**: Not currently used but available

### Key Features

#### Discovery & Recommendations
- **Trending Feed**: Computed from recently viewed and recent searches
- **Recommended Feed**: Personalized based on saved items and browsing history
- **Recently Viewed**: Tracks last 20 viewed listings
- **Autosuggest**: Cached suggestions from listing titles and categories

#### Cart System
- Local-only cart (no backend persistence)
- Add/remove items with immediate UI updates
- Persists across page refreshes
- Displayed in Home dashboard

#### Search
- Amazon-style search with filters and sorts
- Category browsing
- Price range filtering
- Sort by relevance, newest, price (low→high, high→low)
- Empty state shows trending and recommended sections

#### Home Dashboard
- Cart summary
- Saved items strip
- Marquee announcements
- Trending section
- Recommended section
- Latest listings with filters

### Recommendations System
The app uses a pluggable recommendation provider abstraction:
- **Default Mode**: Deterministic heuristics (no external calls)
- **External Mode**: Placeholder for future AI integration (currently disabled)

#### Chutes AI Integration (Placeholder)
The following configuration is documented for future external AI recommendations:

