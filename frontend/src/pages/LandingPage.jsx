import React from 'react';
import { Container, Box } from '@mui/material';
import Navbar from '../components/Mainpage/Navbar';
import Hero from '../components/Mainpage/Hero';
import LogoCollection from '../components/Mainpage/LogoCollection';
import FeaturesCarousel from '../components/Mainpage/FeaturesCarousel'; // New Rolling Features
import Benefits from '../components/Mainpage/Benefits';
import Pricing from '../components/Mainpage/Pricing';
import FaqLong from '../components/Mainpage/FaqLong';
import Footer from '../components/Mainpage/Footer';

export default function LandingPage() {
  return (
    <Box>
      <Navbar />
      <Hero />

      <Container maxWidth="lg">
        <LogoCollection />
        <FeaturesCarousel /> {/* Features now roll inside a carousel */}
        <Benefits />
        <Pricing />
        <FaqLong />
      </Container>

      <Footer />
    </Box>
  );
}
