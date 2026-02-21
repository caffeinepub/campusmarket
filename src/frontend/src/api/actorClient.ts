import { useActor } from '../hooks/useActor';
import { useEffect } from 'react';
import { perfTiming } from '../utils/perfTimings';
import { startupDiagnostics } from '../utils/startupDiagnostics';

let actorReadinessLogged = false;

export function useActorClient() {
  const { actor, isFetching } = useActor();

  useEffect(() => {
    if (!actorReadinessLogged && actor && !isFetching) {
      actorReadinessLogged = true;
      perfTiming.log('Actor ready');
      startupDiagnostics.record('Actor initialization', 'success');
    }
  }, [actor, isFetching]);

  return { actor, isFetching };
}
