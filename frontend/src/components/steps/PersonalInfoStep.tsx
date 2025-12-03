import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaSpinner,
    FaCheckCircle,
    FaTimesCircle,
} from 'react-icons/fa'
import { useEmailValidation } from '../../hooks/useEmailValidation'

const PersonalInfoStep: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setError,
        clearErrors,
    } = useFormContext()

    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const email = watch('email')
    const phoneNumber = watch('phoneNumber')

    const {
        checkEmail,
        isChecking,
        isAvailable,
        reset: resetEmailCheck,
        error: validationError,
    } = useEmailValidation()

    const getFieldStatus = (fieldName: string, value: string) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
    }

    useEffect(() => {
        if (!email || errors.email) {
            resetEmailCheck()
            return
        }

        const timeoutId = setTimeout(async () => {
            const available = await checkEmail(email)

            if (!available) {
                setError('email', {
                    type: 'manual',
                    message: `Email "${email}" is already taken`,
                })
            } else {
                clearErrors('email')
            }
        }, 1000)

        return () => clearTimeout(timeoutId)
    }, [email, checkEmail, setError, clearErrors, resetEmailCheck, errors.email])

    const getEmailRightIcon = () => {
        if (isChecking) {
            return <FaSpinner className="text-gray-400 animate-spin" />
        }
        if (isAvailable === true && email) {
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
                <h2 className="mb-2 text-2xl font-bold text-gray-900">
                    Personal Information
                </h2>
                <p className="text-gray-600">
                    Please provide your personal details. All fields marked with * are
                    required.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                    label="First Name"
                    type="text"
                    placeholder="Enter your first name"
                    error={errors.firstName?.message as string}
                    {...register('firstName')}
                    helperText="e.g., John"
                    required
                    leftIcon={<FaUser />}
                    showSuccess={getFieldStatus('firstName', firstName) === 'success'}
                />

                <Input
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    error={errors.lastName?.message as string}
                    {...register('lastName')}
                    helperText="e.g., Doe"
                    required
                    leftIcon={<FaUser />}
                    showSuccess={getFieldStatus('lastName', lastName) === 'success'}
                />
            </div>

            <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                error={validationError || (errors.email?.message as string)}
                {...register('email')}
                helperText="We'll never share your email with anyone else"
                required
                leftIcon={<FaEnvelope />}
                rightIcon={getEmailRightIcon()}
                showSuccess={
                    getFieldStatus('email', email) === 'success' && isAvailable === true
                }
            />

            <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="e.g., 123-456-7890 or (123) 456-7890"
                error={errors.phoneNumber?.message as string}
                {...register('phoneNumber')}
                helperText="Include area code. International format supported."
                leftIcon={<FaPhone />}
                showSuccess={
                    phoneNumber &&
                    getFieldStatus('phoneNumber', phoneNumber) === 'success'
                }
            />
        </div>
    )
}

export default PersonalInfoStep
