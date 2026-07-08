const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { JWT_SECRET } = require('../middleware/auth')

const router = express.Router()

function signToken(user) {
  const payload = { id: user._id.toString(), name: user.name, email: user.email, role: user.role }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  return { token, user: payload }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required.' })
    }

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' })
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role === 'organizer' ? 'organizer' : 'attendee',
    })

    const { token, user } = signToken(newUser)
    res.status(201).json({ token, user })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while registering.' })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' })
    }

    const found = await User.findOne({ email: email.toLowerCase() })

    if (!found || !bcrypt.compareSync(password, found.passwordHash)) {
      return res.status(401).json({ message: 'Invalid email or password.' })
    }

    const { token, user } = signToken(found)
    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong while logging in.' })
  }
})

module.exports = router
