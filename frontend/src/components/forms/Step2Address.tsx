import React from 'react'

const Step2Address: React.FC = () => {
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Address Details</h2>
            <p className="mb-6 text-gray-600">Please provide your address information.</p>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                    Address form will be implemented here with fields for: Street Address,
                    City, State/Province, and Country.
                </p>
            </div>
        </div>
    )
}

export default Step2Address
