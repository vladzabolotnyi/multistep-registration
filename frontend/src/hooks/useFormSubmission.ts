import { useState, useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { apiService } from '../services/api'

interface UseFormSubmissionProps {
    methods: UseFormReturn<any>
    onSuccess: () => void
}

interface SubmissionState {
    isSubmitting: boolean
    submitError: string | null
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

    const handleSubmit = useCallback(async () => {
        setState((prev) => ({
            ...prev,
            isSubmitting: true,
            submitError: null,
            submitSuccess: false,
        }))

        try {
            const formValues = methods.getValues()
            if (!formValues.phoneNumber) {
                delete formValues.phoneNumber
            }
            const response = await apiService.submitRegistration(formValues)

            if (response.email) {
                setState({
                    isSubmitting: false,
                    submitError: null,
                })
                onSuccess()
            }
        } catch (error) {
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
