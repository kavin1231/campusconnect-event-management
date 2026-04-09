import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../layouts/AuthLayout'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Overview from '../pages/Overview'
import MyEvents from '../pages/MyEvents'
import ConflictCalendar from '../pages/ConflictCalendar'
import Venues from '../pages/Venues'
import Vendor from '../pages/Vendor'
import Sponsorship from '../pages/Sponsorship'
import Stall from '../pages/Stall'
import Staffing from '../pages/Staffing'
import MyRequests from '../pages/MyRequests'
import About from '../pages/About'
import PresidentProfile from '../pages/PresidentProfile'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/overview" replace /> : children
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/overview" replace />} />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthLayout>
              <Login />
            </AuthLayout>
          </PublicRoute>
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/overview"    element={<Overview />} />
        <Route path="/dashboard"   element={<Dashboard />} />
        <Route path="/my-events"   element={<MyEvents />} />
        <Route path="/conflict-calendar" element={<ConflictCalendar />} />
        <Route path="/venues"      element={<Venues />} />
        <Route path="/vendor"      element={<Vendor />} />
        <Route path="/sponsorship" element={<Sponsorship />} />
        <Route path="/stall"       element={<Stall />} />
        <Route path="/staffing"    element={<Staffing />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/about"       element={<About />} />
        <Route path="/profile"     element={<PresidentProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/overview" replace />} />
    </Routes>
  )
}
