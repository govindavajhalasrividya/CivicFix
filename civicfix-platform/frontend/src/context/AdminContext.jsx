import { createContext, useContext, useState } from 'react'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token') || null)

  const login = (jwt) => {
    localStorage.setItem('admin_token', jwt)
    setToken(jwt)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    setToken(null)
  }

  return (
    <AdminContext.Provider value={{ token, login, logout, isAdmin: !!token }}>
      {children}
    </AdminContext.Provider>
  )
}

export const useAdmin = () => useContext(AdminContext)
