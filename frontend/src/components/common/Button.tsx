import React from 'react'
import { FaSpinner } from 'react-icons/fa'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    fullWidth?: boolean
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    disabled,
    className = '',
    ...props
}) => {
    const baseStyles =
        'font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
        outline:
            'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-blue-500',
    }

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2.5 text-base',
        lg: 'px-6 py-3 text-lg',
    }

    const widthClass = fullWidth ? 'w-full' : ''

    return (
        <button
            className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
        flex items-center justify-center
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <FaSpinner className="mr-2 animate-spin" />}
            {children}
        </button>
    )
}

export default Button
