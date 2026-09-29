import { get, set, del, keys } from 'idb-keyval';
import { Application } from '../store/useApplicationStore';

const DRAFT_PREFIX = 'draft_app_';

// Save application draft to IndexedDB
export const saveApplicationDraft = async (appId: string, data: Application): Promise<void> => {
  try {
    await set(`${DRAFT_PREFIX}${appId}`, data);
  } catch (error) {
    console.error('Error saving draft to offline storage:', error);
  }
};

// Get application draft from IndexedDB
export const getApplicationDraft = async (appId: string): Promise<Application | null> => {
  try {
    const data = await get(`${DRAFT_PREFIX}${appId}`);
    return data as Application || null;
  } catch (error) {
    console.error('Error getting draft from offline storage:', error);
    return null;
  }
};

// Get all stored drafts
export const getAllDrafts = async (): Promise<Application[]> => {
  try {
    const allKeys = await keys();
    const draftKeys = allKeys.filter(k => typeof k === 'string' && k.startsWith(DRAFT_PREFIX));

    const drafts: Application[] = [];
    for (const key of draftKeys) {
      const draft = await get(key);
      if (draft) drafts.push(draft as Application);
    }
    return drafts;
  } catch (error) {
    console.error('Error getting all drafts:', error);
    return [];
  }
};

// Remove draft after successful submission
export const removeApplicationDraft = async (appId: string): Promise<void> => {
  try {
    await del(`${DRAFT_PREFIX}${appId}`);
  } catch (error) {
    console.error('Error removing draft:', error);
  }
};
