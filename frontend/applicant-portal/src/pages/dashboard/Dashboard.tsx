import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useApplications } from '../../hooks/useApplications';
import { useSchemes } from '../../hooks/useSchemes';
import { SchemeSelector } from '../../components/forms/SchemeSelector';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { applications, loading: appsLoading } = useApplications();
  const { schemes, loading: schemesLoading } = useSchemes();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name || 'User'}</h1>
        <p className="text-gray-600 mt-1">Manage your applications and track status.</p>
      </div>

      {!user?.isBankSeeded && (
        <div className="mb-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your Aadhaar is not seeded with any bank account. Direct Benefit Transfer (DBT) payments require an Aadhaar-seeded bank account. Please visit your bank branch to seed Aadhaar.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {/* Status Cards */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Active Applications</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{appsLoading ? '...' : applications.length}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Disbursed</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">₹0</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pending Actions</dt>
            <dd className="mt-1 text-3xl font-semibold text-red-600">0</dd>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Discover Schemes</h2>
        {schemesLoading ? (
          <p className="text-gray-500">Loading schemes...</p>
        ) : (
          <SchemeSelector
            schemes={schemes as any}
            onSelect={(id) => console.log('Navigate to apply for', id)}
          />
        )}
      </div>
    </div>
  );
};
