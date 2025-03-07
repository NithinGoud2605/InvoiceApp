// src/components/Invoicecomp/CreateInvoice/TemplateSelector.jsx
import React from 'react';
import { Box, Card, CardMedia, CardContent, CardHeader, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFormContext } from 'react-hook-form';
import template1 from '../../../../public/invoice1.png';
import template2 from '../../../../public/invoice2.png';
import template3 from '../../../../public/invoice1.png'; // Add placeholder images
import template4 from '../../../../public/invoice2.png';

const TemplateSelector = () => {
  const { watch, setValue } = useFormContext();
  const selectedTemplate = watch('details.pdfTemplate');

  const templates = [
    { id: 1, name: 'Classic Professional', description: 'Timeless and clear', img: template1 },
    { id: 2, name: 'Modern Sleek', description: 'Bold and contemporary', img: template2 },
    { id: 3, name: 'Creative Artistic', description: 'Playful and unique', img: template3 },
    { id: 4, name: 'Corporate Formal', description: 'Structured and formal', img: template4 },
  ];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>Choose Invoice Template:</Typography>
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
        {templates.map((template) => (
          <Card
            key={template.id}
            sx={{
              minWidth: 300,
              position: 'relative',
              border: selectedTemplate === template.id ? '2px solid #1976d2' : '1px solid #e0e0e0',
            }}
          >
            <CardHeader title={template.name} subheader={template.description} />
            <Box sx={{ position: 'relative' }}>
              {selectedTemplate === template.id && (
                <Box sx={{ position: 'absolute', top: 8, right: 8, color: '#1976d2' }}>
                  <CheckCircleIcon />
                </Box>
              )}
              <CardMedia
                component="img"
                height="200"
                image={template.img}
                alt={template.name}
                onClick={() => setValue('details.pdfTemplate', template.id)}
                sx={{ cursor: 'pointer' }}
              />
            </Box>
            <CardContent>
              <Button variant="outlined" onClick={() => setValue('details.pdfTemplate', template.id)}>
                Select
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default TemplateSelector;