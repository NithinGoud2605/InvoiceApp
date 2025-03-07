import React from 'react';
import { Box, Button } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import { useWizard } from 'react-use-wizard';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const WizardNavigation = () => {
  const { isFirstStep, isLastStep, previousStep, nextStep } = useWizard();
  const { t } = useTranslation();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={previousStep}
          disabled={isFirstStep}
          sx={{ transition: 'all 0.3s ease' }}
        >
          {t("back")}
        </Button>
      </motion.div>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          onClick={nextStep}
          disabled={isLastStep}
          sx={{ transition: 'all 0.3s ease' }}
        >
          {t("next")}
        </Button>
      </motion.div>
    </Box>
  );
};

export default WizardNavigation;