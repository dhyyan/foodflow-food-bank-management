import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { ROUTES } from '../../constants/routes';
import { getRoleDefaultRoute, type UserRoleType } from '../../constants/roles';
import { Sidebar } from '../../components/layout/Sidebar/Sidebar';
import { Header } from '../../components/layout/Header/Header';

interface ProtectedRouteProps {
  allowedRoles?: UserRoleType[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return <Navigate to={ROUTES.USER_LOGIN} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const hasRole = allowedRoles.includes(user.role as UserRoleType);
    if (!hasRole) {
      const defaultRoute = getRoleDefaultRoute(user.role);
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header />
        <Outlet />
      </div>
    </div>
  );
};
