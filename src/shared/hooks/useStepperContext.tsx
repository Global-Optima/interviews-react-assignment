import { createContext, useContext } from 'react';

interface StepperContextValue {
  nextPage: () => void;
  prevPage: () => void;
  goToStep: (step: number) => void;
  currentStep: number;
}

const StepperContext = createContext<StepperContextValue | undefined>(undefined);

export const useStepperContext = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepperContext must be used within StepperProvider');
  }
  return context;
};

export const StepperProvider = StepperContext.Provider;