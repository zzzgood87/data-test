import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BuildingDetail from './pages/BuildingDetail';
import BuildingForm from './pages/BuildingForm';
import UnitForm from './pages/UnitForm';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (로그인 후에는 접근 불가)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/new"
        element={
          <ProtectedRoute>
            <BuildingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/:id"
        element={
          <ProtectedRoute>
            <BuildingDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/:id/edit"
        element={
          <ProtectedRoute>
            <BuildingForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buildings/:buildingId/units/new"
        element={
          <ProtectedRoute>
            <UnitForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/units/:id/edit"
        element={
          <ProtectedRoute>
            <UnitForm />
          </ProtectedRoute>
        }
      />

      {/* 404 - Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
