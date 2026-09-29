import React from 'react';

export const DocumentViewer: React.FC<{ url?: string; name?: string }> = ({ url, name }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">{name || 'Document Viewer'}</h3>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-4 rounded border border-gray-300">
            Download
          </button>
        </div>
        <div className="px-4 py-5 sm:p-6 bg-gray-50 flex justify-center items-center min-h-[500px]">
          {url ? (
            <iframe src={url} className="w-full h-[500px] border-0" title={name} />
          ) : (
            <div className="text-gray-500 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No document selected for viewing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
