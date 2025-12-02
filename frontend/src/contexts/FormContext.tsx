import React, { createContext, useContext, useState, useCallback } from 'react'
import type { FormData, FormStep } from '../types/form'
import { createDefaultFormData } from '../utils/form'

interface FormContextType {
    formData: FormData
    currentStep: FormStep
    errors: Record<string, string>
    isLoading: boolean
    updateFormData: (data: Partial<FormData>) => void
    setCurrentStep: (step: FormStep) => void
    setErrors: (errors: Record<string, string>) => void
    setIsLoading: (loading: boolean) => void
    clearForm: () => void
    nextStep: () => void
    prevStep: () => void
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>(createDefaultFormData())
    const [currentStep, setCurrentStep] = useState<FormStep>(1)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    const updateFormData = useCallback((data: Partial<FormData>) => {
        setFormData((prev) => ({
            ...prev,
            ...data,
        }))
    }, [])

    const clearForm = useCallback(() => {
        setFormData(createDefaultFormData())
        setCurrentStep(1)
        setErrors({})
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as FormStep)
            setErrors({})
        }
    }, [currentStep])

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as FormStep)
            setErrors({})
        }
    }, [currentStep])

    return (
        <FormContext.Provider
            value={{
                formData,
                currentStep,
                errors,
                isLoading,
                updateFormData,
                setCurrentStep,
                setErrors,
                setIsLoading,
                clearForm,
                nextStep,
                prevStep,
            }}
        >
            {children}
        </FormContext.Provider>
    )
}

export const useFormContext = () => {
    const context = useContext(FormContext)
    if (!context) {
        throw new Error('useFormContext must be used within a FormProvider')
    }
    return context
}
