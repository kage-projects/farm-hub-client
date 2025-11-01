import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { LandingPage } from '../features/landing/LandingPage';
import { AuthPage } from '../features/auth/AuthPage';
import { ProtectedRoute, PublicRoute } from '../features/auth/components';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { InputPage } from '../pages/InputPage';
import { OnboardingPage } from '../features/onboarding/OnboardingPage';
import { ProjectResultPage } from '../features/onboarding/ProjectResultPage';
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
 * Public routes (bisa diakses semua):
 * - / - Landing page (bisa diakses semua)
 * - /showcase - UI showcase (development)
 * 
 * Public routes (hanya untuk user belum login):
 * - /login - Login page (redirect ke dashboard jika sudah login)
 * - /register - Register page (redirect ke dashboard jika sudah login)
 * 
 * Protected routes (hanya untuk user sudah login):
 * - /dashboard - Main dashboard
 * - /input - Input project data (legacy)
 * - /onboarding - Onboarding wizard (new)
 * - /summary - Generate summary
 * - /plan - Complete plan with submenus
 * - /quick-plan - Quick plan generator
 * - /suppliers - Supplier directory
 * - /rfq - RFQ management
 * - /rfq/:id/quotation - Quotation page
 * - /contract/:id - Contract page
 * - /qc/:orderId - QC page
 * - /harvest - Harvest planner
 * - /notifications - Notifications
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/input',
    element: (
      <ProtectedRoute>
        <InputPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/result',
    element: (
      <ProtectedRoute>
        <ProjectResultPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/onboarding/result/:id',
    element: (
      <ProtectedRoute>
        <ProjectResultPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/suppliers',
    element: (
      <ProtectedRoute>
        <SuppliersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rfq',
    element: (
      <ProtectedRoute>
        <RFQPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/rfq/:id/quotation',
    element: (
      <ProtectedRoute>
        <QuotationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/contract/:id',
    element: (
      <ProtectedRoute>
        <ContractPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/qc/:orderId',
    element: (
      <ProtectedRoute>
        <QCPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/harvest',
    element: (
      <ProtectedRoute>
        <HarvestPlannerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/notifications',
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/summary',
    element: (
      <ProtectedRoute>
        <SummaryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plan',
    element: (
      <ProtectedRoute>
        <PlanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/quick-plan',
    element: (
      <ProtectedRoute>
        <QuickPlanPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/showcase',
    element: <UIShowcase />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

