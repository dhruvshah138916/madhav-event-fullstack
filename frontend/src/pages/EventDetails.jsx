import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEvents } from '../context/EventContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import GlassCard from '../components/GlassCard.jsx'
import { getImageUrl } from '../api'

export default function EventDetails() {
  const { id } = useParams()
  const { getEvent } = useEvents()
  const { user } = useAuth()
  const navigate = useNavigate()
  const event = getEvent(id)

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

  const soldOut = event.seatsAvailable <= 0
  const dateLabel = new Date(event.date).toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  function handleBook() {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/events/${id}/book` } } })
      return
    }
    navigate(`/events/${id}/book`)
  }

  return (
    <div className="detail-page">
      <div className="detail-banner" style={{ backgroundImage: `url(${getImageUrl(event.image)})` }}>
        <div className="detail-banner-overlay"></div>
      </div>

      <div className="container detail-body">
        <div className="row g-4">
          <div className="col-lg-8">
            <GlassCard className="p-4 p-md-5">
              <span className="badge event-category-badge static mb-3">{event.category}</span>
              <h1 className="h3 fw-bold mb-3">{event.title}</h1>
              <div className="d-flex flex-wrap gap-4 mb-4 detail-meta">
                <div>
                  <i className="bi bi-calendar-event me-2"></i>{dateLabel}
                </div>
                <div>
                  <i className="bi bi-clock me-2"></i>{event.time}
                </div>
                <div>
                  <i className="bi bi-geo-alt me-2"></i>{event.venue}
                </div>
              </div>
              <hr className="glass-divider" />
              <h2 className="h6 fw-bold mb-2">About this event</h2>
              <p className="text-muted-light mb-0">{event.description}</p>
              <hr className="glass-divider" />
              <h2 className="h6 fw-bold mb-2">Organized by</h2>
              <p className="text-muted-light mb-0">{event.organizer}</p>
            </GlassCard>
          </div>

          <div className="col-lg-4">
            <GlassCard className="p-4 booking-sidebar">
              <p className="small text-muted-light mb-1">Price per ticket</p>
              <h3 className="fw-bold price-text mb-3">
                {event.price === 0 ? 'Free' : `₹${event.price}`}
              </h3>
              <div className="d-flex justify-content-between small mb-2">
                <span className="text-muted-light">Seats available</span>
                <span className="fw-semibold">{event.seatsAvailable} / {event.seatsTotal}</span>
              </div>
              <div className="seat-progress mb-4">
                <div
                  className="seat-progress-fill"
                  style={{ width: `${(event.seatsAvailable / event.seatsTotal) * 100}%` }}
                ></div>
              </div>
              <button
                className="btn btn-primary-glass w-100"
                disabled={soldOut}
                onClick={handleBook}
              >
                {soldOut ? 'Sold out' : 'Book tickets'}
              </button>
              {!user && !soldOut && (
                <p className="small text-muted-light text-center mt-3 mb-0">
                  You'll need to log in to complete your booking.
                </p>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
