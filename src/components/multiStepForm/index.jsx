import React from 'react';
import { Form, Formik } from 'formik';
import FormNavigation from '../formNavigation';
import { Box, Step, StepLabel, Stepper } from '@mui/material';
import styles from './MultiStepForm.module.css';

const MultiStepForm = ({
  children,
  initialValues,
  onSubmit,
  stepNumber,
  onPressBack,
  isSubmitting,
  isUpdate,
}) => {
  const steps = React.Children.toArray(children);
  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;
  const handleSubmit = async (values, actions) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, isLastStep);
    }
    if (isLastStep) {
      return onSubmit(values, actions);
    } else {
      actions.setTouched({});
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}>
      {formik => {
        return (
          <Form style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Stepper
              alternativeLabel
              activeStep={stepNumber}
              className={styles.stepperContainer}>
              {steps.map(currentStep => {
                const label = currentStep.props.stepName;
                return (
                  <Step key={label}>
                    <StepLabel
                      sx={{
                        '& .MuiStepLabel-label.Mui-active': {
                          color: 'var(--background)',
                          fontWeight: '600',
                        },
                        '& .MuiStepLabel-label, .MuiStepLabel-label.Mui-completed':
                          {
                            color: 'var(--font)',
                          },
                        '& .MuiStepLabel-label.MuiStepLabel-alternativeLabel': {
                          marginTop: '5px',
                        },
                        '& .MuiStepLabel-iconContainer.Mui-disabled .MuiSvgIcon-root':
                          {
                            color: 'var(--whiteOutline)',
                          },
                      }}>
                      {label}
                    </StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            <Box className={styles.formContainer}>
              {step}
              <FormNavigation
                isUpdate={isUpdate}
                isLastStep={isLastStep}
                hasPrevious={stepNumber > 0}
                onBackClick={() => onPressBack && onPressBack(formik.values)}
                isLoading={isSubmitting}
                disabled={isSubmitting}
              />
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default MultiStepForm;

export const FormStep = ({ stepName = '', children }) => children;
