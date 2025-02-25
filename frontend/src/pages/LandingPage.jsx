// src/pages/LandingPage.jsx
import React from 'react';
import AppTheme from '../shared-theme/AppTheme';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import LogoCollection from '../components/LogoCollection';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';

export default function LandingPage(props) {
  return (
    <AppTheme {...props}>
      <Navbar />
      <Hero />
      <div>
        <LogoCollection />
        <Features />
        <Pricing />
        <FAQ />
        <Footer />
      </div>
    </AppTheme>
  );
}
