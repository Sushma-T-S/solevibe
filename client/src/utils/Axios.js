import axios from "axios";
import SummaryApi , { baseURL } from "../common/SummaryApi";

const Axios = axios.create({
    baseURL : baseURL,
    withCredentials : true  // Important: Send cookies with requests
})

let refreshPromise = null
let lastRefreshFailedAt = 0

// Request interceptor - cookies are automatically sent with withCredentials: true
Axios.interceptors.request.use(
    async(config)=>{
        // No need to manually add Authorization header
        // Cookies are automatically sent with each request
        return config
    },
    (error)=>{
        return Promise.reject(error)
    }
)

// Response interceptor for handling token refresh
Axios.interceptors.response.use(
    (response)=>{
        return response
    },
    async(error)=>{
        let originalRequest = error.config 
        const now = Date.now()

        const isRefreshCall = originalRequest?.url === SummaryApi.refreshToken.url
        if (isRefreshCall) {
            return Promise.reject(error)
        }

        // If 401 Unauthorized and haven't retried yet
        if(error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true

            try {
                // Avoid spamming refresh endpoint when user is logged out
                if (now - lastRefreshFailedAt < 5000) {
                    return Promise.reject(error)
                }

                if (!refreshPromise) {
                    refreshPromise = Axios({
                        ...SummaryApi.refreshToken,
                    })
                    .then((res) => {
                        if (!res.data?.success) throw new Error(res.data?.message || "Refresh failed")
                        return res
                    })
                    .catch((e) => {
                        lastRefreshFailedAt = Date.now()
                        throw e
                    })
                    .finally(() => {
                        refreshPromise = null
                    })
                }

                const response = await refreshPromise

                if(response.data.success){
                    // Token is refreshed via cookies, retry original request
                    return Axios(originalRequest)
                }
            } catch (refreshError) {
                // If refresh fails, log the error and reject
                console.log("Token refresh failed:", refreshError)
            }
        }
        
        return Promise.reject(error)
    }
)

export default Axios
