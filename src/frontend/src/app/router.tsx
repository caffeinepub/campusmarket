import { createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';
import { AppShell } from './layout/AppShell';
import { AuthModeGate } from './guards/AuthModeGate';
import { OnboardingGate } from './guards/OnboardingGate';
import { DevOnlyRouteGate } from './guards/DevOnlyRouteGate';
import { PageSkeleton } from './startup/PageSkeleton';

// Eager-loaded critical pages
import SplashPage from '../pages/SplashPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import OnboardingPage from '../pages/OnboardingPage';

// Lazy-loaded non-critical pages
const SearchPage = lazy(() => import('../pages/SearchPage'));
const SellWizardPage = lazy(() => import('../pages/SellWizardPage'));
const ListingDetailsPage = lazy(() => import('../pages/ListingDetailsPage'));
const ChatsInboxPage = lazy(() => import('../pages/ChatsInboxPage'));
const ChatThreadPage = lazy(() => import('../pages/ChatThreadPage'));
const SavedPage = lazy(() => import('../pages/SavedPage'));
const CartPage = lazy(() => import('../pages/CartPage'));
const CheckoutPage = lazy(() => import('../pages/CheckoutPage'));
const CheckoutConfirmationPage = lazy(() => import('../pages/CheckoutConfirmationPage'));
const MyListingsPage = lazy(() => import('../pages/MyListingsPage'));
const EditListingPage = lazy(() => import('../pages/EditListingPage'));
const NotificationsPage = lazy(() => import('../pages/NotificationsPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const InsightsPage = lazy(() => import('../pages/InsightsPage'));
const DevQaChecklistPage = lazy(() => import('../pages/DevQaChecklistPage'));
const ComparisonPage = lazy(() => import('../pages/ComparisonPage'));
const RecentlyViewedPage = lazy(() => import('../pages/RecentlyViewedPage'));

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <AuthModeGate>
      <Outlet />
    </AuthModeGate>
  ),
});

// Public routes
const splashRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: SplashPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

// Protected routes with app shell
const protectedLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: () => (
    <OnboardingGate>
      <Outlet />
    </OnboardingGate>
  ),
});

const homeRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/home',
  component: () => (
    <AppShell>
      <HomePage />
    </AppShell>
  ),
});

const searchRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/search',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <SearchPage />
      </Suspense>
    </AppShell>
  ),
});

const sellRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/sell',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <SellWizardPage />
    </Suspense>
  ),
});

const listingDetailsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/listing/$listingId',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <ListingDetailsPage />
    </Suspense>
  ),
});

const chatsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/chats',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <ChatsInboxPage />
      </Suspense>
    </AppShell>
  ),
});

const chatThreadRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/chat/$threadId',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <ChatThreadPage />
    </Suspense>
  ),
});

const savedRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/saved',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <SavedPage />
      </Suspense>
    </AppShell>
  ),
});

const cartRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/cart',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <CartPage />
      </Suspense>
    </AppShell>
  ),
});

const checkoutRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/checkout',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <CheckoutPage />
    </Suspense>
  ),
});

const checkoutConfirmationRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/checkout/confirmation',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <CheckoutConfirmationPage />
    </Suspense>
  ),
});

const myListingsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/my-listings',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <MyListingsPage />
      </Suspense>
    </AppShell>
  ),
});

const editListingRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/listing/$listingId/edit',
  component: () => (
    <Suspense fallback={<PageSkeleton />}>
      <EditListingPage />
    </Suspense>
  ),
});

const notificationsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/notifications',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <NotificationsPage />
      </Suspense>
    </AppShell>
  ),
});

const profileRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/profile',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <ProfilePage />
      </Suspense>
    </AppShell>
  ),
});

const insightsRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/insights',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <InsightsPage />
      </Suspense>
    </AppShell>
  ),
});

const compareRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/compare',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <ComparisonPage />
      </Suspense>
    </AppShell>
  ),
});

const recentlyViewedRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/recently-viewed',
  component: () => (
    <AppShell>
      <Suspense fallback={<PageSkeleton />}>
        <RecentlyViewedPage />
      </Suspense>
    </AppShell>
  ),
});

const onboardingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/onboarding',
  component: OnboardingPage,
});

const devQaRoute = createRoute({
  getParentRoute: () => protectedLayoutRoute,
  path: '/dev-qa',
  component: () => (
    <DevOnlyRouteGate>
      <AppShell>
        <Suspense fallback={<PageSkeleton />}>
          <DevQaChecklistPage />
        </Suspense>
      </AppShell>
    </DevOnlyRouteGate>
  ),
});

const routeTree = rootRoute.addChildren([
  splashRoute,
  loginRoute,
  onboardingRoute,
  protectedLayoutRoute.addChildren([
    homeRoute,
    searchRoute,
    sellRoute,
    listingDetailsRoute,
    chatsRoute,
    chatThreadRoute,
    savedRoute,
    cartRoute,
    checkoutRoute,
    checkoutConfirmationRoute,
    myListingsRoute,
    editListingRoute,
    notificationsRoute,
    profileRoute,
    insightsRoute,
    compareRoute,
    recentlyViewedRoute,
    devQaRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
