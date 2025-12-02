import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    register?: UseFormRegisterReturn
    helperText?: string
}

const Input: React.FC<InputProps> = ({
    label,
    error,
    register,
    helperText,
    className = '',
    type = 'text',
    id,
    ...props
}) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

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

            <input
                id={inputId}
                type={type}
                className={`
          w-full px-3 py-2 border rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-colors duration-200
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
                {...register}
                {...props}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}

export default Input
