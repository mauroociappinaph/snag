import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './components/Layout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { ROUTES } from './lib/constants/routes';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Create router with future flag enabled
const router = {
  future: {
    v7_relativeSplatPath: true
  }
};

function App() {
  return (
    <Router future={router.future}>
      <Routes>
        <Route element={<Layout />}>
          {/* Rutas públicas */}
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

          {/* Rutas protegidas - Accesibles por cualquier usuario autenticado */}
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Solo para clientes */}
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Solo para negocios */}
          <Route
            path={ROUTES.BUSINESS_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={['business']}>
                <BusinessDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas - Solo para administradores */}
          <Route
            path={ROUTES.ADMIN_DASHBOARD}
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta por defecto - Redirige a home */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;


