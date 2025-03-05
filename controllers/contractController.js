const { Contract, Client } = require('../models');
const multer = require('multer');
const AWS = require('aws-sdk');
const { uploadToS3, getPreSignedUrl } = require('../utils/s3Uploader');

// Configure AWS SDK with "nithin" profile credentials and region
AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'nithin' });
AWS.config.update({ region: process.env.AWS_REGION || 'us-east-1' });

const textract = new AWS.Textract();

// Multer configuration for memory storage (used for PDF uploads)
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Extracts contract data from a PDF using AWS Textract.
 * @param {Buffer} fileBuffer - The buffer of the uploaded PDF file.
 * @returns {Object} - Extracted contract data (planName, startDate, endDate, billingCycle, autoRenew).
 */
async function extractContractData(fileBuffer) {
  const params = {
    Document: { Bytes: fileBuffer },
    FeatureTypes: ['FORMS'],
  };

  try {
    const result = await textract.analyzeDocument(params).promise();
    const blocks = result.Blocks;
    let blockMap = {};
    let keyMap = {};
    let valueMap = {};

    // Index blocks by ID and separate keys and values
    blocks.forEach((block) => {
      blockMap[block.Id] = block;
      if (block.BlockType === 'KEY_VALUE_SET') {
        if (block.EntityTypes && block.EntityTypes.includes('KEY')) {
          keyMap[block.Id] = block;
        } else {
          valueMap[block.Id] = block;
        }
      }
    });

    // Helper function to extract text from a block via CHILD relationships
    const getText = (block) => {
      let text = '';
      if (block.Relationships) {
        block.Relationships.forEach((relationship) => {
          if (relationship.Type === 'CHILD') {
            relationship.Ids.forEach((childId) => {
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

    // Build contract data by matching keys to values
    let contractData = {};
    Object.values(keyMap).forEach((keyBlock) => {
      let keyText = getText(keyBlock).toLowerCase();
      if (keyBlock.Relationships) {
        keyBlock.Relationships.forEach((relationship) => {
          if (relationship.Type === 'VALUE') {
            relationship.Ids.forEach((valueId) => {
              const valueBlock = valueMap[valueId];
              if (valueBlock) {
                contractData[keyText] = getText(valueBlock);
              }
            });
          }
        });
      }
    });

    // Extract specific fields (adjust based on your PDF format)
    return {
      planName: contractData['plan name'] || null,
      startDate: contractData['start date'] || null,
      endDate: contractData['end date'] || null,
      billingCycle: contractData['billing cycle'] || null,
      autoRenew: contractData['auto renew'] === 'true' ? true : false,
      clientName: contractData['client name'] || null,
    };
  } catch (error) {
    console.error('Textract extraction error:', error);
    throw error;
  }
}

/**
 * Handles the upload of a contract PDF, extracts data, and saves it to the database.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
async function uploadContract(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Step 1: Create initial contract record with default values
    let contract = await Contract.create({
      userId,
      status: 'DRAFT',
      planName: '',
      startDate: new Date(),
      endDate: null,
      billingCycle: null,
      autoRenew: false,
      pdfUrl: null,
    });

    // Step 2: Upload to S3
    let s3Url;
    try {
      const fileKey = `contracts/${contract.id}.pdf`;
      s3Url = await uploadToS3(req.file.buffer, fileKey);
      contract.pdfUrl = s3Url;
    } catch (s3Error) {
      console.error('S3 upload error in contract upload:', s3Error);
      throw new Error('S3 upload failed in contract upload');
    }

    // Step 3: Extract data from PDF using AWS Textract
    let extractedData;
    try {
      extractedData = await extractContractData(req.file.buffer);
    } catch (textractError) {
      console.error('Textract extraction error:', textractError);
      throw new Error('Textract extraction failed');
    }

    const missingFields = [];

    if (extractedData.planName) contract.planName = extractedData.planName;
    else missingFields.push('planName');

    if (extractedData.startDate) {
      const parsedStartDate = new Date(extractedData.startDate);
      if (!isNaN(parsedStartDate.getTime())) contract.startDate = parsedStartDate;
      else missingFields.push('startDate');
    } else missingFields.push('startDate');

    if (extractedData.endDate) {
      const parsedEndDate = new Date(extractedData.endDate);
      if (!isNaN(parsedEndDate.getTime())) contract.endDate = parsedEndDate;
      else missingFields.push('endDate');
    }

    if (extractedData.billingCycle) contract.billingCycle = extractedData.billingCycle;
    contract.autoRenew = extractedData.autoRenew;

    if (extractedData.clientName) {
      let client = await Client.findOne({ where: { name: extractedData.clientName, userId } });
      if (!client) client = await Client.create({ name: extractedData.clientName, userId });
      contract.clientId = client.id;
    } else {
      missingFields.push('clientName');
    }

    await contract.save();

    return res.json({
      message: missingFields.length > 0
        ? 'Upload successful, but some details are missing.'
        : 'Upload successful',
      contractId: contract.id,
      pdfUrl: s3Url,
      planName: contract.planName,
      startDate: contract.startDate,
      endDate: contract.endDate,
      billingCycle: contract.billingCycle,
      autoRenew: contract.autoRenew,
      clientName: extractedData.clientName || null,
      clientId: contract.clientId || null,
      missingFields,
    });
  } catch (error) {
    console.error('Error uploading contract:', error);
    return res.status(500).json({ error: 'Upload failed', details: error.message });
  }
}


/**
 * Retrieves all contracts for the authenticated user.
 */
async function getContracts(req, res) {
  try {
    const userId = req.user.id; // use req.user.id now
    const contracts = await Contract.findAll({ where: { userId } });
    return res.json({ contracts });
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * Creates a new contract manually.
 */
async function createContract(req, res) {
  try {
    const userId = req.user.id;
    const { clientId, planName, startDate, endDate, billingCycle, autoRenew } = req.body;

    let contract = await Contract.create({
      userId,
      status: 'TRIAL',
      planName: '',
      startDate: new Date(),
      endDate: null,
      billingCycle: null,
      autoRenew: false,
      pdfUrl: null,
    });
    
    return res.status(201).json(contract);
  } catch (error) {
    console.error('Error creating contract:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


/**
 * Updates an existing contract.
 */
async function updateContract(req, res) {
  try {
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const { planName, startDate, endDate, billingCycle, autoRenew, status, clientId } = req.body;

    // Fetch the contract
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Update fields if they are provided. For date fields and enums,
    // check for empty strings and set to null.
    if (planName !== undefined) contract.planName = planName;
    if (startDate !== undefined) {
      contract.startDate = startDate ? new Date(startDate) : null;
    }
    if (endDate !== undefined) {
      contract.endDate = endDate ? new Date(endDate) : null;
    }
    if (billingCycle !== undefined) {
      contract.billingCycle = billingCycle !== "" ? billingCycle : null;
    }
    if (autoRenew !== undefined) contract.autoRenew = autoRenew;
    if (status !== undefined) contract.status = status;
    if (clientId !== undefined) contract.clientId = clientId;

    // Save updated contract
    await contract.save();
    return res.json(contract);
  } catch (error) {
    console.error('Error updating contract:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


/**
 * Retrieves a pre-signed URL for a contract PDF.
 */
async function getContractPdf(req, res) {
  try {
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, userId } });
    console.log("Contract in getContractPdf:", contract);
    
    if (!contract || !contract.pdfUrl || contract.pdfUrl.trim() === "") {
      return res.status(404).json({ error: 'Contract or PDF not found' });
    }
    
    let preSignedUrl;
    if (contract.pdfUrl.startsWith('http')) {
      preSignedUrl = contract.pdfUrl;
    } else {
      preSignedUrl = getPreSignedUrl(contract.pdfUrl, 300); // valid for 5 minutes
    }
    return res.json({ url: preSignedUrl });
  } catch (error) {
    console.error("Error fetching contract PDF:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}




/**
 * Cancels an existing contract.
 */
async function cancelContract(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    contract.status = 'CANCELLED';
    await contract.save();
    return res.json({ message: `Contract ${id} has been cancelled.` });
  } catch (error) {
    console.error('Error cancelling contract:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Renews an existing contract with a new end date.
 */
async function renewContract(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { newEndDate } = req.body;
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    if (newEndDate) contract.endDate = newEndDate;
    contract.status = 'ACTIVE';
    await contract.save();
    return res.json({ message: `Contract ${id} renewed successfully.`, contract });
  } catch (error) {
    console.error('Error renewing contract:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Sends a contract for e-signature (placeholder).
 */
async function sendForSignature(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    // Placeholder for e-signature integration (e.g., DocuSign)
    return res.json({ message: `Contract ${id} sent for e-signature.` });
  } catch (error) {
    console.error('Error sending contract for signature:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Export all functions with explicit key-value pairs
module.exports = {
  upload: multer().single('file'),
  uploadContract,
  getContracts,
  createContract,
  updateContract,
  cancelContract,
  renewContract,
  sendForSignature,
  getContractPdf, // <-- Add this line
};
