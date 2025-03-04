const { Invoice } = require('../models');
const { deleteFromS3, getPreSignedUrl } = require('../utils/s3Uploader');
const sequelize = require('sequelize');

// GET /api/invoices - Fetch all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('❌ Error: Missing userId in request.');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    console.log(`✅ Fetching invoices for user: ${userId}`);

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
    const userId = req.user.id;
    const { totalAmount, dueDate, status } = req.body;

    const newInvoice = await Invoice.create({
      userId,
      totalAmount,
      dueDate,
      status: status || 'DRAFT',
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
    const userId = req.user.id;
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
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const { amount, dueDate, status, clientId } = req.body;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (amount !== undefined) invoice.totalAmount = amount;
    if (dueDate !== undefined) invoice.dueDate = dueDate;
    if (status !== undefined) invoice.status = status;
    if (clientId !== undefined) invoice.clientId = clientId;

    await invoice.save();
    return res.json(invoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/overview
exports.getOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalAmount = await Invoice.sum('totalAmount', { where: { userId } }) || 0;
    const invoiceCountsByStatus = await Invoice.findAll({
      where: { userId },
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('status')), 'count']
      ],
      group: ['status'],
      raw: true
    }) || [];

    return res.json({ totalAmount, invoiceCountsByStatus });
  } catch (error) {
    console.error('Error fetching overview:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/aggregated
exports.getAggregatedInvoices = async (req, res) => {
  try {
    const userId = req.user.id;

    const invoices = await Invoice.findAll({
      where: { userId },
      attributes: [
        [sequelize.fn('DATE_FORMAT', sequelize.col('dueDate'), '%Y-%m'), 'month'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']
      ],
      group: ['month'],
      raw: true
    });

    const aggregated = invoices.reduce((acc, curr) => {
      acc[curr.month] = parseFloat(curr.total) || 0;
      return acc;
    }, {});

    return res.json(aggregated);
  } catch (error) {
    console.error('Error fetching aggregated invoices:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/invoices/:id/send (Placeholder)
exports.sendInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });

    // Placeholder for PDF generation and S3 upload logic
    const pdfBuffer = await generateInvoicePdf(invoice); // Assume this function exists
    const s3Url = await uploadToS3(pdfBuffer, `invoices/${invoice.id}.pdf`);

    invoice.status = 'SENT';
    invoice.pdfUrl = s3Url;
    await invoice.save();

    return res.json({ message: `Invoice ${id} sent to client.`, pdfUrl: s3Url });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/report (Placeholder)
exports.report = async (req, res) => {
  try {
    const userId = req.user.id;
    return res.json({ report: {} }); // Placeholder
  } catch (error) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

// GET /api/invoices/:id/pdf
exports.getInvoicePdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    console.log(`Fetching PDF for invoice id: ${id}, user id: ${userId}`);

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      console.error('Invoice not found');
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (!invoice.pdfUrl) {
      console.error(`PDF URL is missing for invoice id: ${id}`);
      return res.status(404).json({ error: 'PDF file not found' });
    }
    const preSignedUrl = getPreSignedUrl(invoice.pdfUrl, 300);
    console.log(`Pre-signed URL: ${preSignedUrl}`);
    return res.json({ url: preSignedUrl });
  } catch (error) {
    console.error("Error fetching invoice PDF:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/invoices/:id
exports.deleteInvoice = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (invoice.pdfUrl) {
      try {
        await deleteFromS3(invoice.pdfUrl);
        console.log(`Deleted file from S3: ${invoice.pdfUrl}`);
      } catch (err) {
        console.error('Error deleting file from S3:', err);
      }
    }

    await invoice.destroy();
    return res.json({ message: `Invoice ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};