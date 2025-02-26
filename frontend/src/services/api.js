// src/services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (
      !config.url.includes('/auth/login') &&
      !config.url.includes('/auth/register') &&
      !config.url.includes('/auth/forgot-password') &&
      !config.url.includes('/auth/confirm-forgot-password') &&
      !config.url.includes('/auth/confirm')
    ) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------- AUTH ROUTES ------------- */
export const register = async (userData) => {
  const response = await apiClient.post('/auth/register', userData);
  return response.data;
};

export const confirmAccount = async (confirmationData) => {
  const response = await apiClient.post('/auth/confirm', confirmationData);
  return response.data;
};

export const login = async (credentials) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const confirmForgotPassword = async (email, code, newPassword) => {
  const response = await apiClient.post('/auth/confirm-forgot-password', { email, code, newPassword });
  return response.data;
};

/* ------------- INVOICE ROUTES ------------- */
export const getAllInvoices = async () => {
  const response = await apiClient.get('/invoices');
  return response.data;
};

export const createInvoice = async (invoiceData) => {
  const response = await apiClient.post('/invoices', invoiceData);
  return response.data;
};

export const getInvoiceOverview = async () => {
  const response = await apiClient.get('/invoices/overview');
  return response.data;
};

export const getInvoiceReport = async () => {
  const response = await apiClient.get('/invoices/report');
  return response.data;
};

export const sendInvoice = async (invoiceId, payload = {}) => {
  const response = await apiClient.post(`/invoices/${invoiceId}/send`, payload);
  return response.data;
};

export const getInvoiceById = async (invoiceId) => {
  const response = await apiClient.get(`/invoices/${invoiceId}`);
  return response.data;
};

export const updateInvoice = async (invoiceId, invoiceData) => {
  const response = await apiClient.put(`/invoices/${invoiceId}`, invoiceData);
  return response.data;
};

export const deleteInvoice = async (invoiceId) => {
  const response = await apiClient.delete(`/invoices/${invoiceId}`);
  return response.data;
};

/* ------------- PAYMENT ROUTES ------------- */
export const payInvoice = async (invoiceId, paymentData = {}) => {
  const response = await apiClient.post(`/invoices/${invoiceId}/pay`, paymentData);
  return response.data;
};

export const getPayments = async () => {
  const response = await apiClient.get('/payments');
  return response.data;
};

export const getPaymentById = async (paymentId) => {
  const response = await apiClient.get(`/payments/${paymentId}`);
  return response.data;
};

/* ------------- BANK INTEGRATIONS ------------- */
export const getBankAccounts = async () => {
  const response = await apiClient.get('/bank-accounts');
  return response.data;
};

export const connectBankAccount = async (bankData) => {
  const response = await apiClient.post('/bank-accounts', bankData);
  return response.data;
};

export const getBankTransactions = async () => {
  const response = await apiClient.get('/bank-transactions');
  return response.data;
};

/* ------------- SUBSCRIPTIONS ------------- */
export const getSubscriptions = async () => {
  const response = await apiClient.get('/subscriptions');
  return response.data;
};

export const createSubscription = async (subData) => {
  const response = await apiClient.post('/subscriptions', subData);
  return response.data;
};

export const updateSubscription = async (subId, subData) => {
  const response = await apiClient.put(`/subscriptions/${subId}`, subData);
  return response.data;
};

export const deleteSubscription = async (subId) => {
  const response = await apiClient.delete(`/subscriptions/${subId}`);
  return response.data;
};

/* ------------- USER ROUTES ------------- */
export const getMe = async () => {
  const response = await apiClient.get('/users/me');
  return response.data;
};

export const updateMe = async (userData) => {
  const response = await apiClient.put('/users/me', userData);
  return response.data;
};

/* ------------- NOTIFICATIONS ------------- */
export const getNotifications = async () => {
  const response = await apiClient.get('/notifications');
  return response.data;
};

export const markNotificationsRead = async (readData = {}) => {
  const response = await apiClient.post('/notifications/read', readData);
  return response.data;
};

/* ------------- SETTINGS ------------- */
export const getSettings = async () => {
  const response = await apiClient.get('/settings');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await apiClient.put('/settings', settingsData);
  return response.data;
};

/* ------------- REPORTS ------------- */
export const getReports = async () => {
  const response = await apiClient.get('/reports');
  return response.data;
};

/* ------------- AUDIT LOGS ------------- */
export const getAuditLogs = async () => {
  const response = await apiClient.get('/audit-logs');
  return response.data;
};

/* ------------- FILE UPLOAD ------------- */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/uploads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/* ------------- ADMIN ROUTES ------------- */
export const getAllUsers = async () => {
  const response = await apiClient.get('/admin/users');
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await apiClient.put(`/admin/users/${userId}`, userData);
  return response.data;
};
