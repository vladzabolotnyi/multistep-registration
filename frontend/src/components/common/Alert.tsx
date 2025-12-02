import React from 'react'
import {
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationCircle,
    FaTimesCircle,
} from 'react-icons/fa'

interface AlertProps {
    type: 'info' | 'success' | 'warning' | 'error'
    title?: string
    message: string
    onClose?: () => void
}

const Alert: React.FC<AlertProps> = ({ type, title, message, onClose }) => {
    const icons = {
        info: FaInfoCircle,
        success: FaCheckCircle,
        warning: FaExclamationCircle,
        error: FaTimesCircle,
    }

    const styles = {
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        error: 'bg-red-50 text-red-800 border-red-200',
    }

    const Icon = icons[type]

    return (
        <div className={`p-4 border rounded-lg ${styles[type]} mb-4`}>
            <div className="flex items-start">
                <Icon
                    className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${
                        type === 'info'
                            ? 'text-blue-500'
                            : type === 'success'
                              ? 'text-green-500'
                              : type === 'warning'
                                ? 'text-yellow-500'
                                : 'text-red-500'
                    }`}
                />
                <div className="flex-1">
                    {title && <h3 className="font-medium">{title}</h3>}
                    <p className="text-sm">{message}</p>
                </div>
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <FaTimesCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    )
}

export default Alert
