import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🚀 Interceptor to Add Authorization Header Automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && !config.url.includes('/auth')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// In your services/api.js file
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.warn('⚠️ Unauthorized! Please sign in.');
      // Optionally remove the token if you want:
      // localStorage.removeItem('token');
      // Do NOT redirect automatically:
      // window.location.href = '/sign-in';
    }
    
    return Promise.reject(error.response?.data || error);
  }
);


// 🔄 Helper Function for Requests
const apiRequest = async (method, url, data = null, config = {}) => {
  try {
    const response = await apiClient[method](url, data, config);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/* ------------- AUTH ROUTES ------------- */
export const register = (userData) => apiRequest('post', '/auth/register', userData);
export const confirmAccount = (confirmationData) => apiRequest('post', '/auth/confirm', confirmationData);
export const login = (credentials) => apiRequest('post', '/auth/login', credentials);
export const logout = () => apiRequest('post', '/auth/logout');
export const forgotPassword = (email) => apiRequest('post', '/auth/forgot-password', { email });
export const confirmForgotPassword = (email, code, newPassword) =>
  apiRequest('post', '/auth/confirm-forgot-password', { email, code, newPassword });

/* ------------- INVOICE ROUTES ------------- */
export const getAllInvoices = () => apiRequest('get', '/invoices');
export const createInvoice = (invoiceData) => apiRequest('post', '/invoices', invoiceData);
export const getInvoiceOverview = () => apiRequest('get', '/invoices/overview');
export const getInvoiceReport = () => apiRequest('get', '/invoices/report');
export const sendInvoice = (invoiceId, payload = {}) => apiRequest('post', `/invoices/${invoiceId}/send`, payload);
export const getInvoiceById = (invoiceId) => apiRequest('get', `/invoices/${invoiceId}`);
export const updateInvoice = (invoiceId, invoiceData) => apiRequest('put', `/invoices/${invoiceId}`, invoiceData);
export const deleteInvoice = (invoiceId) => apiRequest('delete', `/invoices/${invoiceId}`);

/* ------------- INVOICE PDF ROUTE ------------- */
export const getInvoicePdf = async (invoiceId) => {
  try {
    const response = await apiClient.get(`/invoices/${invoiceId}/pdf`);
    console.log("✅ Pre-Signed URL Received:", response.data.url);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching PDF:", error);
    throw error;
  }
};

/* ------------- EXPENSE ROUTES ------------- */
export const getAllExpenses = () => apiRequest('get', '/expenses');
export const getExpenseTotal = () => apiRequest('get', '/expenses/total');
export const getAggregatedExpenses = () => apiRequest('get', '/expenses/aggregated');
export const createExpense = (expenseData) => apiRequest('post', '/expenses', expenseData);
export const updateExpense = (expenseId, expenseData) =>
  apiRequest('put', `/expenses/${expenseId}`, expenseData);
export const deleteExpense = (expenseId) => apiRequest('delete', `/expenses/${expenseId}`);

/* ------------- PAYMENT ROUTES ------------- */
export const payInvoice = (invoiceId, paymentData = {}) => apiRequest('post', `/invoices/${invoiceId}/pay`, paymentData);
export const getPayments = () => apiRequest('get', '/payments');
export const getPaymentById = (paymentId) => apiRequest('get', `/payments/${paymentId}`);

/* ------------- BANK INTEGRATIONS ------------- */
export const getBankAccounts = () => apiRequest('get', '/bank-accounts');
export const connectBankAccount = (bankData) => apiRequest('post', '/bank-accounts', bankData);
export const getBankTransactions = () => apiRequest('get', '/bank-transactions');

/* ------------- USER ROUTES ------------- */
export const getMe = () => apiRequest('get', '/users/me');
export const updateMe = (userData) => apiRequest('put', '/users/me', userData);

/* ------------- FILE UPLOAD ------------- */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest('post', '/invoices/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/* ------------- NOTIFICATIONS ------------- */
export const getNotifications = () => apiRequest('get', '/notifications');
export const markNotificationsRead = (readData = {}) => apiRequest('post', '/notifications/read', readData);

/* ------------- SETTINGS ------------- */
export const getSettings = () => apiRequest('get', '/settings');
export const updateSettings = (settingsData) => apiRequest('put', '/settings', settingsData);

/* ------------- ADMIN ROUTES ------------- */
export const getAllUsers = () => apiRequest('get', '/admin/users');
export const updateUser = (userId, userData) => apiRequest('put', `/admin/users/${userId}`, userData);

/* ------------- CLIENT ROUTES ------------- */
export const getAllClients = () => apiRequest('get', '/clients');
export const createClient = (clientData) => apiRequest('post', '/clients', clientData);
