import { Box, Button } from '@mui/material';
import { StepperProvider } from '../hooks/useStepperContext';
import { useStepper } from '../hooks/useStepper';
import { StepperPage } from '../model/types';
import { ArrowBack } from '@mui/icons-material';

export interface StepperProps {
  pages: StepperPage[];
  initialStep?: number;
  showStepIndicators?: boolean;
  showNavigation?: boolean;
  onStepChange?: (step: number) => void;
  className?: string;
}

export const Stepper = ({
  pages,
  initialStep = 0,
  showStepIndicators = true,
  showNavigation = true,
  onStepChange,
  className = '',
}: StepperProps) => {
  const {
    currentPage,
    currentStep,
    isFirstStep,
    nextPage,
    prevPage,
    goToStep,
    totalSteps,
  } = useStepper({ pages, initialStep });

  const handlePrev = () => {
    prevPage();
    onStepChange?.(currentStep - 1);
  };

  const handleGoToStep = (step: number) => {
    goToStep(step);
    onStepChange?.(step);
  };

  return (
    <StepperProvider value={{ nextPage, prevPage, goToStep, currentStep }}>
      <Box p={3} className={`stepper ${className}`}>
        {showStepIndicators && (
          <div className="stepper-indicators" style={styles.indicators}>
            {pages.map((page, index) => (
              <div
                key={page.id}
                className={`stepper-indicator ${
                  index === currentStep ? 'active' : ''
                } ${index < currentStep ? 'completed' : ''}`}
                style={{
                  ...styles.indicator,
                  ...(index === currentStep ? styles.activeIndicator : {}),
                  ...(index < currentStep ? styles.completedIndicator : {}),
                }}
                onClick={() => handleGoToStep(index)}
              >
                <div
                  style={{
                    ...styles.indicatorCircle,
                    ...(index === currentStep
                      ? styles.activeIndicatorCircle
                      : {}),
                    ...(index < currentStep
                      ? styles.completedIndicatorCircle
                      : {}),
                  }}
                >
                  {index + 1}
                </div>
                <span style={styles.indicatorLabel}>{page.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="stepper-content" style={styles.content}>
          {currentPage.content}
        </div>

        {showNavigation && (
          <div className="stepper-navigation" style={styles.navigation}>
            <Button
              onClick={handlePrev}
              disabled={isFirstStep}
              className="stepper-prev-button"
            >
                <ArrowBack></ArrowBack>
            </Button>

            <div style={styles.stepCounter}>
              Step {currentStep + 1} of {totalSteps}
            </div>
          </div>
        )}
      </Box>
    </StepperProvider>
  );
};

const styles = {
  indicators: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    gap: '1rem',
  },
  indicator: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '0.5rem',
    cursor: 'pointer',
    flex: 1,
  },
  activeIndicator: {
    fontWeight: 'bold',
  },
  completedIndicator: {
    opacity: 0.7,
  },
  indicatorCircle: {
    width: '2rem',
    height: '2rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid #ccc',
    backgroundColor: '#fff',
    color: '#666',
  },
  activeIndicatorCircle: {
    borderColor: '#007bff',
    backgroundColor: '#007bff',
    color: '#fff',
  },
  completedIndicatorCircle: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
    color: '#fff',
  },
  indicatorLabel: {
    fontSize: '0.875rem',
    textAlign: 'center' as const,
  },
  content: {
    minHeight: '300px',
    padding: '1rem',
  },
  navigation: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '2rem',
    gap: '1rem',
  },
  stepCounter: {
    fontSize: '0.875rem',
    color: '#666',
  },
};
