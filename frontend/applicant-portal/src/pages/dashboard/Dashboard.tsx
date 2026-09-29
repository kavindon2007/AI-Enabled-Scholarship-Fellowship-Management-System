import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  FileText, CheckCircle, AlertTriangle, Upload, 
  CreditCard, ShieldAlert, ArrowRight, Clock, FileWarning
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  
  // DEMO MODE FIXTURES
  const demoState = {
    profileComplete: 85,
    aadhaarSeeded: false,
    activeApplications: [
      { id: 'APP-DEMO-0001', scheme: 'National Fellowship for ST Students', status: 'Under Scrutiny', date: '2026-08-15' }
    ],
    pendingActions: [
      { id: 'ACT-1', title: 'Upload Missing Income Certificate', link: '/documents', urgent: true },
      { id: 'ACT-2', title: 'Seed Aadhaar with Bank Account', link: '/profile', urgent: true }
    ],
    documents: { total: 5, verified: 3, pending: 2, rejected: 0 },
    payments: { totalAmount: 45000, nextExpected: '2026-10-15' },
    notifications: [
      { id: 1, title: 'Application passed preliminary scrutiny', date: '2 days ago' },
      { id: 2, title: 'Please update your bank details', date: '1 week ago' }
    ]
  };

  return (
    <div className="w-full">
      {/* Dashboard Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gov-blue font-heading">Applicant Dashboard</h1>
              <p className="text-gov-textMuted mt-1">Welcome back, {user?.name || 'Demo Applicant'}. Manage your applications and track status.</p>
            </div>
            <div className="flex items-center space-x-2 bg-blue-50 text-gov-blue px-4 py-2 rounded border border-blue-100">
              <span className="font-semibold text-sm">Profile Completeness:</span>
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gov-green" style={{ width: `${demoState.profileComplete}%` }}></div>
              </div>
              <span className="text-sm font-bold ml-1">{demoState.profileComplete}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        
        {/* Alerts Area */}
        {!demoState.aadhaarSeeded && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-sm">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-red-500 mr-3 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-red-800">Bank Seeding Required for DBT</h3>
                <p className="text-sm text-red-700 mt-1">
                  Your Aadhaar is not seeded with any bank account. Direct Benefit Transfer (DBT) payments require an Aadhaar-seeded bank account. Please visit your bank branch to seed Aadhaar or your scholarship payment will fail.
                </p>
                <Link to="/profile" className="text-sm font-bold text-red-800 underline mt-2 inline-block">Update Bank Details</Link>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Area - Left Column (span 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Actions Grid */}
            <div className="bg-white rounded-gov shadow-gov border border-gov-border p-5">
              <h2 className="text-lg font-bold text-gray-800 mb-4 font-heading border-b pb-2">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <QuickAction icon={<FileText />} label="Apply for Scheme" to="/schemes" color="bg-blue-50 text-gov-blue" />
                <QuickAction icon={<Upload />} label="Upload Document" to="/documents" color="bg-indigo-50 text-indigo-700" />
                <QuickAction icon={<CheckCircle />} label="Scan with AI OCR" to="/ocr-demo" color="bg-orange-50 text-gov-orange" />
                <QuickAction icon={<Clock />} label="Track Application" to="/applications" color="bg-green-50 text-green-700" />
                <QuickAction icon={<CreditCard />} label="Payment Status" to="/disbursements" color="bg-purple-50 text-purple-700" />
                <QuickAction icon={<ShieldAlert />} label="Raise Grievance" to="/grievances" color="bg-red-50 text-red-700" />
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-gov shadow-gov border border-gov-border overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 font-heading">Active Applications</h2>
                <Link to="/applications" className="text-sm text-gov-blue font-medium hover:underline">View All</Link>
              </div>
              <div className="divide-y divide-gray-200">
                {demoState.activeApplications.map(app => (
                  <div key={app.id} className="p-5 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{app.id}</span>
                        <h3 className="font-bold text-gov-blue mt-1">{app.scheme}</h3>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold border border-blue-200">
                        {app.status}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-4">
                      <span className="mr-4">Submitted: {app.date}</span>
                      <Link to={`/applications/${app.id}`} className="text-gov-blue font-medium hover:underline flex items-center ml-auto">
                        Track Status <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
                {demoState.activeApplications.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    <p>No active applications found.</p>
                    <Link to="/schemes" className="text-gov-blue font-medium mt-2 inline-block">Apply for a scholarship</Link>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-gov shadow-gov border border-gov-border overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800 font-heading">Payment Summary</h2>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 uppercase font-bold tracking-wide">Total Disbursed (2026-27)</p>
                  <p className="text-3xl font-bold text-gov-green mt-1">₹{demoState.payments.totalAmount.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 mt-1">Next Expected: {demoState.payments.nextExpected}</p>
                </div>
                <CreditCard className="w-12 h-12 text-gray-200" />
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                <Link to="/disbursements" className="text-sm text-gov-blue font-medium hover:underline">View Payment History</Link>
              </div>
            </div>

          </div>

          {/* Sidebar Area - Right Column */}
          <div className="space-y-6">
            
            {/* Pending Actions */}
            <div className="bg-white rounded-gov shadow-gov border border-orange-200 overflow-hidden">
              <div className="px-5 py-4 border-b border-orange-100 bg-orange-50">
                <h2 className="text-lg font-bold text-orange-800 font-heading flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Action Required
                </h2>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {demoState.pendingActions.map(action => (
                  <li key={action.id} className="p-3">
                    <Link to={action.link} className="flex items-start group">
                      <div className="bg-orange-100 p-1.5 rounded-full mr-3 text-orange-600 mt-0.5">
                        <FileWarning className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-gov-blue transition-colors">
                          {action.title}
                        </p>
                        <p className="text-xs font-bold text-red-600 mt-1">Complete Now &rarr;</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Document Status */}
            <div className="bg-white rounded-gov shadow-gov border border-gov-border">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-800 font-heading">Document Locker</h2>
                <Link to="/documents" className="text-sm text-gov-blue font-medium hover:underline">Manage</Link>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded border border-green-100">
                    <div className="text-2xl font-bold text-green-700">{demoState.documents.verified}</div>
                    <div className="text-xs font-bold text-green-600 uppercase mt-1">Verified</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded border border-yellow-100">
                    <div className="text-2xl font-bold text-yellow-700">{demoState.documents.pending}</div>
                    <div className="text-xs font-bold text-yellow-600 uppercase mt-1">Pending Review</div>
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <Link to="/ocr-demo" className="text-sm font-bold text-gov-orange hover:underline flex items-center justify-center">
                    <Upload className="w-4 h-4 mr-1" /> Use AI Scanner to add more
                  </Link>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-gov shadow-gov border border-gov-border">
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                <h2 className="text-lg font-bold text-gray-800 font-heading">Recent Updates</h2>
              </div>
              <ul className="divide-y divide-gray-100 p-2">
                {demoState.notifications.map(notif => (
                  <li key={notif.id} className="p-3">
                    <p className="text-sm text-gray-800 font-medium">{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.date}</p>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon, label, to, color }: { icon: React.ReactNode, label: string, to: string, color: string }) => (
  <Link to={to} className={`flex flex-col items-center justify-center p-4 rounded border border-gray-100 hover:border-gray-300 transition-all hover:shadow-md ${color.replace('text-', 'bg-white hover:bg-').split(' ')[0]} bg-white group`}>
    <div className={`p-3 rounded-full mb-2 ${color} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <span className="text-xs font-bold text-center text-gray-700 group-hover:text-gray-900">{label}</span>
  </Link>
);
