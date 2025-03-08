import React, { useCallback, useMemo } from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const WizardNavigation = () => {
  const { isFirstStep, isLastStep, previousStep, nextStep } = useWizard();
  const { t } = useTranslation();

  // Memoize framer-motion variants to avoid re-creation on every render
  const buttonVariants = useMemo(
    () => ({
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    }),
    []
  );

  const handlePrevious = useCallback(() => {
    previousStep();
  }, [previousStep]);

  const handleNext = useCallback(() => {
    nextStep();
  }, [nextStep]);

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handlePrevious}
          disabled={isFirstStep}
          sx={{ transition: 'all 0.3s ease' }}
        >
          {t('back', 'Back')}
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={handleNext}
          disabled={isLastStep}
          sx={{ transition: 'all 0.3s ease' }}
        >
          {t('next', 'Next')}
        </Button>
      </motion.div>
    </Box>
  );
};

export default WizardNavigation;
