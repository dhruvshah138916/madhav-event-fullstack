import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const from = location.state?.from?.pathname || '/'

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    try {
      const loggedInUser = await login(form.email, form.password)
      if (location.state?.from) {
        navigate(from, { replace: true })
      } else {
        navigate(loggedInUser.role === 'organizer' ? '/organizer' : '/', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-8 col-md-6 col-lg-5">
            <GlassCard className="p-4 p-md-5 auth-card">
              <div className="text-center mb-4">
                <span className="brand-mark brand-mark-lg mx-auto mb-3">
                  <i className="bi bi-ticket-perforated-fill"></i>
                </span>
                <h1 className="h4 fw-bold mb-1">Welcome back</h1>
                <p className="text-muted-light small mb-0">Log in to book and manage your events</p>
              </div>

              {error && <div className="alert alert-glass-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small">Email address</label>
                  <input
                    type="email"
                    className="form-control glass-input"
                    name="email"
                    required
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small">Password</label>
                  <input
                    type="password"
                    className="form-control glass-input"
                    name="password"
                    required
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary-glass w-100 mt-2">
                  Log in
                </button>
              </form>

              <p className="text-center small text-muted-light mt-4 mb-0">
                New to Madhav Event? <Link to="/register">Create an account</Link>
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
