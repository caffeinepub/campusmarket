// Non-blocking fallback UI for profile fetch timeout
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

interface ProfileTimeoutFallbackProps {
  onRetry: () => void;
  onContinueAsGuest: () => void;
}

export function ProfileTimeoutFallback({ onRetry, onContinueAsGuest }: ProfileTimeoutFallbackProps) {
  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <Card className="border-warning/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-warning" />
            <div>
              <CardTitle>Loading is taking longer than expected</CardTitle>
              <CardDescription>Profile data is slow to load</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button onClick={onRetry} className="w-full" variant="default">
            Retry
          </Button>
          <Button onClick={onContinueAsGuest} className="w-full" variant="outline">
            Continue in Guest/Dev mode
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
