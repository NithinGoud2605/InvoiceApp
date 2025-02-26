// src/components/Dashcomp/ExpensesPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableRow, TableHead } from '@mui/material';

export default function ExpensesPage() {
  const [expenses] = useState([
    { id: 501, category: 'Office Supplies', amount: 100, date: '2023-09-01' },
    { id: 502, category: 'Travel', amount: 500, date: '2023-09-03' },
    { id: 503, category: 'Utilities', amount: 200, date: '2023-09-05' },
  ]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Expenses
      </Typography>
      <Card>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>{exp.id}</TableCell>
                  <TableCell>{exp.category}</TableCell>
                  <TableCell>{exp.amount}</TableCell>
                  <TableCell>{exp.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
