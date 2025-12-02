import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FaChevronDown, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

interface SelectOption {
    value: string
    label: string
    disabled?: boolean
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string
    error?: string
    register?: UseFormRegisterReturn
    options: SelectOption[]
    placeholder?: string
    leftIcon?: React.ReactNode
    showSuccess?: boolean
    helperText?: string
}

const Select: React.FC<SelectProps> = ({
    label,
    error,
    register,
    options,
    placeholder = 'Select an option',
    leftIcon,
    showSuccess = false,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasLeftIcon = !!leftIcon

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

            <div className="relative">
                {leftIcon && (
                    <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                        <span className="text-gray-400">{leftIcon}</span>
                    </div>
                )}

                <select
                    id={selectId}
                    className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200 appearance-none bg-white
            ${error ? 'border-red-500 pr-10' : showSuccess ? 'border-green-500 pr-10' : 'border-gray-300'}
            ${hasLeftIcon ? 'pl-10' : ''}
            ${className}
          `}
                    {...(register || {})}
                    {...props}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            disabled={option.disabled}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                {/* Dropdown arrow */}
                <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                    <FaChevronDown className="text-gray-400" />
                </div>

                {/* Error or Success Icon */}
                {error && (
                    <div className="flex absolute inset-y-0 right-8 items-center">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}

                {showSuccess && !error && (
                    <div className="flex absolute inset-y-0 right-8 items-center">
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                )}
            </div>

            {error && (
                <p className="flex items-center text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 w-3 h-3" />
                    {error}
                </p>
            )}

            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}

export default Select
