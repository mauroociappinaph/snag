import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Notifications } from './components/ui/Notifications';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { ROUTES } from './lib/constants/routes';
import { USER_ROLES } from './lib/constants/roles';
import { LoadingSpinner } from './components/ui/LoadingSpinner';


// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const BusinessDashboardPage = lazy(() => import('./pages/BusinessDashboardPage'));
const AppointmentDetailPage = lazy(() => import('./pages/AppointmentDetailPage'));
const BusinessProfilePage = lazy(() => import('./pages/BusinessProfilePage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <Router>
      <Notifications />
      <Layout>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route
              path={ROUTES.PROFILE}
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ADMIN_DASHBOARD}
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUSINESS_DASHBOARD}
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.BUSINESS]}>
                  <BusinessDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.APPOINTMENT_DETAIL}
              element={
                <ProtectedRoute>
                  <AppointmentDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUSINESS_PROFILE}
              element={
                <ProtectedRoute allowedRoles={[USER_ROLES.BUSINESS]}>
                  <BusinessProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Fallback – make sure this is the **last** Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </Router>
  );
}

export default App;


