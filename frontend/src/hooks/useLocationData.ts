import { useState, useEffect, useCallback, useRef } from 'react'
import type { Country, State } from '../types/form'
import * as locationService from '../services/locationData'

interface UseLocationDataOptions {
    initialCountryCode?: string
    autoLoadCountries?: boolean
}

interface UseLocationDataReturn {
    countries: Country[]
    states: State[]
    selectedCountry: Country | null

    isLoading: boolean
    isError: boolean
    error: string | null

    loadCountries: (forceRefresh?: boolean) => Promise<void>
    loadStates: (countryCode: string, forceRefresh?: boolean) => Promise<void>
    refreshCountries: () => Promise<void>
    searchCountries: (query: string) => Promise<Country[]>
    clearError: () => void
    clearCache: () => void

    lastUpdated: number | null
    source: 'api' | 'cache' | 'static'
}

export const useLocationData = ({
    initialCountryCode,
    autoLoadCountries = true,
}: UseLocationDataOptions = {}): UseLocationDataReturn => {
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [lastUpdated, setLastUpdated] = useState<number | null>(null)
    const [source, setSource] = useState<'api' | 'cache' | 'static'>('static')

    const abortControllerRef = useRef<AbortController | null>(null)

    const loadCountries = useCallback(
        async (forceRefresh = false) => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }

            abortControllerRef.current = new AbortController()

            setIsLoading(true)
            setIsError(false)
            setError(null)

            try {
                const countriesData = await locationService.getCountries(forceRefresh)

                setCountries(countriesData)
                setSource(forceRefresh ? 'api' : 'cache')
                setLastUpdated(Date.now())

                if (initialCountryCode) {
                    const country = countriesData.find(
                        (c) => c.code === initialCountryCode,
                    )
                    if (country) {
                        setSelectedCountry(country)
                        await loadStates(initialCountryCode)
                    }
                }
            } catch (err: any) {
                if (err.name === 'AbortError') {
                    console.log('Countries fetch aborted')
                    return
                }

                setIsError(true)
                setError(err.message || 'Failed to load countries')
                console.error('Error loading countries:', err)
            } finally {
                setIsLoading(false)
            }
        },
        [initialCountryCode],
    )

    const loadStates = useCallback(
        async (countryCode: string, forceRefresh = false) => {
            if (!countryCode) {
                setStates([])
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const statesData = await locationService.getStates(
                    countryCode,
                    forceRefresh,
                )
                setStates(statesData)

                const country = countries.find((c) => c.code === countryCode)
                if (country) {
                    setSelectedCountry(country)
                }
            } catch (err) {
                setError(`Failed to load states for ${countryCode}`)
                console.error(`Error loading states for ${countryCode}:`, err)
                setStates([])
            } finally {
                setIsLoading(false)
            }
        },
        [countries],
    )

    const refreshCountries = useCallback(async () => {
        await loadCountries(true)
    }, [loadCountries])

    const searchCountries = useCallback(async (query: string): Promise<Country[]> => {
        try {
            return await locationService.searchCountries(query)
        } catch (err) {
            console.error('Error searching countries:', err)
            return []
        }
    }, [])

    const clearError = useCallback(() => {
        setIsError(false)
        setError(null)
    }, [])

    const clearCache = useCallback(() => {
        locationService.clearLocationCache()
        setSource('static')
        setLastUpdated(null)
    }, [])

    useEffect(() => {
        if (autoLoadCountries) {
            loadCountries()
        }

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [autoLoadCountries, loadCountries])

    return {
        countries,
        states,
        selectedCountry,

        isLoading,
        isError,
        error,

        loadCountries,
        loadStates,
        refreshCountries,
        searchCountries,
        clearError,
        clearCache,

        lastUpdated,
        source,
    }
}
