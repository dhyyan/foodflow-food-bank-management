import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { ROLES } from '../constants/roles';
import { AdminLoginPage } from '../pages/auth/AdminLoginPage';
import { UserLoginPage } from '../pages/auth/UserLoginPage';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
import { UserManagementPage } from '../pages/users/UserManagementPage';
import { LotsPage } from '../pages/lots/LotsPage';
import { DonationsPage } from '../pages/donations/DonationsPage';
import { DistributionsPage } from '../pages/distributions/DistributionsPage';

export const router = createBrowserRouter([
  // Public Separate Auth Routes
  {
    path: ROUTES.ADMIN_LOGIN,
    element: <AdminLoginPage />
  },
  {
    path: ROUTES.USER_LOGIN,
    element: <UserLoginPage />
  },

  // Protected Admin Routes (System Admin)
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN]} />,
    children: [
      {
        path: ROUTES.DASHBOARD,
        element: <AdminDashboardPage />
      },
      {
        path: ROUTES.USERS,
        element: <UserManagementPage />
      }
    ]
  },

  // Protected Donation Clerk Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.DONATION_CLERK]} />,
    children: [
      {
        path: ROUTES.DONATIONS,
        element: <DonationsPage />
      }
    ]
  },

  // Protected Stock Manager Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.STOCK_MANAGER]} />,
    children: [
      {
        path: ROUTES.LOTS,
        element: <LotsPage />
      }
    ]
  },

  // Protected Handout Coordinator Routes
  {
    element: <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.HANDOUT_COORDINATOR]} />,
    children: [
      {
        path: ROUTES.DISTRIBUTIONS,
        element: <DistributionsPage />
      }
    ]
  },

  // Catch-all route
  {
    path: '*',
    element: <Navigate to={ROUTES.USER_LOGIN} replace />
  }
]);
