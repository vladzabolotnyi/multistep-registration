import React from 'react'

const Step1Personal: React.FC = () => {
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
                Personal Information
            </h2>
            <p className="mb-6 text-gray-600">Please provide your personal details.</p>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                    Personal Information form will be implemented here with fields for:
                    First Name, Last Name, Email, and Phone Number.
                </p>
            </div>
        </div>
    )
}

export default Step1Personal
