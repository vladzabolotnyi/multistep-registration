import React, { useState, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Checkbox from '../common/Checkbox'
import Alert from '../common/Alert'
import { FaUser, FaLock, FaFileContract, FaShieldAlt, FaEye } from 'react-icons/fa'
import { checkPasswordStrength } from '../../lib/validation/schemas'

const Step3Account: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
    } = useFormContext()

    const username = watch('username')
    const password = watch('password')
    const confirmPassword = watch('confirmPassword')

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
                {/* <div className="p-4 bg-gray-50 rounded-lg border border-gray-200"> */}
                {/*     <PasswordStrengthIndicator */}
                {/*         password={password || ''} */}
                {/*         showPassword={showPassword} */}
                {/*         onToggleShowPassword={togglePasswordVisibility} */}
                {/*     /> */}
                {/* </div> */}
            </div>

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

            {/* Newsletter Subscription */}
            <div className="p-4 rounded-lg border border-gray-200">
                <Checkbox
                    label="Subscribe to our newsletter"
                    {...register('newsletter')}
                    helperText="Get updates about new features, tips, and special offers"
                />
            </div>

            {/* Warning for taken usernames */}
            {usernameAvailable === false && (
                <Alert
                    type="warning"
                    title="Username Already Taken"
                    message={`The username "${username}" is not available. Please choose a different username or try one of our suggestions above.`}
                />
            )}
        </div>
    )
}

export default Step3Account
