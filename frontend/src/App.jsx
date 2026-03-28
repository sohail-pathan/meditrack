import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import RoleRoute from './routes/RoleRoute'

import Login from './pages/Login'
import Register from './pages/Register'
import PatientDashboard from './pages/PatientDashboard'
import DoctorDashboard from './pages/DoctorDashboard'
import AdminDashboard from './pages/AdminDashboard'
import EmergencyPage from './pages/EmergencyPage'
import UploadRecord from './pages/UploadRecord'

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🚫</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-6">You don't have permission to view this page.</p>
        <a href="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition inline-block">
          Go to Login
        </a>
      </div>
    </div>
  )
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center">
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <a href="/"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition inline-block">
          Go Home
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/emergency/:qrToken" element={<EmergencyPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Patient routes */}
          <Route path="/patient" element={
            <RoleRoute roles={['PATIENT']}>
              <PatientDashboard />
            </RoleRoute>
          } />
          <Route path="/patient/upload" element={
            <RoleRoute roles={['PATIENT']}>
              <UploadRecord />
            </RoleRoute>
          } />

          {/* Doctor routes */}
          <Route path="/doctor" element={
            <RoleRoute roles={['DOCTOR']}>
              <DoctorDashboard />
            </RoleRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={
            <RoleRoute roles={['ADMIN']}>
              <AdminDashboard />
            </RoleRoute>
          } />

          {/* Default redirects */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
