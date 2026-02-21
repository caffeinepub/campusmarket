// Safe performance timing utility with guards for missing console APIs and browser-only APIs
const timings = new Map<string, number>();

// Guard for performance.now() availability
function getTimestamp(): number {
  try {
    if (typeof performance !== 'undefined' && performance.now) {
      return performance.now();
    }
  } catch (e) {
    // Fall through to Date.now()
  }
  return Date.now();
}

export const perfTiming = {
  start(label: string): void {
    try {
      if (typeof console !== 'undefined' && console.time) {
        console.time(label);
      }
      timings.set(label, getTimestamp());
    } catch (e) {
      // Silently fail if console or performance is unavailable
    }
  },

  end(label: string): void {
    try {
      if (typeof console !== 'undefined' && console.timeEnd) {
        console.timeEnd(label);
      }
      const start = timings.get(label);
      if (start !== undefined) {
        const duration = getTimestamp() - start;
        if (typeof console !== 'undefined' && console.log) {
          console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
        }
        timings.delete(label);
      }
    } catch (e) {
      // Silently fail if console or performance is unavailable
    }
  },

  log(message: string, ...args: any[]): void {
    try {
      if (typeof console !== 'undefined' && console.log) {
        console.log(`🔍 ${message}`, ...args);
      }
    } catch (e) {
      // Silently fail if console is unavailable
    }
  },
};
