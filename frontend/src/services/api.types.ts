export type AvailabilityResponse = {
    available: boolean
    message: string
}

export type ErrorResponse = {
    code: string
    message: string
    errors?: Record<string, string>
}

export type RegistrationResponse = {
    success: boolean
    message: string
}
