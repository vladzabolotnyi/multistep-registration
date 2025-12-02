import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useFormContext as useCustomFormContext } from '../contexts/FormContext'
import {
    personalInfoSchema,
    addressSchema,
    accountSchema,
} from '../lib/validation/schemas'
import { zodResolver } from '@hookform/resolvers/zod'

export const useStepValidation = (step: number) => {
    const { setErrors } = useCustomFormContext()
    const {
        formState: { errors },
    } = useFormContext()

    // Get the appropriate schema for the current step
    const getStepSchema = () => {
        switch (step) {
            case 1:
                return personalInfoSchema
            case 2:
                return addressSchema
            case 3:
                return accountSchema
            default:
                return null
        }
    }

    // Update global errors when form errors change
    useEffect(() => {
        const errorMessages: Record<string, string> = {}

        Object.keys(errors).forEach((key) => {
            if (errors[key]?.message) {
                errorMessages[key] = errors[key]!.message as string
            }
        })

        setErrors(errorMessages)
    }, [errors, setErrors])

    // Get resolver for current step
    const resolver = getStepSchema() ? zodResolver(getStepSchema()!) : undefined

    return {
        resolver,
        schema: getStepSchema(),
    }
}
