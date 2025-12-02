import type { STEP_KEYS } from "../constants/stepper";

export type StepComponentProps = {
  data: FormData;
  updateData: (newData: Partial<FormData>) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isCurrentStep: boolean;
};

export type StepConfig = {
  stepNumber: number;
  title: string;
  description?: string;
};

export type StepNumber = (typeof STEP_KEYS)[keyof typeof STEP_KEYS];

export type PersonalInfoData = {};

export type AddressDetailsData = {};

export type AccountSetupData = {};

export type StepFormDataMap = {
  [STEP_KEYS.PERSONAL_INFORMATION]: PersonalInfoData;
  [STEP_KEYS.ADDRESS_DETAILS]: AddressDetailsData;
  [STEP_KEYS.ACCOUNT_SETUP]: AccountSetupData;
};
