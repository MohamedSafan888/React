import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute      from './RoleRoute'
import AuthLayout      from '../layouts/AuthLayout'
import MainLayout      from '../layouts/MainLayout'
import DashboardLayout from '../layouts/DashboardLayout'

// Auth (eager)
import Login    from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Lazy
const DoctorSearch       = lazy(() => import('../pages/patient/DoctorSearch'))
const DoctorProfile      = lazy(() => import('../pages/patient/DoctorProfile'))
const Booking            = lazy(() => import('../pages/patient/Booking'))
const PatientDashboard   = lazy(() => import('../pages/patient/PatientDashboard'))
const DoctorDashboard    = lazy(() => import('../pages/doctor/DoctorDashboard'))
const ScheduleManagement = lazy(() => import('../pages/doctor/ScheduleManagement'))
const AdminDashboard     = lazy(() => import('../pages/admin/AdminDashboard'))
const UsersManagement    = lazy(() => import('../pages/admin/UsersManagement'))
const ConfigManagement   = lazy(() => import('../pages/admin/ConfigManagement'))
const Profile            = lazy(() => import('../pages/Profile'))
const NotFound           = lazy(() => import('../pages/NotFound'))

const Loader = () => (
  <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh'}}>
    <CircularProgress />
  </Box>
)

export default function AppRoutes() {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/"            element={<Navigate to="/doctors" replace />} />
          <Route path="/doctors"     element={<DoctorSearch />} />
          <Route path="/doctors/:id" element={<DoctorProfile />} />
        </Route>

        {/* Protected: shared */}
        <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Patient */}
        <Route element={<ProtectedRoute><RoleRoute roles={['patient']}><DashboardLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/patient/dashboard"  element={<PatientDashboard />} />
          <Route path="/doctors/:id/book"   element={<Booking />} />
        </Route>

        {/* Doctor */}
        <Route element={<ProtectedRoute><RoleRoute roles={['doctor']}><DashboardLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/schedule"  element={<ScheduleManagement />} />
        </Route>

        {/* Admin */}
        <Route element={<ProtectedRoute><RoleRoute roles={['admin']}><DashboardLayout /></RoleRoute></ProtectedRoute>}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users"     element={<UsersManagement />} />
          <Route path="/admin/config"    element={<ConfigManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
