import React, { useEffect, useState, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Select from '../common/Select'
import Alert from '../common/Alert'
import Button from '../common/Button'
import { useLocationData } from '../../hooks/useLocationData'
import {
    FaMapMarkerAlt,
    FaCity,
    FaFlag,
    FaGlobeAmericas,
    FaSync,
    FaSpinner,
} from 'react-icons/fa'

const Step2Address: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setValue,
    } = useFormContext()

    const streetAddress = watch('streetAddress')
    const city = watch('city')
    const stateValue = watch('state')
    const countryCode = watch('country')
    const email = watch('email')

    const {
        countries,
        states,
        isLoading,
        isError,
        error: locationError,
        loadStates,
        refreshCountries,
        source,
        clearError,
    } = useLocationData({
        initialCountryCode: countryCode,
    })

    const [emailDomainError, setEmailDomainError] = useState<string>('')
    const [isRefreshing, setIsRefreshing] = useState(false)

    useEffect(() => {
        if (countryCode) {
            loadStates(countryCode)

            const selectedCountry = countries.find((c) => c.code === countryCode)
            if (selectedCountry?.tlds?.length && email) {
                const isValidDomain = selectedCountry.tlds.some((tld) =>
                    email.toLowerCase().endsWith(tld.toLowerCase()),
                )

                if (!isValidDomain) {
                    setEmailDomainError(
                        `Email should end with ${selectedCountry.tlds.join(' or ')} for ${selectedCountry.name}`,
                    )
                } else {
                    setEmailDomainError('')
                }
            }

            setValue('state', '')
        } else {
            setEmailDomainError('')
        }
    }, [countryCode, email, countries, loadStates, setValue])

    const handleCountryChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newCountryCode = e.target.value
            setValue('country', newCountryCode)
            setValue('state', '')
        },
        [setValue],
    )

    const handleRefresh = async () => {
        setIsRefreshing(true)
        try {
            await refreshCountries()
        } finally {
            setIsRefreshing(false)
        }
    }

    const getFieldStatus = (fieldName: string, value: string) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
    }

    const countryOptions = countries.map((country) => ({
        value: country.code,
        label: `${country.name} ${country.flag || ''}`.trim(),
    }))

    const stateOptions = states.map((state) => ({
        value: state.code,
        label: state.name,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Address Details</h2>
                <p className="text-gray-600">Please provide your address information.</p>
            </div>

            {isError && (
                <Alert
                    type="error"
                    title="Location Data Error"
                    message={locationError || 'Failed to load location data'}
                    onClose={() => clearError()}
                />
            )}

            {emailDomainError && (
                <Alert
                    type="error"
                    title="Email Domain Mismatch"
                    message={emailDomainError}
                />
            )}

            <Input
                label="Street Address"
                type="text"
                placeholder="Enter your street address"
                error={errors.streetAddress?.message as string}
                {...register('streetAddress')}
                helperText="Include apartment, suite, or unit number if applicable"
                required
                leftIcon={<FaMapMarkerAlt />}
                showSuccess={getFieldStatus('streetAddress', streetAddress) === 'success'}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Input
                    label="City"
                    type="text"
                    placeholder="Enter your city"
                    error={errors.city?.message as string}
                    {...register('city')}
                    required
                    leftIcon={<FaCity />}
                    showSuccess={getFieldStatus('city', city) === 'success'}
                />

                <div className="relative">
                    <Select
                        label="Country"
                        options={countryOptions}
                        placeholder={
                            isLoading ? 'Loading countries...' : 'Select your country'
                        }
                        error={errors.country?.message as string}
                        {...register('country')}
                        onChange={handleCountryChange}
                        required
                        leftIcon={<FaGlobeAmericas />}
                        showSuccess={getFieldStatus('country', countryCode) === 'success'}
                        disabled={isLoading}
                    />

                    <div className="absolute right-0 top-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            isLoading={isLoading || isRefreshing}
                            disabled={isLoading || isRefreshing}
                            className="p-2"
                            title="Refresh countries data"
                        >
                            <FaSync className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Select
                    label="State/Province"
                    options={stateOptions}
                    placeholder={
                        isLoading
                            ? 'Loading...'
                            : !countryCode
                              ? 'Select country first'
                              : states.length === 0
                                ? 'No states available'
                                : 'Select your state/province'
                    }
                    error={errors.state?.message as string}
                    {...register('state')}
                    helperText={
                        isLoading
                            ? 'Loading states...'
                            : !countryCode
                              ? 'Please select a country first'
                              : states.length === 0
                                ? 'No states/provinces for this country'
                                : ''
                    }
                    required={states.length > 0}
                    leftIcon={<FaFlag />}
                    showSuccess={getFieldStatus('state', stateValue) === 'success'}
                    disabled={!countryCode || isLoading || states.length === 0}
                />
            </div>

            {isLoading && (
                <div className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <FaSpinner className="mr-3 text-blue-500 animate-spin" />
                    <span className="text-sm text-gray-600">
                        Loading location data from {source === 'api' ? 'API' : 'cache'}...
                    </span>
                </div>
            )}
        </div>
    )
}

export default Step2Address
