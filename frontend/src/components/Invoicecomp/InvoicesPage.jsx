// src/components/Invoicecomp/InvoicesPage.jsx
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

import InvoicesLineChart from '../../components/Dashcomp/InvoicesLineChart';
import ExpensesLineChart from '../../components/Dashcomp/ExpensesLineChart';
import ActionButtons from './ActionButtons';
import RecentInvoices from './RecentInvoices';
import TotalsChart from './TotalsChart';
import MissingInfoModal from './MissingInfoModal';
import EditInvoiceModal from './EditInvoiceModal';

export default function InvoicesPage() {
  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  // Retain your chartData state as before
  const [chartData, setChartData] = React.useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    invoices: [10, 15, 20, 25, 30, 35],
    expenses: [5, 10, 15, 10, 5, 10],
  });

  // Fetch invoices using the new object-based API
  const {
    data: invoicesData,
    isLoading: invoicesLoading,
    refetch: refetchInvoices,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const data = await getAllInvoices();
      return Promise.all(
        data.invoices
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
          .map(async (invoice) => {
            const pdfData = await getInvoicePdf(invoice.id);
            return { ...invoice, pdfUrl: pdfData.url };
          })
      );
    },
  });

  // Fetch expenses using the object-based API
  const { data: expensesData, isLoading: expensesLoading } = useQuery({
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

  // Fetch clients using the new API
  const { data: clientsData, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const clientData = await getAllClients();
      return clientData.clients;
    },
  });

  // Default values if the data hasn't loaded yet
  const invoices = invoicesData || [];
  const expenses = expensesData || [];
  const totals = { totalInvoices: overviewData?.totalAmount || 0, totalExpenses: 0 };
  const existingClients = clientsData || [];

  // Check if any query is still loading
  const isLoading = invoicesLoading || expensesLoading || overviewLoading || clientsLoading;

  // Enrich invoices with clientName from existingClients if not present
  const enrichedInvoices = React.useMemo(() => {
    return invoices.map((invoice) => {
      // If invoice has a clientId but no clientName, try to get it from existingClients
      if (invoice.clientId && !invoice.clientName && existingClients.length > 0) {
        const client = existingClients.find((c) => c.id === invoice.clientId);
        return { ...invoice, clientName: client?.name || invoice.clientName };
      }
      return invoice;
    });
  }, [invoices, existingClients]);

  // Local component states
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
      if (response.missingFields && response.missingFields.length > 0) {
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

      console.log('Updating invoice with:', updateData);
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
        amount: updatedData.totalAmount, // Changed key from totalAmount to amount
        dueDate: updatedData.dueDate,
      };

      if (updatedData.newClient) {
        const newClient = await createClient(updatedData.newClient);
        invoiceData.clientId = newClient.id;
        invoiceData.clientName = newClient.name;
        invoiceData.clientEmail = newClient.email;
        invoiceData.clientPhone = newClient.phone;
        invoiceData.clientAddress = newClient.address;
      } else if (updatedData.clientId) {
        invoiceData.clientId = updatedData.clientId;
      }

      console.log('Sending update payload:', invoiceData);
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

  // Render a loading state if any query is still in progress
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <InvoicesLineChart data={chartData} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ExpensesLineChart data={chartData} />
        </Grid>
        <Grid item xs={12}>
          <ActionButtons onFileUpload={handleFileUpload} onExpenseSubmit={() => {}} />
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, p: 2, backgroundColor: 'primary.light', borderRadius: '8px' }}>
        <Typography variant="h5" align="center" color="white">
          Recent Invoices
        </Typography>
      </Box>

      <RecentInvoices
        invoices={enrichedInvoices}
        formatCurrency={formatCurrency}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TotalsChart
        totals={totals}
        chartData={chartData}
        formatCurrency={formatCurrency}
        expenses={expenses}
        onDeleteExpense={() => {}}
        onUpdateExpense={() => {}}
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
