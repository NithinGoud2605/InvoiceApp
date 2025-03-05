import React from 'react';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';

// Import API methods
import {
  getAllContracts,
  getContractPdf, // Assumed API function to fetch contract PDF
  uploadContract,
  createContract,
  updateContract,
  cancelContract,
  renewContract,
  sendForSignature,
  getAllClients,
} from '../../services/api';

// Import UI components
import ActionButtons from './ActionButtons';
import RecentContracts from './RecentContracts';
import TotalsChart from './TotalsChart';
import MissingInfoModal from './MissingInfoModal';
import EditContractModal from './EditContractModal';
import CreateContractModal from './CreateContractModal';
import StatCard from '../../components/Dashcomp/StatCard';

// Helper Functions (unchanged from provided code)
function getMonthRange(year, month) {
  const adjustedDate = new Date(Date.UTC(year, month, 1));
  const realYear = adjustedDate.getUTCFullYear();
  const realMonth = adjustedDate.getUTCMonth();

  const start = new Date(Date.UTC(realYear, realMonth, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(realYear, realMonth + 1, 0, 23, 59, 59, 999));
  return { start, end };
}

function isActiveContract(contract) {
  return contract.status === 'ACTIVE' || contract.status === 'TRIAL';
}

function calculatePercentageChange(current, previous) {
  if (previous === 0) {
    return current === 0 ? 0 : Infinity;
  }
  const change = ((current - previous) / previous) * 100;
  return Number.isFinite(change) ? change : 0;
}

function getContractsMetricForMonth(contracts, year, month, metric) {
  const { start, end } = getMonthRange(year, month);

  const monthlyContracts = contracts.filter((ct) => {
    const createdAt = new Date(ct.createdAt);
    return createdAt >= start && createdAt <= end;
  });

  switch (metric) {
    case 'ACTIVE_COUNT':
      return monthlyContracts.filter(isActiveContract).length;
    case 'COUNT_ALL':
      return monthlyContracts.length;
    default:
      return 0;
  }
}

function buildLast4MonthsSparkLine(contracts, metric) {
  const now = new Date();
  const baseYear = now.getUTCFullYear();
  const baseMonth = now.getUTCMonth();

  const monthOffsets = [-3, -2, -1, 0];
  return monthOffsets.map((offset) => {
    const target = new Date(Date.UTC(baseYear, baseMonth + offset, 1));
    const y = target.getUTCFullYear();
    const m = target.getUTCMonth();
    return getContractsMetricForMonth(contracts, y, m, metric);
  });
}

export default function ContractsPage() {
  const navigate = useNavigate();

  // Fetch Queries
  const {
    data: contractsData,
    isLoading: contractsLoading,
    refetch: refetchContracts,
  } = useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      try {
        const data = await getAllContracts();
        const allContracts = data.contracts || [];

        // Fetch PDF URLs for all contracts (or limit to recent ones)
        const contractsWithPdf = await Promise.all(
          allContracts.map(async (contract) => {
            const pdfData = await getContractPdf(contract.id);
            return { ...contract, pdfUrl: pdfData.url };
          })
        );
        return contractsWithPdf;
      } catch (error) {
        if (error?.error === 'Unauthorized') {
          navigate('/sign-in');
        }
        throw error;
      }
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

  const isLoading = contractsLoading || clientsLoading;
  const allContracts = contractsData || [];
  const existingClients = clientsData || [];

  // Build Sparklines
  const activeSparkData = buildLast4MonthsSparkLine(allContracts, 'ACTIVE_COUNT');
  const countSparkData = buildLast4MonthsSparkLine(allContracts, 'COUNT_ALL');

  const activeFinal = activeSparkData[3];
  const activeInitial = activeSparkData[0];
  const activeChange = calculatePercentageChange(activeFinal, activeInitial);
  const activeTrend = activeChange > 0 ? 'up' : activeChange < 0 ? 'down' : 'neutral';
  const activeTrendLabel =
    activeChange === Infinity
      ? '∞% ↑'
      : `${activeChange.toFixed(2)}% ${activeChange > 0 ? '↑' : activeChange < 0 ? '↓' : ''}`;

  const countFinal = countSparkData[3];
  const countInitial = countSparkData[0];
  const countChange = calculatePercentageChange(countFinal, countInitial);
  const countTrend = countChange > 0 ? 'up' : countChange < 0 ? 'down' : 'neutral';
  const countTrendLabel =
    countChange === Infinity
      ? '∞% ↑'
      : `${countChange.toFixed(2)}% ${countChange > 0 ? '↑' : countChange < 0 ? '↓' : ''}`;

  // Local States & Handlers
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [missingFields, setMissingFields] = React.useState([]);
  const [contractIdToUpdate, setContractIdToUpdate] = React.useState(null);
  const [missingModalOpen, setMissingModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false);
  const [selectedContract, setSelectedContract] = React.useState(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);

    try {
      const response = await uploadContract(file);
      Swal.fire({
        title: 'Success',
        text: 'Contract PDF uploaded successfully!',
        icon: 'success',
      });

      if (response.missingFields?.length > 0) {
        setMissingFields(response.missingFields);
        setContractIdToUpdate(response.contractId);
        setMissingModalOpen(true);
      }

      refetchContracts();
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
      const updateData = {};
      if (filledData.planName) updateData.planName = filledData.planName;
      if (filledData.startDate) updateData.startDate = filledData.startDate;
      if (filledData.endDate) updateData.endDate = filledData.endDate;
      if (filledData.billingCycle) updateData.billingCycle = filledData.billingCycle;
      if (typeof filledData.autoRenew === 'boolean') updateData.autoRenew = filledData.autoRenew;
      if (filledData.clientId) updateData.clientId = filledData.clientId;

      await updateContract(contractIdToUpdate, updateData);
      Swal.fire({
        title: 'Success',
        text: 'Contract updated successfully!',
        icon: 'success',
      });
      setMissingModalOpen(false);
      refetchContracts();
    } catch (error) {
      console.error('Error updating contract:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update contract. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleEdit = (id) => {
    const contract = allContracts.find((ct) => ct.id === id);
    if (contract) {
      setSelectedContract(contract);
      setEditModalOpen(true);
    }
  };

  const handleEditSubmit = async (updatedData) => {
    try {
      await updateContract(selectedContract.id, updatedData);
      Swal.fire({
        title: 'Success',
        text: 'Contract updated successfully!',
        icon: 'success',
      });
      setEditModalOpen(false);
      refetchContracts();
    } catch (error) {
      console.error('Error updating contract:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update contract. Please try again.',
        icon: 'error',
      });
    }
  };

  const handleCancel = async (id) => {
    try {
      const { isConfirmed } = await Swal.fire({
        title: 'Cancel Contract?',
        text: 'This will set the contract status to CANCELLED.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, cancel it!',
      });
      if (!isConfirmed) return;

      await cancelContract(id);
      refetchContracts();
      Swal.fire({
        title: 'Success',
        text: 'Contract cancelled.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error cancelling contract:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to cancel contract.',
        icon: 'error',
      });
    }
  };

  const handleRenew = async (id, newEndDate) => {
    try {
      await renewContract(id, { newEndDate });
      refetchContracts();
      Swal.fire({
        title: 'Success',
        text: 'Contract renewed successfully.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error renewing contract:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to renew contract.',
        icon: 'error',
      });
    }
  };

  const handleSendForSignature = async (id) => {
    try {
      await sendForSignature(id);
      Swal.fire({
        title: 'Success',
        text: 'Contract sent for e-signature.',
        icon: 'success',
      });
    } catch (error) {
      console.error('Error sending contract for signature:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to send contract for signature.',
        icon: 'error',
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Render
  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Active Contracts (4-mo)"
            value={String(activeFinal)}
            interval="Last 4 months"
            trend={activeTrend}
            trendLabel={activeTrendLabel}
            data={activeSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <StatCard
            title="Total Contracts (4-mo)"
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
            onCreate={() => navigate('/dashboard/create-contract')}
          />
        </Grid>
      </Grid>

      <Box sx={{ mb: 1, p: 1, borderRadius: '8px' }}>
        <Typography variant="h5" align="center">
          Recent Contracts
        </Typography>
      </Box>
      <RecentContracts
        contracts={allContracts}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onRenew={handleRenew}
        onSendForSignature={handleSendForSignature}
      />

      <TotalsChart contracts={allContracts} />

      <MissingInfoModal
        open={missingModalOpen}
        missingFields={missingFields}
        onSubmit={handleMissingInfoSubmit}
        onClose={() => setMissingModalOpen(false)}
        existingClients={existingClients}
      />

      {editModalOpen && (
        <EditContractModal
          open={editModalOpen}
          contract={selectedContract}
          existingClients={existingClients}
          onSubmit={handleEditSubmit}
          onClose={() => setEditModalOpen(false)}
        />
      )}

      {createModalOpen && (
        <CreateContractModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={() => {
            setCreateModalOpen(false);
            refetchContracts();
          }}
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