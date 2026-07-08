import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  const dateObj = new Date(event.date)
  const day = dateObj.getDate()
  const month = dateObj.toLocaleString('default', { month: 'short' })
  const lowSeats = event.seatsAvailable <= event.seatsTotal * 0.15

  return (
    <div className="event-card glass-card h-100">
      <div className="event-card-media">
        <img src={event.image} alt={event.title} loading="lazy" />
        <div className="event-date-chip">
          <span className="d-block fw-bold">{day}</span>
          <span className="d-block text-uppercase">{month}</span>
        </div>
        <span className="badge event-category-badge">{event.category}</span>
      </div>
      <div className="p-3 d-flex flex-column flex-grow-1">
        <h3 className="h6 fw-bold mb-1">{event.title}</h3>
        <p className="small text-muted-light mb-2">
          <i className="bi bi-geo-alt me-1"></i>{event.venue}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
          <span className="fw-bold price-text">
            {event.price === 0 ? 'Free' : `₹${event.price}`}
          </span>
          {lowSeats && (
            <span className="small text-warning-strong">
              <i className="bi bi-lightning-fill"></i> Filling fast
            </span>
          )}
        </div>
        <Link to={`/events/${event.id}`} className="btn btn-primary-glass btn-sm mt-3 w-100">
          View details
        </Link>
      </div>
    </div>
  )
}
