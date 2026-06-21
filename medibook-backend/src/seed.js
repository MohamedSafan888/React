import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { data, save, nextId } from './store.js'

const password_hash = bcrypt.hashSync('password123', 10)

const specialtyNames = ['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'Dentistry']

const doctors = [
  { first_name: 'Ahmed',   last_name: 'Hassan',  email: 'ahmed.hassan@medibook.test',  specialty: 'Cardiology',  bio: 'Senior cardiologist with 12 years of experience in heart disease management.', rating: 4.8, reviews_count: 134 },
  { first_name: 'Sara',    last_name: 'Mostafa', email: 'sara.mostafa@medibook.test',  specialty: 'Dermatology', bio: 'Specialist in skin care and cosmetic dermatology.',                          rating: 4.6, reviews_count: 88 },
  { first_name: 'Omar',    last_name: 'Khalil',  email: 'omar.khalil@medibook.test',   specialty: 'Pediatrics',  bio: 'Friendly pediatrician focused on child wellness and vaccinations.',           rating: 4.9, reviews_count: 201 },
  { first_name: 'Mona',    last_name: 'Adel',    email: 'mona.adel@medibook.test',     specialty: 'Orthopedics', bio: 'Orthopedic surgeon specializing in sports injuries.',                         rating: 4.5, reviews_count: 67 },
  { first_name: 'Youssef', last_name: 'Tarek',   email: 'youssef.tarek@medibook.test', specialty: 'Neurology',   bio: 'Neurologist with focus on migraine and epilepsy treatment.',                  rating: 4.7, reviews_count: 95 },
  { first_name: 'Laila',   last_name: 'Farouk',  email: 'laila.farouk@medibook.test',  specialty: 'Dentistry',   bio: 'General and cosmetic dentist serving patients of all ages.',                  rating: 4.4, reviews_count: 52 },
]

const patient = { first_name: 'Khaled', last_name: 'Ibrahim', email: 'patient@medibook.test' }
const admin   = { first_name: 'Admin',  last_name: 'User',    email: 'admin@medibook.test' }

if (data.users.length > 0) {
  console.log('Data already exists (data.json is not empty). Skipping seed.')
  console.log('Delete data.json and re-run "npm run seed" if you want to start fresh.')
  process.exit(0)
}

const specId = {}
for (const name of specialtyNames) {
  const specialty = { id: nextId('specialties'), name }
  data.specialties.push(specialty)
  specId[name] = specialty.id
}

for (const d of doctors) {
  const user = {
    id: nextId('users'),
    first_name: d.first_name,
    last_name: d.last_name,
    email: d.email,
    phone: '0100' + Math.floor(1000000 + Math.random() * 8999999),
    password_hash,
    role: 'doctor',
    avatar: null,
  }
  data.users.push(user)
  data.doctorProfiles.push({ user_id: user.id, specialty_id: specId[d.specialty], bio: d.bio, rating: d.rating, reviews_count: d.reviews_count })

  for (const day of [0, 1, 2, 3, 4]) { // Sunday-Thursday
    for (const [start_time, end_time] of [['09:00', '10:00'], ['11:00', '12:00'], ['14:00', '15:00']]) {
      data.slots.push({ id: nextId('slots'), doctor_id: user.id, day, start_time, end_time, is_available: true })
    }
  }
}

data.users.push({
  id: nextId('users'), first_name: patient.first_name, last_name: patient.last_name, email: patient.email,
  phone: '01001234567', password_hash, role: 'patient', avatar: null,
})
data.users.push({
  id: nextId('users'), first_name: admin.first_name, last_name: admin.last_name, email: admin.email,
  phone: '01007654321', password_hash, role: 'admin', avatar: null,
})

save()

console.log('Seed complete.')
console.log('Sample logins (password for all: password123):')
console.log('  Patient:', patient.email)
console.log('  Admin:  ', admin.email)
console.log('  Doctor: ', doctors[0].email)
