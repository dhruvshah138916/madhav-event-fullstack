import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg glass-navbar fixed-top">
      <div className="container">
        <NavLink to="/" className="navbar-brand brand">
          <span className="brand-mark">
            <i className="bi bi-ticket-perforated-fill"></i>
          </span>
          Madhav<span className="brand-accent">Event</span>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            
            {user?.role != 'organizer' && (
              <li className="nav-item">
                <NavLink to="/" end className="nav-link">Events</NavLink>
              </li>
            )}

            {/* User panel link - attendees only */}
            {user?.role === 'attendee' && (
              <li className="nav-item">
                <NavLink to="/dashboard" className="nav-link">Dashboard</NavLink>
              </li>
            )}

            {/* Admin panel links - organizers only */}
            {user?.role === 'organizer' && (
              <>
                <li className="nav-item">
                  <NavLink to="/organizer" className="nav-link">Manage Events</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/reports" className="nav-link">Reports</NavLink>
                </li>
              </>
            )}

            {!user ? (
              <>
                <li className="nav-item ms-lg-2">
                  <NavLink to="/login" className="btn btn-outline-glass btn-sm">Log in</NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/register" className="btn btn-primary-glass btn-sm">Sign up</NavLink>
                </li>
              </>
            ) : (
              <li className="nav-item dropdown ms-lg-2">
                <button
                  className="btn btn-outline-glass btn-sm dropdown-toggle d-flex align-items-center gap-2"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span className="avatar-dot">{user.name?.charAt(0).toUpperCase()}</span>
                  {user.name?.split(' ')[0]}
                </button>
                <ul className="dropdown-menu dropdown-menu-end glass-dropdown">
                  <li><span className="dropdown-item-text small text-muted-light">{user.email}</span></li>
                  <li><span className="dropdown-item-text small text-muted-light text-capitalize">{user.role}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" type="button" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>Log out
                    </button>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
