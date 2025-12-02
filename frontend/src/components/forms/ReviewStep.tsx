import React from 'react'
import Button from '../common/Button'
import { FaPaperPlane } from 'react-icons/fa'

interface ReviewStepProps {
    onSubmit: () => void
}

const ReviewStep: React.FC<ReviewStepProps> = ({ onSubmit }) => {
    return (
        <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Review & Submit</h2>
            <p className="mb-6 text-gray-600">
                Please review your information before submitting.
            </p>
            <div className="p-6 mb-6 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                    Review summary will be displayed here showing all entered information.
                </p>
            </div>

            <div className="flex justify-center">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onSubmit}
                    className="flex items-center px-8"
                >
                    <FaPaperPlane className="mr-2" />
                    Submit Registration
                </Button>
            </div>
        </div>
    )
}

export default ReviewStep
