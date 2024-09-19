import PropTypes from 'prop-types';
import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/loading-screen';
import { useAuthContext } from './useAuthContext';

AuthGuard.propTypes = {
  children: PropTypes.node,
};

export default function AuthGuard({ children }) {
  const { isAuthenticated, isInitialized, user } = useAuthContext();
  const { pathname } = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if (!isInitialized) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    if (pathname !== requestedLocation) {
      setRequestedLocation(pathname);
    }
    return <Navigate to="/auth/login" />;
  }

  if (requestedLocation && pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  // // Redirect users based on their roles
  // if (user.role === 'admin' && !pathname.startsWith('/admin-dashboard')) {
  //   return <Navigate to="/admin-dashboard" />;
  // }

  // if (user.role === 'operations' && !pathname.startsWith('/operations-dashboard')) {
  //   return <Navigate to="/operations-dashboard" />;
  // }

  return <>{children}</>;
}
