import React from 'react'
import Button from '../common/Button'
import { FaPaperPlane } from 'react-icons/fa'
import type { FormData } from '../../types/form'
import Alert from '../common/Alert'

interface ReviewStepProps {
    onSubmit: () => Promise<any>
    formData: FormData
    isSubmitting?: boolean
    submitError?: string | null
    onClearError?: () => void
}

const ReviewStep: React.FC<ReviewStepProps> = ({
    onSubmit,
    formData,
    isSubmitting = false,
    submitError = null,
    onClearError = () => {},
}) => {
    const handleSubmitClick = async () => {
        await onSubmit()
    }

    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Review & Submit</h2>
            <p className="mb-6 text-gray-600">
                Please review your information before submitting.
            </p>

            {submitError && (
                <div className="mb-6">
                    <Alert
                        type="error"
                        title="Submission Failed"
                        message={submitError}
                        onClose={onClearError}
                    />
                </div>
            )}

            <div className="p-6 mb-6 bg-white rounded-lg border border-gray-200">
                <h3 className="mb-4 font-medium text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">First Name</p>
                        <p className="font-medium">
                            {formData.firstName || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Last Name</p>
                        <p className="font-medium">
                            {formData.lastName || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{formData.email || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium">
                            {formData.phoneNumber || 'Not provided'}
                        </p>
                    </div>
                </div>

                <h3 className="mb-4 font-medium text-gray-900">Address Details</h3>
                <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">Street Address</p>
                        <p className="font-medium">
                            {formData.streetAddress || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="font-medium">{formData.city || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">State/Province</p>
                        <p className="font-medium">{formData.state || 'Not provided'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="font-medium">
                            {formData.country || 'Not provided'}
                        </p>
                    </div>
                </div>

                <h3 className="mb-4 font-medium text-gray-900">Account Setup</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-gray-500">Username</p>
                        <p className="font-medium">
                            {formData.username || 'Not provided'}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Password</p>
                        <p className="font-medium">••••••••</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">Terms & Conditions</p>
                        <p className="font-medium">
                            {formData.acceptTerms ? 'Accepted ✓' : 'Not accepted'}
                        </p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-sm text-gray-500">Newsletter Subscription</p>
                        <p className="font-medium">
                            {formData.newsletter ? 'Subscribed ✓' : 'Not subscribed'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center space-y-4">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={handleSubmitClick}
                    disabled={isSubmitting}
                    isLoading={isSubmitting}
                    className="flex items-center px-8 min-w-[200px]"
                >
                    {submitError ? (
                        <>
                            <FaPaperPlane className="mr-2" />
                            Try Again
                        </>
                    ) : (
                        <>
                            <FaPaperPlane className="mr-2" />
                            Submit Registration
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}

export default ReviewStep
