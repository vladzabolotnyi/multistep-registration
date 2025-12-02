import React, { createContext, useContext, useState, useCallback } from 'react'
import type { FormData, FormStep } from '../types/form'

interface FormContextType {
    formData: FormData
    currentStep: FormStep
    errors: Record<string, string>
    isLoading: boolean
    setCurrentStep: (step: FormStep) => void
    setErrors: (errors: Record<string, string>) => void
    setIsLoading: (loading: boolean) => void
    clearForm: () => void
    nextStep: () => void
    prevStep: () => void
}

const defaultFormData: FormData = {
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

const FormContext = createContext<FormContextType | undefined>(undefined)

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>(() => {
        const saved = localStorage.getItem('registration-form')
        return saved ? JSON.parse(saved) : defaultFormData
    })

    const [currentStep, setCurrentStep] = useState<FormStep>(1)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Only update formData when moving between steps or on submit
    const updateFormDataForReview = useCallback((data: Partial<FormData>) => {
        setFormData((prev) => {
            const updated = { ...prev, ...data }
            localStorage.setItem('registration-form', JSON.stringify(updated))
            return updated
        })
    }, [])

    const clearForm = useCallback(() => {
        setFormData(defaultFormData)
        localStorage.removeItem('registration-form')
        setCurrentStep(1)
        setErrors({})
    }, [])

    const nextStep = useCallback(() => {
        if (currentStep < 4) {
            setCurrentStep((prev) => (prev + 1) as FormStep)
        }
    }, [currentStep])

    const prevStep = useCallback(() => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as FormStep)
        }
    }, [currentStep])

    return (
        <FormContext.Provider
            value={{
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
