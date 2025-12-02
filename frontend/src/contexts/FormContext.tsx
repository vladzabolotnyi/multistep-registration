import React, { createContext, useContext, useState, useCallback } from 'react'
import type { FormData, FormStep } from '../types/form'

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

const defaultFormData: FormData = {
    // Step 1
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',

    // Step 2
    streetAddress: '',
    city: '',
    state: '',
    country: '',

    // Step 3
    username: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
    newsletter: false,
}

const FormContext = createContext<FormContextType | undefined>(undefined)

// TODO: Current implementation is using local storage to store form data but I'd like to store data in memory because
// the form has data like password..
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [formData, setFormData] = useState<FormData>(() => {
        // Try to load from localStorage on initial render
        const saved = localStorage.getItem('registration-form')
        return saved ? JSON.parse(saved) : defaultFormData
    })

    const [currentStep, setCurrentStep] = useState<FormStep>(1)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isLoading, setIsLoading] = useState(false)

    // Save to localStorage whenever formData changes
    const updateFormData = useCallback((data: Partial<FormData>) => {
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
