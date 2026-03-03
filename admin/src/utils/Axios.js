import axios from 'axios'
import SummaryApi, { baseURL } from '../common/SummaryApi'

const API = axios.create({
  baseURL,
  withCredentials: true,
})

API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        await API({
          ...SummaryApi.refreshToken,
        })
        return API(originalRequest)
      } catch (e) {
        return Promise.reject(e)
      }
    }
    return Promise.reject(error)
  },
)

export default API

