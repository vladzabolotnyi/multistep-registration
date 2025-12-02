import React from 'react'

const Step3Account: React.FC = () => {
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Account Setup</h2>
            <p className="mb-6 text-gray-600">Create your account credentials.</p>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                    Account setup form will be implemented here with fields for: Username,
                    Password, Confirm Password, Terms & Conditions, and Newsletter.
                </p>
            </div>
        </div>
    )
}

export default Step3Account
