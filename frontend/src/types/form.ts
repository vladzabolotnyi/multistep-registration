export type FormData = {
    firstName: string
    lastName: string
    email: string
    phoneNumber?: string

    streetAddress: string
    city: string
    state: string
    country: string

    username: string
    password: string
    confirmPassword: string
    acceptTerms: boolean
    newsletter: boolean
}

export type FormStep = 1 | 2 | 3 | 4

export type Country = {
    code: string
    name: string
    tlds: string[]
    flag: string
}

export type State = {
    code: string
    name: string
    countryCode: string
}
