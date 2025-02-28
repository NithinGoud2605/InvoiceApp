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
  Button,
  Stack,
  Grid
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  getAllInvoices,
  getInvoicePdf,
  deleteInvoice,
  uploadFile,
  getInvoiceOverview,
} from '../../services/api'; // Adjust path to your API file
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Swal from 'sweetalert2';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [expenses, setExpenses] = useState([]); // Placeholder until expense APIs are added
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchInvoices();
    fetchExpenses(); // Placeholder function
    fetchTotals();
    fetchAggregatedData(); // Placeholder function
  }, []);

  // Fetch invoices
  async function fetchInvoices() {
    try {
      const data = await getAllInvoices();
      console.log("✅ Invoices Data:", data.invoices);
      setInvoices(data.invoices || []);
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

  // Placeholder for fetchExpenses (until expense APIs are implemented)
  async function fetchExpenses() {
    try {
      // Replace with actual API call when implemented, e.g., getAllExpenses()
      setExpenses([]); // Temporary placeholder
      console.log("✅ Expenses Data: Placeholder - awaiting API implementation");
    } catch (error) {
      console.error('Error fetching expenses:', error);
      setExpenses([]);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch expenses. This feature may not be available yet.',
        icon: 'error',
      });
    }
  }

  // Fetch totals for invoices
  async function fetchTotals() {
    try {
      const invoicesOverview = await getInvoiceOverview();
      // Replace with actual expense total API when implemented, e.g., getExpenseTotal()
      setTotalInvoices(invoicesOverview.totalAmount || 0);
      setTotalExpenses(0); // Placeholder until expense API exists
    } catch (error) {
      console.error('Error fetching totals:', error);
      setTotalInvoices(0);
      setTotalExpenses(0);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch totals. Displaying zeros as fallback.',
        icon: 'error',
      });
    }
  }

  // Placeholder for aggregated data fetch
  async function fetchAggregatedData() {
    try {
      // Replace with actual API calls when implemented
      const invoicesData = {}; // Placeholder
      const expensesData = {}; // Placeholder

      const months = new Set([...Object.keys(invoicesData), ...Object.keys(expensesData)]);
      const normalizedInvoices = {};
      const normalizedExpenses = {};

      for (const month of months) {
        normalizedInvoices[month] = invoicesData[month] || 0;
        normalizedExpenses[month] = expensesData[month] || 0;
      }

      const labels = Array.from(months).sort();
      const data = {
        labels,
        datasets: [
          {
            label: 'Invoices',
            data: labels.map((month) => normalizedInvoices[month]),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'Expenses',
            data: labels.map((month) => normalizedExpenses[month]),
            fill: false,
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
        ],
      };

      setChartData(data);
    } catch (error) {
      console.error('Error fetching aggregated data:', error);
      setChartData({ labels: [], datasets: [] });
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch chart data. Displaying an empty chart.',
        icon: 'error',
      });
    }
  }

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await uploadFile(file);
      Swal.fire({
        title: 'Success',
        text: 'Invoice uploaded successfully!',
        icon: 'success',
      });
      console.log('Invoice ID:', data.invoiceId);
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

  // Handle preview: fetch pre-signed URL and set selectedPdf
  const handlePreview = async (invoiceId) => {
    try {
      const data = await getInvoicePdf(invoiceId);
      setSelectedPdf(data.url);
    } catch (error) {
      console.error('Error fetching invoice PDF:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to load invoice preview.',
        icon: 'error',
      });
    }
  };

  // Handle delete invoice (and refresh list)
  async function handleDelete(id) {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure you want to delete this invoice?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
  
      if (!isConfirmed) return;
  
      await deleteInvoice(id);
      fetchInvoices();
      Swal.fire({
        title: 'Success',
        text: 'Invoice deleted successfully!',
        icon: 'success',
      });
      // Clear preview if the deleted invoice was selected
      if (selectedPdf && invoices.find((inv) => inv.id === id)?.pdfUrl === selectedPdf) {
        setSelectedPdf(null);
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete invoice. Please try again.',
        icon: 'error',
      });
    }
  }

  // Placeholder for handleDeleteExpense
  async function handleDeleteExpense(id) {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Are you sure you want to delete this expense?',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });

      if (!isConfirmed) return;
      // Replace with actual API call, e.g., deleteExpense(id)
      fetchExpenses(); // Placeholder refetch
      Swal.fire({
        title: 'Success',
        text: 'Expense deleted successfully! (Placeholder)',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error deleting expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete expense. Please try again.',
        icon: 'error',
      });
    }
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Invoices</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
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

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Invoice List</Typography>
              {invoices.length === 0 ? (
                <Typography>No invoices found</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>
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
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                          <Button
                            variant="outlined"
                            color="info"
                            size="small"
                            onClick={() => handlePreview(invoice.id)}
                            sx={{ ml: 1 }}
                          >
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          {selectedPdf ? (
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Preview</Typography>
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer fileUrl={selectedPdf} />
                </Worker>
              </CardContent>
            </Card>
          ) : (
            <Typography variant="body2">Select an invoice to preview its PDF.</Typography>
          )}
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>Expenses List</Typography>
              {expenses.length === 0 ? (
                <Typography>No expenses found</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {expenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell>{expense.id}</TableCell>
                        <TableCell>{expense.amount}</TableCell>
                        <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                        <TableCell>{expense.category}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            onClick={() => navigate(`/dashboard/expenses/${expense.id}/edit`)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="outlined"
                            color="secondary"
                            size="small"
                            onClick={() => handleDeleteExpense(expense.id)}
                            sx={{ ml: 1 }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6">Totals</Typography>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Invoices</TableCell>
                    <TableCell align="right">{totalInvoices}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Expenses</TableCell>
                    <TableCell align="right">{totalExpenses}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <Typography variant="subtitle1" sx={{ mt: 2 }}>Invoices vs. Expenses Trend</Typography>
              <Line data={chartData} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
