import React from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';

// Import your API methods
import {
  getAllInvoices,
  getInvoicePdf,
  deleteInvoice,
  uploadFile,
  createExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
  updateInvoice,
  getAllClients,
  createClient,
  getInvoiceOverview,
} from '../../services/api';

// Import your UI components
import ActionButtons from './ActionButtons';
import RecentInvoices from './RecentInvoices';
import TotalsChart from './TotalsChart';
import MissingInfoModal from './MissingInfoModal';
import EditInvoiceModal from './EditInvoiceModal';
import StatCard from '../../components/Dashcomp/StatCard';

//
// ──────────────────────────────────────────────────────────────
//   HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────
//

/**
 * Returns the start and end Date objects for a given year + zero-based month in UTC.
 * Example: getMonthRange(2025, 0) => Jan 1, 2025 00:00 UTC to Jan 31, 2025 23:59 UTC.
 */
function getMonthRange(year, month) {
  const adjustedDate = new Date(Date.UTC(year, month, 1));
  const realYear = adjustedDate.getUTCFullYear();
  const realMonth = adjustedDate.getUTCMonth();

  const start = new Date(Date.UTC(realYear, realMonth, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(realYear, realMonth + 1, 0, 23, 59, 59, 999));

  return { start, end };
}

/** Simple helper: DRAFT or SENT = "active" */
const isActiveInvoice = (inv) => ['DRAFT', 'SENT'].includes(inv.status);

/** Returns a numeric percentage difference between two values (from 'previous' to 'current'). */
function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : Infinity; 
  }
  const change = ((current - previous) / previous) * 100;
  return Number.isFinite(change) ? change : 0;
}

/**
 * Filters invoices to just those created in the specified year/month,
 * then returns the "aggregated" metric: e.g., count of "active" or total amount, etc.
 */
function getInvoicesMetricForMonth(invoices, year, month, metric) {
  const { start, end } = getMonthRange(year, month);

  // Debugging: Log the range and invoices being checked
  console.log(`Filtering for ${year}-${month + 1}: Start ${start}, End ${end}`);
  
  const monthlyInvoices = invoices.filter((inv) => {
    const createdAt = new Date(inv.createdAt);
    const isMatch = createdAt >= start && createdAt <= end;
    console.log(`Invoice ${inv.id}: created_at=${inv.created_at}, parsed=${createdAt}, matches=${isMatch}`);
    return isMatch;
  });

  console.log(`Found ${monthlyInvoices.length} invoices for ${year}-${month + 1}`);

  switch (metric) {
    case 'ACTIVE_COUNT':
      return monthlyInvoices.filter(isActiveInvoice).length;

    case 'AMOUNT_SUM':
      return monthlyInvoices.reduce(
        (sum, inv) => sum + parseFloat(inv.totalAmount || 0),
        0
      );

    case 'COUNT_ALL':
      return monthlyInvoices.length;

    default:
      return 0;
  }
}

/**
 * Builds a 4-element sparkline array for the "last 4 months" inclusive of the current month.
 * E.g. offsets = [-3, -2, -1, 0].
 */
function buildLast4MonthsSparkLine(invoices, metric) {
  const now = new Date();
  const baseYear = now.getUTCFullYear();
  const baseMonth = now.getUTCMonth();

  const monthOffsets = [-3, -2, -1, 0];

  const values = monthOffsets.map((offset) => {
    const target = new Date(Date.UTC(baseYear, baseMonth + offset, 1));
    const year = target.getUTCFullYear();
    const month = target.getUTCMonth();
    return getInvoicesMetricForMonth(invoices, year, month, metric);
  });

  return values;
}

