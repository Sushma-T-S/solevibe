import axios from 'axios'
import { baseURL } from '../common/SummaryApi'
import toast from 'react-hot-toast'

// Create axios instance
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
Axios.interceptors.request.use(
  (config) => {
    // Use httpOnly cookies for auth - no Bearer token needed
    // const token = localStorage.getItem('adminToken')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    // Don't set Content-Type for FormData - let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors + 429 retry
Axios.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    let originalRequest = error.config
    const status = error.response?.status
    const data = error.response?.data

    // 429 Rate limit retry (once, after 2s)
    if (status === 429 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('Rate limited (429), retrying in 2s...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      return Axios(originalRequest)
    }

    if (error.response) {
      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - Clear admin data and redirect to login
          localStorage.removeItem('adminToken')
          localStorage.removeItem('admin')
          toast.error(data?.message || 'Session expired. Please login again.')
          window.location.href = '/admin/login'
          break

        case 403:
          // Forbidden
          toast.error(data?.message || 'Access denied')
          break

        case 404:
          // Not found
          toast.error(data?.message || 'Resource not found')
          break

        case 500:
          // Server error
          toast.error('Server error. Please try again later.')
          break

        case 429:
          toast.error(data?.message || 'Too many requests. Please wait a moment.')
          break

        default:
          // Other errors
          if (data?.message) {
            toast.error(data.message)
          }
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.')
    } else {
      // Other errors
      toast.error('An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

export default Axios

