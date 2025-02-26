// src/components/Dashcomp/ContractsBarChart.jsx
import React from 'react';
import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';

/**
 * Example bar chart for contract data, e.g. # of new contracts each month
 */
export default function ContractsBarChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Example data: how many new contracts were signed each month
  const contractCounts = [2, 4, 5, 3, 6, 8];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Contracts Signed
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4">8</Typography>
          <Chip label="+2" size="small" color="success" />
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Additional contracts in Jun
        </Typography>

        <BarChart
          height={240}
          margin={{ left: 50, top: 20, bottom: 20 }}
          xAxis={[
            {
              scaleType: 'band',
              data: months,
            },
          ]}
          series={[
            {
              id: 'contracts',
              label: 'Contracts',
              data: contractCounts,
            },
          ]}
          slotProps={{
            legend: { hidden: true },
          }}
          grid={{ horizontal: true }}
        />
      </CardContent>
    </Card>
  );
}
