import { ROLES, ROUTES } from './constants'
export const ROUTE_PERMISSIONS = {
  [ROUTES.PROFILE]:           [],
  [ROUTES.PATIENT_DASHBOARD]: [ROLES.PATIENT],
  [ROUTES.BOOKING]:           [ROLES.PATIENT],
  [ROUTES.DOCTOR_DASHBOARD]:  [ROLES.DOCTOR],
  [ROUTES.DOCTOR_SCHEDULE]:   [ROLES.DOCTOR],
  [ROUTES.ADMIN_DASHBOARD]:   [ROLES.ADMIN],
  [ROUTES.ADMIN_USERS]:       [ROLES.ADMIN],
  [ROUTES.ADMIN_CONFIG]:      [ROLES.ADMIN],
}
export const canAccess = (role, route) => {
  const allowed = ROUTE_PERMISSIONS[route]
  if (allowed === undefined) return true
  if (allowed.length === 0) return !!role
  return allowed.includes(role)
}
export const defaultRedirect = (role) => {
  switch(role) {
    case ROLES.PATIENT: return ROUTES.PATIENT_DASHBOARD
    case ROLES.DOCTOR:  return ROUTES.DOCTOR_DASHBOARD
    case ROLES.ADMIN:   return ROUTES.ADMIN_DASHBOARD
    default:            return ROUTES.DOCTOR_SEARCH
  }
}
