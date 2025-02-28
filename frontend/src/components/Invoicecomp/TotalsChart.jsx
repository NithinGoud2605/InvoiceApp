import React from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TotalsChart = ({ totals, chartData, formatCurrency }) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Totals</Typography>
            <Grid container>
              <Grid item xs={6}>
                <Typography variant="body2">Total Invoices:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{formatCurrency(totals.totalInvoices)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2">Total Expenses:</Typography>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Typography variant="body2">{formatCurrency(totals.totalExpenses)}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent>
            <Typography variant="h6">Invoices vs Expenses</Typography>
            <Line
              data={{
                labels: chartData.labels || [],
                datasets: [
                  {
                    label: 'Invoices',
                    data: chartData.invoices || [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                  {
                    label: 'Expenses',
                    data: chartData.expenses || [],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1,
                  },
                ],
              }}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TotalsChart;
