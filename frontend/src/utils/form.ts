import { type FormData } from '../types/form'

export function createDefaultFormData(): FormData {
    return {
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
}
