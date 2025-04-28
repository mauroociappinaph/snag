import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/hooks/useAuth';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';

import Footer from './components/Footer';
import { ROUTES } from './lib/constants/routes';
import DashboardPage from './pages/DashboardPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Router>
      <div className="font-sans min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to={ROUTES.HOME} />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;


