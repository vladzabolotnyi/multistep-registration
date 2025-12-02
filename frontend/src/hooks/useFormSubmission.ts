import { useState, useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { type FullFormData } from '../lib/validation/schemas'

interface UseFormSubmissionProps {
    methods: UseFormReturn<any>
    onSuccess: () => void
}

interface SubmissionState {
    isSubmitting: boolean
    submitError: string | null
}

interface SubmissionResult {
    success: boolean
    error?: string
    data?: any
}

export const useFormSubmission = ({ methods, onSuccess }: UseFormSubmissionProps) => {
    const [state, setState] = useState<SubmissionState>({
        isSubmitting: false,
        submitError: null,
    })

    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, submitError: null }))
    }, [])

    const clearSuccess = useCallback(() => {
        setState((prev) => ({ ...prev, submitSuccess: false }))
    }, [])

    const resetSubmission = useCallback(() => {
        setState({
            isSubmitting: false,
            submitError: null,
        })
    }, [])

    const submitToApi = async (formData: FullFormData): Promise<SubmissionResult> => {
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const shouldFail = Math.random() < 0.5
        if (shouldFail) {
            throw new Error(
                'Server error: Unable to process registration. Please try again.',
            )
        }

        return {
            success: true,
            data: { id: Date.now(), ...formData },
        }
    }

    const handleSubmit = useCallback(async (): Promise<SubmissionResult> => {
        setState((prev) => ({
            ...prev,
            isSubmitting: true,
            submitError: null,
            submitSuccess: false,
        }))

        try {
            const formValues = methods.getValues()
            const result = await submitToApi(formValues)

            if (result.success) {
                setState({
                    isSubmitting: false,
                    submitError: null,
                })
                onSuccess()
            } else {
                setState((prev) => ({
                    ...prev,
                    isSubmitting: false,
                    submitError: result.error || 'Submission failed',
                }))
            }

            return result
        } catch (error) {
            console.error('Submission error:', error)

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unexpected error occurred. Please try again.'

            setState((prev) => ({
                ...prev,
                isSubmitting: false,
                submitError: errorMessage,
            }))

            return {
                success: false,
                error: errorMessage,
            }
        }
    }, [methods, onSuccess])

    return {
        isSubmitting: state.isSubmitting,
        submitError: state.submitError,

        handleSubmit,
        clearError,
        clearSuccess,
        resetSubmission,
    }
}
