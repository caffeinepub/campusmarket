// Non-blocking autosave hook for Sell Wizard
import { useEffect, useRef } from 'react';
import { getSellDraft, setSellDraft, clearSellDraft } from '../../../store/persistence/sellDraft';
import type { SellWizardFormData } from './sellWizardTypes';

const AUTOSAVE_INTERVAL = 4000; // 4 seconds

export function useSellDraftAutosave(formData: SellWizardFormData, enabled: boolean = true) {
  const lastSavedRef = useRef<string>('');

  // Restore draft on mount
  useEffect(() => {
    const draft = getSellDraft();
    return () => {
      // Cleanup on unmount
    };
  }, []);

  // Autosave on interval
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const current = JSON.stringify(formData);
      if (current !== lastSavedRef.current) {
        setSellDraft(formData);
        lastSavedRef.current = current;
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [formData, enabled]);

  return {
    restoreDraft: getSellDraft,
    clearDraft: clearSellDraft,
  };
}
