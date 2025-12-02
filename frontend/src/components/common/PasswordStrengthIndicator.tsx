import React from 'react'
import { FaCheckCircle, FaTimesCircle, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa'
import { checkPasswordStrength } from '../../lib/validation/schemas'

interface PasswordStrengthIndicatorProps {
    password: string
    showPassword?: boolean
    onToggleShowPassword?: () => void
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
    password,
    showPassword = false,
    onToggleShowPassword,
}) => {
    const { checks, strength } = checkPasswordStrength(password)

    const getStrengthColor = () => {
        if (strength === 100) return 'bg-green-500'
        if (strength >= 60) return 'bg-yellow-500'
        if (strength >= 20) return 'bg-orange-500'
        return 'bg-red-500'
    }

    const getStrengthText = () => {
        if (strength === 100) return 'Strong'
        if (strength >= 60) return 'Good'
        if (strength >= 20) return 'Fair'
        return 'Weak'
    }

    const getStrengthTextColor = () => {
        if (strength === 100) return 'text-green-700'
        if (strength >= 60) return 'text-yellow-700'
        if (strength >= 20) return 'text-orange-700'
        return 'text-red-700'
    }

    return (
        <div className="space-y-3">
            {/* Password visibility toggle */}
            {password && onToggleShowPassword && (
                <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                        <FaLock className="mr-2" />
                        <span>Password Strength</span>
                    </div>
                    <button
                        type="button"
                        onClick={onToggleShowPassword}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        {showPassword ? (
                            <>
                                <FaEyeSlash className="mr-1" />
                                Hide
                            </>
                        ) : (
                            <>
                                <FaEye className="mr-1" />
                                Show
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Strength bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                    className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                    style={{ width: `${strength}%` }}
                />
            </div>

            {/* Strength label */}
            <div className="flex justify-between items-center">
                <span className={`text-sm font-medium ${getStrengthTextColor()}`}>
                    {password ? getStrengthText() : 'Enter a password'}
                </span>
                <span className="text-xs text-gray-500">{strength}%</span>
            </div>

            {/* Password requirements */}
            {password && (
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">Requirements:</h4>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div
                            className={`flex items-center ${checks.length ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {checks.length ? (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            ) : (
                                <FaTimesCircle className="mr-2 text-gray-400" />
                            )}
                            <span className="text-sm">8+ characters</span>
                        </div>

                        <div
                            className={`flex items-center ${checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {checks.uppercase ? (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            ) : (
                                <FaTimesCircle className="mr-2 text-gray-400" />
                            )}
                            <span className="text-sm">Uppercase letter</span>
                        </div>

                        <div
                            className={`flex items-center ${checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {checks.lowercase ? (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            ) : (
                                <FaTimesCircle className="mr-2 text-gray-400" />
                            )}
                            <span className="text-sm">Lowercase letter</span>
                        </div>

                        <div
                            className={`flex items-center ${checks.number ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {checks.number ? (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            ) : (
                                <FaTimesCircle className="mr-2 text-gray-400" />
                            )}
                            <span className="text-sm">Number</span>
                        </div>

                        <div
                            className={`flex items-center ${checks.special ? 'text-green-600' : 'text-gray-500'}`}
                        >
                            {checks.special ? (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            ) : (
                                <FaTimesCircle className="mr-2 text-gray-400" />
                            )}
                            <span className="text-sm">Special character (@$!%*?&)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Password examples */}
            {!password && (
                <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="mb-2 text-sm text-gray-600">
                        Examples of strong passwords:
                    </p>
                    <div className="space-y-1">
                        <code className="block py-1 px-2 text-xs bg-gray-100 rounded">
                            Secure@Pass123
                        </code>
                        <code className="block py-1 px-2 text-xs bg-gray-100 rounded">
                            Winter#2024Snow
                        </code>
                        <code className="block py-1 px-2 text-xs bg-gray-100 rounded">
                            My$tr0ngP@ss!
                        </code>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PasswordStrengthIndicator
