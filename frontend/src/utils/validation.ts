import type { COUNTRIES } from './constants'

export const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// TODO: Update this validation
export const validateEmailDomain = (
    email: string,
    countryCode: string,
    countries: typeof COUNTRIES,
): boolean => {
    const country = countries.find((c) => c.code === countryCode)
    if (!country || !country.tlds) return true // If country not found or no TLDs, skip validation

    const emailDomain = email.substring(email.lastIndexOf('.'))
    return country.tlds.some((tld) => email.endsWith(tld))
}

export const validatePhoneNumber = (phone: string): boolean => {
    if (!phone) return true // Optional field
    const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
    return phoneRegex.test(phone)
}
