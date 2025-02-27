import React, { useState, useEffect } from 'react';
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
  Button,
  Stack,
  Grid, // Standard Grid from MUI
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]); // Ensure initialization
  const [selectedPdf, setSelectedPdf] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('You must be logged in to view invoices.');
          return;
        }
  
        const { data } = await axios.get('http://localhost:3000/api/invoices', {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("✅ Invoices Data:", data.invoices); // Debugging logs
        setInvoices(data.invoices || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
        setInvoices([]);
      }
    }
    fetchInvoices();
  }, []);
  

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const token = localStorage.getItem('token'); // Get token from local storage
      if (!token) {
        alert('You must be logged in to upload an invoice.');
        return;
      }
  
      const { data } = await axios.post('http://localhost:3000/api/uploads', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`, // Send token with request
        },
      });
  
      alert('Invoice uploaded successfully!');
      console.log('Invoice ID:', data.invoiceId);
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error);
      alert('Upload failed. Please try again.');
    }
  };
  
  
  

  const handlePreview = async (invoiceId) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`http://localhost:3000/api/invoices/${invoiceId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Pre-Signed URL:", data.url);
      setSelectedPdf(data.url);
    } catch (error) {
      console.error('Error fetching invoice PDF:', error);
      alert('Failed to load invoice preview.');
    }
  };
  

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Invoices
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => navigate('/dashboard/create-invoice')}>
          Create Invoice
        </Button>
        <Button variant="contained" component="label">
          Import Invoice
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Invoice List
              </Typography>
              {invoices.length === 0 ? (
                <Typography>No invoices found</Typography>
              ) : (
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>PDF</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell>{invoice.id}</TableCell>
                        <TableCell>{invoice.status}</TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            onClick={() => handlePreview(invoice.id)}
                          >
                            Preview
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          {selectedPdf && (
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Preview</Typography>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.9.359/build/pdf.worker.min.js`}>
                  <Viewer fileUrl={selectedPdf} />
                </Worker>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
