import { useMemo } from 'react'
import { useLocation } from '../contexts/LocationContext'

export const useEmailDomainValidation = (email: string, country: string) => {
    const { countries } = useLocation()

    const validation = useMemo(() => {
        const selectedCountry = countries.find((c) => c.name === country)

        if (!selectedCountry?.tlds?.length || !email) {
            return { isValid: true, error: null }
        }

        const isValidDomain = selectedCountry.tlds.some((tld) =>
            email.toLowerCase().endsWith(tld.toLowerCase()),
        )

        if (!isValidDomain) {
            return {
                isValid: false,
                error: `Email domain should end with ${selectedCountry.tlds.join(' or ')} for ${selectedCountry.name}`,
            }
        }

        return { isValid: true, error: null }
    }, [email, countries, country])

    return validation
}
