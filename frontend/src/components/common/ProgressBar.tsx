import React from 'react'

interface ProgressStep {
    number: number
    title: string
}

interface ProgressBarProps {
    steps: ProgressStep[]
    currentStep: number
    onStepClick?: (step: number) => void
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep, onStepClick }) => {
    const isClickable = typeof onStepClick === 'function'

    return (
        <div className="w-full">
            <div className="flex justify-between mb-2">
                {steps.map((step) => {
                    const isCompleted = step.number < currentStep
                    const isCurrent = step.number === currentStep

                    return (
                        <div
                            key={step.number}
                            className={`flex flex-col items-center flex-1 ${step.number < steps.length ? 'mr-4' : ''}`}
                        >
                            <button
                                type="button"
                                onClick={() => isClickable && onStepClick?.(step.number)}
                                disabled={!isClickable}
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  font-semibold text-sm transition-all duration-300
                  ${
                      isCurrent
                          ? 'bg-blue-600 text-white scale-110'
                          : isCompleted
                            ? 'bg-green-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                  }
                  ${isClickable && !isCurrent ? 'hover:bg-gray-300 cursor-pointer' : 'cursor-default'}
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                `}
                            >
                                {step.number}
                            </button>
                            <span
                                className={`
                mt-2 text-sm font-medium text-center
                ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
              `}
                            >
                                {step.title}
                            </span>
                        </div>
                    )
                })}
            </div>

            {/* Progress line */}
            <div className="relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-200"></div>
                <div
                    className="absolute top-0 left-0 h-1 bg-blue-600 transition-all duration-300"
                    style={{
                        width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                    }}
                ></div>
            </div>
        </div>
    )
}

export default ProgressBar
