import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import Input from '../common/Input'
import Select from '../common/Select'
import Alert from '../common/Alert'
import { COUNTRIES, STATES } from '../../utils/constants'
import {
    FaMapMarkerAlt,
    FaCity,
    FaFlag,
    FaGlobeAmericas,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
} from 'react-icons/fa'

interface StateOption {
    value: string
    label: string
}

const Step2Address: React.FC = () => {
    const {
        register,
        formState: { errors, dirtyFields },
        watch,
        setError,
        clearErrors,
    } = useFormContext()

    const streetAddress = watch('streetAddress')
    const city = watch('city')
    const state = watch('state')
    const country = watch('country')
    const email = watch('email')

    const [stateOptions, setStateOptions] = useState<StateOption[]>([])
    const [emailDomainError, setEmailDomainError] = useState<string>('')
    const [countryTlds, setCountryTlds] = useState<string[]>([])

    const validateEmailDomain = (email: string, countryCode: string) => {
        if (!email || !countryCode) {
            setEmailDomainError('')
            clearErrors('email')
            return
        }

        const selectedCountry = COUNTRIES.find((c) => c.code === countryCode)
        if (!selectedCountry || !selectedCountry.tlds?.length) {
            setEmailDomainError('')
            clearErrors('email')
            return
        }

        const isValidDomain = selectedCountry.tlds.some((tld) =>
            email.toLowerCase().endsWith(tld.toLowerCase()),
        )

        if (!isValidDomain) {
            const errorMsg = `Email domain should end with ${selectedCountry.tlds.join(' or ')} for ${selectedCountry.name}`
            setEmailDomainError(errorMsg)
            setError('email', {
                type: 'manual',
                message: errorMsg,
            })
        } else {
            setEmailDomainError('')
            clearErrors('email')
        }
    }

    useEffect(() => {
        if (country) {
            const countryStates = STATES[country as keyof typeof STATES] || []
            const options = countryStates.map((s) => ({
                value: s.code,
                label: s.name,
            }))
            setStateOptions(options)

            const selectedCountry = COUNTRIES.find((c) => c.code === country)
            setCountryTlds(selectedCountry?.tlds || [])

            validateEmailDomain(email, country)
        } else {
            setStateOptions([])
            setCountryTlds([])
        }
    }, [country, email])

    const getFieldStatus = (fieldName: string, value: string) => {
        if (errors[fieldName]) return 'error'
        if (dirtyFields[fieldName] && value && !errors[fieldName]) return 'success'
        return 'default'
    }

    const countryOptions = COUNTRIES.map((country) => ({
        value: country.code,
        label: country.name,
    }))

    return (
        <div className="space-y-6">
            <div>
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Address Details</h2>
                <p className="text-gray-600">
                    Please provide your address information. All fields are required.
                </p>
            </div>

            {/* Email Domain Warning Alert */}
            {emailDomainError && (
                <Alert
                    type="warning"
                    title="Email Domain Mismatch"
                    message={emailDomainError}
                    onClose={() => {
                        setEmailDomainError('')
                        clearErrors('email')
                    }}
                />
            )}

            {/* Street Address */}
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
                {/* City */}
                <Input
                    label="City"
                    type="text"
                    placeholder="Enter your city"
                    error={errors.city?.message as string}
                    {...register('city')}
                    helperText="e.g., New York, London, Tokyo"
                    required
                    leftIcon={<FaCity />}
                    showSuccess={getFieldStatus('city', city) === 'success'}
                />

                {/* Country */}
                <Select
                    label="Country"
                    options={countryOptions}
                    placeholder="Select your country"
                    error={errors.country?.message as string}
                    {...register('country')}
                    helperText="Select your country of residence"
                    required
                    leftIcon={<FaGlobeAmericas />}
                    showSuccess={getFieldStatus('country', country) === 'success'}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* State/Province */}
                <Select
                    label="State/Province"
                    options={stateOptions}
                    placeholder={
                        country ? 'Select your state/province' : 'Select country first'
                    }
                    error={errors.state?.message as string}
                    {...register('state')}
                    helperText={country ? '' : 'Please select a country first'}
                    required
                    leftIcon={<FaFlag />}
                    showSuccess={getFieldStatus('state', state) === 'success'}
                    disabled={!country || stateOptions.length === 0}
                />

                {/* Country TLDs Info */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-start">
                        <FaInfoCircle className="mt-0.5 mr-3 w-5 h-5 text-blue-500 shrink-0" />
                        <div>
                            <h4 className="mb-1 font-medium text-blue-800">
                                Email Domain Information
                            </h4>
                            {countryTlds.length > 0 ? (
                                <div>
                                    <p className="mb-1 text-sm text-blue-700">
                                        For{' '}
                                        <span className="font-medium">
                                            {
                                                COUNTRIES.find((c) => c.code === country)
                                                    ?.name
                                            }
                                        </span>
                                        , email should end with:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {countryTlds.map((tld) => (
                                            <span
                                                key={tld}
                                                className="py-1 px-2 text-xs font-medium text-blue-800 bg-blue-100 rounded"
                                            >
                                                {tld}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ) : country ? (
                                <p className="text-sm text-blue-700">
                                    No specific domain required for{' '}
                                    {COUNTRIES.find((c) => c.code === country)?.name}
                                </p>
                            ) : (
                                <p className="text-sm text-blue-700">
                                    Select a country to see email domain requirements
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Validation Status */}
            <div className="p-4 mt-6 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="mb-3 font-medium text-gray-800">Validation Status</h4>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {/* Street Address */}
                    <div
                        className={`flex items-center ${errors.streetAddress ? 'text-red-600' : streetAddress ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.streetAddress ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : streetAddress ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            Street Address {streetAddress ? '✓' : ''}
                        </span>
                    </div>

                    {/* City */}
                    <div
                        className={`flex items-center ${errors.city ? 'text-red-600' : city ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.city ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : city ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">City {city ? '✓' : ''}</span>
                    </div>

                    {/* Country */}
                    <div
                        className={`flex items-center ${errors.country ? 'text-red-600' : country ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.country ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : country ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">Country {country ? '✓' : ''}</span>
                    </div>

                    {/* State/Province */}
                    <div
                        className={`flex items-center ${errors.state ? 'text-red-600' : state ? 'text-green-600' : 'text-gray-500'}`}
                    >
                        {errors.state ? (
                            <FaExclamationTriangle className="mr-2 text-red-500" />
                        ) : state ? (
                            <FaCheckCircle className="mr-2 text-green-500" />
                        ) : (
                            <div className="mr-2 w-4 h-4 rounded-full border border-gray-300"></div>
                        )}
                        <span className="text-sm">
                            State/Province {state ? '✓' : country ? 'Required' : ''}
                        </span>
                    </div>
                </div>

                {/* Email Domain Validation Status */}
                {countryTlds.length > 0 && email && (
                    <div className="pt-4 mt-4 border-t border-gray-200">
                        <div
                            className={`flex items-center ${emailDomainError ? 'text-red-600' : 'text-green-600'}`}
                        >
                            {emailDomainError ? (
                                <FaExclamationTriangle className="mr-2 text-red-500" />
                            ) : (
                                <FaCheckCircle className="mr-2 text-green-500" />
                            )}
                            <span className="text-sm">
                                Email Domain Validation:{' '}
                                {emailDomainError ? 'Invalid' : 'Valid ✓'}
                            </span>
                        </div>
                        {emailDomainError && (
                            <p className="mt-1 ml-6 text-sm text-red-600">
                                Your email ({email}) doesn't match{' '}
                                {COUNTRIES.find((c) => c.code === country)?.name} domains.
                                Please use an email ending with {countryTlds.join(' or ')}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Help Section */}
            <div className="p-4 mt-6 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="flex items-center mb-2 font-medium text-blue-800">
                    <FaInfoCircle className="mr-2" />
                    Important Information
                </h4>
                <ul className="space-y-1 text-sm list-disc list-inside text-blue-700">
                    <li>All address fields are required for account verification</li>
                    <li>State/Province options will appear after selecting a country</li>
                    <li>
                        <span className="font-medium">Bonus Feature:</span> Email domain
                        validation ensures your email matches your selected country's
                        common domains
                    </li>
                    <li>Your information is automatically saved as you progress</li>
                    <li>You can return to Step 1 to update your email if needed</li>
                </ul>
            </div>

            {/* Country-Specific Instructions */}
            {country && (
                <div className="p-4 mt-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="mb-2 font-medium text-green-800">
                        Selected: {COUNTRIES.find((c) => c.code === country)?.name}
                    </h4>
                    <p className="text-sm text-green-700">
                        {country === 'US' &&
                            'For United States, please ensure your state is correctly selected for tax purposes.'}
                        {country === 'UK' &&
                            'For United Kingdom, ensure you select the correct constituent country.'}
                        {country === 'CA' &&
                            'For Canada, provincial information is required for shipping calculations.'}
                        {country === 'AU' &&
                            'For Australia, state information is required for GST purposes.'}
                        {!['US', 'UK', 'CA', 'AU'].includes(country) &&
                            'Please ensure all address details are accurate for shipping and verification purposes.'}
                    </p>
                </div>
            )}
        </div>
    )
}

export default Step2Address
