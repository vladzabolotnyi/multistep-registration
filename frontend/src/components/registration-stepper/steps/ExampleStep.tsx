import React from "react";
import type { StepComponentProps } from "../Stepper";

export const ExampleStepComponent: React.FC<StepComponentProps> = ({
  data,
  updateData,
  errors,
  setErrors,
  isCurrentStep,
}) => {
  const handleChange = (field: string, value: string) => {
    updateData({ [field]: value });

    // Clear error for this field when user starts typing
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const validateField = (field: string, value: string): string => {
    if (!value.trim()) {
      return `${field} is required`;
    }
    return "";
  };

  const handleBlur = (field: string, value: string) => {
    const error = validateField(field, value);
    if (error) {
      setErrors({ ...errors, [field]: error });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          First Name
        </label>
        <input
          type="text"
          value={data.firstName || ""}
          onChange={(e) => handleChange("firstName", e.target.value)}
          onBlur={(e) => handleBlur("firstName", e.target.value)}
          className={`w-full px-3 py-2 border rounded-md ${
            errors.firstName ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.firstName && (
          <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
        )}
      </div>
    </div>
  );
};
