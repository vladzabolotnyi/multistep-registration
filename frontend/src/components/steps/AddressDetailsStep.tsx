import React, { useEffect, useMemo, useCallback } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Select from '../common/Select'
import Alert from '../common/Alert'
import Button from '../common/Button'
import {
    FaMapMarkerAlt,
    FaCity,
    FaFlag,
    FaGlobeAmericas,
    FaSync,
    FaSpinner,
} from 'react-icons/fa'
import { useLocation } from '../../contexts/LocationContext'
import { useEmailDomainValidation } from '../../hooks/useEmailDomainValidation'

const AddressDetailsStep: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setValue,
        getValues,
    } = useFormContext()

    const streetAddress = watch('streetAddress')
    const city = watch('city')
    const stateValue = watch('state')
    const country = watch('country')
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
    } = useLocation()

    const emailValidation = useEmailDomainValidation(email, country)

    const countryOptions = useMemo(() => {
        return countries.map((country) => ({
            value: country.name,
            label: `${country.name} ${country.flag || ''}`.trim(),
        }))
    }, [countries])

    const stateOptions = useMemo(() => {
        return states.map((state) => ({
            value: state.name,
            label: state.name,
        }))
    }, [states])

    useEffect(() => {
        if (country) {
            loadStates(country)
        }
    }, [country, loadStates])

    useEffect(() => {
        if (country && !isLoading && countries.length > 0) {
            const countryExists = countries.some((c) => c.name === country)
            if (!countryExists) {
                setValue('country', '')
            }
        }
    }, [country, countries, isLoading, setValue])

    const handleCountryChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            const newCountry = e.target.value
            setValue('country', newCountry)

            const currentCountry = getValues('country')
            if (currentCountry !== newCountry) {
                setValue('state', '')
            }
        },
        [setValue, getValues],
    )

    const handleRefresh = async () => {
        await refreshCountries()
    }

    const getFieldStatus = (fieldName: string, value: string) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
    }

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

            {!emailValidation.isValid && emailValidation.error && (
                <Alert
                    type="error"
                    title="Email Domain Mismatch"
                    message={emailValidation.error}
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
                        showSuccess={getFieldStatus('country', country) === 'success'}
                        disabled={isLoading}
                        value={country}
                    />
                    <div className="absolute right-0 top-8">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRefresh}
                            isLoading={isLoading}
                            disabled={isLoading}
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
                            : !country
                              ? 'Select country first'
                              : states.length === 0
                                ? 'No states available'
                                : 'Select your state/province'
                    }
                    error={errors.state?.message as string}
                    {...register('state')}
                    helperText={
                        !country
                            ? 'Please select a country first'
                            : states.length === 0
                              ? 'No states/provinces for this country'
                              : ''
                    }
                    required={states.length > 0}
                    leftIcon={<FaFlag />}
                    showSuccess={getFieldStatus('state', stateValue) === 'success'}
                    disabled={!country || isLoading || states.length === 0}
                    value={stateValue}
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

export default AddressDetailsStep
