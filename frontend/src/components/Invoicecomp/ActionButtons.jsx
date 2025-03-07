import React, { useState } from "react";
import { Stack, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";

const ActionButtons = ({ onFileUpload, onExpenseSubmit }) => {
  const navigate = useNavigate();
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  return (
    <>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="contained" onClick={() => navigate("/dashboard/create-invoice")}>
          Create Invoice
        </Button>
        <Button variant="contained" component="label">
          Import Invoice
          <input type="file" hidden onChange={onFileUpload} />
        </Button>
        <Button variant="contained" onClick={() => setShowExpenseForm((prev) => !prev)}>
          {showExpenseForm ? "Cancel Expense" : "Add Expense"}
        </Button>
      </Stack>
      {showExpenseForm && <ExpenseForm onSubmit={onExpenseSubmit} />}
    </>
  );
};

export default ActionButtons;
