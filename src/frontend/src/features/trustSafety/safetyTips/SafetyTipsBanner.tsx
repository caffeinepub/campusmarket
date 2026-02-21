// Safety tips banner component
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

export function SafetyTipsBanner() {
  return (
    <Alert className="mb-4">
      <Shield className="h-4 w-4" />
      <AlertDescription className="text-sm">
        <strong>Safety tip:</strong> Meet in public places on campus. Never share personal financial information.
      </AlertDescription>
    </Alert>
  );
}
