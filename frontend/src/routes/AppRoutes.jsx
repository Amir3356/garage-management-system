import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Auth pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Client pages
import ClientDashboard from '../pages/client/Dashboard';
import MyVehicles from '../pages/client/MyVehicles';
import BookService from '../pages/client/BookService';
import History from '../pages/client/History';

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard';
import Users from '../pages/admin/Users';
import Services from '../pages/admin/Services';
import Appointments from '../pages/admin/Appointments';
import Mechanics from '../pages/admin/Mechanics';

// Mechanic pages
import MechanicDashboard from '../pages/mechanic/Dashboard';
import Jobs from '../pages/mechanic/Jobs';

const AppRoutes = () => {
  const { isAuthenticated, user, isAdmin, isClient, isMechanic } = useAuth();

  const getDashboardComponent = () => {
    if (isAdmin) return <AdminDashboard />;
    if (isMechanic) return <MechanicDashboard />;
    return <ClientDashboard />;
  };

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/" replace />}
      />
      <Route
        path="/register"
        element={!isAuthenticated ? <Register /> : <Navigate to="/" replace />}
      />

      {/* Protected routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {getDashboardComponent()}
          </ProtectedRoute>
        }
      />

      {/* Client routes */}
      <Route
        path="/vehicles"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <MyVehicles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/book-service"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <BookService />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <History />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Users />
          </ProtectedRoute>
        }
      />
      <Route
        path="/services"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Services />
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Appointments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mechanics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Mechanics />
          </ProtectedRoute>
        }
      />

      {/* Mechanic routes */}
      <Route
        path="/jobs"
        element={
          <ProtectedRoute allowedRoles={['mechanic', 'admin']}>
            <Jobs />
          </ProtectedRoute>
        }
      />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
