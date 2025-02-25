// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { getAllInvoices } from '../services/api';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const data = await getAllInvoices();
        setInvoices(data);
      } catch (err) {
        console.error('Error fetching invoices:', err);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-md">
      <Navbar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        {invoices.length === 0 ? (
          <p>No invoices yet.</p>
        ) : (
          <ul className="space-y-4">
            {invoices.map((invoice) => (
              <li
                key={invoice.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Invoice #{invoice.id}</p>
                  <p>Customer: {invoice.customerName}</p>
                  <p>Amount: ${invoice.total}</p>
                </div>
                <p className="text-sm text-gray-500">Status: {invoice.status}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
