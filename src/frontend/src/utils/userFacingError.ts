// Utility to convert runtime/authorization errors into user-friendly messages

export function userFacingError(error: unknown): string {
  if (!error) return 'An unexpected error occurred';

  // Handle Error objects
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Authorization errors
    if (message.includes('unauthorized') || message.includes('permission')) {
      return 'You don\'t have permission to perform this action';
    }

    // Network/connection errors
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error. Please check your connection';
    }

    // Actor/backend errors
    if (message.includes('actor not available')) {
      return 'Service temporarily unavailable. Please try again';
    }

    // Timeout errors
    if (message.includes('timeout')) {
      return 'Request timed out. Please try again';
    }

    // Return the original message if it's already user-friendly
    if (message.length < 100 && !message.includes('stack') && !message.includes('at ')) {
      return error.message;
    }
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback
  return 'Something went wrong. Please try again';
}
