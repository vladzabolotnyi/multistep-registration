import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ProgressBar from '../common/ProgressBar'
import Button from '../common/Button'
import Alert from '../common/Alert'
import Step1Personal from '../forms/Step1Personal'
import Step2Address from '../forms/Step2Address'
import Step3Account from '../forms/Step3Account'
import ReviewStep from '../forms/ReviewStep'
import { useFormContext } from '../../contexts/FormContext'
import { COUNTRIES, STEPS } from '../../utils/constants'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import {
    personalInfoSchema,
    addressSchema,
    accountSchema,
    combinedSchema,
} from '../../lib/validation/schemas'

const MultiStepForm: React.FC = () => {
    const {
        formData,
        currentStep,
        errors,
        isLoading,
        setCurrentStep,
        setErrors,
        setIsLoading,
        clearForm,
        nextStep,
        prevStep,
    } = useFormContext()

    const getStepSchema = () => {
        switch (currentStep) {
            case 1:
                return personalInfoSchema
            case 2:
                return addressSchema
            case 3:
                return accountSchema
            case 4:
                return combinedSchema
            default:
                return undefined
        }
    }

    const methods = useForm({
        defaultValues: formData,
        mode: 'onChange',
        resolver: getStepSchema() ? zodResolver(getStepSchema()!) : undefined,
    })

    const saveFormData = async () => {
        const formValues = methods.getValues()
        const isValid = await methods.trigger()

        if (isValid) {
            // TODO: Replace local storage with memory
            localStorage.setItem('registration-form', JSON.stringify(formValues))
        }

        return isValid
    }

    const handleNext = async () => {
        if (currentStep === 4) return

        // For Step 2: Email domain validation
        if (currentStep === 2) {
            const email = methods.getValues('email')
            const country = methods.getValues('country')

            if (email && country) {
                const selectedCountry = COUNTRIES.find((c) => c.code === country)
                if (selectedCountry?.tlds?.length) {
                    const isValidDomain = selectedCountry.tlds.some((tld) =>
                        email.toLowerCase().endsWith(tld.toLowerCase()),
                    )

                    if (!isValidDomain) {
                        const errorMsg = `Email domain should end with ${selectedCountry.tlds.join(' or ')} for ${selectedCountry.name}`
                        methods.setError('email', {
                            type: 'manual',
                            message: errorMsg,
                        })

                        setErrors({
                            email: errorMsg,
                            ...methods.formState.errors,
                        })

                        return
                    }
                }
            }
        }

        if (currentStep === 3) {
            const username = methods.getValues('username')

            if (username.length < 6) {
                methods.setError('username', {
                    type: 'manual',
                    message: 'Username must be at least 6 characters',
                })
                return
            }

            // TODO: Update this logic. Now its mocked
            const TAKEN_USERNAMES = [
                'john_doe',
                'admin',
                'testuser',
                'username',
                'demo123',
                'user123',
            ]
            if (TAKEN_USERNAMES.includes(username.toLowerCase())) {
                methods.setError('username', {
                    type: 'manual',
                    message: `Username "${username}" is already taken`,
                })
                return
            }

            const password = methods.getValues('password')
            const passwordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            if (!passwordRegex.test(password)) {
                methods.setError('password', {
                    type: 'manual',
                    message:
                        'Password must include uppercase, lowercase, number, and special character',
                })
                return
            }

            const confirmPassword = methods.getValues('confirmPassword')
            if (password !== confirmPassword) {
                methods.setError('confirmPassword', {
                    type: 'manual',
                    message: 'Passwords do not match',
                })
                return
            }

            const acceptTerms = methods.getValues('acceptTerms')
            if (!acceptTerms) {
                methods.setError('acceptTerms', {
                    type: 'manual',
                    message: 'You must accept the terms and conditions',
                })
                return
            }
        }

        const isValid = await saveFormData()

        if (isValid) {
            setErrors({})
            nextStep()
        } else {
            // Collect validation errors
            const formErrors = methods.formState.errors
            const errorMessages: Record<string, string> = {}

            Object.keys(formErrors).forEach((key) => {
                if (formErrors[key]?.message) {
                    errorMessages[key] = formErrors[key]!.message as string
                }
            })

            setErrors(errorMessages)
        }
    }

    const handlePrev = async () => {
        await saveFormData()
        setErrors({})
        prevStep()
    }

    const handleStepClick = async (step: number) => {
        if (step < currentStep) {
            await saveFormData()
            setCurrentStep(step as any)
            setErrors({})
        } else if (step === currentStep + 1) {
            await handleNext()
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            const formValues = methods.getValues()

            const isValid = await methods.trigger()
            if (!isValid) {
                alert('Please fix validation errors before submitting.')
                return
            }

            console.log('Submitting form:', formValues)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Show success message
            alert('Registration submitted successfully! (Backend integration pending)')

            clearForm()
            methods.reset(defaultFormData)
            setCurrentStep(1)
        } catch (error) {
            console.error('Submission error:', error)
            alert('Error submitting form. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Personal />
            case 2:
                return <Step2Address />
            case 3:
                return <Step3Account />
            case 4:
                return (
                    <ReviewStep onSubmit={handleSubmit} formData={methods.getValues()} />
                )
            default:
                return null
        }
    }

    const defaultFormData = {
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        streetAddress: '',
        city: '',
        state: '',
        country: '',
        username: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false,
        newsletter: false,
    }

    return (
        <FormProvider {...methods}>
            <div className="space-y-8">
                {/* Progress Bar */}
                <div className="px-4">
                    <ProgressBar
                        steps={STEPS}
                        currentStep={currentStep}
                        onStepClick={handleStepClick}
                    />
                </div>

                <div className="pb-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {STEPS.find((s) => s.number === currentStep)?.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                        Step {currentStep} of {STEPS.length}
                    </p>
                </div>

                {Object.keys(errors).length > 0 && currentStep !== 4 && (
                    <Alert
                        type="error"
                        title="Please fix the following errors:"
                        message="All required fields must be filled correctly before proceeding."
                        onClose={() => setErrors({})}
                    />
                )}

                <div className="min-h-[400px]">{renderStep()}</div>

                {currentStep !== 4 && (
                    <div className="flex justify-between pt-6 border-t border-gray-200">
                        <div>
                            {currentStep > 1 && (
                                <Button
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={isLoading}
                                    className="flex items-center"
                                >
                                    <FaArrowLeft className="mr-2" />
                                    Previous
                                </Button>
                            )}
                        </div>

                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    if (
                                        window.confirm(
                                            'Are you sure you want to clear the form? All data will be lost.',
                                        )
                                    ) {
                                        clearForm()
                                        methods.reset(defaultFormData)
                                    }
                                }}
                                disabled={isLoading}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                Clear Form
                            </Button>

                            <Button
                                variant="primary"
                                onClick={handleNext}
                                isLoading={isLoading}
                                className="flex items-center"
                            >
                                {currentStep === 3 ? 'Review' : 'Next'}
                                <FaArrowRight className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </FormProvider>
    )
}

export default MultiStepForm
