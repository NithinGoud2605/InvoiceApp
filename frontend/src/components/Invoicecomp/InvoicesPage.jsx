import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ totalInvoices: 0, totalExpenses: 0 });
  const [chartData, setChartData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    invoices: [10, 15, 20, 25, 30, 35],
    expenses: [5, 10, 15, 10, 5, 10],
  });
  const [missingFields, setMissingFields] = useState([]);
  const [invoiceIdToUpdate, setInvoiceIdToUpdate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [existingClients, setExistingClients] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  useEffect(() => {
    fetchInvoices();
    fetchExpenses();
    fetchTotals();
    fetchClients();
  }, []);

  async function fetchInvoices() {
    try {
      const data = await getAllInvoices();
      const sortedInvoices = await Promise.all(
        data.invoices
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10)
          .map(async (invoice) => {
            const pdfData = await getInvoicePdf(invoice.id);
            if (invoice.clientId && !invoice.clientName) {
              const client = existingClients.find((c) => c.id === invoice.clientId);
              return {
                ...invoice,
                clientName: client?.name || invoice.clientName,
                clientEmail: client?.email || invoice.clientEmail,
                clientPhone: client?.phone || invoice.clientPhone,
                clientAddress: client?.address || invoice.clientAddress,
                pdfUrl: pdfData.url,
              };
            }
            return { ...invoice, pdfUrl: pdfData.url };
          })
      );
      setInvoices(sortedInvoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to fetch invoices.',
        icon: 'error',
      });
    }
  }

  async function fetchExpenses() {
    try {
      const expenseData = await getAllExpenses();
      setExpenses(expenseData.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
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
        totalExpenses: 0,
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

  async function fetchClients() {
    try {
      const clientData = await getAllClients();
      setExistingClients(clientData.clients || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  }

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
      fetchInvoices();
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
      fetchInvoices();
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
    const invoice = invoices.find((inv) => inv.id === id);
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
        setExistingClients((prev) => [...prev, newClient]);
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
      fetchInvoices();
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
  };

  const handleExpenseSubmit = async (expenseData) => {
    try {
      await createExpense(expenseData);
      Swal.fire({
        title: 'Success',
        text: 'Expense added successfully!',
        icon: 'success',
      });
      fetchExpenses();
      fetchTotals();
    } catch (error) {
      console.error('Error adding expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add expense.',
        icon: 'error',
      });
    }
  };

  async function handleDeleteExpense(expenseId) {
    try {
      const result = await Swal.fire({
        title: 'Delete Expense',
        text: 'This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
      });
      if (result.isConfirmed) {
        await deleteExpense(expenseId);
        Swal.fire({
          title: 'Deleted!',
          text: `Expense ${expenseId} deleted successfully.`,
          icon: 'success',
        });
        fetchExpenses();
        fetchTotals();
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to delete expense.',
        icon: 'error',
      });
    }
  }

  async function handleUpdateExpense(expense) {
    const { value: formValues } = await Swal.fire({
      title: 'Update Expense',
      html:
        `<input id="swal-input1" class="swal2-input" placeholder="Amount" type="number" value="${expense.amount}">` +
        `<input id="swal-input2" class="swal2-input" placeholder="Date" type="date" value="${expense.date}">` +
        `<input id="swal-input3" class="swal2-input" placeholder="Category" value="${expense.category}">` +
        `<input id="swal-input4" class="swal2-input" placeholder="Description" value="${expense.description}">`,
      focusConfirm: false,
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value,
          document.getElementById('swal-input3').value,
          document.getElementById('swal-input4').value,
        ];
      },
    });

    if (formValues) {
      const [newAmount, newDate, newCategory, newDescription] = formValues;
      try {
        await updateExpense(expense.id, {
          amount: newAmount,
          date: newDate,
          category: newCategory,
          description: newDescription,
        });
        Swal.fire({
          title: 'Success',
          text: 'Expense updated successfully!',
          icon: 'success',
        });
        fetchExpenses();
        fetchTotals();
      } catch (error) {
        console.error('Error updating expense:', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to update expense.',
          icon: 'error',
        });
      }
    }
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
          <ActionButtons onFileUpload={handleFileUpload} onExpenseSubmit={handleExpenseSubmit} />
        </Grid>
      </Grid>

      <Box sx={{ mb: 2, p: 2, backgroundColor: 'primary.light', borderRadius: '8px' }}>
        <Typography variant="h5" align="center" color="white">
          Recent Invoices
        </Typography>
      </Box>

      <RecentInvoices
        invoices={invoices}
        formatCurrency={formatCurrency}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <TotalsChart
        totals={totals}
        chartData={chartData}
        formatCurrency={formatCurrency}
        expenses={expenses}
        onDeleteExpense={handleDeleteExpense}
        onUpdateExpense={handleUpdateExpense}
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