import { Router } from 'express'
import { data, save, nextId } from '../store.js'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { getDoctorUser, serializeDoctor, listAppointmentsFor } from '../utils/serializers.js'

const router = Router()
router.use(requireAuth, requireRole('doctor'))

// PUT /api/doctor/profile  { first_name, last_name, phone, avatar, specialty_id, bio }
router.put('/profile', (req, res) => {
  const { first_name, last_name, phone, avatar, specialty_id, bio } = req.body || {}
  Object.assign(req.user, {
    first_name: first_name ?? req.user.first_name,
    last_name: last_name ?? req.user.last_name,
    phone: phone ?? req.user.phone,
    avatar: avatar ?? req.user.avatar,
  })

  let profile = data.doctorProfiles.find(p => p.user_id === req.user.id)
  if (!profile) {
    profile = { user_id: req.user.id, specialty_id: null, bio: '', rating: 0, reviews_count: 0 }
    data.doctorProfiles.push(profile)
  }
  if (specialty_id !== undefined) profile.specialty_id = specialty_id
  if (bio !== undefined) profile.bio = bio

  save()
  res.json(serializeDoctor(getDoctorUser(req.user.id)))
})

// POST /api/doctor/availability  { day, start_time, end_time, is_available }
// or { slots: [ {day,start_time,end_time,is_available}, ... ] } to add several at once
router.post('/availability', (req, res) => {
  const body = req.body || {}
  const incoming = Array.isArray(body.slots) ? body.slots : [body]

  for (const s of incoming) {
    data.slots.push({
      id: nextId('slots'),
      doctor_id: req.user.id,
      day: s.day,
      start_time: s.start_time,
      end_time: s.end_time,
      is_available: s.is_available === false ? false : true,
    })
  }
  save()

  const result = data.slots
    .filter(s => s.doctor_id === req.user.id)
    .sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time))
  res.status(201).json(result)
})

// GET /api/doctor/appointments
router.get('/appointments', (req, res) => {
  res.json(listAppointmentsFor('doctor_id', req.user.id))
})

export default router
