import { useState, useCallback } from 'react'
import { apiService } from '../services/api'
import type { ErrorResponse } from '../services/api.types'

export const useUsernameValidation = () => {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [error, setError] = useState<string | null>(null)

    const checkUsername = useCallback(async (username: string): Promise<boolean> => {
        if (!username || username.length < 6) {
            setIsAvailable(null)
            return false
        }

        setIsChecking(true)

        try {
            const { available } = await apiService.checkUsername(username)
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
        checkUsername,
        isChecking,
        isAvailable,
        reset,
        error,
    }
}
