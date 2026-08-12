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
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ServerErrorPage } from '../pages/error/ServerErrorPage';
import { BadRequestPage } from '../pages/error/BadRequestPage';
import { ErrorElementPage } from '../pages/error/ErrorElementPage';

export const router = createBrowserRouter([
  {
    errorElement: <ErrorElementPage />,
    children: [
      // Root redirect to Login
      {
        path: '/',
        element: <Navigate to={ROUTES.USER_LOGIN} replace />
      },

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

      // Dedicated Status Error Pages
      {
        path: ROUTES.NOT_FOUND,
        element: <NotFoundPage />
      },
      {
        path: ROUTES.SERVER_ERROR,
        element: <ServerErrorPage />
      },
      {
        path: ROUTES.BAD_REQUEST,
        element: <BadRequestPage />
      },

      // Catch-all route -> 404 Page Not Found
      {
        path: '*',
        element: <NotFoundPage />
      }
    ]
  }
]);
