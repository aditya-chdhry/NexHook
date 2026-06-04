import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from './adminData';

export default function ProtectedRoute({ children }) {
  if (!isAdminLoggedIn()) return <Navigate to="/admin-login" replace />;
  return children;
}
