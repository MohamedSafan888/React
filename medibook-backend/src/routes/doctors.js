import { Router } from 'express'
import { data } from '../store.js'
import { listDoctorRows, getDoctorUser, serializeDoctor } from '../utils/serializers.js'

const router = Router()

// GET /api/doctors?search=&specialty=&sort_by=&page=&page_size=
router.get('/', (req, res) => {
  const { search, specialty, sort_by, page = 1, page_size = 10 } = req.query
  res.json(listDoctorRows({ search, specialty, sort_by, page, page_size }))
})

// GET /api/doctors/:id
router.get('/:id', (req, res) => {
  const user = getDoctorUser(req.params.id)
  if (!user) return res.status(404).json({ detail: 'Doctor not found.' })
  res.json(serializeDoctor(user))
})

// GET /api/doctors/:id/availability
router.get('/:id/availability', (req, res) => {
  const slots = data.slots
    .filter(s => s.doctor_id === Number(req.params.id))
    .sort((a, b) => a.day - b.day || a.start_time.localeCompare(b.start_time))
  res.json(slots)
})

export default router
