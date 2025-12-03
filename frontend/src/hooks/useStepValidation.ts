import { useCallback } from 'react'
import { type UseFormReturn } from 'react-hook-form'
import { useUsernameValidation } from './useUsernameValidation'
import { useEmailValidation } from './useEmailValidation'

interface StepValidationProps {
    currentStep: number
    methods: UseFormReturn<any>
}

export const useStepValidation = ({ currentStep, methods }: StepValidationProps) => {
    const { checkUsername } = useUsernameValidation()
    const { checkEmail } = useEmailValidation()

    const validateStep = useCallback(async (): Promise<boolean> => {
        const isValid = await methods.trigger()

        if (!isValid) {
            return false
        }

        if (currentStep === 1) {
            const email = methods.getValues('email')
            const isEmailAvailable = await checkEmail(email)

            if (!isEmailAvailable) {
                methods.setError('username', {
                    type: 'manual',
                    message: `Email "${email}" is already taken`,
                })
                return false
            }
        }

        if (currentStep === 3) {
            const username = methods.getValues('username')
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
    }, [currentStep, methods, checkUsername, checkEmail])

    return { validateStep }
}
