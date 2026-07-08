import { useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useEvents } from '../context/EventContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useBookings } from '../context/BookingContext.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Booking() {
  const { id } = useParams()
  const { getEvent, refresh } = useEvents()
  const { user } = useAuth()
  const { addBooking } = useBookings()
  const navigate = useNavigate()
  const event = getEvent(id)

  const [seats, setSeats] = useState(1)
  const [attendeeName, setAttendeeName] = useState(user?.name || '')
  const [error, setError] = useState('')

  if (!event) {
    return (
      <div className="container py-5 mt-5">
        <GlassCard className="p-5 text-center">
          <p className="mb-3">Event not found.</p>
          <Link to="/" className="btn btn-primary-glass btn-sm">Back to events</Link>
        </GlassCard>
      </div>
    )
  }

  const maxSeats = Math.min(6, event.seatsAvailable)
  const total = seats * event.price

  function updateSeats(delta) {
    setSeats((s) => Math.min(maxSeats, Math.max(1, s + delta)))
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setError('')
    try {
      const booking = await addBooking({ eventId: event.id, attendeeName, seats })
      await refresh() // pull fresh seatsAvailable from the server
      navigate(`/confirmation/${booking.id}`)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container py-5 mt-5 pt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <GlassCard className="p-4 p-md-5">
            <p className="eyebrow mb-2">Booking · Step 1 of 1</p>
            <h1 className="h4 fw-bold mb-4">Confirm your seats for {event.title}</h1>

            {error && <div className="alert alert-glass-danger py-2 small">{error}</div>}

            <form onSubmit={handleConfirm}>
              <div className="mb-4">
                <label className="form-label small">Attendee name</label>
                <input
                  className="form-control glass-input"
                  required
                  value={attendeeName}
                  onChange={(e) => setAttendeeName(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small d-block">Number of seats</label>
                <div className="seat-stepper">
                  <button type="button" className="stepper-btn" onClick={() => updateSeats(-1)}>
                    <i className="bi bi-dash"></i>
                  </button>
                  <span className="stepper-value">{seats}</span>
                  <button type="button" className="stepper-btn" onClick={() => updateSeats(1)}>
                    <i className="bi bi-plus"></i>
                  </button>
                  <span className="small text-muted-light ms-3">
                    {event.seatsAvailable} seats left (max 6 per booking)
                  </span>
                </div>
              </div>

              <GlassCard className="p-3 mb-4 summary-box">
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted-light">Event</span>
                  <span>{event.title}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted-light">Date</span>
                  <span>{new Date(event.date).toLocaleDateString('en-IN')} · {event.time}</span>
                </div>
                <div className="d-flex justify-content-between small mb-2">
                  <span className="text-muted-light">Price per ticket</span>
                  <span>{event.price === 0 ? 'Free' : `₹${event.price}`}</span>
                </div>
                <hr className="glass-divider" />
                <div className="d-flex justify-content-between fw-bold">
                  <span>Total</span>
                  <span className="price-text">{total === 0 ? 'Free' : `₹${total}`}</span>
                </div>
              </GlassCard>

              <button type="submit" className="btn btn-primary-glass w-100">
                Confirm booking
              </button>
              <p className="small text-muted-light text-center mt-3 mb-0">
                Demo checkout — no real payment gateway is used.
              </p>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}
