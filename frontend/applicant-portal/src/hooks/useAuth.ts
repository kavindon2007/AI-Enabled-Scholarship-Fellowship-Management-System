import { useState, useCallback } from 'react';
import useAuthStore from '../store/useAuthStore';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const loginAction = useAuthStore(state => state.login);
  const logoutAction = useAuthStore(state => state.logout);

  const loginWithAadhaar = useCallback(async (aadhaarNumber: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Mock API call - delay for UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Accept ANY OTP and ANY Aadhaar number for testing purposes
      loginAction("mock-jwt-token", {
        id: 'u1',
        name: 'Applicant User',
        email: 'applicant@example.com',
        role: 'APPLICANT'
      });
      
      // Also write to local user for backwards compatibility with any component checking it
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  }, [loginAction]);

  const logout = useCallback(() => {
    logoutAction();
  }, [logoutAction]);

  return { isLoading, error, loginWithAadhaar, logout };
};
