import {
    createContext,
    useRef,
    useState,
    type ReactNode,
    useMemo,
    useCallback,
    useContext,
} from 'react'
import type { StepConfig, StepFormDataMap, StepNumber } from '../types/stepper'
import { STEP_CONFIGS, STEP_KEYS } from '../constants/stepper'

type StepError = {
    field?: string
    message: string
}

type StepState = {
    definition: StepConfig
    isCompleted: boolean
    isValid: boolean
    errors: StepError[]
    formData: StepFormDataMap[StepNumber]
}

type ValidationResult = {
    isValid: boolean
    errors: StepError[]
}

type StepValidator<T = StepFormDataMap[StepNumber]> = (
    data: T,
) => Promise<ValidationResult> | ValidationResult

type StepperContextValue = {
    steps: StepState[]
    currentStep: StepState
    hasErrors: boolean
    currentStepNumber: StepNumber

    goToStep: (stepNumber: StepNumber) => Promise<boolean>
    nextStep: () => Promise<boolean>
    previousStep: () => void

    createError: (stepNumber: StepNumber, error: StepError) => void
    hasStepErrors: (stepNumber: StepNumber) => boolean

    getStepData: <S extends StepNumber>(stepNumber: S) => StepFormDataMap[S]
    updateStepData: <T extends Record<string, any>>(
        stepNumber: StepNumber,
        data: Partial<T>,
    ) => void

    registerValidator: (stepNumber: StepNumber, validator: StepValidator) => void
    unregisterValidator: (stepNumber: StepNumber) => void
}

export const StepperContext = createContext<StepperContextValue | null>(null)

export function StepperProvider({ children }: { children: ReactNode }) {
    const [steps, setSteps] = useState<StepState[]>(() =>
        STEP_CONFIGS.map((config) => ({
            definition: config,
            isCompleted: false,
            isValid: false,
            errors: [],
            formData: {},
        })),
    )

    const [currentStepNumber, setCurrentStepNumber] = useState<number>(
        STEP_KEYS.PERSONAL_INFORMATION,
    )

    const validatorsRef = useRef<Map<StepNumber, StepValidator>>(new Map())

    const currentStep = useMemo(
        () => steps[currentStepNumber],
        [steps, currentStepNumber],
    )
    const hasErrors = useMemo(() => steps.some((step) => step.errors.length > 0), [steps])

    const createError = useCallback((stepNumber: StepNumber, error: StepError) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.definition.stepNumber === stepNumber
                    ? { ...step, errors: { ...step.errors, error }, isValid: false }
                    : step,
            ),
        )
    }, [])

    const getStepErrors = useCallback(
        (stepNumber: StepNumber): StepError[] => {
            const step = steps.find((s) => s.definition.stepNumber === stepNumber)
            return step?.errors || []
        },
        [steps],
    )

    const hasStepErrors = useCallback(
        (stepNumber: StepNumber) => {
            return getStepErrors(stepNumber).length > 0
        },
        [getStepErrors],
    )

    const completeStep = useCallback((stepNumber: StepNumber) => {
        setSteps((prevSteps) =>
            prevSteps.map((step) =>
                step.definition.stepNumber === stepNumber
                    ? { ...step, isCompleted: true }
                    : step,
            ),
        )
    }, [])

    const getStepData = useCallback(
        <S extends StepNumber>(stepNumber: S): StepFormDataMap[S] => {
            const step = steps.find((s) => s.definition.stepNumber === stepNumber)
            return step?.formData || {}
        },
        [steps],
    )

    const updateStepData = useCallback(
        <T extends Record<string, any>>(
            stepNumber: StepNumber,
            data: Partial<T>,
        ): void => {
            setSteps((prevSteps) =>
                prevSteps.map((step) =>
                    step.definition.stepNumber === stepNumber
                        ? { ...step, formData: { ...step.formData, ...data } }
                        : step,
                ),
            )
        },
        [],
    )

    const registerValidator = useCallback(
        (stepNumber: StepNumber, validator: StepValidator): void => {
            validatorsRef.current.set(stepNumber, validator)
        },
        [],
    )
    const unregisterValidator = useCallback((stepNumber: StepNumber) => {
        validatorsRef.current.delete(stepNumber)
    }, [])

    const validateStep = useCallback(
        async (stepNumber: StepNumber): Promise<ValidationResult> => {
            const step = steps.find((s) => s.definition.stepNumber === stepNumber)
            if (!step) {
                return { isValid: false, errors: [] }
            }

            const validator = validatorsRef.current.get(stepNumber)
            if (!validator) {
                return { isValid: step.errors.length === 0, errors: step.errors }
            }

            try {
                const { isValid, errors } = await validator(step.formData)
                updateStepData(stepNumber, { ...step, isValid, errors })

                return { isValid, errors }
            } catch (errors) {
                const errorMessage =
                    errors instanceof Error ? errors.message : 'Validation failed'
                return { isValid: false, errors: [{ message: errorMessage }] }
            }
        },
        [steps, updateStepData],
    )

    const canNavigateTo = useCallback(
        (stepNumber: StepNumber): boolean => {
            const targetIndex = steps.findIndex(
                (s) => s.definition.stepNumber === stepNumber,
            )
            if (targetIndex === -1) return false

            if (targetIndex <= currentStepNumber) return true

            for (let i = 0; i < targetIndex; i++) {
                if (!steps[i].isCompleted) {
                    return false
                }
            }

            return true
        },
        [steps, currentStepNumber],
    )

    const goToStep = useCallback(
        async (stepNumber: StepNumber): Promise<boolean> => {
            const step = steps.find((s) => s.definition.stepNumber === stepNumber)
            if (!step) return false

            if (!canNavigateTo(stepNumber)) return false

            if (step.definition.stepNumber > currentStepNumber) {
                const result = await validateStep(currentStepNumber)
                if (!result.isValid) {
                    return false
                }
                completeStep(currentStepNumber)
            }

            setCurrentStepNumber(step.definition.stepNumber)
            return true
        },
        [steps, currentStepNumber, canNavigateTo, validateStep, completeStep],
    )

    const nextStep = useCallback(async (): Promise<boolean> => {
        if (currentStepNumber >= steps.length - 1) return false

        const nextStepNumber = steps[currentStepNumber + 1].definition.stepNumber
        return goToStep(nextStepNumber)
    }, [steps, currentStepNumber, goToStep])

    const previousStep = useCallback(() => {
        if (currentStepNumber <= 0) return
        setCurrentStepNumber((prev) => prev - 1)
    }, [currentStepNumber])

    const contextValue: StepperContextValue = useMemo(
        () => ({
            steps,
            currentStepNumber,
            currentStep,
            hasErrors,
            goToStep,
            nextStep,
            previousStep,
            createError,
            hasStepErrors,
            getStepData,
            updateStepData,
            registerValidator,
            unregisterValidator,
        }),
        [
            steps,
            currentStepNumber,
            currentStep,
            hasErrors,
            goToStep,
            nextStep,
            previousStep,
            createError,
            hasStepErrors,
            getStepData,
            updateStepData,
            registerValidator,
            unregisterValidator,
        ],
    )

    return (
        <StepperContext.Provider value={contextValue}>{children}</StepperContext.Provider>
    )
}

export function useStepperContext(): StepperContextValue {
    const context = useContext(StepperContext)
    if (!context) {
        throw new Error('useStepperContext must be used within a StepperProvider')
    }

    return context
}
