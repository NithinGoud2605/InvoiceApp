// src/components/Dashcomp/ContractsPage.jsx
import React, { useMemo } from 'react';
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
  Stack,
  IconButton,
  Avatar,
  Tooltip,
} from '@mui/material';

import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import StatCard from './StatCard';

export default function ContractsPage() {
  // Example static data (replace with real fetch logic if needed):
  const contracts = [
    { id: 3001, status: 'Active', name: 'Maintenance Contract', amount: 1000, renewalDate: '2023-12-01' },
    { id: 3002, status: 'Expired', name: 'Consulting Contract', amount: 2000, renewalDate: '2023-08-15' },
    { id: 3003, status: 'Active', name: 'Support Contract', amount: 1500, renewalDate: '2024-01-10' },
    { id: 3004, status: 'Expiring soon', name: 'DevOps Contract', amount: 2500, renewalDate: '2023-09-01' },
  ];

  // Let's gather some quick stats:
  const totalContracts = contracts.length;
  const activeCount = contracts.filter((c) => c.status.toLowerCase() === 'active').length;
  const expiredCount = contracts.filter((c) => c.status.toLowerCase() === 'expired').length;
  const totalValue = contracts.reduce((acc, c) => acc + c.amount, 0);

  // For stat cards' sparkline data (just random example):
  const activeSparkData = useMemo(() => [5, 10, 7, 14, 12, 20, 18, 25], []);
  const expiredSparkData = useMemo(() => [2, 3, 3, 4, 5, 5, 6, 7], []);
  const valueSparkData = useMemo(() => [100, 300, 250, 400, 500, 800, 750, 1200], []);

  return (
    <Box>
      {/* Top Row: Title + Search + Notifications + Profile */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 3 }}
      >
        <Typography variant="h5" gutterBottom>
          Contracts
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Tooltip title="Notifications">
            <IconButton color="inherit">
              <NotificationsRoundedIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Profile">
            <IconButton>
              <Avatar alt="User" src="/static/images/avatar/1.jpg" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Stat Cards Row */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active"
            value={String(activeCount)}
            interval="Current"
            trend="up"
            data={activeSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Expired"
            value={String(expiredCount)}
            interval="Current"
            trend="down"
            data={expiredSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Value"
            value={`$${totalValue}`}
            interval="All Contracts"
            trend="up"
            data={valueSparkData}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Contracts"
            value={String(totalContracts)}
            interval="Overall"
            trend="neutral"
            data={[1, 2, 2, 3, 3, 4, 4, 4]}
          />
        </Grid>
      </Grid>

      {/* Contracts Table */}
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Renewal Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {contracts.map((ctr) => (
                <TableRow key={ctr.id}>
                  <TableCell>{ctr.id}</TableCell>
                  <TableCell>{ctr.status}</TableCell>
                  <TableCell>{ctr.name}</TableCell>
                  <TableCell>{ctr.amount}</TableCell>
                  <TableCell>{ctr.renewalDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
