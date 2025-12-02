import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface SelectOption {
    value: string
    label: string
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    register?: UseFormRegisterReturn
    options: SelectOption[]
    placeholder?: string
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    register,
    options,
    placeholder = 'Select an option',
    className = '',
    id,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                    {props.required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <select
                id={selectId}
                className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200 appearance-none bg-white
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...register}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    )
}

export default Select
