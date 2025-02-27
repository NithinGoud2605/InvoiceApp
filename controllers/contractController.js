// controllers/contractController.js
const { Contract } = require('../models'); // Make sure this references your new Contract model

// Get all contracts for the authenticated user
exports.getContracts = async (req, res) => {
  try {
    const userId = req.user.sub; // assuming your auth middleware sets req.user.sub
    const contracts = await Contract.findAll({ where: { userId } });
    return res.json({ contracts });
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Create a new contract
exports.createContract = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { clientId, planName, startDate, endDate, billingCycle, autoRenew } = req.body;

    const contract = await Contract.create({
      userId,
      clientId,
      planName,
      startDate,
      endDate,
      billingCycle,
      autoRenew,
      status: 'ACTIVE'
    });

    return res.status(201).json(contract);
  } catch (error) {
    console.error("Error creating contract:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Update an existing contract
exports.updateContract = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const { planName, startDate, endDate, billingCycle, autoRenew, status } = req.body;

    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (planName !== undefined) contract.planName = planName;
    if (startDate !== undefined) contract.startDate = startDate;
    if (endDate !== undefined) contract.endDate = endDate;
    if (billingCycle !== undefined) contract.billingCycle = billingCycle;
    if (autoRenew !== undefined) contract.autoRenew = autoRenew;
    if (status !== undefined) contract.status = status;

    await contract.save();
    return res.json(contract);
  } catch (error) {
    console.error("Error updating contract:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Cancel a contract
exports.cancelContract = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    contract.status = 'CANCELLED';
    await contract.save();
    return res.json({ message: `Contract ${id} has been cancelled.` });
  } catch (error) {
    console.error("Error cancelling contract:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Renew a contract
exports.renewContract = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const { newEndDate } = req.body; // Expect a new end date as part of renewal
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    if (newEndDate) {
      contract.endDate = newEndDate;
    }
    contract.status = 'ACTIVE';
    await contract.save();
    return res.json({ message: `Contract ${id} renewed successfully.`, contract });
  } catch (error) {
    console.error("Error renewing contract:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// Send contract for e-signature (optional)
exports.sendForSignature = async (req, res) => {
  try {
    const userId = req.user.sub;
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id, userId } });
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Placeholder: Integrate with an e-signature provider (e.g., DocuSign, HelloSign)
    return res.json({ message: `Contract ${id} sent for e-signature.` });
  } catch (error) {
    console.error("Error sending contract for signature:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
