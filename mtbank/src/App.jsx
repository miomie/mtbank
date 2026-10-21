import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import FamilyRouter from './pages/FamilyRouter';
import ChatPage from './pages/ChatPage';

// Компонент проверки авторизации
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/register" replace />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Экран регистрации в самом начале */}
      <Route path="/register" element={<RegisterPage />} />

      {/* Главная страница */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Вкладка «Семья» — открывает нужный экран согласно роли */}
      <Route
        path="/family"
        element={
          <ProtectedRoute>
            <FamilyRouter />
          </ProtectedRoute>
        }
      />

      {/* Вкладка «Чат» — ИИ-помощник белка */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;