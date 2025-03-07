// src/pages/Dashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "../components/Dashcomp/DashboardLayout";
import DashboardHome from "../components/Dashcomp/DashboardHome";
import InvoicesPage from "../components/Invoicecomp/InvoicesPage";
import ContractsPage from "../components/Contractcomp/ContractsPage";
import CreateInvoicePage from '../components/Invoicecomp/CreateInvoice'; 
import SubscriptionGuard from "../components/SubscriptionGuard";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Dashboard() {
  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="create-invoice" element={<CreateInvoicePage />} />
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
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
