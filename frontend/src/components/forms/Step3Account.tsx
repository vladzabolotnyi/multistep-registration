import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Checkbox from '../common/Checkbox'
import {
    FaUser,
    FaLock,
    FaFileContract,
    FaShieldAlt,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle,
} from 'react-icons/fa'
import { checkPasswordStrength } from '../../lib/validation/schemas'
import { useUsernameValidation } from '../../hooks/useUsernameValidation'

const Step3Account: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setError,
        clearErrors,
    } = useFormContext()

    const username = watch('username')
    const password = watch('password')
    const confirmPassword = watch('confirmPassword')

    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    })

    const {
        checkUsername,
        isChecking,
        isAvailable,
        reset: resetUsernameCheck,
    } = useUsernameValidation()

    useEffect(() => {
        if (!username || username.length < 6) {
            resetUsernameCheck()
            return
        }

        const timeoutId = setTimeout(async () => {
            const available = await checkUsername(username)

            if (!available) {
                setError('username', {
                    type: 'manual',
                    message: `Username "${username}" is already taken`,
                })
            } else {
                clearErrors('username')
            }
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [username, checkUsername, setError, clearErrors, resetUsernameCheck])

    useEffect(() => {
        if (password) {
            const { checks } = checkPasswordStrength(password)
            setPasswordChecks(checks)
        } else {
            setPasswordChecks({
                length: false,
                uppercase: false,
                lowercase: false,
                number: false,
                special: false,
            })
        }
    }, [password])

    const getFieldStatus = (fieldName: string, value: any) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
    }

    const isPasswordStrong = Object.values(passwordChecks).every(Boolean)

    const getUsernameRightIcon = () => {
        if (isChecking) {
            return <FaSpinner className="text-gray-400 animate-spin" />
        }
        if (isAvailable === true && username && username.length >= 6) {
            return <FaCheckCircle className="text-green-500" />
        }
        if (isAvailable === false) {
            return <FaTimesCircle className="text-red-500" />
        }
        return null
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Account Setup</h2>
                <p className="text-gray-600">
                    Create your account credentials and preferences.
                </p>
            </div>

            <div className="space-y-2">
                <Input
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                    error={errors.username?.message as string}
                    {...register('username')}
                    helperText="Minimum 6 characters, letters, numbers, and underscores only"
                    required
                    leftIcon={<FaUser />}
                    rightIcon={getUsernameRightIcon()}
                    showSuccess={
                        getFieldStatus('username', username) === 'success' &&
                        isAvailable === true
                    }
                />
            </div>

            <div className="space-y-2">
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    error={errors.password?.message as string}
                    {...register('password')}
                    required
                    leftIcon={<FaLock />}
                    rightIcon={
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    }
                    showSuccess={isPasswordStrong}
                />

                {password && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                            Password Requirements:
                        </p>
                        <ul className="space-y-1 text-sm">
                            <li
                                className={
                                    passwordChecks.length
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {passwordChecks.length ? '✓' : '○'} At least 8 characters
                            </li>
                            <li
                                className={
                                    passwordChecks.uppercase
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {passwordChecks.uppercase ? '✓' : '○'} One uppercase
                                letter
                            </li>
                            <li
                                className={
                                    passwordChecks.lowercase
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {passwordChecks.lowercase ? '✓' : '○'} One lowercase
                                letter
                            </li>
                            <li
                                className={
                                    passwordChecks.number
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {passwordChecks.number ? '✓' : '○'} One number
                            </li>
                            <li
                                className={
                                    passwordChecks.special
                                        ? 'text-green-600'
                                        : 'text-gray-500'
                                }
                            >
                                {passwordChecks.special ? '✓' : '○'} One special character
                                (@$!%*?&)
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message as string}
                {...register('confirmPassword')}
                required
                leftIcon={<FaShieldAlt />}
                rightIcon={
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                }
                showSuccess={
                    getFieldStatus('confirmPassword', confirmPassword) === 'success' &&
                    password === confirmPassword
                }
            />

            <div className="p-4 rounded-lg border border-gray-200">
                <Checkbox
                    label="I agree to the Terms and Conditions"
                    error={errors.acceptTerms?.message as string}
                    {...register('acceptTerms')}
                    required
                />
                <div className="p-3 mt-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                        <FaFileContract className="mt-0.5 mr-3 w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="mb-1 font-medium text-blue-800">
                                Terms & Conditions
                            </h4>
                            <p className="text-sm text-blue-700">
                                By checking this box, you agree to our Terms of Service
                            </p>
                            <div className="flex mt-2 space-x-4">
                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    onClick={() =>
                                        alert('Terms of Service page would open here')
                                    }
                                >
                                    View Terms
                                </button>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    onClick={() =>
                                        alert('Privacy Policy page would open here')
                                    }
                                >
                                    Privacy Policy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-lg border border-gray-200">
                <Checkbox
                    label="Subscribe to our newsletter"
                    {...register('newsletter')}
                    helperText="Get updates about new features, tips, and special offers"
                />
            </div>
        </div>
    )
}

export default Step3Account
