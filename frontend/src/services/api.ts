import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            return Promise.reject(error.response.data)
        } else if (error.request) {
            // No response received
            return Promise.reject({ error: 'Network error. Please try again.' })
        } else {
            // Request setup error
            return Promise.reject({ error: error.message })
        }
    },
)

export const apiService = {
    // Check username availability
    checkUsername: async (username: string) => {
        return api.post<{ available: boolean; message: string }>('/check-username', {
            username,
        })
    },

    // Submit registration
    submitRegistration: async (data: any) => {
        return api.post<{ success: boolean; message: string }>('/register', data)
    },

    // Get countries list (could be from API or local)
    getCountries: async () => {
        return api.get<Array<{ code: string; name: string; tlds: string[] }>>(
            '/countries',
        )
    },

    // Get states based on country
    getStates: async (countryCode: string) => {
        return api.get<Array<{ code: string; name: string }>>(`/states/${countryCode}`)
    },
}

export default api
