import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ROUTES } from '../../constants/routes';
import { getRoleDefaultRoute } from '../../constants/roles';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.USER_LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If role is not allowed for this route, redirect to user's role default portal route
    const defaultRoute = getRoleDefaultRoute(user.role);
    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
