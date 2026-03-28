import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Agents from './pages/Agents';
import Placeholder from './pages/Placeholder';
import './styles.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/agents" element={<ProtectedRoute><Agents /></ProtectedRoute>} />
          <Route path="/inspectors" element={<ProtectedRoute><Placeholder title="Inspectors" /></ProtectedRoute>} />
          <Route path="/properties" element={<ProtectedRoute><Placeholder title="Properties" /></ProtectedRoute>} />
          <Route path="/inspections" element={<ProtectedRoute><Placeholder title="Inspections" /></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><Placeholder title="Reports" /></ProtectedRoute>} />
          <Route path="/audit-logs" element={<ProtectedRoute><Placeholder title="Audit Logs" /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Placeholder title="Settings" /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
