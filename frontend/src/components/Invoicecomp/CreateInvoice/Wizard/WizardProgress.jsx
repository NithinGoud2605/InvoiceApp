import React, { useMemo } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  StepIcon,
  Typography,
  LinearProgress
} from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useWizard } from 'react-use-wizard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const WizardProgress = () => {
  const { activeStep, goToStep } = useWizard();
  const {
    formState: { errors }
  } = useFormContext();
  const { t } = useTranslation();

  // Define steps in a stable reference (optional)
  const steps = useMemo(
    () => [
      {
        id: 0,
        label: t('fromAndTo', 'From & To'),
        // Check if no errors for sender & receiver
        isValid: !errors.sender && !errors.receiver
      },
      {
        id: 1,
        label: t('invoiceDetails', 'Details'),
        isValid: !errors.details?.invoiceNumber
      },
      {
        id: 2,
        label: t('lineItems', 'Items'),
        isValid: !errors.details?.items
      },
      {
        id: 3,
        label: t('charges', 'Charges'),
        isValid: !errors.details?.charges
      },
      {
        id: 4,
        label: t('paymentInfo', 'Payment'),
        isValid: !errors.details?.paymentInformation
      },
      {
        id: 5,
        label: t('summary', 'Summary'),
        isValid: !errors.details?.totalAmount
      }
    ],
    [errors, t]
  );

  const progress = (activeStep / (steps.length - 1)) * 100;

  return (
    <>
      <LinearProgress variant="determinate" value={progress} sx={{ mb: 2 }} />
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((step) => {
          const completed = step.isValid && step.id < activeStep;
          const icon = step.isValid ? (
            <CheckCircleIcon
              color={step.id < activeStep ? 'success' : 'primary'}
            />
          ) : (
            <ErrorIcon color="error" />
          );

          return (
            <Step key={step.id} completed={completed}>
              <StepLabel
                onClick={() => goToStep(step.id)}
                sx={{ cursor: 'pointer' }}
                icon={icon}
              >
                <Typography variant="caption">{step.label}</Typography>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </>
  );
};

export default WizardProgress;
