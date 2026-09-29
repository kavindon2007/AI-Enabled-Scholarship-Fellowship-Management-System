import { useState, useCallback } from 'react';
import { Document } from '../types';

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    // Mock fetch
    setDocuments([
      { id: 'doc-1', type: 'Income Certificate', name: 'income_proof.pdf', status: 'Verified', url: '#', uploadedAt: '2026-08-15T09:00:00Z' }
    ]);
  }, []);

  const uploadDocument = useCallback(async (file: File, type: string) => {
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        type,
        name: file.name,
        status: 'Pending',
        url: '#',
        uploadedAt: new Date().toISOString()
      };
      setDocuments(prev => [...prev, newDoc]);
    } finally {
      setUploading(false);
    }
  }, []);

  return { documents, uploading, fetchDocuments, uploadDocument };
};
