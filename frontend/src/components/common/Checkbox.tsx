import React from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
    error?: string
    register?: UseFormRegisterReturn
    helperText?: string
}

const Checkbox: React.FC<CheckboxProps> = ({
    label,
    error,
    register,
    helperText,
    id,
    className = '',
    ...props
}) => {
    const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-')

    return (
        <div className="space-y-2">
            <div className="flex items-center">
                <input
                    id={checkboxId}
                    type="checkbox"
                    className={`
            h-4 w-4 text-blue-600 rounded
            focus:ring-blue-500 border-gray-300
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
                    {...register}
                    {...props}
                />
                <label htmlFor={checkboxId} className="block ml-2 text-sm text-gray-900">
                    {label}
                    {props.required && <span className="ml-1 text-red-500">*</span>}
                </label>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    )
}

export default Checkbox
