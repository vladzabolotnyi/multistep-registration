import axios from 'axios'
import type { FormData } from '../types/form'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            return Promise.reject(error.response.data)
        } else if (error.request) {
            return Promise.reject({ error: 'Network error. Please try again.' })
        } else {
            return Promise.reject({ error: error.message })
        }
    },
)

export const apiService = {
    checkUsername: async (username: string) => {
        return api.post<{ available: boolean; message: string }>('/check-username', {
            username,
        })
    },

    submitRegistration: async (data: FormData) => {
        return api.post<{ success: boolean; message: string }>('/register', data)
    },
}

export default api
