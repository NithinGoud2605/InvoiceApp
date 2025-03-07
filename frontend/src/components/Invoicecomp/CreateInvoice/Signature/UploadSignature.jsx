import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useSignatureContext } from './SignatureContext';

const UploadSignature = ({ handleSaveSignature }) => {
  const { setUploadSignatureImg, uploadSignatureImg } = useSignatureContext();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadSignatureImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'block', marginBottom: '16px' }}
      />
      {uploadSignatureImg && (
        <Box sx={{ mb: 2 }}>
          <img src={uploadSignatureImg} alt="Uploaded Signature" style={{ maxWidth: '100%', maxHeight: '200px' }} />
        </Box>
      )}
      <Button variant="contained" onClick={handleSaveSignature} disabled={!uploadSignatureImg}>
        Save
      </Button>
    </Box>
  );
};

export default UploadSignature;