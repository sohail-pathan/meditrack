import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authService.getMe()
        .then(res => {
          const data = res.data.data
          setUser({
            name:   data.name   || localStorage.getItem('name'),
            role:   data.role   || localStorage.getItem('role'),
            userId: data.userId || localStorage.getItem('userId'),
            email:  data.email,
          })
        })
        .catch(() => {
          localStorage.clear()
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    const { token, role, name, userId } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    localStorage.setItem('userId', userId)
    setUser({ name, role, userId })
    return role
  }

  const register = async (data) => {
    const res = await authService.register(data)
    const { token, role, name, userId } = res.data.data
    localStorage.setItem('token', token)
    localStorage.setItem('role', role)
    localStorage.setItem('name', name)
    localStorage.setItem('userId', userId)
    setUser({ name, role, userId })
    return role
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
