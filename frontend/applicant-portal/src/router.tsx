import { createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App';

// Import actual Page components
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { Dashboard } from './pages/dashboard/Dashboard';
import { ApplicationForm as Applications } from './pages/applications/ApplicationForm';
import { ApplicationDetail as ApplicationDetails } from './pages/applications/ApplicationDetail';
import { DocumentLibrary as Documents } from './pages/documents/DocumentLibrary';
import { PaymentHistory as Disbursements } from './pages/disbursements/PaymentHistory';
import { ProfileView as Profile } from './pages/profile/ProfileView';
import { GrievanceList as Grievances } from './pages/grievances/GrievanceList';

const NotFound = () => <div>404 Not Found</div>;

// Protect routes component
import useAuthStore from './store/useAuthStore';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/auth',
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
    ]
  },
  {
    path: '/',
    element: <ProtectedRoute><App /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'applications', element: <Applications /> },
      { path: 'applications/:id', element: <ApplicationDetails /> },
      { path: 'documents', element: <Documents /> },
      { path: 'disbursements', element: <Disbursements /> },
      { path: 'grievances', element: <Grievances /> },
      { path: 'profile', element: <Profile /> },
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);
