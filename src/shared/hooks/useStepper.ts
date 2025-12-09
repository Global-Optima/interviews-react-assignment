import { useState, useCallback } from 'react';

export interface UseStepperProps<T> {
  pages: T[];
  initialStep?: number;
}

export interface UseStepperReturn<T> {
  currentPage: T;
  currentStep: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  nextPage: () => void;
  prevPage: () => void;
  goToStep: (step: number) => void;
  totalSteps: number;
}

export function useStepper<T>({
  pages,
  initialStep = 0,
}: UseStepperProps<T>): UseStepperReturn<T> {
  const [currentStep, setCurrentStep] = useState(
    Math.max(0, Math.min(initialStep, pages.length - 1))
  );

  const nextPage = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, pages.length - 1));
  }, [pages.length]);

  const prevPage = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      if (step >= 0 && step < pages.length) {
        setCurrentStep(step);
      }
    },
    [pages.length]
  );

  return {
    currentPage: pages[currentStep],
    currentStep,
    isFirstStep: currentStep === 0,
    isLastStep: currentStep === pages.length - 1,
    nextPage,
    prevPage,
    goToStep,
    totalSteps: pages.length,
  };
}
