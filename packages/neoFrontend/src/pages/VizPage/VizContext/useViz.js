import { useEffect, useMemo, useCallback } from 'react';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT_CONTENT, DOCUMENT_INFO } from '../../../constants';
import { useShareDBDoc } from './useShareDBDoc';
import { useOpStream } from './useOpStream';

export const useViz = initialViz => {
  const vizContentDoc = useShareDBDoc(DOCUMENT_CONTENT, initialViz.id);
  const vizInfoDoc = useShareDBDoc(DOCUMENT_INFO, initialViz.id);

  // Display initial viz until realtime connection has been established.
  const viz$ = useMemo(() => new BehaviorSubject(initialViz), [initialViz]);

  const getPrevious = useCallback(() => viz$.getValue().content, [viz$]);

  const vizContentOp$ = useOpStream(vizContentDoc, getPrevious);

  useEffect(() => {
    const subscription = vizContentOp$.subscribe(({ previous, next }) => {
      if (previous !== next) {
        viz$.next({
          info: viz$.getValue().info,
          content: next
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [viz$, vizContentOp$]);

  const submitVizContentOp = useMemo(() => {
    if (vizContentDoc) {
      return op => vizContentDoc.submitOp(op);
    }
    return undefined;
  }, [vizContentDoc]);

  const submitVizInfoOp = useMemo(() => {
    if (vizInfoDoc) {
      return op => vizInfoDoc.submitOp(op);
    }
    return undefined;
  }, [vizInfoDoc]);

  return { viz$, submitVizContentOp, submitVizInfoOp, vizContentOp$ };
};
