// controllers/clientController.js
const { Client } = require('../models');

/**
 * Get all clients for the authenticated user.
 */
exports.getClients = async (req, res) => {
  try {
    // Use req.user.sub (if using Cognito) or req.user.id
    const userId = req.user.sub || req.user.id;
    const clients = await Client.findAll({ where: { userId } });
    return res.json({ clients });
  } catch (error) {
    console.error("Error fetching clients:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new client for the authenticated user.
 */
exports.createClient = async (req, res) => {
  try {
    const userId = req.user.sub || req.user.id;
    const { name, email, phone, address } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Client name is required" });
    }
    const client = await Client.create({ userId, name, email, phone, address });
    return res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update an existing client for the authenticated user.
 */
exports.updateClient = async (req, res) => {
  try {
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const { name, email, phone, address } = req.body;
    const client = await Client.findOne({ where: { id, userId } });
    if (!client) return res.status(404).json({ error: "Client not found" });

    if (name) client.name = name;
    if (email) client.email = email;
    if (phone) client.phone = phone;
    if (address) client.address = address;
    
    await client.save();
    return res.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a client for the authenticated user.
 */
exports.deleteClient = async (req, res) => {
  try {
    const userId = req.user.sub || req.user.id;
    const { id } = req.params;
    const client = await Client.findOne({ where: { id, userId } });
    if (!client) return res.status(404).json({ error: "Client not found" });

    await client.destroy();
    return res.json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error deleting client:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
