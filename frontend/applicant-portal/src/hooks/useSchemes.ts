import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export interface Scheme {
  id: string;
  name: string;
  description: string;
  deadline: string;
  eligibilityCriteria: string[];
}

export const useSchemes = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSchemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ schemes: Scheme[] }>('/schemes');
      setSchemes(response.data.schemes || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch schemes');
      setSchemes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchemes();
  }, [fetchSchemes]);

  return { schemes, loading, error, refetch: fetchSchemes };
};
