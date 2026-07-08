import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Pass a `role` prop (e.g. role="organizer") to restrict a route to that role.
// A logged-in user with the wrong role gets bounced to their own home page
// instead of seeing a login prompt.
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return null

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    const homeForRole = user.role === 'organizer' ? '/organizer' : '/dashboard'
    return <Navigate to={homeForRole} replace />
  }

  return children
}
