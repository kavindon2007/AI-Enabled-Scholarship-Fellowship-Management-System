import React from 'react';

export const ApplicationTimeline: React.FC = () => {
  const events = [
    { id: 1, content: 'Application submitted', date: 'Sep 1, 2026', status: 'completed' },
    { id: 2, content: 'Institute Nodal Officer Verification', date: 'Sep 10, 2026', status: 'completed' },
    { id: 3, content: 'State/District Nodal Officer Verification', date: 'Pending', status: 'current' },
    { id: 4, content: 'Merit List Generation', date: '-', status: 'upcoming' },
    { id: 5, content: 'Payment Disbursal via PFMS', date: '-', status: 'upcoming' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h3 className="text-xl font-semibold mb-6">Application Tracker</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {events.map((event, eventIdx) => (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== events.length - 1 ? (
                  <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                ) : null}
                <div className="relative flex space-x-3">
                  <div>
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                      event.status === 'completed' ? 'bg-green-500' :
                      event.status === 'current' ? 'bg-blue-500' : 'bg-gray-300'
                    }`}>
                      {event.status === 'completed' ? (
                        <svg className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                    <div>
                      <p className={`text-sm ${event.status === 'upcoming' ? 'text-gray-500' : 'text-gray-900 font-medium'}`}>
                        {event.content}
                      </p>
                    </div>
                    <div className="text-right text-sm whitespace-nowrap text-gray-500">
                      <time dateTime={event.date}>{event.date}</time>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
