import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function ExpensesLineChart({ data }) {
  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: 'Expenses Over Time',
        data: data.expenses || [],
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  return (
    <Card variant="outlined" sx={{ minHeight: 350 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Expenses Over Time
        </Typography>
        <Line data={chartData} />
      </CardContent>
    </Card>
  );
}
