import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardPage } from '../pages/DashboardPage';
import { InputPage } from '../pages/InputPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { SuppliersPage } from '../pages/SuppliersPage';
import { RFQPage } from '../pages/RFQPage';
import { QuotationPage } from '../pages/QuotationPage';
import { ContractPage } from '../pages/ContractPage';
import { QCPage } from '../pages/QCPage';
import { HarvestPlannerPage } from '../pages/HarvestPlannerPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { SummaryPage } from '../pages/SummaryPage';
import { PlanPage } from '../pages/PlanPage';
import { QuickPlanPage } from '../pages/QuickPlanPage';
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
 * - /input - Input project data (legacy)
 * - /onboarding - Onboarding wizard (new)
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
    path: '/onboarding',
    element: <OnboardingPage />,
  },
  {
    path: '/suppliers',
    element: <SuppliersPage />,
  },
  {
    path: '/rfq',
    element: <RFQPage />,
  },
  {
    path: '/rfq/:id/quotation',
    element: <QuotationPage />,
  },
  {
    path: '/contract/:id',
    element: <ContractPage />,
  },
  {
    path: '/qc/:orderId',
    element: <QCPage />,
  },
  {
    path: '/harvest',
    element: <HarvestPlannerPage />,
  },
  {
    path: '/notifications',
    element: <NotificationsPage />,
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
    path: '/quick-plan',
    element: <QuickPlanPage />,
  },
  {
    path: '/showcase',
    element: <UIShowcase />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

