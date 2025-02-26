// src/pages/Dashboard.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/Dashcomp/DashboardLayout';
import DashboardHome from '../components/Dashcomp/DashboardHome';
import InvoicesPage from '../components/Dashcomp/InvoicesPage';
import ContractsPage from '../components/Dashcomp/ContractsPage';

export default function Dashboard() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="invoices" element={<InvoicesPage />} />
        <Route path="contracts" element={<ContractsPage />} />
      </Route>
    </Routes>
  );
}
