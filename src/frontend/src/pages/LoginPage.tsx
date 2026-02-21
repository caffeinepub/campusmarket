import { useState, FormEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '../features/auth/plugin/useAuth';
import { usePostLoginRedirect } from '../features/auth/hooks/usePostLoginRedirect';
import { AlertCircle, Info } from 'lucide-react';

export default function LoginPage() {
  const { signIn, isLoading, providerInfo } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  usePostLoginRedirect();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic email validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await signIn(email);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please try again.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
      <Card className="w-full max-w-md interactive-glow">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Welcome to CampusMarket</CardTitle>
          <CardDescription>Buy and sell items within your campus community</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {providerInfo.isPlaceholder && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {providerInfo.description}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoFocus
                className="focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? 'Signing in...' : 'Continue'}
            </Button>
          </form>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
