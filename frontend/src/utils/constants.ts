export const COUNTRIES = [
    { code: 'US', name: 'United States', tlds: ['.us', '.com', '.net', '.org'] },
    { code: 'UK', name: 'United Kingdom', tlds: ['.uk', '.co.uk', '.org.uk'] },
    { code: 'CA', name: 'Canada', tlds: ['.ca'] },
    { code: 'AU', name: 'Australia', tlds: ['.au', '.com.au'] },
    { code: 'DE', name: 'Germany', tlds: ['.de'] },
    { code: 'FR', name: 'France', tlds: ['.fr'] },
    { code: 'JP', name: 'Japan', tlds: ['.jp'] },
    { code: 'IN', name: 'India', tlds: ['.in', '.co.in'] },
] as const

export const STATES = {
    US: [
        { code: 'CA', name: 'California' },
        { code: 'NY', name: 'New York' },
        { code: 'TX', name: 'Texas' },
        { code: 'FL', name: 'Florida' },
        { code: 'IL', name: 'Illinois' },
        { code: 'WA', name: 'Washington' },
        { code: 'MA', name: 'Massachusetts' },
        { code: 'CO', name: 'Colorado' },
    ],
    UK: [
        { code: 'ENG', name: 'England' },
        { code: 'SCT', name: 'Scotland' },
        { code: 'WLS', name: 'Wales' },
        { code: 'NIR', name: 'Northern Ireland' },
    ],
    CA: [
        { code: 'ON', name: 'Ontario' },
        { code: 'BC', name: 'British Columbia' },
        { code: 'QC', name: 'Quebec' },
        { code: 'AB', name: 'Alberta' },
        { code: 'MB', name: 'Manitoba' },
        { code: 'SK', name: 'Saskatchewan' },
    ],
    AU: [
        { code: 'NSW', name: 'New South Wales' },
        { code: 'VIC', name: 'Victoria' },
        { code: 'QLD', name: 'Queensland' },
        { code: 'WA', name: 'Western Australia' },
        { code: 'SA', name: 'South Australia' },
    ],
} as const

export const STEPS = [
    { number: 1, title: 'Personal Info' },
    { number: 2, title: 'Address' },
    { number: 3, title: 'Account Setup' },
    { number: 4, title: 'Review' },
] as const

export const VALIDATION_MESSAGES = {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    minLength: (min: number) => `Must be at least ${min} characters`,
    password:
        'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
    confirmPassword: 'Passwords must match',
    phone: 'Please enter a valid phone number',
    emailDomain: 'Email domain must match selected country',
    username: 'Username must be at least 6 characters',
} as const
