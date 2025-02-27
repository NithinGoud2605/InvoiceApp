// controllers/invoiceController.js
const { Invoice } = require('../models'); // destructure from models/index.js
const { getPreSignedUrl } = require('../utils/s3Uploader');


// GET /api/invoices - Fetch all invoices with pre-signed URLs
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
    // Look up invoice (including client and line items)
    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    
    // Generate PDF using a library like pdfkit or puppeteer
    // For example, assume generateInvoicePdf(invoice) returns a Buffer
    const pdfBuffer = await generateInvoicePdf(invoice);
    
    // Upload PDF to S3 (see Step 3)
    const s3Url = await uploadToS3(pdfBuffer, `invoices/${invoice.id}.pdf`);
    
    // Optionally update invoice with the S3 URL and mark as SENT
    invoice.status = 'SENT';
    invoice.pdfUrl = s3Url; // if you add this field to your Invoice model
    await invoice.save();

    // Optionally, send email to the client with the PDF URL
    return res.json({ message: `Invoice ${id} sent to client.`, pdfUrl: s3Url });
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

exports.getInvoicePdf = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    console.log(`🔍 Fetching invoice PDF for ID: ${id}, User: ${userId}`);

    const invoice = await Invoice.findOne({ where: { id, userId } });

    if (!invoice) {
      console.error('❌ Error: Invoice not found.');
      return res.status(404).json({ error: 'Invoice not found' });
    }

    if (!invoice.pdfUrl) {
      console.error('❌ Error: PDF URL is missing.');
      return res.status(404).json({ error: 'PDF file not found' });
    }

    const preSignedUrl = getPreSignedUrl(invoice.pdfUrl, 300);
    console.log(`✅ Pre-Signed URL Generated: ${preSignedUrl}`);

    return res.json({ url: preSignedUrl });
  } catch (error) {
    console.error("❌ Error fetching invoice PDF:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getInvoicePdf = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;

    // Find invoice, ensure it belongs to the user
    const invoice = await Invoice.findOne({ where: { id, userId } });
    if (!invoice || !invoice.pdfUrl) {
      return res.status(404).json({ error: 'Invoice or PDF not found' });
    }

    // Generate a temporary pre-signed URL (valid for 2 mins)
    const preSignedUrl = getPreSignedUrl(invoice.pdfUrl, 120);
    
    return res.json({ url: preSignedUrl });
  } catch (error) {
    console.error("Error fetching invoice PDF:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
