import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    register?: UseFormRegisterReturn
    helperText?: string
    showSuccess?: boolean
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    error,
    register,
    helperText,
    showSuccess = false,
    id,
    className = '',
    ...props
}) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-2">
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id={checkboxId}
                        type="checkbox"
                        className={`
              h-4 w-4 rounded border-gray-300 text-blue-600
              focus:ring-blue-500 focus:ring-offset-0
              ${error ? 'border-red-500' : showSuccess ? 'border-green-500' : ''}
              ${className}
            `}
                        {...(register || {})}
                        {...props}
                    />
                </div>
                <div className="ml-3">
                    <label
                        htmlFor={checkboxId}
                        className="text-sm font-medium text-gray-700"
                    >
                        {label}
                        {props.required && <span className="ml-1 text-red-500">*</span>}
                    </label>

                    {helperText && !error && (
                        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
                    )}
                </div>

                {/* Success/Error icons */}
                {error && (
                    <div className="ml-3">
                        <FaExclamationCircle className="w-5 h-5 text-red-500" />
                    </div>
                )}

                {showSuccess && !error && (
                    <div className="ml-3">
                        <FaCheckCircle className="w-5 h-5 text-green-500" />
                    </div>
                )}
            </div>

            {error && (
                <p className="flex items-center ml-7 text-sm text-red-600">
                    <FaExclamationCircle className="mr-1 w-3 h-3" />
                    {error}
                </p>
            )}
        </div>
    )
}

export default Checkbox
