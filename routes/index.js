const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const invoiceController = require('../controllers/invoiceController');
const paymentController = require('../controllers/paymentController');
const bankController = require('../controllers/bankController');
const contractController = require('../controllers/contractController');
const userController = require('../controllers/userController');
const notificationController = require('../controllers/notificationController');
const settingsController = require('../controllers/settingsController');
const reportController = require('../controllers/reportController');
const auditLogController = require('../controllers/auditLogController');
const uploadController = require('../controllers/uploadController');
const webhookController = require('../controllers/webhookController');
const adminController = require('../controllers/adminController');
const authCallbackController = require('../controllers/authCallbackController');
const expenseController = require('../controllers/expenseController');
const clientController = require('../controllers/clientController');

// Multer setup for file uploads
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// **Auth Routes**
router.post('/auth/register', authController.register);
router.post('/auth/confirm', authController.confirm);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
router.post('/auth/forgot-password', authController.forgotPassword);
router.post('/auth/confirm-forgot-password', authController.confirmForgotPassword);

// **Protected Invoice Routes**
router.get('/invoices', requireAuth, invoiceController.getAllInvoices);
router.post('/invoices', requireAuth, invoiceController.createInvoice);
router.get('/invoices/overview', requireAuth, invoiceController.getOverview);
router.get('/invoices/report', requireAuth, invoiceController.report);
router.post('/invoices/:id/send', requireAuth, invoiceController.sendInvoice);
router.get('/invoices/:id', requireAuth, invoiceController.getInvoiceById);
router.put('/invoices/:id', requireAuth, invoiceController.updateInvoice);
router.delete('/invoices/:id', requireAuth, invoiceController.deleteInvoice);
router.get('/invoices/aggregated', requireAuth, invoiceController.getAggregatedInvoices);
router.get('/invoices/:id/pdf', requireAuth, invoiceController.getInvoicePdf);

// **Protected Payment Routes**
router.post('/invoices/:id/pay', requireAuth, paymentController.payInvoice);
router.get('/payments', requireAuth, paymentController.getPayments);
router.get('/payments/:id', requireAuth, paymentController.getPaymentById);

// **Protected Expense Routes**
router.get('/expenses', requireAuth, expenseController.getAllExpenses);
router.get('/expenses/total', requireAuth, expenseController.getTotalExpenses);
router.get('/expenses/aggregated', requireAuth, expenseController.getAggregatedExpenses);
router.post('/expenses', requireAuth, expenseController.createExpense);
router.put('/expenses/:id', requireAuth, expenseController.updateExpense);
router.delete('/expenses/:id', requireAuth, expenseController.deleteExpense);

// **Protected Bank Integration Routes**
router.get('/bank-accounts', requireAuth, bankController.getBankAccounts);
router.post('/bank-accounts', requireAuth, bankController.connectBankAccount);
router.get('/bank-transactions', requireAuth, bankController.getBankTransactions);

// **Protected Contract Routes**
// routes/index.js
router.get('/contracts', requireAuth, contractController.getContracts);
router.post('/contracts', requireAuth, contractController.createContract);
router.put('/contracts/:id', requireAuth, contractController.updateContract);
router.post('/contracts/:id/cancel', requireAuth, contractController.cancelContract);
router.post('/contracts/:id/renew', requireAuth, contractController.renewContract);
router.post('/contracts/:id/send-for-signature', requireAuth, contractController.sendForSignature);
router.post('/contracts/upload', requireAuth, contractController.upload, contractController.uploadContract);
// Protected Contract Routes
router.get('/contracts/:id/pdf', requireAuth, contractController.getContractPdf);



// **Protected Client Routes**
router.get('/clients', requireAuth, clientController.getClients);
router.post('/clients', requireAuth, clientController.createClient);
router.put('/clients/:id', requireAuth, clientController.updateClient);
router.delete('/clients/:id', requireAuth, clientController.deleteClient);

// **Protected User Routes**
router.get('/users/me', requireAuth, userController.getMe);
router.put('/users/me', requireAuth, userController.updateMe);

// **Protected Notification Routes**
router.get('/notifications', requireAuth, notificationController.getNotifications);
router.post('/notifications/read', requireAuth, notificationController.markNotificationsRead);

// **Protected Settings Routes**
router.get('/settings', requireAuth, settingsController.getSettings);
router.put('/settings', requireAuth, settingsController.updateSettings);

// **Protected Report Routes**
router.get('/reports', requireAuth, reportController.getReports);

// **Protected Audit Log Routes**
router.get('/audit-logs', requireAuth, auditLogController.getAuditLogs);

// **Protected File Upload Route for Invoices**
router.post('/invoices/upload', requireAuth, uploadController.upload, uploadController.uploadInvoice);

// **Public Webhook Route** (or protect it based on your design)
router.post('/webhooks', webhookController.handleWebhook);

// **Protected Admin Routes**
router.get('/admin/users', requireAuth, adminController.getAllUsers);
router.put('/admin/users/:id', requireAuth, adminController.updateUser);

module.exports = router;