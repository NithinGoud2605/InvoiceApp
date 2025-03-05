import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ContractCard = ({ contract, onEdit, onCancel, onRenew, onSendForSignature }) => {
  const { client, planName, status, startDate, endDate, pdfUrl } = contract;
  const clientName = client ? client.name : 'No Client';

  // Check if the contract is expired
  const currentDate = new Date();
  const isExpired = endDate && new Date(endDate) < currentDate && status !== 'CANCELLED';

  return (
    <Card
      sx={{
        minHeight: 420,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        border:
          client && planName && startDate ? '2px solid green' : '2px solid red',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: 2,
        }}
      >
        <Box>
          <Typography variant="h6" gutterBottom>
            {clientName}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Plan: {planName || 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Status: {status}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Start Date: {startDate ? new Date(startDate).toLocaleDateString() : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            End Date: {endDate ? new Date(endDate).toLocaleDateString() : 'N/A'}
          </Typography>
          {isExpired && (
            <Typography variant="body2" color="error" gutterBottom>
              Expired
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '210/297', // A4 ratio for PDF preview
            border: '1px solid #ddd',
            borderRadius: '10px',
            overflow: 'hidden',
            mt: 0,
          }}
        >
          {pdfUrl ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer
                fileUrl={pdfUrl}
                defaultScale={SpecialZoomLevel.PageFit}
                initialPage={0}
              />
            </Worker>
          ) : (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ pt: 5 }}>
              No PDF available
            </Typography>
          )}
        </Box>
      </CardContent>
      <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => onEdit(contract.id)}
          disabled={status === 'CANCELLED'}
        >
          Edit
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          onClick={() => onCancel(contract.id)}
        >
          Cancel
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="small"
          onClick={() => onRenew(contract.id)}
        >
          Renew
        </Button>
        <Button
          variant="outlined"
          color="info"
          size="small"
          onClick={() => onSendForSignature(contract.id)}
        >
          Send for Signature
        </Button>
      </Box>
    </Card>
  );
};

export default ContractCard;