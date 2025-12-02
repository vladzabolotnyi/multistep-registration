import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useRef,
} from 'react'
import type { Country, State } from '../types/form'
import * as locationService from '../services/locationData'

interface LocationContextType {
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

    source: 'api' | 'cache' | 'static'
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [countries, setCountries] = useState<Country[]>([])
    const [states, setStates] = useState<State[]>([])
    const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isError, setIsError] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [source, setSource] = useState<'api' | 'cache' | 'static'>('static')

    const abortControllerRef = useRef<AbortController | null>(null)
    const statesCacheRef = useRef<Record<string, State[]>>({})

    const loadCountries = useCallback(async (forceRefresh = false) => {
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
        } catch (err: any) {
            if (err.name === 'AbortError') return

            setIsError(true)
            setError(err.message || 'Failed to load countries')
            console.error('Error loading countries:', err)
        } finally {
            setIsLoading(false)
        }
    }, [])

    const loadStates = useCallback(
        async (countryCode: string, forceRefresh = false) => {
            if (!countryCode) {
                setStates([])
                setSelectedCountry(null)
                return
            }

            if (!forceRefresh && statesCacheRef.current[countryCode]) {
                setStates(statesCacheRef.current[countryCode])
                const country = countries.find((c) => c.code === countryCode)
                if (country) setSelectedCountry(country)
                return
            }

            setIsLoading(true)
            setError(null)

            try {
                const statesData = await locationService.getStates(
                    countryCode,
                    forceRefresh,
                )

                statesCacheRef.current[countryCode] = statesData

                setStates(statesData)

                const country = countries.find((c) => c.code === countryCode)
                if (country) {
                    setSelectedCountry(country)
                }
            } catch (err) {
                setError(`Failed to load states for ${countryCode}`)
                console.error(`Error loading states for ${countryCode}:`, err)
                setStates([])
                setSelectedCountry(null)
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
        statesCacheRef.current = {}
        setSource('static')
        setCountries([])
        setStates([])
    }, [])

    useEffect(() => {
        loadCountries()

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [loadCountries])

    return (
        <LocationContext.Provider
            value={{
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

                source,
            }}
        >
            {children}
        </LocationContext.Provider>
    )
}

export const useLocation = () => {
    const context = useContext(LocationContext)
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider')
    }
    return context
}
