import { z } from 'zod'
import { passwordRegex, validatePhoneNumber } from '../../utils/validation'
import { COUNTRIES } from '../../utils/constants'

// Helper function for phone validation
const phoneSchema = z
    .string()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || validatePhoneNumber(val), {
        message: 'Please enter a valid phone number (e.g., 123-456-7890)',
    })

export const getCountryTldsMessage = (countryCode: string): string => {
    const country = COUNTRIES.find((c) => c.code === countryCode)
    if (!country || !country.tlds?.length) return ''
    return `Expected domains: ${country.tlds.join(', ')}`
}

// Step 1 Schema - Personal Information
export const personalInfoSchema = z.object({
    firstName: z
        .string()
        .min(1, 'First name is required')
        .max(50, 'First name cannot exceed 50 characters')
        .regex(
            /^[A-Za-z\s'-]+$/,
            'First name can only contain letters, spaces, hyphens, and apostrophes',
        ),

    lastName: z
        .string()
        .min(1, 'Last name is required')
        .max(50, 'Last name cannot exceed 50 characters')
        .regex(
            /^[A-Za-z\s'-]+$/,
            'Last name can only contain letters, spaces, hyphens, and apostrophes',
        ),

    email: z
        .string()
        .min(1, 'Email is required')
        .email('Please enter a valid email address (e.g., example@domain.com)')
        .max(100, 'Email cannot exceed 100 characters'),

    phoneNumber: phoneSchema,
})

// Step 2 Schema - Address Details
export const addressSchema = z.object({
    streetAddress: z
        .string()
        .min(1, 'Street address is required')
        .max(200, 'Street address cannot exceed 200 characters'),

    city: z
        .string()
        .min(1, 'City is required')
        .max(100, 'City cannot exceed 100 characters')
        .regex(
            /^[A-Za-z\s'-.,]+$/,
            'City can only contain letters, spaces, hyphens, apostrophes, commas, and periods',
        ),

    state: z.string().min(1, 'State/Province is required'),
    country: z.string().min(1, 'Country is required'),
})

export const addressSchemaWithEmailValidation = (email: string, country: string) =>
    addressSchema.refine(
        (data) => {
            if (!data.country) return true

            const countryData = COUNTRIES.find((c) => c.code === data.country)
            if (!countryData || !countryData.tlds?.length) return true

            // If country changes, validate email against new country
            const emailDomain = email.substring(email.lastIndexOf('.'))
            const isValidDomain = countryData.tlds.some((tld) =>
                email.toLowerCase().endsWith(tld.toLowerCase()),
            )

            return isValidDomain
        },
        {
            message: (data) => {
                const countryData = COUNTRIES.find((c) => c.code === data.country)
                if (!countryData) return 'Invalid country selected'
                return `Email domain should match selected country (${countryData.name}). Expected domains: ${countryData.tlds?.join(', ') || 'any'}`
            },
            path: ['email'],
        },
    )

export const accountSchema = z
    .object({
        username: z
            .string()
            .min(6, 'Username must be at least 6 characters')
            .max(30, 'Username cannot exceed 30 characters')
            .regex(
                /^[a-zA-Z0-9_]+$/,
                'Username can only contain letters, numbers, and underscores',
            ),

        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .max(50, 'Password cannot exceed 50 characters')
            .regex(
                passwordRegex,
                'Password must include: uppercase letter, lowercase letter, number, and special character (@$!%*?&)',
            ),

        confirmPassword: z.string(),

        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
        }),

        newsletter: z.boolean().default(false),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    })

export const combinedSchema = personalInfoSchema
    .merge(addressSchema)
    .merge(accountSchema)
    .refine(
        (data) => {
            // Email domain validation (Bonus feature)
            if (!data.country) return true

            const country = COUNTRIES.find((c) => c.code === data.country)
            if (!country || !country.tlds?.length) return true

            const emailDomain = data.email.substring(data.email.lastIndexOf('.'))
            const isValidDomain = country.tlds.some((tld) =>
                data.email.toLowerCase().endsWith(tld.toLowerCase()),
            )

            return isValidDomain
        },
        {
            message: (data) => {
                const country = COUNTRIES.find((c) => c.code === data.country)
                if (!country) return 'Invalid country selected'
                return `Email domain should match selected country (${country.name}). Expected domains: ${country.tlds?.join(', ') || 'any'}`
            },
            path: ['email'],
        },
    )

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type AccountFormData = z.infer<typeof accountSchema>
export type FullFormData = z.infer<typeof combinedSchema>
