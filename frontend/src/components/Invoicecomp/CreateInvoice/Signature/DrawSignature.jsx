import React from 'react';
import { Button, Box } from '@mui/material';
import SignatureCanvas from 'react-signature-canvas';
import { useSignatureContext } from './SignatureContext';

const DrawSignature = ({ handleSaveSignature }) => {
  const { signatureRef, handleCanvasEnd } = useSignatureContext();

  const clearSignature = () => {
    signatureRef.current.clear();
  };

  return (
    <Box>
      <SignatureCanvas
        ref={signatureRef}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas', style: { border: '1px solid #e0e0e0' } }}
        onEnd={handleCanvasEnd}
      />
      <Box sx={{ mt: 2 }}>
        <Button variant="outlined" onClick={clearSignature} sx={{ mr: 2 }}>
          Clear
        </Button>
        <Button variant="contained" onClick={handleSaveSignature}>
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default DrawSignature;