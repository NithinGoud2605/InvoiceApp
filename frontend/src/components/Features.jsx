// src/components/Features.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

import DevicesRoundedIcon from '@mui/icons-material/DevicesRounded';
import EdgesensorHighRoundedIcon from '@mui/icons-material/EdgesensorHighRounded';
import ViewQuiltRoundedIcon from '@mui/icons-material/ViewQuiltRounded';

const items = [
  {
    icon: <ViewQuiltRoundedIcon />,
    title: 'Dashboard',
    description: 'A snapshot of your key metrics and data points.',
    imageLight: '', // blank for now
    imageDark: '',  // blank for now
  },
  {
    icon: <EdgesensorHighRoundedIcon />,
    title: 'Mobile Integration',
    description: 'Access and manage your account on the go.',
    imageLight: '', // blank for now
    imageDark: '',  // blank for now
  },
  {
    icon: <DevicesRoundedIcon />,
    title: 'Cross-Platform',
    description: 'Available on web, mobile, and desktop.',
    imageLight: '', // blank for now
    imageDark: '',  // blank for now
  },
];

const Chip = styled('div')(({ theme, selected }) => ({
  padding: theme.spacing(1, 2),
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  background: selected
    ? 'linear-gradient(to bottom right, hsl(210, 98%, 48%), hsl(210, 98%, 35%))'
    : theme.palette.grey[200],
  color: selected ? '#fff' : theme.palette.text.primary,
}));

function MobileLayout({ selectedItemIndex, handleItemClick, selectedFeature }) {
  if (!items[selectedItemIndex]) return null;

  return (
    <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'column', gap: 2 }}>
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
        {items.map(({ title }, index) => (
          <Chip key={index} selected={selectedItemIndex === index} onClick={() => handleItemClick(index)}>
            {title}
          </Chip>
        ))}
      </Box>
      <Card variant="outlined" sx={{ p: 2 }}>
        <Box
          sx={{
            mb: 2,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 280,
            backgroundImage: items[selectedItemIndex].imageLight,
          }}
        />
        <Box sx={{ px: 2, pb: 2 }}>
          <Typography gutterBottom sx={{ fontWeight: 'medium' }}>
            {selectedFeature.title}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {selectedFeature.description}
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}

MobileLayout.propTypes = {
  handleItemClick: PropTypes.func.isRequired,
  selectedFeature: PropTypes.shape({
    description: PropTypes.string.isRequired,
    imageDark: PropTypes.string.isRequired,
    imageLight: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  selectedItemIndex: PropTypes.number.isRequired,
};

export default function Features() {
  const [selectedItemIndex, setSelectedItemIndex] = React.useState(0);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const selectedFeature = items[selectedItemIndex];

  return (
    <Container id="features" sx={{ py: { xs: 8, sm: 16 } }}>
      <Box sx={{ width: { sm: '100%', md: '60%' } }}>
        <Typography component="h2" variant="h4" gutterBottom>
          Product Features
        </Typography>
        <Typography variant="body1" sx={{ mb: { xs: 2, sm: 4 } }}>
          Discover the key features that make our product unique and efficient.
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row-reverse' }, gap: 2 }}>
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'column', gap: 2 }}>
          {items.map(({ icon, title, description }, index) => (
            <Button
              key={index}
              onClick={() => handleItemClick(index)}
              sx={{
                p: 2,
                textAlign: 'left',
                justifyContent: 'flex-start',
                backgroundColor: selectedItemIndex === index ? 'action.selected' : 'transparent',
              }}
            >
              <Box sx={{ textAlign: 'left' }}>
                {icon}
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">{description}</Typography>
              </Box>
            </Button>
          ))}
        </Box>
        <MobileLayout
          selectedItemIndex={selectedItemIndex}
          handleItemClick={handleItemClick}
          selectedFeature={selectedFeature}
        />
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, width: { md: '70%' } }}>
          <Card variant="outlined" sx={{ width: '100%', height: '100%', pointerEvents: 'none' }}>
            <Box
              sx={{
                m: 'auto',
                width: 420,
                height: 500,
                backgroundSize: 'contain',
                backgroundImage: items[selectedItemIndex].imageLight,
              }}
            />
          </Card>
        </Box>
      </Box>
    </Container>
  );
}
