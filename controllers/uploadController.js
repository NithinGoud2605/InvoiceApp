const multer = require('multer');
const { uploadToS3 } = require('../utils/s3Uploader');
const { Invoice } = require('../models'); // Import Invoice model

const upload = multer({ storage: multer.memoryStorage() });

exports.uploadInvoice = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error('❌ Error: No user found in request.');
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user.id;
    console.log('✅ User ID:', userId);

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Create the invoice record without a PDF URL.
    let invoice = await Invoice.create({
      userId,
      status: 'DRAFT',
      totalAmount: 0,
      currency: 'USD',
      dueDate: new Date(),
      pdfUrl: null  // Initially null
    });

    // Step 2: Generate a file key using the invoice ID.
    const fileKey = `invoices/${invoice.id}.pdf`;
    
    // Step 3: Upload the file to S3 with the generated key.
    const s3Url = await uploadToS3(req.file.buffer, fileKey);
    console.log(`✅ Uploaded PDF to S3: ${s3Url}`);

    // Step 4: Update the invoice record with the file key.
    invoice.pdfUrl = fileKey;
    await invoice.save();

    return res.json({
      message: 'Upload successful',
      invoiceId: invoice.id,
      pdfUrl: s3Url
    });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
};

module.exports = {
  upload: upload.single('file'),
  uploadInvoice: exports.uploadInvoice,
};
