import { useState, useCallback } from 'react'

// Mock API - replace with actual API call
const TAKEN_USERNAMES = [
    'john_doe',
    'admin',
    'testuser',
    'username',
    'demo123',
    'user123',
]

export const useUsernameValidation = () => {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)

    const checkUsername = useCallback(async (username: string): Promise<boolean> => {
        if (!username || username.length < 6) {
            setIsAvailable(null)
            return false
        }

        setIsChecking(true)

        try {
            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500))

            // TODO: Replace with actual API call
            // const response = await fetch(`/api/check-username/${username}`)
            // const data = await response.json()
            // const available = data.available

            const available = !TAKEN_USERNAMES.includes(username.toLowerCase())
            setIsAvailable(available)
            return available
        } catch (error) {
            console.error('Username check failed:', error)
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
    }
}
