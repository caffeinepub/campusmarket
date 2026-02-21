import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { useMockMode } from '../features/listings/mock/mockMode';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

export default function DevQaChecklistPage() {
  const navigate = useNavigate();
  const { isMockMode, enableMockMode, disableMockMode, isDev } = useMockMode();

  // Show warning if somehow accessed in production (should be blocked by route guard)
  if (!isDev) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Card className="border-destructive">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Development Only</CardTitle>
            </div>
            <CardDescription>
              This page is only available in development builds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: ROUTES.home })}>
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const flows = [
    {
      id: 'home-feed',
      title: 'Home Feed with Filters',
      description: 'View listings, apply filters, see skeleton loading',
      action: () => navigate({ to: ROUTES.home }),
    },
    {
      id: 'home-feed-filtered',
      title: 'Home Feed - Electronics Filter',
      description: 'View home feed filtered by Electronics category',
      action: () => navigate({ to: ROUTES.home, search: { category: 'Electronics' } }),
    },
    {
      id: 'home-feed-sorted',
      title: 'Home Feed - Price Sorted',
      description: 'View home feed sorted by price (low to high)',
      action: () => navigate({ to: ROUTES.home, search: { sort: 'price-low' } }),
    },
    {
      id: 'listing-detail',
      title: 'Listing Details',
      description: 'View listing details with image carousel and actions',
      action: () => navigate({ to: ROUTES.listing('mock-1') }),
    },
    {
      id: 'listing-detail-multi',
      title: 'Listing Details - Multiple Images',
      description: 'View listing with multiple images in carousel',
      action: () => navigate({ to: ROUTES.listing('mock-5') }),
    },
    {
      id: 'saved-page',
      title: 'Saved Listings',
      description: 'View saved listings (save some items first)',
      action: () => navigate({ to: ROUTES.saved }),
    },
    {
      id: 'chats-inbox',
      title: 'Chats Inbox',
      description: 'View all chat threads',
      action: () => navigate({ to: ROUTES.chats }),
    },
    {
      id: 'notifications',
      title: 'Notifications',
      description: 'View and interact with notifications',
      action: () => navigate({ to: ROUTES.notifications }),
    },
  ];

  return (
    <div className="container mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">QA Checklist</h1>
        <p className="text-muted-foreground">Development and draft validation page</p>
      </div>

      {/* Mock Mode Toggle */}
      <Card className="interactive-glow mb-6 transition-all">
        <CardHeader>
          <CardTitle>Mock Mode</CardTitle>
          <CardDescription>
            {isMockMode ? '🎭 Using mock data for testing' : '🔌 Using real backend data'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={isMockMode ? 'default' : 'outline'}
              onClick={enableMockMode}
              disabled={isMockMode}
              className="interactive-press"
            >
              Enable Mock Mode
            </Button>
            <Button
              variant={!isMockMode ? 'default' : 'outline'}
              onClick={disableMockMode}
              disabled={!isMockMode}
              className="interactive-press"
            >
              Use Real Backend
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Flow Checklist */}
      <Card className="interactive-glow transition-all">
        <CardHeader>
          <CardTitle>Implemented Flows</CardTitle>
          <CardDescription>Click to test each flow in draft mode</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {flows.map((flow, index) => (
              <div
                key={flow.id}
                className="interactive-press interactive-glow flex items-start gap-3 rounded-lg border border-border p-4 transition-all hover:bg-muted/50 animate-in fade-in slide-in-from-bottom-2"
                style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <div className="flex-1">
                  <h3 className="font-semibold">{flow.title}</h3>
                  <p className="text-sm text-muted-foreground">{flow.description}</p>
                </div>
                <Button size="sm" onClick={flow.action} className="interactive-press">
                  Test
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Testing Notes */}
      <Card className="interactive-glow mt-6 transition-all">
        <CardHeader>
          <CardTitle>Testing Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>✅ All animations use transform/opacity only (GPU-friendly)</p>
          <p>✅ Cursor-responsive gradient layer (desktop only)</p>
          <p>✅ Interactive press/glow effects with reduced-motion support</p>
          <p>✅ Optimistic UI for save/unsave with rollback on error</p>
          <p>✅ Skeleton loading states (no blocking spinners)</p>
          <p>✅ Filter state persisted in URL</p>
          <p>✅ Mobile-first responsive design</p>
          <p>✅ Smooth sheet/modal transitions</p>
          <p>✅ Image carousel with swipe support</p>
          <p>✅ Web Share API with clipboard fallback</p>
          <p>✅ Chat thread creation and messaging</p>
          <p>✅ Notification click handlers with navigation</p>
          <p>✅ Toast-based error handling throughout</p>
          <p>✅ Non-blocking startup with AppShell skeleton</p>
          <p>✅ Profile cache hydration for instant render</p>
          <p>✅ Lazy-loaded routes with code-splitting</p>
          <p>✅ Native lazy image loading in feed</p>
          <p>✅ Startup timing instrumentation</p>
          <p>✅ Production-safe performance utilities</p>
          <p>✅ DEV-only route guards for /dev/qa</p>
          <p>✅ Mock mode strictly disabled in production</p>
        </CardContent>
      </Card>
    </div>
  );
}
