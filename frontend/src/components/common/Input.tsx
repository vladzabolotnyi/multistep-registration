import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    register?: UseFormRegisterReturn
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    showSuccess?: boolean
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    register,
    helperText,
    leftIcon,
    rightIcon,
    showSuccess = false,
    className = '',
    type = 'text',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
    const hasLeftIcon = !!leftIcon
    const hasRightIcon = !!rightIcon || showSuccess || !!error

    return (
        <div className="space-y-1">
            {label && (
                <label
                    htmlFor={inputId}
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

                <input
                    id={inputId}
                    type={type}
                    className={`
            w-full px-3 py-2 border rounded-lg shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            transition-colors duration-200
            ${error ? 'border-red-500 pr-10' : showSuccess ? 'border-green-500 pr-10' : 'border-gray-300'}
            ${hasLeftIcon ? 'pl-10' : ''}
            ${hasRightIcon ? 'pr-10' : ''}
            ${className}
          `}
                    {...(register || {})} // Spread register object here
                    {...props} // Spread other props AFTER register
                />

                {rightIcon && !error && !showSuccess && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">{rightIcon}</span>
                    </div>
                )}

                {error && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}

                {showSuccess && !error && (
                    <div className="flex absolute inset-y-0 right-0 items-center pr-3">
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

export default Input
