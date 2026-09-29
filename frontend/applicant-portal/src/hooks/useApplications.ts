import { useState, useCallback, useEffect } from 'react';
import { Application } from '../types';

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      // Mock fetching
      await new Promise(resolve => setTimeout(resolve, 800));
      setApplications([
        {
          id: 'app-1',
          schemeId: 'sch-1',
          schemeName: 'Pre-Matric Scholarship',
          status: 'Under Review',
          submissionDate: '2026-09-01T10:00:00Z',
          lastUpdated: '2026-09-15T14:30:00Z',
          data: {}
        }
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const submitApplication = useCallback(async (data: Partial<Application>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Mock logic to add new application
      const newApp: Application = {
        id: `app-${Date.now()}`,
        schemeId: data.schemeId || '',
        schemeName: data.schemeName || 'New Scheme',
        status: 'Submitted',
        submissionDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        data: data.data || {}
      };
      setApplications(prev => [...prev, newApp]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { applications, loading, refetch: fetchApplications, submitApplication };
};
