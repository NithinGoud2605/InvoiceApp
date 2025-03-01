import React, { useState } from 'react';
import { 
  Card, CardContent, Typography, Grid, TextField, Box, 
  FormControl, InputLabel, Select, MenuItem, Button 
} from '@mui/material';
import { Line, Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const TotalsChart = ({
  totals,
  chartData,
  formatCurrency,
  expenses,
  onDeleteExpense,
  onUpdateExpense
}) => {
  // State for date filter, chart type, and sorting options
  const [dateFilter, setDateFilter] = useState({
    fromDate: '',
    toDate: '',
    period: 'week', // Options: all, week, month, quarter, year
  });
  const [chartType, setChartType] = useState('line'); // Options: line, bar
  const [sortBy, setSortBy] = useState('date'); // Options: date, amount, category
  const [sortOrder, setSortOrder] = useState('desc'); // Options: asc, desc

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

  // Step 3: Determine granularity (daily or monthly) based on date range
  const daysInRange = (effectiveToDate - effectiveFromDate) / (1000 * 60 * 60 * 24) + 1;
  const useDailyGranularity = daysInRange <= 31;

  // Step 4: Aggregate expenses (daily or monthly)
  const expenseAggregation = {};
  filteredExpenses.forEach(exp => {
    const dateObj = new Date(exp.date);
    const key = useDailyGranularity
      ? dateObj.toISOString().split('T')[0]
      : `${dateObj.getFullYear()}-${(dateObj.getMonth() + 1).toString().padStart(2, '0')}`;
    expenseAggregation[key] = (expenseAggregation[key] || 0) + Number(exp.amount);
  });

  // Step 5: Generate all labels within the range
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

  const allLabels = generateDateLabels(effectiveFromDate, effectiveToDate, useDailyGranularity);
  const dynamicExpenseLabels = allLabels;
  const dynamicExpenseData = dynamicExpenseLabels.map(label => expenseAggregation[label] || 0);

  // Step 6: Prorate invoice data based on granularity
  const invoiceData = dynamicExpenseLabels.map(label => {
    const [year, month, day] = label.split('-').map(Number);
    const matchingMonthLabel = `${year}-${month.toString().padStart(2, '0')}`;
    const index = chartData.labels.indexOf(matchingMonthLabel);
    if (index === -1) return 0;

    const invoiceTotal = Number(chartData.invoices[index]);
    if (useDailyGranularity) {
      const daysInMonth = new Date(year, month, 0).getDate();
      return invoiceTotal / daysInMonth;
    } else {
      const monthStart = new Date(year, month - 1, 1);
      const monthEnd = new Date(year, month, 0);
      const intersectionStart = new Date(Math.max(monthStart, effectiveFromDate));
      const intersectionEnd = new Date(Math.min(monthEnd, effectiveToDate));
      if (intersectionStart > intersectionEnd) return 0;
      const intersectionDays = (intersectionEnd - intersectionStart) / (1000 * 60 * 60 * 24) + 1;
      const monthDays = (monthEnd - monthStart) / (1000 * 60 * 60 * 24) + 1;
      return invoiceTotal * (intersectionDays / monthDays);
    }
  });

  const filteredTotalInvoices = invoiceData.reduce((sum, val) => sum + val, 0);

  // Step 7: Chart configuration using dynamic data
  const chartConfig = {
    data: {
      labels: dynamicExpenseLabels,
      datasets: [
        {
          label: 'Invoices',
          data: invoiceData,
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
                    onChange={(e) =>
                      setDateFilter({ ...dateFilter, fromDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="To Date"
                    type="date"
                    fullWidth
                    value={dateFilter.toDate}
                    onChange={(e) =>
                      setDateFilter({ ...dateFilter, toDate: e.target.value })
                    }
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <FormControl fullWidth>
                    <InputLabel>Period</InputLabel>
                    <Select
                      value={dateFilter.period}
                      onChange={(e) =>
                        setDateFilter({ ...dateFilter, period: e.target.value })
                      }
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
                    <Select
                      value={chartType}
                      onChange={(e) => setChartType(e.target.value)}
                    >
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

        {/* Expenses List with Sorting, Delete & Update Buttons */}
        {filteredExpenses.length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {/* Header Row */}
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
                {/* Scrollable List */}
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
                        <Typography>{new Date(exp.date).toLocaleDateString()}</Typography>
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
                          onClick={() => onUpdateExpense && onUpdateExpense(exp)}
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
