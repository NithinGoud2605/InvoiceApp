// src/components/Invoicecomp/CreateInvoice/Wizard/WizardProgress.jsx
import React from 'react';
import { Stepper, Step, StepLabel, StepIcon, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useWizard } from 'react-use-wizard';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const WizardProgress = () => {
  const { activeStep, goToStep } = useWizard();
  const { formState: { errors } } = useFormContext();
  const { t } = useTranslation();

  const steps = [
    { id: 0, label: t("fromAndTo"), isValid: !errors.sender && !errors.receiver },
    { id: 1, label: t("invoiceDetails"), isValid: !errors.details?.invoiceNumber },
    { id: 2, label: t("lineItems"), isValid: !errors.details?.items },
    { id: 3, label: t("charges"), isValid: !errors.details?.charges }, // Added Charges step
    { id: 4, label: t("paymentInfo"), isValid: !errors.details?.paymentInformation },
    { id: 5, label: t("summary"), isValid: !errors.details?.totalAmount },
  ];

  return (
    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
      {steps.map((step) => (
        <Step key={step.id} completed={step.isValid && step.id < activeStep}>
          <StepLabel
            onClick={() => goToStep(step.id)}
            sx={{ cursor: 'pointer' }}
            icon={
              step.isValid ? (
                <CheckCircleIcon color={step.id < activeStep ? 'success' : 'primary'} />
              ) : (
                <ErrorIcon color="error" />
              )
            }
          >
            <Typography variant="caption">{step.label}</Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export default WizardProgress;