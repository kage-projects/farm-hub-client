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
import { PlanDetailPage } from '../pages/PlanDetailPage';
import { QuickPlanPage } from '../pages/QuickPlanPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderTrackingPage } from '../pages/OrderTrackingPage';
import { RoadmapExecutionPage } from '../pages/RoadmapExecutionPage';
import { SupplierSelectionReviewPage } from '../pages/SupplierSelectionReviewPage';
import { UIShowcase } from '../pages/UIShowcase';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';

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
 * - /forgot-password - Forgot password page
 * 
 * Protected routes (hanya untuk user sudah login):
 * - /dashboard - Main dashboard
 * - /input - Input project data (legacy)
 * - /onboarding - Onboarding wizard (new)
 * - /onboarding/result - Project result page (with state)
 * - /onboarding/result/:id - Project result page (by ID)
 * - /summary - Generate summary
 * - /plan - Complete plan with submenus
 * - /plan-detail/:id - Plan detail page with streaming SSE
 * - /quick-plan - Quick plan generator
 * - /suppliers - Supplier directory
 * - /rfq - RFQ management
 * - /rfq/:id/quotation - Quotation page (multi-select suppliers)
 * - /rfq/:id/quotation/review - Review selected suppliers
 * - /contract/:id - Contract page
 * - /checkout - Checkout page for marketplace purchase
 * - /order/:id - Order tracking page
 * - /qc/:orderId - QC page
 * - /roadmap/:projectId/execute - Roadmap execution page (step-by-step)
 * - /harvest - Harvest planner
 * - /notifications - Notifications
 * 
 * Error routes:
 * - * - 404 Not Found page (catch-all)
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
    path: '/forgot-password',
    element: (
      <PublicRoute>
        <ForgotPasswordPage />
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
    path: '/rfq/:id/quotation/review',
    element: (
      <ProtectedRoute>
        <SupplierSelectionReviewPage />
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
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/order/:id',
    element: (
      <ProtectedRoute>
        <OrderTrackingPage />
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
    path: '/roadmap/:projectId/execute',
    element: (
      <ProtectedRoute>
        <RoadmapExecutionPage />
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
    path: '/plan-detail/:id',
    element: (
      <ProtectedRoute>
        <PlanDetailPage />
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
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}

