import { useEffect, useMemo, useState } from 'react'
import { useBookings } from '../context/BookingContext.jsx'
import { useEvents } from '../context/EventContext.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Reports() {
  const { bookings, refreshAll } = useBookings()
  const { events } = useEvents()
  const [emailNotifications, setEmailNotifications] = useState(true)

  useEffect(() => {
    refreshAll().catch((err) => console.error('Failed to load bookings:', err.message))
  }, [])

  const summary = useMemo(() => {
    const totalRevenue = bookings.reduce((s, b) => s + b.totalPrice, 0)
    const totalSeats = bookings.reduce((s, b) => s + b.seats, 0)
    const perEvent = events.map((ev) => {
      const evBookings = bookings.filter((b) => b.eventId === ev.id)
      return {
        title: ev.title,
        bookings: evBookings.length,
        seats: evBookings.reduce((s, b) => s + b.seats, 0),
        revenue: evBookings.reduce((s, b) => s + b.totalPrice, 0),
      }
    })
    return { totalRevenue, totalSeats, perEvent }
  }, [bookings, events])

  return (
    <div className="container py-5 mt-5 pt-4">
      <div className="mb-4">
        <p className="eyebrow mb-1">Reports & notifications</p>
        <h1 className="h4 fw-bold mb-0">Registration summaries and confirmations</h1>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <GlassCard className="p-4">
            <p className="stat-label mb-1">Total bookings</p>
            <p className="stat-value mb-0">{bookings.length}</p>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="p-4">
            <p className="stat-label mb-1">Seats registered</p>
            <p className="stat-value mb-0">{summary.totalSeats}</p>
          </GlassCard>
        </div>
        <div className="col-md-4">
          <GlassCard className="p-4">
            <p className="stat-label mb-1">Total revenue</p>
            <p className="stat-value mb-0">₹{summary.totalRevenue}</p>
          </GlassCard>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <GlassCard className="p-4">
            <h2 className="h6 fw-bold mb-3">Event-wise report</h2>
            <div className="table-responsive">
              <table className="table table-glass align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ color: '#EEEEEE' }}>Event</th>
                    <th style={{ color: '#EEEEEE' }}>Bookings</th>
                    <th style={{ color: '#EEEEEE' }}>Seats</th>
                    <th style={{ color: '#EEEEEE' }}>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.perEvent.map((row) => (
                    <tr key={row.title}>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{row.title}</td>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{row.bookings}</td>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{row.seats}</td>
                      <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>₹{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-5">
          <GlassCard className="p-4 mb-4">
            <h2 className="h6 fw-bold mb-3">Notification settings</h2>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <div>
                <p className="mb-0 fw-semibold small">Email booking confirmations</p>
                <p className="mb-0 text-muted-light small">Send a receipt to attendees automatically</p>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={() => setEmailNotifications((v) => !v)}
                />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <h2 className="h6 fw-bold mb-3">Recent confirmations</h2>
            {bookings.length === 0 ? (
              <p className="small text-muted-light mb-0">No confirmations sent yet.</p>
            ) : (
              <ul className="list-unstyled mb-0 notification-list">
                {bookings.slice(0, 6).map((b) => (
                  <li key={b.id} className="d-flex align-items-start gap-2 mb-3">
                    <i className="bi bi-envelope-check-fill notification-icon"></i>
                    <div>
                      <p className="mb-0 small fw-semibold">{b.eventTitle}</p>
                      <p className="mb-0 small text-muted-light">
                        Confirmation sent to {b.userEmail} · {b.seats} seat(s)
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
