import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import { Line } from 'react-chartjs-2';

export default function StatCard({ title, value, interval, trend, trendLabel, data }) {
  // data is an array of 4 numeric values for the sparkline
  const chartData = {
    labels: ['', '', '', ''],
    datasets: [
      {
        data: data,
        // no styling to keep it minimal
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
    },
    elements: {
      point: { radius: 0 },
      line: {
        tension: 0.3,
        borderWidth: 2,
      },
    },
  };

  // Dynamic color for the trend label
  let trendColor = 'inherit';
  if (trend === 'up') trendColor = 'green';
  if (trend === 'down') trendColor = 'red';

  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 'bold', my: 1 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {interval}
        </Typography>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Line data={chartData} options={chartOptions} height={50} />
        </Box>
        <Typography variant="caption" sx={{ color: trendColor }}>
          {trendLabel}
        </Typography>
      </CardContent>
    </Card>
  );
}
