import type { StepConfig } from '../types/stepper'

export const STEP_KEYS = {
    PERSONAL_INFORMATION: 0,
    ADDRESS_DETAILS: 1,
    ACCOUNT_SETUP: 2,
}

export const STEP_CONFIGS: StepConfig[] = [
    { stepNumber: STEP_KEYS.PERSONAL_INFORMATION, title: 'Personal Information' },
    { stepNumber: STEP_KEYS.ADDRESS_DETAILS, title: 'Address details' },
    { stepNumber: STEP_KEYS.ACCOUNT_SETUP, title: 'Account setup' },
]
