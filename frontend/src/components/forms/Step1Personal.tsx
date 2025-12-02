import React from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa'

const Step1Personal: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
    } = useFormContext()

    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const email = watch('email')
    const phoneNumber = watch('phoneNumber')

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
                error={errors.email?.message as string}
                {...register('email')}
                helperText="We'll never share your email with anyone else"
                required
                leftIcon={<FaEnvelope />}
                showSuccess={getFieldStatus('email', email) === 'success'}
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

export default Step1Personal
