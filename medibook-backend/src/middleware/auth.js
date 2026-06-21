import jwt from 'jsonwebtoken'
import { data } from '../store.js'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ detail: 'Authentication credentials were not provided.' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = data.users.find(u => u.id === payload.sub)
    if (!user) return res.status(401).json({ detail: 'User not found.' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ detail: 'Invalid or expired token.' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ detail: 'You do not have permission to perform this action.' })
    }
    next()
  }
}
