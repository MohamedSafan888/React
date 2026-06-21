import { data } from '../store.js'

export function serializeUser(u) {
  if (!u) return null
  const { password_hash, ...rest } = u
  return rest
}

function getSpecialty(id) {
  return data.specialties.find(s => s.id === id) || null
}

// Doctor shape the frontend expects:
// { id, first_name, last_name, email, phone, avatar, specialty:{id,name}, bio, rating, reviews_count }
export function serializeDoctor(user) {
  if (!user) return null
  const profile = data.doctorProfiles.find(p => p.user_id === user.id)
  const specialty = profile?.specialty_id ? getSpecialty(profile.specialty_id) : null
  return {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar || null,
    bio: profile?.bio || '',
    rating: profile?.rating ?? 0,
    reviews_count: profile?.reviews_count ?? 0,
    specialty: specialty ? { id: specialty.id, name: specialty.name } : null,
  }
}

export function getDoctorUser(id) {
  const user = data.users.find(u => u.id === Number(id) && u.role === 'doctor')
  return user || null
}

export function listDoctorRows({ search, specialty, sort_by, page = 1, page_size = 10 }) {
  let doctors = data.users.filter(u => u.role === 'doctor')

  if (search) {
    const q = String(search).toLowerCase()
    doctors = doctors.filter(u => {
      const profile = data.doctorProfiles.find(p => p.user_id === u.id)
      const specName = profile?.specialty_id ? getSpecialty(profile.specialty_id)?.name : ''
      return `${u.first_name} ${u.last_name}`.toLowerCase().includes(q)
        || (specName || '').toLowerCase().includes(q)
    })
  }
  if (specialty) {
    doctors = doctors.filter(u => {
      const profile = data.doctorProfiles.find(p => p.user_id === u.id)
      return String(profile?.specialty_id) === String(specialty)
    })
  }

  const withProfile = doctors.map(u => ({ u, p: data.doctorProfiles.find(p => p.user_id === u.id) }))

  if (sort_by === 'rating') withProfile.sort((a, b) => (b.p?.rating || 0) - (a.p?.rating || 0))
  else if (sort_by === 'reviews') withProfile.sort((a, b) => (b.p?.reviews_count || 0) - (a.p?.reviews_count || 0))
  else if (sort_by === 'name') withProfile.sort((a, b) => a.u.first_name.localeCompare(b.u.first_name))
  else withProfile.sort((a, b) => b.u.id - a.u.id)

  const count = withProfile.length
  const start = (Number(page) - 1) * Number(page_size)
  const pageItems = withProfile.slice(start, start + Number(page_size))

  return { results: pageItems.map(({ u }) => serializeDoctor(u)), count }
}

export function serializeAppointment(appt) {
  if (!appt) return null
  const doctor = data.users.find(u => u.id === appt.doctor_id)
  const patient = data.users.find(u => u.id === appt.patient_id)
  const profile = data.doctorProfiles.find(p => p.user_id === appt.doctor_id)
  const specialty = profile?.specialty_id ? getSpecialty(profile.specialty_id) : null

  return {
    id: appt.id,
    status: appt.status,
    notes: appt.notes || '',
    scheduled_at: appt.scheduled_at,
    doctor: doctor ? {
      id: doctor.id, first_name: doctor.first_name, last_name: doctor.last_name,
      specialty: specialty ? { id: specialty.id, name: specialty.name } : null,
    } : null,
    patient: patient ? {
      id: patient.id, first_name: patient.first_name, last_name: patient.last_name,
    } : null,
  }
}

export function listAppointmentsFor(field, userId) {
  return data.appointments
    .filter(a => a[field] === Number(userId))
    .sort((a, b) => new Date(b.scheduled_at) - new Date(a.scheduled_at))
    .map(serializeAppointment)
}

export function getAppointment(id) {
  return data.appointments.find(a => a.id === Number(id)) || null
}
