import React from 'react';
import { useAuth } from '../../hooks/useAuth';

export const BankDetails: React.FC = () => {
  const { user } = useAuth();
  const isSeeded = user?.isBankSeeded || false;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bank & DBT Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Status of Aadhaar mapping with NPCI.</p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <div className={`p-4 rounded-md ${isSeeded ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <h4 className="font-semibold mb-2">Aadhaar Seeding Status</h4>
            <p className="text-sm">
              {isSeeded
                ? 'Your Aadhaar is mapped to a bank account with NPCI. You are eligible to receive Direct Benefit Transfers.'
                : 'Your Aadhaar is NOT seeded. Please visit your bank branch and submit an Aadhaar seeding request form to enable DBT.'}
            </p>
          </div>

          {isSeeded && (
            <div className="mt-6 border border-gray-200 rounded-md overflow-hidden">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-gray-50">
                  <dt className="text-sm font-medium text-gray-500">Bank Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">State Bank of India (Pulled from NPCI)</dd>
                </div>
                <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 bg-white">
                  <dt className="text-sm font-medium text-gray-500">Last Seeding Date</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">August 10, 2026</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
