import { useMemo, useState } from 'react'
import { useEvents } from '../context/EventContext.jsx'
import EventCard from '../components/EventCard.jsx'
import GlassCard from '../components/GlassCard.jsx'

export default function Home() {
  const { events } = useEvents()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...new Set(events.map((e) => e.category))],
    [events],
  )

  const filtered = events.filter((e) => {
    const matchesQuery =
      e.title.toLowerCase().includes(query.toLowerCase()) ||
      e.venue.toLowerCase().includes(query.toLowerCase())
    const matchesCategory = category === 'All' || e.category === category
    return matchesQuery && matchesCategory
  })

  return (
    <>
      <section className="hero-section">
        <div className="hero-blob hero-blob-1"></div>
        <div className="hero-blob hero-blob-2"></div>
        <div className="hero-blob hero-blob-3"></div>
        <div className="container hero-content">
          <p className="eyebrow">Madhav Event · Discover what's on</p>
          <h1 className="display-title mb-3">
            Every event worth going to,<br /> in one glass window.
          </h1>
          <p className="hero-sub mb-4">
            Browse concerts, conferences, workshops and campus fests — book your seat in a
            few taps.
          </p>

          <GlassCard className="search-bar p-2 p-md-3">
            <div className="row g-2 align-items-center">
              <div className="col-md-7">
                <div className="input-group search-input-group">
                  <span className="input-group-text glass-input-icon">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    className="form-control glass-input"
                    placeholder="Search events, venues..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-5">
                <select
                  className="form-select glass-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-2">
          <div>
            <h2 className="h4 fw-bold mb-1">Upcoming events</h2>
            <p className="text-muted-light small mb-0">{filtered.length} events found</p>
          </div>
        </div>

        {filtered.length === 0 ? (
          <GlassCard className="p-5 text-center">
            <i className="bi bi-calendar-x display-6 d-block mb-3 text-muted-light"></i>
            <p className="mb-0">No events match your search. Try a different keyword or category.</p>
          </GlassCard>
        ) : (
          <div className="row g-4">
            {filtered.map((event) => (
              <div className="col-sm-6 col-lg-4" key={event.id}>
                <EventCard event={event} />
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
