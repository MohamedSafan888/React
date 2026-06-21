import { Router } from 'express'
import { data, save, nextId } from '../store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { serializeUser, serializeAppointment } from '../utils/serializers.js'

const router = Router()

// Specialties are public-read (used by the doctor search filter dropdown), everything else admin-only
router.get('/specialties', (req, res) => {
  res.json([...data.specialties].sort((a, b) => a.name.localeCompare(b.name)))
})

router.use(requireAuth, requireRole('admin'))

router.get('/users', (req, res) => {
  const { role } = req.query
  const rows = role ? data.users.filter(u => u.role === role) : data.users
  res.json([...rows].sort((a, b) => b.id - a.id).map(serializeUser))
})

router.put('/users/:id', (req, res) => {
  const user = data.users.find(u => u.id === Number(req.params.id))
  if (!user) return res.status(404).json({ detail: 'User not found.' })
  const { first_name, last_name, phone, role } = req.body || {}
  Object.assign(user, {
    first_name: first_name ?? user.first_name,
    last_name: last_name ?? user.last_name,
    phone: phone ?? user.phone,
    role: role ?? user.role,
  })
  save()
  res.json(serializeUser(user))
})

router.post('/specialties', (req, res) => {
  const { name } = req.body || {}
  if (!name) return res.status(400).json({ detail: 'name is required.' })
  if (data.specialties.some(s => s.name.toLowerCase() === name.toLowerCase())) {
    return res.status(400).json({ detail: 'Specialty already exists.' })
  }
  const specialty = { id: nextId('specialties'), name }
  data.specialties.push(specialty)
  save()
  res.status(201).json(specialty)
})

router.delete('/specialties/:id', (req, res) => {
  data.specialties = data.specialties.filter(s => s.id !== Number(req.params.id))
  save()
  res.status(204).end()
})

router.get('/appointments', (req, res) => {
  const sorted = [...data.appointments].sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
  res.json(sorted.map(serializeAppointment))
})

export default router
