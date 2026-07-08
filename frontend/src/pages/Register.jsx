import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GlassCard from '../components/GlassCard.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Register() {
  const { register, login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'attendee' })
  const [error, setError] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) {
      setError('Password should be at least 6 characters.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    try {
      await register(form)
      const loggedInUser = await login(form.email, form.password)
      navigate(loggedInUser.role === 'organizer' ? '/organizer' : '/dashboard')
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
                <h1 className="h4 fw-bold mb-1">Create your account</h1>
                <p className="text-muted-light small mb-0">Register to book tickets or host events</p>
              </div>

              {error && <div className="alert alert-glass-danger py-2 small">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small">Full name</label>
                  <input
                    className="form-control glass-input"
                    name="name"
                    required
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
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
                <div className="row">
                  <div className="col-6 mb-3">
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
                  <div className="col-6 mb-3">
                    <label className="form-label small">Confirm</label>
                    <input
                      type="password"
                      className="form-control glass-input"
                      name="confirm"
                      required
                      placeholder="••••••••"
                      value={form.confirm}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small d-block">I am registering as</label>
                  <div className="role-toggle">
                    <button
                      type="button"
                      className={`role-btn ${form.role === 'attendee' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, role: 'attendee' })}
                    >
                      <i className="bi bi-person-fill me-1"></i> Attendee
                    </button>
                    <button
                      type="button"
                      className={`role-btn ${form.role === 'organizer' ? 'active' : ''}`}
                      onClick={() => setForm({ ...form, role: 'organizer' })}
                    >
                      <i className="bi bi-megaphone-fill me-1"></i> Organizer
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn btn-primary-glass w-100 mt-2">
                  Create account
                </button>
              </form>

              <p className="text-center small text-muted-light mt-4 mb-0">
                Already have an account? <Link to="/login">Log in</Link>
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
