import React from 'react';

export const SeedingAlert: React.FC<{ isSeeded: boolean }> = ({ isSeeded }) => {
  if (isSeeded) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700">
              Your Aadhaar is successfully seeded with your bank account. You are ready to receive DBT payments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Action Required: Aadhaar Seeding</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Your Aadhaar is not seeded with any bank account. Direct Benefit Transfer (DBT) payments require an Aadhaar-seeded bank account.
            </p>
            <p className="mt-2 font-medium">Steps to resolve:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Visit your nearest bank branch where you have an account.</li>
              <li>Submit an Aadhaar seeding form along with a copy of your Aadhaar card.</li>
              <li>Once processed by the bank, NPCI will update your status in 2-3 working days.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
