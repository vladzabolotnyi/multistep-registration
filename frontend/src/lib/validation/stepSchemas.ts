import { z } from 'zod'
import { personalInfoSchema, addressSchema, accountSchema } from './schemas'

export const getStepSchema = (step: number) => {
    switch (step) {
        case 1:
            return personalInfoSchema
        case 2:
            return addressSchema
        case 3:
            return accountSchema
        default:
            return z.object({})
    }
}

// Step 2 with runtime email domain validation
export const createAddressSchemaWithEmailValidation = (
    email: string,
    countries: Array<{ code: string; name: string; tlds?: string[] }>,
) => {
    return addressSchema.refine(
        (data) => {
            if (!data.country || !email) return true

            const country = countries.find((c) => c.code === data.country)
            if (!country?.tlds?.length) return true

            return country.tlds.some((tld) =>
                email.toLowerCase().endsWith(tld.toLowerCase()),
            )
        },
        (data) => {
            const country = countries.find((c) => c.code === data.country)
            return {
                message: `Email domain should end with ${country?.tlds?.join(' or ')} for ${country?.name}`,
                path: ['country'],
            }
        },
    )
}
