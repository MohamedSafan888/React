import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { data, save, nextId } from '../store.js'
import { serializeUser } from '../utils/serializers.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

router.post('/register', (req, res) => {
  const { first_name, last_name, email, phone, password, role } = req.body || {}
  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ detail: 'first_name, last_name, email and password are required.' })
  }
  const allowedRole = ['patient', 'doctor'].includes(role) ? role : 'patient'

  if (data.users.some(u => u.email === email)) {
    return res.status(400).json({ detail: 'Email is already registered.' })
  }

  const user = {
    id: nextId('users'),
    first_name, last_name, email,
    phone: phone || null,
    password_hash: bcrypt.hashSync(password, 10),
    role: allowedRole,
    avatar: null,
  }
  data.users.push(user)

  if (allowedRole === 'doctor') {
    data.doctorProfiles.push({ user_id: user.id, specialty_id: null, bio: '', rating: 0, reviews_count: 0 })
  }
  save()

  res.status(201).json({ access: signToken(user), user: serializeUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body || {}
  const user = data.users.find(u => u.email === email)
  if (!user || !bcrypt.compareSync(password || '', user.password_hash)) {
    return res.status(401).json({ detail: 'Invalid email or password.' })
  }
  res.json({ access: signToken(user), user: serializeUser(user) })
})

router.get('/profile', requireAuth, (req, res) => {
  res.json(serializeUser(req.user))
})

router.put('/profile', requireAuth, (req, res) => {
  const { first_name, last_name, phone, avatar } = req.body || {}
  Object.assign(req.user, {
    first_name: first_name ?? req.user.first_name,
    last_name: last_name ?? req.user.last_name,
    phone: phone ?? req.user.phone,
    avatar: avatar ?? req.user.avatar,
  })
  save()
  res.json(serializeUser(req.user))
})

router.post('/logout', requireAuth, (req, res) => {
  // Stateless JWT - nothing to invalidate server-side; the frontend just drops the token.
  res.json({ detail: 'Logged out.' })
})

export default router
