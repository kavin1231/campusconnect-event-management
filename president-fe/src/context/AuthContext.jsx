import { createContext, useContext, useState } from 'react'
import { login as authLogin, logout as authLogout, getCurrentUser } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getCurrentUser())

  function login(email, password) {
    const loggedInUser = authLogin(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  function logout() {
    authLogout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
