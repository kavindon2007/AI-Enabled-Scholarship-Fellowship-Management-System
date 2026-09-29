import React from 'react';

export const GrievanceList: React.FC = () => {
  const grievances = [
    { id: 'GRV-12345', category: 'Payment not received', status: 'In Progress', date: '2026-09-10' },
    { id: 'GRV-67890', category: 'Technical issue', status: 'Resolved', date: '2026-08-20' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h2 className="text-xl font-semibold text-gray-900">Your Grievances</h2>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {grievances.map((g) => (
            <li key={g.id}>
              <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-blue-600 truncate">{g.category}</p>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      g.status === 'Resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {g.status}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex text-sm text-gray-500">
                    <p className="flex items-center">
                      <span className="font-medium mr-2">Ticket ID:</span> {g.id}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <p>Submitted on <time dateTime={g.date}>{g.date}</time></p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {grievances.length === 0 && (
          <div className="text-center py-8 text-gray-500">No grievances found.</div>
        )}
      </div>
    </div>
  );
};
