import axios from 'axios'
import type { FormData } from '../types/form'
import type {
    AvailabilityResponse,
    ErrorResponse,
    RegistrationResponse,
} from './api.types'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

export const apiService = {
    checkUsername: async (username: string): Promise<AvailabilityResponse> => {
        try {
            const response = await api.get<AvailabilityResponse>('/check-username', {
                params: { username },
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw error.response.data as ErrorResponse
            }
            throw {
                code: 'UNKNOWN_ERROR',
                message: 'An unexpected error occurred',
            } as ErrorResponse
        }
    },

    checkEmail: async (email: string): Promise<AvailabilityResponse> => {
        try {
            const response = await api.get<AvailabilityResponse>('/check-email', {
                params: { email },
            })
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw error.response.data as ErrorResponse
            }
            throw {
                code: 'UNKNOWN_ERROR',
                message: 'An unexpected error occurred',
            } as ErrorResponse
        }
    },

    submitRegistration: async (data: FormData): Promise<RegistrationResponse> => {
        try {
            const response = await api.post<RegistrationResponse>('/register', data)
            return response.data
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.data) {
                throw error.response.data as ErrorResponse
            }
            throw {
                code: 'UNKNOWN_ERROR',
                message: 'An unexpected error occurred',
            } as ErrorResponse
        }
    },
}
