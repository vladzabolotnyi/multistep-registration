import { useState, useCallback } from 'react'
import { apiService } from '../services/api'
import type { ErrorResponse } from '../services/api.types'

export const useEmailValidation = () => {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)

    const checkEmail = useCallback(async (email: string): Promise<boolean> => {
        if (!email) {
            setIsAvailable(null)
            return false
        }

        setIsChecking(true)

        try {
            const { available } = await apiService.checkEmail(email)
            setIsAvailable(available)

            return available
        } catch (err) {
            const errorResponse = err as ErrorResponse
            setError(errorResponse.message)
            setIsAvailable(null)

            return false
        } finally {
            setIsChecking(false)
        }
    }, [])

    const reset = useCallback(() => {
        setIsAvailable(null)
        setIsChecking(false)
    }, [])

    return {
        checkEmail,
        isChecking,
        isAvailable,
        reset,
        error,
    }
}
