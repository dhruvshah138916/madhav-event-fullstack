import { createContext, useContext, useState } from 'react'
import { apiRequest } from '../api.js'

const BookingContext = createContext(null)

export function BookingProvider({ children }) {
  const [bookings, setBookings] = useState([])

  // Loads every booking (used by the Reports / organizer page)
  async function refreshAll() {
    const data = await apiRequest('/bookings', { auth: true })
    setBookings(data)
    return data
  }

  // Loads only the logged-in user's bookings (used by the Dashboard page)
  async function refreshMine() {
    const data = await apiRequest('/bookings/mine', { auth: true })
    setBookings(data)
    return data
  }

  async function addBooking(booking) {
    const created = await apiRequest('/bookings', { method: 'POST', body: booking, auth: true })
    setBookings((prev) => [created, ...prev])
    return created
  }

  async function getBooking(id) {
    return apiRequest(`/bookings/${id}`, { auth: true })
  }

  return (
    <BookingContext.Provider
      value={{ bookings, addBooking, getBooking, refreshAll, refreshMine }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBookings() {
  return useContext(BookingContext)
}
