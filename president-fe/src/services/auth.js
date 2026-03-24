import { HARDCODED_USERS, AUTH_STORAGE_KEY } from '../utils/constants'

export function login(email, password) {
  const user = HARDCODED_USERS.find(
    (u) => u.email === email && u.password === password
  )
  if (!user) {
    throw new Error('Invalid email or password.')
  }
  const { password: _pw, ...safeUser } = user
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(safeUser))
  return safeUser
}

export function logout() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
