import { useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { useEmailDomainValidation } from './useEmailDomainValidation'
import { useUsernameValidation } from './useUsernameValidation'

interface StepValidationProps {
    currentStep: number
    methods: UseFormReturn<any>
}

export const useStepValidation = ({ currentStep, methods }: StepValidationProps) => {
    const { checkUsername } = useUsernameValidation()

    const validateStep = useCallback(async (): Promise<boolean> => {
        // First, trigger react-hook-form validation (Zod schema)
        const isValid = await methods.trigger()

        if (!isValid) {
            return false
        }

        // Step 2: Email domain validation
        if (currentStep === 2) {
            const email = methods.getValues('email')
            const country = methods.getValues('country')

            // This validation is now handled by the hook
            // and displayed in the UI, but we can add additional check here
            // The hook useEmailDomainValidation should be used in Step2Address component
        }

        // Step 3: Username availability check
        if (currentStep === 3) {
            const username = methods.getValues('username')

            // Username validation is already in schema, but we need async check
            const isUsernameAvailable = await checkUsername(username)

            if (!isUsernameAvailable) {
                methods.setError('username', {
                    type: 'manual',
                    message: `Username "${username}" is already taken`,
                })
                return false
            }
        }

        return true
    }, [currentStep, methods, checkUsername])

    return { validateStep }
}
