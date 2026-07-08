import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useBookings } from '../context/BookingContext.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Confirmation() {
  const { id } = useParams()
  const { getBooking } = useBookings()
  const [booking, setBooking] = useState(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let active = true
    getBooking(id)
      .then((data) => {
        if (active) setBooking(data)
      })
      .catch(() => {
        if (active) setNotFound(true)
      })
    return () => {
      active = false
    }
  }, [id])

  if (notFound) {
    return (
      <div className="container py-5 mt-5">
        <GlassCard className="p-5 text-center">
          <p className="mb-3">We couldn't find that booking.</p>
          <Link to="/" className="btn btn-primary-glass btn-sm">Back to events</Link>
        </GlassCard>
      </div>
    )
  }

  if (!booking) return null

  return (
    <div className="container py-5 mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-lg-7">
          <div className="text-center mb-4">
            <div className="success-check mx-auto mb-3">
              <i className="bi bi-check-lg"></i>
            </div>
            <h1 className="h4 fw-bold mb-1">Booking confirmed</h1>
            <p className="text-muted-light small">
              A confirmation has been sent to your registered email.
            </p>
          </div>

          <GlassCard className="p-0 ticket-card">
            <div className="ticket-top p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="eyebrow mb-1">E-Ticket</p>
                  <h2 className="h5 fw-bold mb-0">{booking.eventTitle}</h2>
                </div>
                <span className="badge status-badge">{booking.status}</span>
              </div>

              <div className="row mt-4 g-3">
                <div className="col-6">
                  <p className="small text-muted-light mb-0">Date & time</p>
                  <p className="fw-semibold mb-0">
                    {new Date(booking.eventDate).toLocaleDateString('en-IN')} · {booking.eventTime}
                  </p>
                </div>
                <div className="col-6">
                  <p className="small text-muted-light mb-0">Venue</p>
                  <p className="fw-semibold mb-0">{booking.venue}</p>
                </div>
                <div className="col-6">
                  <p className="small text-muted-light mb-0">Attendee</p>
                  <p className="fw-semibold mb-0">{booking.attendeeName}</p>
                </div>
                <div className="col-6">
                  <p className="small text-muted-light mb-0">Seats booked</p>
                  <p className="fw-semibold mb-0">{booking.seats}</p>
                </div>
              </div>
            </div>

            <div className="ticket-divider">
              <span className="ticket-notch ticket-notch-left"></span>
              <span className="ticket-notch ticket-notch-right"></span>
            </div>

            <div className="ticket-bottom p-4 d-flex justify-content-between align-items-center">
              <div>
                <p className="small text-muted-light mb-0">Booking ID</p>
                <p className="fw-bold mb-0">{booking.id}</p>
              </div>
              <div className="text-end">
                <p className="small text-muted-light mb-0">Total paid</p>
                <p className="fw-bold price-text mb-0">
                  {booking.totalPrice === 0 ? 'Free' : `₹${booking.totalPrice}`}
                </p>
              </div>
            </div>
          </GlassCard>

          <div className="d-flex gap-3 justify-content-center mt-4">
            <button className="btn btn-outline-glass btn-sm" onClick={() => window.print()}>
              <i className="bi bi-download me-1"></i> Download / Print
            </button>
            <Link to="/dashboard" className="btn btn-primary-glass btn-sm">
              Go to dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
