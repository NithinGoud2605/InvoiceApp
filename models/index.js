// models/index.js
const sequelize = require('../config/sequelize');

const UserModel = require('./User');
const InvoiceModel = require('./Invoice');
const PaymentModel = require('./Payment');
const SubscriptionModel = require('./Subscription');
const BankAccountModel = require('./BankAccount');
const NotificationModel = require('./Notification');
const ExpenseModel = require('./Expense');           // Added Expense model
const ClientModel = require('./Client');             // Added Client model
const ContractModel = require('./Contract');         // Added Contract model
const InvoiceLineItemModel = require('./InvoiceLineItem'); // Added InvoiceLineItem model

// Initialize models
const User = UserModel(sequelize);
const Invoice = InvoiceModel(sequelize);
const Payment = PaymentModel(sequelize);
const Subscription = SubscriptionModel(sequelize);
const BankAccount = BankAccountModel(sequelize);
const Notification = NotificationModel(sequelize);
const Expense = ExpenseModel(sequelize);             // Initialize Expense
const Client = ClientModel(sequelize);               // Initialize Client
const Contract = ContractModel(sequelize);           // Initialize Contract
const InvoiceLineItem = InvoiceLineItemModel(sequelize); // Initialize InvoiceLineItem

// Define associations in a separate function
const defineAssociations = () => {
  // User and Invoice
  User.hasMany(Invoice, { foreignKey: 'userId' });
  Invoice.belongsTo(User, { foreignKey: 'userId' });

  // User and Payment
  User.hasMany(Payment, { foreignKey: 'userId' });
  Payment.belongsTo(User, { foreignKey: 'userId' });

  // Invoice and Payment
  Invoice.hasMany(Payment, { foreignKey: 'invoiceId' });
  Payment.belongsTo(Invoice, { foreignKey: 'invoiceId' });

  // User and Subscription
  User.hasMany(Subscription, { foreignKey: 'userId' });
  Subscription.belongsTo(User, { foreignKey: 'userId' });

  // User and BankAccount
  User.hasMany(BankAccount, { foreignKey: 'userId' });
  BankAccount.belongsTo(User, { foreignKey: 'userId' });

  // User and Notification
  User.hasMany(Notification, { foreignKey: 'userId' });
  Notification.belongsTo(User, { foreignKey: 'userId' });

  // User and Expense
  User.hasMany(Expense, { foreignKey: 'userId' });
  Expense.belongsTo(User, { foreignKey: 'userId' });

  // User and Client
  User.hasMany(Client, { foreignKey: 'userId' });
  Client.belongsTo(User, { foreignKey: 'userId' });

  // Contracts: associate with User and Client
  User.hasMany(Contract, { foreignKey: 'userId' });
  Contract.belongsTo(User, { foreignKey: 'userId' });
  Client.hasMany(Contract, { foreignKey: 'clientId' });
  Contract.belongsTo(Client, { foreignKey: 'clientId' });

  // Invoice and InvoiceLineItem
  Invoice.hasMany(InvoiceLineItem, { foreignKey: 'invoiceId' });
  InvoiceLineItem.belongsTo(Invoice, { foreignKey: 'invoiceId' });
};

// Export models and associations
module.exports = {
  sequelize,
  User,
  Invoice,
  Payment,
  Subscription,
  BankAccount,
  Notification,
  Expense,
  Client,
  Contract,
  InvoiceLineItem,
  defineAssociations
};

// Call associations after export
defineAssociations();
