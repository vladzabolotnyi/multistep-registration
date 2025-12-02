import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import ProgressBar from '../common/ProgressBar'
import Button from '../common/Button'
import Alert from '../common/Alert'
import Step1Personal from '../forms/Step1Personal'
import Step2Address from '../forms/Step2Address'
import Step3Account from '../forms/Step3Account'
import ReviewStep from '../forms/ReviewStep'
import { useFormContext } from '../../contexts/FormContext'
import { STEPS } from '../../utils/constants'
import { FaArrowLeft, FaArrowRight, FaPaperPlane } from 'react-icons/fa'

const MultiStepForm: React.FC = () => {
    const {
        formData,
        currentStep,
        errors,
        isLoading,
        updateFormData,
        setCurrentStep,
        setErrors,
        nextStep,
        prevStep,
        clearForm,
    } = useFormContext()

    // Initialize react-hook-form
    const methods = useForm({
        defaultValues: formData,
        mode: 'onChange',
    })

    // Update form values when formData changes
    useEffect(() => {
        methods.reset(formData)
    }, [formData, methods])

    // Watch for form changes to update context
    useEffect(() => {
        const subscription = methods.watch((value) => {
            updateFormData(value as any)
        })
        return () => subscription.unsubscribe()
    }, [methods, updateFormData])

    // Handle step navigation
    const handleNext = async () => {
        // Trigger validation for current step
        const isValid = await methods.trigger(getStepFields(currentStep))

        if (isValid) {
            setErrors({}) // Clear errors
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

    const handlePrev = () => {
        setErrors({}) // Clear errors when going back
        prevStep()
    }

    const handleStepClick = async (step: number) => {
        if (step < currentStep) {
            // Allow going back to previous steps
            setCurrentStep(step as any)
            setErrors({})
        } else if (step === currentStep + 1) {
            // Only allow going forward if current step is valid
            await handleNext()
        }
    }

    const handleSubmit = async () => {
        // This will be implemented when we connect to the Go API
        console.log('Submitting form:', formData)
        // For now, just show success and reset
        alert('Registration submitted successfully! (Backend integration pending)')
        clearForm()
        methods.reset()
    }

    // Helper to get fields for each step
    const getStepFields = (step: number): string[] => {
        switch (step) {
            case 1:
                return ['firstName', 'lastName', 'email', 'phoneNumber']
            case 2:
                return ['streetAddress', 'city', 'state', 'country']
            case 3:
                return ['username', 'password', 'confirmPassword', 'acceptTerms']
            default:
                return []
        }
    }

    // Render current step component
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1Personal />
            case 2:
                return <Step2Address />
            case 3:
                return <Step3Account />
            case 4:
                return <ReviewStep onSubmit={handleSubmit} />
            default:
                return null
        }
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

                {/* Error Alert */}
                {Object.keys(errors).length > 0 && (
                    <Alert
                        type="error"
                        title="Validation Error"
                        message="Please fix the errors below before proceeding."
                        onClose={() => setErrors({})}
                    />
                )}

                {/* Current Step Content */}
                <div className="min-h-[400px]">{renderStep()}</div>

                {/* Navigation Buttons */}
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
                                onClick={clearForm}
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

                {/* Form Status */}
                <div className="mt-4 text-sm text-center text-gray-500">
                    <p>
                        Step {currentStep} of {STEPS.length}
                        {currentStep < 4 && ' - Data is saved locally as you progress'}
                    </p>
                </div>
            </div>
        </FormProvider>
    )
}

export default MultiStepForm
