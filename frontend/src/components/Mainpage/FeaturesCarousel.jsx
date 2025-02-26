import React from 'react';
import { Box, Typography, Card, CardContent, useTheme } from '@mui/material';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Material-UI Icons
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudIcon from '@mui/icons-material/Cloud';

// Features Data with Material-UI Icons
const features = [
  { 
    title: 'Smart Invoice Management', 
    desc: 'Generate invoices with ease and track payments.', 
    icon: <ReceiptIcon fontSize="large" /> 
  },
  { 
    title: 'Automated Payment Tracking', 
    desc: 'Monitor invoice statuses automatically via integrated gateways like Stripe and PayPal.', 
    icon: <PaymentIcon fontSize="large" /> 
  },
  { 
    title: 'Recurring Invoices', 
    desc: 'Set up automatic monthly or yearly invoices with reminder notifications.', 
    icon: <AutorenewIcon fontSize="large" /> 
  },
  { 
    title: 'E-Signature Contracts', 
    desc: 'Sign and manage legally binding contracts with built-in e-signature and compliance alerts.', 
    icon: <EditIcon fontSize="large" /> 
  },
  { 
    title: 'Custom Dashboards', 
    desc: 'View key metrics on a single dashboard.', 
    icon: <DashboardIcon fontSize="large" /> 
  },
  { 
    title: 'Cloud Storage', 
    desc: 'Securely store all invoices and contracts online.', 
    icon: <CloudIcon fontSize="large" /> 
  },
];

// Carousel Settings
const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  adaptiveHeight: false,
  responsive: [
    { breakpoint: 960, settings: { slidesToShow: 2 } },
    { breakpoint: 600, settings: { slidesToShow: 1 } },
  ],
};

export default function FeaturesCarousel() {
  const theme = useTheme(); // Access the current theme

  return (
    <Box
      sx={{
        py: 8,
        textAlign: 'center',
        bgcolor: theme.palette.background.default, // Theme-aware background
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          color: theme.palette.text.primary, // Theme-aware text color
        }}
      >
        Powerful Features for Your Business
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary, // Theme-aware secondary text
          mb: 6,
          maxWidth: '600px',
          mx: 'auto',
        }}
      >
        Discover how our platform simplifies invoice and contract management with intuitive tools.
      </Typography>

      <Slider {...carouselSettings}>
        {features.map((feature, index) => (
          <Box key={index} sx={{ px: 2 }}>
            <Card
              sx={{
                p: 4,
                borderRadius: 3,
                minHeight: 200,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                bgcolor: theme.palette.background.paper, // Theme-aware card background
                boxShadow: theme.shadows[4], // Theme-aware shadow
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  boxShadow: theme.shadows[8], // Stronger shadow on hover
                  transform: 'translateY(-5px)',
                },
              }}
            >
              <CardContent
                sx={{
                  p: 0,
                  flexGrow: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    color: theme.palette.text.primary, // Theme-aware text
                  }}
                >
                  {feature.icon}
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary, // Theme-aware secondary text
                  }}
                >
                  {feature.desc}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
