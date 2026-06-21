export const ROLES = { PATIENT:'patient', DOCTOR:'doctor', ADMIN:'admin' }
export const ROUTES = {
  HOME:'/', LOGIN:'/login', REGISTER:'/register', PROFILE:'/profile',
  DOCTOR_SEARCH:'/doctors', DOCTOR_PROFILE:'/doctors/:id', BOOKING:'/doctors/:id/book',
  PATIENT_DASHBOARD:'/patient/dashboard',
  DOCTOR_DASHBOARD:'/doctor/dashboard', DOCTOR_SCHEDULE:'/doctor/schedule',
  ADMIN_DASHBOARD:'/admin/dashboard', ADMIN_USERS:'/admin/users', ADMIN_CONFIG:'/admin/config',
  NOT_FOUND:'*',
}
export const APPOINTMENT_STATUS = {
  PENDING:'pending', APPROVED:'approved', REJECTED:'rejected', CANCELLED:'cancelled', COMPLETED:'completed',
}
export const DEFAULT_PAGE_SIZE = 10
export const APP_NAME = 'MediBook'
