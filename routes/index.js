// routes/index.js
const express = require('express');
const router = express.Router();

const { requireAuth } = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');
const invoiceController = require('../controllers/invoiceController');
const paymentController = require('../controllers/paymentController');
const bankController = require('../controllers/bankController');
const subscriptionController = require('../controllers/subscriptionController');
const userController = require('../controllers/userController');
const notificationController = require('../controllers/notificationController');
const settingsController = require('../controllers/settingsController');
const reportController = require('../controllers/reportController');
const auditLogController = require('../controllers/auditLogController');
const uploadController = require('../controllers/uploadController');
const webhookController = require('../controllers/webhookController');
const adminController = require('../controllers/adminController');

// Auth Routes
router.post('/auth/register', authController.register);
router.post('/auth/confirm', authController.confirm);
router.post('/auth/login', authController.login);
router.post('/auth/logout', authController.logout);
// If you implement refresh, uncomment below; otherwise, comment it out:
// router.get('/auth/refresh', authController.refresh);

// Invoice Routes (protected)
router.get('/invoices', requireAuth, invoiceController.getAllInvoices);
router.post('/invoices', requireAuth, invoiceController.createInvoice);
router.get('/invoices/overview', requireAuth, invoiceController.getOverview);
router.get('/invoices/report', requireAuth, invoiceController.report);
router.post('/invoices/:id/send', requireAuth, invoiceController.sendInvoice);
router.get('/invoices/:id', requireAuth, invoiceController.getInvoiceById);
router.put('/invoices/:id', requireAuth, invoiceController.updateInvoice);
router.delete('/invoices/:id', requireAuth, invoiceController.deleteInvoice);

// Payments (protected)
router.post('/invoices/:id/pay', requireAuth, paymentController.payInvoice);
router.get('/payments', requireAuth, paymentController.getPayments);
router.get('/payments/:id', requireAuth, paymentController.getPaymentById);

// Bank Integrations (protected)
router.get('/bank-accounts', requireAuth, bankController.getBankAccounts);
router.post('/bank-accounts', requireAuth, bankController.connectBankAccount);
router.get('/bank-transactions', requireAuth, bankController.getBankTransactions);

// Subscriptions (protected)
router.get('/subscriptions', requireAuth, subscriptionController.getSubscriptions);
router.post('/subscriptions', requireAuth, subscriptionController.createSubscription);
router.put('/subscriptions/:id', requireAuth, subscriptionController.updateSubscription);
router.delete('/subscriptions/:id', requireAuth, subscriptionController.deleteSubscription);

// User (protected)
router.get('/users/me', requireAuth, userController.getMe);
router.put('/users/me', requireAuth, userController.updateMe);

// Notifications (protected)
router.get('/notifications', requireAuth, notificationController.getNotifications);
router.post('/notifications/read', requireAuth, notificationController.markNotificationsRead);

// Settings (protected)
router.get('/settings', requireAuth, settingsController.getSettings);
router.put('/settings', requireAuth, settingsController.updateSettings);

// Reports (protected)
router.get('/reports', requireAuth, reportController.getReports);

// Audit Logs (protected)
router.get('/audit-logs', requireAuth, auditLogController.getAuditLogs);

// File Upload (protected)
router.post('/uploads', requireAuth, uploadController.uploadFile);

// Webhooks (public or protected depending on your design)
router.post('/webhooks', webhookController.handleWebhook);

// Admin (protected + admin check)
router.get('/admin/users', requireAuth, adminController.getAllUsers);
router.put('/admin/users/:id', requireAuth, adminController.updateUser);

module.exports = router;
