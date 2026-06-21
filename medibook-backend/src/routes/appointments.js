import { Router } from 'express'
import { data, save, nextId } from '../store.js'
import { requireAuth } from '../middleware/auth.js'
import { listAppointmentsFor, getAppointment, serializeAppointment } from '../utils/serializers.js'

const router = Router()
router.use(requireAuth)

// Compute the next real calendar date/time for a slot's weekday + start_time
function nextDateTimeFor(day, startTime) {
  const now = new Date()
  const result = new Date(now)
  const diff = (day - now.getDay() + 7) % 7
  result.setDate(now.getDate() + diff)
  const [h, m] = startTime.split(':').map(Number)
  result.setHours(h, m, 0, 0)
  if (diff === 0 && result < now) result.setDate(result.getDate() + 7)
  return result.toISOString()
}

// POST /api/appointments/book  { doctor_id, slot_id }
router.post('/book', (req, res) => {
  if (req.user.role !== 'patient') {
    return res.status(403).json({ detail: 'Only patients can book appointments.' })
  }
  const { doctor_id, slot_id } = req.body || {}
  const slot = data.slots.find(s => s.id === Number(slot_id) && s.doctor_id === Number(doctor_id))
  if (!slot) return res.status(404).json({ detail: 'Time slot not found.' })
  if (!slot.is_available) return res.status(400).json({ detail: 'This slot is no longer available.' })

  const appt = {
    id: nextId('appointments'),
    doctor_id: Number(doctor_id),
    patient_id: req.user.id,
    slot_id: slot.id,
    scheduled_at: nextDateTimeFor(slot.day, slot.start_time),
    status: 'pending',
    notes: '',
  }
  data.appointments.push(appt)
  slot.is_available = false
  save()

  res.status(201).json(serializeAppointment(appt))
})

// GET /api/appointments  (current patient's own appointments)
router.get('/', (req, res) => {
  res.json(listAppointmentsFor('patient_id', req.user.id))
})

// PUT /api/appointments/:id/status  { status, notes }
router.put('/:id/status', (req, res) => {
  const { status, notes } = req.body || {}
  const appt = getAppointment(req.params.id)
  if (!appt) return res.status(404).json({ detail: 'Appointment not found.' })

  const isOwner = appt.patient_id === req.user.id || appt.doctor_id === req.user.id
  if (!isOwner && req.user.role !== 'admin') {
    return res.status(403).json({ detail: 'You do not have permission to modify this appointment.' })
  }

  if (status) appt.status = status
  if (notes !== undefined) appt.notes = notes

  if (status === 'cancelled' || status === 'rejected') {
    const slot = data.slots.find(s => s.id === appt.slot_id)
    if (slot) slot.is_available = true
  }
  save()

  res.json(serializeAppointment(appt))
})

export default router
