import { create } from 'zustand';
import { saveApplicationDraft, getApplicationDraft } from '../utils/offline';

export interface Application {
  id: string;
  scholarshipId: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  data: Record<string, any>;
  lastUpdated: string;
}

interface ApplicationState {
  applications: Application[];
  currentApplication: Application | null;
  isLoading: boolean;
  setApplications: (apps: Application[]) => void;
  setCurrentApplication: (app: Application | null) => void;
  saveDraft: (appId: string, data: Record<string, any>) => Promise<void>;
  loadDraft: (appId: string) => Promise<void>;
}

const useApplicationStore = create<ApplicationState>((set, get) => ({
  applications: [],
  currentApplication: null,
  isLoading: false,
  setApplications: (apps) => set({ applications: apps }),
  setCurrentApplication: (app) => set({ currentApplication: app }),
  saveDraft: async (appId, data) => {
    const current = get().currentApplication;
    if (current && current.id === appId) {
      const updatedApp = { ...current, data, lastUpdated: new Date().toISOString() };
      set({ currentApplication: updatedApp });
      // Save to IndexedDB for offline capability
      await saveApplicationDraft(appId, updatedApp);
    }
  },
  loadDraft: async (appId) => {
    const draft = await getApplicationDraft(appId);
    if (draft) {
      set({ currentApplication: draft });
    }
  }
}));

export default useApplicationStore;
