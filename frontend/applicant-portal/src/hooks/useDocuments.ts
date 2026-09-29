import { useState, useCallback } from 'react';
import { Document } from '../types';
import { apiClient } from '../api/apiClient';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      const response = await apiClient.get<{ documents: Document[] }>('/documents');
      setDocuments(response.data.documents || []);
    } catch (err: any) {
      console.error('Failed to fetch documents', err);
      setError(err.response?.data?.error || 'Failed to load documents');
      setDocuments([]);
    }
  }, []);

  const uploadDocument = useCallback(async (file: File, type: string) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await apiClient.post<{ document: Document }>('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setDocuments(prev => [...prev, response.data.document]);
    } catch (err: any) {
      console.error('Failed to upload document', err);
      setError(err.response?.data?.error || 'Failed to upload document');
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  return { documents, uploading, error, fetchDocuments, uploadDocument };
};
