import { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest, setToken, clearToken, getToken } from '../api.js'

const AuthContext = createContext(null)

const SESSION_KEY = 'mwe_current_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restore session from localStorage (token + cached user info)
    const raw = localStorage.getItem(SESSION_KEY)
    if (raw && getToken()) setUser(JSON.parse(raw))
    setLoading(false)
  }, [])

  async function register({ name, email, password, role }) {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: { name, email, password, role },
    })
    return data.user
  }

  async function login(email, password) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    setToken(data.token)
    localStorage.setItem(SESSION_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    clearToken()
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
