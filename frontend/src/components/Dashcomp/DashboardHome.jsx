// src/components/Dashcomp/DashboardHome.jsx

import React from 'react';
import { Box, Typography, Grid } from '@mui/material';
import StatCard from './StatCard';
import HighlightedCard from './HighlightedCard';

// Two brand-new charts that reflect your actual data:
import InvoicesLineChart from './InvoicesLineChart';
import ContractsBarChart from './ContractsBarChart';

export default function DashboardHome() {
  // Example data for the stat cards:
  const statCards = [
    {
      title: 'Total Invoices',
      value: '78',
      interval: 'Last 30 days',
      trend: 'up',
      data: [5, 6, 8, 12, 15, 20, 25, 30, 34, 40, 42, 50, 56, 60, 64, 70, 78], // Sparkline
    },
    {
      title: 'Overdue Invoices',
      value: '4',
      interval: 'Last 30 days',
      trend: 'down',
      data: [2, 1, 2, 3, 4],
    },
    {
      title: 'Active Contracts',
      value: '15',
      interval: 'Currently',
      trend: 'up',
      data: [1, 2, 4, 5, 7, 10, 12, 15],
    },
    {
      title: 'Expiring Soon',
      value: '3',
      interval: 'Next 30 days',
      trend: 'neutral',
      data: [0, 1, 1, 2, 3],
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Overview Title */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Render the 4 stat cards */}
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <StatCard {...card} />
          </Grid>
        ))}
        {/* The "Get insights" highlight card */}
        <Grid item xs={12} sm={6} md={3}>
          <HighlightedCard />
        </Grid>
      </Grid>

      {/* Now our 2 new charts (invoices line chart + contracts bar chart) */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InvoicesLineChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <ContractsBarChart />
        </Grid>
      </Grid>
    </Box>
  );
}
