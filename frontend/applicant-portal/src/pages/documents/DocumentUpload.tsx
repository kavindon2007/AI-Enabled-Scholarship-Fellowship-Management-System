import React, { useState } from 'react';
import { FileUpload } from '../../components/forms/FileUpload';
import { useDocuments } from '../../hooks/useDocuments';

export const DocumentUpload: React.FC = () => {
  const { uploadDocument, uploading } = useDocuments();
  const [docType, setDocType] = useState('');

  const docTypes = [
    'Income Certificate',
    'Caste Certificate',
    'Previous Year Marksheet',
    'Fee Receipt',
    'Bank Passbook'
  ];

  const handleUpload = async (file: File) => {
    if (!docType) {
      alert('Please select a document type first');
      throw new Error('No document type selected');
    }
    await uploadDocument(file, docType);
    console.log('Document uploaded successfully');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">Upload Document</h3>

        <div className="mb-6">
          <label htmlFor="docType" className="block text-sm font-medium text-gray-700 mb-2">
            Document Type
          </label>
          <select
            id="docType"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
          >
            <option value="">Select a document type</option>
            {docTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className={!docType ? 'opacity-50 pointer-events-none' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            File
          </label>
          <FileUpload onUpload={handleUpload} accept=".pdf,.jpg,.jpeg,.png" maxSizeMB={2} />
        </div>
      </div>
    </div>
  );
};
