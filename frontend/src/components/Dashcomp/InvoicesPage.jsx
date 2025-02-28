import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Grid,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoices,
  getInvoicePdf,
  deleteInvoice,
  uploadFile,
  getInvoiceOverview,
} from '../../services/api';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Swal from 'sweetalert2';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import InvoicesLineChart from './InvoicesLineChart';
import ExpensesLineChart from './ExpensesLineChart';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]); // Placeholder – update when expense APIs are ready
  const [totals, setTotals] = useState({ totalInvoices: 0, totalExpenses: 0 });
  // Dummy aggregated data for the top charts and combined chart section:
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    invoices: [10, 15, 20, 25, 30, 35],
    expenses: [5, 10, 15, 10, 5, 10],
  });

  const navigate = useNavigate();

  // Utility for currency formatting
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  useEffect(() => {
    fetchInvoices();
    fetchExpenses();
    fetchTotals();
  }, []);

  async function fetchInvoices() {
    try {
      const data = await getAllInvoices();
      // Sort descending by created_at and pick the 10 most recent
      const sortedInvoices = await Promise.all(
        data.invoices
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
          .map(async (invoice) => {
            const pdfData = await getInvoicePdf(invoice.id);
            return { ...invoice, pdfUrl: pdfData.url };
          })
      );
      setInvoices(sortedInvoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      setInvoices([]);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch invoices. Please try again later.',
        icon: 'error',
      });
    }
  }

  async function fetchExpenses() {
    try {
      // Replace with an actual API call when implemented.
      setExpenses([]);
      console.log('Placeholder for expenses.');
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch expenses.',
        icon: 'error',
      });
    }
  }

  async function fetchTotals() {
    try {
      const overview = await getInvoiceOverview();
      setTotals({
        totalInvoices: overview.totalAmount || 0,
        totalExpenses: 0, // Placeholder for expenses total
      });
    } catch (error) {
      console.error('Error fetching totals:', error);
      setTotals({ totalInvoices: 0, totalExpenses: 0 });
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch totals.',
        icon: 'error',
      });
    }
  }

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      await uploadFile(file);
      Swal.fire({
        title: 'Success',
        text: 'Invoice uploaded successfully!',
        icon: 'success',
      });
      fetchInvoices();
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        title: 'Error',
        text: 'Upload failed. Please try again.',
        icon: 'error',
      });
    }
  };

  async function handleDelete(id) {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Delete Invoice?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });
      if (!isConfirmed) return;
      await deleteInvoice(id);
      fetchInvoices();
      Swal.fire({
        title: 'Deleted!',
        text: 'Invoice deleted successfully.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete invoice.',
        icon: 'error',
      });
    }
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Top Section: Charts & Action Buttons */}
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <InvoicesLineChart data={chartData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpensesLineChart data={chartData} />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" onClick={() => navigate('/dashboard/create-invoice')}>
              Create Invoice
            </Button>
            <Button variant="contained" component="label">
              Import Invoice
              <input type="file" hidden onChange={handleFileUpload} />
            </Button>
            <Button variant="contained" onClick={() => navigate('/dashboard/add-expense')}>
              Add Expense
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Recent Invoices Section */}
      <Typography variant="h5" gutterBottom>
        Recent Invoices
      </Typography>
      <Paper sx={{ p: 2, mb: 3 }}>
        {invoices.length === 0 ? (
          <Typography>No recent invoices found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {invoices.map((invoice) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={invoice.id}>
                <Card sx={{ height: 400, display: 'flex', flexDirection: 'column' }}>
                  <CardContent
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" gutterBottom>
                        {invoice.customerName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        ID: {invoice.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Amount: {formatCurrency(invoice.amount)}
                      </Typography>
                    </Box>
                    <Box sx={{ mt: 1, height: 200, overflow: 'hidden', borderRadius: 1 }}>
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        {/* Only render the first page */}
                        <Viewer fileUrl={invoice.pdfUrl} defaultScale={0.5} initialPage={0} />
                      </Worker>
                    </Box>
                  </CardContent>
                  <Stack direction="row" spacing={1} sx={{ p: 1, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate(`/dashboard/invoices/${invoice.id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => handleDelete(invoice.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Paper>

      {/* Totals & Combined Invoices vs Expenses Chart */}
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
    </Box>
  );
}
