import { useState, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';
import { apiClient } from '../api/apiClient';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore(state => state.user);
  
  const loginAction = useAuthStore(state => state.login);
  const logoutAction = useAuthStore(state => state.logout);

  const loginWithAadhaar = useCallback(async (aadhaarNumber: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/auth/login', { aadhaarNumber, otp });
      const { token, user } = response.data;
      
      loginAction(token, user);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please check credentials.');
    } finally {
      setIsLoading(false);
    }
  }, [loginAction]);

  const logout = useCallback(async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (e) {
      console.warn("Logout request failed, clearing local state anyway", e);
    } finally {
      logoutAction();
    }
  }, [logoutAction]);

  return { isLoading, error, user, loginWithAadhaar, logout };
};
