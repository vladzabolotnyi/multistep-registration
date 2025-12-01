import {
  StepperForm,
  type StepConfig,
} from "../components/registration-stepper/Stepper";
import { ExampleStepComponent } from "../components/registration-stepper/steps/ExampleStep";

export function RegistrationPage() {
  const steps: StepConfig[] = [
    {
      id: "personal",
      title: "Personal Information",
      component: ExampleStepComponent,
      validation: () => {
        return true;
      },
    },
    {
      id: "address",
      title: "Address Details",
      component: ExampleStepComponent,
      validation: () => {
        return true;
      },
    },
    {
      id: "address",
      title: "Address Details",
      component: ExampleStepComponent,
      validation: () => {
        return true;
      },
    },
  ];

  return (
    <StepperForm
      steps={steps}
      onComplete={() => {}}
      showProgress={true}
      showNavigation={true}
      className="mx-auto max-w-2xl"
    />
  );
}
