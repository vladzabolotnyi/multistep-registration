import React from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import { FaUser, FaEnvelope, FaPhone, FaCheckCircle } from 'react-icons/fa'

const Step1Personal: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
    } = useFormContext()

    // Watch specific fields for real-time validation feedback
    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const email = watch('email')
    const phoneNumber = watch('phoneNumber')

    // Helper to check if field is valid and touched
    const getFieldStatus = (fieldName: string, value: string) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
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

                {/* Last Name */}
                <Input
                    label="Last Name"
                    type="text"
                    placeholder="Enter your last name"
                    error={errors.lastName?.message as string}
                    {...register('lastName')} // Spread register directly
                    helperText="e.g., Doe"
                    required
                    leftIcon={<FaUser />}
                    showSuccess={getFieldStatus('lastName', lastName) === 'success'}
                />
            </div>

            {/* Email */}
            <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email address"
                error={errors.email?.message as string}
                {...register('email')} // Spread register directly
                helperText="We'll never share your email with anyone else"
                required
                leftIcon={<FaEnvelope />}
                showSuccess={getFieldStatus('email', email) === 'success'}
            />

            {/* Phone Number */}
            <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="e.g., 123-456-7890 or (123) 456-7890"
                error={errors.phoneNumber?.message as string}
                {...register('phoneNumber')} // Spread register directly
                helperText="Include area code. International format supported."
                leftIcon={<FaPhone />}
                showSuccess={
                    phoneNumber &&
                    getFieldStatus('phoneNumber', phoneNumber) === 'success'
                }
            />

            {/* Validation Status */}
            <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="mb-3 font-medium text-gray-800">Validation Status</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div
                        className={`flex items-center ${errors.firstName ? 'text-red-600' : firstName ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.firstName ? (
                            <FaCheckCircle className="mr-2 text-red-500" />
                        ) : firstName ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">First Name {firstName ? '✓' : ''}</span>
                    </div>

                    <div
                        className={`flex items-center ${errors.lastName ? 'text-red-600' : lastName ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.lastName ? (
                            <FaCheckCircle className="mr-2 text-red-500" />
                        ) : lastName ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">Last Name {lastName ? '✓' : ''}</span>
                    </div>

                    <div
                        className={`flex items-center ${errors.email ? 'text-red-600' : email ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.email ? (
                            <FaCheckCircle className="mr-2 text-red-500" />
                        ) : email ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Email {email && !errors.email ? '✓' : ''}
                        </span>
                    </div>

                    <div className="flex items-center text-gray-500">
                        <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        <span className="text-sm">Phone Number (Optional)</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step1Personal
