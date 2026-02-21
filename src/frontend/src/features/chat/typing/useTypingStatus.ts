// Hook to publish typing status with bounded frequency
import { useEffect, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useActorClient } from '../../../api/actorClient';

const TYPING_DEBOUNCE = 2000; // 2 seconds

export function useTypingStatus(threadId: string, isTyping: boolean) {
  const { actor } = useActorClient();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: async (typing: boolean) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateTypingStatus(threadId, typing);
    },
  });

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (isTyping) {
      mutation.mutate(true);
      timeoutRef.current = setTimeout(() => {
        mutation.mutate(false);
      }, TYPING_DEBOUNCE);
    } else {
      mutation.mutate(false);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isTyping, threadId]);
}
