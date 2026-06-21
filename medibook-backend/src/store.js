import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_FILE = path.join(__dirname, '..', 'data.json')

function defaultData() {
  return {
    users: [],            // {id, first_name, last_name, email, phone, password_hash, role, avatar}
    specialties: [],       // {id, name}
    doctorProfiles: [],    // {user_id, specialty_id, bio, rating, reviews_count}
    slots: [],             // {id, doctor_id, day, start_time, end_time, is_available}
    appointments: [],      // {id, doctor_id, patient_id, slot_id, scheduled_at, status, notes}
    counters: { users: 0, specialties: 0, slots: 0, appointments: 0 },
  }
}

function load() {
  if (!fs.existsSync(DATA_FILE)) return defaultData()
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'))
  } catch {
    return defaultData()
  }
}

export const data = load()

export function save() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
}

export function nextId(collection) {
  data.counters[collection] = (data.counters[collection] || 0) + 1
  return data.counters[collection]
}

export default data
