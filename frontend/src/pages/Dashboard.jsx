import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingContext.jsx'
import { useEvents } from '../context/EventContext.jsx'
import StatCard from '../components/StatCard.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Dashboard() {
  const { user } = useAuth()
  const { bookings, refreshMine } = useBookings()
  const { events } = useEvents()

  useEffect(() => {
    refreshMine().catch((err) => console.error('Failed to load bookings:', err.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const myBookings = bookings

  const totalSpent = myBookings.reduce((sum, b) => sum + b.totalPrice, 0)
  const totalSeats = myBookings.reduce((sum, b) => sum + b.seats, 0)
  const upcoming = myBookings.filter((b) => new Date(b.eventDate) >= new Date())

  const monthly = useMemo(() => {
    const map = {}
    myBookings.forEach((b) => {
      const m = new Date(b.bookedAt).toLocaleString('default', { month: 'short' })
      map[m] = (map[m] || 0) + 1
    })
    return map
  }, [myBookings])

  const maxMonthly = Math.max(1, ...Object.values(monthly))

  return (
    <div className="container py-5 mt-5 pt-4">
      <div className="mb-4">
        <p className="eyebrow mb-1">Your dashboard</p>
        <h1 className="h4 fw-bold mb-0">Welcome back, {user.name.split(' ')[0]}</h1>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <StatCard icon="bi-ticket-perforated" label="Total bookings" value={myBookings.length} accent />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard icon="bi-calendar-check" label="Upcoming events" value={upcoming.length} />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard icon="bi-person-lines-fill" label="Seats booked" value={totalSeats} />
        </div>
        <div className="col-sm-6 col-lg-3">
          <StatCard icon="bi-wallet2" label="Total spent" value={`₹${totalSpent}`} />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <GlassCard className="p-4 h-100">
            <h2 className="h6 fw-bold mb-4">Booking history</h2>
            {myBookings.length === 0 ? (
              <p className="text-muted-light small mb-0">
                No bookings yet. <Link to="/">Browse events</Link> to get started.
              </p>
            ) : (
              <div className="table-responsive">
                <table className="table table-glass align-middle mb-0">
                  <thead>
                    <tr>
                        <th style={{ color: "#EEEEEE" }}>Event</th>
                      <th style={{ color: "#EEEEEE" }}>Date</th>
                      <th style={{ color: "#EEEEEE" }}>Seats</th>
                      <th style={{ color: "#EEEEEE" }}>Total</th>
                      <th style={{ color: "#EEEEEE" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myBookings.map((b) => (
                      <tr key={b.id}>
                        <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{b.eventTitle}</td>
                        <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{new Date(b.eventDate).toLocaleDateString('en-IN')}</td>
                        <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{b.seats}</td>
                        <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}>{b.totalPrice === 0 ? 'Free' : `₹${b.totalPrice}`}</td>
                        <td style={{ color: 'rgba(238, 238, 238, 0.6)' }}><span className="badge status-badge">{b.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>

        <div className="col-lg-5">
          <GlassCard className="p-4 h-100">
            <h2 className="h6 fw-bold mb-4">Bookings by month</h2>
            {Object.keys(monthly).length === 0 ? (
              <p className="text-muted-light small mb-0">Your activity chart will appear here.</p>
            ) : (
              <div className="bar-chart">
                {Object.entries(monthly).map(([month, count]) => (
                  <div className="bar-row" key={month}>
                    <span className="bar-label">{month}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(count / maxMonthly) * 100}%` }}
                      ></div>
                    </div>
                    <span className="bar-count">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
