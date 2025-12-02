import { useMemo } from 'react'
import { useLocation } from '../contexts/LocationContext'

export const useEmailDomainValidation = (email: string, countryCode: string) => {
    const { countries } = useLocation()

    const validation = useMemo(() => {
        if (!email || !countryCode) {
            return { isValid: true, error: null }
        }

        const selectedCountry = countries.find((c) => c.code === countryCode)

        if (!selectedCountry?.tlds?.length) {
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
    }, [email, countryCode, countries])

    return validation
}
