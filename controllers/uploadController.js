const multer = require('multer');
const AWS = require('aws-sdk');
const { Invoice, Client } = require('../models'); // Ensure these models are properly imported
const { uploadToS3 } = require('../utils/s3Uploader');

// Configure AWS SDK to load credentials from the "nithin" profile and set the region
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'nithin' });
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const textract = new AWS.Textract();

// Use memory storage so that the file buffer is available for both S3 upload and Textract processing
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Extracts invoice data (totalAmount, dueDate, clientName) using AWS Textract.
 */
async function extractInvoiceData(fileBuffer) {
  const params = {
    Document: { Bytes: fileBuffer },
    FeatureTypes: ['FORMS']
  };

  try {
    const result = await textract.analyzeDocument(params).promise();
    const blocks = result.Blocks;
    let blockMap = {};
    let keyMap = {};
    let valueMap = {};

    // Index all blocks by their ID and separate key and value blocks
    blocks.forEach(block => {
      blockMap[block.Id] = block;
      if (block.BlockType === 'KEY_VALUE_SET') {
        if (block.EntityTypes && block.EntityTypes.includes('KEY')) {
          keyMap[block.Id] = block;
        } else {
          valueMap[block.Id] = block;
        }
      }
    });

    // Helper function to extract text from a block via its CHILD relationships
    const getText = (block) => {
      let text = '';
      if (block.Relationships) {
        block.Relationships.forEach(relationship => {
          if (relationship.Type === 'CHILD') {
            relationship.Ids.forEach(childId => {
              const child = blockMap[childId];
              if (child && child.BlockType === 'WORD') {
                text += `${child.Text} `;
              }
            });
          }
        });
      }
      return text.trim();
    };

    // Combine key blocks with their corresponding value blocks to build an object of invoice data
    let invoiceData = {};
    Object.values(keyMap).forEach(keyBlock => {
      let keyText = getText(keyBlock).toLowerCase();
      if (keyBlock.Relationships) {
        keyBlock.Relationships.forEach(relationship => {
          if (relationship.Type === 'VALUE') {
            relationship.Ids.forEach(valueId => {
              const valueBlock = valueMap[valueId];
              if (valueBlock) {
                const valueText = getText(valueBlock);
                invoiceData[keyText] = valueText;
              }
            });
          }
        });
      }
    });

    // Extract specific fields – adjust keys based on your invoice format
    const totalAmount = invoiceData['total']
      ? parseFloat(invoiceData['total'].replace(/[^0-9.]/g, ''))
      : 0;
    const dueDate = invoiceData['due date'] || null;
    const clientName = invoiceData['client name'] || null;

    return { totalAmount, dueDate, clientName };
  } catch (error) {
    console.error('Textract extraction error:', error);
    throw error;
  }
}

/**
 * Main controller function for invoice upload.
 * It creates an invoice record, uploads the file to S3, extracts invoice data via Textract,
 * and integrates the client information by updating/creating a Client record.
 * Returns a response with the invoice details, including clientId, and an array of missing fields.
 */
async function uploadInvoice(req, res) {
  try {
    if (!req.user || !req.user.id) {
      console.error('❌ Error: No user found in request.');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Create an invoice record with default values (to satisfy not-null constraints)
    let invoice = await Invoice.create({
      userId,
      status: 'DRAFT',
      totalAmount: 0,        // Will be updated after extraction
      currency: 'USD',
      dueDate: new Date(),   // Default to today's date
      pdfUrl: null
    });

    // Step 2: Upload the file to S3 and update invoice.pdfUrl with the generated file key
    const fileKey = `invoices/${invoice.id}.pdf`;
    const s3Url = await uploadToS3(req.file.buffer, fileKey);
    invoice.pdfUrl = fileKey;

    // Step 3: Use AWS Textract to extract invoice data
    const extractedData = await extractInvoiceData(req.file.buffer);
    const missingFields = [];

    // Update totalAmount if detected; otherwise, mark as missing
    if (extractedData.totalAmount && extractedData.totalAmount > 0) {
      invoice.totalAmount = extractedData.totalAmount;
    } else {
      missingFields.push('totalAmount');
    }

    // Validate and update dueDate
    if (extractedData.dueDate) {
      const parsedDueDate = new Date(extractedData.dueDate);
      if (isNaN(parsedDueDate.getTime())) {
        missingFields.push('dueDate');
      } else {
        invoice.dueDate = parsedDueDate;
      }
    } else {
      missingFields.push('dueDate');
    }

    // Integrate client information:
    // If clientName is extracted, attempt to find an existing Client (for this user) or create a new one.
    if (extractedData.clientName) {
      let client = await Client.findOne({ where: { name: extractedData.clientName, userId } });
      if (!client) {
        client = await Client.create({ name: extractedData.clientName, userId });
      }
      invoice.clientId = client.id;
    } else {
      missingFields.push('clientName');
    }

    await invoice.save();

    // Return the invoice details (including clientId) along with any missing fields.
    return res.json({
      message: missingFields.length > 0
        ? 'Upload successful, but some details are missing.'
        : 'Upload successful',
      invoiceId: invoice.id,
      pdfUrl: s3Url,
      totalAmount: invoice.totalAmount,
      dueDate: invoice.dueDate,
      clientName: extractedData.clientName || null,
      clientId: invoice.clientId || null,
      missingFields: missingFields
    });
  } catch (error) {
    console.error('❌ Error uploading invoice:', error);
    return res.status(500).json({ error: 'Upload failed', details: error });
  }
}

module.exports = {
  upload: upload.single('file'),
  uploadInvoice: uploadInvoice
};
