// Sell Wizard draft persistence with autosave support
import { STORAGE_KEYS } from './storageKeys';
import type { SellWizardFormData } from '../../features/listings/sellWizard/sellWizardTypes';

export function getSellDraft(): SellWizardFormData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SELL_DRAFT);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to get sell draft:', e);
    return null;
  }
}

export function setSellDraft(draft: SellWizardFormData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SELL_DRAFT, JSON.stringify(draft));
  } catch (e) {
    console.error('Failed to set sell draft:', e);
  }
}

export function clearSellDraft(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELL_DRAFT);
  } catch (e) {
    console.error('Failed to clear sell draft:', e);
  }
}
