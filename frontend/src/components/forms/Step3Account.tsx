import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Checkbox from '../common/Checkbox'
import Alert from '../common/Alert'
import PasswordStrengthIndicator from '../common/PasswordStrengthIndicator'
import UsernameAvailabilityChecker from '../common/UsernameAvailabilityChecker'
import {
    FaUser,
    FaLock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaFileContract,
    FaEnvelope,
    FaShieldAlt,
    FaInfoCircle,
    FaEye,
} from 'react-icons/fa'
import { checkPasswordStrength } from '../../lib/validation/schemas'

const Step3Account: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        trigger,
    } = useFormContext()

    // Watch form fields
    const username = watch('username')
    const password = watch('password')
    const confirmPassword = watch('confirmPassword')
    const acceptTerms = watch('acceptTerms')
    const newsletter = watch('newsletter')

    // Local state
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
    })

    // Update password checks when password changes
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

    // Handle username availability change
    const handleUsernameAvailabilityChange = (available: boolean) => {
        setUsernameAvailable(available)

        // If username is taken, set error
        if (!available && username) {
            // Error is already shown by UsernameAvailabilityChecker
        }
    }

    // Handle password visibility toggle
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword)
    }

    // Handle username suggestion click
    const handleSuggestionClick = (suggestion: string) => {
        setValue('username', suggestion, { shouldValidate: true, shouldDirty: true })
        trigger('username')
    }

    const isPasswordStrong = Object.values(passwordChecks).every(Boolean)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Account Setup</h2>
                <p className="text-gray-600">
                    Create your account credentials and preferences.
                </p>
            </div>

            {/* Username */}
            <div className="space-y-4">
                <Input
                    label="Username"
                    type="text"
                    placeholder="Choose a username"
                    error={errors.username?.message as string}
                    {...register('username')}
                    helperText="This will be your public display name"
                    required
                    leftIcon={<FaUser />}
                    showSuccess={
                        getFieldStatus('username', username) === 'success' &&
                        usernameAvailable === true
                    }
                />

                {/* Username Availability Checker */}
                <UsernameAvailabilityChecker
                    username={username || ''}
                    onAvailabilityChange={handleUsernameAvailabilityChange}
                />
            </div>

            {/* Password */}
            <div className="space-y-4">
                <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    error={errors.password?.message as string}
                    {...register('password')}
                    required
                    leftIcon={<FaLock />}
                    showSuccess={isPasswordStrong}
                />

                {/* Password Strength Indicator */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <PasswordStrengthIndicator
                        password={password || ''}
                        showPassword={showPassword}
                        onToggleShowPassword={togglePasswordVisibility}
                    />
                </div>
            </div>

            {/* Confirm Password */}
            <Input
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message as string}
                {...register('confirmPassword')}
                required
                leftIcon={<FaShieldAlt />}
                showSuccess={
                    getFieldStatus('confirmPassword', confirmPassword) === 'success' &&
                    password === confirmPassword
                }
                rightIcon={
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        {showConfirmPassword ? <FaEye /> : <FaEye />}
                    </button>
                }
            />

            {/* Terms and Conditions */}
            <div className="p-4 rounded-lg border border-gray-200">
                <Checkbox
                    label="I agree to the Terms and Conditions"
                    error={errors.acceptTerms?.message as string}
                    {...register('acceptTerms')}
                    required
                />

                <div className="p-3 mt-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start">
                        <FaFileContract className="flex-shrink-0 mt-0.5 mr-3 w-5 h-5 text-blue-500" />
                        <div>
                            <h4 className="mb-1 font-medium text-blue-800">
                                Terms & Conditions
                            </h4>
                            <p className="text-sm text-blue-700">
                                By checking this box, you agree to our Terms of Service,
                                Privacy Policy, and Cookie Policy. You must be at least 18
                                years old to create an account.
                            </p>
                            <div className="flex mt-2 space-x-4">
                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    onClick={() =>
                                        alert('Terms of Service would open here')
                                    }
                                >
                                    View Terms
                                </button>
                                <button
                                    type="button"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    onClick={() =>
                                        alert('Privacy Policy would open here')
                                    }
                                >
                                    Privacy Policy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="p-4 rounded-lg border border-gray-200">
                <Checkbox
                    label="Subscribe to our newsletter"
                    {...register('newsletter')}
                    helperText="Get updates about new features, tips, and special offers"
                />

                {newsletter && (
                    <div className="p-3 mt-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center">
                            <FaEnvelope className="mr-3 w-5 h-5 text-green-500" />
                            <div>
                                <p className="text-sm text-green-700">
                                    <span className="font-medium">
                                        Thank you for subscribing!
                                    </span>{' '}
                                    You'll receive our weekly newsletter with the latest
                                    updates.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Validation Status */}
            <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="mb-3 font-medium text-gray-800">Account Setup Status</h4>
                <div className="space-y-3">
                    {/* Username Status */}
                    <div
                        className={`flex items-center ${errors.username ? 'text-red-600' : username && usernameAvailable ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.username ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : username && usernameAvailable ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : username ? (
                            <FaExclamationTriangle className="mr-2 text-yellow-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Username:{' '}
                            {username
                                ? usernameAvailable
                                    ? 'Available ✓'
                                    : 'Checking...'
                                : 'Required'}
                        </span>
                    </div>

                    {/* Password Status */}
                    <div
                        className={`flex items-center ${errors.password ? 'text-red-600' : isPasswordStrong ? 'text-green-600' : password ? 'text-yellow-600' : 'text-gray-500'}`}
                    >
                        {errors.password ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : isPasswordStrong ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : password ? (
                            <FaExclamationTriangle className="mr-2 text-yellow-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Password Strength:{' '}
                            {password
                                ? isPasswordStrong
                                    ? 'Strong ✓'
                                    : 'Needs improvement'
                                : 'Required'}
                        </span>
                    </div>

                    {/* Confirm Password Status */}
                    <div
                        className={`flex items-center ${errors.confirmPassword ? 'text-red-600' : confirmPassword && password === confirmPassword ? 'text-green-600' : confirmPassword ? 'text-red-600' : 'text-gray-500'}`}
                    >
                        {errors.confirmPassword ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : confirmPassword && password === confirmPassword ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : confirmPassword ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Password Match:{' '}
                            {confirmPassword
                                ? password === confirmPassword
                                    ? 'Matches ✓'
                                    : 'Does not match'
                                : 'Required'}
                        </span>
                    </div>

                    {/* Terms Status */}
                    <div
                        className={`flex items-center ${errors.acceptTerms ? 'text-red-600' : acceptTerms ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.acceptTerms ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : acceptTerms ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Terms & Conditions: {acceptTerms ? 'Accepted ✓' : 'Required'}
                        </span>
                    </div>

                    {/* Newsletter Status */}
                    <div className="flex items-center text-gray-500">
                        <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        <span className="text-sm">
                            Newsletter: {newsletter ? 'Subscribed' : 'Optional'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Security Tips */}
            <div className="p-4 mt-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="flex items-center mb-2 font-medium text-blue-800">
                    <FaShieldAlt className="mr-2" />
                    Security Tips
                </h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-blue-700">
                    <li>Use a unique password that you don't use elsewhere</li>
                    <li>Consider using a password manager for better security</li>
                    <li>Enable two-factor authentication when available</li>
                    <li>Never share your password with anyone</li>
                    <li>Regularly update your password for optimal security</li>
                </ul>
            </div>

            {/* Account Benefits */}
            <div className="p-4 mt-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="mb-2 font-medium text-green-800">Account Benefits</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="flex items-start">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">
                            Save your preferences and settings
                        </span>
                    </div>
                    <div className="flex items-start">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">
                            Access exclusive features
                        </span>
                    </div>
                    <div className="flex items-start">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">
                            Track your activity history
                        </span>
                    </div>
                    <div className="flex items-start">
                        <FaCheckCircle className="flex-shrink-0 mt-0.5 mr-2 w-5 h-5 text-green-500" />
                        <span className="text-sm text-green-700">
                            Receive personalized recommendations
                        </span>
                    </div>
                </div>
            </div>

            {/* Warning for taken usernames */}
            {usernameAvailable === false && (
                <Alert
                    type="warning"
                    title="Username Already Taken"
                    message={`The username "${username}" is not available. Please choose a different username or try one of our suggestions above.`}
                />
            )}

            {/* Final validation check */}
            <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-center">
                    <div>
                        <h4 className="font-medium text-gray-800">Ready to Continue?</h4>
                        <p className="text-sm text-gray-600">
                            All required fields must be completed correctly before
                            proceeding to review.
                        </p>
                    </div>
                    <div className="flex items-center">
                        {username &&
                        isPasswordStrong &&
                        password === confirmPassword &&
                        acceptTerms ? (
                            <div className="flex items-center text-green-600">
                                <FaCheckCircle className="mr-2 text-green-500" />
                                <span className="font-medium">
                                    All requirements met ✓
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center text-gray-500">
                                <FaInfoCircle className="mr-2" />
                                <span>Complete all fields</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step3Account
