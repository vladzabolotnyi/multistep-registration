import React, { useState, useEffect, useCallback } from 'react'
import { FaCheckCircle, FaTimesCircle, FaSpinner, FaUser } from 'react-icons/fa'
import { apiService } from '../../services/api'

interface UsernameAvailabilityCheckerProps {
    username: string
    onAvailabilityChange?: (available: boolean) => void
    disabled?: boolean
}

const UsernameAvailabilityChecker: React.FC<UsernameAvailabilityCheckerProps> = ({
    username,
    onAvailabilityChange,
    disabled = false,
}) => {
    const [isChecking, setIsChecking] = useState(false)
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
    const [lastChecked, setLastChecked] = useState<string>('')
    const [error, setError] = useState<string>('')

    // Mock usernames that are taken (for simulation)
    const TAKEN_USERNAMES = [
        'john_doe',
        'admin',
        'testuser',
        'username',
        'demo123',
        'user123',
    ]

    const checkUsernameAvailability = useCallback(
        async (usernameToCheck: string) => {
            if (!usernameToCheck || usernameToCheck.length < 3 || disabled) {
                setIsAvailable(null)
                setError('')
                return
            }

            setIsChecking(true)
            setError('')

            try {
                // Simulate API call with timeout
                await new Promise((resolve) => setTimeout(resolve, 800))

                // Mock check - in real app, this would be apiService.checkUsername(usernameToCheck)
                const isTaken = TAKEN_USERNAMES.includes(usernameToCheck.toLowerCase())
                const available = !isTaken

                setIsAvailable(available)
                setLastChecked(usernameToCheck)

                if (onAvailabilityChange) {
                    onAvailabilityChange(available)
                }

                if (isTaken) {
                    setError(`Username "${usernameToCheck}" is already taken`)
                }
            } catch (err) {
                setError('Unable to check username availability. Please try again.')
                setIsAvailable(null)
                console.error('Username check error:', err)
            } finally {
                setIsChecking(false)
            }
        },
        [onAvailabilityChange, disabled],
    )

    // Debounced username check
    useEffect(() => {
        if (username.length < 6) {
            setIsAvailable(null)
            setError(username.length > 0 ? 'Username must be at least 6 characters' : '')
            return
        }

        if (username === lastChecked) return

        const timer = setTimeout(() => {
            checkUsernameAvailability(username)
        }, 500) // Debounce delay

        return () => clearTimeout(timer)
    }, [username, lastChecked, checkUsernameAvailability])

    if (disabled) return null

    return (
        <div className="mt-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center">
                    <FaUser className="mr-2 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">
                        Username Availability
                    </span>
                </div>

                {isChecking ? (
                    <div className="flex items-center text-blue-600">
                        <FaSpinner className="mr-1 animate-spin" />
                        <span className="text-xs">Checking...</span>
                    </div>
                ) : isAvailable === true ? (
                    <div className="flex items-center text-green-600">
                        <FaCheckCircle className="mr-1" />
                        <span className="text-xs font-medium">Available</span>
                    </div>
                ) : isAvailable === false ? (
                    <div className="flex items-center text-red-600">
                        <FaTimesCircle className="mr-1" />
                        <span className="text-xs font-medium">Taken</span>
                    </div>
                ) : username.length >= 6 ? (
                    <div className="text-xs text-gray-500">
                        Type to check availability
                    </div>
                ) : null}
            </div>

            {error && (
                <p className="flex items-center mt-1 text-sm text-red-600">
                    <FaTimesCircle className="mr-1 w-3 h-3" />
                    {error}
                </p>
            )}

            {isAvailable === true && (
                <div className="p-2 mt-2 bg-green-50 rounded-lg border border-green-200">
                    <p className="flex items-center text-sm text-green-700">
                        <FaCheckCircle className="mr-2 text-green-500" />
                        <span className="font-medium">Great choice!</span> Username "
                        {username}" is available.
                    </p>
                </div>
            )}

            {/* Suggestions for taken usernames */}
            {isAvailable === false && username.length >= 6 && (
                <div className="p-3 mt-2 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="mb-2 text-sm font-medium text-blue-800">
                        Try these suggestions:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                        {[
                            `${username}123`,
                            `${username}_2024`,
                            `real_${username}`,
                            `the_${username}`,
                        ].map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => {
                                    // This would ideally update the form field
                                    // We'll handle this in the parent component
                                    if (onAvailabilityChange) {
                                        checkUsernameAvailability(suggestion)
                                    }
                                }}
                                className="py-1 px-3 text-xs text-blue-700 bg-white rounded-full border border-blue-300 transition-colors hover:bg-blue-50"
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Username tips */}
            <div className="mt-3 text-xs text-gray-500">
                <p className="mb-1 font-medium">Username requirements:</p>
                <ul className="space-y-1 list-disc list-inside">
                    <li>6-30 characters</li>
                    <li>Letters, numbers, and underscores only</li>
                    <li>No spaces or special characters</li>
                    <li>Case insensitive (User123 = user123)</li>
                </ul>
            </div>
        </div>
    )
}

export default UsernameAvailabilityChecker
