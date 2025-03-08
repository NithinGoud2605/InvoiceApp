import React, { useCallback } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  Typography,
  Button
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useFormContext } from 'react-hook-form';

import template1 from '../../../../public/invoice1.png';
import template2 from '../../../../public/invoice2.png';
import template3 from '../../../../public/invoice1.png'; // Using the same placeholder
import template4 from '../../../../public/invoice2.png'; // Using the same placeholder

const TemplateSelector = () => {
  const { watch, setValue } = useFormContext();
  const selectedTemplate = watch('details.pdfTemplate');

  const templates = [
    {
      id: 1,
      name: 'Classic Professional',
      description: 'Timeless and clear',
      img: template1
    },
    {
      id: 2,
      name: 'Modern Sleek',
      description: 'Bold and contemporary',
      img: template2
    },
    {
      id: 3,
      name: 'Creative Artistic',
      description: 'Playful and unique',
      img: template3
    },
    {
      id: 4,
      name: 'Corporate Formal',
      description: 'Structured and formal',
      img: template4
    }
  ];

  const handleSelectTemplate = useCallback(
    (id) => {
      setValue('details.pdfTemplate', id);
    },
    [setValue]
  );

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Choose Invoice Template:
      </Typography>
      <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2 }}>
        {templates.map((template) => {
          const isSelected = selectedTemplate === template.id;

          return (
            <Card
              key={template.id}
              sx={{
                minWidth: 300,
                position: 'relative',
                border: isSelected
                  ? '2px solid #1976d2'
                  : '1px solid #e0e0e0'
              }}
            >
              <CardHeader
                title={template.name}
                subheader={template.description}
                sx={{ cursor: 'default' }}
              />
              <Box sx={{ position: 'relative' }}>
                {isSelected && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: '#1976d2'
                    }}
                  >
                    <CheckCircleIcon />
                  </Box>
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={template.img}
                  alt={template.name}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => handleSelectTemplate(template.id)}
                />
              </Box>
              <CardContent>
                <Button
                  variant="outlined"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default TemplateSelector;
