// controllers/invoiceController.js
const { Invoice } = require('../routes'); // destructure from models/index.js

// GET /api/invoices
exports.getAllInvoices = async (req, res) => {
  try {
    // user sub from Cognito. Check how you attach it in your auth middleware
    const userId = req.user.sub;
    const invoices = await Invoice.findAll({ where: { userId } });
    return res.json({ invoices });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/invoices
exports.createInvoice = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { amount, dueDate, status } = req.body;

    const newInvoice = await Invoice.create({
      userId,
      amount,
      dueDate,
      status: status || 'DRAFT', // or use defaultValue in the model
    });

    return res.status(201).json(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/:id
exports.getInvoiceById = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    return res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/invoices/:id
exports.updateInvoice = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const { amount, dueDate, status } = req.body;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    // Update fields
    if (amount !== undefined) invoice.amount = amount;
    if (dueDate !== undefined) invoice.dueDate = dueDate;
    if (status !== undefined) invoice.status = status;

    await invoice.save();
    return res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    await invoice.destroy();
    return res.json({ message: `Invoice ${id} deleted` });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/overview
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.sub;

    // A simple example: sum of all invoice amounts
    const totalAmount = await Invoice.sum('amount', { where: { userId } });

    // Count of each status
    const invoiceCountsByStatus = await Invoice.findAll({
      where: { userId },
      attributes: [
        'status',
        [require('sequelize').fn('COUNT', require('sequelize').col('status')), 'count']
      ],
      group: ['status']
    });

    return res.json({ totalAmount, invoiceCountsByStatus });
  } catch (error) {
    console.error('Error fetching overview:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/invoices/:id/send (Placeholder)
exports.sendInvoice = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    // Lookup and handle sending an email, etc.
    return res.json({ message: `Invoice ${id} sent to client.` });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/report (Placeholder)
exports.report = async (req, res) => {
  try {
    const userId = req.user.sub;
    // Return some aggregated data or generate a PDF, etc.
    return res.json({ report: {} });
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
