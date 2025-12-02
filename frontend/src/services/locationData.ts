import axios from 'axios'
import type { Country, State } from '../types/form'

const CACHE_DURATION = 24 * 60 * 60 * 1000
const CACHE_KEY_COUNTRIES = 'countries_cache'
const CACHE_KEY_STATES = 'states_cache'

const isCacheValid = (cacheKey: string): boolean => {
    const timestamp = localStorage.getItem(`${cacheKey}_timestamp`)
    if (!timestamp) return false

    const age = Date.now() - parseInt(timestamp, 10)
    return age < CACHE_DURATION
}

const saveToCache = (key: string, data: any) => {
    try {
        localStorage.setItem(key, JSON.stringify(data))
        localStorage.setItem(`${key}_timestamp`, Date.now().toString())
    } catch (error) {
        console.warn('Failed to save to localStorage:', error)
    }
}

const loadFromCache = <T>(key: string): T | null => {
    try {
        const cached = localStorage.getItem(key)
        return cached ? JSON.parse(cached) : null
    } catch (error) {
        console.warn('Failed to load from localStorage:', error)
        return null
    }
}

type CountryResponseAPI = {
    name: { common: string }
    cca2: string
    tld: string[]
    flag?: string
}

export const fetchCountriesFromAPI = async (): Promise<Country[]> => {
    try {
        const response = await axios.get(
            'https://restcountries.com/v3.1/independent?status=true',
        )

        console.log(JSON.stringify(response.data, null, 2))

        const countries: Country[] = response.data.map((country: CountryResponseAPI) => ({
            code: country.cca2,
            name: country.name.common,
            tlds: country.tld || [],
            flag: country.flag || '',
        }))

        countries.sort((a, b) => a.name.localeCompare(b.name))

        saveToCache(CACHE_KEY_COUNTRIES, countries)

        return countries
    } catch (error) {
        console.error('Failed to fetch countries from API:', error)

        const cached = loadFromCache<Country[]>(CACHE_KEY_COUNTRIES)
        if (cached && isCacheValid(CACHE_KEY_COUNTRIES)) {
            return cached
        }

        return []
    }
}

type RegionResponseAPI = {
    name: string
    isoCode: string
}

export const fetchRegionsFromAPI = async (countryCode: string): Promise<State[]> => {
    // FIX: This api key is for demo only. NEVER SAVE SENS DATA ON REPO.
    const GEO_API_KEY = '0ed9565ab1mshf4b1b7721426573p149399jsn6b61ac43f1b8'

    if (!GEO_API_KEY) {
        throw new Error('GEO_API_KEY should be provided')
    }

    try {
        const response = await axios.get(
            `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions`,
            {
                headers: {
                    'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com',
                    'x-rapidapi-key': GEO_API_KEY,
                },
                params: {
                    limit: 10,
                    offset: 0,
                },
            },
        )

        const states: State[] = response.data.data.map((region: RegionResponseAPI) => ({
            code: region.isoCode,
            name: region.name,
            countryCode,
        }))

        const cacheKey = `${CACHE_KEY_STATES}_${countryCode}`
        saveToCache(cacheKey, states)

        return states
    } catch (error: any) {
        console.error(`Failed to fetch states for ${countryCode}:`, error)

        const cacheKey = `${CACHE_KEY_STATES}_${countryCode}`
        const cached = loadFromCache<State[]>(cacheKey)
        if (cached && isCacheValid(cacheKey)) {
            return cached
        }

        return []
    }
}

export const getCountries = async (forceRefresh = false): Promise<Country[]> => {
    if (!forceRefresh) {
        const cached = loadFromCache<Country[]>(CACHE_KEY_COUNTRIES)
        if (cached && isCacheValid(CACHE_KEY_COUNTRIES)) {
            return cached
        }
    }

    return fetchCountriesFromAPI()
}

export const getStates = async (
    countryCode: string,
    forceRefresh = false,
): Promise<State[]> => {
    if (!countryCode) return []

    const cacheKey = `${CACHE_KEY_STATES}_${countryCode}`

    if (!forceRefresh) {
        const cached = loadFromCache<State[]>(cacheKey)
        if (cached && isCacheValid(cacheKey)) {
            return cached
        }
    }

    return fetchRegionsFromAPI(countryCode)
}

export const searchCountries = async (query: string): Promise<Country[]> => {
    const countries = await getCountries()

    if (!query) return countries

    const lowerQuery = query.toLowerCase()
    return countries.filter(
        (country) =>
            country.name.toLowerCase().includes(lowerQuery) ||
            country.code.toLowerCase().includes(lowerQuery),
    )
}

export const isValidCountryCode = async (code: string): Promise<boolean> => {
    const countries = await getCountries()
    return countries.some((country) => country.code === code)
}

export const clearLocationCache = (): void => {
    const keysToRemove: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes('_cache') || key?.includes('_timestamp')) {
            keysToRemove.push(key)
        }
    }

    keysToRemove.forEach((key) => localStorage.removeItem(key))
}
