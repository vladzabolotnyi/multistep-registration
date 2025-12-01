import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";

export interface StepConfig {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<StepComponentProps>;
  validation?: (data: FormData) => boolean | Promise<boolean>;
}

export interface StepComponentProps {
  data: FormData;
  updateData: (newData: Partial<FormData>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isCurrentStep: boolean;
}

export interface FormData {
  [key: string]: any;
}

export interface StepperFormProps {
  steps: StepConfig[];
  initialData?: FormData;
  onComplete?: (data: FormData) => void | Promise<void>;
  onStepChange?: (currentStep: number, data: FormData) => void;
  showProgress?: boolean;
  showNavigation?: boolean;
  nextButtonText?: string;
  prevButtonText?: string;
  submitButtonText?: string;
  className?: string;
}

export function StepperForm({
  steps,
  initialData = {},
  onComplete,
  onStepChange,
  showProgress = true,
  showNavigation = true,
  nextButtonText = "Next",
  prevButtonText = "Previous",
  submitButtonText = "Submit",
  className = "",
}: StepperFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialData);
  const [stepErrors, setStepErrors] = useState<
    Record<string, Record<string, string>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStepConfig = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;

  useEffect(() => {
    const initialErrors: Record<string, Record<string, string>> = {};
    steps.forEach((step) => {
      initialErrors[step.id] = {};
    });
    setStepErrors(initialErrors);
  }, [steps]);

  useEffect(() => {
    onStepChange?.(currentStep, formData);
  }, [currentStep, formData, onStepChange]);

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const updateStepErrors = (errors: Record<string, string>) => {
    setStepErrors((prev) => ({
      ...prev,
      [currentStepConfig.id]: errors,
    }));
  };

  const hasStepErrors = (): boolean => {
    const errors = stepErrors[currentStepConfig.id];
    return errors ? Object.keys(errors).length > 0 : false;
  };

  const validateCurrentStep = async (): Promise<boolean> => {
    if (!currentStepConfig.validation) {
      return true;
    }

    try {
      const isValid = await currentStepConfig.validation(formData);
      return isValid;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  };

  const handleStepComplete = async () => {
    if (hasStepErrors()) {
      return;
    }

    const isValid = await validateCurrentStep();
    if (!isValid) {
      return;
    }

    setCompletedSteps((prev) => new Set(prev).add(currentStep));

    if (isLastStep) {
      await handleSubmit();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep) {
      setCurrentStep(stepIndex);
      return;
    }

    for (let i = currentStep; i < stepIndex; i++) {
      const step = steps[i];

      if (step.validation) {
        const isValid = await step.validation(formData);
        if (!isValid) {
          return;
        }
      }

      if (stepErrors[step.id] && Object.keys(stepErrors[step.id]).length > 0) {
        return;
      }
    }

    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    if (hasStepErrors()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onComplete?.(formData);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    const CurrentStepComponent = currentStepConfig.component;
    const currentErrors = stepErrors[currentStepConfig.id] || {};

    return (
      <CurrentStepComponent
        data={formData}
        updateData={updateFormData}
        errors={currentErrors}
        setErrors={updateStepErrors}
        isCurrentStep={true}
      />
    );
  };

  const renderProgressIndicator = () => {
    if (!showProgress) return null;

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.has(index);
            const isCurrent = index === currentStep;
            const isClickable =
              index <= currentStep || completedSteps.has(index - 1);

            return (
              <React.Fragment key={step.id}>
                <button
                  type="button"
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center relative ${
                    isClickable
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                      isCurrent
                        ? "border-blue-600 bg-blue-600 text-white"
                        : isCompleted
                          ? "border-green-500 bg-green-500 text-white"
                          : "border-gray-300 bg-white text-gray-500"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{index + 1}</span>
                    )}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={`text-sm font-medium ${
                        isCurrent ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="mt-1 text-xs text-gray-500">
                        {step.description}
                      </div>
                    )}
                  </div>
                </button>

                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 ${
                      completedSteps.has(index) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  const renderNavigation = () => {
    if (!showNavigation) return null;

    const hasErrors = hasStepErrors();

    return (
      <div className="flex justify-between pt-6 mt-8 border-t border-gray-200">
        <div>
          {!isFirstStep && (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center py-2 px-6 text-gray-700 rounded-md border border-gray-300 transition-colors hover:bg-gray-50"
            >
              <ChevronLeft className="mr-2 w-4 h-4" />
              {prevButtonText}
            </button>
          )}
        </div>

        <div className="flex items-center">
          {hasErrors && (
            <span className="mr-4 text-sm text-red-600">
              Please fix errors before continuing
            </span>
          )}
          <button
            type="button"
            onClick={handleStepComplete}
            disabled={hasErrors || isSubmitting}
            className={`px-6 py-2 rounded-md flex items-center ${
              hasErrors || isSubmitting
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isLastStep
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            } transition-colors`}
          >
            {isLastStep ? (
              <>
                {submitButtonText}
                {isSubmitting && (
                  <span className="ml-2">
                    <svg
                      className="w-4 h-4 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </span>
                )}
              </>
            ) : (
              <>
                {nextButtonText}
                <ChevronRight className="ml-2 w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {renderProgressIndicator()}

      <div className="mb-6">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          {currentStepConfig.title}
        </h2>
        {currentStepConfig.description && (
          <p className="mb-6 text-gray-600">{currentStepConfig.description}</p>
        )}
        <div className="mt-4">{renderCurrentStep()}</div>
      </div>

      {renderNavigation()}

      <div className="mt-4 text-sm text-center text-gray-500">
        Step {currentStep + 1} of {steps.length}
      </div>
    </div>
  );
}