export default function InvoicesPage() {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  //
  // ──────────────────────────────────────────────────────────────
  //   1) FETCH QUERIES
  // ──────────────────────────────────────────────────────────────
  //
  const {
    data: invoicesQueryData,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      try {
        const data = await getAllInvoices();
        const allInvoices = data.invoices;

        // Debugging: Log all invoices to check data
        console.log('Fetched All Invoices:', allInvoices);

        const recentInvoices = await Promise.all(
          allInvoices
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 10)
            .map(async (invoice) => {
              const pdfData = await getInvoicePdf(invoice.id);
              return { ...invoice, pdfUrl: pdfData.url };
            })
        );
        return { allInvoices, recentInvoices };
      } catch (error) {
        if (error?.error === 'Unauthorized') {
          navigate('/sign-in');
        }
        throw error;
      }
    },
  });

  const {
    data: expensesData,
    isLoading: expensesLoading,
    refetch: refetchExpenses,
  } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const expenseData = await getAllExpenses();
      return expenseData.expenses;
    },
  });

  const {
    data: clientsData,
    isLoading: clientsLoading,
  } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const clientData = await getAllClients();
      return clientData.clients;
    },
  });

  const {
    data: overviewData,
    isLoading: overviewLoading,
  } = useQuery({
    queryKey: ['overview'],
    queryFn: getInvoiceOverview,
  });

  const isLoading = invoicesLoading || expensesLoading || clientsLoading || overviewLoading;

  //
  // ──────────────────────────────────────────────────────────────
  //   2) INVOICES & ENRICHED DATA
  // ──────────────────────────────────────────────────────────────
  //
  const allInvoices = invoicesQueryData?.allInvoices || [];
  const recentInvoices = invoicesQueryData?.recentInvoices || [];
  const expenses = expensesData || [];
  const existingClients = clientsData || [];

  const enrichedInvoices = React.useMemo(() => {
    return recentInvoices.map((invoice) => {
      if (invoice.clientId && !invoice.clientName && existingClients.length > 0) {
        const client = existingClients.find((c) => c.id === invoice.clientId);
        return { ...invoice, clientName: client?.name || invoice.clientName };
      }
      return invoice;
    });
  }, [recentInvoices, existingClients]);

  //
  // ──────────────────────────────────────────────────────────────
  //   3) LAST 4 MONTHS SPARKLINES
  // ──────────────────────────────────────────────────────────────
  //
  const activeSparkData = buildLast4MonthsSparkLine(allInvoices, 'ACTIVE_COUNT');
  const amountSparkData = buildLast4MonthsSparkLine(allInvoices, 'AMOUNT_SUM');
  const countSparkData = buildLast4MonthsSparkLine(allInvoices, 'COUNT_ALL');

  const activeFinal = activeSparkData[3]; 
  const amountFinal = amountSparkData[3]; 
  const countFinal = countSparkData[3]; 

  const activeInitial = activeSparkData[0];
  const amountInitial = amountSparkData[0];
  const countInitial = countSparkData[0];

  const activeChange = calculatePercentageChange(activeFinal, activeInitial);
  const amountChange = calculatePercentageChange(amountFinal, amountInitial);
  const countChange = calculatePercentageChange(countFinal, countInitial);

  const activeTrend = activeChange > 0 ? 'up' : activeChange < 0 ? 'down' : 'neutral';
  const amountTrend = amountChange > 0 ? 'up' : amountChange < 0 ? 'down' : 'neutral';
  const countTrend = countChange > 0 ? 'up' : countChange < 0 ? 'down' : 'neutral';

  const activeTrendLabel =
    activeChange === Infinity
      ? '∞% ↑'
      : `${activeChange.toFixed(2)}% ${activeChange > 0 ? '↑' : activeChange < 0 ? '↓' : ''}`;
  const amountTrendLabel =
    amountChange === Infinity
      ? '∞% ↑'
      : `${amountChange.toFixed(2)}% ${amountChange > 0 ? '↑' : amountChange < 0 ? '↓' : ''}`;
  const countTrendLabel =
    countChange === Infinity
      ? '∞% ↑'
      : `${countChange.toFixed(2)}% ${countChange > 0 ? '↑' : countChange < 0 ? '↓' : ''}`;

  //
  // ──────────────────────────────────────────────────────────────
  //   4) LOCAL STATES & HANDLERS
  // ──────────────────────────────────────────────────────────────
  //
  const [missingFields, setMissingFields] = React.useState([]);
  const [invoiceIdToUpdate, setInvoiceIdToUpdate] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const response = await uploadFile(file);
      Swal.fire({
        title: 'Success',
        text: 'Invoice uploaded successfully!',
        icon: 'success',
      });

      if (response.missingFields?.length > 0) {
        setMissingFields(response.missingFields);
        setInvoiceIdToUpdate(response.invoiceId);
        setModalOpen(true);
      }

      refetchInvoices();
    } catch (error) {
      console.error('Upload failed:', error);
      Swal.fire({
        title: 'Error',
        text: 'Upload failed. Please try again.',
        icon: 'error',
      });
    }

    setIsUploading(false);
  };

  const handleExpenseSubmit = async (expenseData) => {
    try {
      await createExpense(expenseData);
      refetchExpenses();
      Swal.fire({
        title: 'Success',
        text: 'Expense added successfully!',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error adding expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add expense. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleMissingInfoSubmit = async (filledData) => {
    try {
      const updateData = {
        ...(filledData.totalAmount && { amount: filledData.totalAmount }),
        ...(filledData.dueDate && { dueDate: filledData.dueDate }),
      };

      if (filledData.newClient) {
        const newClient = await createClient(filledData.newClient);
        updateData.clientId = newClient.id;
      } else {
        updateData.clientId = filledData.clientId || null;
      }

      await updateInvoice(invoiceIdToUpdate, updateData);
      Swal.fire({
        title: 'Success',
        text: 'Invoice updated successfully!',
        icon: 'success',
      });
      setModalOpen(false);
      refetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update invoice. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleEdit = (id) => {
    const invoice = enrichedInvoices.find((inv) => inv.id === id);
    if (invoice) {
      setSelectedInvoice(invoice);
      setEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      const invoiceData = {
        amount: updatedData.totalAmount,
        dueDate: updatedData.dueDate,
      };

      if (updatedData.newClient) {
        const newClient = await createClient(updatedData.newClient);
        invoiceData.clientId = newClient.id;
      } else if (updatedData.clientId) {
        invoiceData.clientId = updatedData.clientId;
      }

      await updateInvoice(selectedInvoice.id, invoiceData);
      Swal.fire({
        title: 'Success',
        text: 'Invoice updated successfully!',
        icon: 'success',
      });
      setEditModalOpen(false);
      refetchInvoices();
    } catch (error) {
      console.error('Error updating invoice:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update invoice. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleDelete = async (id) => {
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
      refetchInvoices();
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
  };

  const handleExpenseDelete = async (expenseId) => {
    try {
      await deleteExpense(expenseId);
      refetchExpenses();
    } catch (error) {
      console.error('Failed to delete expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete expense. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleExpenseUpdate = async (expense) => {
    try {
      await updateExpense(expense.id, expense);
      refetchExpenses();
    } catch (error) {
      console.error('Failed to update expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update expense. Please try again.',
        icon: 'error',
      });
    }
  };

  //
  // ──────────────────────────────────────────────────────────────
  //   5) LOADING STATE
  // ──────────────────────────────────────────────────────────────
  //
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Debugging: Log sparkline data
  console.log('Active Spark Data:', activeSparkData);
  console.log('Amount Spark Data:', amountSparkData);
  console.log('Count Spark Data:', countSparkData);

  //
  // ──────────────────────────────────────────────────────────────
  //   6) RENDER
  // ──────────────────────────────────────────────────────────────
  //
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Active Invoices (4-mo)"
            value={String(activeFinal)}
            interval="Last 4 months"
            trend={activeTrend}
            trendLabel={activeTrendLabel}
            data={activeSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Invoices Total (4-mo)"
            value={formatCurrency(amountFinal)}
            interval="Last 4 months"
            trend={amountTrend}
            trendLabel={amountTrendLabel}
            data={amountSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard
            title="Total Invoices (4-mo)"
            value={String(countFinal)}
            interval="Last 4 months"
            trend={countTrend}
            trendLabel={countTrendLabel}
            data={countSparkData}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <ActionButtons
            onFileUpload={handleFileUpload}
            onExpenseSubmit={handleExpenseSubmit}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 1, p: 1, borderRadius: '8px' }}>
        <Typography variant="h5" align="center">
          Recent Invoices
        </Typography>
      </Box>
      <RecentInvoices
        invoices={enrichedInvoices}
        formatCurrency={formatCurrency}
        onEdit={handleEdit}
        onDelete={handleDelete}
        refetchInvoices={refetchInvoices}
      />

      <TotalsChart
        totals={{
          totalInvoices: overviewData?.totalAmount || 0,
          totalExpenses: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
        }}
        formatCurrency={formatCurrency}
        expenses={expenses}
        invoices={allInvoices}
        onDeleteExpense={handleExpenseDelete}
        onUpdateExpense={handleExpenseUpdate}
      />

      <MissingInfoModal
        open={modalOpen}
        missingFields={missingFields}
        onSubmit={handleMissingInfoSubmit}
        onClose={() => setModalOpen(false)}
        existingClients={existingClients}
      />

      {editModalOpen && (
        <EditInvoiceModal
          open={editModalOpen}
          invoice={selectedInvoice}
          existingClients={existingClients}
          onSubmit={handleEditSubmit}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {isUploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
          <Typography variant="body1" sx={{ ml: 1 }}>
            Uploading...
          </Typography>
        </Box>
      )}
    </Box>
  );
}