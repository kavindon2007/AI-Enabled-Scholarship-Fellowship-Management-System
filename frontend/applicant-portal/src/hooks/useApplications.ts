import { useState, useCallback, useEffect } from 'react';
import { Application } from '../types';
import { apiClient } from '../api/apiClient';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get<{ applications: Application[] }>('/applications');
      setApplications(response.data.applications || []);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to fetch applications');
      setApplications([]); // No silent fallback in production paths
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const submitApplication = useCallback(async (data: Partial<Application>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.post<{ application: Application }>('/applications', data);
      setApplications(prev => [...prev, response.data.application]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to submit application');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { applications, loading, error, refetch: fetchApplications, submitApplication };
};
