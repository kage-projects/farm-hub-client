/**
 * LocalStorage helper utilities
 * - Auto-save draft data
 * - Type-safe storage operations
 */

const DRAFT_KEY_PREFIX = 'farmhub_draft_';

export function saveDraft(key: string, data: unknown): void {
  try {
    const fullKey = `${DRAFT_KEY_PREFIX}${key}`;
    localStorage.setItem(fullKey, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
}

export function loadDraft<T>(key: string): T | null {
  try {
    const fullKey = `${DRAFT_KEY_PREFIX}${key}`;
    const item = localStorage.getItem(fullKey);
    if (!item) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Failed to load draft:', error);
    return null;
  }
}

export function clearDraft(key: string): void {
  try {
    const fullKey = `${DRAFT_KEY_PREFIX}${key}`;
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error('Failed to clear draft:', error);
  }
}


