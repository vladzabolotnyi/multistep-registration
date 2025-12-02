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
