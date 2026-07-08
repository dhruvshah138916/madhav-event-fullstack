const express = require('express')
const Event = require('../models/Event')
const Booking = require('../models/Booking')
const { requireAuth } = require('../middleware/auth')
const { isValidId } = require('../utils/isValidId')
const { sendBookingConfirmationEmail } = require('../utils/sendMail')

const router = express.Router()

// GET /api/bookings -> all bookings (used by the Reports page, organizers only)
router.get('/', requireAuth, async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Organizer access only.' })
  }
  try {
    const bookings = await Booking.find().sort({ bookedAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Could not load bookings.' })
  }
})

// GET /api/bookings/mine -> bookings for the logged-in user (Dashboard page)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userEmail: req.user.email }).sort({ bookedAt: -1 })
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ message: 'Could not load your bookings.' })
  }
})

// GET /api/bookings/:id -> single booking (Confirmation page)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Booking not found.' })

    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: 'Booking not found.' })
    res.json(booking)
  } catch (err) {
    res.status(500).json({ message: 'Could not load booking.' })
  }
})

// POST /api/bookings -> create a booking and decrement seats
router.post('/', requireAuth, async (req, res) => {
  try {
    const { eventId, attendeeName, seats } = req.body

    if (!eventId || !attendeeName || !seats) {
      return res.status(400).json({ message: 'eventId, attendeeName and seats are required.' })
    }
    if (!isValidId(eventId)) {
      return res.status(404).json({ message: 'Event not found.' })
    }

    const event = await Event.findById(eventId)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    const seatCount = Number(seats)
    if (seatCount < 1 || seatCount > 6) {
      return res.status(400).json({ message: 'You can book between 1 and 6 seats.' })
    }
    if (seatCount > event.seatsAvailable) {
      return res.status(400).json({ message: 'Not enough seats available.' })
    }

    const newBooking = await Booking.create({
      eventId: event._id.toString(),
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      venue: event.venue,
      userEmail: req.user.email,
      attendeeName,
      seats: seatCount,
      totalPrice: seatCount * event.price,
      bookedAt: new Date().toISOString(),
      status: 'Confirmed',
    })

    event.seatsAvailable = Math.max(0, event.seatsAvailable - seatCount)
    await event.save()

    // Email the attendee their confirmation. This runs in the background —
    // if it fails (e.g. email not configured), the booking still succeeds.
    sendBookingConfirmationEmail(newBooking).catch(() => {})

    res.status(201).json(newBooking)
  } catch (err) {
    res.status(500).json({ message: 'Could not create booking.' + err.message })
  }
})

module.exports = router
