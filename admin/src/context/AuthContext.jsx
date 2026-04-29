import React, { createContext, useContext, useState, useEffect } from 'react'
import API from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing admin session on mount
  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const adminData = localStorage.getItem('admin')

      if (adminData) {
        // Try to verify by calling dashboard stats
        // If the cookies are valid, this will succeed
        // If cookies are expired/invalid, this will fail
        try {
          const res = await API({
            url: SummaryApi.adminDashboardStats.url,
            method: SummaryApi.adminDashboardStats.method,
          })
          
          if (res.data.success) {
            setAdmin(JSON.parse(adminData))
          } else {
            // Token invalid, clear storage
            logout()
          }
        } catch (apiErr) {
          // API call failed - cookies might be expired
          // Clear storage and require re-login
          console.log('Session expired, please login again')
          logout()
        }
      }
    } catch (err) {
      console.error('Auth check failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)

      const res = await API({
        url: '/api/user/login',
        method: 'post',
        data: { email, password }
      })

      if (res.data.success) {
        // Backend returns user data in res.data.data
        const userData = res.data.data

        // Check if user is admin (case insensitive)
        if (userData.role?.toLowerCase() !== 'admin') {
          throw new Error('Access denied. Admin credentials required.')
        }

        // Store token and user data (token is in HTTP-only cookie, not returned)
        localStorage.setItem('admin', JSON.stringify(userData))
        
        setAdmin(userData)
        return { success: true, user: userData }
      } else {
        throw new Error(res.data.message || 'Login failed')
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed'
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  const value = {
    admin,
    loading,
    login,
    logout,
    // Helper to check if user is authenticated (admin data exists in localStorage)
    isAuthenticated: !!admin && !!localStorage.getItem('admin'),
    // Helper to check if user is admin (case insensitive)
    isAdmin: admin?.role?.toLowerCase() === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext

