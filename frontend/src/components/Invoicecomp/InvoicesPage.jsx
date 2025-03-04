import React from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import {
  getAllInvoices,
  getInvoicePdf,
  deleteInvoice,
  uploadFile,
  getInvoiceOverview,
  createExpense,
  getAllExpenses,
  deleteExpense,
  updateExpense,
  updateInvoice,
  getAllClients,
  createClient,
} from '../../services/api';

import ActionButtons from './ActionButtons';
import RecentInvoices from './RecentInvoices';
import TotalsChart from './TotalsChart';
import MissingInfoModal from './MissingInfoModal';
import EditInvoiceModal from './EditInvoiceModal';
import StatCard from '../../components/Dashcomp/StatCard';

// Helper functions
const getMonthRange = (year, month) => {
  const start = new Date(Date.UTC(year, month, 1));
  const end = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
  return { start, end };
};

const calculatePercentageChange = (current, previous) => {
  if (previous === 0) {
    return current === 0 ? 0 : Infinity;
  }
  const change = ((current - previous) / previous) * 100;
  return Number.isFinite(change) ? change : 0;
};

const getInvoicesInMonth = (invoices, start, end) => {
  return invoices.filter((invoice) => {
    const createdAt = new Date(invoice.created_at);
    return createdAt >= start && createdAt <= end;
  });
};

const getActiveInvoices = (invoices, asOfDate) => {
  return invoices.filter((invoice) => new Date(invoice.dueDate) >= asOfDate);
};

const getExpiredInvoices = (invoices, asOfDate) => {
  return invoices.filter((invoice) => new Date(invoice.dueDate) < asOfDate);
};

export default function InvoicesPage() {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  // Fetch all invoices and recent invoices
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

  // Fetch expenses
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

  // Fetch invoice overview (totals)
  const { data: overviewData, isLoading: overviewLoading } = useQuery({
    queryKey: ['overview'],
    queryFn: async () => {
      const overview = await getInvoiceOverview();
      return overview;
    },
  });

  // Fetch clients
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const clientData = await getAllClients();
      return clientData.clients;
    },
  });

  // Default values if data hasn't loaded
  const allInvoices = invoicesQueryData?.allInvoices || [];
  const recentInvoices = invoicesQueryData?.recentInvoices || [];
  const expenses = expensesData || [];
  const existingClients = clientsData || [];

  const isLoading = invoicesLoading || expensesLoading || overviewLoading || clientsLoading;

  // Enrich recent invoices with client names
  const enrichedInvoices = React.useMemo(() => {
    return recentInvoices.map((invoice) => {
      if (invoice.clientId && !invoice.clientName && existingClients.length > 0) {
        const client = existingClients.find((c) => c.id === invoice.clientId);
        return { ...invoice, clientName: client?.name || invoice.clientName };
      }
      return invoice;
    });
  }, [recentInvoices, existingClients]);

  // Date calculations for this month and last month (as of March 4, 2025, 03:39 AM PST)
  const currentDate = new Date('2025-03-04T11:39:00Z'); // UTC equivalent of 03:39 AM PST
  const thisYear = currentDate.getUTCFullYear(); // 2025
  const thisMonth = currentDate.getUTCMonth(); // 2 (March)
  const { start: thisMonthStart, end: thisMonthEnd } = getMonthRange(thisYear, thisMonth);
  const { start: lastMonthStart, end: lastMonthEnd } = getMonthRange(thisYear, thisMonth - 1);
  const nextMonthStart = new Date(Date.UTC(thisYear, thisMonth + 1, 1));

  // Calculate statistics for this month and last month
  const thisMonthActive = getActiveInvoices(allInvoices, nextMonthStart).length;
  const lastMonthActive = getActiveInvoices(allInvoices, thisMonthStart).length;
  const thisMonthExpired = getExpiredInvoices(allInvoices, nextMonthStart).length;
  const lastMonthExpired = getExpiredInvoices(allInvoices, thisMonthStart).length;

  const thisMonthInvoices = getInvoicesInMonth(allInvoices, thisMonthStart, thisMonthEnd);
  const lastMonthInvoices = getInvoicesInMonth(allInvoices, lastMonthStart, lastMonthEnd);
  const thisMonthValue = thisMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const lastMonthValue = lastMonthInvoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0);
  const thisMonthTotal = thisMonthInvoices.length;
  const lastMonthTotal = lastMonthInvoices.length;

  // Calculate percentage changes and trends
  const activeChange = calculatePercentageChange(thisMonthActive, lastMonthActive);
  const expiredChange = calculatePercentageChange(thisMonthExpired, lastMonthExpired);
  const valueChange = calculatePercentageChange(thisMonthValue, lastMonthValue);
  const totalChange = calculatePercentageChange(thisMonthTotal, lastMonthTotal);

  const activeTrend = activeChange > 0 ? 'up' : activeChange < 0 ? 'down' : 'neutral';
  const expiredTrend = expiredChange > 0 ? 'up' : expiredChange < 0 ? 'down' : 'neutral';
  const valueTrend = valueChange > 0 ? 'up' : valueChange < 0 ? 'down' : 'neutral';
  const totalTrend = totalChange > 0 ? 'up' : totalChange < 0 ? 'down' : 'neutral';

  const activeTrendLabel =
    activeChange === Infinity
      ? '∞% ↑'
      : `${activeChange.toFixed(2)}% ${activeChange > 0 ? '↑' : activeChange < 0 ? '↓' : ''}`;
  const expiredTrendLabel =
    expiredChange === Infinity
      ? '∞% ↑'
      : `${expiredChange.toFixed(2)}% ${expiredChange > 0 ? '↑' : expiredChange < 0 ? '↓' : ''}`;
  const valueTrendLabel =
    valueChange === Infinity
      ? '∞% ↑'
      : `${valueChange.toFixed(2)}% ${valueChange > 0 ? '↑' : valueChange < 0 ? '↓' : ''}`;
  const totalTrendLabel =
    totalChange === Infinity
      ? '∞% ↑'
      : `${totalChange.toFixed(2)}% ${totalChange > 0 ? '↑' : totalChange < 0 ? '↓' : ''}`;

  // Sparkline data (last month vs this month)
  const activeSparkData = [lastMonthActive, thisMonthActive];
  const expiredSparkData = [lastMonthExpired, thisMonthExpired];
  const valueSparkData = [lastMonthValue, thisMonthValue];
  const totalSparkData = [lastMonthTotal, thisMonthTotal];

  // Local component states
  const [missingFields, setMissingFields] = React.useState([]);
  const [invoiceIdToUpdate, setInvoiceIdToUpdate] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);

  // Event handlers
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
      let updateData = {
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
      let invoiceData = {
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

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Stat Cards Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Invoices"
            value={String(thisMonthActive)}
            interval="This Month"
            trend={activeTrend}
            trendLabel={activeTrendLabel}
            data={activeSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expired Invoices"
            value={String(thisMonthExpired)}
            interval="This Month"
            trend={expiredTrend}
            trendLabel={expiredTrendLabel}
            data={expiredSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value This Month"
            value={formatCurrency(thisMonthValue)}
            interval="This Month"
            trend={valueTrend}
            trendLabel={valueTrendLabel}
            data={valueSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Invoices This Month"
            value={String(thisMonthTotal)}
            interval="This Month"
            trend={totalTrend}
            trendLabel={totalTrendLabel}
            data={totalSparkData}
          />
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12}>
          <ActionButtons
            onFileUpload={handleFileUpload}
            onExpenseSubmit={handleExpenseSubmit}
          />
        </Grid>
      </Grid>

      {/* Recent Invoices Section */}
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