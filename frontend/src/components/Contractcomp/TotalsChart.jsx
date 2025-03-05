import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Pie } from 'react-chartjs-2'; // If you have chart.js or any library set up

export default function TotalsChart({ contracts }) {
  // Example: Summaries by status
  const statusCounts = contracts.reduce((acc, contract) => {
    acc[contract.status] = (acc[contract.status] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Contracts by Status',
        data: Object.values(statusCounts),
      },
    ],
  };

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Contracts Overview
      </Typography>
      <Pie data={data} />
    </Paper>
  );
}
