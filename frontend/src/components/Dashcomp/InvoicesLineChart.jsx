// src/components/Dashcomp/InvoicesLineChart.jsx
import React from 'react';
import { Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { LineChart } from '@mui/x-charts/LineChart';

/**
 * Example line chart that shows invoice count or amount over the past 6 months.
 */
export default function InvoicesLineChart() {
  // Example X-axis labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  // Example data: total invoice amounts each month
  const invoiceAmounts = [1200, 1500, 2500, 1800, 3000, 4000];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          Invoices Over Last 6 Months
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h4">$4,000</Typography>
          <Chip label="+33%" size="small" color="success" />
        </Stack>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          Total invoice amount in Jun
        </Typography>

        <LineChart
          height={240}
          margin={{ left: 50, top: 20, bottom: 20 }}
          xAxis={[
            {
              scaleType: 'point',
              data: months,
            },
          ]}
          series={[
            {
              id: 'invoices',
              label: 'Invoices',
              data: invoiceAmounts,
              showMark: true,
              area: true,
            },
          ]}
          grid={{ horizontal: true }}
          slotProps={{
            legend: { hidden: true },
          }}
        />
      </CardContent>
    </Card>
  );
}
