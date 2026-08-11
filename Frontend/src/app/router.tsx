import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { LoginPage } from '../pages/auth/LoginPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { UserManagementPage } from '../pages/users/UserManagementPage';
import { LotsPage } from '../pages/lots/LotsPage';
import { DonationsPage } from '../pages/donations/DonationsPage';
import { DistributionsPage } from '../pages/distributions/DistributionsPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <LoginPage />
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <AdminDashboardPage />
      },
      {
        path: ROUTES.USERS,
        element: <UserManagementPage />
      },
      {
        path: ROUTES.LOTS,
        element: <LotsPage />
      },
      {
        path: ROUTES.DONATIONS,
        element: <DonationsPage />
      },
      {
        path: ROUTES.DISTRIBUTIONS,
        element: <DistributionsPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />
  }
]);
