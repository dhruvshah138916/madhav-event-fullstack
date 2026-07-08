import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from '../api.js'

const EventContext = createContext(null)

export function EventProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const data = await apiRequest('/events')
    setEvents(data)
  }

  useEffect(() => {
    refresh()
      .catch((err) => console.error('Failed to load events:', err.message))
      .finally(() => setLoading(false))
  }, [])

  async function addEvent(event) {
    const created = await apiRequest('/events', { method: 'POST', body: event, auth: true })
    setEvents((prev) => [created, ...prev])
    return created
  }

  async function updateEvent(id, updates) {
    const updated = await apiRequest(`/events/${id}`, { method: 'PUT', body: updates, auth: true })
    setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)))
    return updated
  }

  async function deleteEvent(id) {
    await apiRequest(`/events/${id}`, { method: 'DELETE', auth: true })
    setEvents((prev) => prev.filter((e) => e.id !== id))
  }

  function getEvent(id) {
    return events.find((e) => e.id === id)
  }

  return (
    <EventContext.Provider
      value={{ events, loading, addEvent, updateEvent, deleteEvent, getEvent, refresh }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  return useContext(EventContext)
}
