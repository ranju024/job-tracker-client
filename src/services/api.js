import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
})

// auto attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// If a request fails with 401, try refreshing the access token once and
// retrying it. If the refresh itself fails, log the user out.
let refreshPromise = null

function clearSessionAndRedirect() {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    if (window.location.pathname !== '/login') {
        window.location.href = '/login'
    }
}

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config
        const status = error.response?.status
        const isAuthEndpoint =
            originalRequest?.url?.includes('/api/accounts/login/') ||
            originalRequest?.url?.includes('/api/accounts/token/refresh/')

        if (status !== 401 || isAuthEndpoint || originalRequest._retry) {
            return Promise.reject(error)
        }

        const refreshToken = localStorage.getItem('refresh')
        if (!refreshToken) {
            clearSessionAndRedirect()
            return Promise.reject(error)
        }

        originalRequest._retry = true

        try {
            // Share one in-flight refresh across concurrent 401s instead of
            // firing a refresh request per failed request.
            if (!refreshPromise) {
                refreshPromise = axios
                    .post(
                        `${api.defaults.baseURL}/api/accounts/token/refresh/`,
                        { refresh: refreshToken }
                    )
                    .finally(() => {
                        refreshPromise = null
                    })
            }

            const { data } = await refreshPromise
            localStorage.setItem('access', data.access)

            originalRequest.headers.Authorization = `Bearer ${data.access}`
            return api(originalRequest)
        } catch (refreshError) {
            clearSessionAndRedirect()
            return Promise.reject(refreshError)
        }
    }
)

export default api