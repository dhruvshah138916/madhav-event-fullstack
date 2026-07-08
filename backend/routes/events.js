const express = require('express')
const Event = require('../models/Event')
const { requireAuth } = require('../middleware/auth')
const { isValidId } = require('../utils/isValidId')
const upload = require('../config/upload')

const router = express.Router()

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop'

// GET /api/events -> list all events (public), newest date first
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: -1 })
    res.json(events)
  } catch (err) {
    res.status(500).json({ message: 'Could not load events.' })
  }
})

// GET /api/events/:id -> single event (public)
router.get('/:id', async (req, res) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Event not found.' })

    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })
    res.json(event)
  } catch (err) {
    res.status(500).json({ message: 'Could not load event.' })
  }
})

// POST /api/events -> create event (organizer only)
// Accepts multipart/form-data so a real banner image file can be uploaded (field name: "image")
router.post('/', requireAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Image upload failed.' })
    next()
  })
}, async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Only organizers can create events.' })
  }

  try {
    const { title, category, date, time, venue, price, seatsTotal, organizer, description } = req.body

    if (!title || !date || !time || !venue || !seatsTotal) {
      return res.status(400).json({ message: 'Missing required event fields.' })
    }

    // req.file is populated by multer when a banner image file was uploaded
    const image = req.file ? `/uploads/${req.file.filename}` : DEFAULT_IMAGE

    const newEvent = await Event.create({
      title,
      category: category || 'Concert',
      date,
      time,
      venue,
      price: Number(price) || 0,
      seatsTotal: Number(seatsTotal),
      seatsAvailable: Number(seatsTotal),
      image,
      organizer: organizer || req.user.name,
      description: description || '',
    })

    res.status(201).json(newEvent)
  } catch (err) {
    res.status(500).json({ message: 'Could not create event.' })
  }
})

// PUT /api/events/:id -> update event (organizer only)
// Accepts multipart/form-data so the banner image can be replaced with a new uploaded file
router.put('/:id', requireAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Image upload failed.' })
    next()
  })
}, async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Only organizers can edit events.' })
  }

  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Event not found.' })

    const event = await Event.findById(req.params.id)
    if (!event) return res.status(404).json({ message: 'Event not found.' })

    const updates = { ...req.body }
    delete updates.id
    delete updates._id
    delete updates.seatsAvailable // don't let a full-form edit silently reset seats sold
    delete updates.image // image is only ever updated via an uploaded file, never as raw text

    if (updates.price !== undefined) updates.price = Number(updates.price)
    if (updates.seatsTotal !== undefined) updates.seatsTotal = Number(updates.seatsTotal)

    // Only replace the banner image if a new file was actually uploaded
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`
    }

    Object.assign(event, updates)
    await event.save()

    res.json(event)
  } catch (err) {
    res.status(500).json({ message: 'Could not update event.' })
  }
})

// DELETE /api/events/:id -> delete event (organizer only)
router.delete('/:id', requireAuth, async (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Only organizers can delete events.' })
  }

  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ message: 'Event not found.' })

    const deleted = await Event.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: 'Event not found.' })
    res.json({ message: 'Event deleted.' })
  } catch (err) {
    res.status(500).json({ message: 'Could not delete event.' })
  }
})

module.exports = router
