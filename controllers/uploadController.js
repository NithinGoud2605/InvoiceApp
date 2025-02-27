const AWS = require('aws-sdk');
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

    const fileBuffer = req.file.buffer;
    const fileName = `invoices/${userId}-${Date.now()}.pdf`;

    const s3Url = await uploadToS3(fileBuffer, fileName);
    console.log(`✅ Uploaded PDF to S3: ${s3Url}`);

    // Store PDF URL in the database
    const newInvoice = await Invoice.create({
      userId,
      status: 'DRAFT',
      totalAmount: 0,
      currency: 'USD',
      dueDate: new Date(),
      pdfUrl: fileName, // Ensure the correct S3 path is stored
    });

    return res.json({ message: 'Upload successful', invoiceId: newInvoice.id, pdfUrl: s3Url });
  } catch (error) {
    console.error('❌ Error uploading file:', error);
    return res.status(500).json({ error: 'Upload failed' });
  }
};
