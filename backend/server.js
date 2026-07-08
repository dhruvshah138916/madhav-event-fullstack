require('dotenv').config()
const path = require('path')
const express = require('express')
const cors = require('cors')

const connectDB = require('./config/db')

const authRoutes = require('./routes/auth')
const eventRoutes = require('./routes/events')
const bookingRoutes = require('./routes/bookings')

const app = express()

app.use(cors())
app.use(express.json())

// Serve uploaded banner images statically, e.g. GET /uploads/event-123.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/bookings', bookingRoutes)

// Fallback for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ message: 'API route not found.' })
})

const PORT = process.env.PORT || 5000

async function start() {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`Madhav Event backend running on http://localhost:${PORT}`)
  })
}

start()
