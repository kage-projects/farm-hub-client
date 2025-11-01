import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InputPage } from '../pages/InputPage';
import { SummaryPage } from '../pages/SummaryPage';
import { PlanPage } from '../pages/PlanPage';
import { UIShowcase } from '../pages/UIShowcase';

/**
 * Application Routes
 * 
 * Public routes:
 * - / - Landing page
 * - /login - Login page
 * - /register - Register page
 * - /showcase - UI showcase (development)
 * 
 * Protected routes (require auth):
 * - /dashboard - Main dashboard
 * - /input - Input project data
 * - /summary - Generate summary
 * - /plan - Complete plan with submenus
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/input',
    element: <InputPage />,
  },
  {
    path: '/summary',
    element: <SummaryPage />,
  },
  {
    path: '/plan',
    element: <PlanPage />,
  },
  {
    path: '/showcase',
    element: <UIShowcase />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

