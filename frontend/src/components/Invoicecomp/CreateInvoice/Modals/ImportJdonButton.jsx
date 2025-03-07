import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { useInvoiceContext } from '../../../contexts/InvoiceContext';
import { ImportExport } from '@mui/icons-material';

const ImportJsonButton = ({ setOpen }) => {
  const fileInputRef = useRef(null);
  const { importInvoice, invoicePdfLoading } = useInvoiceContext();

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      importInvoice(file);
      setOpen(false);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" style={{ display: 'none' }} />
      <Button variant="outlined" disabled={invoicePdfLoading} onClick={handleClick} startIcon={<ImportExport />}>
        Import JSON
      </Button>
    </>
  );
};

export default ImportJsonButton;
