// src/pages/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Dashcomp/DashboardLayout';
import DashboardHome from '../components/Dashcomp/DashboardHome';
import InvoicesPage from '../components/Invoicecomp/InvoicesPage';
import ContractsPage from '../components/Contractcomp/ContractsPage';
import SubscriptionGuard from '../components/SubscriptionGuard';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export default function Dashboard() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route
            path="contracts"
            element={
              <SubscriptionGuard>
                <ContractsPage />
              </SubscriptionGuard>
            }
          />
        </Route>
      </Routes>
      {/* React Query Devtools can be helpful for debugging */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
