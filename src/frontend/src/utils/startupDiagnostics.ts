// Startup diagnostics helper for cold reload verification - production-safe
interface DiagnosticEntry {
  stage: string;
  status: 'success' | 'error' | 'pending';
  message?: string;
  timestamp: number;
}

class StartupDiagnostics {
  private entries: DiagnosticEntry[] = [];
  private hasReported = false;

  record(stage: string, status: 'success' | 'error' | 'pending', message?: string): void {
    try {
      this.entries.push({
        stage,
        status,
        message,
        timestamp: Date.now(),
      });
    } catch (e) {
      // Silently fail - do not break rendering
    }
  }

  report(): void {
    if (this.hasReported) return;
    this.hasReported = true;

    try {
      if (typeof console === 'undefined' || !console.log) return;

      console.log('\n🚀 === STARTUP DIAGNOSTICS ===');
      
      let hasErrors = false;
      this.entries.forEach((entry) => {
        try {
          const icon = entry.status === 'success' ? '✅' : entry.status === 'error' ? '❌' : '⏳';
          const msg = entry.message ? `: ${entry.message}` : '';
          console.log(`${icon} ${entry.stage}${msg}`);
          if (entry.status === 'error') hasErrors = true;
        } catch (e) {
          // Skip this entry if formatting fails
        }
      });

      if (!hasErrors) {
        console.log('✅ No startup errors detected');
      }

      console.log('=== END DIAGNOSTICS ===\n');
    } catch (e) {
      // Silently fail - do not break rendering
    }
  }

  clear(): void {
    try {
      this.entries = [];
      this.hasReported = false;
    } catch (e) {
      // Silently fail
    }
  }
}

export const startupDiagnostics = new StartupDiagnostics();
