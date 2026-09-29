import React from 'react';

export const PaymentHistory: React.FC = () => {
  const payments = [
    {
      id: 'pay-1',
      date: '2025-10-15',
      amount: 5000,
      schemeName: 'Pre-Matric Scholarship',
      status: 'Success',
      referenceNumber: 'DBT123456789'
    },
    {
      id: 'pay-2',
      date: '2024-10-10',
      amount: 5000,
      schemeName: 'Pre-Matric Scholarship',
      status: 'Success',
      referenceNumber: 'DBT987654321'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {payments.map((payment) => (
            <li key={payment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{payment.schemeName}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      payment.status === 'Success' ? 'bg-green-100 text-green-800' :
                      payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex text-sm text-gray-500">
                    <p className="flex items-center">
                      <span className="font-semibold text-gray-900 mr-2">Amount:</span> ₹{payment.amount}
                    </p>
                    <p className="mt-2 flex items-center sm:mt-0 sm:ml-6">
                      <span className="font-semibold text-gray-900 mr-2">Ref No:</span> {payment.referenceNumber}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>
                      Disbursed on <time dateTime={payment.date}>{new Date(payment.date).toLocaleDateString()}</time>
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {payments.length === 0 && (
          <div className="text-center py-10 text-gray-500">No payment records found.</div>
        )}
      </div>
    </div>
  );
};
