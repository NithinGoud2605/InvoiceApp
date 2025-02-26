// src/components/Dashcomp/InvoicesPage.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Grid,
  Button,
  Stack,
} from '@mui/material';
import InvoiceVsExpenseChart from './InvoiceVsExpenseChart'; // Make sure you have this

// Optional inline Range Selector
function RangeSelector({ value, onChange }) {
  return (
    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
      <Button
        variant={value === '7d' ? 'contained' : 'outlined'}
        onClick={() => onChange('7d')}
      >
        7D
      </Button>
      <Button
        variant={value === '30d' ? 'contained' : 'outlined'}
        onClick={() => onChange('30d')}
      >
        30D
      </Button>
      <Button
        variant={value === '90d' ? 'contained' : 'outlined'}
        onClick={() => onChange('90d')}
      >
        90D
      </Button>
    </Stack>
  );
}

export default function InvoicesPage() {
  const [range, setRange] = useState('7d');

  // Dummy invoice list
  const [invoices, setInvoices] = useState([
    { id: 101, status: 'Paid', amount: 500, date: '2023-09-01' },
    { id: 102, status: 'Pending', amount: 1200, date: '2023-09-03' },
    { id: 103, status: 'Overdue', amount: 900, date: '2023-09-05' },
  ]);

  // For the chart comparing invoice vs expense
  const [labels, setLabels] = useState([]);
  const [invoiceSeries, setInvoiceSeries] = useState([]);
  const [expenseSeries, setExpenseSeries] = useState([]);

  useEffect(() => {
    // Generate dummy data each time `range` changes
    if (range === '7d') {
      const days = ['Day1', 'Day2', 'Day3', 'Day4', 'Day5', 'Day6', 'Day7'];
      setLabels(days);
      setInvoiceSeries(days.map(() => Math.floor(Math.random() * 1000)));
      setExpenseSeries(days.map(() => Math.floor(Math.random() * 800)));
    } else if (range === '30d') {
      const allDays = Array.from({ length: 30 }, (_, i) => `Day${i + 1}`);
      setLabels(allDays);
      setInvoiceSeries(allDays.map(() => Math.floor(Math.random() * 2000)));
      setExpenseSeries(allDays.map(() => Math.floor(Math.random() * 1500)));
    } else {
      // 90d
      const allDays = Array.from({ length: 90 }, (_, i) => `Day${i + 1}`);
      setLabels(allDays);
      setInvoiceSeries(allDays.map(() => Math.floor(Math.random() * 3000)));
      setExpenseSeries(allDays.map(() => Math.floor(Math.random() * 2500)));
    }
  }, [range]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Invoices
      </Typography>

      {/* Range Selector Buttons */}
      <RangeSelector value={range} onChange={setRange} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {/* Chart comparing invoice totals to expense totals */}
          <InvoiceVsExpenseChart
            labels={labels}
            invoiceSeries={invoiceSeries}
            expenseSeries={expenseSeries}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Typography variant="subtitle1" gutterBottom>
            Invoice List
          </Typography>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell>{inv.id}</TableCell>
                      <TableCell>{inv.status}</TableCell>
                      <TableCell>{inv.amount}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
