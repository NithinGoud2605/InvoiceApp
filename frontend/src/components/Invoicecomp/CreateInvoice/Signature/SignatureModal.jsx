import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, Tabs, Tab, Box, Button, Typography } from '@mui/material';
import { useFormContext } from 'react-hook-form';
import { useSignatureContext } from './SignatureContext';
import DrawSignature from './DrawSignature';
import TypeSignature from './TypeSignature';
import UploadSignature from './UploadSignature';
import { useTranslation } from 'react-i18next';

const SignatureModal = () => {
  const { setValue } = useFormContext();
  const {
    handleCanvasEnd,
    signatureData,
    typedSignature,
    selectedFont,
    uploadSignatureImg,
    signatureRef,
  } = useSignatureContext();
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);

  const handleSaveSignature = () => {
    if (tab === 0) {
      handleCanvasEnd();
      setValue('details.signature.data', signatureData, { shouldDirty: true });
    } else if (tab === 1) {
      setValue('details.signature', { data: typedSignature, fontFamily: selectedFont.name }, { shouldDirty: true });
    } else if (tab === 2) {
      setValue('details.signature.data', uploadSignatureImg, { shouldDirty: true });
    }
    setOpen(false);
  };

  useEffect(() => {
    if (open && signatureData && signatureRef.current) {
      setTimeout(() => {
        signatureRef.current.fromDataURL(signatureData);
      }, 50);
    }
  }, [open, tab, signatureData, signatureRef]);

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        {t("form.steps.summary.signature.heading")}
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{t("form.steps.summary.signature.heading")}</DialogTitle>
        <DialogContent>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)} variant="fullWidth">
            <Tab label={t("form.steps.summary.signature.draw")} />
            <Tab label={t("form.steps.summary.signature.type")} />
            <Tab label={t("form.steps.summary.signature.upload")} />
          </Tabs>
          <Box sx={{ mt: 2, p: 2 }}>
            {tab === 0 && <DrawSignature handleSaveSignature={handleSaveSignature} />}
            {tab === 1 && <TypeSignature handleSaveSignature={handleSaveSignature} />}
            {tab === 2 && <UploadSignature handleSaveSignature={handleSaveSignature} />}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignatureModal;