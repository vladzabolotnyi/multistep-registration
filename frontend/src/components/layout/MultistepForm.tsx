import React, { useEffect } from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import ProgressBar from '../common/ProgressBar'
import Button from '../common/Button'
import Alert from '../common/Alert'
import PersonalInfoStep from '../steps/PersonalInfoStep'
import AddressDetailsStep from '../steps/AddressDetailsStep'
import AccountSetupStep from '../steps/AccountSetupStep'
import ReviewStep from '../steps/ReviewStep'
import { useFormContext } from '../../contexts/FormContext'
import { STEPS } from '../../utils/constants'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useStepValidation } from '../../hooks/useStepValidation'
import { getStepSchema } from '../../lib/validation/schemas'
import { createDefaultFormData } from '../../utils/form'

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
        updateFormData,
    } = useFormContext()

    const methods = useForm({
        defaultValues: formData,
        mode: 'onChange',
        resolver: zodResolver(getStepSchema(currentStep)),
    })

    const { validateStep } = useStepValidation({
        currentStep,
        methods,
    })

    useEffect(() => {
        const schema = getStepSchema(currentStep)
        if (schema) {
            methods.clearErrors()
        }
    }, [currentStep])

    useEffect(() => {
        methods.reset(formData, { keepErrors: true })
    }, [formData])

    const saveFormData = async (): Promise<boolean> => {
        const formValues = methods.getValues()
        const isValid = await methods.trigger()

        if (isValid) {
            // TODO:  Store in memory instead of localStorage
            // This will be handled by FormContext
            updateFormData(formValues)

            return true
        }

        return isValid
    }

    const handleNext = async () => {
        if (currentStep === 4) return

        const isValid = await validateStep()

        if (!isValid) {
            const formErrors = methods.formState.errors
            const errorMessages: Record<string, string> = {}

            Object.keys(formErrors).forEach((key) => {
                if (formErrors[key]?.message) {
                    errorMessages[key] = formErrors[key]!.message as string
                }
            })

            setErrors(errorMessages)
            return
        }

        await saveFormData()
        setErrors({})
        nextStep()
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

            // TODO: Replace with actual API call
            // const response = await fetch('/api/register', {
            //   method: 'POST',
            //   headers: { 'Content-Type': 'application/json' },
            //   body: JSON.stringify(formValues)
            // })

            alert('Registration submitted successfully!')
            clearForm()
            methods.reset(createDefaultFormData())
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
                return <PersonalInfoStep />
            case 2:
                return <AddressDetailsStep />
            case 3:
                return <AccountSetupStep />
            case 4:
                return (
                    <ReviewStep onSubmit={handleSubmit} formData={methods.getValues()} />
                )
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
                                        methods.reset(createDefaultFormData)
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
