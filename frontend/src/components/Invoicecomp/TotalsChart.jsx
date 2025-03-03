import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Grid, TextField, Box, 
  FormControl, InputLabel, Select, MenuItem, Button 
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import Swal from 'sweetalert2';
import 'chart.js/auto';

// Helper: Adjust a date string to local "YYYY-MM-DD" format
const formatLocalDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().split('T')[0];
};

const TotalsChart = ({
  totals,
  formatCurrency,
  expenses,
  invoices,
  onDeleteExpense,
  onUpdateExpense
}) => {
  // State for date filter, chart type, and sorting options
  const [dateFilter, setDateFilter] = useState({
    fromDate: '',
    toDate: '',
    period: 'month', // Changed default to 'month' for broader visibility
  });
  const [chartType, setChartType] = useState('line');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Step 1: Calculate effective date range based on filters
  let effectiveFromDate, effectiveToDate;
  if (dateFilter.period !== 'all') {
    const now = new Date();
    effectiveToDate = new Date();
    switch (dateFilter.period) {
      case 'week':
        effectiveFromDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        effectiveFromDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'quarter':
        effectiveFromDate = new Date(now.setMonth(now.getMonth() - 3));
        break;
      case 'year':
        effectiveFromDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        break;
    }
  } else {
    effectiveFromDate = dateFilter.fromDate ? new Date(dateFilter.fromDate) : new Date('1900-01-01');
    effectiveToDate = dateFilter.toDate ? new Date(dateFilter.toDate) : new Date('2100-01-01');
  }

  // Step 2: Filter and sort expenses based on effective date range
  const getSortedExpenses = () => {
    if (!expenses || expenses.length === 0) return [];
    let filtered = expenses.filter(exp => {
      const expDate = new Date(exp.date);
      return expDate >= effectiveFromDate && expDate <= effectiveToDate;
    });
    const multiplier = sortOrder === 'desc' ? -1 : 1;
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'amount':
          return (Number(b.amount) - Number(a.amount)) * multiplier;
        case 'category':
          return a.category.localeCompare(b.category) * multiplier;
        case 'date':
        default:
          return (new Date(b.date) - new Date(a.date)) * multiplier;
      }
    });
  };

  const filteredExpenses = getSortedExpenses();
  const dynamicTotalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  // Compute filtered invoice total from raw invoice records
  const getFilteredInvoicesTotal = () => {
    if (!invoices || invoices.length === 0) return 0;
    return invoices
      .filter(inv => {
        const invDate = new Date(inv.createdAt || inv.created_at || inv.date);
        return invDate >= effectiveFromDate && invDate <= effectiveToDate;
      })
      .reduce((sum, inv) => sum + (parseFloat(inv.amount || inv.totalAmount) || 0), 0);
  };

  const filteredTotalInvoices = getFilteredInvoicesTotal();

  // Step 3: Determine granularity (daily or monthly) for charting
  const daysInRange = (effectiveToDate - effectiveFromDate) / (1000 * 60 * 60 * 24) + 1;
  const useDailyGranularity = daysInRange <= 31;

  // Step 4: Aggregate expenses and invoices (daily or monthly)
  const expenseAggregation = {};
  filteredExpenses.forEach(exp => {
    const dateObj = new Date(exp.date);
    const key = useDailyGranularity
      ? dateObj.toISOString().split('T')[0]
      : `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    expenseAggregation[key] = (expenseAggregation[key] || 0) + Number(exp.amount);
  });

  const invoiceAggregation = {};
  invoices.forEach(inv => {
    const dateObj = new Date(inv.createdAt || inv.created_at || inv.date);
    if (isNaN(dateObj)) return;
    const key = useDailyGranularity
      ? dateObj.toISOString().split('T')[0]
      : `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    invoiceAggregation[key] = (invoiceAggregation[key] || 0) + Number(inv.amount || inv.totalAmount || 0);
  });

  // Step 5: Generate labels within effective date range
  const generateDateLabels = (startDate, endDate, daily) => {
    const labels = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (daily) {
        labels.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        const monthLabel = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}`;
        if (!labels.includes(monthLabel)) labels.push(monthLabel);
        currentDate.setMonth(currentDate.getMonth() + 1);
      }
    }
    return labels;
  };

  const dynamicLabels = generateDateLabels(effectiveFromDate, effectiveToDate, useDailyGranularity);
  const dynamicExpenseData = dynamicLabels.map(label => expenseAggregation[label] || 0);
  const dynamicInvoiceData = dynamicLabels.map(label => invoiceAggregation[label] || 0);

  // Step 6: Chart configuration
  const chartConfig = {
    data: {
      labels: dynamicLabels,
      datasets: [
        {
          label: 'Invoices',
          data: dynamicInvoiceData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: chartType === 'bar' ? 'rgba(75, 192, 192, 0.5)' : undefined,
          tension: chartType === 'line' ? 0.1 : 0,
        },
        {
          label: 'Expenses',
          data: dynamicExpenseData,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: chartType === 'bar' ? 'rgba(255, 99, 132, 0.5)' : undefined,
          tension: chartType === 'line' ? 0.1 : 0,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top' },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { title: { display: true, text: useDailyGranularity ? 'Date' : 'Month' } },
        y: { beginAtZero: true, title: { display: true, text: 'Amount' } },
      },
    },
  };

  // Function to prompt for updating an expense using SweetAlert2
  const handleUpdateExpenseClick = (expense) => {
    const formattedDate = formatLocalDate(expense.date);
    Swal.fire({
      title: 'Update Expense',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Amount" type="number" value="${expense.amount}">
        <input id="swal-input2" class="swal2-input" placeholder="Date" type="date" value="${formattedDate}">
        <input id="swal-input3" class="swal2-input" placeholder="Category" type="text" value="${expense.category || ''}">
        <input id="swal-input4" class="swal2-input" placeholder="Description" type="text" value="${expense.description || ''}">
      `,
      focusConfirm: false,
      preConfirm: () => {
        return {
          amount: document.getElementById('swal-input1').value,
          date: document.getElementById('swal-input2').value,
          category: document.getElementById('swal-input3').value,
          description: document.getElementById('swal-input4').value,
        };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateExpense({ ...expense, ...result.value });
      }
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Filters Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>FILTERS</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="From Date"
                    type="date"
                    fullWidth
                    value={dateFilter.fromDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, fromDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="To Date"
                    type="date"
                    fullWidth
                    value={dateFilter.toDate}
                    onChange={(e) => setDateFilter({ ...dateFilter, toDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Period</InputLabel>
                    <Select
                      value={dateFilter.period}
                      onChange={(e) => setDateFilter({ ...dateFilter, period: e.target.value })}
                    >
                      <MenuItem value="all">All Time</MenuItem>
                      <MenuItem value="week">Last Week</MenuItem>
                      <MenuItem value="month">Last Month</MenuItem>
                      <MenuItem value="quarter">Last Quarter</MenuItem>
                      <MenuItem value="year">Last Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Chart Type</InputLabel>
                    <Select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                      <MenuItem value="line">Line Chart</MenuItem>
                      <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Totals Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Totals</Typography>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography>Total Invoices:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>{formatCurrency(filteredTotalInvoices)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>Total Expenses:</Typography>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: 'right' }}>
                  <Typography>{formatCurrency(dynamicTotalExpenses)}</Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Invoices vs Expenses</Typography>
              {chartType === 'line' ? (
                <Line data={chartConfig.data} options={chartConfig.options} />
              ) : (
                <Bar data={chartConfig.data} options={chartConfig.options} />
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Expenses List */}
        {filteredExpenses.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Grid container spacing={1} sx={{ fontWeight: 'bold', borderBottom: '2px solid', borderColor: 'divider', pb: 1 }}>
                    <Grid item xs={2}>
                      <Typography>Amount</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Date</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Category</Typography>
                    </Grid>
                    <Grid item xs={3}>
                      <Typography>Description</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography>Action</Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                  {filteredExpenses.map((exp) => (
                    <Grid
                      container
                      key={exp.id}
                      spacing={1}
                      alignItems="center"
                      sx={{
                        py: 1,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:hover': { backgroundColor: 'grey.100' },
                      }}
                    >
                      <Grid item xs={2}>
                        <Typography>{formatCurrency(exp.amount)}</Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography>{exp.date}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>{exp.category}</Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography>{exp.description}</Typography>
                      </Grid>
                      <Grid item xs={2} sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                          variant="contained" 
                          color="warning" 
                          size="small"
                          onClick={() => handleUpdateExpenseClick(exp)}
                        >
                          Update
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error" 
                          size="small"
                          onClick={() => onDeleteExpense && onDeleteExpense(exp.id)}
                        >
                          Delete
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default TotalsChart;