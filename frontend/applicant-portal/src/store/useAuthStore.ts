import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  initAuth: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  login: (token, user) => {
    // Rely on secure HttpOnly cookies for actual API auth in production.
    // We only keep the token in memory for now.
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    set({ token: null, user: null, isAuthenticated: false });
  },
  initAuth: () => {
    // In production, this would make a /me request to the API backend
    // to verify the current HttpOnly cookie session and fetch user state.
    // For now, we rely on the manual login flow setting memory state.
  }
}));

export default useAuthStore;
