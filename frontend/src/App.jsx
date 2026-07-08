import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import EventDetails from './pages/EventDetails.jsx'
import Booking from './pages/Booking.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminEvents from './pages/AdminEvents.jsx'
import Reports from './pages/Reports.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route
            path="/events/:id/book"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation/:id"
            element={
              <ProtectedRoute>
                <Confirmation />
              </ProtectedRoute>
            }
          />

          {/* User panel - attendees only */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute role="attendee">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin panel - organizers only */}
          <Route
            path="/organizer"
            element={
              <ProtectedRoute role="organizer">
                <AdminEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute role="organizer">
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
