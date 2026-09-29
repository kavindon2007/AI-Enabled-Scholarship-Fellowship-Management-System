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
import Home from './pages/public/Home';
import { OCRDemo } from './pages/public/OCRDemo';
import { SchemesDirectory } from './pages/public/SchemesDirectory';

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
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'ocr-demo', element: <OCRDemo /> },
      { path: 'schemes', element: <SchemesDirectory /> },
      { path: 'about', element: <div>About Us (Mocked)</div> },
      { path: 'announcements', element: <div>Announcements (Mocked)</div> },
      { path: 'help', element: <div>Help (Mocked)</div> },
      { path: 'contact', element: <div>Contact (Mocked)</div> },
      {
        path: 'auth',
        children: [
          { path: 'login', element: <Login /> },
          { path: 'register', element: <Register /> },
        ]
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><Dashboard /></ProtectedRoute>
      },
      {
        path: 'applications',
        element: <ProtectedRoute><Applications /></ProtectedRoute>
      },
      {
        path: 'applications/:id',
        element: <ProtectedRoute><ApplicationDetails /></ProtectedRoute>
      },
      {
        path: 'documents',
        element: <ProtectedRoute><Documents /></ProtectedRoute>
      },
      {
        path: 'disbursements',
        element: <ProtectedRoute><Disbursements /></ProtectedRoute>
      },
      {
        path: 'grievances',
        element: <ProtectedRoute><Grievances /></ProtectedRoute>
      },
      {
        path: 'profile',
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: '*',
        element: <NotFound />
      }
    ]
  }
]);
