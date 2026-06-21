import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/auth.js'
import doctorsRoutes from './routes/doctors.js'
import doctorRoutes from './routes/doctor.js'
import appointmentsRoutes from './routes/appointments.js'
import adminRoutes from './routes/admin.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/doctors', doctorsRoutes)
app.use('/api/doctor', doctorRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => res.status(404).json({ detail: 'Not found.' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ detail: 'Internal server error.' })
})

const PORT = process.env.PORT || 8000
app.listen(PORT, () => console.log(`MediBook API running on http://localhost:${PORT}/api`))
