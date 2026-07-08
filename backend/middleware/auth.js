const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// Checks for "Authorization: Bearer <token>" header, verifies it,
// and attaches the decoded user info to req.user
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated. Please log in.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded // { id, name, email, role }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired session. Please log in again.' })
  }
}

module.exports = { requireAuth, JWT_SECRET }
